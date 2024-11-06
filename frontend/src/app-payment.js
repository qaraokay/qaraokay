// app-payment.js
// v.1

import React, { Fragment, useState, useEffect } from 'react';
import './App.css';


const ProductDisplay = () => (
    <section>
      <div className="product">
        <img
          src="https://i.imgur.com/EHyR2nP.png"
          alt="The cover of Stubborn Attachments"
        />
        <div className="description">
        <h3>Stubborn Attachments</h3>
        <h5>$20.00</h5>
        </div>
      </div>
      <form action="/create-checkout-session" method="POST">
        <button type="submit">
          Checkout
        </button>
      </form>
    </section>
  );
  

  const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  );
  
  export default function App() {
    const [message, setMessage] = useState("");
  
    useEffect(() => {
      // Check to see if this is a redirect back from Checkout
      const query = new URLSearchParams(window.location.search);
  
      if (query.get("success")) {
        setMessage("Order placed! You will receive an email confirmation.");
      }
  
      if (query.get("canceled")) {
        setMessage(
          "Order canceled -- continue to shop around and checkout when you're ready."
        );
      }
    }, []);
  
    return message ? (
      <Message message={message} />
    ) : (
      <ProductDisplay />
    );
  }


  

/* ------------
// old code without Stripe

const App = () => {
    
    // Catch the booking_id from the previous screen/page
    // REPLACE WITH DYNAMIC VALUE
    const booking_id = "10001";
    console.log(booking_id);


    // Fetch the price etc information for this booking
    
    // useEffect starts
    useEffect(() => {
        const getAPI = () => {
            // Should use the env variable instead of hardcoding (eg Render's internal URL for the BACKEND_URL env variable we specified in Render)
            const apiUrl = 'https://qaraokay-fullstack.onrender.com/bookings/id/'+booking_id;
            fetch(apiUrl)
                .then((response) => {
                    console.log(response);
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    setLoading(false);
                    setApiData(data);
                });
        };
        getAPI();
    }, []);
    // useEffect ends

    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log("API data: ");
    console.log(apiData);



    // Create the HTML page
    return(
        <Fragment>

            <header>
                <h1>Payment</h1>
            </header>


            <section>
                <div className="booking-container" >
                    <h1>Details</h1>

                    <p>
                        SKU: {apiData.sku}
                    </p>
                    <p>
                        Price:  {apiData.price_amount} {apiData.price_currency} 
                    </p>
                    <p>
                        Slot: {apiData.slot_description}
                    </p>
                    <p>
                        Artist: {apiData.artist_instagram} ({apiData.artist_mobile})
                    </p>

                    <p>
                        [ OK - GO TO STRIPE ]
                    </p>

                </div>
            </section>
            

        </Fragment>
    );



};

export default App;

// ---------------
*/