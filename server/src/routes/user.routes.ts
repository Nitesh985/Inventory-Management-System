import { Router } from "express";
import { mockupData } from "../middlewares/mockup.middlewares.ts";
import { registerUser } from "../controllers/user.controllers.ts";

const router = Router();


router.route("/register")
.post(registerUser)

export default router;
