const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
// middleware
app.use(cors());
app.use(express.json());

//user: dbuser1  pass:  NNzQlDlSQ7XX6YUv


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujdvp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const itemCollection = client.db("wareHouse").collection("item");
        //get users
        app.get('/item', async(req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items)
        })

        //My items
        app.get('/myItem', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        //Most Popular Items
        app.get('/mostPopularItem', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.limit(6).toArray();
            res.send(items)
        })
        
        //specific user
        app.get('/item/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.findOne(query);
            res.send(result);
        })

        //POST user :  add a new user
        app.post('/item', async(req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result  = await itemCollection.insertOne(newUser)
            res.send(result);
        })

        //update user
        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;
            console.log(updatedItem);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    name:updatedItem.name,
                    email:updatedItem.email,
                    img:updatedItem.img,
                    supplierName:updatedItem.supplierName,
                    quantity: updatedItem.quantity,
                    price: updatedItem.price,
                    description: updatedItem.description
                }
            };
            const result = await itemCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        //delete a user
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Running server");
})
app.listen(port, () => {
    console.log("listening port:",port);
})