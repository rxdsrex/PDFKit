// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

const rnBridge = require('rn-bridge');
// const fs = require('fs');
// const os = require('os');
// const path = require('path');

rnBridge.channel.on('createPdf', chapters => {
  const ids = chapters.map(chapter => {
    return chapter.id;
  });
  rnBridge.channel.post('onCreatePdfDone', ids);
});

// Inform react-native node is initialized.
rnBridge.channel.send('NodeInit');
