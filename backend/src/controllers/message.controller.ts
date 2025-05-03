import { Request, Response } from "express"
import { UserRequest } from "../types/custom"
import { apiResponse } from "../utils/apiResponse.util"
import User from "../models/user.model"
import Message from "../models/message.model"
import cloudinary from "../lib/cloudinary"
import { getReceiverSocketId, io } from "../lib/socket"

export const getUserForSideBar = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const loggedInUserId = req.user?._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        apiResponse.success(res, filteredUsers)
        return
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in getUserForSideBar controller", error.message);
            apiResponse.internalServerError(res, error.message);
        } else {
            apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
}

export const getMessages = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user?._id;

        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })
        apiResponse.success(res, messages)
        return
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in updateProfile controller", error.message);
            apiResponse.internalServerError(res, error.message);
        } else {
            apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
}

export const sendMessage = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} =req.params;
        const senderId = req.user?._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })
        await newMessage.save()
        
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        
        res.status(201).json(newMessage)
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in updateProfile controller", error.message);
            apiResponse.internalServerError(res, error.message);
        } else {
            apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
}
