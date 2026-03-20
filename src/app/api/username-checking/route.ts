import dbconnection from "@/lib/dbConnection";
import {z} from "zod"
import UserModel from "@/models/User";
import { usernameValidation } from "@/schema/signupSchema";

const username_Checking = z.object({
    username:usernameValidation
})

export async function GET(request:Request){
    await dbconnection();
    try {
        const {searchParams} = new URL(request.url)
        const queryparms = {
            username:searchParams.get('username')
        }

        const result = username_Checking.safeParse(queryparms)

        if (!result.success) {
            const usernameError = result.error.format().username?._errors|| []
             return Response.json({
            success:false,
            message:usernameError.length > 0 ? usernameError.join(',') : "invalid query"

        },{
            status:400
        })
    }

        const {username} = result.data
        const userVarified = await UserModel.findOne({username,isvarified:true})
        if (userVarified) {
            return Response.json({
            success:false,
            message:"user already exist please take a unique name!"
        },{
            status:400
        })
        }

        return Response.json({
            success:true,
            message:"username is unique!"
        },{
            status:201
        })


    } catch (error) {
        console.error("Username Request Error",error);
        return Response.json({
            success:false,
            message:"Username Unique Checking Error"

        })
    }
}