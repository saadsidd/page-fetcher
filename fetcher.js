const fs = require('fs');
const request = require('request');
const url = process.argv[2];
const filePath = process.argv[3];

const fetcher = function(url, filePath, callback) {
  request(url, (error, response, body) => {
    callback(body);
  });
};

fetcher(url, filePath, (content) => {
  fs.writeFile(filePath, content, err => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Downloaded and saved ${content.length} bytes to ${filePath}`);
    }
  });
});