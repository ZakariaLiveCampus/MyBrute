import React from "react";
import "./BruteDisplay.css";

export default function BruteDisplay({ brute, className = "" }) {
  return (
    <div className={`brute-display ${className}`}>
        <img
          src="/assets/Biker_avatar.png"
          alt={brute?.name || "Ma Brute"}
          className="brute-image"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      
    </div>
  );
}
