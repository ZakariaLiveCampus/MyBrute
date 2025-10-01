import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/layout/Navigation/Navigation";
import BruteCard from "../components/game/BruteCard/BruteCard";
import { Button } from "../components/ui";
import { useGame } from "../contexts/GameContext";
import "../styles/arena.css";

export default function Arena() {
  const { brute, generateOpponents } = useGame();
  const navigate = useNavigate();

  // Mémoriser les adversaires pour qu'ils ne changent pas à chaque rendu
  const opponents = useMemo(() => generateOpponents(3), [generateOpponents]);

  const [selectedOpponent, setSelectedOpponent] = useState(null);

  const handleFight = () => {
    if (!selectedOpponent) {
      alert("Sélectionne un opposant avant de combattre !");
      return;
    }
    navigate("/fight", {
      state: {
        brute,
        opponent: selectedOpponent,
      },
    });
  };

  const handleSelectOpponent = (opponent) => {
    setSelectedOpponent(opponent);
  };

  return (
    <div className="arena-bg">
      <Navigation />
      <div className="arena-layout">
        <div className="arena-brute">
          <BruteCard brute={brute} />
        </div>

        <div className="arena-vs-center">
          <span className="vs-text">VS</span>
        </div>

        <div className="arena-opponents-col">
          {opponents.map((opponent) => (
            <BruteCard
              key={opponent.id}
              brute={opponent}
              compact={true}
              selectable={true}
              selected={selectedOpponent?.id === opponent.id}
              onSelect={handleSelectOpponent}
            />
          ))}
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
