import React from "react";
import "../styles/home.css";
import Menu from "../components/Menu";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-bg">
      <Menu />
      <div className="home-content">
        <h1>Bienvenue sur MyBrute</h1>
        <p>
          Choisissez une option dans le menu pour commencer votre aventure !
        </p>
      </div>
      <div className="home-main-layout">
        <div className="home-stats">
          <h2>Ma Brute</h2>
          <ul>
            <li>Vie : 32</li>
            <li>Force : 15</li>
            <li>Agilité : 9</li>
            <li>Vitesse : 11</li>
            <li>Niveau : 4</li>
          </ul>
        </div>
        <div className="home-arena">
          <Link to="/arena">
            <button className="arena-btn">Arène</button>
          </Link>
        </div>
        <div className="home-score">
          <h2>Scores</h2>
          <p>Victoires : 5</p>
          <p>Défaites : 2</p>
        </div>
      </div>
    </div>
  );
}
