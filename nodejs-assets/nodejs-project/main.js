const rnBridge = require('rn-bridge');
const {join, normalize} = require('path');

const createPdf = require('./createPdf');
const modifyPdf = require('./modifyPdf');

rnBridge.channel.on('createPdf', async (chapters, cacheDir, filename) => {
  try {
    const pdfFileLocation = normalize(join(cacheDir, filename));
    const created = await createPdf(pdfFileLocation, chapters);
    if (created) {
      rnBridge.channel.post('onCreatePdfDone', pdfFileLocation);
    } else {
      rnBridge.channel.post('onCreatePdfDone', '');
    }
  } catch (err) {
    rnBridge.channel.post('onCreatePdfError', err);
  }
});

rnBridge.channel.on('modifyPdf', async (chapters, filePath) => {
  try {
    const pdfFileLocation = normalize(filePath);
    const created = await modifyPdf(pdfFileLocation, chapters);
    if (created) {
      rnBridge.channel.post('onModifyPdfDone', pdfFileLocation);
    } else {
      rnBridge.channel.post('onModifyPdfDone', '');
    }
  } catch (err) {
    rnBridge.channel.post('onModifyPdfError', err);
  }
});

// Inform react-native node is initialized.
rnBridge.channel.send('NodeInit');
