"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { Message } from "@/models/User"
import { X } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { ApiResponse } from "@/types/ApiResponse"

type MessageDeleteProp = {
  message:Message;
  onMessageDelete:(messageId: string) => void;
}

export default function MessageCard({message, onMessageDelete}:MessageDeleteProp) {

  const handleDelete = async () => {
    
   const response = await axios.delete<ApiResponse>(`/api/message-delete/${message._id}`);

    toast('Message Delete Successfully',{
      description:response.data.message
    }) 

      onMessageDelete(message._id as string)
  }

  // console.log(message.CreateAt);
  
  return (
    <div>

      <Card>
        <div className="flex justify-between">
      <CardHeader className="w-[50%]">
        <CardTitle className="font-bold text-lg">{message.content.length > 20 ? message.content.substring(0, 20) + "..." : message.content}</CardTitle>
        <CardDescription>{new Date(message.CreateAt).toLocaleString()}</CardDescription>
      </CardHeader>

             <AlertDialog >
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-5 h-5 p-5 mr-6"><X className="w-5 h-5" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
      <CardContent>
        {message.content.length > 20 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="p-0 h-auto">Read completely</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Full Feedback Message</DialogTitle>
                <DialogDescription>
                  Received on {new Date(message.CreateAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 p-4 text-sm bg-slate-100 dark:bg-slate-800 rounded-md whitespace-pre-wrap">
                {message.content}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
    </div>
  )
}
