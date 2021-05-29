'use strict';

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
var extend = require('extend-shallow');
var shell = require('shelljs');

const createFolderpermission = 0o2775;

function sBoticsFilesManager(settings) {
  if (!(this instanceof sBoticsFilesManager))
    return new sBoticsFilesManager(settings);

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

sBoticsFilesManager.prototype.save = function (path, options, cb) {
  if (typeof options === 'function') (cb = options), (options = {});

  const settingsInstance = extend(
    {
      path: path,
      data: '',
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
  const data = settingsInstance.data;

  if (!defaultDirectory && saveAllFromDefaultDirectory)
    throw new TypeError('expected "settings.defaultDirectory" to be specified');

  if (!path) throw new TypeError('expected "path" to be specified');
  if (!data) throw new TypeError('expected "data" to be specified');

  pathFile = useDirectoryPath
    ? path
    : saveAllFromDefaultDirectory
    ? defaultDirectory + path
    : path;

  console.log(pathFile);

  const splitPath = path.split('/');
  var newFolder = '';

  if (splitPath.length > 1) {
    for (let i = 0; i < splitPath.length - 1; i++) {
      const element = splitPath[i];
      newFolder += i > 0 ? `/${element}` : element;
    }
    newFolder = defaultDirectory + newFolder;
  }
  fs.ensureDirSync(newFolder, createFolderpermission);

  const pathCreate = fs
    .pathExists(newFolder)
    .then((exists) => (exists ? true : false));

  if (!pathCreate) throw new TypeError('Failed to create folder in directory.');

  try {
    fs.writeFileSync(pathFile, data);
    return typeof cb !== 'function' ? true : cb(null, true);
  } catch (error) {
    return typeof cb !== 'function' ? false : cb(false);
  }
};

sBoticsFilesManager.prototype.open = function (path, options, cb) {
  if (typeof options === 'function') (cb = options), (options = {});

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
    throw new TypeError('expected "settings.defaultDirectory" to be specified');
  if (!path) throw new TypeError('expected "path" to be specified'); 

  pathFile = useDirectoryPath
    ? path
    : saveAllFromDefaultDirectory
    ? defaultDirectory + path
    : path;

  const pathLocales = fs
    .pathExists(pathFile)
    .then((exists) => (exists ? true : false));

  if (!pathLocales)
    throw new TypeError('Failed to find folder in directory.'); 
    
  try {
    const files = fs.readFileSync(pathFile, { encoding: 'utf8' });
    return typeof cb !== 'function' ? files : cb(null, files);
  } catch (error) {
    return typeof cb !== 'function' ? false : cb(false);
  }
};

sBoticsFilesManager.prototype.find = function (path, options, cb) {
  if (typeof options === 'function') (cb = options), (options = {});

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
    throw new TypeError('expected "settings.defaultDirectory" to be specified'); 
    
  if (!path) throw new TypeError('expected "path" to be specified');

  pathFile = useDirectoryPath
    ? path
    : saveAllFromDefaultDirectory
    ? defaultDirectory + path
    : path;

  return fs
    .pathExists(pathFile)
    .then((exists) =>
      exists
        ? typeof cb !== 'function'
          ? true
          : cb(null, true)
        : typeof cb !== 'function'
        ? false
        : cb(null, false),
    );
};

module.exports = sBoticsFilesManager;
