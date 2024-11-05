import React, { Fragment, useState, useEffect } from 'react';

import './App.css';


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
    
    // Note below how we trick the HTML form which only has GET and POST, to also accept PUT
    // We make the method=POST but then we create a hidden field with value=PUT and add JavaScript to catch that and post it as
    return (
        <Fragment>
               

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
            <script src="formInterceptScript.js"></script>
            <script src="./formInterceptScript.js"></script>
            
                        {apiData.map((booking) => {
                            
                            return (
                              
                                <div className="booking-container" key={String(booking.booking_id)}>
                                    <h1>{booking.slot_description}</h1>
                                    <p>
                                        <strong>Id:</strong> {booking.booking_id}
                                    </p>

                                    <p>
                                        <form onsubmit="return submitForm()">

                                        <fieldset>
                                          <input type="hidden" name="_method" value="PUT"></input>
                                          <input type="text" name="booking_id" value={booking.booking_id}></input>
                                          
                                          <input type="radio" id="1-songs" name="sku" value="1_mon-wed_online"></input> <label>1 Song Mon-Wed €6 (€9 in-store)</label>
                                          <input type="radio" id="3-songs" name="sku" value="3_mon-wed_online"></input> <label>3 Songs Mon-Wed €12 (€18 in-store)</label>
                                          <input type="radio" id="5-songs" name="sku" value="5_mon-wed_online"></input> <label>5 Songs Mon-Wed €15 (€21 in-store)</label>
                                          
                                          <button onclick="sendMessage()" type="submit">Book</button>

                                          </fieldset>
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