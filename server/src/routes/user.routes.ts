import { Router } from "express";
import { verifyTable, verifyAuth } from "../middlewares/auth.middlewares.js";
import { registerUser, refreshAccessToken } from "../controllers/user.controller.js";
const router = Router();

router.route("/sign-up").post(verifyTable, registerUser)
router.route("/refresh-access-token").post(verifyAuth, refreshAccessToken)


export default router;