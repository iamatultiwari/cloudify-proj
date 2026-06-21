import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  salesReport,
  farmerDueReport,
  stockReport,
  villageReport,
  chartAnalytics,
  dashboardSummary,
} from "../controllers/report.controller.js";

const router = express.Router();



// sales report

router.get(
  "/sales",
  authMiddleware,
  salesReport
);



// farmer due report

router.get(
  "/farmer-due",
  authMiddleware,
  farmerDueReport
);



// stock report

router.get(
  "/stock",
  authMiddleware,
  stockReport
);



// village report

router.get(
  "/village",
  authMiddleware,
  villageReport
);



// chart analytics

router.get(
  "/charts",
  authMiddleware,
  chartAnalytics
);



// dashboard summary

router.get(
  "/dashboard",
  authMiddleware,
  dashboardSummary
);

export default router;