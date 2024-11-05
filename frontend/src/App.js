/*
// -----------------------------------
// NEW v2 APP CODE
// From https://www.telerik.com/blogs/react-basics-react-forms-examples


// import React, { useState } from "react";
import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
    
    // ==================== 
    // Not in original example
    // ---- Fetch data from bookings database
    
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




    // ====================


    
    const [formData, setFormData] = useState({
      booking_id: "",
      slot_description: "",
      sku: "",
    });
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log(formData);
      // Added here the API call

    };
  
    return (
      
      <form onSubmit={handleSubmit}>
        <label>
          Booking ID:
          <input
            type="text"
            name="booking_id"
            value={formData.booking_id}
            onChange={handleChange}
          />
        </label>
        <label>
          Slot Description:
          <input
            type="text"
            name="slot_description"
            value={formData.slot_description}
            onChange={handleChange}
          />
        </label>
        <label>
          SKU:
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>









    );
  }


export default App;

*/




// -----------------------------------
// OLD V1 APP CODE


import React, { Fragment, useState, useEffect } from 'react';
import './App.css';


const App = () => {
    
    const [formData, setFormData] = useState({
        booking_id: "",
        slot_description: "",
        sku: "",
      });
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Override certain fields of formData
        /*
        setFormData(prevState => ({
            ...prevState, // Spread the previous car state
            booking_id: 1234 
        }));
        */
        //formData.booking_id = '1234';
        formData.booking_id = event.target.booking_id.value;
        console.log(formData);
        // Add here the API call
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
