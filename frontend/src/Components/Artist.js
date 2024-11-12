 //Artist.js
 import React from 'react'
 import NavBar from './NavBar'
 import { useLocation } from "react-router-dom";
 import { Fragment, useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

 

const Artist = () => {
    // Catch the booking_id from the previous screen/page
    const location = useLocation();
    const { booking_id } = location.state;
    
    // This is needed for redirecting to next page and pass variables to it
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        booking_id: "",
        artist_instagram: "@",
        artist_mobile: "+",
        progress_state: "PROVIDED_ARTIST_INFO",
        booking_updated_at: "",            
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
        navigate('../order', {state:{ booking_id: formData.booking_id }} );

        
      };

    
    // Create the HTML page
    return(
        <Fragment>

            <header>
                <h1>Your Artist Profile</h1>
            </header>


            <section>
                <div className="artist-container" >

                   

                    <br></br>

                    <p>
                        <form onSubmit={handleSubmit}>  
                                
                            <input type="hidden" name="booking_id" value={booking_id}></input>
                            <label class="artist_label">Instagram:
                                <br></br>
                                <input type="text" name="artist_instagram" id="instagram" value={formData.artist_instagram} onChange={handleChange}></input>
                            </label>
                            <p>
                                Your Instagram name will be used as your karaoke name on screen, and the video recording will be tagged with it.
                            </p>
                            <br></br>
                            <label class="artist_label">Mobile:
                                <br></br>
                                <input type="text" name="artist_mobile" id="mobile" value={formData.artist_mobile} onChange={handleChange}></input>
                            </label>
                            <p>
                                Video link to your performance will be sent to your mobile number as a download/share link.
                            </p>
                            <br></br>
                            <br></br>
                            <br></br>


                            <button type="submit">Use these</button>
                        </form>
                    </p>
                </div>
            </section>
            
  
        </Fragment>
    );





 };

 export default Artist;
 
