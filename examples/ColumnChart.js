const nodeGoogleCharts = require('../src');


nodeGoogleCharts({
  chartType: 'ColumnChart',
  dataTable: [
    ['', 'Germany', 'USA', 'Brazil', 'Canada', 'France', 'RU'],
    ['', 700, 300, 400, 500, 600, 800]
  ],
  options: {
    'title': 'Countries',
  },
})
.then(console.log)
.catch(console.error);
