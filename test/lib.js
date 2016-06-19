const fs = require('fs');
const path = require('path');
const chai = require('chai');
const nodeGoogleCharts = require('../src');


const tests = [
  'column-chart',
];

describe('Lib', () => {
  describe('Generate SVG', () => {
    tests.forEach(testId => {
      const input = require(`./data/${testId}.input`);
      const expectedOutput = getTestData(testId + '.output.svg');
      it('Test ' + testId, done => {
        nodeGoogleCharts(input)
        .then(output => {
          chai.expect(output).to.equal(expectedOutput);
          done();
        })
        .catch(err => done(err));
      });
    });
  });
});


function getTestData(fileName) {
  return fs.readFileSync(path.join(__dirname, `./data/${fileName}`), 'utf-8')
}
