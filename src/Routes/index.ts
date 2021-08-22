import {Router} from 'express';
import offersRouter from './offersRoute';

const routes = Router();

routes.use('/offer', offersRouter);

export default routes;