import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
export const pingCheck = (_: Request, res: Response) => {
  res.status(HttpStatus.OK).json({
    message: 'Ping check ok',
  });
};
