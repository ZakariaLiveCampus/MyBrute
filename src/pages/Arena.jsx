import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import "../styles/arena.css";

export default function Arena() {
  const brute = {
    name: "MaBrute",
    level: 4,
    strength: 15,
    agility: 9,
    speed: 11,
    hp: 32,
    weapon: {
      name: "Épée du Tonnerre",
      damage_min: 12,
      damage_max: 18,
      special_effect: "Paralyse 1 tour",
    },
  };

  const opponents = useMemo(() => {
    const names = [
      "DarkWolf",
      "IronFist",
      "Shadow",
      "Thunder",
      "Blaze",
      "Venom",
      "Crusher",
      "Ghost",
      "Titan",
      "Viper",
    ];
    const weapons = [
      {
        name: "Hache de Feu",
        damage_min: 10,
        damage_max: 16,
        special_effect: "Brûle 1 tour",
      },
      {
        name: "Lance de Glace",
        damage_min: 8,
        damage_max: 14,
        special_effect: "Ralentit",
      },
      {
        name: "Marteau du Chaos",
        damage_min: 14,
        damage_max: 20,
        special_effect: "Etourdit",
      },
      {
        name: "Dague Fantôme",
        damage_min: 7,
        damage_max: 13,
        special_effect: "Double attaque",
      },
      {
        name: "Arc du Vent",
        damage_min: 9,
        damage_max: 15,
        special_effect: "Esquive +",
      },
    ];
    const randStat = (base) =>
      Math.max(1, Math.round(base * (0.8 + Math.random() * 0.4)));
    return Array.from({ length: 3 }, (_, i) => {
      const weapon = weapons[Math.floor(Math.random() * weapons.length)];
      return {
        name:
          names[Math.floor(Math.random() * names.length)] +
          Math.floor(Math.random() * 100),
        level: brute.level,
        strength: randStat(brute.strength),
        agility: randStat(brute.agility),
        speed: randStat(brute.speed),
        hp: randStat(brute.hp),
        weapon,
      };
    });
  }, [brute.level, brute.strength, brute.agility, brute.speed, brute.hp]);

  const [selectedIdx, setSelectedIdx] = useState(null);

  const navigate = useNavigate();
  const handleFight = () => {
    if (selectedIdx === null) {
      alert("Sélectionne un opposant avant de combattre !");
      return;
    }
    const opponent = opponents[selectedIdx];
    navigate("/fight", {
      state: {
        brute,
        opponent,
      },
    });
  };

  return (
    <div className="arena-bg">
      <Menu />
      <div className="arena-layout">
        <div className="arena-brute">
          <div className="brute-info">
            <h2>{brute.name}</h2>
            <ul className="brute-stats">
              <li>Force : {brute.strength}</li>
              <li>Agilité : {brute.agility}</li>
              <li>Vitesse : {brute.speed}</li>
              <li>Niveau : {brute.level}</li>
              <li>Vie : {brute.hp}</li>
            </ul>
          </div>
        </div>
        <div className="arena-vs-center">
          <span className="vs-text">VS</span>
        </div>
        <div className="arena-opponents-col">
          {opponents.map((op, idx) => (
            <div
              className={`opponent-card${
                selectedIdx === idx ? " selected" : ""
              }`}
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              style={{ cursor: "pointer" }}
            >
              <strong>{op.name}</strong>
              <br />
              Force : {op.strength}
              <br />
              Agilité : {op.agility}
              <br />
              Vitesse : {op.speed}
              <br />
              Niveau : {op.level}
              <br />
              Vie : {op.hp}
              <br />
            </div>
          ))}
        </div>
      </div>
      <div className="arena-fight-btn-row">
        <button
          className="fight-btn"
          onClick={handleFight}
          disabled={selectedIdx === null}
        >
          Combattre
        </button>
      </div>
    </div>
  );
}
