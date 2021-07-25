// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

const rnBridge = require('rn-bridge');
const fs = require('fs');
// const os = require('os');
const path = require('path');

// Echo every message received from react-native.
rnBridge.channel.on('message', async srcData => {
  try {
    if (srcData.startsWith('{')) {
      const srcDataObj = JSON.parse(srcData);
      const rootPath = rnBridge.app.datadir();
      const dataDir = path.normalize(path.join(rootPath, 'TempDir'));
      await fs.promises.mkdir(dataDir, {recursive: true});
      const filePath = path.normalize(path.join(dataDir, srcDataObj.name));
      await fs.promises.writeFile(filePath, srcDataObj.content, {
        encoding: 'utf-8',
      });
      rnBridge.channel.send(dataDir);
    }
  } catch (err) {
    rnBridge.channel.send(err.message);
  }
});

// Inform react-native node is initialized.
rnBridge.channel.send('Node was initialized.');
