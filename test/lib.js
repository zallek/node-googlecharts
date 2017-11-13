const fs = require('fs');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const nodeGoogleCharts = require('../src');

chai.use(chaiAsPromised);
const tests = [
  'column-chart',
  'gauge',
];

describe('Lib', () => {
  describe('Generate SVG', () => {
    tests.forEach(testId => {
      const input = require(`./data/${testId}.input`);
      const expectedOutput = getTestData(testId + '.output.svg');
      it('Test ' + testId, () => {
        return chai.expect(nodeGoogleCharts(input).then(svg => svg + '\n')).to.become(expectedOutput);
      });
    });
  });

  describe('Error Handling', () => {
    it('Invalid format', () => {
      return chai.expect(nodeGoogleCharts({}, 'jpeg'))
      .be.rejectedWith(Error, '[InputError] unsupported format');
    });

    it('Invalid chartOptions', () => {
      return chai.expect(nodeGoogleCharts(null))
      .be.rejectedWith(Error, '[InputError] chartOptions should be an object containing Google ChartWrapper options');
    });

    it('Missing data', () => {
      return chai.expect(nodeGoogleCharts({chartType: 'ColumnChart'}))
      .be.rejectedWith(Error, '[InputError] no data specified');
    });

    it('Data not an array', () => {
      return chai.expect(nodeGoogleCharts({chartType: 'ColumnChart', data: 'invalid'}))
      .be.rejectedWith(Error, '[InputError] data must be an array');
    });

    it('Missing chart type', () => {
      return chai.expect(nodeGoogleCharts({data: []}))
      .be.rejectedWith(Error, '[InputError] no chart type specified');
    });

    it('Unsupported chart type', () => {
      return chai.expect(nodeGoogleCharts({chartType: 'invalid', data: []}))
      .be.rejectedWith(Error, '[RenderingError] The chart type is not supported');
    });

    it('Missing chart data', () => {
      return chai.expect(nodeGoogleCharts({chartType: 'ColumnChart'}))
      .be.rejectedWith(Error, '[InputError] no data specified');
    });

    it('Invalid chart data', () => {
      const input = {
        chartType: 'ColumnChart',
        data: [
          ['', 3, 4],
          ['', 700]
        ],
      };
      return chai.expect(nodeGoogleCharts(input))
      .be.rejectedWith(Error, '[RenderingError] Unknown header type: 3');
    });
  });
});


function getTestData(fileName) {
  return fs.readFileSync(path.join(__dirname, `./data/${fileName}`), 'utf-8')
}
