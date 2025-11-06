import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Authentication function
export const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({message: "No token, authorization denied"});

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decodedUser.id;

        next();

    } catch (err) {
        console.error("JWT verification error:", err);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};