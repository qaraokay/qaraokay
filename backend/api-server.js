const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS implemented so that we don't get errors when trying to access the server from a different server location
const cors = require('cors');
app.use(cors());

const dotenv = require('dotenv');
dotenv.config();


//const fetch = require('node-fetch');



// Define connection to database
const { Pool } = require('pg');
const itemsPool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
module.exports = itemsPool;

// ------
// Fetch all existing bookings (without any filtering)
app.get('/bookings', async(req, res) => {
    try {
        const allItems = await itemsPool.query(
            'SELECT * FROM bookings'
        );
        res.json(allItems.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})


// ------
// Fetch specific booking
// since values in body is not well supported for GET we use the
// pathname method of Express.js like /bookings/id/123456

app.get('/bookings/id/:booking_id', async(req, res) => {
    const bookingId = req.params.booking_id;
    try {
        const allItems = await itemsPool.query(
            'SELECT * FROM bookings WHERE booking_id=$1',
            [bookingId]
        );
        res.json(allItems.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})



// ------
// Create a completely new booking 
app.post('/bookings', async (req, res) => {

    const slotDescription = req.body.slot_description;
    const sku = req.body.sku;
    //const new_booking = 'Mon 4 Nov 16:30';
    try {
        const newItem = await itemsPool.query(
            'INSERT INTO bookings (slot_description, sku) VALUES ($1, $2) RETURNING *',
            [slotDescription, sku]
        );
        res.json({ 
            message: "POST New booking added!",
            item: newItem.rows
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

// ------
// Update an existing booking with new information
// NOTE: HTML forms do not have PUT option, they only have GET and POST, so if you try to assign method=PUT in HTML form it just sends it as a GET
app.put('/bookings', async (req, res) => {
    
    const bookingId = req.body.booking_id;
    const sku = req.body.sku;
    try {
        const newItem = await itemsPool.query(
            'UPDATE bookings SET sku = $1 WHERE booking_id = $2',
            [sku, bookingId]
        );
        res.json({ 
            message: "PUT Booking updated!",
            item: newItem.rows
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})


const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});