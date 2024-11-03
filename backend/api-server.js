const express = require('express');
const app = express();
app.use(express.json());



const dotenv = require('dotenv');
dotenv.config();


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
        res.json({ allItems });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})
app.post('/bookings', async (req, res) => {
    const { description } = req.body;
    try {
        const newItem = await itemsPool.query(
            'INSERT INTO bookings (slot_description) VALUES ($1) RETURNING *',
            [slot_description]
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