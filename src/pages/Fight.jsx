import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CombatPhaser from "../components/CombatPhaser";
import Menu from "../components/Menu";
import "../styles/fight.css";

// États possibles du combat
const COMBAT_STATES = {
  MOVE_TO_ATTACK: "MOVE_TO_ATTACK",
  ATTACKING: "ATTACKING",
  TAKING_DAMAGE: "TAKING_DAMAGE",
  RETURNING: "RETURNING",
  CHECKING_DEATH: "CHECKING_DEATH",
  SWITCHING_ROLES: "SWITCHING_ROLES",
  COMBAT_END: "COMBAT_END",
};

// Actions possibles des personnages
const CHARACTER_ACTIONS = {
  IDLE: "idle",
  ATTACK: "attack",
  HURT: "hurt",
  DEATH: "death",
  VICTORY: "climb",
};

export default function Fight() {
  const navigate = useNavigate();
  const location = useLocation();
  const { brute, opponent } = location.state || {};

  // État des personnages avec leurs statistiques
  const [characters, setCharacters] = useState({
    brute: {
      health: 100,
      speed: brute?.speed || 10,
      isAttacker: false,
    },
    opponent: {
      health: 100,
      speed: opponent?.speed || 10,
      isAttacker: false,
    },
  });

  // État du combat
  const [combatState, setCombatState] = useState(COMBAT_STATES.MOVE_TO_ATTACK);
  const [bruteAction, setBruteAction] = useState(CHARACTER_ACTIONS.IDLE);
  const [opponentAction, setOpponentAction] = useState(CHARACTER_ACTIONS.IDLE);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [showReturnButton, setShowReturnButton] = useState(false);
  // Supprime le délai d'affichage du bouton
  const [fightEnded, setFightEnded] = useState(false);

  // Calcul des points de vie max pour l'affichage des barres
  const bruteMaxHp = brute?.hp || 100;
  const opponentMaxHp = opponent?.hp || 100;

  // Gestion des dégâts
  const applyDamage = () => {
    const damage = Math.floor(Math.random() * 20) + 10; // Dégâts entre 10 et 30
    setCharacters((prev) => {
      const defender = prev.brute.isAttacker ? "opponent" : "brute";
      const newHealth = Math.max(0, prev[defender].health - damage);
      console.log(
        `${defender} prend ${damage} dégâts. Santé restante: ${newHealth}`
      );

      // Mettre à jour immédiatement l'état du combat en fonction des dégâts
      if (newHealth <= 0) {
        console.log(`${defender} est vaincu !`);
        setTimeout(() => {
          if (defender === "opponent") {
            setBruteAction(CHARACTER_ACTIONS.VICTORY);
            setOpponentAction(CHARACTER_ACTIONS.DEATH);
          } else {
            setBruteAction(CHARACTER_ACTIONS.DEATH);
            setOpponentAction(CHARACTER_ACTIONS.VICTORY);
          }
          setCombatState(COMBAT_STATES.COMBAT_END);
        }, 500);
      } else {
        // Continue le combat
        setTimeout(() => {
          setCombatState(COMBAT_STATES.SWITCHING_ROLES);
          // Réinitialiser les animations
          setBruteAction(CHARACTER_ACTIONS.IDLE);
          setOpponentAction(CHARACTER_ACTIONS.IDLE);
          // Changer les rôles après un court délai
          setTimeout(() => {
            switchRoles();
            setCombatState(COMBAT_STATES.MOVE_TO_ATTACK);
          }, 500);
        }, 1000);
      }

      return {
        ...prev,
        [defender]: {
          ...prev[defender],
          health: newHealth,
        },
      };
    });
  };

  // Changement des rôles
  const switchRoles = () => {
    setCharacters((prev) => ({
      brute: {
        ...prev.brute,
        isAttacker: !prev.brute.isAttacker,
      },
      opponent: {
        ...prev.opponent,
        isAttacker: !prev.opponent.isAttacker,
      },
    }));
  };

  // Vérification de la mort
  const checkDeath = () => {
    return characters.brute.health <= 0 || characters.opponent.health <= 0;
  };

  // Gestion de la séquence de combat
  const handleAnimationComplete = () => {
    console.log("Animation terminée, état actuel:", combatState);

    switch (combatState) {
      case COMBAT_STATES.ATTACKING:
        console.log("Animation d'attaque terminée, application des dégâts");
        // Appliquer l'animation de dégât au défenseur
        if (characters.brute.isAttacker) {
          setOpponentAction(CHARACTER_ACTIONS.HURT);
          setBruteAction(CHARACTER_ACTIONS.IDLE);
        } else {
          setBruteAction(CHARACTER_ACTIONS.HURT);
          setOpponentAction(CHARACTER_ACTIONS.IDLE);
        }
        setCombatState(COMBAT_STATES.TAKING_DAMAGE);
        // Appliquer les dégâts après un court délai
        setTimeout(() => {
          applyDamage();
        }, 100);
        break;

      case COMBAT_STATES.TAKING_DAMAGE:
        console.log("Animation de dégâts terminée");
        if (checkDeath()) {
          // Combat terminé
          const bruteWon = characters.opponent.health <= 0;
          setBruteAction(
            bruteWon ? CHARACTER_ACTIONS.VICTORY : CHARACTER_ACTIONS.DEATH
          );
          setOpponentAction(
            bruteWon ? CHARACTER_ACTIONS.DEATH : CHARACTER_ACTIONS.VICTORY
          );
          setCombatState(COMBAT_STATES.COMBAT_END);
        } else {
          // Remettre les personnages en idle
          setBruteAction(CHARACTER_ACTIONS.IDLE);
          setOpponentAction(CHARACTER_ACTIONS.IDLE);
          // Changer les rôles et commencer un nouveau tour
          switchRoles();
          setTimeout(() => {
            setCombatState(COMBAT_STATES.MOVE_TO_ATTACK);
          }, 500);
        }
        break;

      default:
        console.log("État non géré:", combatState);
        break;
    }
  };

  // Initialisation des états au montage du composant
  useEffect(() => {
    if (!isSceneReady) return;
    const bruteMaxHp = brute?.hp || 100;
    const opponentMaxHp = opponent?.hp || 100;
    const bruteIsFirst = (brute?.speed || 10) > (opponent?.speed || 10);
    console.log(
      "Stats initiales -",
      "Brute:",
      brute?.speed || 10,
      "Opponent:",
      opponent?.speed || 10
    );
    console.log("Premier attaquant:", bruteIsFirst ? "Brute" : "Opponent");

    setCharacters({
      brute: {
        health: bruteMaxHp,
        maxHealth: bruteMaxHp,
        speed: brute?.speed || 10,
        isAttacker: bruteIsFirst,
      },
      opponent: {
        health: opponentMaxHp,
        maxHealth: opponentMaxHp,
        speed: opponent?.speed || 10,
        isAttacker: !bruteIsFirst,
      },
    });

    // Initialiser le premier tour
    if (bruteIsFirst) {
      setBruteAction(CHARACTER_ACTIONS.ATTACK);
      setOpponentAction(CHARACTER_ACTIONS.IDLE);
    } else {
      setOpponentAction(CHARACTER_ACTIONS.ATTACK);
      setBruteAction(CHARACTER_ACTIONS.IDLE);
    }

    setCombatState(COMBAT_STATES.ATTACKING);
  }, [isSceneReady, brute?.speed, opponent?.speed, brute?.hp, opponent?.hp]); // Dépend uniquement des vitesses initiales

  // Gestion des tours de combat
  useEffect(() => {
    if (
      combatState === COMBAT_STATES.MOVE_TO_ATTACK &&
      characters.brute.health > 0 &&
      characters.opponent.health > 0
    ) {
      console.log("=== Nouveau tour ===");
      const attacker = characters.brute.isAttacker ? "brute" : "opponent";
      console.log(`${attacker} attaque`);

      // Lancer l'animation d'attaque
      if (characters.brute.isAttacker) {
        setBruteAction(CHARACTER_ACTIONS.ATTACK);
        setOpponentAction(CHARACTER_ACTIONS.IDLE);
      } else {
        setOpponentAction(CHARACTER_ACTIONS.ATTACK);
        setBruteAction(CHARACTER_ACTIONS.IDLE);
      }

      setCombatState(COMBAT_STATES.ATTACKING);
    }
  }, [combatState, characters]);

  useEffect(() => {
    if (combatState === COMBAT_STATES.COMBAT_END) {
      setFightEnded(true);
    }
  }, [combatState]);

  const handleReturn = () => {
    setFightEnded(false);
    navigate("/arena");
  };

  // Reset des états à chaque nouveau combat
  useEffect(() => {
    setIsSceneReady(false);
    setFightEnded(false);
    setShowReturnButton(false);
    // Ne pas réinitialiser characters ici, laisser l'initialisation dans le useEffect de isSceneReady
    setCombatState(COMBAT_STATES.MOVE_TO_ATTACK);
    setBruteAction(CHARACTER_ACTIONS.IDLE);
    setOpponentAction(CHARACTER_ACTIONS.IDLE);
  }, [brute, opponent]);

  return (
    <div className="fight-page">
      <Menu />
      <div className="fight-container">
        <div className="health-bars">
          <div className="health-bar">
            <div>Brute: {characters.brute.health}HP</div>
            <div className="bar">
              <div
                style={{
                  width: `${
                    (characters.brute.health / characters.brute.maxHealth) * 100
                  }%`,
                }}
              />
            </div>
          </div>
          <div className="health-bar">
            <div>Opponent: {characters.opponent.health}HP</div>
            <div className="bar">
              <div
                style={{
                  width: `${
                    (characters.opponent.health /
                      characters.opponent.maxHealth) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
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
            <div>
              <button className="return-button" onClick={handleReturn}>
                Retour à l'arène
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
