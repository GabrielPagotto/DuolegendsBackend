import { Router } from "express";

import  UserController from "../controllers/user.controller";

const router = Router();

router.get('/', UserController.index);
router.post('/', UserController.store);
router.get('/:id', UserController.get);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router;
