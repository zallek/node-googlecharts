const nodeGoogleCharts = require('../src');

//
// An area chart that is rendered within the browser using SVG or VML. Displays
// tips when hovering over points.
//
// https://developers.google.com/chart/interactive/docs/gallery/areachart
//

nodeGoogleCharts({
  chartType: 'AreaChart',
  data: [
    ['Year', 'Sales', 'Expenses'],
    ['2013',  1000,      400],
    ['2014',  1170,      460],
    ['2015',  660,       1120],
    ['2016',  1030,      540]
  ],
  options: {
    title: 'Company Performance',
    hAxis: {
      title: 'Year',
      titleTextStyle: {color: '#333'}
    },
    vAxis: {
      minValue: 0
    }
  }
})
.then(console.log)
.catch(console.error);
