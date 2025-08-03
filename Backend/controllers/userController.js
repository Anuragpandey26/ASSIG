import User from '../models/user.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const user = new User({
            name,
            username,
            email,
            password: hashedPassword
        });
        await user.save();

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is not defined");
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" });

        res.cookie("jwt-linkedIn", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({ message: "User registered successfully" });

    } catch (error) {
        console.log("Error in signup: ", error.message);
        if (error.message === "JWT_SECRET_KEY is not defined") {
            return res.status(500).json({ message: "Server configuration error: JWT_SECRET_KEY is missing" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is not defined");
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" });
        await res.cookie("jwt-linkedIn", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
        res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
        console.log("Error in login controller ", error);
        if (error.message === "JWT_SECRET_KEY is not defined") {
            return res.status(500).json({ message: "Server configuration error: JWT_SECRET_KEY is missing" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("jwt-linkedIn");
    res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error("Error in getCurrentUser controller:", error);
        res.status(500).json({ message: "Internal Server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, username, email, mobile, headline, curr_company, curr_location, profilePic, cover_pic, about, skills, experience } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updateData = {};

        if (name) updateData.name = name;
        if (username) {
            const normalizedUsername = username.toLowerCase();
            const existingUsername = await User.findOne({ username: normalizedUsername, _id: { $ne: user._id } });
            if (existingUsername) {
                return res.status(400).json({ message: "Username already exists" });
            }
            updateData.username = normalizedUsername;
        }
        if (email) {
            const normalizedEmail = email.toLowerCase();
            const existingEmail = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already exists" });
            }
            updateData.email = normalizedEmail;
        }
        if (mobile !== undefined) updateData.mobile = mobile;
        if (headline !== undefined) updateData.headline = headline;
        if (curr_company !== undefined) updateData.curr_company = curr_company;
        if (curr_location !== undefined) updateData.curr_location = curr_location;
        if (profilePic) updateData.profilePic = profilePic;
        if (cover_pic) updateData.cover_pic = cover_pic;
        if (about !== undefined) updateData.about = about;
        if (skills) updateData.skills = Array.isArray(skills) ? skills : [];
        if (experience) {
            if (!Array.isArray(experience)) {
                return res.status(400).json({ message: "Experience must be an array" });
            }
            for (const exp of experience) {
                if (!exp.designation || !exp.company_name || !exp.duration || !exp.location) {
                    return res.status(400).json({ message: "Each experience entry must include designation, company_name, duration, and location" });
                }
            }
            updateData.experience = experience;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.log("Error in updateProfile: ", error.message);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email or username already exists" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};