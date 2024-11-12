// -----
// Enable Express.js
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));



// -----
// Localhost or Render? Which one to use
//const MY_SERVER_URL='http://localhost:4242';
const MY_SERVER_URL='https://qaraokay-fullstack.onrender.com';



// -----
// CORS implemented so that we don't get errors when trying to access the server from a different server location
const cors = require('cors');
app.use(cors());

const corsOptions = {
    //origin: 'http://localhost:3000',
    // ----- CHANGE!!!!!
    origin: "*",
    // ------
    optionsSuccessStatus: 200,
  };
 app.use(cors(corsOptions));


// -----
// Enable DotEnv for backend
const dotenv = require('dotenv');
dotenv.config();


// -----
// Enable Nodemailer, Gmail and OAuth (for sending emails)
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;



// -----
// Stripe config
const stripe = require('stripe')(process.env.STRIPE_KEY);
/*
// Troubleshooting
// Add this (or comment out) this API tracker for Stripe requests
stripe.on('request', request => {
    const currentStack = (new Error()).stack.replace(/^Error/, '')
    console.log(`Making Stripe HTTP request to ${request.path}, callsite: ${currentStack}`)
  })
*/


// -----
// Define connection to database
const { Pool } = require('pg');
const itemsPool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
module.exports = itemsPool;







// =========================
// API Endpioints



// ------
// Fetch all booking slots with all information from the database (without any filtering)
// GET
app.get('/bookings', async(req, res) => {
    try {
        const allItems = await itemsPool.query(
            'SELECT * FROM bookings ORDER BY slot_start_time ASC'
        );
        res.json(allItems.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
});




// ------
// Fetch all AVAILABLE booking slots with all information from the database
// GET
app.get('/bookings/available', async(req, res) => {
    try {
        const allItems = await itemsPool.query(
            'SELECT * FROM bookings WHERE progress_state = $1 ORDER BY slot_start_time ASC',
            ['AVAILABLE']
        );
        res.json(allItems.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
});





// ------
// Fetch specific booking
// since values in body is not well supported for GET we use the
// pathname method of Express.js like /bookings/id/123456
// GET

app.get('/bookings/id/:booking_id', async(req, res) => {
    const bookingId = req.params.booking_id;
    try {
        const allItems = await itemsPool.query(
            'SELECT * FROM bookings WHERE booking_id=$1',
            [bookingId]
        );
        res.json(allItems.rows[0]);  // Note adding the [0] takes the only row, and that way doesn't create an unnecessary extra json [ ] around the response
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
});



// ------
// Create a completely new booking
// POST 
app.post('/bookings', async (req, res) => {

    const slotDescription = req.body.slot_description;
    const sku = req.body.sku;
    //const new_booking = 'Mon 4 Nov 16:30';
    try {
        const newItem = await itemsPool.query(
            'INSERT INTO bookings (slot_description) VALUES ($1) RETURNING *',
            [slotDescription]
        );
        res.json({ 
            message: "POST New booking added!",
            item: newItem.rows
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
});



// ------
// Update an existing booking with new information
// NOTE: HTML forms do not have PUT option, they only have GET and POST, so if you try to assign method=PUT in HTML form it just sends it as a GET
// PUT
app.put('/bookings', async (req, res) => {
    
    // Troubleshooting
    console.log('---------- PUT Bookings endpoint called');
    console.log(req.body);
    
    // booking_id we cannot let be empty/null/undefined
    const bookingId = req.body.booking_id;
    
    // For the others, we initially set these variables to NULL, so that Postgres doesn't overwrite existing values with blank/empty/null values
    
    
    let booking_updated_at = null;
    if (req.body.booking_updated_at != '') {
        booking_updated_at = req.body.booking_updated_at;
    }

    let stripe_price_id = null;
    if (req.body.stripe_price_id != '') {
        stripe_price_id = req.body.stripe_price_id;
    }

    let price_currency = null;
    if (req.body.price_currency != '') {
        price_currency = req.body.price_currency;
    }
    
    let price_amount = null;
    if (req.body.price_amount != '') {
        price_amount = req.body.price_amount;
    }

    let progress_state = null;
    if (req.body.progress_state != '') {
        progress_state = req.body.progress_state;
    }

    let artist_instagram = null;
    if (req.body.artist_instagram != '') {
        artist_instagram = req.body.artist_instagram;
    }

    let artist_mobile = null;
    if (req.body.artist_mobile != '') {
        artist_mobile = req.body.artist_mobile;
    }

    let songs_quantity = null;
    if (req.body.songs_quantity != '') {
        songs_quantity = req.body.songs_quantity;
    }


    try {
        const newItem = await itemsPool.query(
            'UPDATE bookings SET stripe_price_id = COALESCE($1, stripe_price_id), price_currency = COALESCE($2, price_currency), price_amount = COALESCE($3, price_amount), progress_state = $4, artist_instagram = COALESCE($5, artist_instagram), artist_mobile = COALESCE($6, artist_mobile), songs_quantity = COALESCE($7, songs_quantity), booking_updated_at = $8 WHERE booking_id = $9',
            [stripe_price_id, price_currency, price_amount, progress_state, artist_instagram, artist_mobile, songs_quantity, booking_updated_at, bookingId]
        );
        res.json({ 
            message: "PUT Booking updated!",
            item: newItem.rows
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
});







// ------
// Create a Stripe Checkout Session
// STRIPE
// POST

app.post('/create-checkout-session', async (req, res) => {
    
    // Troubleshooting
    console.log('create session endpoint-------------------------');
    
    // Fetch the booking_id from the order confirmation page (its in field called stripe_price_id)
    const booking_id = req.body.booking_id;
    console.log(booking_id);
    
    // Fetch the priceID from the order confirmation page (its in field called stripe_price_id)
    const price_id = req.body.stripe_price_id;
    console.log(price_id);

    

    const session = await stripe.checkout.sessions.create({
        line_items: [
        {
            price: price_id,
            
            quantity: 1
        },
        ],
        // Choose payment mode: payment = single purchase, subscription = subscription, and setup = future payments
        mode: 'payment', 
        // This creates a new customer (seems to be needed for redirects etc)
        customer_creation: 'always',
        // This is used to match Stripe session to our internal systems, in this case we put the booking_id to this field
        client_reference_id: booking_id,
        // Specify success and cancel pages (can be the same page and used with ? parameters)
        // the order/success can be any route as long as it matches the route in the confirmation page endpoint (below)
        success_url: `${MY_SERVER_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        //success_url: `https://qaraokay-fullstack.onrender.com/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${MY_SERVER_URL}?canceled=true`,
        //cancel_url: `https://qaraokay-fullstack.onrender.com?canceled=true`,
    });
    // Troubleshooting
    console.log('session created-------------------------');
    console.log(req.query.session_id);


    // After creating the session, redirect your customer to the URL for the Checkout page returned in the response.
    res.redirect(303, session.url);
});







// ------
// Create a Stripe success page endpoint (which you can then use to redirect)
// STRIPE
// GET


app.get('/order/success', async (req, res) => {
    // Troubleshooting
    console.log('success endpoint-------------------------');
    console.log(req.query.session_id);
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    

    // Capture key information from the Stripe session object
    const currency = session.currency;
    const amount_subtotal = session.amount_subtotal;
    const amount_total = session.amount_total;
    const payment_status = session.payment_status;
    const booking_id = session.client_reference_id; // we inserted the original booking_id into Stripe session's client_reference_id
    const progress_state = 'PAID_ONLINE';
    const booking_updated_at = new Date(Date.now()).toISOString();
    const customer = await stripe.customers.retrieve(session.customer);
    const artist_email = customer.email;

    // Generate a booking code
    // REPLACE WITH BETTER ALGORITHM
    const booking_code_raw = booking_id.toString()+Math.floor(Math.random() * 999) + 100;
    const booking_code = booking_code_raw.toString(16);
    

    // Gneerate a description for the payment description
    const payment_description = 'stripe_'+currency+amount_total+'_'+payment_status;

    
      

    

    // Update the bookings database (booking_id has bee delivered inside the Stripe session)
    // + Create the html page with the confirmation

    try {
        const newItem = await itemsPool.query(
            'UPDATE bookings SET booking_code = $1, payment_description = $2, progress_state = $3, artist_email = $4, booking_updated_at = $5 WHERE booking_id = $6',
            [booking_code, payment_description, progress_state, artist_email, booking_updated_at, booking_id]
        );
        /*res.json({ 
            message: "PUT Booking updated!",
            item: newItem.rows
         });
         */
         
        // ------
        // Send email (using Nodemailer, OAuth and Gmail)
        const oauth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
          );
          
          oauth2Client.setCredentials({
            refresh_token:
              process.env.REFRESH_TOKEN,
          });
          
          const accessToken = oauth2Client.getAccessToken();
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              type: "OAuth2",
              user: process.env.USER_EMAIL_SENDER,
              clientId:
                process.env.CLIENT_ID,
              clientSecret: process.env.CLIENT_SECRET,
              refreshToken:
              process.env.REFRESH_TOKEN,
              accessToken,
            },
          });
          
          transporter.sendMail({
            from: process.env.USER_EMAIL_SENDER,
            to: artist_email,
            subject: "Sending email using Nodemailer and OAuth 2.0",
            text: "Sent!",
          });

        // Redirect to confirmation page
        // ...

        // Generate HTML page
        res.send(`<html><body><h1>Booking completed!</h1>booking_id:<div>${booking_id}</div>booking_code:<div>${booking_code}</div>email:<div>${artist_email}</div>currency:<div>${currency}</div>amount_subtotal:<div>${amount_subtotal}</div></div>amount_total:<div>${amount_total}</div></div>payment_status:<div>${payment_status}</div>payment_description:<div>${payment_description}</div>progress_state:<div>${progress_state}</div></body></html>`);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }


    //const customer = await stripe.customers.retrieve(session.customer);
    //res.send(`<html><body><h1>Thanks for your order, ${customer.name}!</h1><br>session data:<div>${session}</div></body></html>`);
    

});





// =========================






// Run the API server

const port = 4242; 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
