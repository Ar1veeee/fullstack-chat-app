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
exports.sendMessage = exports.getMessages = exports.getUserForSideBar = void 0;
const apiResponse_util_1 = require("../utils/apiResponse.util");
const user_model_1 = __importDefault(require("../models/user.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const socket_1 = require("../lib/socket");
const getUserForSideBar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const filteredUsers = yield user_model_1.default.find({ _id: { $ne: loggedInUserId } }).select("-password");
        apiResponse_util_1.apiResponse.success(res, filteredUsers);
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getUserForSideBar controller", error.message);
            apiResponse_util_1.apiResponse.internalServerError(res, error.message);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
});
exports.getUserForSideBar = getUserForSideBar;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id: userToChatId } = req.params;
        const myId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const messages = yield message_model_1.default.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });
        apiResponse_util_1.apiResponse.success(res, messages);
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in updateProfile controller", error.message);
            apiResponse_util_1.apiResponse.internalServerError(res, error.message);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
});
exports.getMessages = getMessages;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        let imageUrl;
        if (image) {
            const uploadResponse = yield cloudinary_1.default.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new message_model_1.default({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        yield newMessage.save();
        const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in updateProfile controller", error.message);
            apiResponse_util_1.apiResponse.internalServerError(res, error.message);
        }
        else {
            apiResponse_util_1.apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
});
exports.sendMessage = sendMessage;
