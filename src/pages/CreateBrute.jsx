import React, { useState } from "react";
import "../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "../components/layout/Navigation/Navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreateBrute() {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:3000/api/brutes/create",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Brute créée avec succès !");
        console.log("Nouvelle brute :", response.data.brute);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la création de la brute");
    }
  };

  return (
    <div className="auth-bg">
      <Navigation />
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
          <button type="submit"><Link to="/home">Continuer</Link></button>
        </form>
      </div>
    </div>
  );
}
