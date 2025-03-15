import express, { Router } from 'express';

import { addSubmission } from '../../controllers/submissionController';
import { createSubmissionZodSchema } from '@repo/backend-common/types';
import { validateMiddleware } from '../../middleware/validateMiddleware';


const submissionRouter:Router = express.Router();

submissionRouter.post('/', validateMiddleware(createSubmissionZodSchema), addSubmission);

export default submissionRouter;
