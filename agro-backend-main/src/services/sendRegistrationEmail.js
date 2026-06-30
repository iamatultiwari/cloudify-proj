import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  // If port is 465, secure MUST be true. If 587, secure is false.
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // This helps bypass common connection handshake failures
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
        <div style="font-family:Arial;padding:25px">
          <h2 style="color:#16a34a">Welcome ${userName} 👋</h2>
          <p>Thank you for registering with Agro ERP.</p>
          <table style="border-collapse:collapse">
            <tr><td><b>Name</b></td><td>${userName}</td></tr>
            <tr><td><b>Email</b></td><td>${userEmail}</td></tr>
            <tr><td><b>District</b></td><td>${userDistrict}</td></tr>
          </table>
          <br>
          <p>Your registration was completed successfully.</p>
          <p>You can now purchase products, generate invoices and manage your transactions.</p>
          <hr>
          <p>Regards,<br>Agro ERP Team</p>
        </div>
      `,
    });
    
    console.log("✅ Email sent successfully! Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email failed to send:", error);
    throw error;
  }
};