import { Response } from 'express';

// Tipe untuk struktur respons
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export const apiResponse = {
  // Respons sukses umum
  success: <T>(
    res: Response, 
    data?: T, 
    message: string = 'Success', 
    statusCode: number = 200
  ): Response<ApiResponse<T>> => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },

  // Respons error umum
  error: (
    res: Response, 
    message: string = 'An error occurred', 
    statusCode: number = 400,
    errorDetails?: any
  ): Response => {
    return res.status(statusCode).json({
      success: false,
      message,
      error: errorDetails
    });
  },

  // Respons untuk data tidak ditemukan
  notFound: (
    res: Response, 
    message: string = 'Resource not found'
  ): Response => {
    return res.status(404).json({
      success: false,
      message
    });
  },

  // Respons untuk validasi gagal
  badRequest: (
    res: Response,
    message: string = 'Bad Request',
    errors?: any[]
  ): Response => {
    return res.status(400).json({
      success: false,
      message,
      errors
    });
  },

  internalServerError: (
    res: Response, 
    message: string = 'Internal server error', 
    errorDetails?: any
  ): Response => {
    return res.status(500).json({
      success: false,
      message,
      error: errorDetails
    });
  },

  // Respons untuk autentikasi gagal
  unauthorized: (
    res: Response, 
    message: string = 'Unauthorized'
  ): Response => {
    return res.status(401).json({
      success: false,
      message
    });
  },

  // Respons untuk forbidden
  forbidden: (
    res: Response, 
    message: string = 'Forbidden'
  ): Response => {
    return res.status(403).json({
      success: false,
      message
    });
  },

  // Respons untuk respons yang dibuat (created)
  created: <T>(
    res: Response, 
    data: T, 
    message: string = 'Resource created successfully'
  ): Response<ApiResponse<T>> => {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  },

  // Respons untuk operasi parsial
  partialContent: <T>(
    res: Response, 
    data: T, 
    message: string = 'Partial content'
  ): Response<ApiResponse<T>> => {
    return res.status(206).json({
      success: true,
      message,
      data
    });
  }
};