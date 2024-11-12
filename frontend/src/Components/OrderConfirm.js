//OrderConfirm.js
import React from 'react'
import NavBar from './NavBar'
import { useLocation } from "react-router-dom";
import { Fragment, useState, useEffect } from 'react';
import '../App.css';


// -----
// Localhost or Render? Which one to use =
//const MY_SERVER_URL='http://localhost:4242';
const MY_SERVER_URL='https://qaraokay-fullstack.onrender.com';



// Full path to Stripe Checkout session
const checkoutUrl = MY_SERVER_URL+'/create-checkout-session';
console.log('--------- Checkout form submit URL:');
console.log(checkoutUrl);

// This shows the order summary confirmation
// and the submit button + API endpioint
const ProductDisplay = ({ booking_id, stripe_price_id, currency, amount, description, slot_date, slot_time, songs_quantity }) => (
  <Fragment>

    <header>
        <h1>Confirm</h1>
    </header>
    
    <section>
      <div className="product">
        <div className="description">
        <h3>{description}</h3>
        <h3>{slot_date}</h3>
        <h3>{slot_time}</h3>
        <br></br>
        <br></br>
        <h3>{songs_quantity} songs</h3>
        <br></br>
        <br></br>
        <h3>{amount} {currency}</h3>
        
        </div>
      </div>
      </section>
      
      <section>
      <form action={checkoutUrl} method="POST">
        <input type="hidden" name="booking_id" value={booking_id}></input>
        <input type="hidden" name="stripe_price_id" value={stripe_price_id}></input>
        <br></br>
        <br></br>
        <button type="submit">
          Go to payment
        </button>
      </form>
    </section>
  </Fragment>
);
  


// This is the main application for this page
  
export default function OrderConfirm() {
    
    const [stripe_price_id, setStripe_price_id] = useState("");
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("");
    const [slot_date, setSlot_date] = useState("");
    const [slot_time, setSlot_time] = useState("");
    const [songs_quantity, setSongs_quantity] = useState("");


    
    // Catch the booking_id from the previous screen/page
    const location = useLocation();
    const { booking_id } = location.state;
    console.log('---- booking_id');
    console.log(booking_id);

    
    // Make an API call to get the Stripe price ID + other information for this booking
    const apiUrl = MY_SERVER_URL+'/bookings/id/'+booking_id;
        
    
    console.log('----- Making API call to get price id + other booking details: ');
    console.log(apiUrl);

    fetch(apiUrl)
        .then((response) => {
            console.log('---- response raw');
            console.log(response);           
            return response.json();
        })
        .then((data) => {
            console.log('---- response as JSON');
            console.log(data);
            const dataString = JSON.stringify(data);
            const objectValue = JSON.parse(dataString);
            const stripe_price_id = objectValue['stripe_price_id'];
            const currency = objectValue['price_currency'];
            const amount = objectValue['price_amount'];
            const songs_quantity = objectValue['songs_quantity'];
            // Format the slot start time
            const timestamp = new Date(objectValue['slot_start_time']);
            const date_options =  { weekday: 'short', day: 'numeric', month: 'short' };
            const time_options =  { hour: 'numeric', hour12: false, minute: 'numeric' };
            const slot_date = (timestamp.toLocaleDateString("en-US", date_options)); 
            const slot_time = (timestamp.toLocaleTimeString("en-US", time_options)); 
            console.log('------- slot date:');
            console.log(slot_date);
            console.log('------- slot time:');
            console.log(slot_time);

            console.log('---- stripe_price_id:');
            console.log(stripe_price_id);
            setStripe_price_id(stripe_price_id);
            setAmount(amount);
            setCurrency(currency);
            setSlot_date(slot_date);
            setSlot_time(slot_time);
            setSongs_quantity(songs_quantity);
        });




    return (
        <ProductDisplay 
            booking_id={booking_id}
            stripe_price_id={stripe_price_id}
            amount={amount}
            currency={currency}
            slot_date={slot_date}
            slot_time={slot_time}
            songs_quantity={songs_quantity}

        />
    );


};


 
