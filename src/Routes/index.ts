import {Router} from 'express';
import offersRouter from './Offer';

const routes = Router();

routes.use('/offer', offersRouter);

export default routes;