import { useState, useEffect, useCallback } from "react";

// États possibles du combat
export const COMBAT_STATES = {
  MOVE_TO_ATTACK: "MOVE_TO_ATTACK",
  ATTACKING: "ATTACKING",
  TAKING_DAMAGE: "TAKING_DAMAGE",
  RETURNING: "RETURNING",
  CHECKING_DEATH: "CHECKING_DEATH",
  SWITCHING_ROLES: "SWITCHING_ROLES",
  COMBAT_END: "COMBAT_END",
};

// Actions possibles des personnages
export const CHARACTER_ACTIONS = {
  IDLE: "idle",
  ATTACK: "attack",
  HURT: "hurt",
  DEATH: "death",
  VICTORY: "climb",
};

/**
 * Hook personnalisé pour gérer la logique de combat
 * @param {Object} brute - Données de la brute du joueur
 * @param {Object} opponent - Données de l'adversaire
 * @param {Function} onCombatEnd - Callback appelé quand le combat se termine
 */
export function useCombat(brute, opponent, onCombatEnd) {
  // État des personnages
  const [characters, setCharacters] = useState({
    brute: {
      health: 100,
      maxHealth: 100,
      speed: 10,
      isAttacker: false,
    },
    opponent: {
      health: 100,
      maxHealth: 100,
      speed: 10,
      isAttacker: false,
    },
  });

  // État du combat
  const [combatState, setCombatState] = useState(COMBAT_STATES.MOVE_TO_ATTACK);
  const [bruteAction, setBruteAction] = useState(CHARACTER_ACTIONS.IDLE);
  const [opponentAction, setOpponentAction] = useState(CHARACTER_ACTIONS.IDLE);
  const [fightEnded, setFightEnded] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);

  // Initialisation des personnages
  const initializeCombat = useCallback(() => {
    if (!brute || !opponent) return;

    const bruteMaxHp = brute.hp || 100;
    const opponentMaxHp = opponent.hp || 100;
    const bruteIsFirst = (brute.speed || 10) > (opponent.speed || 10);

    setCharacters({
      brute: {
        health: bruteMaxHp,
        maxHealth: bruteMaxHp,
        speed: brute.speed || 10,
        isAttacker: bruteIsFirst,
      },
      opponent: {
        health: opponentMaxHp,
        maxHealth: opponentMaxHp,
        speed: opponent.speed || 10,
        isAttacker: !bruteIsFirst,
      },
    });

    // Ne pas définir les actions d'attaque immédiatement
    // On attend que la scène soit prête
    setBruteAction(CHARACTER_ACTIONS.IDLE);
    setOpponentAction(CHARACTER_ACTIONS.IDLE);

    setCombatState(COMBAT_STATES.MOVE_TO_ATTACK);
    setFightEnded(false);
  }, [brute, opponent]);

  // Application des dégâts
  const applyDamage = useCallback(() => {
    const damage = Math.floor(Math.random() * 20) + 10;

    setCharacters((prev) => {
      const defender = prev.brute.isAttacker ? "opponent" : "brute";
      const newHealth = Math.max(0, prev[defender].health - damage);

      if (newHealth <= 0) {
        // Combat terminé
        setTimeout(() => {
          if (defender === "opponent") {
            setBruteAction(CHARACTER_ACTIONS.VICTORY);
            setOpponentAction(CHARACTER_ACTIONS.DEATH);
          } else {
            setBruteAction(CHARACTER_ACTIONS.DEATH);
            setOpponentAction(CHARACTER_ACTIONS.VICTORY);
          }
          setCombatState(COMBAT_STATES.COMBAT_END);
          setFightEnded(true);
        }, 500);
      } else {
        // Continue le combat
        setTimeout(() => {
          setCombatState(COMBAT_STATES.SWITCHING_ROLES);
          setBruteAction(CHARACTER_ACTIONS.IDLE);
          setOpponentAction(CHARACTER_ACTIONS.IDLE);

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
  }, []);

  // Changement des rôles
  const switchRoles = useCallback(() => {
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
  }, []);

  // Gestion de la fin d'animation
  const handleAnimationComplete = useCallback(() => {
    switch (combatState) {
      case COMBAT_STATES.ATTACKING:
        // Appliquer l'animation de dégât au défenseur
        if (characters.brute.isAttacker) {
          setOpponentAction(CHARACTER_ACTIONS.HURT);
          setBruteAction(CHARACTER_ACTIONS.IDLE);
        } else {
          setBruteAction(CHARACTER_ACTIONS.HURT);
          setOpponentAction(CHARACTER_ACTIONS.IDLE);
        }
        setCombatState(COMBAT_STATES.TAKING_DAMAGE);

        setTimeout(() => {
          applyDamage();
        }, 100);
        break;

      case COMBAT_STATES.TAKING_DAMAGE:
        if (characters.brute.health <= 0 || characters.opponent.health <= 0) {
          // Combat déjà géré dans applyDamage
          return;
        }

        setBruteAction(CHARACTER_ACTIONS.IDLE);
        setOpponentAction(CHARACTER_ACTIONS.IDLE);
        switchRoles();

        setTimeout(() => {
          setCombatState(COMBAT_STATES.MOVE_TO_ATTACK);
        }, 500);
        break;

      default:
        break;
    }
  }, [combatState, characters, applyDamage, switchRoles]);

  // Démarrage d'un nouveau tour
  useEffect(() => {
    if (
      combatState === COMBAT_STATES.MOVE_TO_ATTACK &&
      characters.brute.health > 0 &&
      characters.opponent.health > 0
    ) {
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

  // Démarrer le combat quand la scène est prête
  useEffect(() => {
    if (
      isSceneReady &&
      !fightEnded &&
      combatState === COMBAT_STATES.MOVE_TO_ATTACK
    ) {
      // Démarrer immédiatement le premier tour
      if (characters.brute.isAttacker) {
        setBruteAction(CHARACTER_ACTIONS.ATTACK);
        setOpponentAction(CHARACTER_ACTIONS.IDLE);
      } else {
        setOpponentAction(CHARACTER_ACTIONS.ATTACK);
        setBruteAction(CHARACTER_ACTIONS.IDLE);
      }
      setCombatState(COMBAT_STATES.ATTACKING);
    }
  }, [isSceneReady, fightEnded, combatState, characters]);

  // Appeler le callback quand le combat se termine
  useEffect(() => {
    if (fightEnded && onCombatEnd) {
      const winner = characters.brute.health > 0 ? "brute" : "opponent";
      onCombatEnd(winner);
    }
  }, [fightEnded, characters, onCombatEnd]);

  // Initialisation au montage du composant
  useEffect(() => {
    initializeCombat();
  }, [initializeCombat]);

  // Reset du combat
  const resetCombat = useCallback(() => {
    setCombatState(COMBAT_STATES.MOVE_TO_ATTACK);
    setBruteAction(CHARACTER_ACTIONS.IDLE);
    setOpponentAction(CHARACTER_ACTIONS.IDLE);
    setFightEnded(false);
    initializeCombat();
  }, [initializeCombat]);

  return {
    // États
    characters,
    combatState,
    bruteAction,
    opponentAction,
    fightEnded,
    isSceneReady,

    // Actions
    initializeCombat,
    handleAnimationComplete,
    resetCombat,
    setIsSceneReady,

    // Helpers
    winner: fightEnded
      ? characters.brute.health > 0
        ? "brute"
        : "opponent"
      : null,
  };
}

export default useCombat;
