//Slots.js
//import React from 'react'
import NavBar from './NavBar'
import React, { Fragment, useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';





const Slots = () => {

    // This is needed for redirecting to next page and pass variables to it
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        booking_id: "",
        price_currency: "EUR",
        price_amount: "",
        progress_state: "SELECTED_SLOT",
        booking_updated_at: "",  
        songs_quantity: "",      
      });
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
        // Update the price when the slot timing/price changes
        // REMOVE hard-coding...
        // *** REMEMBER TO CHANGE the price_ids here too when changing them in the HTML FORM
        switch(event.target.value) {
            case "price_1QJj4bAnuyiQyip2nrnnvT8M":
                setFormData((prevState) => ({ ...prevState, 'price_amount': '3' }));
                setFormData((prevState) => ({ ...prevState, 'songs_quantity': '1' }));
                break;
            case "price_1QJj4yAnuyiQyip2gi3sabFH":
                setFormData((prevState) => ({ ...prevState, 'price_amount': '6' }));
                setFormData((prevState) => ({ ...prevState, 'songs_quantity': '3' }));
                break;
            case "price_1QJj5NAnuyiQyip2CSm47yOg":
                setFormData((prevState) => ({ ...prevState, 'price_amount': '8' }));
                setFormData((prevState) => ({ ...prevState, 'songs_quantity': '5' }));
                break;
        }
    };

    const handleSubmit = (event) => {
        // Prevent the HTML form to submit in the traditional way
        event.preventDefault();
        // Override certain fields of formData
        formData.booking_id = event.target.booking_id.value;
        formData.booking_updated_at = new Date(Date.now()).toISOString();
        // Troubleshoot
        console.log(formData);

        // Make an API call to update the values (ie a PUT call), and we do it here because HTML form can only do GET and POST
        //const apiUrl = 'https://qaraokay-fullstack.onrender.com/bookings/';
        const apiUrl = 'http://localhost:4242/bookings/';
        
        /* with ENV
        dotenv.config({ path: '../../..' });
        const apiUrl = process.env.MY_SERVER_URL+'/bookings/';
        */

        console.log('----- Submit form API URL:');
        console.log(apiUrl);
        fetch(apiUrl, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });

        // Redirect to next screen/page (ie payment screen)
        // That next screen will need the booking_id value
        navigate('../artist', {state:{ booking_id: formData.booking_id }} );

        
      };


    // Fetch all AVAILABLE bookings from API
    useEffect(() => {
        const getAPI = () => {
            // Should use the env variable instead of hardcoding (eg Render's internal URL for the BACKEND_URL env variable we specified in Render)
            //const apiUrl = 'https://qaraokay-fullstack.onrender.com/bookings/available';
            const apiUrl = 'http://localhost:4242/bookings/available';

            console.log('----- Fetch available slots API URL:');
            console.log(apiUrl);
            fetch(apiUrl)
                .then((response) => {
                    console.log(response);
                    return response.json();
                })
                .then((data) => {
                    console.log('----- GET all AVAILABLE bookings:');
                    console.log(data);
                    setLoading(false);
                    setApiData(data);
                });
        };
        getAPI();
    }, []);
    



    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log("API data: ");
    console.log(apiData);
    


    // Create the HTML page
    return (
        <Fragment>

            <header>
                <h1>Select Slot and Package</h1>
            </header>

            <section>
            <div>
                <h1>Current Queue</h1>
                <p>21 minutes</p>
                <br></br>
                <p>@pedro1980: Hotel California (Eagles)</p>
                <p>@susanneeee: Back to Black (Amy Winehouse)</p>
                <p>@karaokeking111: Enter Sandman (Metallica)</p>
            </div>
            <br></br>
            </section>

            <section>

            



            {apiData.map((booking) => {
                
                // Format the slot start time
                const date_options =  { weekday: 'short', day: 'numeric', month: 'short' };
                const time_options =  { hour: 'numeric', hour12: false, minute: 'numeric' };
                const timestamp = new Date(booking.slot_start_time);
                const slot_date = (timestamp.toLocaleDateString("en-US", date_options)); 
                const slot_time = (timestamp.toLocaleTimeString("en-US", time_options)); 
                console.log('------- slot date:');
                console.log(slot_date);
                console.log('------- slot time:');
                console.log(slot_time);

                // Generate the HTML page
                return (
                    <div className="booking-container">
                        <h1>{slot_time}</h1>
                        <h2>{slot_date}</h2>
                        <br></br>
                        <p>
                            <form onSubmit={handleSubmit}>  
                                <input type="hidden" name="booking_id" value={booking.booking_id} onChange={handleChange}></input>

                                <label class="slot_label" >
                                    <input type="radio" id="1songs" name="stripe_price_id" value="price_1QJj4bAnuyiQyip2nrnnvT8M" onChange={handleChange}></input>
                                    1 Song = 3€ (5€ in-store)</label>
                                <label class="slot_label" >
                                    <input type="radio" id="3songs" name="stripe_price_id" value="price_1QJj4yAnuyiQyip2gi3sabFH" onChange={handleChange}></input>
                                    3 Songs = 6€ (8€ in-store)</label>
                                <label class="slot_label" >
                                    <input type="radio" id="5songs" name="stripe_price_id" value="price_1QJj5NAnuyiQyip2CSm47yOg" onChange={handleChange}></input>
                                    5 Songs = 8€ (11€ in-store)</label>
                                
                                <input type="hidden" name="price_amount" value={formData.price_amount} onChange={handleChange}></input>
                                <input type="hidden" name="songs_quantity" value={formData.songs_quantity} onChange={handleChange}></input>
                                <br></br>
                                <button type="submit">Book</button>
                            </form>
                        </p>
                    </div>
                );
            })}
          
          </section>


            <main>
                {loading === true ? (
                    <div>
                        <h1>Loading...</h1>
                    </div>
                ) : (
                    <section>
                        
                    </section>
                )}
            </main>
        </Fragment>
    );

};

export default Slots;