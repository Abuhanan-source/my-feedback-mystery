import dbconnection from "@/lib/dbConnection";
import { getServerSession } from "next-auth/next";
import UserModel from "@/models/User";
import { authOption } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET() {
  await dbconnection();

  const session = await getServerSession(authOption);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userIdStr = (session?.user as any)?._id; // extend NextAuth later

  if (!session?.user || !userIdStr) {
    return Response.json(
      { success: false, message: "Not Authenticated!" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(userIdStr);

  try {
    const userMessage = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { 
          path: "$message", 
          preserveNullAndEmptyArrays: true 
        } 
      },
      { $sort: { "message.CreateAt": -1 } },
      { $group: { 
          _id: "$_id", 
          messages: { $push: "$message" } 
        } 
      },
    ]).exec();

    if (!userMessage || userMessage.length === 0) {
      return Response.json(
        { success: false, message: "user not found!" },
        { status: 404 }
      );
    }

    // Filter out null messages (if empty array preserved)
    const finalMessages = (userMessage[0].messages || []).filter((msg:unknown) => msg !== null);

    return Response.json(
      { success: true, messages: finalMessages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Aggregation error:", error);
    return Response.json(
      { success: false, message: "message error!" },
      { status: 500 }
    );
  }
}
