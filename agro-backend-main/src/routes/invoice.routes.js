import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import { resendInvoice } from '../controllers/invoice.controller.js'; 
import {
  createInvoice,
  getAllInvoices,
  getSingleInvoice,
  printInvoice,
} from "../controllers/invoice.controller.js";

const router = express.Router();



// create invoice

router.post(
  "/",
  authMiddleware,
  createInvoice
);



// all invoices

router.get(
  "/",
  authMiddleware,
  getAllInvoices
);



// single invoice

router.get(
  "/:id",
  authMiddleware,
  getSingleInvoice
);



// print invoice

router.get(
  "/print/:id",
  authMiddleware,
  printInvoice
);

router.post('/resend/:id', resendInvoice);

export default router;