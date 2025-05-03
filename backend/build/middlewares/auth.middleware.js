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
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const apiResponse_util_1 = require("../utils/apiResponse.util");
const protectRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            apiResponse_util_1.apiResponse.unauthorized(res, "Unauthorized - No Token Provided");
            return;
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET not defined");
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, secret);
        }
        catch (error) {
            apiResponse_util_1.apiResponse.unauthorized(res, "Unauthorized - Invalid Token");
            return;
        }
        const user = yield user_model_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            apiResponse_util_1.apiResponse.badRequest(res, "User Not Found");
            return;
        }
        req.user = user;
        next();
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
exports.protectRoute = protectRoute;
