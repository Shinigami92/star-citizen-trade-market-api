import * as dotenv from 'dotenv';
import { createTransport, Transporter } from 'nodemailer';

dotenv.config();

export const transporter: Transporter = createTransport({
	host: process.env.MAIL_SMTP_HOST,
	port: +process.env.MAIL_SMTP_PORT!,
	secure: false,
	requireTLS: true,
	auth: { user: process.env.MAIL_AUTH_USER, pass: process.env.MAIL_AUTH_PASS },
	from: process.env.MAIL_DEFAULT_FROM
});
