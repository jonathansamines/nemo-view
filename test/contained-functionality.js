'use strict';

const Nemo = require('nemo');
const path = require('path');
const util = require(path.resolve(__dirname, 'util'));

let nemo = {};

describe('nemo-view @pluginContainedFunctionality@', () => {
  before((done) => {
    nemo = Nemo(done);
  });

  after((done) => {
    nemo.driver.quit().then(done);
  });

  it('should complete the shared functionality', (done) => {
    nemo.login.getPage();
    util.waitForJSReady(nemo);
    nemo.login.login('medelman-buyer@paypal.com', '11111111');
    nemo.login.logout().then(util.doneSuccess(done), util.doneError(done));
  });
});
