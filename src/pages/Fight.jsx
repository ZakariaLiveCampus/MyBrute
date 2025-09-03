import React from "react";
import Menu from "../components/Menu";
import "../styles/arena.css";

export default function Fight() {
  return (
    <div className="arena-bg">
      <Menu />
      <div
        className="arena-layout"
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: "120px",
        }}
      >
        <h1 style={{ color: "#646cff", fontSize: "2em" }}>
          Page Fight (à compléter)
        </h1>
      </div>
    </div>
  );
}
