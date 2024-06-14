require('dotenv').config();
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

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let articlesCollection, authorsCollection;

async function connectDB() {
    await client.connect();
    const database = client.db("ContentDB");
    articlesCollection = database.collection("Articles");
    authorsCollection = database.collection("Authors");
    console.log('Connected to MongoDB and collections are set.');
}

// Connect to the database
connectDB().catch(console.error);

app.get('/articles', async (req, res) => {
    try {
        const articles = await articlesCollection.find().toArray();
        res.json(articles);
        console.log('Articles fetched:', articles.length);
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.get('/authors', async (req, res) => {
    try {
        const authors = await authorsCollection.find().toArray();
        res.json(authors);
        console.log('Authors fetched:', authors.length);
    } catch (error) {
        console.error('Failed to fetch authors:', error);
        res.status(500).json({ error: 'Failed to fetch authors' });
    }
});
//cleaning

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
