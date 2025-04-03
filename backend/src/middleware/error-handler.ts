import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('An error occurred in the application');
  return res.status(500).json({ message: 'Something went wrong!' });
};