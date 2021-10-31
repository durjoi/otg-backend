const { MongoClient } = require("mongodb");

const express = require('express');
require('dotenv').config();
var cors = require('cors')

const { ObjectId } = require('mongodb');





const app = express();
const port = process.env.PORT || 3005;

app.use(express.json());
app.use(cors())


// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oznqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri);


async function run() {
    try {
        await client.connect();
        const database = client.db("otg");
        const eventsCollection = database.collection("events");
        const bookingsCollection = database.collection("bookings");

        // Get All the Events
        app.get('/events', async(req, res) => {

            const events = await eventsCollection.find({})

            if (await events.count() == 0) {
                console.log('No Result Found');
            }

            events.toArray(function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(JSON.stringify(result));
                }
            });

        });

        // Get Event by id
        app.get('/events/:id', async(req, res) => {

            const id = ObjectId(req.params.id);

            const query = { _id: id };

            const events = await eventsCollection.find(query);

            if (await events.count() == 0) {
                console.log('No Result Found');
            }

            events.toArray(function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(JSON.stringify(result));
                }
            });

        });


        // delete Event by id
        app.delete('/events/:id', async(req, res) => {

            const id = ObjectId(req.params.id);

            const query = { _id: id };

            const events = await eventsCollection.deleteOne(query);

            if (events.deletedCount === 1) {
                console.log("Successfully deleted one document.");
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
            }

            res.send("Deleted Successfully");

        });

        // Insert an Event
        app.post('/events', async(req, res) => {
            const newEvent = req.body;
            const result = await eventsCollection.insertOne(newEvent);
            console.log(`A document was inserted in Event Collection with the _id: ${result.insertedId}`);

            res.send(result.insertedId);
        });



        // Get all the Bookings
        app.get('/bookings', async(req, res) => {
            const bookings = await bookingsCollection.find({});

            if (await bookings.count() == 0) {
                console.log('No Result Found');
            }

            bookings.toArray(function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(JSON.stringify(result));
                }
            });
        });

        // Insert new Booking
        app.post('/bookings', async(req, res) => {
            const newEvent = req.body;
            const result = await bookingsCollection.insertOne(newEvent);
            console.log(`A document was inserted in Booking Collection with the _id: ${result.insertedId}`);

            res.send(result.insertedId);
        });

        // delete Booking by id
        app.delete('/bookings/:id', async(req, res) => {

            const id = ObjectId(req.params.id);

            const query = { _id: id };

            const booking = await bookingsCollection.deleteOne(query);

            if (booking.deletedCount === 1) {
                console.log("Successfully deleted one document.");
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
            }

            res.send("Deleted Successfully");

        });

        // Update status by id
        app.put('/bookings/:id', async(req, res) => {

            const id = ObjectId(req.params.id);

            const query = { _id: id };

            // create a document that sets the plot of the movie
            const updateDoc = {
                $set: {
                    status: "Approved"
                },
            };

            const booking = await bookingsCollection.updateOne(query, updateDoc);



            res.send("Updated Successfully");

        });


        // Get Bookings by User Id
        app.get('/bookings/:userid', async(req, res) => {
            const query = { user_id: req.params.userid };

            const bookings = await bookingsCollection.find(query);

            if (await bookings.count() == 0) {
                console.log('No Result Found');
            }

            bookings.toArray(function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(JSON.stringify(result));
                }
            });

        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`OTG Backend Server Listening at http://localhost:${port}`);
})