import nodemailer from "nodemailer";

console.log("===== ENV CHECK (masked) =====");
["SMTP_USER","SMTP_PASS","SENDER_EMAIL","SMTP_HOST","SMTP_PORT","BREVO_API_KEY"].forEach(k=>{
  const v = process.env[k];
  console.log(`${k}:`, v ? `${v.toString().slice(0,8)}... (set)` : "NULL");
});

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, body }) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html: body,
    });
    return response;
  } catch (error) {
    return `This is the error ${error}`
  }
};

export default sendEmail;
