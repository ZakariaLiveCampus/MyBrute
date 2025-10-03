import React, { useEffect, useState } from "react";
import "../styles/theme.css";
import "../styles/home.css";
import Navigation from "../components/layout/Navigation/Navigation";
import { Button } from "../components/ui";
import { useGame } from "../contexts/GameContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BruteDisplay from "../components/game/BruteDisplay/BruteDisplay";

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

      {/* Header de bienvenue */}
      <div className="home-content">
        <h1>Bienvenue sur MyBrute {userData.username} !</h1>
        <p>Prêt à affronter les meilleurs combattants ?</p>
      </div>

      {/* Layout principal */}
      <div className="home-main-layout">
        <div className="home-brute-section">
          {/* Card de la brute */}
          {brutes.length > 0 ? (
            <div className="home-brute-card">
              {/* En-tête avec image et infos principales */}
              <div className="brute-header">
                <div className="brute-image-container">
                  <BruteDisplay brute={brutes[0]} />
                </div>

                <div className="brute-main-info">
                  <h2 className="brute-name">{brutes[0].name} - Niveau {brutes[0].level}</h2>

                  {/* Score victoires/défaites */}
                  <div className="brute-score">
                    <div className="score-item">
                      <div className="score-label">Victoires</div>
                      <div className="score-value">{stats.victories}</div>
                    </div>
                    <div className="score-item">
                      <div className="score-label">Défaites</div>
                      <div className="score-value">{stats.defeats}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats de la brute */}
              <div className="brute-stats-section">
                <h3 className="stats-title">Statistiques</h3>
                <div className="brute-stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Force</span>
                    <span className="stat-value">{brutes[0].strength}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Agilité</span>
                    <span className="stat-value">{brutes[0].agility}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Vitesse</span>
                    <span className="stat-value">{brutes[0].speed}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Niveau</span>
                    <span className="stat-value">{brutes[0].level}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">XP</span>
                    <span className="stat-value">{brutes[0].xp}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">HP</span>
                    <span className="stat-value">{brutes[0].hp}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="home-brute-card">
              <p className="no-brute-message">
                Aucune brute créée pour l'instant.
              </p>
            </div>
          )}

          {/* Section arène */}
          <div className="home-arena-section">
            <h2 className="arena-title">L'Arène</h2>
            <Button
              onClick={handleGoToArena}
              size="large"
              variant="primary"
              className="arena-btn"
            >
              🏟️ Combattre
            </Button>
            <p className="arena-description">
              Affrontez d'autres brutes et gagnez en expérience pour devenir le
              champion ultime !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}