import express, { Router } from 'express';

import { pingCheck } from '../../controllers/pingController';

import submissionRouter from './submissionRoutes';

const v1Router:Router = express.Router();

v1Router.get('/', pingCheck);

v1Router.use('/submissions', submissionRouter);

export default v1Router;
