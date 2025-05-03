"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = exports.updateProfile = exports.logout = exports.login = exports.signup = void 0;
const apiResponse_util_1 = require("../utils/apiResponse.util");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_util_1 = require("../utils/generateToken.util");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullName, password } = req.body;
    try {
        if (!email || !fullName || !password) {
            apiResponse_util_1.apiResponse.badRequest(res, "All fields are required");
            return;
        }
        if (password.length < 8) {
            apiResponse_util_1.apiResponse.badRequest(res, "Password must be at least 8 characters");
            return;
        }
        const user = yield user_model_1.default.findOne({ email });
        if (user) {
            apiResponse_util_1.apiResponse.badRequest(res, "Email already exists");
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new user_model_1.default({
            email: email,
            fullName: fullName,
            password: hashedPassword,
        });
        if (newUser) {
            (0, generateToken_util_1.generateToken)(newUser._id, res);
            yield newUser.save();
            apiResponse_util_1.apiResponse.created(res, {
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            });
            return;
        }
        else {
            apiResponse_util_1.apiResponse.badRequest(res, "Invalid user data");
            return;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in signin controller", error.message);
            apiResponse_util_1.apiResponse.internalServerError(res, error.message);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            apiResponse_util_1.apiResponse.badRequest(res, "Invalid credentials");
            return;
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            apiResponse_util_1.apiResponse.badRequest(res, "Invalid credentials");
            return;
        }
        (0, generateToken_util_1.generateToken)(user._id, res);
        apiResponse_util_1.apiResponse.success(res, {
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
            apiResponse_util_1.apiResponse.internalServerError(res, error.message);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        apiResponse_util_1.apiResponse.success(res, "Logged out successfully");
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in logout controller", error.message);
            apiResponse_util_1.apiResponse.internalServerError(res, error.message);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
});
exports.logout = logout;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { profilePic } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!profilePic) {
            apiResponse_util_1.apiResponse.badRequest(res, "Profile picture is required");
            return;
        }
        const uploadResponse = yield cloudinary_1.default.uploader.upload(profilePic);
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        apiResponse_util_1.apiResponse.success(res, updatedUser);
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in updateProfile controller", error.message);
            apiResponse_util_1.apiResponse.internalServerError(res);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
});
exports.updateProfile = updateProfile;
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        apiResponse_util_1.apiResponse.success(res, req.user);
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in checkAuth controller", error.message);
            apiResponse_util_1.apiResponse.internalServerError(res, error.message);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
});
exports.checkAuth = checkAuth;
