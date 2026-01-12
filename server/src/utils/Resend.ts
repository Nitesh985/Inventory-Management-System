import { Resend } from 'resend';
import { ApiError } from './index.ts';

const resend = new Resend(process.env.RESEND_API_KEY);

export const ResendsendResend = async (email, username) => {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: "Qrder Sign Up",
    html: "<strong>Thank you " + username + " for signing up with our Smart Menu restaurant, we're excited to have you"})

    console.log(error)
  return data

}
