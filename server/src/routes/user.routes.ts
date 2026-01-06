import { Router } from "express";
import { registerUser, getUserProfile, updateUserProfile } from "../controllers/user.controllers.ts";
import { verifyUserAuth } from "../middlewares/auth.middlewares.ts";

const router = Router();


router.route("/register")
.post(registerUser)

// Protected routes - require authentication
router.route("/profile")
.get(verifyUserAuth, getUserProfile)
.patch(verifyUserAuth, updateUserProfile)


export default router;
