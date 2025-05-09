import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import User from "../models/user.model.js"
import { apiResponse } from "../utils/apiResponse.util.js"
import { UserRequest } from "../types/custom.js"

export const protectRoute = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            apiResponse.unauthorized(res, "Unauthorized - No Token Provided")
            return
        }

        const secret = process.env.JWT_SECRET
        if (!secret) {
            throw new Error("JWT_SECRET not defined")
        }

        let decoded: string | JwtPayload
        try {
            decoded = jwt.verify(token, secret)
        } catch (error) {
            apiResponse.unauthorized(res, "Unauthorized - Invalid Token")
            return
        }

        const user = await User.findById((decoded as JwtPayload).userId).select("-password")
        if (!user) {
            apiResponse.badRequest(res, "User Not Found")
            return
        }
        req.user = user
        next()
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in login controller", error.message);
            apiResponse.internalServerError(res, error.message);
        } else {
            apiResponse.internalServerError(res, 'Unexpected error occurred');
        }
    }
}