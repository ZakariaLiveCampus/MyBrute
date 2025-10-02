import React from "react";
import { Card, StatBar } from "../../ui";
import "./BruteCard.css";

/**
 * Composant BruteCard pour afficher les informations d'une brute
 * @param {Object} props
 * @param {Object} props.brute - Données de la brute
 * @param {boolean} props.compact - Version compacte
 * @param {boolean} props.selectable - Peut être sélectionné
 * @param {boolean} props.selected - Est sélectionné
 * @param {boolean} props.isOpponent - Si c'est un opposant (pour l'avatar)
 * @param {function} props.onSelect - Fonction de sélection
 */
export default function BruteCard({
  brute,
  compact = false,
  selectable = false,
  selected = false,
  isOpponent = false,
  onSelect,
  ...props
}) {
  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect(brute);
    }
  };

  // Choisir l'avatar selon si c'est un opposant ou pas
  const avatarSrc = isOpponent
    ? "/assets/Cyborg_portrait.png"
    : "/assets/Biker_portrait.png";

  return (
    <Card
      className={`brute-card ${compact ? "brute-card--compact" : ""} ${
        selected ? "brute-card--selected" : ""
      }`}
      clickable={selectable}
      onClick={handleClick}
      {...props}
    >
      <div className="brute-card__header">
        <div className="brute-card__avatar">
          <img
            src={avatarSrc}
            alt={brute.name}
            className="brute-card__avatar-img"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
        <div className="brute-card__info">
          <h3 className="brute-card__name">{brute.name}</h3>
          <span className="brute-card__level">Niveau {brute.level}</span>
        </div>
      </div>

      <div className="brute-card__stats">
        {!compact ? (
          <>
            <StatBar
              label="Vie"
              value={brute.hp}
              maxValue={brute.hp}
              color="health"
            />
            <div className="brute-card__stat-row">
              <div className="brute-card__stat">
                <span className="brute-card__stat-label">Force:</span>
                <span className="brute-card__stat-value">{brute.strength}</span>
              </div>
              <div className="brute-card__stat">
                <span className="brute-card__stat-label">Agilité:</span>
                <span className="brute-card__stat-value">{brute.agility}</span>
              </div>
            </div>
            <div className="brute-card__stat-row">
              <div className="brute-card__stat">
                <span className="brute-card__stat-label">Vitesse:</span>
                <span className="brute-card__stat-value">{brute.speed}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="brute-card__compact-stats">
            <span>F:{brute.strength}</span>
            <span>A:{brute.agility}</span>
            <span>V:{brute.speed}</span>
            <span>HP:{brute.hp}</span>
          </div>
        )}
      </div>

      {brute.weapon && (
        <div className="brute-card__weapon">
          <strong>{brute.weapon.name}</strong>
          <span className="brute-card__weapon-damage">
            {brute.weapon.damage_min}-{brute.weapon.damage_max} dégâts
          </span>
          {brute.weapon.special_effect && (
            <span className="brute-card__weapon-effect">
              {brute.weapon.special_effect}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
