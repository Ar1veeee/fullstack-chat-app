import { Request, response, Response } from "express";
import { apiResponse } from "../utils/apiResponse.util.js";

export const testApi = async (req: Request, res: Response): Promise<void> => {
    try {
        const startTime = Date.now();

        apiResponse.success(res, {
            message: "API is working",
            timestamp: new Date().toLocaleDateString("id-ID", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            }),
            responseTime: `${Date.now() - startTime}ms`,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in signin controller", error.message);
        } else {
            apiResponse.internalServerError(res, 'Unexpected error occurred');
        }

    }
}