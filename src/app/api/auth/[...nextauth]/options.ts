import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbconnection from "@/lib/dbConnection";
import UserModel from "@/models/User";

export const authOption:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
            identifier: { label: "Email or Username", type: "text"},
            password: { label: "Password", type: "password" }
            }, 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async authorize(credentials:any): Promise<any> {
                await dbconnection();
                try {
                   const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error('No User Found with this email!');
                    }

                    if(!user.isvarified){
                        throw new Error('Please varify your account before login!')
                    }

                    const passwordCheck = await bcrypt.compare(credentials.password, user.password)

                    if(passwordCheck){
                        return user
                    }else{
                        throw new Error("Incorrect password!");
                    }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error:any) {
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks:{
         async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString();
                token.isvarified = user.isvarified;
                token.isAccessible = user.isAccessible;
                token.username = user.username;
            }
      return token;
    },
     async session({ session, token }) {
        if(token){
                session.user._id = token._id;
                session.user.isvarified = token.isvarified;
                session.user.isAccessible = token.isAccessible;
                session.user.username = token.username;
            }
      return session;
    },

    },
    
     pages: {
        signIn: '/sign-in',
     },

     session:{
        strategy:'jwt'
     },

     secret:process.env.AUTH_SECRET,
}
