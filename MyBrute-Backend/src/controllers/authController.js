import UserModel from "../models/userModel.js";
import { loginUser, registerUser, getUserFromToken as getUserFromTokenService } from "../services/authService.js";

export const register = async(req, res) => {
    const {username, password} = req.body;

    if(!username || !password){
        return res.status(400).json({success: false, message: "All fields are required"});
    }

    const user = new UserModel({username, password});

    try {
        const response = await registerUser(user);
        if(response.success){
            return res.status(200).json(response)
        } else {
            return res.status(400).json(response)
        }

    } catch (error) {
        return {success: false, message: "Registration failed, please try again."}
    }
}

export const login = async(req, res) => {
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json({success: false, message: "All fields are required"});
    }

    try {
        const response = await loginUser(username, password);
        if(response.success){
            return res.status(200).json(response)
        } else {
            return res.status(400).json(response)
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Authentication failed, please try again." });
    }
}

export const getUserFromToken = async(req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({success: false, message: "Token not Provided"});
    }

    try {
        const response = await getUserFromTokenService(token);
        if(response.success){
            return res.status(200).json(response)
        } else {
            return res.status(400).json(response)
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to retrieve data" });
    }
}