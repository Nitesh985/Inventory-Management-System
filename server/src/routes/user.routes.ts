import { Router } from "express";
import { mockupData } from "../middlewares/mockup.middlewares.ts";

const router = Router();
router.use(mockupData); // POST /api/users/register

export default router;
