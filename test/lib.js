const fs = require('fs');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const nodeGoogleCharts = require('../src');


chai.use(chaiAsPromised);
const tests = [
  'column-chart',
];

describe('Lib', () => {
  describe('Generate SVG', () => {
    tests.forEach(testId => {
      const input = require(`./data/${testId}.input`);
      const expectedOutput = getTestData(testId + '.output.svg');
      it('Test ' + testId, () => {
        return chai.expect(nodeGoogleCharts(input)).to.become(expectedOutput);
      });
    });
  });

  describe('Error Handling', () => {
    it('Invalid format', () => {
      return chai.expect(nodeGoogleCharts({}, 'jpeg'))
      .be.rejectedWith(Error, 'Unsupported format');
    });

    it('Invalid chartOptions', () => {
      return chai.expect(nodeGoogleCharts(null))
      .be.rejectedWith(Error, 'chartOptions should be an object containing Google ChartWrapper options');
    });
  });
});


function getTestData(fileName) {
  return fs.readFileSync(path.join(__dirname, `./data/${fileName}`), 'utf-8')
}
