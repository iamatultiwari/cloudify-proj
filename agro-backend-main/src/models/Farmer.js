import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Customer name is strictly required.'],
    trim: true
  },
  mobileNumber: { 
    type: String, 
    required: [true, 'WhatsApp mobile number is mandatory.'],
    unique: true,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number.']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required for digital receipts.'],
    //unique: true,
    lowercase: true,
    trim: true
  },
  village: { 
    type: String, 
    required: [true, 'Village is mandatory.'],
    trim: true
  },
  district: { 
    type: String, 
    required: [true, 'District is mandatory.'],
    trim: true
  },
  state: { 
    type: String, 
    required: [true, 'State is required.'],
    default: 'Madhya Pradesh',
    trim: true
  },
  mandiLicenseNumber: { 
    type: String, 
    unique: true,
    sparse: true, 
    trim: true,
    uppercase: true
  },
  aadharNumber: {
  type: String,
  unique: true
}
}, { 
  timestamps: true 
});

// Use a check to prevent re-compilation if the model already exists
const Farmer = mongoose.models.Farmer || mongoose.model("Farmer", farmerSchema);

export default Farmer;