import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";

const acceptMessageQuerySchema = z.object({
  isAcceptingMessages: acceptMessageSchema,
});

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  console.log("session ", session);
  
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  const result = acceptMessageQuerySchema.safeParse(acceptMessages);
  console.log("result zod ", result);

  if (!result.success) {
    const isAcceptingMessagesErrors = result.error.format().isAcceptingMessages?._errors || [];
    return Response.json(
      {
        success: false,
        message:
          isAcceptingMessagesErrors?.length > 0
            ? isAcceptingMessagesErrors.join(", ")
            : "Invalid query parameter",
      },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update the status to accept messages",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message acceptance flag updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update the status to accept messages: ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update the status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getting message accepting status : ", error);
    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
