import {Request, Response} from 'express';

export abstract class BaseController {
  public abstract read(req: Request, res: Response): void;
}