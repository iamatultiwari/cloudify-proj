// const generateInvoiceNumber = () => {

//   const random = Math.floor(
//     1000 + Math.random() * 9000
//   );

//   return `INV-${Date.now()}-${random}`;
// };

// export default generateInvoiceNumber;

import Invoice from "../models/Invoice.js";

/**
 * Dynamically evaluates database documents to calculate the next sequential invoice tracking code.
 * Output format standard: INV-00001, INV-00002...
 * @returns {String} unique sequential tracking reference code
 */
const generateInvoiceNumber = async () => {
  try {
    // Look at the single most recently generated document in the collection
    const lastInvoice = await Invoice.findOne({}, { invoiceNumber: 1 })
      .sort({ createdAt: -1 })
      .lean();

    if (!lastInvoice || !lastInvoice.invoiceNumber) {
      return "INV-00001";
    }

    // Isolate numerical sequences using regex capture blocks
    const numericPartString = lastInvoice.invoiceNumber.replace("INV-", "");
    const parsedCurrentNumber = parseInt(numericPartString, 10);

    if (isNaN(parsedCurrentNumber)) {
      return `INV-${Date.now()}`; // Safe fallback stamp if sequence string encounters manipulation corruptions
    }

    const nextIncrementalValue = parsedCurrentNumber + 1;
    
    // Pad values out dynamically to retain uniform character widths across application registries
    return `INV-${String(nextIncrementalValue).padStart(5, "0")}`;
  } catch (error) {
    console.error("SEQUENCE GENERATION SYSTEM ERROR:", error);
    // Absolute failsafe fallback mechanism to prevent catastrophic write blocks on duplicate indexes
    return `INV-ERR-${Math.floor(10000 + Math.random() * 90000)}`;
  }
};

export default generateInvoiceNumber;