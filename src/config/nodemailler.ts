import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_MAIL_USERNAME,
        pass: process.env.SMTP_MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false,
    }
});