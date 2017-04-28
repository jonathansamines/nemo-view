'use strict';

const path = require('path');
const Nemo = require('nemo');
const util = require(path.resolve(__dirname, 'util'));

let nemo = {};

describe('nemo-view @listViewSuite@', () => {
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

  it('should use the form list view to enter values and write to outy div @useListView@', (done) => {
    nemo.view.formElementList.inputGroup().then((elts) => {
      elts.forEach((elt) => {
        elt.text().sendKeys('abcd');
        elt.button().click();
      });
      nemo.view.formElementList.outBox().getText().then((outText) => {
        if (outText === 'abcdabcdabcdabcd') {
          done();
        } else {
          done(new Error('didnt get what we shoulda'));
        }
      }, util.doneError(done));
    });
  });
});
