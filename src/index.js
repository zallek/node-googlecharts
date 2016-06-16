const jsdom = require('jsdom');
const fs = require('fs');
const path = require('path');
const markup = fs.readFileSync(path.join(__dirname, 'markup.html'), 'utf8');


function createGoogleChartWindow() {
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
          resolve(window);
        }
      },
    });
  });
}

function renderChart(window, options) {
  return new Promise((resolve, reject) => {
    const chartOptions = options.chartOptions;
    chartOptions.containerId = 'vis_div';
    const wrapper = new window.google.visualization.ChartWrapper(chartOptions);
    window.google.visualization.events.addListener(wrapper, 'ready', () => {
      resolve('done');
    });
    wrapper.draw();
  });
}


/**
 * Render a Google Chart to a png image
 * @param  {options.width} Number
 * @param  {options.height} Number
 * @param  {options.chartOptions} Object Google ChartWrapper options
 * @return {Promise}
 */
function render(options) {
  return createGoogleChartWindow()
    .then(window => renderChart(window, options))
}

module.exports = render;
