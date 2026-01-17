import { Router } from "express";
import { verifyBusinessAuth } from "../middlewares/auth.middlewares.ts";
import { getAllCategories } from "../controllers/category.controllers.ts";

const router = Router();
router.use(verifyBusinessAuth);


router.get("/", getAllCategories)



export default router;
