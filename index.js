const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dawimtn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('letsTour').collection('services');
        const reviewCollection = client.db('letsTour').collection('allReview');

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // AllReview api
        app.get('/allReview', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const allReview = await cursor.toArray();
            res.send(allReview);
        });


        app.post('/allReview', async (req, res) => {
            const allReview = req.body;
            const result = await reviewCollection.insertOne(allReview);
            res.send(result);
        });
    }
    finally {

    }

}

run().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('tour server is running')
});
app.listen(port, () => {
    console.log(`tour port server running on ${port}`)
});