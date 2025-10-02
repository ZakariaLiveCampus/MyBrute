import express from 'express';
import { login, register, getUserFromToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getUserData', getUserFromToken);

export default router;