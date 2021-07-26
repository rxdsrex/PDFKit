const rnBridge = require('rn-bridge');
const createPdf = require('./createPdf');
const {join, normalize} = require('path');

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

// Inform react-native node is initialized.
rnBridge.channel.send('NodeInit');
