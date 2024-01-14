import {NextFunction, Request, Response} from 'express';

export * from './users.controller';

export interface IControllerArgs {
  request: Request;
  response: Response;
  next: NextFunction;
}
