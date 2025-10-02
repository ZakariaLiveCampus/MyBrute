import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { toast } from "react-toastify";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {username, password:password})
      if (response.data.success) {
        toast.success(response.data.message || 'Login successful !')

        const token = response.data.token;
        sessionStorage.setItem("authToken", token);
        navigate("/home")

      } else {
        toast.error(response.data.message || 'Authentication failed !')
      }
    } catch (error) {
      console.error('Error during authentication :', error.response.data);
      toast.error(error.response.data.message || 'Something went wrong. Please try again');
    }
  }

  return (
    <div className="auth-bg">
      <div className="login-container">
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nom d'utilisateur</label>
            <input type="text" placeholder="Votre nom" onChange={e => setUsername(e.target.value)}/>
          </div>
          <div>
            <label>Mot de passe</label>
            <input type="password" placeholder="Votre mot de passe" onChange={e => setPassword(e.target.value)}/>
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
