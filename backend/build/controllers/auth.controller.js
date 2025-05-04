import { apiResponse } from "../utils/apiResponse.util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.util.js";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        if (!email || !fullName || !password) {
            apiResponse.badRequest(res, "All fields are required");
            return;
        }
        if (password.length < 8) {
            apiResponse.badRequest(res, "Password must be at least 8 characters");
            return;
        }
        const user = await User.findOne({ email });
        if (user) {
            apiResponse.badRequest(res, "Email already exists");
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            email: email,
            fullName: fullName,
            password: hashedPassword,
        });
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            apiResponse.created(res, {
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            });
            return;
        }
        else {
            apiResponse.badRequest(res, "Invalid user data");
            return;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in signin controller", error.message);
            apiResponse.internalServerError(res, error.message);
        }
        else {
            apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            apiResponse.badRequest(res, "Invalid credentials");
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            apiResponse.badRequest(res, "Invalid credentials");
            return;
        }
        generateToken(user._id, res);
        apiResponse.success(res, {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
        });
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in login controller", error.message);
            apiResponse.internalServerError(res, error.message);
        }
        else {
            apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
};
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        apiResponse.success(res, "Logged out successfully");
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in logout controller", error.message);
            apiResponse.internalServerError(res, error.message);
        }
        else {
            apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
};
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user?._id;
        if (!profilePic) {
            apiResponse.badRequest(res, "Profile picture is required");
            return;
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        apiResponse.success(res, updatedUser);
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in updateProfile controller", error.message);
            apiResponse.internalServerError(res);
        }
        else {
            apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
};
export const checkAuth = async (req, res) => {
    try {
        apiResponse.success(res, req.user);
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in checkAuth controller", error.message);
            apiResponse.internalServerError(res, error.message);
        }
        else {
            apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
};
