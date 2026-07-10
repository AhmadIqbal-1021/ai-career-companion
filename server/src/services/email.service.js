import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendPasswordResetEmail = async (email, resetUrl) => {
    
  await brevo.transactionalEmails.sendTransacEmail({
    subject: 'Reset your CareerAI password',
    sender: {
      name: 'CareerAI',
      email: 'duckychachu@gmail.com',
    },
    to: [
      {
        email,
      },
    ],
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:40px 20px;">
          <div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;padding:40px;border:1px solid #e5e7eb;">
            <div style="margin-bottom:32px;">
              <span style="font-weight:700;font-size:20px;color:#111827;">CareerAI</span>
            </div>

            <h1 style="font-size:22px;font-weight:700;color:#111827;">
              Reset your password
            </h1>

            <p style="color:#6b7280;font-size:14px;line-height:1.6;">
              We received a request to reset your CareerAI password.
            </p>

            <a href="${resetUrl}"
               style="display:block;background:#2563eb;color:white;text-align:center;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;">
               Reset Password
            </a>

            <p style="font-size:12px;color:#9ca3af;">
              This link expires in <strong>1 hour</strong>.
            </p>

            <p style="font-size:12px;color:#9ca3af;">
              ${resetUrl}
            </p>
          </div>
        </body>
      </html>
    `,
  });
};