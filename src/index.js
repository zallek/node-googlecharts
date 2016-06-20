const jsdom = require('jsdom');
const isPlainObject = require('lodash.isplainobject');


/**
* offsetWidth && offsetHeight weren't implemented. The implementation is taken from
* https://github.com/tmpvar/jsdom/issues/135#issuecomment-68191941
* clientWidth && clientHeight had the same issue (the implementation is wrong but it's good enough for Google Chart)
*/
function applyJsdomWorkaround(window) {
  Object.defineProperties(window.HTMLElement.prototype, {
    clientHeight: {
      configurable: true,
      get: function () {
        return parseFloat(window.getComputedStyle(this).height) || 0;
      }
    },
    offsetHeight: {
      configurable: true,
      get: function () {
        return parseFloat(window.getComputedStyle(this).height) || 0;
      }
    },
    clientWidth: {
      configurable: true,
      get: function () {
        return parseFloat(window.getComputedStyle(this).width) || 0;
      }
    },
    offsetWidth: {
      configurable: true,
      get: function () {
        return parseFloat(window.getComputedStyle(this).width) || 0;
      }
    },
  });
}

function createGoogleChartWindow(args) {
  return new Promise((resolve, reject) => {
    const baseHtml = (
      `<html><head>
        <script src="file:///${__dirname}/jsapi.js"></script>
        <script src="file:///${__dirname}/google-charts.js"></script>
      </head><body></body></html>`
    );
    const window = jsdom.jsdom(baseHtml, {
      features: {
        FetchExternalResources: ['script'],
        ProcessExternalResources: ['script'],
      },
    }).defaultView;
    window.addEventListener('load', event => {
      applyJsdomWorkaround(window);
      resolve({
        window,
        chartOptions: args.chartOptions,
        format: args.format,
      });
    }, 2000);
    // virtualConsole: jsdom.createVirtualConsole().sendTo(console),
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
  chartOptions.options.width = chartOptions.options.width || 600;
  chartOptions.options.height = chartOptions.options.height || 400;

  return createGoogleChartWindow({ chartOptions, format })
    .then(renderChart)
    .then(extractSVG)
}

module.exports = render;
