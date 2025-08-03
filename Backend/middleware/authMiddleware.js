import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies['jwt-linkedIn'];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is not defined");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in authMiddleware: ", error.message);
        if (error.message === "JWT_SECRET_KEY is not defined") {
            return res.status(500).json({ message: "Server configuration error: JWT_SECRET_KEY is missing" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};