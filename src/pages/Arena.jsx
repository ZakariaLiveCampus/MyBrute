import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/layout/Navigation/Navigation";
import BruteCard from "../components/game/BruteCard/BruteCard";
import BruteDisplay from "../components/game/BruteDisplay/BruteDisplay";
import { Button } from "../components/ui";
import "../styles/theme.css";
import "../styles/arena.css";
import axios from "axios";

export default function Arena() {
  const navigate = useNavigate();
  const [myBrute, setMyBrute] = useState(null);
  const [opponents, setOpponents] = useState([]);
  const [selectedOpponent, setSelectedOpponent] = useState(null);

  useEffect(() => {
    fetchMyBrute();
  }, []);

  const fetchMyBrute = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:3000/api/brutes/my-brutes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success && response.data.brutes.length > 0) {
        const brute = response.data.brutes[0];
        setMyBrute(brute);
        fetchOpponents(brute.level, brute.id);
      }
    } catch (err) {
      console.error("Erreur récupération brute :", err);
    }
  };

  const fetchOpponents = async (level, myBruteId) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:3000/api/brutes/opponents?level=${level}&excludeId=${myBruteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Limite à 4 adversaires maximum
        const limitedOpponents = response.data.opponents.slice(0, 4);
        setOpponents(limitedOpponents);
      }
    } catch (err) {
      console.error("Erreur récupération adversaires :", err);
    }
  };

  const handleSelectOpponent = (opponent) => {
    setSelectedOpponent(opponent);
  };

  const handleFight = () => {
    if (!selectedOpponent) {
      alert("Sélectionne un opposant avant de combattre !");
      return;
    }
    navigate("/fight", {
      state: {
        brute: myBrute,
        opponent: selectedOpponent,
      },
    });
  };

  return (
    <div className="arena-bg">
      <Navigation />

      <div className="arena-main-section">
        <div className="arena-content-row">
          {/* Card stats de ma brute - gauche */}
          <div className="arena-my-brute-card">
            <h2 className="my-brute-title">{myBrute?.name || "Ma Brute"}</h2>

            {myBrute ? (
              <>
                <div className="arena-brute-header">
                  <div className="arena-brute-display">
                    <BruteDisplay brute={myBrute} />
                  </div>

                  <div className="arena-brute-hp-block">
                    <div className="hp-label">❤️ Points de Vie</div>
                    <div className="hp-value">{myBrute.hp}</div>
                  </div>
                </div>

                <div className="arena-brute-stats">
                  <div className="arena-stat-item">
                    <span className="arena-stat-label">💪 Force</span>
                    <span className="arena-stat-value">{myBrute.strength}</span>
                  </div>
                  <div className="arena-stat-item">
                    <span className="arena-stat-label">🤸 Agilité</span>
                    <span className="arena-stat-value">{myBrute.agility}</span>
                  </div>
                  <div className="arena-stat-item">
                    <span className="arena-stat-label">⚡ Vitesse</span>
                    <span className="arena-stat-value">{myBrute.speed}</span>
                  </div>
                  <div className="arena-stat-item">
                    <span className="arena-stat-label">🎯 Niveau</span>
                    <span className="arena-stat-value">{myBrute.level}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="no-opponents-message">Chargement de votre brute...</p>
            )}
          </div>

          {/* Section adversaires - droite */}
          <div className="arena-opponents-section">
            <h2 className="opponents-title">⚔️ Adversaires</h2>
            <p className="opponents-subtitle">
              Sélectionnez un combattant pour l'affronter
            </p>

            <div className="opponents-grid">
              {opponents.length > 0 ? (
                opponents.map((opponent) => (
                  <BruteCard
                    key={opponent.id}
                    brute={opponent}
                    compact={true}
                    selectable={true}
                    selected={selectedOpponent?.id === opponent.id}
                    isOpponent={true}
                    onSelect={handleSelectOpponent}
                  />
                ))
              ) : (
                <p className="no-opponents-message">
                  Aucun adversaire trouvé à ton niveau.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bouton de combat en dessous */}
        <div className="arena-fight-section">
          <Button
            onClick={handleFight}
            disabled={!selectedOpponent}
            className="arena-fight-btn"
          >
            Combattre !
          </Button>
        </div>
      </div>
    </div>
  );
}