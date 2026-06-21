import Invoice from "../models/Invoice.js";
import Farmer from "../models/Farmer.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";

import generateInvoiceNumber from "../utils/generateInvoiceNumber.js";



// ================= CREATE INVOICE =================

export const createInvoice = async (req, res) => {
  try {

    const {
      farmerId,
      billingType,
      products,
    } = req.body;

    // farmer check

    const farmer = await Farmer.findById(
      farmerId
    );

    if (!farmer) {
      return res.status(404).json({
        message: "Farmer not found",
      });
    }

    let subTotal = 0;
    let totalGST = 0;

    const invoiceProducts = [];



    // process products

    for (const item of products) {

      const product = await Product.findById(
        item.product
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      // stock check

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `${product.productName} out of stock`,
        });
      }

      // auto rate selection

      let selectedRate = 0;

      if (billingType === "credit") {
        selectedRate = product.creditRate;
      }

      else if (billingType === "cash") {
        selectedRate = product.cashRate;
      }

      else if (billingType === "wholesale") {
        selectedRate = product.wholesaleRate;
      }

      // calculations

      const itemTotal =
        selectedRate * item.quantity;

      const gstAmount =
        (itemTotal * product.gstRate) / 100;

      const finalAmount =
        itemTotal + gstAmount;

      subTotal += itemTotal;

      totalGST += gstAmount;

      // inventory deduction

      product.quantity -= item.quantity;

      await product.save();

      invoiceProducts.push({
        product: product._id,

        quantity: item.quantity,

        selectedRate,

        gstRate: product.gstRate,

        totalAmount: finalAmount,
      });
    }

    // grand total

    const grandTotal =
      subTotal + totalGST;

    // invoice number

    const invoiceNumber =
      generateInvoiceNumber();

    // payment status

    let paymentStatus = "paid";

    if (billingType === "credit") {
      paymentStatus = "pending";
    }

    // create invoice

    const invoice = await Invoice.create({
      invoiceNumber,

      farmer: farmerId,

      billingType,

      products: invoiceProducts,

      subTotal,

      totalGST,

      grandTotal,

      paymentStatus,
    });



    // CREDIT BILLING → create transaction

    if (billingType === "credit") {

      // update farmer due

      farmer.dueAmount += grandTotal;

      await farmer.save();

      // create transaction

      await Transaction.create({
        farmer: farmer._id,

        type: "credit",

        amount: grandTotal,

        description: `Invoice ${invoiceNumber}`,

        dueDate: req.body.dueDate,
      });
    }



    res.status(201).json({
      success: true,
      message: "Invoice Created Successfully",
      invoice,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// ================= GET ALL INVOICES =================

export const getAllInvoices = async (req, res) => {
  try {

    const invoices = await Invoice.find()
      .populate("farmer")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalInvoices: invoices.length,
      invoices,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// ================= SINGLE INVOICE =================

export const getSingleInvoice = async (req, res) => {
  try {

    const invoice = await Invoice.findById(
      req.params.id
    )
      .populate("farmer")
      .populate("products.product");

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      invoice,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// ================= PRINT INVOICE =================

export const printInvoice = async (req, res) => {
  try {

    const invoice = await Invoice.findById(
      req.params.id
    )
      .populate("farmer")
      .populate("products.product");

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    // printable response

    res.status(200).json({
      success: true,

      printableInvoice: invoice,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};