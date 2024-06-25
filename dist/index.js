/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 176:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 789:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 715:
/***/ ((module) => {

module.exports = eval("require")("ignore");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(176);
const github = __nccwpck_require__(789);
const fs = __nccwpck_require__(147);
const path = __nccwpck_require__(17);
const ignore = __nccwpck_require__(715);

try {
  const isLocal = process.env.GITHUB_ACTIONS ? false : true; //used for testing locally with name "animal-tracker" as a placeholder for the repo name
  const nameToReplaceWith = isLocal
    ? "animal-tracker"
    : core.getInput("name-to-replace-with"); //this is usually the repo name; expects a format like "animal-tracker"
  core.info(`name-to-replace-with: ${nameToReplaceWith}`);
  const apiTemplateName = isLocal ? "CAP" : core.getInput("api-template-name"); //gets the name of the API template from the action input
  core.info(`api-template-name: ${apiTemplateName}`);
  const frontendTemplateName = isLocal
    ? "React DAB!"
    : core.getInput("frontend-template-name"); //gets the name of the frontend template from the action input
  core.info(`frontend-template-name: ${frontendTemplateName}`);
  core.info(`process.env.GITHUB_WORKSPACE: ${process.env.GITHUB_WORKSPACE}`);
  const files = isLocal
    ? fs.readdirSync(".")
    : fs.readdirSync(process.env.GITHUB_WORKSPACE);
  core.info(`Files in directory: ${files}`);

  const apiFolderPath = files.find((file) => file.includes("Api"));
  if (!apiFolderPath) {
    throw new Error("No API folder found");
  }
  const apiIgnoreFilterContents = fs.readFileSync(
    path.join(apiFolderPath, ".gitignore"),
    "utf8"
  );
  const apiIgnoreFilter = ignore().add(apiIgnoreFilterContents);

  const frontendFolder = files.find((file) => file.includes("frontend"));
  if (!frontendFolder) {
    throw new Error("No frontend folder found");
  }
  const frontendIgnoreFilterContents = fs.readFileSync(
    path.join(frontendFolder, ".gitignore"),
    "utf8"
  );
  const frontendIgnoreFilter = ignore().add(frontendIgnoreFilterContents);

  /**
   * Gets the custom name of the API (e.g. "AnimalTracker")
   * @param {*} name the name of the repo
   */
  const customRenameForAPI = (name) => {
    const words = name.split("-");
    const capitalizedWords = words.map(
      (word) => word[0].toUpperCase() + word.slice(1)
    );
    const finalName = capitalizedWords.join("");
    return finalName;
  };

  /**
   * Replaces all instances of {apiTemplateName} in a file with the custom name (e.g. "AnimalTracker")
   * It does this by reading the file contents and storing them in a temporary buffer
   * @param {*} filePath
   */
  const replaceInFileForAPI = (filePath) => {
    let content = fs.readFileSync(filePath, "utf8");
    //replace all instances of apiTemplateName with custom name
    content = content.replace(
      new RegExp(apiTemplateName, "g"),
      customRenameForAPI(nameToReplaceWith)
    );
    fs.writeFileSync(filePath, content, "utf8");
  };

  /**
   * Renames all files and folders in a directory for the API.
   * Changes all instances of {apiTemplateName} to custom name (e.g. "AnimalTracker")
   * @param {*} dir
   */
  const renameFilesAndFoldersForAPI = (dir) => {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      if (apiIgnoreFilter.ignores(itemPath)) {
        return;
      }
      const newItemPath = path.join(
        dir,
        item.replace(
          new RegExp(apiTemplateName, "g"),
          customRenameForAPI(`${nameToReplaceWith}`)
        )
      );
      if (fs.statSync(itemPath).isDirectory()) {
        //if it's a directory, recursively rename it
        fs.renameSync(itemPath, newItemPath);
        renameFilesAndFoldersForAPI(newItemPath);
      } else {
        //if it's a file, replace content inside and rename it
        replaceInFileForAPI(itemPath);
        fs.renameSync(itemPath, newItemPath);
      }
    });
  };

  /**
   * Gets the custom name of the frontend (e.g. "Animal Tracker")
   * @param {*} name the name of the repo
   */
  const customRenameForFrontend = (name) => {
    const words = name.split("-");
    const capitalizedWords = words.map(
      (word) => word[0].toUpperCase() + word.slice(1)
    );
    const finalName = capitalizedWords.join(" ");
    return finalName;
  };

  /**
   * Replaces all instances of {frontendTemplateName} in a file with the custom name (e.g. "Animal Tracker")
   * @param {*} filePath
   */
  const replaceInFileForFrontend = (filePath) => {
    let content = fs.readFileSync(filePath, "utf8");
    content = content.replace(
      new RegExp(frontendTemplateName, "g"),
      customRenameForFrontend(`${nameToReplaceWith}`)
    );
    fs.writeFileSync(filePath, content, "utf8");
  };

  /**
   * Renames all files and folders in a directory for the frontend with custom name (e.g. "Animal Tracker")
   * @param {*} dir
   */
  const renameFilesAndFoldersForFrontend = (dir) => {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      if (frontendIgnoreFilter.ignores(itemPath)) {
        return;
      }
      const newItemPath = path.join(
        dir,
        item.replace(
          new RegExp(frontendTemplateName, "g"),
          customRenameForFrontend(`${nameToReplaceWith}`)
        )
      );
      if (fs.statSync(itemPath).isDirectory()) {
        //if it's a directory, recursively rename it
        fs.renameSync(itemPath, newItemPath);
        renameFilesAndFoldersForFrontend(newItemPath);
      } else {
        //if it's a file, replace content inside and rename it
        replaceInFileForFrontend(itemPath);
        fs.renameSync(itemPath, newItemPath);
      }
    });
  };

  const renamePackageJson = (folder) => {
    const packageJsonPath = path.join(folder, "package.json");
    let content = fs.readFileSync(packageJsonPath, "utf8");
    content = content.replace(/Api-template/g, newApiFolderName);
    content = content.replace(
      /CAP\.API/g,
      customRenameForAPI(nameToReplaceWith) + ".API"
    );
    fs.writeFileSync(packageJsonPath, content, "utf8");
  };

  const renameConfig = (folder) => {
    const configPath = path.join(folder, "openapi-ts.config.ts");
    let content = fs.readFileSync(configPath, "utf8");
    content = content.replace(/Api-template/g, newApiFolderName);
    content = content.replace(/CAP\.API/g, customRenameForAPI(nameToReplaceWith) + ".API");
    fs.writeFileSync(configPath, content, "utf8");
  }


  const newApiFolderName = `${nameToReplaceWith}-api`;
  core.info(`Renaming ${apiFolderPath} to ${newApiFolderName}`);
  fs.renameSync(apiFolderPath, newApiFolderName);

  //Rename API folder contents
  renameFilesAndFoldersForAPI(`${newApiFolderName}`);
  renamePackageJson(newFrontendFolderName);
  //Rename frontend folder
  const newFrontendFolderName = `${nameToReplaceWith}`;
  core.info(`Renaming ${frontendFolder} to ${newFrontendFolderName}`);
  fs.renameSync(frontendFolder, newFrontendFolderName);
  //rename all instances of "React DAB!" in frontend folder to custom name
  renameFilesAndFoldersForFrontend(`${newFrontendFolderName}`);
  renamePackageJson(newFrontendFolderName);
  // Rename the open api config file
  renameConfig(newFrontendFolderName);
} catch (error) {
  core.setFailed(error.message);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;