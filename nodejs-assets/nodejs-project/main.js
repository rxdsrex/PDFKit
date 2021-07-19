/* eslint-disable no-bitwise */
// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

const rnBridge = require('rn-bridge');
// const fs = require('fs');
// const os = require('os');
// const path = require('path');

// Echo every message received from react-native.
rnBridge.channel.on('message', msg => {
  rnBridge.channel.send(msg);
});

// Inform react-native node is initialized.
rnBridge.channel.send('Node was initialized.');
