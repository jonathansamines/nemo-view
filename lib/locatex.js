'use strict';

module.exports = function (nemo) {
  return function locatex(locatorJSON) {
    const locale = nemo._config.get('data:locale') || 'default';
    const localizedLocatorJSON = locatorJSON[locale] || locatorJSON['default'] || locatorJSON;

    return localizedLocatorJSON;
  };
};
