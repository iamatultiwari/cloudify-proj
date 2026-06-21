import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  getAllVillages,
  getFarmersByVillage,
  searchVillage,
  villageSummaryReport,
} from "../controllers/village.controller.js";

const router = express.Router();



// all villages

router.get("/", authMiddleware, getAllVillages);



// search village

router.get("/search", authMiddleware, searchVillage);



// summary report

router.get("/report/summary", authMiddleware, villageSummaryReport);



// farmers by village

router.get("/:villageName/farmers", authMiddleware, getFarmersByVillage);

export default router;