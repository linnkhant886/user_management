import { Router } from 'express';
import { createRole, getAllRoles } from '../controllers/role-controller'
const router = Router();

router.post('/', createRole);
router.get('/', getAllRoles);

export default router;
