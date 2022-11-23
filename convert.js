// convert txt file to json file
// inside the txt file is "23351 : Royal Silver Urn", then convert it to "23351" : "Royal Silver Urn"
// and save it to json file with random name

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: fs
        .create
        .ReadStream
        .path.join(__dirname, 'gm.txt')
});

rl.on('line', (line) => {
    const [key, value] = line.split(':');
    const obj = {
        [key]: value
    };
    const json = JSON.stringify(obj);
    fs
        .writeFile
        .path.join(__dirname, 'output.json')
}, (err) => {
    if (err) {
        console.log(err);
    }
} );