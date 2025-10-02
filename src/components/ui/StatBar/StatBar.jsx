import React from "react";
import "./StatBar.css";

/**
 * Composant StatBar pour afficher des barres de statistiques
 * @param {Object} props
 * @param {string} props.label - Libellé de la stat
 * @param {number} props.value - Valeur actuelle
 * @param {number} props.maxValue - Valeur maximale
 * @param {string} props.color - Couleur de la barre: 'health', 'mana', 'experience'
 * @param {boolean} props.showText - Afficher le texte de valeur
 * @param {string} props.className - Classes CSS supplémentaires
 */
export default function StatBar({
  label,
  value,
  maxValue,
  color = "health",
  showText = true,
  className = "",
  ...props
}) {
  const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));

  const classes = ["stat-bar", className].filter(Boolean).join(" ");

  const barClasses = ["stat-bar__fill", `stat-bar__fill--${color}`].join(" ");

  return (
    <div className={classes} {...props}>
      {label && (
        <div className="stat-bar__label">
          {label}
          {showText && (
            <span className="stat-bar__text">
              {value}/{maxValue}
            </span>
          )}
        </div>
      )}
      <div className="stat-bar__container">
        <div className={barClasses} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
