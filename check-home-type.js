const fs = require('fs');
const path = require('path');

const frPath = path.join(__dirname, 'messages/fr.json');
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

console.log('Type of messages.home:', typeof fr.home);
if (typeof fr.home === 'string') {
    console.log('Value:', fr.home);
} else {
    console.log('Keys in home:', Object.keys(fr.home));
}

console.log('Type of messages.header.home:', typeof fr.header?.home);
