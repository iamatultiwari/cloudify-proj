import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createCreditTransaction,
  createPaymentTransaction,
  createInterestTransaction,
  getTransactionHistory,
  getFarmerLedger,
  searchTransactions,
} from "../controllers/transaction.controller.js";

const router = express.Router();



// credit transaction

router.post(
  "/credit",
  authMiddleware,
  createCreditTransaction
);



// payment transaction

router.post(
  "/payment",
  authMiddleware,
  createPaymentTransaction
);



// interest transaction

router.post(
  "/interest",
  authMiddleware,
  createInterestTransaction
);



// history

router.get(
  "/history",
  authMiddleware,
  getTransactionHistory
);



// search & filter

router.get(
  "/search",
  authMiddleware,
  searchTransactions
);



// farmer ledger

router.get(
  "/ledger/:id",
  authMiddleware,
  getFarmerLedger
);

export default router;