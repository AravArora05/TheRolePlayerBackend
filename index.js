require('dotenv').config();
const fs = require('fs');
const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;  // Corrected environment variable name
const PORT = process.env.PORT || 3000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
    try {
        await client.connect();
        const database = client.db("ContentDB");
        const articlesCollection = database.collection("Articles");
        const authorsCollection = database.collection("Authors");
        const jsonData = fs.readFileSync('./db.json', 'utf8');
        const data = JSON.parse(jsonData);
        const articlesData = data.articles;
        const authorsData = data.authors;

        const articlesResult = await articlesCollection.insertMany(articlesData);
        console.log(`${articlesResult.insertedCount} articles were inserted`);

        const authorsResult = await authorsCollection.insertMany(authorsData);
        console.log(`${authorsResult.insertedCount} authors were inserted`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

main();
