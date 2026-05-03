import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '';
const isSmtpConfigured = SMTP_HOST && SMTP_HOST !== 'smtp.example.com';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  connectionTimeout: 3000,
  greetingTimeout: 3000,
  socketTimeout: 3000,
});

/**
 * 发送验证邮件
 * 如果SMTP未正确配置，直接抛出错误由调用方处理
 * @param email 收件人邮箱
 * @param verifyToken 验证Token
 */
export async function sendVerificationEmail(email: string, verifyToken: string): Promise<void> {
  if (!isSmtpConfigured) {
    throw new Error('SMTP_NOT_CONFIGURED');
  }

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${verifyToken}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: '【CyberCAD】验证您的邮箱地址',
    html: `
      <div style="background-color: #0a0a0f; color: #00f0ff; padding: 40px; font-family: Arial, sans-serif;">
        <h1 style="color: #00f0ff; text-shadow: 0 0 10px #00f0ff;">欢迎加入 CyberCAD</h1>
        <p>请点击以下链接验证您的邮箱地址：</p>
        <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #00f0ff 0%, #b5179e 100%); color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          验证邮箱
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          如果您没有注册 CyberCAD 账号，请忽略此邮件。
        </p>
      </div>
    `,
  });
}

/**
 * 发送密码重置邮件
 * @param email 收件人邮箱
 * @param resetToken 重置Token
 */
export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
  if (!isSmtpConfigured) {
    throw new Error('SMTP_NOT_CONFIGURED');
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: '【CyberCAD】重置您的密码',
    html: `
      <div style="background-color: #0a0a0f; color: #00f0ff; padding: 40px; font-family: Arial, sans-serif;">
        <h1 style="color: #00f0ff; text-shadow: 0 0 10px #00f0ff;">密码重置</h1>
        <p>请点击以下链接重置您的密码：</p>
        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #00f0ff 0%, #b5179e 100%); color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          重置密码
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          此链接将在30分钟后过期。如果您没有请求重置密码，请忽略此邮件。
        </p>
      </div>
    `,
  });
}
