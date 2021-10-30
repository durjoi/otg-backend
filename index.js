const { MongoClient } = require("mongodb");

const express = require('express')

require('dotenv').config()



const app = express()
const port = 3005


// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oznqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri);


async function run() {
  try {
    await client.connect();
    const database = client.db("otg");
    const eventsCollection = database.collection("events");
    const bookingsCollection = database.collection("bookings");
    
    app.get('/events', (req, res) => {
        console.log("Yaay!! working")
        res.send('Events!')
    })



    app.get('/bookings', (req, res) => {
        console.log("Yaay!! working")
        res.send('Bookings!')
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    console.log("Yaay!! working")
    res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`OTG Backend Server Listening at http://localhost:${port}`)
})