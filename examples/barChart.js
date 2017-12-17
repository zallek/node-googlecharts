const nodeGoogleCharts = require('../src');

//
// Google bar charts are rendered in the browser using SVG or VML, whichever is
// appropriate for the user's browser. Like all Google charts, bar charts
// display tooltips when the user hovers over the data. For a vertical version
// of this chart, see the column chart.
//
// https://developers.google.com/chart/interactive/docs/gallery/barchart
//

nodeGoogleCharts({
  chartType: 'BarChart',
  dataTable: [
    ['City', '2010 Population', '2000 Population'],
    ['New York City, NY', 8175000, 8008000],
    ['Los Angeles, CA', 3792000, 3694000],
    ['Chicago, IL', 2695000, 2896000],
    ['Houston, TX', 2099000, 1953000],
    ['Philadelphia, PA', 1526000, 1517000]
  ],
  options: {
    title: 'Population of Largest U.S. Cities',
    chartArea: {
      width: '50%'
    },
    colors: ['#b0120a', '#ffab91'],
    hAxis: {
      title: 'Total Population',
      minValue: 0
    },
    vAxis: {
      title: 'City'
    }
  }
})
.then(console.log)
.catch(console.error);
