const jsdom = require('jsdom');
const isPlainObject = require('lodash.isplainobject');


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
      virtualConsole: jsdom.createVirtualConsole().sendTo(console),
      done: (err, window) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            window,
            options: args.options,
          });
        }
      },
    });
  });
}

function renderChart(args) {
  return new Promise((resolve, reject) => {
    const window = args.window;
    const options = args.options;
    const chartOptions = options.chartOptions;

    // Create container
    const container = window.document.createElement('div');
    container.id = chartOptions.containerId;
    window.document.body.appendChild(container);

    // Render chart
    const wrapper = new window.google.visualization.ChartWrapper(chartOptions);
    window.google.visualization.events.addListener(wrapper, 'ready', () => {
      resolve(args);
    });
    wrapper.draw();
  });
}

function extractSVG(args) {
  return args.window.document
    .querySelector('#' + args.options.chartOptions.containerId + ' svg').outerHTML;
}


/**
 * Render a Google Chart to a png image
 * @param  {options.format} String 'svg'
 * @param  {options.chartOptions} Object Google ChartWrapper options
 * @return {Promise}
 */
function render(options) {
  options.format = options.format || 'svg';

  if (options.format !== 'svg') {
    return Promise.reject(new Error('Unsupported format'));
  }
  if (!isPlainObject(options.chartOptions)) {
    return Promise.reject(new Error('chartOptions should be an object containing Google ChartWrapper options'));
  }

  options.chartOptions.containerId = 'vis_div';
  options.chartOptions.width = 600;
  options.chartOptions.height = 400;

  return createGoogleChartWindow({ options })
    .then(renderChart)
    .then(extractSVG)
}

module.exports = render;
