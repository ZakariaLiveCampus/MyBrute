import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  return (
    <div className="auth-bg">
      <div className="login-container">
        <h2>Connexion</h2>
        <form>
          <div>
            <label>Nom d'utilisateur</label>
            <input type="text" placeholder="Votre nom" />
          </div>
          <div>
            <label>Mot de passe</label>
            <input type="password" placeholder="Votre mot de passe" />
          </div>
          <button type="submit">Se connecter</button>
        </form>
        <p>
          Pas de compte ? <Link to="/register">Inscription</Link>
        </p>
      </div>
    </div>
  );
}
