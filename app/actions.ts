// app/actions.ts

"use server";

import nodemailer from "nodemailer";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendEmail(formData: FormData) {
  const { GMAIL_EMAIL, GMAIL_APP_PASSWORD } = process.env;

  // Create a transporter object using Gmail's SMTP server
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_EMAIL,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  try {
    // Send the email
    await transporter.sendMail({
      from: `"${formData.name}" <${GMAIL_EMAIL}>`, // Use your Gmail as the sender
      to: "rmt.jodhpur@gmail.com", // Where you want to receive the email
      replyTo: formData.email,
      subject: `New Message from ${formData.name}: ${formData.subject}`,
      html: `
                <h1>New Contact Form Submission</h1>
                <p>You have received a new message from your website's contact form.</p>
                <hr>
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Subject:</strong> ${formData.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${formData.message.replace(/\n/g, "<br>")}</p>
            `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send message." };
  }
}
