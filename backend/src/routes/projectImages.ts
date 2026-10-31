import { Router } from 'express';
import * as projectImageController from '../controllers/projectImageController.js';

const router = Router();

router.get('/project/:projectId/images', projectImageController.getProjectImages);
router.post('/project/:projectId/images', projectImageController.createProjectImage);
router.delete('/project-images/:id', projectImageController.deleteProjectImage);
router.put('/project-images/:id/order', projectImageController.updateProjectImageOrder);

export default router;

