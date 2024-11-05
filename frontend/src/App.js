// App.js
// v.1


import React, { Fragment, useState, useEffect } from 'react';
import './App.css';


const App = () => {
    
    const [formData, setFormData] = useState({
        booking_id: "",
        sku: "",
      });
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Override certain fields of formData
        formData.booking_id = event.target.booking_id.value;
        console.log(formData);
        // Create an API call to update the values (ie a PUT call), and we do it here because HTML form can only do GET and POST
        fetch('https://qaraokay-fullstack.onrender.com/bookings/', {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          })
      };


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




            <header>
                <h1>Bookings</h1>
            </header>



            
            <div className="form-container">
                <h2>Add Slot</h2>
                <form method="POST" action="https://qaraokay-fullstack.onrender.com/bookings">  
                    <div>
                        <label>Slot Description</label>
                        <input type="text" name="slot_description" required /> 
                    </div>
                    <div>
                        <button type="submit">Add Slot</button>
                    </div>
                </form>
            </div>







            <section>




            <header>
                <h1>Update Booking</h1>
            </header>



            {apiData.map((booking) => {
                
                return (
                    <div className="booking-container" key={String(booking.booking_id)}>
                        <h1>{booking.slot_description}</h1>
                        <p>
                            <strong>Id:</strong> {booking.booking_id}
                        </p>

                        <p>
                            <form onSubmit={handleSubmit} onChange={handleChange}>  
                                <input type="text" name="booking_id" value={booking.booking_id} onChange={handleChange}></input>

                                <input type="radio" id="1-songs" name="sku" value="1_mon-wed_online" onChange={handleChange}></input> <label>1 Song Mon-Wed €6 (€9 in-store)</label>
                                <input type="radio" id="3-songs" name="sku" value="3_mon-wed_online" onChange={handleChange}></input> <label>3 Songs Mon-Wed €12 (€18 in-store)</label>
                                <input type="radio" id="5-songs" name="sku" value="5_mon-wed_online" onChange={handleChange}></input> <label>5 Songs Mon-Wed €15 (€21 in-store)</label>
                                
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
export default App;


// -----------------------------------
