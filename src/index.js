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
            chartOptions: args.chartOptions,
            format: args.format,
          });
        }
      },
    });
  });
}

function renderChart(args) {
  return new Promise((resolve, reject) => {
    const window = args.window;
    const chartOptions = args.chartOptions;

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
    .querySelector('#' + args.chartOptions.containerId + ' svg').outerHTML;
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
    return Promise.reject(new Error('Unsupported format'));
  }
  if (!isPlainObject(chartOptions)) {
    return Promise.reject(new Error('chartOptions should be an object containing Google ChartWrapper options'));
  }

  // Default chartOptions
  chartOptions.containerId = 'vis_div';
  chartOptions.width = 600;
  chartOptions.height = 400;

  return createGoogleChartWindow({ chartOptions, format })
    .then(renderChart)
    .then(extractSVG)
}

module.exports = render;
