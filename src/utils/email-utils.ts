import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }: Record<string, string>) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  return transporter.sendMail({
    from: `"No-Reply" <kw.testing@outlook.com>`,
    to,
    subject,
    html,
  });
}

export const sendVerificationEmail = async({name, email, verificationToken, origin}: Record<string, string>) => {
  const verifyEmailURL = `${origin}/auth/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link: <a href=${verifyEmailURL}>Verify Your Account</a></p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hi! ${name},</h4>${message}`,
  });
}

export const sendResetPasswordEmail = async ({name, email, passwordToken, origin}: Record<string,string>) => {
  const resetPasswordURL = `${origin}/auth/reset-password?token=${passwordToken}&email=${email}`;
  const message = `<p>Please reset password by click on the following link:
  <a href=${resetPasswordURL}>Reset Password</a>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hi! ${name},</h4>${message}`,
  });
}