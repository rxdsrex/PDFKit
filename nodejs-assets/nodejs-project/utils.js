const {readFile, writeFile} = require('fs').promises;
const {normalize, dirname} = require('path');
const {existsSync} = require('fs');

const utils = Object.freeze({
  /**
   * Read a file and return the data
   *
   * @param {string} filePath The path of the file
   * @return {Promise<string>}
   */
  readFile: function (filePath) {
    return new Promise(async (resolve, reject) => {
      try {
        if (existsSync(normalize(filePath))) {
          const aFileStr = await readFile(filePath, {
            encoding: 'base64',
          });
          resolve(aFileStr);
        } else {
          reject(new Error('Cannot read from file, file does not exist'));
        }
      } catch (err) {
        reject(err);
      }
    });
  },

  /**
   * Write to a file with data
   *
   * @param {string} filePath The path of the file
   * @param {string} data Data to be written
   * @return {Promise<void>}
   */
  writeFile: function (filePath, data) {
    return new Promise(async (resolve, reject) => {
      try {
        if (existsSync(normalize(dirname(filePath)))) {
          await writeFile(filePath, data, {
            encoding: 'base64',
          });
          resolve();
        } else {
          reject(
            new Error('Cannot write to file, folder/directory does not exist'),
          );
        }
      } catch (err) {
        reject(err);
      }
    });
  },

  /**
   *
   * @param {import('pdf-lib').PDFDocument} pdfDoc The PDF document object
   * @param {string} imageStr base64 representation of the image data
   * @param {string} mime Extension of the image
   * @return {Promise<import('pdf-lib').PDFDocument>}
   */
  addImage: function (pdfDoc, imageStr, mime) {
    return new Promise(async (resolve, reject) => {
      try {
        let image;
        if (mime.toLowerCase() === 'image/png') {
          image = await pdfDoc.embedPng(imageStr);
        } else if (
          mime.toLowerCase() === 'image/jpeg' ||
          mime.toLowerCase() === 'image/jpg'
        ) {
          image = await pdfDoc.embedJpg(imageStr);
        } else {
          reject(new Error('Please add a JPEG or a PNG file'));
          return;
        }

        const {width, height} = image.size();

        const page = pdfDoc.addPage([width + 10, height + 10]);

        page.drawImage(image, {
          x: 5,
          y: 5,
          width: width,
          height: height,
        });

        resolve(pdfDoc);
      } catch (err) {
        reject(err);
      }
    });
  },
});

module.exports = utils;
