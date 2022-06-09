const fs = require('fs');
const request = require('request');
const readline = require('readline');

const URL = process.argv[2] || '///';
const FILE_PATH = process.argv[3] || '///';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to save file using content gotten from request (used as callback for fetcher)
const saveFile = function(content) {
  fs.writeFile(FILE_PATH, content, err => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Downloaded and saved ${content.length} bytes to ${FILE_PATH}`);
    }
  });
};

const fetcher = function(done) {
  request(URL, (error, response, body) => {
    if (error) {
      console.log('Failed to save. The URL is invalid.');
    } else {
      console.log('Saving...');
      done(body, FILE_PATH);
    }
  });
};

// Starting point for code. Checks if file already exists
fs.readFile(FILE_PATH, (err) => {
  if (err) {
    // File does not exist, proceed to fetch
    if (err.errno === -2) {
      rl.close();
      fetcher(saveFile);
    } else {
      // Invalid file name
      rl.close();
      console.log('Failed to save. The file path is invalid.');
    }
  } else {
    // Else file does exist, ask user to overwrite
    rl.question('The file already exists. Do you wish to overwrite? [y/n]: ', (answer) => {
      rl.close();
      if (answer !== 'y') {
        console.log('Exiting...');
      } else {
        // User input 'y', proceed to overwrite
        fetcher(saveFile);
      }
    });
  }
});