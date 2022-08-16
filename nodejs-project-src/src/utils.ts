import { promises, existsSync } from 'fs'
import { normalize, dirname } from 'path'
import { PDFDocument } from 'pdf-lib'

/**
 * Read a file and return the data
 *
 * @param filePath The path of the file
 */
export const readFile = async (filePath: string): Promise<string> => {
  try {
    if (existsSync(normalize(filePath))) {
      const aFileStr = await promises.readFile(filePath, {
        encoding: 'base64'
      })
      return await Promise.resolve(aFileStr)
    } else {
      return await Promise.reject(new Error('Cannot read from file, file does not exist'))
    }
  } catch (err) {
    return await Promise.reject(err)
  }
}

/**
 * Write to a file with data
 *
 * @param filePath The path of the file
 * @param data Data to be written
 */
export const writeFile = async (filePath: string, data: string): Promise<void> => {
  try {
    if (existsSync(normalize(dirname(filePath)))) {
      await promises.writeFile(filePath, data, {
        encoding: 'base64'
      })
      return await Promise.resolve()
    } else {
      return await Promise.reject(
        new Error('Cannot write to file, folder/directory does not exist')
      )
    }
  } catch (err) {
    return await Promise.reject(err)
  }
}

/**
 * Add an image to the document
 *
 * @param pdfDoc The PDF document object
 * @param imageStr base64 representation of the image data
 * @param mime Extension of the image
 */
export const addImage = async (pdfDoc: PDFDocument, imageStr: string, mime: string): Promise<PDFDocument> => {
  try {
    let image
    if (mime.toLowerCase() === 'image/png') {
      image = await pdfDoc.embedPng(imageStr)
    } else if (
      mime.toLowerCase() === 'image/jpeg' ||
      mime.toLowerCase() === 'image/jpg'
    ) {
      image = await pdfDoc.embedJpg(imageStr)
    } else {
      return await Promise.reject(new Error('Please add a JPEG or a PNG file'))
    }

    const { width, height } = image.size()

    const page = pdfDoc.addPage([width + 10, height + 10])

    page.drawImage(image, {
      x: 5,
      y: 5,
      width,
      height
    })
    await image.embed()

    return await Promise.resolve(pdfDoc)
  } catch (err) {
    return await Promise.reject(err)
  }
}
