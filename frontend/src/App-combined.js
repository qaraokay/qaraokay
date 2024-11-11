// app-combined.js
import NavBar from "./Components/NavBar.js";
import { Routes, Route } from 'react-router-dom';




import Home from './Components/Home.js';
import About from './Components/About.js';
import Slots from './Components/Slots.js';
import Artist from './Components/Artist.js';
import OrderConfirm from './Components/OrderConfirm.js';
 
const App = () => {
   return (
      <>

        
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/slots" element={<Slots />} />
            <Route path="/artist" element={<Artist />} />
            <Route path="/order" element={<OrderConfirm />} />
        </Routes>
      </>
   );
};
 
export default App;