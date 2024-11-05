// app-payment.js
// v.1

import React, { Fragment, useState, useEffect } from 'react';
import './app.css';


const App = () => {
    
    // Catch the booking_id from the previous screen/page
    // REPLACE WITH DYNAMIC VALUE
    const booking_id = "10001";
    console.log(booking_id);


    // Fetch the price for the booked "product" (SKU)
    
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
                    //setLoading(false);
                    //setApiData(data);
                });
        };
        getAPI();
    }, []);
    // useEffect ends





};

export default App;
