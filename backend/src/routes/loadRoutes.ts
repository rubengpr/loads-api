import { Router } from 'express';
import * as loadController from '../controllers/loadController.js';

const router = Router();

router.get('/', loadController.getLoads);

router.use('*', (req, res) => {
  res.status(405).json({
    message: 'Method not allowed',
    allowedMethods: ['GET'],
  });
});

export default router;
