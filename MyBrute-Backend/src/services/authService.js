import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

export const registerUser = async(user) => {
    console.log(user);

    try {
        const hashedPassword = await bcrypt.hash(user.password, 8);
        const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
        const values = [user.username, hashedPassword];

        await pool.query(query,values);
        return {success: true, message: "User registered successfully"}

    } catch (error) {
        return {success: false, message: "Registration failed, please try again !"}
    }
}