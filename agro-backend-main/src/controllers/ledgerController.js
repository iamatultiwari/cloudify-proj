const Invoice = require('../models/Invoice');
const Receipt = require('../models/Receipt');


const Invoice = require('../models/Invoice');
const Receipt = require('../models/Receipt');
const Farmer = require('../models/Farmer'); // Ensure Farmer details can be compiled
const { sendEmailAlert, sendWhatsAppAlert } = require('../services/notificationService');





exports.collectPayment = async (req, res) => {
  try {
    const { farmerId, amount, paymentMode, remarks, date, dispatchNotification = true } = req.body;
    
    if (!farmerId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid parameter inputs." });
    }

    const receipt = new Receipt({ farmerId, amount, paymentMode, remarks, date: date || new Date() });
    await receipt.save();

    // Pull Farmer contact parameters for message targeting
    const farmer = await Farmer.findById(farmerId);
    
    if (farmer && dispatchNotification) {
      const messageStr = `Hello ${farmer.name}, we have successfully confirmed receipt of payment amount: ₹${amount} via ${paymentMode.toUpperCase()} on your balance sheet ledger account file ref ${receipt.referenceNumber}. Thank you for your business!`;
      
      // Fire Async Dispatches
      sendWhatsAppAlert(farmer.mobileNumber, messageStr);
      sendEmailAlert(
        farmer.email, 
        "Payment Receipt Confirmation", 
        messageStr, 
        `<div style="font-family:sans-serif; padding:20px; border-radius:12px; border:1px solid #e2e8f0;">
          <h2 style="color:#10b981;">Payment Confirmed</h2>
          <p>Dear ${farmer.name},</p>
          <p>We have successfully credited your account ledger sheet.</p>
          <table style="width:100%; border-collapse:collapse; margin:15px 0;">
            <tr style="background:#f8fafc;"><td style="padding:8px; font-weight:bold;">Receipt ID:</td><td style="padding:8px; font-family:monospace;">${receipt.referenceNumber}</td></tr>
            <tr><td style="padding:8px; font-weight:bold;">Amount Paid:</td><td style="padding:8px; color:#10b981; font-weight:bold;">₹${amount}</td></tr>
            <tr style="background:#f8fafc;"><td style="padding:8px; font-weight:bold;">Channel Mode:</td><td style="padding:8px; uppercase">${paymentMode}</td></tr>
          </table>
         </div>`
      );
    }

    res.status(201).json({ message: "Receipt logged successfully.", receipt });
  } catch (error) {
    res.status(500).json({ message: "Transaction failed.", error: error.message });
  }
};
// Compiles a chronologically sorted running ledger statement
exports.getFarmerLedger = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const [invoices, receipts] = await Promise.all([
      Invoice.find({ farmerId }).sort({ createdAt: 1 }),
      Receipt.find({ farmerId }).sort({ date: 1 })
    ]);

    let transactions = [];
    let lifetimeBilled = 0;
    let totalPaid = 0;

    // Map Invoices as Debits (Increases running balance)
    invoices.forEach(inv => {
      const amount = inv.grandTotal || inv.totalAmount || 0;
      lifetimeBilled += amount;
      transactions.push({
        _id: inv._id,
        date: inv.createdAt,
        referenceNumber: inv.invoiceNumber || 'INVOICE',
        type: 'invoice',
        amount: amount
      });
    });

    // Map Receipts as Credits (Decreases running balance)
    receipts.forEach(rec => {
      totalPaid += rec.amount;
      transactions.push({
        _id: rec._id,
        date: rec.date,
        referenceNumber: rec.referenceNumber,
        type: 'receipt',
        amount: rec.amount
      });
    });

    // Sort transactions chronologically
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate sequential running balance
    let runningBalance = 0;
    transactions = transactions.map(tx => {
      if (tx.type === 'invoice') {
        runningBalance += tx.amount;
      } else {
        runningBalance -= tx.amount;
      }
      return { ...tx, runningBalance };
    });

    res.status(200).json({
      transactions,
      summary: {
        lifetimeBilled,
        totalPaid,
        outstandingBalance: runningBalance
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to compile statement history.", error: error.message });
  }
};

// Records manual/deferred collections vouchers
exports.collectPayment = async (req, res) => {
  try {
    const { farmerId, amount, paymentMode, remarks, date } = req.body;
    
    if (!farmerId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid accounting payload parameters." });
    }

    const receipt = new Receipt({
      farmerId,
      amount,
      paymentMode,
      remarks,
      date: date || new Date()
    });

    await receipt.save();
    res.status(201).json({ message: "Receipt logged successfully.", receipt });
  } catch (error) {
    res.status(500).json({ message: "Transaction submission error.", error: error.message });
  }
};