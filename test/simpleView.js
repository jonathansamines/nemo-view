'use strict';

const Nemo = require('nemo');
const path = require('path');
const assert = require('assert');
const util = require(path.resolve(__dirname, 'util'));

let nemo = {};

describe('nemo-view @simpleViewSuite@', () => {
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
    nemo.view.form.fooText().sendKeys('foo');
    nemo.driver.sleep(300);
    nemo.view.form.fooButton().click();
    nemo.view.form.barText().sendKeys('bar');
    nemo.view.form.barButton().click();
    nemo.view.form.bingText().sendKeys('bing');
    nemo.view.form.bingButton().click();
    nemo.view.form.bangText().sendKeys('bang');
    nemo.view.form.bangButton().click();
    nemo.driver.sleep(3000);
    nemo.view.form.outBox().getText().then((outText) => {
      assert.equal(outText, 'foobarbingbang');
      done();
    }, util.doneError(done));
  });
});
