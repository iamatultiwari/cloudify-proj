import Transaction from "../models/Transaction.js";
import Farmer from "../models/Farmer.js";
import Product from "../models/Product.js";

// ================= CREDIT ENTRY =================
export const createCreditTransaction = async (req, res) => {
  try {
    const { farmerId, amount, description, dueDate, products } = req.body;

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer profile not found." });
    }

    // Credit limit warning assertion
    if (farmer.dueAmount + amount > farmer.creditLimit) {
      return res.status(400).json({ success: false, message: "Transaction blocked: Credit Limit Exceeded" });
    }

    // Atomic inventory verification & deduction loop
    if (products && products.length > 0) {
      for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ success: false, message: "Product context missing inside inventory database." });
        }

        if (product.quantity < item.quantity) {
          return res.status(400).json({ success: false, message: `${product.productName} contains insufficient stock volumes.` });
        }

        product.quantity -= item.quantity;
        await product.save();
      }
    }

    const transaction = await Transaction.create({
      farmer: farmerId,
      type: "credit",
      amount,
      description,
      dueDate,
      products,
    });

    farmer.dueAmount += amount;
    await farmer.save();

    res.status(201).json({
      success: true,
      message: "Credit Transaction recorded and posted successfully.",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= PAYMENT ENTRY =================
export const createPaymentTransaction = async (req, res) => {
  try {
    const { farmerId, amount, paymentMode, description } = req.body;

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer record not found." });
    }

    if (amount > farmer.dueAmount) {
      return res.status(400).json({ success: false, message: "Payment amount cannot exceed outstanding balance due." });
    }

    const transaction = await Transaction.create({
      farmer: farmerId,
      type: "payment",
      amount,
      paymentMode,
      description,
    });

    farmer.dueAmount -= amount;
    await farmer.save();

    res.status(201).json({
      success: true,
      message: "Payment posted successfully; farmer ledger balance adjusted.",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= INTEREST ENTRY =================
export const createInterestTransaction = async (req, res) => {
  try {
    const { farmerId, amount, description } = req.body;

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer record not found." });
    }

    const transaction = await Transaction.create({
      farmer: farmerId,
      type: "interest",
      amount,
      description,
    });

    farmer.dueAmount += amount;
    await farmer.save();

    res.status(201).json({
      success: true,
      message: "Accrued interest added successfully to the ledger accounts.",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= TRANSACTION HISTORY =================
export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("farmer")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalTransactions: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= FARMER LEDGER =================
export const getFarmerLedger = async (req, res) => {
  try {
    const farmerId = req.params.id;

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Target farmer identifier not found." });
    }

    const ledger = await Transaction.find({ farmer: farmerId })
      .sort({ createdAt: -1 })
      .populate("products.product");

    res.status(200).json({
      success: true,
      farmer,
      dueAmount: farmer.dueAmount,
      ledger,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= SEARCH & FILTER =================
export const searchTransactions = async (req, res) => {
  try {
    const { type, paymentMode } = req.query;
    let filter = {};

    if (type) filter.type = type;
    if (paymentMode) filter.paymentMode = paymentMode;

    const transactions = await Transaction.find(filter)
      .populate("farmer")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalResults: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getInterestHistory = async (req, res) => {
  try {
    const interestRecords = await Transaction.find({ type: "interest" })
      .populate("farmer")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, transactions: interestRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};