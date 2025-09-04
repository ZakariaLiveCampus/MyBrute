import React, { useEffect, useState } from "react";
import "../styles/home.css";
import Menu from "../components/Menu";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {

  const [userData, setUserData] = useState("");

  useEffect(()=> {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      const response = await axios.get("http://localhost:3000/api/auth/getUserData", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        console.log(response.data);
        setUserData(response.data.data);
        let userInfo = {
          isLoggedIn: true,
          userData: response.data
        }
        sessionStorage.setItem('userData', JSON.stringify(userInfo));
      } else {
        console.log(response.data.message || "Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details : ", err);
      console.log(err.response?.data?.message || "An error occured");
    }
  };

  return (
    <div className="home-bg">
      <Menu />
      <div className="home-content">
        <h1>Bienvenue sur MyBrute {userData.username} ! </h1>
        <p>
          Choisissez une option dans le menu pour commencer votre aventure !
        </p>
      </div>
      <div className="home-main-layout">
        <div className="home-stats">
          <h2>Ma Brute</h2>
          <ul>
            <li>Force : 12</li>
            <li>Agilité : 8</li>
            <li>Vitesse : 10</li>
            <li>Niveau : 3</li>
          </ul>
        </div>
        <div className="home-arena">
          <Link to="/arena">
            <button className="arena-btn">Arène</button>
          </Link>
        </div>
        <div className="home-score">
          <h2>Scores</h2>
          <p>Victoires : 5</p>
          <p>Défaites : 2</p>
        </div>
      </div>
    </div>
  );
}
