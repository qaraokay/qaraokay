// NavBar.js

import { NavLink } from "react-router-dom";


const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/slots">Slots</NavLink>
        </li>
        <li>
          <NavLink to="/artist">Artist</NavLink>
        </li>
        <li>
          <NavLink to="/order">OrderConfirm</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;