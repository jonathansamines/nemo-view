'use strict';

const assert = require('assert');
const Nemo = require('nemo');
const path = require('path');
const util = require(path.resolve(__dirname, 'util'));
let nemo;

describe('nemo-view @methods@', () => {
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

  it('should return a @locatorObject@', (done) => {
    const locator = nemo.view.simple.outBoxBy();
    if (locator.using && locator.value) {
      done();
    } else {
      done(new Error('didnt get back a locator object'));
    }
  });

  it('should find an existing element using the @Wait@positive@ method', (done) => {
    nemo.view.simple.bodyTagWait(3000, 'didnt find body tag').getTagName().then((tn) => {
      if (tn.toLowerCase() === 'body') {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });

  it('should appropriately use a timeout argument to the @Wait@negative@CustomTimeout@ method in a failure scenario', (done) => {
    const start = Date.now();
    nemo.view.simple.notExistWait(13000, 'didnt find notExist').then(() => {
      done(new Error('found notExist but should not have'));
    }, () => {
      const found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 13800 || found < 12500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
    });
  });

  it('should appropriately use a DIFFERENT timeout argument to the @Wait@negative@CustomTimeout@ method in a failure scenario', (done) => {
    const start = Date.now();
    nemo.view.simple.notExistWait(3000, 'didnt find notExist').then(() => {
      done(new Error('found notExist but should not have'));
    }, () => {
      const found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 3800 || found < 2500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
    });
  });

  it('should use @WaitVisible@positive@ method', (done) => {
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo);
    nemo.view.simple.waitButton().click();
    nemo.view.simple.outBoxWaitVisible(6000, 'didnt find outbox').getTagName().then((tn) => {
      assert.equal(tn.toLowerCase(), 'div');
      done();
    }, util.doneError(done));
  });

  it('should use @WaitVisible@negative@ method for element present but not visible', (done) => {
    let start;
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo).then(() => {
      start = Date.now();
    });
    nemo.view.simple.outBoxWaitVisible(3000, 'didnt find outbox').then(() => {
      done(new Error('shouldn\'t have found the element to be visible'));
    }, () => {
      const found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 3800 || found < 2500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
    });
  });

  it('should use @WaitVisible@negative@ method for element not present ', (done) => {
    let start;
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo).then(() => {
      start = Date.now();
    });
    nemo.view.simple.outBoxWaitVisible(3000, 'didnt find outbox').then(() => {
      done(new Error('shouldn\'t have found the element to be visible'));
    }, () => {
      const found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 3800 || found < 2500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
    });
  });

  it('should return true/false using @Visible@Positive@ method when element present', (done) => {
    nemo.view.simple.outBoxVisible().then((visible) => {
      assert.equal(visible, false);
    });
    nemo.view.form.fooButtonVisible().then((visible) => {
      assert.equal(visible, true);
    }).then(util.doneSuccess(done), util.doneError(done));
  });

  it('should throw error using @Visible@Negative@ method when element not present', (done) => {
    nemo.view.simple.notExistVisible().then(util.doneError(done), util.doneSuccess(done));
  });

  it('should return true using @Present@Positive@ method', (done) => {
    nemo.view.simple.outBoxPresent().then((present) => {
      assert.equal(present, true);
      done();
    }, util.doneError(done));
  });

  it('should return false using @Present@negative@ method', (done) => {
    nemo.view.simple.notExistPresent().then((present) => {
      assert.equal(present, false);
      done();
    }, util.doneError(done));
  });

  it('should return true using @TextEquals@Positive@ method', (done) => {
    nemo.view.simple.pageHeaderTextEquals('Sample form stuff').then((isEqual) => {
      assert.equal(isEqual, true);
      done();
    }, util.doneError(done));
  });

  it('should return false using @TextEquals@negative@ method', (done) => {
    nemo.view.simple.pageHeaderTextEquals('form stuff').then(() => {
      done(new Error('this promise should have been rejected'));
    }, () => {
      done();
    });
  });

  it('should return true using @AttrEquals@Positive@ method', (done) => {
    nemo.view.simple.buttonLabelAttrEquals('value', 'Go foo').then((isEqual) => {
      assert.equal(isEqual, true);
      done();
    }, util.doneError(done));
  });

  it('should return false using @AttrEquals@negative@ method', (done) => {
    nemo.view.simple.buttonLabelAttrEquals('value', 'foo').then(() => {
      done(new Error('this promise should have been rejected'));
    }, () => {
      done();
    });
  });

  // GENERIC methods
  it('should resolve true if element exists @_present@positive@ method', (done) => {
    nemo.view._present('body').then((found) => {
      if (found) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });

  it('should resolve true if element exists @_present@withParent@positive@ method', (done) => {
    nemo.view._present('label[for="foo_text"]', nemo.view.simple.form()).then((found) => {
      if (found) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });

  it('should resolve false if element doesn\'t exists @_present@negative@ method', (done) => {
    nemo.view._present('booody').then((found) => {
      if (!found) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });

  it('should resolve false if element does not exists @_present@withParent@negative@ method', (done) => {
    nemo.view._present('boooddy', nemo.view.simple.form()).then((found) => {
      if (found) {
        done(new Error('something went wrong here'));
      } else {
        done();
      }
    }, util.doneError(done));
  });

  it('should resolve true if element visible @_visible@positive@ method', (done) => {
    nemo.view._visible('body').then((visible) => {
      if (visible) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });

  it('should resolve true if element visible @_visible@withParent@positive@ method', (done) => {
    nemo.view._visible('label[for="foo_text"]', nemo.view.simple.form()).then((visible) => {
      if (visible) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });

  it('should resolve false if element not visible @_visible@negative@ method', (done) => {
    nemo.view._visible('id:outy').then((visible) => {
      if (!visible) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });

  it('should resolve false if element not visible @_visible@withParent@negative@ method', (done) => {
    nemo.view._visible('id:outy', nemo.view.simple.form()).then((visible) => {
      if (!visible) {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });

  it('should find an existing element using the @_find@positive@ method', (done) => {
    nemo.view._find('body').getTagName().then((tn) => {
      if (tn.toLowerCase() === 'body') {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });

  it('should find an existing element using the @_find@withparent@positive@ method', (done) => {
    nemo.view._find('label[for="foo_text"]', nemo.view.simple.form()).then((element) => {
      element.getText().then((text) => {
        if(text === 'foo Text:') {
          done();
        }
      }, (err) => {
        done(new Error('something went wrong here ', err));
      });
    }, util.doneError(done));
  });

  it('should throw error for non-present element with @_find@negative@ method', (done) => {
    nemo.view._find('booody').then(() => {
      done(new Error('should not have found an element'));
    }, util.doneSuccess(done));
  });

  it('should find an array of elements using the @_finds@positive@ method', (done) => {
    nemo.view._finds('input[type=text]').then((inputs) => {
      const promises = [];
      inputs.forEach((input, idx) => {
        const inputAndCheck = input.sendKeys('input', idx).then(() => {
          return input.getAttribute('value');
        }).then((value) => {
          return value;
        });
        promises.push(inputAndCheck);
      });
      return nemo.wd.promise.all(promises);
    }).then((returned) => {
      assert.deepEqual([
        'input0',
        'input1',
        'input2',
        'input3'
      ], returned);
      done();
    }, util.doneError(done));
  });

  it('should find elements using @_finds@withParent@ method', (done) => {
    nemo.view._finds('div.fielder', nemo.view.simple.form()).then((divs) => {
      if (divs.length === 4) {
        done();
      }
    }, util.doneError(done));
  });

  it('should find an existing element using the @_wait@positive@ method', (done) => {
    nemo.view._wait('body', 3000).getTagName().then((tn) => {
      if (tn.toLowerCase() === 'body') {
        done();
      } else {
        done(new Error('something went wrong here'));
      }
    }, util.doneError(done));
  });

  it('should appropriately use a timeout argument to the @_wait@negative@CustomTimeout@ method in a failure scenario', (done) => {
    const start = Date.now(), msg = 'Element did not load for specified timeout';
    nemo.view._wait('bordy.foo.blarg', 13000, msg).then(() => {
      done(new Error('found notExist but should not have'));
    }, (err) => {
      assert.equal(err.message, msg);
      const found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 13800 || found < 12500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
    });
  });

  it('should appropriately use a DIFFERENT timeout argument to the @_wait@negative@CustomTimeout@ method in a failure scenario', (done) => {
    const start = Date.now(), msg = 'Element did not load for specified timeout';
    nemo.view._wait('bordy.foo.blarg', 3000, msg).then(() => {
      done(new Error('found notExist but should not have'));
    }, (err) => {
      assert.equal(err.message, msg);
      const found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 3800 || found < 2500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
    });
  });

  it('should use @_waitVisible@positive@ method', (done) => {
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo);
    nemo.view.simple.waitButton().click();
    nemo.view._waitVisible('#outy', 6000).getTagName().then((tn) => {
      assert.equal(tn.toLowerCase(), 'div');
      done();
    }, util.doneError(done));
  });

  it('should use @_waitVisible@negative@ method for element present but not visible', (done) => {
    let start;
    const msg = 'Element did not load for specified timeout';

    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo).then(() => {
      start = Date.now();
    });
    nemo.view._waitVisible('#outy', 3000, msg).then(() => {
      done(new Error('shouldn\'t have found the element to be visible'));
    }, (err) => {
      assert.equal(err.message, msg);
      const found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 3800 || found < 2500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
    });
  });

  it('should use @_waitVisible@negative@ method for element not present ', (done) => {
    let start;
    const msg = 'Element did not load for specified timeout';
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo).then(() => {
      start = Date.now();
    });
    nemo.view._waitVisible('#foo.bar.brrao', 3000, msg).then(() => {
      done(new Error('shouldn\'t have found the element to be visible'));
    }, (err) => {
      assert.equal(err.message, msg);
      const found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 3800 || found < 2500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
    });
  });

  it('should use @_firstVisible@positive@ method to find an element which isnt initially visible', (done) => {
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo);
    nemo.view.simple.waitButton().click();
    nemo.view._firstVisible({
      'idontexist': '#idontexist',
      'outy': '#outy',
      'noexisty': '#noexisty',
      'alsonoexisty': '#alsonoexisty'
    }, 6000).then((foundElement) => {
      assert.equal(foundElement, 'outy');
      done();
    }, util.doneError(done));
  });

  it('should use @_firstVisible@negative@ method to throw error when no elements found', (done) => {
    let start;
    nemo.driver.get(nemo.data.baseUrl + '/waits');
    util.waitForJSReady(nemo).then(() => {
      start = Date.now();
    });
    nemo.view._firstVisible({
      'idontexist': '#idontexist',
      'noexisty': '#noexisty',
      'alsonoexisty': '#alsonoexisty'
    }, 3000).then(() => {
      done(new Error('shouldnt have found an element'));
    }, () => {
      const found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 3800 || found < 2500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
    });
  });
});
