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
                    setApiData(data); // this was in original example but returns a "map is not a function" error, which can be solved with the below revised version as it makes the data an array
                    //setApiData(data.rows);
          
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
            <header>
                <h1>Bookings</h1>
            </header>
            <div>
              API Data = {console.log(apiData)}
            </div>
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
            <main>
                {loading === true ? (
                    <div>
                        <h1>Loading...</h1>
                    </div>
                ) : (
                    <section>
                        {apiData?.map((booking) => {
                            
                            return (
                                <div className="movie-container" key={String(booking.id)}>
                                    <h1>{booking.slot_description}</h1>
                                    <p>
                                        <strong>Id:</strong> {booking.id}
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