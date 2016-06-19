const jsdom = require('jsdom');
const isPlainObject = require('lodash.isplainobject');


/**
* Borrowed from: https://github.com/tmpvar/jsdom/issues/135#issuecomment-68191941
*/
function applyJsdomWorkaround(window) {
  Object.defineProperties(window.HTMLElement.prototype, {
    offsetHeight: {
      configurable: true,
      get: function () {
        return parseFloat(window.getComputedStyle(this).height) || 0;
      }
    },
    offsetWidth: {
      configurable: true,
      get: function () {
        return parseFloat(window.getComputedStyle(this).width) || 0;
      }
    }
  });
}

function createGoogleChartWindow(args) {
  return new Promise((resolve, reject) => {
    jsdom.env({
      html: '<html><body></body></html>',
      scripts: [
        'file:///' + __dirname + '/jsapi.js',
        'file:///' + __dirname + '/google-charts.js',
      ],
      features: {
        FetchExternalResources: ['script'],
        ProcessExternalResources: ['script'],
      },
      // virtualConsole: jsdom.createVirtualConsole().sendTo(console),
      done: (err, window) => {
        if (err) {
          reject(err);
        } else {
          applyJsdomWorkaround(window);
          resolve({
            window,
            chartOptions: args.chartOptions,
            format: args.format,
          });
        }
      },
    });
  }).catch(error =>
    Promise.reject(new Error('[ChartInitError] ' + error.message))
  );
}

function renderChart(args) {
  return new Promise((resolve, reject) => {
    const window = args.window;
    const chartOptions = args.chartOptions;

    // Create container
    const container = window.document.createElement('div');
    container.id = chartOptions.containerId;
    container.setAttribute(
      'style',
      `width:${chartOptions.options.width}px;height:${chartOptions.options.height}px;`
    );
    window.document.body.appendChild(container);

    // Render chart
    const wrapper = new window.google.visualization.ChartWrapper(chartOptions);
    window.google.visualization.events.addListener(wrapper, 'ready', () => {
      resolve(args);
    });
    window.google.visualization.events.addListener(wrapper, 'error', error => {
      reject(error);
    });
    wrapper.draw();
  }).catch(error =>
    Promise.reject(new Error('[RenderingError] ' + error.message))
  );
}

function extractSVG(args) {
  const window = args.window;
  const chartOptions = args.chartOptions;

  return window.document
    .querySelector('#' + chartOptions.containerId + ' svg').outerHTML;
}


/**
 * Render a Google Chart to a png image
 * @param  {chartOptions} Object Google ChartWrapper options
 * @param  {format} String 'svg'
 * @return {Promise}
 */
function render(chartOptions, format) {
  format = format || 'svg';

  if (format !== 'svg') {
    return Promise.reject(new Error('[InputError] unsupported format'));
  }
  if (!isPlainObject(chartOptions)) {
    return Promise.reject(new Error('[InputError] chartOptions should be an object containing Google ChartWrapper options'));
  }

  // Default chartOptions
  chartOptions.containerId = 'vis_div';
  chartOptions.options = chartOptions.options || {};
  chartOptions.options.width = 600;
  chartOptions.options.height = 400;

  return createGoogleChartWindow({ chartOptions, format })
    .then(renderChart)
    .then(extractSVG)
}

module.exports = render;
