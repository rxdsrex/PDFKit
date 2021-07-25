const {PDFDocument, StandardFonts, rgb, PageSizes} = require('pdf-lib');
const {normalize} = require('path');
const pageSize = [PageSizes.A4[1], PageSizes.A4[0]];

const {addImage, readFile, writeFile} = require('./utils');

/**
 * Modify an existing pdf to add new pictures
 *
 * @function
 * @param {string} pdfFileLocation location of the existing pdf
 * @param {Array.<Object.<string, string>>} imgFiles Array of images Object
 * @param {string} chapterName Name of the chapter
 * @return {string} base64 output of the modified pdf
 */
const modifyPdf = (pdfFileLocation, imgFiles, chapterName = '') => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingPdfStr = await readFile(pdfFileLocation);
      const pdfDoc = await PDFDocument.load(existingPdfStr);

      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Add chapter name in a page
      if (chapterName !== '') {
        const page = pdfDoc.addPage(pageSize);

        const fontSize = 32;
        const textWidth = helveticaFont.widthOfTextAtSize(
          chapterName,
          fontSize,
        );
        const textHeight = helveticaFont.heightAtSize(fontSize);

        page.drawText(chapterName, {
          x: page.getWidth() / 2 - textWidth / 2,
          y: page.getHeight() / 2 - textHeight / 2,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      }

      for (const image of imgFiles) {
        const imgPath = normalize(image.realPath);
        const imgStr = await readFile(imgPath);
        try {
          addImage(pdfDoc, imgStr, image.mime);
        } catch (err) {
          if (err.message === 'Please add a JPEG or a PNG file') {
            continue;
          } else {
            throw err;
          }
        }
      }

      const pdfStrB64 = await pdfDoc.saveAsBase64({
        dataUri: false,
      });
      writeFile(pdfFileLocation, pdfStrB64);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = modifyPdf;
