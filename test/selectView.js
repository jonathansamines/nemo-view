'use strict';

const Nemo = require('nemo');
const path = require('path');
const assert = require('assert');
const util = require(path.resolve(__dirname, 'util'));

let nemo = {};

describe('nemo-view @select@', () => {
  before((done) => {
    nemo = Nemo(done);
  });
  after((done) => {
    nemo.driver.quit().then(done);
  });

  beforeEach((done) => {
    nemo.driver.get(nemo.data.baseUrl + '/selects');
    util.waitForJSReady(nemo).then(util.doneSuccess(done), util.doneError(done));
  });

  it('should select option by @OptionValue@positive@ method', (done) => {
    nemo.view.select.selectOptionValue('2');
    nemo.view.select.select().getAttribute('value').then((value) => {
      assert.equal(value,'2');
      done();
    });
  });

  it('should NOT select option by @OptionValue@negative@ method', (done) => {
    nemo.view.select.selectOptionValue('does not exist').then(() => {
      done(new Error('Correct option was not selected'));
    }, () => {
      done();
    });
  });

  it('should select option by @OptionText@positive@ method', (done) => {
    nemo.view.select.selectOptionText('Value of 2');
    nemo.view.select.select().getAttribute('value').then((value) => {
      assert.equal(value,'2');
      done();
    });
  });

  it('should NOT select option by @OptionText@negative@ method', (done) => {
    nemo.view.select.selectOptionText('does not exist').then(() => {
      done(new Error('Correct option was not selected'));
    }, () => {
      done();
    });
  });
});
