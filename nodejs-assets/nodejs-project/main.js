"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNonStandardImagesFound = void 0;
const path_1 = require("path");
const createPdf_1 = __importDefault(require("./createPdf"));
const modifyPdf_1 = __importDefault(require("./modifyPdf"));
const rnBridge = require('rn-bridge');
let nonStandardImagesFound = false;
const setNonStandardImagesFound = (value) => {
    nonStandardImagesFound = value;
};
exports.setNonStandardImagesFound = setNonStandardImagesFound;
rnBridge.channel.on('createPdf', async (chapters, cacheDir, filename) => {
    try {
        (0, exports.setNonStandardImagesFound)(false);
        const pdfFileLocation = (0, path_1.normalize)((0, path_1.join)(cacheDir, filename));
        const created = await (0, createPdf_1.default)(pdfFileLocation, chapters);
        if (created) {
            rnBridge.channel.post('onCreatePdfDone', pdfFileLocation, nonStandardImagesFound);
        }
        else {
            rnBridge.channel.post('onCreatePdfDone', '', nonStandardImagesFound);
        }
    }
    catch (err) {
        let errMsg = 'Error in PDF creation service';
        if ((Boolean((err === null || err === void 0 ? void 0 : err.message))) && typeof err.message === 'string') {
            errMsg = err.message;
        }
        rnBridge.channel.post('onCreatePdfError', errMsg);
    }
});
rnBridge.channel.on('modifyPdf', async (chapters, filePath) => {
    try {
        (0, exports.setNonStandardImagesFound)(false);
        const pdfFileLocation = (0, path_1.normalize)(filePath);
        const modified = await (0, modifyPdf_1.default)(pdfFileLocation, chapters);
        if (modified) {
            rnBridge.channel.post('onModifyPdfDone', pdfFileLocation, nonStandardImagesFound);
        }
        else {
            rnBridge.channel.post('onModifyPdfDone', '', nonStandardImagesFound);
        }
    }
    catch (err) {
        let errMsg = 'Error in PDF modification service';
        if ((Boolean((err === null || err === void 0 ? void 0 : err.message))) && typeof err.message === 'string') {
            errMsg = err.message;
        }
        rnBridge.channel.post('onModifyPdfError', errMsg);
    }
});
rnBridge.channel.send('NodeInit');
