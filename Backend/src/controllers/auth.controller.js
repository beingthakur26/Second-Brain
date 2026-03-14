import { userModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    );
};

const registerUser = async (req, res) => {

    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const isAlreadyRegistered = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (isAlreadyRegistered) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash
        });

        const token = createToken(user);

        res.cookie("token", token);

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

const loginUser = async (req, res) => {

    try {

        const { email, username, password } = req.body;

        if ((!email && !username) || !password) {
            return res.status(400).json({
                message: "Email/username and password required"
            });
        }

        const user = await userModel.findOne({
            $or: [{ email }, { username }]
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = createToken(user);

        res.cookie("token", token);

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

const logoutUser = (req, res) => {

    res.clearCookie("token");

    return res.status(200).json({
        message: "User logged out successfully"
    });
};

const getMe = async (req, res) => {

    try {

        const user = await userModel
            .findById(req.user.id)
            .select("-password");

        return res.status(200).json({
            message: "User fetched successfully",
            user
        });

    } catch (error) {

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    getMe
};