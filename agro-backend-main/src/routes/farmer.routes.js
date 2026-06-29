import express from "express";

import {
  addFarmer,
  getAllFarmers,
  getSingleFarmer,
  updateFarmer,
  deleteFarmer,
  searchFarmer,
} from "../controllers/farmer.controller.js";
//import { sendEmailNotification } from '../controllers/notification.controller.js';

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();



// add farmer

router.post("/", authMiddleware, addFarmer);

//router.post('/send-email', sendEmailNotification);


// get all farmers

router.get("/", authMiddleware, getAllFarmers);


// search farmer

router.get("/search", authMiddleware, searchFarmer);


// single farmer

router.get("/:id", authMiddleware, getSingleFarmer);


// update farmer

router.put("/:id", authMiddleware, updateFarmer);


// delete farmer

router.delete("/:id", authMiddleware, deleteFarmer);

export default router;