 //About.js
 import React from 'react'
 import NavBar from './NavBar'
 import { useLocation } from "react-router-dom";

 

const About = () => {
    const location = useLocation();
    console.log(location); 
    const { booking_id } = location.state;
    console.log(booking_id);


  return (
     <div>
         <NavBar />
         <h1>About</h1>
         booking_id: {booking_id}
     </div>
   )
 }

 export default About
 
