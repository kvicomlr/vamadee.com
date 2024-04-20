import express from "express";

import {
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot_password", forgotPassword);
router.patch("/reset_password/:token", resetPassword);

export default router;
