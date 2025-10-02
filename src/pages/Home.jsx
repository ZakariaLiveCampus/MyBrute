import React, { useEffect, useState } from "react";
import "../styles/home.css";
import Navigation from "../components/layout/Navigation/Navigation";
import { Link } from "react-router-dom";
import { Button } from "../components/ui";
import { useGame } from "../contexts/GameContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const { brute } = useGame();
  const [userData, setUserData] = useState("");
  const [brutes, setBrutes] = useState([]);
  const [stats, setStats] = useState({ victories: 0, defeats: 0 });

  const handleGoToArena = () => {
    navigate("/arena");
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserBrutes();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.get(
        "http://localhost:3000/api/auth/getUserData",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log(response.data);
        setUserData(response.data.data);
        let userInfo = {
          isLoggedIn: true,
          userData: response.data,
        };
        sessionStorage.setItem("userData", JSON.stringify(userInfo));
      } else {
        console.log(response.data.message || "Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details : ", err);
      console.log(err.response?.data?.message || "An error occured");
    }
  };

  const fetchUserBrutes = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.get(
        "http://localhost:3000/api/brutes/my-brutes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success && response.data.brutes.length > 0) {
        setBrutes(response.data.brutes);
        fetchBruteStats(response.data.brutes[0].id);
      } else {
        console.log(response.data.message || "Failed to fetch brutes");
      }
    } catch (err) {
      console.error("Error fetching brutes : ", err);
    }
  };

  const fetchBruteStats = async (bruteId) => {
    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.get(
        `http://localhost:3000/api/brutes/${bruteId}/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        console.log(response.data.message || "Failed to fetch stats");
      }
    } catch (err) {
      console.error("Error fetching stats : ", err);
    }
  };

  return (
    <div className="home-bg">
      <Navigation />
      <div className="home-content">
        <h1>Bienvenue sur MyBrute {userData.username} ! </h1>
        <p>
          Choisissez une option dans le menu pour commencer votre aventure !
        </p>
      </div>

      <div className="home-main-layout">
        {/* Carte des stats de la brute */}
        <div className="home-stats">
          <h2>Ma Brute</h2>
          {brutes.length > 0 ? (
            <ul>
              <li>Nom : {brutes[0].name}</li>
              <li>Force : {brutes[0].strength}</li>
              <li>Agilité : {brutes[0].agility}</li>
              <li>Vitesse : {brutes[0].speed}</li>
              <li>Niveau : {brutes[0].level}</li>
              <li>XP : {brutes[0].xp}</li>
              <li>HP : {brutes[0].hp}</li>
            </ul>
          ) : (
            <p>Aucune brute créée pour l’instant.</p>
          )}
        </div>

        {/* Bouton principal vers l'arène */}
        <div className="home-arena">
          <Button
            onClick={handleGoToArena}
            size="large"
            variant="primary"
            className="arena-btn"
          >
            🏟️ Arène
          </Button>
          <p className="arena-description">
            Affrontez d'autres brutes et gagnez en expérience !
          </p>
        </div>
        <div className="home-score">
          <h2>Scores</h2>
          <p>Victoires : {stats.victories}</p>
          <p>Défaites : {stats.defeats}</p>
        </div>
      </div>
    </div>
  );
}
