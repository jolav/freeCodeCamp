const express = require('express');
const app = express();
const multer = require('multer');

const upload = multer({
  // dest: 'uploads/', // dont want to store files on server
  limits: { fileSize: 20971520 } // 20mb
}).single('inputFile');

app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    let output = {
      filesize: ''
    };
    if (err) {
      output.filesize = 'File too large';
    } else {
      const size = (req.file.size / (1024 * 1024)).toFixed(2);
      output.filesize = size + ' mb';
    }
    res.header('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(output, null, 3));
  });
});

app.post('/*', (req, res) => {
  res.redirect('https://jolav.me/freecodecamp');
});

app.get('/*', (req, res) => {
  res.redirect('https://jolav.me/freecodecamp');
});

module.exports = app;
