require('dotenv').config();
const fs = require('fs');
const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 8000; 

if (!uri) {
    console.error('MONGODB_URI is not defined. Please set it in the environment variables.');
    process.exit(1);
}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let articlesCollection, authorsCollection;

async function main() {
    try {
        await client.connect();
        const database = client.db("ContentDB");
        articlesCollection = database.collection("Articles");
        authorsCollection = database.collection("Authors");

        // Ensure unique indexes
        await articlesCollection.createIndex({ "title": 1 }, { unique: true });
        await authorsCollection.createIndex({ "name": 1 }, { unique: true });

        const jsonData = fs.readFileSync('./db.json', 'utf8');
        const data = JSON.parse(jsonData);
        const articlesData = data.articles;
        const authorsData = data.authors;

        // Upsert articles
        for (const article of articlesData) {
            const query = { title: article.title };
            const update = { $set: article };
            const options = { upsert: true };
            await articlesCollection.updateOne(query, update, options);
        }
        console.log('Articles updated or inserted as needed.');

        // Upsert authors
        for (const author of authorsData) {
            const query = { name: author.name };
            const update = { $set: author };
            const options = { upsert: true };
            await authorsCollection.updateOne(query, update, options);
        }
        console.log('Authors updated or inserted as needed.');
    } catch (error) {
        console.error('Error:', error);
    }
}

app.get('/articles', async (req, res) => {
    try {
        const articles = await articlesCollection.find().toArray();
        res.json(articles);
    } catch (error) {
                res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.get('/authors', async (req, res) => {
    try {
        const authors = await authorsCollection.find().toArray();
        res.json(authors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch authors' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    main();
});
