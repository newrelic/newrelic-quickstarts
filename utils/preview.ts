const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port: number = 3000;

const QUICKSTART_PATH: string = process.argv[2];

fs.access(`../quickstarts/${QUICKSTART_PATH}`, (error: any) => {
  if (error) {
    throw new Error(`Path: ${QUICKSTART_PATH} does not exist.`);
  } else {
    const quickStartPath = path.join(path.resolve(__dirname, '..'), `/quickstarts/${QUICKSTART_PATH}`);
  
    app.use(express.static(quickStartPath));

    app.listen(port, () => {
      console.log("\x1b[32m", `Preview here: http://localhost:3000/config.yml`);
    });
  }
});

