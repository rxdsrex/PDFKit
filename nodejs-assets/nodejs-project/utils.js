"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addImage = exports.writeFile = exports.readFile = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const readFile = async (filePath) => {
    try {
        if ((0, fs_1.existsSync)((0, path_1.normalize)(filePath))) {
            const aFileStr = await fs_1.promises.readFile(filePath, {
                encoding: 'base64'
            });
            return await Promise.resolve(aFileStr);
        }
        else {
            return await Promise.reject(new Error('Cannot read from file, file does not exist'));
        }
    }
    catch (err) {
        return await Promise.reject(err);
    }
};
exports.readFile = readFile;
const writeFile = async (filePath, data) => {
    try {
        if ((0, fs_1.existsSync)((0, path_1.normalize)((0, path_1.dirname)(filePath)))) {
            await fs_1.promises.writeFile(filePath, data, {
                encoding: 'base64'
            });
            return await Promise.resolve();
        }
        else {
            return await Promise.reject(new Error('Cannot write to file, folder/directory does not exist'));
        }
    }
    catch (err) {
        return await Promise.reject(err);
    }
};
exports.writeFile = writeFile;
const addImage = async (pdfDoc, imageStr, mime) => {
    try {
        let image;
        if (mime.toLowerCase() === 'image/png') {
            image = await pdfDoc.embedPng(imageStr);
        }
        else if (mime.toLowerCase() === 'image/jpeg' ||
            mime.toLowerCase() === 'image/jpg') {
            image = await pdfDoc.embedJpg(imageStr);
        }
        else {
            return await Promise.reject(new Error('Please add a JPEG or a PNG file'));
        }
        const { width, height } = image.size();
        const page = pdfDoc.addPage([width + 10, height + 10]);
        page.drawImage(image, {
            x: 5,
            y: 5,
            width,
            height
        });
        await image.embed();
        return await Promise.resolve(pdfDoc);
    }
    catch (err) {
        return await Promise.reject(err);
    }
};
exports.addImage = addImage;
