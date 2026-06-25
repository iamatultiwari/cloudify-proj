import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: [true, "Farmer reference is strictly required"],
      index: true
    },
    billingType: {
      type: String,
      enum: ["cash", "credit", "wholesale", "wholesale_credit"],
      required: [true, "Billing type matrix classification is required"],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product reference is required"]
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity cannot be less than 1"]
        },
        selectedRate: {
          type: Number,
          required: [true, "Selected applied rate is required"],
          min: [0, "Rate cannot be negative"]
        },
        gstRate: {
          type: Number,
          required: true,
          default: 0,
          min: [0, "GST rate cannot be negative"]
        },
        totalAmount: {
          type: Number,
          required: [true, "Line item total amount is required"],
          min: [0, "Line total cannot be negative"]
        }
      }
    ],
    subTotal: {
      type: Number,
      required: [true, "Subtotal calculation is required"],
      default: 0,
      min: [0, "Subtotal cannot be negative"]
    },
    totalGST: {
      type: Number,
      required: [true, "Total accumulated GST is required"],
      default: 0,
      min: [0, "Total GST cannot be negative"]
    },
    grandTotal: {
      type: Number,
      required: [true, "Grand total final amount is required"],
      default: 0,
      min: [0, "Grand total cannot be negative"]
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending",
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound indexing for optimized lookup speeds inside analytics/registry logs
invoiceSchema.index({ createdAt: -1, paymentStatus: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;