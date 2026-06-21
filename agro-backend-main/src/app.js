import express from "express";
import cors from "cors";

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

app.use("/api/auth", authRoutes);

app.use("/api/farmers", farmerRoutes);

app.use("/api/villages", villageRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/products", productRoutes);

app.use("/api/settings", settingsRoutes);

app.use("/api/invoices", invoiceRoutes);

app.use("/api/reports", reportRoutes);

export default app; 