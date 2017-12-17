const nodeGoogleCharts = require('../src');

//
// A gauge with a dial, rendered within the browser using SVG or VML.
//
// https://developers.google.com/chart/interactive/docs/gallery/gauge
//

nodeGoogleCharts({
  chartType: 'Gauge',
  dataTable: [
    ['Label', 'Value'],
    ['Memory', 80],
    ['CPU', 55],
    ['Network', 68]
  ],
  options: {
    width: 400, height: 120,
    redFrom: 90, redTo: 100,
    yellowFrom:75, yellowTo: 90,
    minorTicks: 5
  }
})
.then(console.log)
.catch(console.error);
