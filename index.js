'use strict';

const fs = require('fs-extra');
var extend = require('extend-shallow');

function sBoticsSaver(settings) {
  if (!(this instanceof sBoticsSaver)) return new sBoticsSaver(settings);

  const settingsInstance = extend({}, settings);
  this.settings = extend({}, settingsInstance, this.settings);
}

sBoticsSaver.prototype.save = function (path, options, cb) {
  if (typeof options === 'function') (cb = options), (options = {});
  if (typeof cb !== 'function')
    throw new TypeError('expected callback to be a function');

  var settingsInstance = extend(
    {
      path: path,
    },
    this.settings,
    options,
  );

  return this;
};

module.exports = sBoticsSaver;
