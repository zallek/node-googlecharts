const jsdom = require('jsdom');
const fs = require('fs');
const path = require('path');
const markup = fs.readFileSync(path.join(__dirname, 'markup.html'), 'utf8');


function createGoogleChartWindow(args) {
  return new Promise((resolve, reject) => {
    jsdom.env({
      html: markup,
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
    const wrapper = new args.window.google.visualization.ChartWrapper(args.options.chartOptions);
    args.window.google.visualization.events.addListener(wrapper, 'ready', () => {
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
 * @param  {options.width} Number
 * @param  {options.height} Number
 * @param  {options.chartOptions} Object Google ChartWrapper options
 * @return {Promise}
 */
function render(options) {
  options.chartOptions.containerId = 'vis_div';
  return createGoogleChartWindow({ options })
    .then(renderChart)
    .then(extractSVG)
}

module.exports = render;
