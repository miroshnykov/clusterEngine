import express, {Application, Request, Response} from 'express';

const app: Application = express();
import {Router} from 'express';

const offersRouter = Router();
import {offerController} from '../Controllers';

import fs from "fs";

offersRouter.get('/', async (req: Request, res: Response) => {
  await offerController.read(req, res)
  // return res.json("OK");
});

export default offersRouter;

