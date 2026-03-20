import dbconnection from "@/lib/dbConnection";
import UserModel from "@/models/User";

import { Message } from "@/models/User";

export async function POST(request:Request) {
    await dbconnection();
    const {username,content} = await request.json();

    try {
        const user = await UserModel.findOne({username});

        if (!user) {
            return Response.json({
            success:false,
            message:"User Not Found!"
        },{
            status:400
        })
        }

        if(!user.isAccessible){
             return Response.json({
            success:false,
            message:"User Can Not Accept messages!"
        },{
            status:400
        })
        }

        const updatedUser = {content,CreateAt:new Date()}

        user.message.push(updatedUser as Message)
        await user.save();

           return Response.json({
            success:false,
            message:"Message sent successfully!"
        },{
            status:200
        })

    } catch {
          return Response.json({
            success:false,
            message:"Message sending error! Internal Server Error"
        },{
            status:500
        })
    }
}