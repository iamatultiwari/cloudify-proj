import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
    },

    purchasePrice: {
      type: Number,
      required: true,
    },

    creditRate: {
      type: Number,
      required: true,
    },

    cashRate: {
      type: Number,
      required: true,
    },

    wholesaleRate: {
      type: Number,
      required: true,
    },

    gstRate: {
      type: Number,
      default: 0,
    },

    expiryDate: {
      type: Date,
    },

    lowStockThreshold: {
      type: Number,
      default: 10,
    },

    status: {
      type: String,
      enum: ["available", "out_of_stock"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;