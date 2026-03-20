import dbconnection from "@/lib/dbConnection";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVarificationEmail } from "../../../helpers/sendVarificationEmail";

export async function POST(request: Request) {
    await dbconnection();

    try {
        const { username, email, password } = await request.json();

        // ✅ Check if a verified user already exists with same username
        const userVarified = await UserModel.findOne({ username, isvarified: true });
        if (userVarified) {
            return Response.json(
                {
                    success: false,
                    message: "Username already verified or exists!",
                },
                { status: 400 }
            );
        }

        // ✅ Check for existing email
        const existingEmail = await UserModel.findOne({ email });
        const varifiedCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingEmail) {
            if (existingEmail.isvarified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email!",
                    },
                    { status: 400 }
                );
            } else {
                // ✅ Update existing unverified user
                const hashPassword = await bcrypt.hash(password, 10);
                existingEmail.password = hashPassword;
                existingEmail.varifiedCode = varifiedCode;
                existingEmail.varifiedCodeExpiry = new Date(Date.now() + 3600000); // 1 hour
                await existingEmail.save();
            }
        } else {
            // ✅ Create a new user
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date(Date.now() + 3600000); // 1 hour

            const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                isvarified: false,
                varifiedCode,
                varifiedCodeExpiry: expiryDate,
                isAccessible: true,
                message: [],
            });

            await newUser.save();
        }

        // ✅ Send verification email (optional)
        const emailResponse = await sendVarificationEmail(
            email,
            username,
            varifiedCode
          )

            console.log(emailResponse);


          if(!emailResponse){
             return Response.json({
                 success: false,
                 message:"error"
            },{
            status:500
        })
          }

        return Response.json(
            {
                success: true,
                message: "User registered successfully! Please verify your email.",
            },
            { status: 201 }
        );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Registration Error:", JSON.stringify(error, null, 2));
        return Response.json(
            {
                success: false,
                message: error.message || "Error registering user!",
                errors: error.errors || null,
            },
            { status: 500 }
        );
    }
}
