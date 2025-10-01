import React from "react";
import { StatBar } from "../../ui";
import "./HealthBar.css";

/**
 * Composant HealthBar spécialisé pour le combat
 * @param {Object} props
 * @param {string} props.characterName - Nom du personnage
 * @param {number} props.currentHealth - Vie actuelle
 * @param {number} props.maxHealth - Vie maximale
 * @param {boolean} props.isPlayer - Si c'est le joueur
 */
export default function HealthBar({
  characterName,
  currentHealth,
  maxHealth,
  isPlayer = false,
  ...props
}) {
  const healthPercentage = (currentHealth / maxHealth) * 100;

  // Couleur dynamique selon le pourcentage de vie
  let healthColor = "health";
  if (healthPercentage <= 25) {
    healthColor = "danger";
  } else if (healthPercentage <= 50) {
    healthColor = "warning";
  }

  return (
    <div
      className={`health-bar ${
        isPlayer ? "health-bar--player" : "health-bar--opponent"
      }`}
      {...props}
    >
      <div className="health-bar__info">
        <span className="health-bar__name">{characterName}</span>
        <span className="health-bar__values">
          {currentHealth}/{maxHealth} HP
        </span>
      </div>
      <div className="health-bar__container">
        <div
          className={`health-bar__fill health-bar__fill--${healthColor}`}
          style={{ width: `${Math.max(0, healthPercentage)}%` }}
        />
        {healthPercentage <= 25 && (
          <div className="health-bar__danger-indicator" />
        )}
      </div>
    </div>
  );
}
