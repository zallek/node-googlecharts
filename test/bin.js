const fs = require('fs');
const path = require('path');
const chai = require('chai');
const exec = require('child_process').exec;


const input = require('./data/column-chart.input');
const expectedOutput = getTestData('column-chart.output.svg');

describe('Bin', function() {
  this.timeout(3000);

  it('Should accept a single argument with serialized data', function(done) {
    spawnProcess(input, done);
  });
  it('Should return result on stdout', function(done) {
    spawnProcess(input, (error, stdout, stderr) => {
      chai.expect(stdout).to.equal(expectedOutput + '\n');
      done();
    });
  });
  it('Should return error on stderr', function(done) {
    spawnProcess(3, (error, stdout, stderr) => {
      chai.expect(stderr).to.equal('[Error: [InputError] chartOptions should be an object containing Google ChartWrapper options]\n');
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
