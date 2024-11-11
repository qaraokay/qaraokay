// app-artist.js
// v.1

import React, { Fragment, useState, useEffect } from 'react';
import './App.css';


const App = () => {
    
    // Catch the booking_id from the previous screen/page
    // REPLACE WITH DYNAMIC VALUE
    const booking_id = "10001";
    console.log(booking_id);



    const [formData, setFormData] = useState({
        booking_id: "",
        artist_instagram: "",
        artist_mobile: "",           
      });
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (event) => {
        // Prevent the HTML form to submit in the traditional way
        event.preventDefault();
        // Override certain fields of formData
        formData.booking_id = booking_id;
        // Troubleshoot
        console.log(formData);

        // Make an API call to update the values (ie a PUT call), and we do it here because HTML form can only do GET and POST
        fetch('https://qaraokay-fullstack.onrender.com/bookings/', {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });

        // Redirect to next screen/page (ie payment screen)
        // That payment screen will need the booking_id value
        // INSERT HERE REDIRECT

        
      };

    
    // Create the HTML page
    return(
        <Fragment>

            <header>
                <h1>Your Artist Profile</h1>
            </header>


            <section>
                <div className="booking-container" >
                    <h1>Add details</h1>

                    <p>
                        Your Instagram will be used as your name on screen, and the video recording will be tagged with it. The video link will be sent to your mobile number as a download/share link.
                    </p>

                    <br></br>

                    <p>
                        <form onSubmit={handleSubmit}>  
                                
                            <input type="text" name="booking_id" value={booking_id}></input>
                            <label for="instagram">Instagram:</label><br></br>
                            <input type="text" name="artist_instagram" id="instagram" value={formData.artist_instagram} onChange={handleChange}></input>
                            <label for="mobile">Mobile:</label><br></br>
                            <input type="text" name="artist_mobile" id="mobile" value={formData.artist_mobile} onChange={handleChange}></input>


                            <button type="submit">Use these</button>
                        </form>
                    </p>
                </div>
            </section>
            
  
        </Fragment>
    );



};

export default App;
