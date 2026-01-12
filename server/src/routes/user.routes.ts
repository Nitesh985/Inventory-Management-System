import { Router } from "express";
import { verifyUserAuth } from "../middlewares/auth.middlewares.ts";
import { checkVerificationCode, sendVerificationCode } from "../controllers/user.controllers.ts";

const router = Router();


// router.route("/register")
// .post(registerUser)

// Protected routes - require authentication
// router.route("/profile")
// .get(verifyUserAuth, getUserProfile)
// .patch(verifyUserAuth, updateUserProfile)

router.use(verifyUserAuth)

router
  .post("/send-verification-code", sendVerificationCode)

router.
  post("/verify-code", checkVerificationCode)


export default router;
