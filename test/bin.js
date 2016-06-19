const fs = require('fs');
const path = require('path');
const chai = require('chai');
const exec = require('child_process').exec;


const input = require('./data/column-chart.input');
const expectedOutput = getTestData('column-chart.output.svg');

describe('Bin', () => {
  it('Should accept a single argument with serialized data', done => {
    spawnProcess(input, done);
  });
  it('Should return result on stdout', done => {
    spawnProcess(input, (error, stdout, stderr) => {
      chai.expect(stdout).to.equal(expectedOutput + '\n');
      done();
    });
  });
  it('Should return error on stderr', done => {
    spawnProcess(3, (error, stdout, stderr) => {
      chai.expect(stderr).to.equal('[Error: chartOptions should be an object containing Google ChartWrapper options]\n');
      done();
    });
  });
});


function spawnProcess(input, callback) {
  const cmd = path.join(__dirname, '../bin/node-googlecharts');
  exec(`node bin/node-googlecharts '${JSON.stringify(input)}'`, callback);
}

function getTestData(fileName) {
  return fs.readFileSync(path.join(__dirname, `./data/${fileName}`), 'utf-8')
}
