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


app.get('/bookings', async(req, res) => {
    try {
        const allItems = await itemsPool.query(
            'SELECT * FROM bookings'
        );
        res.json({ allItems.rows });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})
app.post('/bookings', async (req, res) => {
    
    //const { new_booking } = req.body;
    //.const new_booking = req.body;
    const new_booking = req.body.slot_description;
    //const new_booking = 'Mon 4 Nov 16:30';
    try {
        const newItem = await itemsPool.query(
            'INSERT INTO bookings (slot_description) VALUES ($1) RETURNING *',
            [new_booking]
        );
        res.json({ 
            message: "New booking added!",
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