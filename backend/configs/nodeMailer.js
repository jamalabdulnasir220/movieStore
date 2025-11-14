import nodemailer from "nodemailer";


const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

if (!SMTP_USER || !SMTP_PASS || !SENDER_EMAIL) {
  console.warn(
    "Missing SMTP env vars. Make sure SMTP_USER, SMTP_PASS and SENDER_EMAIL are set."
  );
}

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function initialVerify() {
  try {
    await transporter.verify();
    console.log("SMTP transporter verified at startup.");
  } catch (err) {
    console.warn("Initial SMTP verify failed (will retry on send).", err?.message);
  }
}
initialVerify();

const sendEmail = async ({ to, subject, body }) => {
  const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html: body,
  });
  return response;
};

export default sendEmail;
