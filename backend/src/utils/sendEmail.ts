// backend/src/utils/sendEmail.ts

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 이메일 전송 옵션 인터페이스
 */
export interface SendEmailOptions {
  to: string;           // 수신자 이메일 주소
  subject: string;      // 메일 제목
  text: string;         // 텍스트 본문
  html?: string;        // HTML 본문 (선택)
}

// Nodemailer transporter 설정
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * 이메일 전송 함수
 * @param options SendEmailOptions
 */
export default async function sendEmail(options: SendEmailOptions): Promise<void> {
  const { to, subject, text, html } = options;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw error;
  }
}
