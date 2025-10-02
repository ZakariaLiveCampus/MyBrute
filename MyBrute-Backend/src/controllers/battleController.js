import { createBattle } from "../services/battleService.js";

export const recordBattle = async (req, res) => {
  const { attackerId, defenderId, winnerId } = req.body;

  if (!attackerId || !defenderId || !winnerId) {
    return res.status(400).json({ success: false, message: "Paramètres manquants" });
  }

  try {
    const response = await createBattle(attackerId, defenderId, winnerId);
    if (response.success) {
      return res.status(201).json(response);
    } else {
      return res.status(400).json(response);
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
