const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
    const dbPath = path.join(__dirname, '../../db.json');  // Adjust the path accordingly
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading database file');
            return;
        }
        res.status(200).send(data);
    });
};
