import { getServerSession } from "next-auth";
import dbconnection from "@/lib/dbConnection";
import UserModel from "@/models/User";
import { authOption } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request:Request) {
    await dbconnection();

    const session = await getServerSession(authOption)
    const user: User = session?.user

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated!"
        })
    }

    const userId = user._id
    const {acceptMessages} = await request.json();

    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAccessible:acceptMessages},
            {new:true}
        )

        if (!updateUser) {
            return Response.json({
            success:false,
            message:"Failed Updated Users"
        },{
            status:400
        })
        }

        return Response.json({
            success:true,
            message:"Message acceptance status updated successfully!"
        },{
            status:200
        })
        
    } catch (error) {
         console.error("Resquesting Failed",error);
        return Response.json({
            success:false,
            message:"Resquesting Failed"

        })
    }
}


export async function GET() {
  await dbconnection();

  const session = await getServerSession(authOption);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authenticated!"
    });
  }

  try {
    const userUpdate = await UserModel.findById(user._id);
        if (!userUpdate) {
            return Response.json({
            success:false,
            message:"User Not Found!"
        },{
            status:400
        })
        }

        return Response.json({
            success:true,
            isAcceptanceMessages:userUpdate.isAccessible
        },{
            status:200
        })

    } catch (error) {
          console.error("Error is getting messages acceptance messages status",error);
        return Response.json({
            success:false,
            message:"Error is getting messages acceptance messages status"

        },{
            status:500
        })
    }
}