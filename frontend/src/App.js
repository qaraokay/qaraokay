import React, { Fragment, useState, useEffect } from 'react';
import './App.css';
const App = () => {
    useEffect(() => {
        const getAPI = () => {
            // Change this endpoint to whatever local or online address you have
            // Should use the env variable instead of hardcoding (eg Render's internal URL for the BACKEND_URL env variable we specified in Render)
            //const API = 'http://127.0.0.1:3000/';
            const API = 'https://qaraokay-fullstack.onrender.com';
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
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
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
                        <input type="text" name="movieName" required />
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
                        {apiData.map((booking) => {
                            
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