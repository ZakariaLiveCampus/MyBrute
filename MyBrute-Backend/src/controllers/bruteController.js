import { createBrute, getBrutesByUser } from "../services/bruteService.js";

export const create = async (req, res) => {
  const { name } = req.body;
  const userId = req.user?.id;

  if (!name) {
    return res.status(400).json({ success: false, message: "Le nom est requis" });
  }

  try {
    const response = await createBrute(userId, name);
    if (response.success) {
      return res.status(201).json(response);
    } else {
      return res.status(400).json(response);
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const getMyBrutes = async (req, res) => {
  const userId = req.user?.id;

  try {
    const response = await getBrutesByUser(userId);
    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const getStats = async (req, res) => {
  const { bruteId } = req.params;

  try {
    const response = await getBruteStats(bruteId);
    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};