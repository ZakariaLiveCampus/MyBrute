import { pool } from "../config/db.js";

export const createBrute = async (userId, name) => {
  try {
    // Générer des stats aléatoires (entre 0 et 10)
    const strength = Math.floor(Math.random() * 11);
    const agility = Math.floor(Math.random() * 11);
    const speed = Math.floor(Math.random() * 11);

    const query = `
      INSERT INTO brutes (user_id, name, strength, agility, speed)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [userId, name, strength, agility, speed];

    const [result] = await pool.query(query, values);

    return {
      success: true,
      message: "Brute créée avec succès",
      brute: {
        id: result.insertId,
        user_id: userId,
        name,
        level: 1,
        xp: 0,
        hp: 100,
        strength,
        agility,
        speed,
      },
    };
  } catch (error) {
    return { success: false, message: "Erreur lors de la création de la brute", error };
  }
};

export const getBrutesByUser = async (userId) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM brutes WHERE user_id = ?`, [userId]);

    return {
      success: true,
      brutes: rows,
    };
  } catch (error) {
    return { success: false, message: "Erreur lors de la récupération des brutes", error };
  }
};

export const getBruteStats = async (bruteId) => {
  try {
    const query = `
      SELECT 
        b.id,
        b.name,
        SUM(CASE WHEN bt.winner_id = b.id THEN 1 ELSE 0 END) AS victories,
        SUM(CASE WHEN bt.winner_id IS NOT NULL AND bt.winner_id <> b.id 
                 AND (bt.attacker_id = b.id OR bt.defender_id = b.id) THEN 1 ELSE 0 END) AS defeats
      FROM brutes b
      LEFT JOIN battles bt ON b.id IN (bt.attacker_id, bt.defender_id)
      WHERE b.id = ?
      GROUP BY b.id, b.name
    `;

    const [rows] = await pool.query(query, [bruteId]);
    return { success: true, stats: rows[0] || { victories: 0, defeats: 0 } };
  } catch (error) {
    return { success: false, message: "Erreur lors de la récupération des stats", error };
  }
};

export const getOpponentsByLevel = async (level, excludeId) => {
  try {
    const minLevel = Math.max(1, level - 2); // niveau min >= 1
    const maxLevel = level + 2;

    const query = `
      SELECT *
      FROM brutes
      WHERE id <> ?
        AND level BETWEEN ? AND ?
      ORDER BY RAND()
      LIMIT 5
    `;
    const values = [excludeId, minLevel, maxLevel];

    const [rows] = await pool.query(query, values);

    return {
      success: true,
      opponents: rows,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la récupération des adversaires",
      error,
    };
  }
};
