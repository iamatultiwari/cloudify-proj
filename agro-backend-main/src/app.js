// import express from "express";

// import {
//   addFarmer,
//   getAllFarmers,
//   getSingleFarmer,
//   updateFarmer,
//   deleteFarmer,
//   searchFarmer,
// } from "../controllers/farmer.controller.js";
// //import { sendEmailNotification } from '../controllers/notification.controller.js';

// import authMiddleware from "../middleware/auth.middleware.js";

// const router = express.Router();



// // add farmer

// router.post("/", authMiddleware, addFarmer);

// //router.post('/send-email', sendEmailNotification);


// // get all farmers

// router.get("/", authMiddleware, getAllFarmers);


// // search farmer

// router.get("/search", authMiddleware, searchFarmer);


// // single farmer

// router.get("/:id", authMiddleware, getSingleFarmer);


// // update farmer

// router.put("/:id", authMiddleware, updateFarmer);


// // delete farmer

// router.delete("/:id", authMiddleware, deleteFar
// mer);

// export default router;

import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import farmerRoutes from "./routes/farmer.routes.js";
import villageRoutes from "./routes/village.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import productRoutes from "./routes/product.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Backend is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/villages", villageRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/reports", reportRoutes);

export default app;