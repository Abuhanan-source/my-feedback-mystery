import { transporter } from "@/lib/mailer";


export async function sendVarificationEmail(
    email:string,
    username:string,
    varifiedCode:string
){
  const mailOptions = {
    from: `"${process.env.NEXT_PUBLIC_APP_NAME}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Email Verification",
    html: `
      <div style="font-family: Arial; text-align: center;">
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="color: #4CAF50;">${varifiedCode}</h1>
        <p>This OTP is valid for <b>5 minutes</b>.</p>
      </div>
    `,
  };

    await transporter.sendMail(mailOptions);

  return varifiedCode; // Return OTP to store in DB or session
}

