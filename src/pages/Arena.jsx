import React from "react";
import Menu from "../components/Menu";
import "../styles/arena.css";

export default function Arena() {
  return (
    <div className="arena-bg">
      <Menu />
      <div className="arena-layout">
        {/* Brute à gauche */}
        <div className="arena-brute">
          <div className="brute-info">
            <h2>MaBrute</h2>
            <ul className="brute-stats">
              <li>Force : 15</li>
              <li>Agilité : 9</li>
              <li>Vitesse : 11</li>
              <li>Niveau : 4</li>
              <li>Vie : 32</li>
            </ul>
          </div>
        </div>
        {/* VS au centre */}
        <div className="arena-vs-center">
          <span className="vs-text">VS</span>
        </div>
        {/* Opposants à droite */}
        <div className="arena-opponents-col">
          <div className="opponent-card">Pseudo1</div>
          <div className="opponent-card">Pseudo2</div>
          <div className="opponent-card">Pseudo3</div>
        </div>
      </div>
      <div className="arena-fight-btn-row">
        <button
          className="fight-btn"
          onClick={() => (window.location.href = "/fight")}
        >
          Combattre
        </button>
      </div>
    </div>
  );
}
