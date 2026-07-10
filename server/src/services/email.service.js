// server/src/services/email.service.js

import SibApiV3Sdk from '@getbrevo/brevo'

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY

export const sendPasswordResetEmail = async (email, resetUrl) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  sendSmtpEmail.subject = 'Reset your CareerAI password'
  sendSmtpEmail.to = [{ email: email }]
  sendSmtpEmail.sender = { 
    name: 'CareerAI', 
    email: 'noreply@careerai.com'
  }
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; border: 1px solid #e5e7eb;">
          <div style="margin-bottom: 32px;">
            <span style="font-weight: 700; font-size: 20px; color: #111827;">CareerAI</span>
          </div>
          <h1 style="font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 8px;">
            Reset your password
          </h1>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            We received a request to reset your CareerAI password. Click the button below to choose a new one.
          </p>
          <a href="${resetUrl}"
             style="display: block; background: #2563eb; color: white; text-align: center; padding: 14px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; margin-bottom: 24px;">
            Reset Password
          </a>
          <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 0 0 8px;">
            This link expires in <strong>1 hour</strong>. If you did not request this, ignore this email.
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            Or copy this link:<br/>
            <span style="color: #2563eb; word-break: break-all;">${resetUrl}</span>
          </p>
          <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 20px;">
            <p style="color: #d1d5db; font-size: 11px; margin: 0;">CareerAI · Built for students</p>
          </div>
        </div>
      </body>
    </html>
  `

  await apiInstance.sendTransacEmail(sendSmtpEmail)
}