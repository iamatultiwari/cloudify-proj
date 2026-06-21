import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  lowStockProducts,
  expiredProducts,
} from "../controllers/product.controller.js";

const router = express.Router();



// add product

router.post("/", authMiddleware, addProduct);



// get all products

router.get("/", authMiddleware, getAllProducts);



// search products

router.get("/search", authMiddleware, searchProducts);



// low stock

router.get("/low-stock", authMiddleware, lowStockProducts);



// expired products

router.get("/expired", authMiddleware, expiredProducts);



// single product

router.get("/:id", authMiddleware, getSingleProduct);



// update product

router.put("/:id", authMiddleware, updateProduct);



// delete product

router.delete("/:id", authMiddleware, deleteProduct);

export default router;