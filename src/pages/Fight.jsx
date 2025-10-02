import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CombatPhaser from "../components/CombatPhaser";
import Navigation from "../components/layout/Navigation/Navigation";
import HealthBar from "../components/game/HealthBar/HealthBar";
import { Button } from "../components/ui";
import { useGame } from "../contexts/GameContext";
import useCombat from "../hooks/useCombat";
import axios from "axios";
import "../styles/fight.css";

export default function Fight() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addVictory, addDefeat } = useGame();
  const hasRecorded = useRef(false);

  // Récupérer les données depuis location.state ou utiliser le context
  const { brute, opponent } = location.state || {};

  // Callback quand le combat se termine
  const handleCombatEnd = async (winner) => {
    if (hasRecorded.current) return;
    hasRecorded.current = true;

    const attackerId = brute.id;
    const defenderId = opponent.id;
    const winnerId = winner === "brute" ? brute.id : opponent.id;

    try {
      const token = sessionStorage.getItem("authToken");
      await axios.post(
        "http://localhost:3000/api/battles/record",
        { attackerId, defenderId, winnerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (winner === "brute") {
        addVictory();
      } else {
        addDefeat();
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du combat : ", err);
    }
  };

  // Utiliser le hook useCombat pour gérer toute la logique
  const {
    characters,
    combatState,
    bruteAction,
    opponentAction,
    isSceneReady,
    fightEnded,
    handleAnimationComplete,
    setIsSceneReady,
    resetCombat,
  } = useCombat(brute, opponent, handleCombatEnd);

  const handleReturn = () => {
    // Reset du combat avant de naviguer
    if (typeof resetCombat === "function") {
      resetCombat();
    }
    navigate("/arena");
  };

  if (!brute || !opponent) {
    return (
      <div className="fight-page">
        <Navigation />
        <div className="fight-container">
          <p>Erreur: Données de combat manquantes</p>
          <Button onClick={handleReturn}>Retour à l'arène</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fight-page">
      <Navigation />
      <div className="fight-container">
        <div className="health-bars">
          <HealthBar
            characterName={brute.name}
            currentHealth={characters.brute.health}
            maxHealth={characters.brute.maxHealth}
            isPlayer={true}
          />
          <HealthBar
            characterName={opponent.name}
            currentHealth={characters.opponent.health}
            maxHealth={characters.opponent.maxHealth}
            isPlayer={false}
          />
        </div>

        <CombatPhaser
          bruteAction={bruteAction}
          opponentAction={opponentAction}
          onAnimationDone={handleAnimationComplete}
          currentStep={combatState}
          onSceneReady={() => setIsSceneReady(true)}
        />

        {fightEnded && (
          <div className="combat-end-container">
            <div className="victory-message">
              {characters.brute.health > 0 ? "Brute Wins!" : "Opponent Wins!"}
            </div>
            <Button variant="danger" onClick={handleReturn}>
              Retour à l'arène
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
