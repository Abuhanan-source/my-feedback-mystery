import { Message } from "@/models/User";

export interface ApiResponse {
    success:boolean;
    message:string;
    isAccessible?:boolean;
    messages?:Array<Message>
}