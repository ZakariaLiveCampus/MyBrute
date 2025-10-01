import React from "react";
import "./Card.css";

/**
 * Composant Card réutilisable
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu de la carte
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {boolean} props.hoverable - Effet hover
 * @param {boolean} props.clickable - Effet cliquable
 * @param {function} props.onClick - Fonction de clic
 */
export default function Card({
  children,
  className = "",
  hoverable = false,
  clickable = false,
  onClick,
  ...props
}) {
  const classes = [
    "card",
    hoverable && "card--hoverable",
    clickable && "card--clickable",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
