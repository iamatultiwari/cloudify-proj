import nodemailer from "nodemailer";

export const sendRegistrationEmail = async (userEmail, userName, userDistrict) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"AgroERP Support" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Welcome to Agro-ERP! Registration Successful",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #166534;">Welcome, ${userName}!</h2>
        <p>Your account has been successfully registered on the <strong>Agro-ERP</strong> platform.</p>
        <p><strong>Registered District:</strong> ${userDistrict}</p>
        <p>You can now log in to manage your agricultural transactions and ledger history.</p>
        <br>
        <p>Thank you for joining our community.</p>
        <p>Best Regards,<br>AgroERP Team</p>
      </div>
    `,
  });
};