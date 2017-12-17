const nodeGoogleCharts = require('../src');

//
// A column chart is a vertical bar chart rendered in the browser using SVG or
// VML, whichever is appropriate for the user's browser. Like all Google charts,
// column charts display tooltips when the user hovers over the data. For a
// horizontal version of this chart, see the bar chart.
//
// https://developers.google.com/chart/interactive/docs/gallery/columnchart
//

nodeGoogleCharts({
  chartType: 'ColumnChart',
  dataTable: [
    ['', 'Germany', 'USA', 'Brazil', 'Canada', 'France', 'RU'],
    ['', 70, 30, 40, 50, 60, 80]
  ],
  options: {
    title: 'Countries'
  }
})
.then(console.log)
.catch(console.error);
