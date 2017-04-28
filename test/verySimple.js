'use strict';

const Nemo = require('nemo');
const path = require('path');
const assert = require('assert');
const util = require(path.resolve(__dirname, 'util'));

let nemo = {};

describe('nemo-view @verySimple@', () => {
  before((done) => {
    nemo = Nemo(done);
  });

  after((done) => {
    nemo.driver.quit().then(done);
  });

  beforeEach((done) => {
    nemo.driver.get(nemo.data.baseUrl);
    util.waitForJSReady(nemo).then(util.doneSuccess(done), util.doneError(done));
  });

  it('should use the form view to enter values and write to outy div @useView@', (done) => {
    nemo.view._find('css:#outy').getTagName().then((tn) => {
      assert.equal(tn.toLowerCase(), 'div');
    });
    nemo.view._finds('body').then((bodyArray) => {
      return bodyArray[0].getTagName();
    }).then((tn) => {
      assert.equal(tn.toLowerCase(), 'body');
    }).then(done, util.doneError(done));
  });
});
