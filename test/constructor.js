'use strict';

const Nemo = require('nemo');
const assert = require('assert');

let nemo = {};

describe('nemo-view @constructor@', () => {
  it('should do ? with malformed JSON file(s)', (done) => {
    nemo = Nemo({
      'plugins': {
        "view": {
          "module": "path:../",
          "arguments": ["path:mocks/badjson"]
        }
      }
    }, (err) => {
      if (err) {
        done();
      } else {
        done(new Error('should have got an error in nemo callback'));
      }
    });
  });
  it('should give back _ methods with empty locator directory', (done) => {
    nemo = Nemo({
      'plugins': {
        "view": {
          "module": "path:../",
          "arguments": ["path:mocks/empty"]
        }
      }
    }, (err) => {
      if (err) {
        done(new Error('shouldnt have got an error in nemo callback'));
      } else {
        assert(nemo.view);
        assert(nemo.view._find);
        done();
      }
      nemo.driver.quit();
    });
  });
  it('should give back _ methods with empty locator directory', (done) => {
    nemo = Nemo({
      'plugins': {
        "view": {
          "module": "path:../",
          "arguments": ["path:mocks/idontexist"]
        }
      }
    }, (err) => {
      if (err) {
        done(new Error('shouldnt have got an error in nemo callback'));
      } else {
        assert(nemo.view);
        assert(nemo.view._find);
        done();
      }
      nemo.driver.quit();
    });
  });
  it('should give back _ methods with no locatorDirectory argument', (done) => {
    nemo = Nemo({
      'plugins': {
        "view": {
          "module": "path:../",
          "arguments": null
        }
      }
    }, (err) => {
      if (err) {
        done(new Error('shouldnt have got an error in nemo callback'));
      } else {
        assert(nemo.view);
        assert(nemo.view._find);
        done();
      }
      nemo.driver.quit();
    });
  });
});
