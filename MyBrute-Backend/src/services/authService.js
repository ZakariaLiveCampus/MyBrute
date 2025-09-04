import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET ="udstyguyds98d98798iudsgjdskkdjhds8698"; 

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

export const loginUser = async(username, password) => {
    try{
        const [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [username])

        if(rows.length === 0){
            return {success: false, message: "User not found"}
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return {success: false, message: 'User not found'};
        }
        const token = jwt.sign(
            {id: user.id, username: user.username},
            JWT_SECRET,
            {expiresIn: '1h'}
        )
return{
    success: true,
    message: 'Login Successfull',
    token: token
}

    } catch (error) {
        return {success: false, message: 'Authentication failed. Please try again.', error: error};
    }
}

export const getUserFromToken = async(token) => {
    try {
        const trimmedToken = token.trim();
        const decodedToken = jwt.verify(trimmedToken, JWT_SECRET);

        const [rows] = await pool.query(`SELECT id, username FROM users where username = ?`, [decodedToken.username]);

        if(rows.length === 0){
            return {success: false, message: "User not found"}
        }
        return {success: true, data:rows[0]}

    } catch (error) {
        return {success: false, message: "Invalid Token", error: error}
    }
}