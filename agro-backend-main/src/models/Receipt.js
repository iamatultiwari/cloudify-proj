const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  farmerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Farmer', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  paymentMode: { 
    type: String, 
    enum: ['cash', 'upi', 'bank_transfer', 'cheque'], 
    default: 'cash' 
  },
  referenceNumber: { 
    type: String, 
    unique: true, 
    default: () => `REC-${Math.random().toString(36).substr(2, 9).toUpperCase()}` 
  },
  remarks: { 
    type: String 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema);