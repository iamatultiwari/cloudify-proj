import Invoice from "../models/Invoice.js";
import Farmer from "../models/Farmer.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
import generateInvoiceNumber from "../utils/generateInvoiceNumber.js";

// ================= CREATE INVOICE =================
export const createInvoice = async (req, res) => {
  // Initialize standard MongoDB session storage for transactional safety guarantees
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { farmerId, billingType, products, dueDate } = req.body;

    // 1. Structural request validation guards
    if (!farmerId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Please provide a valid Farmer ID." });
    }

    if (!billingType || !["cash", "credit", "wholesale", "wholesale_credit"].includes(billingType)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Invalid or missing billing matrix type selection." });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Invoice must contain at least one product line item." });
    }

    // 2. Locate and verify target Farmer record
    const farmer = await Farmer.findById(farmerId).session(session);
    if (!farmer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Farmer profile records not found in system database." });
    }

    let subTotal = 0;
    let totalGST = 0;
    const invoiceProducts = [];

    // 3. Process every individual product line item systematically
    for (const item of products) {
      if (!item.product || !item.quantity || item.quantity <= 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, message: "Each row item must specify a valid product and positive quantity value." });
      }

      const product = await Product.findById(item.product).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ success: false, message: `Product reference ID ${item.product} could not be successfully loaded.` });
      }

      // Safeguard check against live inventory levels
      if (product.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient inventory stock. Product: ${product.productName} | Requested: ${item.quantity} | Available: ${product.quantity}` 
        });
      }

      // Secure backend 4-Tier rate assessment calculation matrix
      let selectedRate = 0;
      if (billingType === "cash") {
        selectedRate = product.cashRate || 0;
      } else if (billingType === "credit") {
        selectedRate = product.creditRate || 0;
      } else if (billingType === "wholesale") {
        selectedRate = product.wholesaleRate || 0;
      } else if (billingType === "wholesale_credit") {
        selectedRate = product.creditWholesaleRate || 0;
      }

      // Calculate precision floating-point line totals 
      const itemTotal = selectedRate * Number(item.quantity);
      const gstAmount = (itemTotal * (product.gstRate || 0)) / 100;
      const finalAmount = itemTotal + gstAmount;

      subTotal += itemTotal;
      totalGST += gstAmount;

      // Deduct inventory physical count tracking safely inside isolated session state boundary
      product.quantity -= Number(item.quantity);
      await product.save({ session });

      invoiceProducts.push({
        product: product._id,
        quantity: Number(item.quantity),
        selectedRate: Number(selectedRate),
        gstRate: Number(product.gstRate || 0),
        totalAmount: Number(parseFloat(finalAmount.toFixed(2)))
      });
    }

    // Explicit rounding handlers for total variables to fix decimal point drift
    const finalSubTotal = Number(parseFloat(subTotal.toFixed(2)));
    const finalTotalGST = Number(parseFloat(totalGST.toFixed(2)));
    const grandTotal = Number(parseFloat((finalSubTotal + finalTotalGST).toFixed(2)));

    // Generate human-readable serial transaction code matching format guidelines
    const invoiceNumber = await generateInvoiceNumber();

    // Assign status flags dynamically by analyzing incoming matrix strings
    let paymentStatus = "paid";
    if (billingType === "credit" || billingType === "wholesale_credit") {
      paymentStatus = "pending";
    }

    // 4. Instantiate base invoice collection documentation records inside session bounds
    const [invoice] = await Invoice.create(
      [
        {
          invoiceNumber,
          farmer: farmerId,
          billingType,
          products: invoiceProducts,
          subTotal: finalSubTotal,
          totalGST: finalTotalGST,
          grandTotal: grandTotal,
          paymentStatus: paymentStatus
        }
      ],
      { session }
    );

    // 5. Run ledger adjustments if invoice targets deferred payments paths
    if (paymentStatus === "pending") {
      farmer.dueAmount = Number(parseFloat(((farmer.dueAmount || 0) + grandTotal).toFixed(2)));
      await farmer.save({ session });

      // Determine clean fallback dates if frontend doesn't provide one
      const calculatedDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await Transaction.create(
        [
          {
            farmer: farmer._id,
            type: "credit",
            amount: grandTotal,
            description: `Generated Invoice ${invoiceNumber}`,
            dueDate: calculatedDueDate
          }
        ],
        { session }
      );
    }

    // Save changes globally across collections simultaneously
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Invoice Created Successfully",
      invoice
    });

  } catch (error) {
    // If any step fails, roll back all changes completely to prevent data corruption
    await session.abortTransaction();
    session.endSession();
    
    console.error("CRITICAL INVOICE CREATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server encountered a fatal error during invoice creation execution context.",
      error: error.message
    });
  }
};

// ================= GET ALL INVOICES =================
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("farmer", "name mobileNumber village address dueAmount")
      .populate("products.product", "productName cashRate creditRate wholesaleRate creditWholesaleRate gstRate")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalInvoices: invoices.length,
      invoices
    });
  } catch (error) {
    console.error("GET ALL INVOICES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve invoice registry database catalog records.",
      error: error.message
    });
  }
};

// ================= SINGLE INVOICE =================
export const getSingleInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Provided Invoice Lookup Object ID is structural invalid." });
    }

    const invoice = await Invoice.findById(id)
      .populate("farmer", "name mobileNumber village address dueAmount")
      .populate("products.product", "productName gstRate");

    if (!invoice) {
      return res.status(404).json({ success: false, message: `No registered invoice located matching ID: ${id}` });
    }

    return res.status(200).json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error("GET SINGLE INVOICE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to assemble individual target invoice specification.",
      error: error.message
    });
  }
};

// ================= PRINT INVOICE =================
export const printInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Provided printable parameters route key argument is structural invalid." });
    }

    const invoice = await Invoice.findById(id)
      .populate("farmer", "name mobileNumber village address")
      .populate("products.product", "productName");

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Requested physical copy formatting profile not found." });
    }

    return res.status(200).json({
      success: true,
      printableInvoice: invoice
    });
  } catch (error) {
    console.error("PRINT INVOICE API ROUTE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "System printable view controller context calculation error.",
      error: error.message
    });
  }
};