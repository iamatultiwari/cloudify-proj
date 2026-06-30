import nodemailer from "nodemailer";

// Create the transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  // If port is 465, secure must be true. If 587, secure is usually false.
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add this to prevent some common connection errors
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendRegistrationEmail = async (userEmail, userName, userDistrict) => {
  try {
    const info = await transporter.sendMail({
      from: `"Agro ERP" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "🌱 Welcome to Agro ERP",
      html: `
        <div style="font-family:Arial, sans-serif; padding:25px; line-height: 1.6;">
          <h2 style="color:#16a34a">Welcome ${userName} 👋</h2>
          <p>Thank you for registering with Agro ERP.</p>
          <table style="border-collapse:collapse; width: 100%; max-width: 400px;">
            <tr><td style="padding: 5px;"><b>Name:</b></td><td style="padding: 5px;">${userName}</td></tr>
            <tr><td style="padding: 5px;"><b>Email:</b></td><td style="padding: 5px;">${userEmail}</td></tr>
            <tr><td style="padding: 5px;"><b>District:</b></td><td style="padding: 5px;">${userDistrict}</td></tr>
          </table>
          <br>
          <p>Your registration was completed successfully. You can now purchase products, generate invoices, and manage your transactions.</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p>Regards,<br><b>Agro ERP Team</b></p>
        </div>
      `,
    });

    console.log("✅ Email successfully sent to %s. Message ID: %s", userEmail, info.messageId);
    return info;
  } catch (error) {
    console.error("❌ SMTP Error in sendRegistrationEmail:", error.message);
    // Throw error so the controller knows the email failed
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};