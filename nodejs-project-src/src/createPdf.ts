import { addImage, readFile, writeFile } from './utils'
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib'
import { normalize } from 'path'
import { existsSync } from 'fs'
import { chapterProps, setNonStandardImagesFound } from './main'
const pageSize: [number, number] = [PageSizes.A4[1], PageSizes.A4[0]]

/**
 * Create a new pdf to add new pictures
 *
 * @param pdfFileLocation location where the PDF file will be created
 * @param chapters Array of Chapters
 */
const createPdf = async (pdfFileLocation: string, chapters: chapterProps[]): Promise<boolean> => {
  try {
    const pdfDoc = await PDFDocument.create()
    pdfDoc.setCreator('PDFKit')

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    for (const chapter of chapters) {
      // Add chapter name in a page
      if (chapter.chapterTitle !== '') {
        const page = pdfDoc.addPage(pageSize)

        const fontSize = 32
        const textWidth = helveticaFont.widthOfTextAtSize(
          chapter.chapterTitle,
          fontSize
        )
        const textHeight = helveticaFont.heightAtSize(fontSize)

        page.drawText(chapter.chapterTitle, {
          x: page.getWidth() / 2 - textWidth / 2,
          y: page.getHeight() / 2 - textHeight / 2,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0)
        })
      }

      for (const image of chapter.pages) {
        const imgPath = normalize(image.realPath)
        const imgStr = await readFile(imgPath)
        try {
          await addImage(pdfDoc, imgStr, image.mime)
        } catch (err: any) {
          if (err.message === 'Please add a JPEG or a PNG file') {
            setNonStandardImagesFound(true)
            continue
          } else {
            throw err
          }
        }
      }
    }

    const pdfStrB64 = await pdfDoc.saveAsBase64({
      dataUri: false
    })
    await writeFile(pdfFileLocation, pdfStrB64)
    const created = existsSync(pdfFileLocation)
    return await Promise.resolve(created)
  } catch (err) {
    return await Promise.reject(err)
  }
}

export default createPdf
