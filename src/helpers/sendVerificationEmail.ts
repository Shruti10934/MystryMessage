import { resend } from "@/lib/resend";
import verificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log("email : ",email);
    console.log("username : ", username);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email.trim(),
      subject: "Mystry Message | Verification code",
      react: verificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.error("Error sending verification email ", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
