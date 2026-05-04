import nodemailer from "nodemailer";

let transporterPromise = null; //lazy singleton pattern for transporter
// ensures the transporter is only created once and reused for subsequent emails.
//cached (saved temporarily so you can reuse it quickly) transporter instance to avoid creating multiple transporters, which can be resource-intensive and lead to performance issues.

function isPlaceholder(value) {
  //checks if the value contains common Mailtrap placeholders, indicating it's not a real credential.
  if (!value) return true;
  const lower = value.toLowerCase();
  return (
    lower.includes("your_mailtrap_username") ||
    lower.includes("your_mailtrap_password")
  );
}

async function createTransporter() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT ?? 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  const hasRealSmtp =
    host && user && pass && !isPlaceholder(user) && !isPlaceholder(pass);

  if (hasRealSmtp) {
    //production path
    //if real credentials are provided, create a transporter using those credentials to send real emails;

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    // test path
    // otherwise, create a test transporter that simulates email sending without actually sending emails.
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

async function getTransporter() {
  // creates one transporter instance and
  // reuses it for all email sending operations, improving performance and resource management.
  if (!transporterPromise) {
    transporterPromise = createTransporter();
  }
  return transporterPromise;
}

export async function sendEmail({ to, subject, text, html }) {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || "TaskMaster <no-reply@taskmaster.dev>",
    to,
    subject,
    text,
    html,
  });

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    previewUrl: nodemailer.getTestMessageUrl(info),
  };
}
