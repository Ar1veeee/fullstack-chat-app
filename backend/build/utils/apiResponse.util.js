"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiResponse = void 0;
exports.apiResponse = {
    // Respons sukses umum
    success: (res, data, message = 'Success', statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    },
    // Respons error umum
    error: (res, message = 'An error occurred', statusCode = 400, errorDetails) => {
        return res.status(statusCode).json({
            success: false,
            message,
            error: errorDetails
        });
    },
    // Respons untuk data tidak ditemukan
    notFound: (res, message = 'Resource not found') => {
        return res.status(404).json({
            success: false,
            message
        });
    },
    // Respons untuk validasi gagal
    badRequest: (res, message = 'Bad Request', errors) => {
        return res.status(400).json({
            success: false,
            message,
            errors
        });
    },
    internalServerError: (res, message = 'Internal server error', errorDetails) => {
        return res.status(500).json({
            success: false,
            message,
            error: errorDetails
        });
    },
    // Respons untuk autentikasi gagal
    unauthorized: (res, message = 'Unauthorized') => {
        return res.status(401).json({
            success: false,
            message
        });
    },
    // Respons untuk forbidden
    forbidden: (res, message = 'Forbidden') => {
        return res.status(403).json({
            success: false,
            message
        });
    },
    // Respons untuk respons yang dibuat (created)
    created: (res, data, message = 'Resource created successfully') => {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    },
    // Respons untuk operasi parsial
    partialContent: (res, data, message = 'Partial content') => {
        return res.status(206).json({
            success: true,
            message,
            data
        });
    }
};
