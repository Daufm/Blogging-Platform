import nodemailer from "nodemailer";
import dotenv from "dotenv";


// Create a transport for sending emails using SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    }
  });

// Send email utility function
const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
        from: `"Blog Sphere" <${process.env.EMAIL_USER}>`,  // your email
      to,  
      subject,  
      html,  
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed.");
  }
};

export default sendEmail;
