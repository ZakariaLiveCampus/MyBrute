import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

/**
 * Composant Navigation principal avec gestion des liens actifs
 */
export default function Navigation() {
  const location = useLocation();

  const navigationItems = [
    { path: "/home", label: "Accueil" },
    { path: "/arena", label: "Arène" },
    { path: "/create-brute", label: "Créer ma Brute" },
    { path: "/logout", label: "Se déconnecter" },
    // Liens temporairement désactivés jusqu'à implémentation
    // { path: '/options', label: 'Options' },
    // { path: '/top-ladder', label: 'Top Ladder' },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <ul className="navigation__list">
        {navigationItems.map((item) => (
          <li key={item.path} className="navigation__item">
            <Link
              to={item.path}
              className={`navigation__link ${
                isActivePath(item.path) ? "navigation__link--active" : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
