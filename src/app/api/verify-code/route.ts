import dbconnection from "@/lib/dbConnection";
import UserModel from "@/models/User";

export async function POST(request:Request) {
    await dbconnection();
    try {
        const {username,verifyCode} = await request.json();
        const decodingName = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodingName});

        if (!user) {
             return Response.json({
            success:false,
            message:"User is not found!"
        })
        }

        const userverified = user.varifiedCode === verifyCode;
        const codeExpiry = new Date(user.varifiedCodeExpiry) > new Date();

        if (userverified && codeExpiry) {
            user.isvarified = true;
            await user.save();
             return Response.json({
            success:true,
            message:"User Verification Successfully!"
        })
        }else if(!userverified){
             return Response.json({
            success:false,
            message:"Wrong Verification Code"
        })
        }else{
            return Response.json({
            success:false,
            message:"Your Code is Expire.Please SignUp Again!"
        })
        }
    } catch (error) {
         console.error("Verify Posting Error ",error);
        return Response.json({
            success:false,
            message:"Verify Posting Error"
        })
    }
}