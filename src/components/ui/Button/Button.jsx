import React from "react";
import "./Button.css";

/**
 * Composant Button réutilisable
 * @param {Object} props
 * @param {string} props.variant - Type de bouton: 'primary', 'secondary', 'danger'
 * @param {string} props.size - Taille: 'small', 'medium', 'large'
 * @param {boolean} props.disabled - État désactivé
 * @param {function} props.onClick - Fonction de clic
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @param {string} props.className - Classes CSS supplémentaires
 */
export default function Button({
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
  children,
  className = "",
  ...props
}) {
  const baseClass = "btn";
  const classes = [
    baseClass,
    `btn--${variant}`,
    `btn--${size}`,
    disabled && "btn--disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
