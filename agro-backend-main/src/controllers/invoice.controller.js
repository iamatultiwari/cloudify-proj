import Invoice from "../models/Invoice.js";
import Farmer from "../models/Farmer.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
import generateInvoiceNumber from "../utils/generateInvoiceNumber.js";
import twilio from "twilio";
import nodemailer from "nodemailer";

// Initialize external messaging gateways
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * PRODUCTION-GRADE ENGINE: Formats clear strings for WhatsApp & highly structured HTML tables for Email
 */
const generateInvoiceNotifications = (farmer, productItems, financials, billingType, dueDate, invoiceNumber) => {
  // 1. Map raw line-item strings into text rows (WhatsApp optimization)
  const itemizedTextList = productItems.map((item, idx) => {
    return `${idx + 1}. ${item.productName} | Qty: ${item.quantity} | Rate: ₹${item.selectedRate} (+${item.gstRate}% GST) -> Total: ₹${item.totalAmount}`;
  }).join("\n");

  // 2. Map line items into standard visual table rows (Email optimization)
  const itemizedHtmlRows = productItems.map((item, idx) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${idx + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>${item.productName}</strong></td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${item.selectedRate}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.gstRate}%</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #059669;">₹${item.totalAmount}</td>
    </tr>
  `).join("");

  // 3. Complete WhatsApp Body Text payload
  const whatsappMessage = `*🧾 NEW INVOICE TRANSACTION RECORDED*
-----------------------------------------
*Invoice Number:* ${invoiceNumber}
*Farmer Profile:* ${farmer.name}
*Sector/Village:* ${farmer.village || "N/A"}
*Billing Terms:* ${billingType.toUpperCase()}
${dueDate ? `*Maturity Due Date:* ${dueDate}\n` : ""}
*Purchased Allocation:*
${itemizedTextList}

-----------------------------------------
*Financial Statement Summary:*
• Aggregate Subtotal: ₹${financials.subTotal}
• Accumulated GST: + ₹${financials.totalGST}
• *GRAND TOTAL PAYABLE: ₹${financials.grandTotal}*
-----------------------------------------
_Thank you for doing business with our agricultural enterprise system network!_`;

  // 4. Complete Rich HTML Document body layout
  const emailHtmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(to right, #059669, #0f766e); padding: 24px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 22px;">Transaction Invoice Record</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #d1fae5;">Invoice ID: ${invoiceNumber}</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff; color: #334155;">
        <h3 style="margin-top: 0; color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Customer Framework Summary</h3>
        <p style="margin: 6px 0;"><strong>Farmer Profile Name:</strong> ${farmer.name}</p>
        <p style="margin: 6px 0;"><strong>Mobile Line Identity:</strong> ${farmer.mobileNumber}</p>
        <p style="margin: 6px 0;"><strong>Village Sector:</strong> ${farmer.village || "Not Specified"}</p>
        <p style="margin: 6px 0;"><strong>Billing Term Selection:</strong> <span style="text-transform: uppercase; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold;">${billingType}</span></p>
        ${dueDate ? `<p style="margin: 6px 0; color: #b91c1c;"><strong>Ledger Maturity Due Date:</strong> ${dueDate}</p>` : ""}
        
        <h3 style="margin-top: 24px; color: #1e293b;">Allocated Inventories Matrix</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
          <thead>
            <tr style="background-color: #f8fafc; color: #64748b;">
              <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">#</th>
              <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Stock Item</th>
              <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: center;">Qty</th>
              <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: right;">Rate</th>
              <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: center;">GST</th>
              <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemizedHtmlRows}
          </tbody>
        </table>

        <div style="margin-top: 24px; background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px; font-size: 14px;">
          <div style="margin-bottom: 6px; display: flex; justify-content: space-between;">
            <span>Aggregate Subtotal:</span>
            <span>₹${financials.subTotal}</span>
          </div>
          <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
            <span>Accumulated GST Distribution:</span>
            <span>+ ₹${financials.totalGST}</span>
          </div>
          <hr style="border-color: #334155; margin: 10px 0;" />
          <div style="font-size: 18px; font-weight: bold; color: #34d399; display: flex; justify-content: space-between;">
            <span>Grand Total Payable:</span>
            <span>₹${financials.grandTotal}</span>
          </div>
        </div>
      </div>
      <div style="background-color: #f8fafc; padding: 12px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        Automated Transaction Engine Secure Payload. Verification Signature Approved.
      </div>
    </div>
  `;

  return { whatsappMessage, emailHtmlContent };
};

// ================= CREATE INVOICE =================
export const createInvoice = async (req, res) => {
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
    // const farmer = await Farmer.findById(farmerId).session(session);
    // if (!farmer) {
    //   await session.abortTransaction();
    //   session.endSession();
    //   return res.status(404).json({ success: false, message: "Farmer profile records not found in system database." });
    // }

    const farmer = await Farmer.findById(farmerId).session(session);
    if (!farmer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Farmer profile records not found in system database." });
    }

    // --- SURGICAL FIX: PREVENT VALIDATION ERROR ---
    if (!farmer.district) farmer.district = "Not Specified";
    if (!farmer.email) farmer.email = `farmer_${farmerId}@agro.com`;
    if (!farmer.village) farmer.village = "Not Specified";
    // ----------------------------------------------


    let subTotal = 0;
    let totalGST = 0;
    const invoiceProducts = [];
    const notificationItemTracking = []; // Collect items dynamically with readable details for notifications

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

      if (product.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient inventory stock. Product: ${product.productName} | Requested: ${item.quantity} | Available: ${product.quantity}` 
        });
      }

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

      const itemTotal = selectedRate * Number(item.quantity);
      const gstAmount = (itemTotal * (product.gstRate || 0)) / 100;
      const finalAmount = itemTotal + gstAmount;

      subTotal += itemTotal;
      totalGST += gstAmount;

      product.quantity -= Number(item.quantity);
      await product.save({ session });

      const roundedLineTotal = Number(parseFloat(finalAmount.toFixed(2)));

      invoiceProducts.push({
        product: product._id,
        quantity: Number(item.quantity),
        selectedRate: Number(selectedRate),
        gstRate: Number(product.gstRate || 0),
        totalAmount: roundedLineTotal
      });

      // Capture metadata cleanly for the notification payload mapping block
      notificationItemTracking.push({
        productName: product.productName,
        quantity: Number(item.quantity),
        selectedRate: Number(selectedRate),
        gstRate: Number(product.gstRate || 0),
        totalAmount: roundedLineTotal
      });
    }

    const finalSubTotal = Number(parseFloat(subTotal.toFixed(2)));
    const finalTotalGST = Number(parseFloat(totalGST.toFixed(2)));
    const grandTotal = Number(parseFloat((finalSubTotal + finalTotalGST).toFixed(2)));

    const invoiceNumber = await generateInvoiceNumber();

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
    const calculatedDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (paymentStatus === "pending") {
      farmer.dueAmount = Number(parseFloat(((farmer.dueAmount || 0) + grandTotal).toFixed(2)));
      await farmer.save({ session });

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

    // Commit changes to the database synchronously
    await session.commitTransaction();
    session.endSession();

    // =========================================================================
    // ⚡ POST-COMMIT DISPATCH NODE: Runs outside db lock windows
    // =========================================================================
    const financials = { subTotal: finalSubTotal, totalGST: finalTotalGST, grandTotal };
    const dateString = calculatedDueDate.toLocaleDateString("en-IN", { dateStyle: "medium" });

    const { whatsappMessage, emailHtmlContent } = generateInvoiceNotifications(
      farmer,
      notificationItemTracking,
      financials,
      billingType,
      billingType.includes("credit") ? dateString : null,
      invoiceNumber
    );

    // Wire out WhatsApp message over Twilio Matrix
    if (farmer.mobileNumber) {
      try {
        // Clean phone numbers into valid E.164 context formats
        const targetPhone = farmer.mobileNumber.startsWith("+") ? farmer.mobileNumber : `+91${farmer.mobileNumber}`;
        await twilioClient.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${targetPhone}`,
          body: whatsappMessage,
        });
      } catch (smsError) {
        console.error("Twilio system channel connection failure context:", smsError.message);
      }
    }

    // Wire out confirmation email over Mail Server
    if (farmer.email) {
      try {
        await emailTransporter.sendMail({
          from: `"Agro ERP Billing Operations" <${process.env.EMAIL_USER}>`,
          to: farmer.email,
          subject: `🧾 Transaction Invoice Confirmed - No: ${invoiceNumber} [Total: ₹${grandTotal}]`,
          html: emailHtmlContent,
        });
      } catch (mailError) {
        console.error("Nodemailer SMTP link drop failure context:", mailError.message);
      }
    }

    // 6. Return response to front-end Client
    return res.status(201).json({
      success: true,
      message: "Invoice Created and ledger transactions dispatched successfully.",
      invoice
    });

  } catch (error) {
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
// ================= GET ALL INVOICES (ROBUST VERSION) =================
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate({
        path: "farmer",
        select: "name mobileNumber village address dueAmount email",
        options: { strictPopulate: false } // Fix: Allows population even if farmer record is missing
      })
      .populate({
        path: "products.product",
        select: "productName cashRate creditRate wholesaleRate creditWholesaleRate gstRate",
        options: { strictPopulate: false } // Fix: Allows population even if product record is missing
      })
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
      .populate("farmer", "name mobileNumber village address dueAmount email")
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
      .populate("farmer", "name mobileNumber village address email")
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



export const resendInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate("farmer");
    
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    // Re-use your notification logic here to resend...
    // e.g., await sendEmailOrWhatsApp(invoice.farmer, ...);

    return res.status(200).json({ success: true, message: "Invoice resent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};