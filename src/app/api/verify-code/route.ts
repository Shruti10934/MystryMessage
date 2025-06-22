import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import { verifySchema } from "@/schemas/verifySchema";
import UserModel from "@/model/User";

const verifyCodeQuerySchema = z.object({
  verifyCode: verifySchema,
});

export async function POST(request: Request) {
  await dbConnect();
  try {
      const { username, code } = await request.json();
    const result = verifyCodeQuerySchema.safeParse({ verifyCode: code });

    if (!result.success) {
      const verifyCodeErrors = result.error.format().verifyCode?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            verifyCodeErrors?.length > 0
              ? verifyCodeErrors.join(", ")
              : "Invalid query parameter",
        },
        { status: 400 }
      );
    }

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Verify code expired, Please signUp again to get a new code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user: ", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
