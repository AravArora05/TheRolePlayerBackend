require('dotenv').config();
const fs = require('fs');
const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI is not defined. Please set it in the environment variables.');
    process.exit(1);
}

console.log('Connecting to MongoDB at URI:', uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let articlesCollection, authorsCollection;

async function main() {
    try {
        await client.connect();
        console.log('Connected to MongoDB.');

        const database = client.db("ContentDB");
        articlesCollection = database.collection("Articles");
        authors category = database.collection("Authors");

        console.log('Collections ready.');

        // Load initial data from local file
        const jsonData = fs.readFileSync('./db.json', 'utf8');
        const data = JSON.parse(jsonData);
        const articlesData = data.articles;
        const authorsData = data.authors;

        console.log(`Inserting articles and authors data.`);

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
            await authors category.updateOne(query, update, options);
        }
        console.log('Authors updated or inserted as needed.');
    } catch (error) {
        console.error('Error connecting or inserting data:', error);
    }
}

app.get('/articles', async (req, res) => {
    console.log('Fetching articles...');
    try {
        const articles = await articlesCollection.find().toArray();
        console.log('Articles fetched:', articles.length);
        res.json(articles);
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.get('/authors', async (req, res) => {
    console.log('Fetching authors...');
    try {
        const authors = await authorsCollection.find().toArray();
        console.log('Authors fetched:', authors.length);
        res.json(authors);
    } catch (error) {
        console.error('Failed to fetch authors:', error);
        res.status(500).json({ error: 'Failed to fetch authors' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    main();
});
