import express from "express";

import authMiddleware
from "../middleware/auth.middleware.js";

import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";

const router = express.Router();



// get settings

router.get(
  "/",
  authMiddleware,
  getSettings
);



// update settings

router.put(
  "/",
  authMiddleware,
  updateSettings
);

export default router;