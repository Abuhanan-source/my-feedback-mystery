import mongoose, {Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string,
    CreateAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    CreateAt:{
        type:Date,
        required:true,
        default:Date.now()
    }

})

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    isvarified:boolean;
    varifiedCode:string;
    varifiedCodeExpiry:Date;
    isAccessible:boolean;
    message: Message[];
}


const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:[true, "Username is required"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true, "email is required"],
        unique:true,
        match:[/.+\@.+\..+/, "please use a valid email"]
    },
    password:{
        type:String,
        required:[true, "password is required"]
    },
    varifiedCode:{
        type:String,
        required:[true, "Varified Code is required"]
    },
    varifiedCodeExpiry:{
        type:Date,
        required:[true, "Varified Code Expiry is required"]
    },
    isvarified:{
          type:Boolean,
        default:false
    },
    isAccessible:{
        type:Boolean,
        default:true
    },
    message:[messageSchema]

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel;