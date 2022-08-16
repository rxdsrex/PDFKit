"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const pdf_lib_1 = require("pdf-lib");
const path_1 = require("path");
const fs_1 = require("fs");
const main_1 = require("./main");
const pageSize = [pdf_lib_1.PageSizes.A4[1], pdf_lib_1.PageSizes.A4[0]];
const createPdf = async (pdfFileLocation, chapters) => {
    try {
        const pdfDoc = await pdf_lib_1.PDFDocument.create();
        pdfDoc.setCreator('PDFKit');
        const helveticaFont = await pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        for (const chapter of chapters) {
            if (chapter.chapterTitle !== '') {
                const page = pdfDoc.addPage(pageSize);
                const fontSize = 32;
                const textWidth = helveticaFont.widthOfTextAtSize(chapter.chapterTitle, fontSize);
                const textHeight = helveticaFont.heightAtSize(fontSize);
                page.drawText(chapter.chapterTitle, {
                    x: page.getWidth() / 2 - textWidth / 2,
                    y: page.getHeight() / 2 - textHeight / 2,
                    size: fontSize,
                    font: helveticaFont,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0)
                });
            }
            for (const image of chapter.pages) {
                const imgPath = (0, path_1.normalize)(image.realPath);
                const imgStr = await (0, utils_1.readFile)(imgPath);
                try {
                    await (0, utils_1.addImage)(pdfDoc, imgStr, image.mime);
                }
                catch (err) {
                    if (err.message === 'Please add a JPEG or a PNG file') {
                        (0, main_1.setNonStandardImagesFound)(true);
                        continue;
                    }
                    else {
                        throw err;
                    }
                }
            }
        }
        const pdfStrB64 = await pdfDoc.saveAsBase64({
            dataUri: false
        });
        await (0, utils_1.writeFile)(pdfFileLocation, pdfStrB64);
        const created = (0, fs_1.existsSync)(pdfFileLocation);
        return await Promise.resolve(created);
    }
    catch (err) {
        return await Promise.reject(err);
    }
};
exports.default = createPdf;
