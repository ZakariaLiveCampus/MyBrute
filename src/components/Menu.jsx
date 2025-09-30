import React from "react";
import { Link } from "react-router-dom";
import "../styles/theme.css";
import "../styles/menu.css";

export default function Menu() {
  return (
    <nav className="home-menu">
      <ul>
        <li>
          <Link to="/home">Accueil</Link>
        </li>
        <li>
          <Link to="/options">Options</Link>
        </li>
        <li>
          <Link to="/top-ladder">Top Ladder</Link>
        </li>
        <li>
          <Link to="/create-brute">Créer ma Brute</Link>
        </li>
      </ul>
    </nav>
  );
}
