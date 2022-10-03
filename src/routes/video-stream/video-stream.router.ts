import { Router } from 'express';
import { videoStreamController } from '../../controllers';

const router = Router();

router.get(
  '/',
  // TODO middlewares
  videoStreamController.sendVideo
);

export const videoStreamRouter = router;
