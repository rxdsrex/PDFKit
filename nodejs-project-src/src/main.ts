import { join, normalize } from 'path'
import createPdf from './createPdf'
import modifyPdf from './modifyPdf'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rnBridge = require('rn-bridge')

export interface Results {
  path: string
  fileName: string
  localIdentifier: string
  width: number
  height: number
  mime: string
  type: string
  size: number
  bucketId?: number
  realPath: string
  parentFolderName?: string
  thumbnail?: string
  creationDate?: string
}

export interface chapterProps {
  id: string
  chapterTitle: string
  pages: Results[]
}

let nonStandardImagesFound = false

export const setNonStandardImagesFound = (value: boolean): void => {
  nonStandardImagesFound = value
}

rnBridge.channel.on('createPdf', async (chapters: chapterProps[], cacheDir: string, filename: string) => {
  try {
    setNonStandardImagesFound(false)
    const pdfFileLocation = normalize(join(cacheDir, filename))
    const created = await createPdf(pdfFileLocation, chapters)
    if (created) {
      rnBridge.channel.post('onCreatePdfDone', pdfFileLocation, nonStandardImagesFound)
    } else {
      rnBridge.channel.post('onCreatePdfDone', '', nonStandardImagesFound)
    }
  } catch (err: any) {
    let errMsg = 'Error in PDF creation service'
    if ((Boolean((err?.message))) && typeof err.message === 'string') {
      errMsg = err.message
    }
    rnBridge.channel.post('onCreatePdfError', errMsg)
  }
})

rnBridge.channel.on('modifyPdf', async (chapters: chapterProps[], filePath: string) => {
  try {
    setNonStandardImagesFound(false)
    const pdfFileLocation = normalize(filePath)
    const modified = await modifyPdf(pdfFileLocation, chapters)
    if (modified) {
      rnBridge.channel.post('onModifyPdfDone', pdfFileLocation, nonStandardImagesFound)
    } else {
      rnBridge.channel.post('onModifyPdfDone', '', nonStandardImagesFound)
    }
  } catch (err: any) {
    let errMsg = 'Error in PDF modification service'
    if ((Boolean((err?.message))) && typeof err.message === 'string') {
      errMsg = err.message
    }
    rnBridge.channel.post('onModifyPdfError', errMsg)
  }
})

// Inform react-native node is initialized.
rnBridge.channel.send('NodeInit')
