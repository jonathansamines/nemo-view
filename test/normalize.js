'use strict';

const Nemo = require('nemo');
const path = require('path');
const assert = require('assert');
const normalize = require(path.resolve(__dirname, '../lib/normalize'));

let nemo = {};

describe('nemo-view @normalize@ module', () => {
  before((done) => {
    nemo = Nemo(done);
  });

  after((done) => {
    nemo.driver.quit().then(done);
  });

  it('should correctly convert strings and objects to selenium-webdriver locator functions', (done) => {
    let output;
    const Locator = nemo.wd.By.id('xyz').constructor;
    const verifications = [
      {
        input: {
          type: 'xpath',
          locator: '/x/y/z:[abc]'
        },
        output: { using: 'xpath', value: '/x/y/z:[abc]' }
      }, {
        input: 'xpath:/x/y/z:[abc]',
        output: nemo.wd.By.xpath('/x/y/z:[abc]')

      }, {
        input: 'a span[class=foo]:nth-child',
        output: nemo.wd.By.css('a span[class=foo]:nth-child')

      }, {
        input: 'css:a span[class=foo]:nth-child',
        output: nemo.wd.By.css('a span[class=foo]:nth-child')
      }
    ];

    verifications.forEach((verification) => {
      output = normalize(nemo, verification.input);
      assert.deepEqual(verification.output, output);
      assert(output instanceof Locator, 'Expected normalized locator to be an instance of Locator');
    });
    done();
  });

  it('should return unmodified input object if it is already a locator', (done) => {
    const inputLocator = nemo.wd.By.id('xyz');
    const outputLocator = normalize(nemo, inputLocator);
    assert(inputLocator === outputLocator, 'expected output locator to be the input object');
    done();
  });

  it('should correctly throw error @notype@', (done) => {
    const noType = {
      "noType": {
        "locator": "foo"
      }
    };
    try {
      normalize(nemo, noType);
      done(new Error('Expected error for locator with no type'));
    } catch (e) {
      done();
    }
  });

  it('should correctly throw error @emptyType@', (done) => {
    const emptyType = {
      "noType": {
        "locator": "foo",
        "type": ""
      }
    };
    try {
      normalize(nemo, emptyType);
      done(new Error('Expected error for locator with empty type'));
    } catch (e) {
      done();
    }
  });

  it('should correctly throw error @blankType@', (done) => {
    const blankType = {
      "noType": {
        "locator": "foo",
        "type": "  "
      }
    };
    try {
      normalize(nemo, blankType);
      done(new Error('Expected error for locator with blank type'));
    } catch (e) {
      done();
    }
  });

  it('should correctly throw error @invalidType@', (done) => {
    const invalidType = {
      "noType": {
        "locator": "foo",
        "type": "bar"
      }
    };
    try {
      normalize(nemo, invalidType);
      done(new Error('Expected error for locator with invalid type'));
    } catch (e) {
      done();
    }
  });

  it('should correctly throw error @noLocatorValidType@', (done) => {
    const noLocatorValidType = {
      "noType": {
        "type": "css"
      }
    };
    try {
      normalize(nemo, noLocatorValidType);
      done(new Error('Expected error for no locator with valid type'));
    } catch (e) {
      done();
    }
  });

  it('should correctly throw error @noLocatorInvalidType@', (done) => {
    const noLocatorInvalidType = {
      "noType": {
        "type": "bar"
      }
    };
    try {
      normalize(nemo, noLocatorInvalidType);
      done(new Error('Expected error for locator with invalid type'));
    } catch (e) {
      done();
    }
  });
});
