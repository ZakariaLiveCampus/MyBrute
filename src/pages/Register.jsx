import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  return (
    <div className="auth-bg">
      <div className="register-container">
        <h2>Inscription</h2>
        <form>
          <div>
            <label>Nom d'utilisateur</label>
            <input type="text" placeholder="Votre nom" />
          </div>
          <div>
            <label>Mot de passe</label>
            <input type="password" placeholder="Votre mot de passe" />
          </div>
          <div>
            <label>Confirmer le mot de passe</label>
            <input type="password" placeholder="Confirmez le mot de passe" />
          </div>
          <button type="submit">S'inscrire</button>
        </form>
        <p>
          Déjà un compte ? <Link to="/login">Connexion</Link>
        </p>
      </div>
    </div>
  );
}
