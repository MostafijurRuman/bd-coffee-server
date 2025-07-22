const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// 2. Middlewares
app.use(cors());
app.use(express.json());

// 3. MongoDB URI & Client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fk4sfju.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// 4. CRUD Routes
async function run() {
  try {
    await client.connect();
    const db = client.db("CoffeeDB");
    const Coffees = db.collection("Coffees");

    // All CRUD operations here...
    
    // Get form new coffees
    app.post('/coffees',async(req,res)=>{
        const newCoffee =req.body;
        const result = await Coffees.insertOne(newCoffee);
        res.send(result);
    })

    // Api for all coffees
    app.get('/coffees',async(req,res)=>{
        const result = await Coffees.find().toArray();
        res.send(result);
    })

    // Get a specific coffee by id
    app.get('/coffees/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const coffee = await Coffees.findOne(query)
        res.send(coffee)
    })

    // Delete by id one at time
     app.delete('/coffees/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await Coffees.deleteOne(query)
        res.send(result)
    })

		// Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close(); // keep it open if you're hosting continuously
  }
}
run().catch(console.dir);

// 5. Basic route
app.get('/', (req, res) => {
  res.send('Simple CRUD Server is Running...');
});

// 6. Listen to port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

