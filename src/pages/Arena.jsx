import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/layout/Navigation/Navigation";
import BruteCard from "../components/game/BruteCard/BruteCard";
import { Button } from "../components/ui";
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
      const response = await axios.get("http://localhost:3000/api/brutes/my-brutes", {
        headers: { Authorization: `Bearer ${token}` },
      });

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
        setOpponents(response.data.opponents);
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
      <div className="arena-layout">
        <div className="arena-brute">
          {myBrute ? (
            <BruteCard brute={myBrute} />
          ) : (
            <p>Chargement de votre brute...</p>
          )}
        </div>

        <div className="arena-vs-center">
          <span className="vs-text">VS</span>
        </div>

        <div className="arena-opponents-col">
          {opponents.length > 0 ? (
            opponents.map((opponent) => (
              <BruteCard
                key={opponent.id}
                brute={opponent}
                compact={true}
                selectable={true}
                selected={selectedOpponent?.id === opponent.id}
                onSelect={handleSelectOpponent}
              />
            ))
          ) : (
            <p>Aucun adversaire trouvé à ton niveau.</p>
          )}
        </div>
      </div>

      <div className="arena-fight-btn-row">
        <Button
          onClick={handleFight}
          disabled={!selectedOpponent}
          size="large"
          variant="primary"
        >
          Combattre
        </Button>
      </div>
    </div>
  );
}