import { Router } from 'express';
import * as inboundCallController from '../controllers/inboundCallController.js';

const router = Router();

router.post('/', inboundCallController.createInboundCall);

router.use('*', (req, res) => {
  res.status(405).json({
    message: 'Method not allowed',
    allowedMethods: ['POST'],
  });
});

export default router;
