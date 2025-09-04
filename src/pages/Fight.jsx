import React from "react";
import { useLocation, Link } from "react-router-dom";
import Menu from "../components/Menu";
import "../styles/arena.css";

export default function Fight() {
  const { state } = useLocation();
  if (!state) return <div>Erreur : données manquantes</div>;
  const { brute, opponent } = state;

  function simulateFight(brute, opponent) {
    let log = [];
    let b = { ...brute, hp: brute.hp };
    let o = { ...opponent, hp: opponent.hp };
    let turn = 0;

    let attacker, defender;
    // Détermine qui commence
    if (b.speed >= o.speed) {
      attacker = b;
      defender = o;
    } else {
      attacker = o;
      defender = b;
    }
    log.push(`${attacker.name} commence le combat !`);
    while (b.hp > 0 && o.hp > 0) {
      // Attaque
      const dmg =
        Math.floor(
          Math.random() *
            (attacker.weapon.damage_max - attacker.weapon.damage_min + 1)
        ) + attacker.weapon.damage_min;
      defender.hp -= dmg;
      log.push(
        `${attacker.name} attaque ${
          defender.name
        } et inflige ${dmg} dégâts. PV ${defender.name}: ${Math.max(
          defender.hp,
          0
        )}`
      );

      // Vérifie si le défenseur est KO
      if (defender.hp <= 0) break;

      // Change de rôle
      [attacker, defender] = [defender, attacker];
    }
    log.push(b.hp > 0 ? `${b.name} gagne !` : `${o.name} gagne !`);
    return log;
  }

  const log = simulateFight(brute, opponent);

  return (
    <div className="arena-bg">
      <Menu />
      <div className="arena-layout" style={{ marginTop: "120px" }}>
        <h2>
          Combat : {brute.name} VS {opponent.name}
        </h2>
        <ul>
          {log.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <Link to="/arena">Revenir à l'arène</Link>
        </div>
      </div>
    </div>
  );
}
