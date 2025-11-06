import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// User signup 
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success:false, 
                error: "User already exists!",
            });
        } 

        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            success: true,
            message: "User signed up successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Error while signing up"
        });
    }
};

// User login 
export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({
                success: false,
                error: "Invalid credentials!",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(403).json({
                success: false,
                error: "Invalid credentials!",
            });
        }

        // Authentication
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }
        res.cookie("jwt", token, cookieOptions);

        res.status(202).json({
            success: true,
            message: "Login Successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Error while logging in"
        })
    }
}

// User logout 
export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Error while logging out"
        })
    }
};