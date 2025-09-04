import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Menu from "../components/Menu";
import CombatPhaser from "../components/CombatPhaser";
import "../styles/arena.css";

export default function Fight() {
  const { state } = useLocation();
  if (!state) return <div>Erreur : données manquantes</div>;
  const { brute, opponent } = state;

  // Prépare la séquence d'actions du combat
  function getCombatSteps(brute, opponent) {
    let steps = [];
    let b = { ...brute, hp: brute.hp };
    let o = { ...opponent, hp: opponent.hp };
    let attacker, defender;
    if (b.speed >= o.speed) {
      attacker = b;
      defender = o;
    } else {
      attacker = o;
      defender = b;
    }
    steps.push({
      action: "attack",
      attacker: attacker.name,
      defender: defender.name,
      bHp: b.hp,
      oHp: o.hp,
    });
    while (b.hp > 0 && o.hp > 0) {
      const dmg =
        Math.floor(
          Math.random() *
            (attacker.weapon.damage_max - attacker.weapon.damage_min + 1)
        ) + attacker.weapon.damage_min;
      defender.hp -= dmg;
      // Animation d'attaque
      steps.push({
        action: "attack",
        attacker: attacker.name,
        defender: defender.name,
        bHp: b.hp,
        oHp: o.hp,
      });
      // Animation de hit
      steps.push({
        action: "hurt",
        attacker: attacker.name,
        defender: defender.name,
        bHp: b.hp,
        oHp: o.hp,
      });
      if (defender.hp <= 0) break;
      [attacker, defender] = [defender, attacker];
    }
    // Animation de mort ou victoire
    if (b.hp <= 0) {
      steps.push({ action: "death", winner: o.name });
    } else {
      steps.push({ action: "win", winner: b.name });
    }
    return steps;
  }

  const combatSteps = getCombatSteps(brute, opponent);
  const [step, setStep] = useState(0);
  const current = combatSteps[step];

  // Détermine l'action à afficher pour la brute
  let bruteAction = "idle";
  if (current) {
    if (current.action === "attack" && current.attacker === brute.name)
      bruteAction = "attack";
    if (current.action === "hurt" && current.defender === brute.name)
      bruteAction = "hurt";
    if (current.action === "death" && current.winner !== brute.name)
      bruteAction = "death";
    if (current.action === "win" && current.winner === brute.name)
      bruteAction = "climb";
  }

  // Avance automatiquement à chaque étape
  useEffect(() => {
    if (step < combatSteps.length - 1) {
      const timer = setTimeout(() => setStep(step + 1), 1200);
      return () => clearTimeout(timer);
    }
  }, [step, combatSteps.length]);

  return (
    <div className="arena-bg">
      <Menu />
      <div className="arena-layout" style={{ marginTop: "120px" }}>
        <h2>
          Combat : {brute.name} VS {opponent.name}
        </h2>
        <CombatPhaser brute={brute} opponent={opponent} action={bruteAction} />
        {/* <ul>
          {combatSteps.slice(0, step + 1).map((c, i) => (
            <li key={i}>
              {c.action === "attack" && `${c.attacker} attaque ${c.defender}`}
              {c.action === "hurt" && `${c.defender} prend des dégâts`}
              {c.action === "death" && `${c.winner} gagne !`}
              {c.action === "win" && `${c.winner} gagne !`}
            </li>
          ))}
        </ul> */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <Link to="/arena">Revenir à l'arène</Link>
        </div>
      </div>
    </div>
  );
}
