'use strict';

const Drivex = require('selenium-drivex');
const Locatex = require('./locatex');
const _ = require('lodash');
const normalize = require('./normalize');
const debug = require('debug');
const log = debug('nemo-view:log');

function Locreator(nemo) {
  log('creating Locreator instance');
  this.nemo = nemo;
  this.drivex = Drivex(nemo.driver, nemo.wd);
  this.locatex = Locatex(nemo);
  this.normify = this.normalize = function (locator) {
    return normalize(nemo, locator);
  };
}

Locreator.prototype.addGenericMethods = function generics() {
  log('adding generic methods');
  const normify = this.normify;
  const drivex = this.drivex;
  const nemo = this.nemo;

  nemo.view._find = (locator, parentElement) => {
    return drivex.find(normify(locator), parentElement);
  };

  nemo.view._finds = (locator, parentElement) => {
    return drivex.finds(normify(locator), parentElement);
  };

  nemo.view._present = (locator, parentElement) => {
    return drivex.present(normify(locator), parentElement);
  };

  nemo.view._visible = (locator, parentElement) => {
    return drivex.visible(normify(locator), parentElement);
  };

  nemo.view._wait = (locator, timeout, msg) => {
    return drivex.waitForElementPromise(normify(locator), timeout, msg);
  };

  nemo.view._waitVisible = (locator, timeout, msg) => {
    return drivex.waitForElementVisiblePromise(normify(locator), timeout || 5000, msg);
  };

  nemo.view._firstVisible = (_locatorObject, timeout) => {
    //transform _locatorObject to use native selenium-webdriver Locator format
    const locatorObject = _.transform(_locatorObject, (result, n, key) => {
      result[key] = normify(_locatorObject[key]);
    });

    return drivex.firstVisible(locatorObject, timeout);
  };
};

Locreator.prototype.addStarMethods = function addStarMethods(locatorId, locatorJSON, parentWebElement) {
  log('add star methods for %s', locatorId);
  const locatorObject = {};
  const drivex = this.drivex;
  const locreator = this;
  const locator = function () {
    return locreator.normify(locreator.locatex(locatorJSON));
  };

  //this is an error check. if an error thrown, invalid locatorJSON.
  locator();

  locatorObject[locatorId] = () => {
    return drivex.find(locator(), parentWebElement);
  };
  locatorObject[locatorId + 'By'] = function () {
    return locator();
  };
  locatorObject[locatorId + 'Present'] = function () {
    return drivex.present(locator(), parentWebElement);
  };
  locatorObject[locatorId + 'Wait'] = function (timeout, msg) {
    return drivex.waitForElementPromise(locator(), timeout || 5000, msg || 'Wait failed for locator [' + locatorId + ']');
  };
  locatorObject[locatorId + 'WaitVisible'] = function (timeout, msg) {
    return drivex.waitForElementVisiblePromise(locator(), timeout || 5000, msg || 'WaitVisible failed for locator [' + locatorId + ']');
  };
  locatorObject[locatorId + 'Visible'] = function () {
    return drivex.visible(locator(), parentWebElement);
  };
  locatorObject[locatorId + 'OptionText'] = function (optionText) {
    return drivex.selectByOptionText(locator(), optionText, parentWebElement);
  };
  locatorObject[locatorId + 'OptionValue'] = function (optionValue) {
    return drivex.selectByOptionValue(locator(), optionValue, parentWebElement);
  };
  locatorObject[locatorId + 'TextEquals'] = function (value) {
    return drivex.validateText(locator(), parentWebElement, value) ;
  };
  locatorObject[locatorId + 'AttrEquals'] = function (attribute, value) {
    return drivex.validateAttributeValue(locator(), parentWebElement, attribute, value);
  };
  return locatorObject;
};

Locreator.prototype.addGroup = function (locatorId, locatorJSON) {
  const nemo = this.nemo;
  const drivex = this.drivex;
  const locreator = this;
  return function () { //give back the nemo.view.viewname.list() function
    const localizedJSON = locreator.locatex(locatorJSON);
    return drivex.finds(locreator.normify(localizedJSON)).then((parentWebElements) => {
      return nemo.wd.promise.map(parentWebElements, (parentWebElement) => {
        const parentObject = {};
        Object.keys(localizedJSON.Elements).forEach((childLocatorId) => {
          const childLocatorJSON = localizedJSON.Elements[childLocatorId];
          const starMethods = locreator.addStarMethods(childLocatorId, childLocatorJSON, parentWebElement);
          _.merge(parentObject, starMethods);
        });
        return parentObject;
      });
    });
  };
};

module.exports = Locreator;
