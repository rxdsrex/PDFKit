const {PDFDocument, StandardFonts, rgb, PageSizes} = require('pdf-lib');
const {normalize} = require('path');
const {existsSync} = require('fs');
const pageSize = [PageSizes.A4[1], PageSizes.A4[0]];

const {addImage, readFile, writeFile} = require('./utils');

/**
 * Create a new pdf to add new pictures
 *
 * @function
 * @param {string} pdfFileLocation location where the PDF file will be created
 * @param {import('../../src/types').chapterProps[]} chapters Array of Chapters
 * @return {Promise<void>} base64 output of the pdf
 */
const createPdf = (pdfFileLocation, chapters) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.setCreator('PDFKit');

      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (const chapter of chapters) {
        // Add chapter name in a page
        if (chapter.chapterTitle !== '') {
          const page = pdfDoc.addPage(pageSize);

          const fontSize = 32;
          const textWidth = helveticaFont.widthOfTextAtSize(
            chapter.chapterTitle,
            fontSize,
          );
          const textHeight = helveticaFont.heightAtSize(fontSize);

          page.drawText(chapter.chapterTitle, {
            x: page.getWidth() / 2 - textWidth / 2,
            y: page.getHeight() / 2 - textHeight / 2,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        }

        for (const image of chapter.pages) {
          const imgPath = normalize(image.realPath);
          const imgStr = await readFile(imgPath);
          try {
            await addImage(pdfDoc, imgStr, image.mine);
          } catch (err) {
            if (err.message === 'Please add a JPEG or a PNG file') {
              continue;
            } else {
              throw err;
            }
          }
        }
      }

      const pdfStrB64 = await pdfDoc.saveAsBase64({
        dataUri: false,
      });
      await writeFile(pdfFileLocation, pdfStrB64);
      const created = existsSync(pdfFileLocation);
      resolve(created);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = createPdf;
