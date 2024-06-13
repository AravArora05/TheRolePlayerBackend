const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    const dbPath = path.join(__dirname, 'db.json');
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading db.json');
            return;
        }
        res.status(200).send(data);
    });
};
