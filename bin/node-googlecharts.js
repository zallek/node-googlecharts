const nodeGoogleCharts = require('../src');


const options = JSON.parse(process.argv[2]);

nodeGoogleCharts(options)
.then(console.log)
.catch(console.error);
