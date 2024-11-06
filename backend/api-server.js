const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// CORS implemented so that we don't get errors when trying to access the server from a different server location
const cors = require('cors');
app.use(cors());

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  };
 app.use(cors(corsOptions));




const dotenv = require('dotenv');
dotenv.config();


// Stripe config
// This is your test secret API key.
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('sk_test_51QFrgWAnuyiQyip2dSKyOxF0At3LVFFxMudG0kFdLnjvVstcFVc63LNfb669UT6hFEVznLNdKEBhqaC04oOmMJUk00YZUNnEoS');
app.use(express.static('public'));



// Troubleshooting
// Add this (or comment out) this API tracker for Stripe requests
stripe.on('request', request => {
    const currentStack = (new Error()).stack.replace(/^Error/, '')
    console.log(`Making Stripe HTTP request to ${request.path}, callsite: ${currentStack}`)
  })




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
// Fetch all existing bookings (without any filtering)
// GET
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
});

// ------
// Update an existing booking with new information
// NOTE: HTML forms do not have PUT option, they only have GET and POST, so if you try to assign method=PUT in HTML form it just sends it as a GET
// PUT
app.put('/bookings', async (req, res) => {
    
    // booking_id we cannot let be empty/null/undefined
    const bookingId = req.body.booking_id;
    
    // For the others, we initially set these variables to NULL, so that Postgres doesn't overwrite existing values with blank/empty/null values
    let sku = null;
    if (req.body.sku != '') {
        sku = req.body.sku;
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
    
    try {
        const newItem = await itemsPool.query(
            'UPDATE bookings SET sku = COALESCE($1, sku), price_currency = COALESCE($2, price_currency), price_amount = COALESCE($3, price_amount), progress_state = COALESCE($4, progress_state), artist_instagram = COALESCE($5, artist_instagram), artist_mobile = COALESCE($6, artist_mobile) WHERE booking_id = $7',
            [sku, price_currency, price_amount, progress_state, artist_instagram, artist_mobile, bookingId]
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


// REPLACE THIS (can use same or separate pages/routes/endpoints for success and error)
const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
    
    // Troubleshooting
    console.log('create session endpoint-------------------------');
    console.log(req.query.session_id);
    



    const session = await stripe.checkout.sessions.create({
        line_items: [
        {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 'price_1QI237AnuyiQyip25DEfaJsM',
            quantity: 1
        },
        ],
        // Choose payment mode: payment = one-off, subscription = subscription, and setup = future payments
        mode: 'payment', 
        // Specify success and cancel pages (can be the same page and used with ? parameters)
        // the order/success can be any route as long as it matches the route in the confirmation page endpoint (below)
        //success_url: `${YOUR_DOMAIN}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        success_url: `https://www.google.com`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
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
    console.log('order/success endpoint-------------------------');
    console.log(req.query.session_id);
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    const customer = await stripe.customers.retrieve(session.customer);

  res.send(`<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`);
});









// NOT USED FOR ANYTHING NOV 6
// ------
// Stripe Webhook endpoint (to receive post-payment etc information from Stripe)
// STRIPE
// POST

// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
const endpointSecret = 'whsec_pt1T7SJ7bWTryPgVjJaXSFUWVoTgOCbr';

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});




  
  




// =========================






// Run the API server
/*
// Original server
const port = 3000; // 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
*/

// Stripe example
app.listen(4242, () => console.log('Running on port 4242'));

