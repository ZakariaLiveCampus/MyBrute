import React, { useState } from "react";
import "../styles/auth.css";
import Menu from "../components/Menu";

export default function CreateBrute() {
  const [name, setName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // Pour l'instant, juste une alerte
    alert(`Brute créée : ${name}`);
  };

  return (
    <div className="auth-bg">
      <Menu />
      <div className="login-container">
        <h2>Créer ma Brute</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nom de votre Brute</label>
            <input
              type="text"
              placeholder="Entrez un nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit">Continuer</button>
        </form>
      </div>
    </div>
  );
}
