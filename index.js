'use strict';

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
var extend = require('extend-shallow');
var shell = require('shelljs');

function sBoticsSaver(settings) {
  if (!(this instanceof sBoticsSaver)) return new sBoticsSaver(settings);

  var defaultSettings = extend(
    {
      defaultDirectory: '',
      useDirectoryHome: false,
      nameFolderDefault: '',
      saveAllFromDefaultDirectory: true,
    },
    settings,
  );

  const nameFolderDefault = defaultSettings.nameFolderDefault + '/';
  const useDirectoryHome = defaultSettings.useDirectoryHome;
  var defaultDirectory = defaultSettings.defaultDirectory;

  defaultDirectory = useDirectoryHome
    ? path.join(os.homedir(), nameFolderDefault)
    : defaultDirectory
    ? path.join(defaultDirectory, nameFolderDefault)
    : defaultDirectory;

  const settingsInstance = {
    defaultDirectory: defaultDirectory,
    useDirectoryHome: useDirectoryHome,
    nameFolderDefault: nameFolderDefault,
    saveAllFromDefaultDirectory: defaultSettings.saveAllFromDefaultDirectory,
  };

  this.settings = extend({}, settingsInstance, this.settings);
}

sBoticsSaver.prototype.save = function (path, options, cb) {
  if (typeof options === 'function') (cb = options), (options = {});
  if (typeof cb !== 'function')
    throw new TypeError('expected callback to be a function');

  const settingsInstance = extend(
    {
      path: path,
      pathFile: '',
      useDirectoryPath: false,
    },
    this.settings,
    options,
  );

  const defaultDirectory = settingsInstance.defaultDirectory;
  const saveAllFromDefaultDirectory =
    settingsInstance.saveAllFromDefaultDirectory;
  const useDirectoryPath = settingsInstance.useDirectoryPath;
  var pathFile = settingsInstance.pathFile;

  if (!defaultDirectory && saveAllFromDefaultDirectory)
    return cb(
      new Error('expected "settings.defaultDirectory" to be specified'),
    );
  if (!path) return cb(new Error('expected "path" to be specified'));

  pathFile = useDirectoryPath
    ? path
    : saveAllFromDefaultDirectory
    ? defaultDirectory + path
    : path;

  shell.mkdir('-p', pathFile);

  cb(null, pathFile);
  return this;
};

module.exports = sBoticsSaver;
