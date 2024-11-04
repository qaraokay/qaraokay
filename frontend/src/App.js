import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import './App.css';



import Navbar from "./components/Navbar.js";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
//import Home from "./pages";
import Slots from "./pages/slots.js";
import Payment from "./pages/payment.js";
import Artis from "./pages/artist.js";




const App = () => {
    
    // useEffect starts
    useEffect(() => {
        const getAPI = () => {
            // Should use the env variable instead of hardcoding (eg Render's internal URL for the BACKEND_URL env variable we specified in Render)
            const API = 'https://qaraokay-fullstack.onrender.com/bookings';
            fetch(API)
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
    return (
        <Fragment>
            <Navbar />
            <header>
                <h1>Bookings</h1>
            </header>

            <div className="form-container">
                <h2>Add Booking</h2>
                <form method="POST" action="https://qaraokay-fullstack.onrender.com/bookings">
                    <div>
                        <label>Slot Description</label>
                        <input type="text" name="slot_description" required />
                    </div>
                    
                    <div>
                        <button type="submit">Add Booking</button>
                    </div>
                </form>
            </div>

            <section>
            <header>
                <h1>Update Booking</h1>
            </header>

                        {apiData.map((booking) => {
                            
                            return (
                                <div className="booking-container" key={String(booking.id)}>
                                    <h1>{booking.slot_description}</h1>
                                    <p>
                                        <strong>Id:</strong> {booking.id}
                                    </p>

                                    <p>
                                        <form method="POST" action="https://qaraokay-fullstack.onrender.com/bookings">
                                          <input type="text" name="id" value={booking.id}></input>
                                          <input type="radio" id="1-songs" name="sku" value="1_mon-wed_online"></input> <label for="1-songs">1 Song Mon-Wed €6 (€9 in-store)</label>
                                          <input type="radio" id="3-songs" name="sku" value="3_mon-wed_online"></input> <label for="3-songs">3 Songs Mon-Wed €12 (€18 in-store)</label>
                                          <input type="radio" id="5-songs" name="sku" value="5_mon-wed_online"></input> <label for="5-songs">5 Songs Mon-Wed €15 (€21 in-store)</label>
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
                        {apiData.map((booking) => {
                            
                            return (
                                <div className="movie-container" key={String(booking.id)}>
                                    <h1>{booking.slot_description}</h1>
                                    <p>
                                        <strong>Id:</strong> {booking.id}
                                    </p>

                                    <p>
                                        FORM HERE
                                    </p>
                              



                              
                                </div>
                            );
                        })}



                    </section>
                )}
            </main>
        </Fragment>
    );
};
export default App;