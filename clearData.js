require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MONGODB_URI is not defined. Please set it in the environment variables.');
    process.exit(1);
}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function clearData() {
    try {
        await client.connect();
        const database = client.db("ContentDB");
        const articlesCollection = database.collection("Articles");
        const authorsCollection = database.collection("Authors");

        await articlesCollection.deleteMany({});
        await authorsCollection.deleteMany({});
        console.log('Data cleared successfully');
    } catch (error) {
        console.error('Error clearing data:', error);
    } finally {
        await client.close();
    }
}

clearData();
