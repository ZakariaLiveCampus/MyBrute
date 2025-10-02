import { pool } from "../config/db.js";

export const createBattle = async (attackerId, defenderId, winnerId) => {
  try {
    const experience = 5;

    const query = `
      INSERT INTO battles (attacker_id, defender_id, winner_id, experience_gained)
      VALUES (?, ?, ?, ?)
    `;
    const values = [attackerId, defenderId, winnerId, experience];
    const [result] = await pool.query(query, values);

    const xpQuery = `UPDATE brutes SET xp = xp + ? WHERE id = ?`;
    await pool.query(xpQuery, [experience, winnerId]);

    const levelUpQuery = `
    UPDATE brutes
    SET level = level + 1, xp = 0
    WHERE id = ? AND xp >= 50
    `;
    await pool.query(levelUpQuery, [winnerId]);

    return {
      success: true,
      message: "Combat enregistré",
      battleId: result.insertId,
      experienceGained: experience,
    };
  } catch (error) {
    return { success: false, message: "Erreur lors de l'enregistrement du combat", error };
  }
};
