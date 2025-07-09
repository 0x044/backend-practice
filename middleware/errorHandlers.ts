import type { Request, Response, NextFunction } from 'express';

// Custom error class
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (err instanceof ApiError) {
    // Known operational errors
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    return;
  }

  // MySQL/Database errors
  if (err.message.includes('ER_DUP_ENTRY')) {
    res.status(409).json({
      success: false,
      message: 'Duplicate entry - resource already exists'
    });
    return;
  }

  if (err.message.includes('ER_NO_SUCH_TABLE')) {
    res.status(500).json({
      success: false,
      message: 'Database table not found'
    });
    return;
  }

  // JSON parsing errors
  if (err.message.includes('Unexpected token') || err.message.includes('JSON')) {
    res.status(400).json({
      success: false,
      message: 'Invalid JSON format'
    });
    return;
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
};

// 404 handler for unknown routes
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};