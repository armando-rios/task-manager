import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email, name, verificationToken) => {
  const verificationUrl = `${process.env.APP_URL}/verify-email?token=${verificationToken}`

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Task Manager <onboarding@resend.dev>',
      to: [email],
      subject: 'Please verify your email address',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your email</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 40px 20px;">
                        <h1 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">Welcome to Task Manager!</h1>
                        <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                          Hi ${name},
                        </p>
                        <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                          Thanks for signing up! Please verify your email address to get started with Task Manager.
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                Verify Email Address
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 0 0 10px; color: #999999; font-size: 14px; line-height: 1.5;">
                          Or copy and paste this link into your browser:
                        </p>
                        <p style="margin: 0 0 20px; color: #6366f1; font-size: 14px; word-break: break-all;">
                          ${verificationUrl}
                        </p>
                        <p style="margin: 20px 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                          This link will expire in 24 hours.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 40px 40px; border-top: 1px solid #eeeeee;">
                        <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.5;">
                          If you didn't create an account with Task Manager, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending verification email:', error)
      throw new Error('Failed to send verification email')
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    throw error
  }
}
