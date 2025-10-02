import React, { createContext, useContext, useState } from "react";

// Données par défaut de la brute
const defaultBrute = {
  name: "MaBrute",
  level: 4,
  strength: 15,
  agility: 9,
  speed: 11,
  hp: 32,
  weapon: {
    name: "Épée du Tonnerre",
    damage_min: 12,
    damage_max: 18,
    special_effect: "Paralyse 1 tour",
  },
};

// Données par défaut des scores
const defaultScores = {
  victories: 5,
  defeats: 2,
};

// Création du Context
const GameContext = createContext();

/**
 * Provider pour les données du jeu
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function GameProvider({ children }) {
  const [brute, setBrute] = useState(defaultBrute);
  const [scores, setScores] = useState(defaultScores);
  const [gameSettings, setGameSettings] = useState({
    soundEnabled: true,
    animationsEnabled: true,
  });

  // Fonction pour mettre à jour les stats de la brute
  const updateBrute = (updates) => {
    setBrute((prev) => ({ ...prev, ...updates }));
  };

  // Fonction pour mettre à jour les scores
  const updateScores = (updates) => {
    setScores((prev) => ({ ...prev, ...updates }));
  };

  // Fonction pour ajouter une victoire
  const addVictory = () => {
    setScores((prev) => ({ ...prev, victories: prev.victories + 1 }));
  };

  // Fonction pour ajouter une défaite
  const addDefeat = () => {
    setScores((prev) => ({ ...prev, defeats: prev.defeats + 1 }));
  };

  // Fonction pour générer des adversaires équilibrés
  const generateOpponents = (count = 3) => {
    const names = [
      "DarkWolf",
      "IronFist",
      "Shadow",
      "Thunder",
      "Blaze",
      "Venom",
      "Crusher",
      "Ghost",
      "Titan",
      "Viper",
    ];

    const weapons = [
      {
        name: "Hache de Feu",
        damage_min: 10,
        damage_max: 16,
        special_effect: "Brûle 1 tour",
      },
      {
        name: "Lance de Glace",
        damage_min: 8,
        damage_max: 14,
        special_effect: "Ralentit",
      },
      {
        name: "Marteau du Chaos",
        damage_min: 14,
        damage_max: 20,
        special_effect: "Etourdit",
      },
      {
        name: "Dague Fantôme",
        damage_min: 7,
        damage_max: 13,
        special_effect: "Double attaque",
      },
      {
        name: "Arc du Vent",
        damage_min: 9,
        damage_max: 15,
        special_effect: "Esquive +",
      },
    ];

    const randStat = (base) =>
      Math.max(1, Math.round(base * (0.8 + Math.random() * 0.4)));

    return Array.from({ length: count }, (_, i) => {
      const weapon = weapons[Math.floor(Math.random() * weapons.length)];
      return {
        id: i,
        name:
          names[Math.floor(Math.random() * names.length)] +
          Math.floor(Math.random() * 100),
        level: brute.level,
        strength: randStat(brute.strength),
        agility: randStat(brute.agility),
        speed: randStat(brute.speed),
        hp: randStat(brute.hp),
        weapon,
      };
    });
  };

  const contextValue = {
    // Données
    brute,
    scores,
    gameSettings,

    // Actions
    updateBrute,
    updateScores,
    addVictory,
    addDefeat,
    generateOpponents,
    setGameSettings,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
}

/**
 * Hook pour utiliser le GameContext
 * @returns {Object} Context values et actions
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

export default GameContext;
