'use strict';

const Nemo = require('nemo');
const path = require('path');
const assert = require('assert');
const util = require(path.resolve(__dirname, 'util'));

let nemo = {};

describe('nemo-view @locale@', () => {
  before((done) => {
    nemo = Nemo({
      plugins: {
        view: {
          module: 'path:../',
          arguments: ['path:mocks/locale']
        }
      }
    }, done);
  });

  after((done) => {
    nemo.driver.quit().then(done);
  });

  beforeEach((done) => {
    nemo.driver.get(nemo.data.baseUrl);
    util.waitForJSReady(nemo).then(util.doneSuccess(done), util.doneError(done));
  });

  it('works for standard locators', (done) => {
    nemo.view.form.text().getAttribute('id').then((idValue) => {
      assert.equal(idValue, 'foo_text');
      nemo._config.set('data:locale', 'DE');
    }).then(() => {
      return nemo.view.form.text().getAttribute('id');
    }).then((idValue) => {
      assert.equal(idValue, 'bar_text');
      nemo._config.set('data:locale', '');
    }).then(() => {
      return nemo.view.form.text().getAttribute('id');
    }).then((idValue) => {
      assert.equal(idValue, 'foo_text');
      done();
    });
  });

  it('works for Elements with inner locale scope', (done) => {
    nemo.view.form.boxInnerLocale().then((elts) => {
      return elts[0].elt().getAttribute('type').then((typeValue) => {
        assert.equal(typeValue, 'text');
        nemo._config.set('data:locale', 'DE');
        return elts[0].elt().getAttribute('type');
      });
    }).then((typeValue) => {
      assert.equal(typeValue, 'button');
      done();
    });
  });

  it('works for Elements with outer locale scope', (done) => {
    nemo._config.set('data:locale', null);
    nemo.view.form.boxOuterLocale().then((elts) => {
      elts[0].elt().getAttribute('id').then((idValue) => {
        assert.equal(idValue, 'foo_text');
        return true;
      });
    }).then(() => {
      nemo._config.set('data:locale', 'DE');
      nemo.view.form.boxOuterLocale().then((elts) => {
        elts[0].elt().getAttribute('id').then((idValue) => {
          assert.equal(idValue, 'bar_text');
          done();
        });
      });
    });
  });
});
