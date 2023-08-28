import express from "express";
const router = express.Router();
import { register, login, logout, getProfile, forgotPassword, resetPassword, changePassword, updateProfile } from "../controllers/user.controller.js"
import isLoggedIn from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js";

router.post("/register", upload.single('avatar'), register);
router.post("/login", login);
router.get("/logout", isLoggedIn, logout);
router.get("/me", isLoggedIn, getProfile);
// reset password routes
router.post("/reset", forgotPassword);
router.post("/reset/:restToken", resetPassword)
// change password
router.post('change-password', isLoggedIn, changePassword)
// update profile
router.put('/update', isLoggedIn, upload.single('avatar'), updateProfile)

export default router;
