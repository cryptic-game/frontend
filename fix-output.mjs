import fs from 'fs';

const files = fs.readdirSync('./dist/en-US');

for (let file of files) {
  fs.renameSync('./dist/en-US/' + file, './dist/' + file);
}

fs.renameSync('./dist/de-DE', './dist/de')
fs.rmdirSync('./dist/en-US');
