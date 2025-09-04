import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import axios from 'axios';
import { toast } from "react-toastify";

export default function Register() {

  const [formValues, setFormValues] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormValues({...formValues,[name]:value});
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formValues);

    try{
      const response = await axios.post("http://localhost:3000/api/auth/register", formValues);
      console.log(response, 'res');

      if (response.data.success){
        toast.success(response.data.message || "Registration successful !");
        setFormValues({username: "", password: ""});
      } else {
        toast.error(response.data.message || "Registration failed ! Please retry.");
      }
    } catch (error) {
      console.error("Error during registration :", error);
      toast.error(error.response.data.message || "Something went wrong, please try again later.");
    }
  }

  return (
    <div className="auth-bg">
      <div className="register-container">
        <h2>Inscription</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nom d'utilisateur</label>
            <input type="text" placeholder="Votre nom" name="username" value={formValues.username} onChange={handleInputChange} />
          </div>
          <div>
            <label>Mot de passe</label>
            <input type="password" placeholder="Votre mot de passe" name="password" value={formValues.password} onChange={handleInputChange}/>
          </div>
          <div>
            <label>Confirmer le mot de passe</label>
            <input type="password" placeholder="Confirmez le mot de passe" name="password" value={formValues.password} onChange={handleInputChange}/>
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
