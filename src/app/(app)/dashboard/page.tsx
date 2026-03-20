"use client"

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { toast } from "sonner";



export default function Page() {
  const [messages,setMessages] = useState<Message[]>([]);
  const [isLoading,setisLoading] = useState(false);
  const [isSwiching,setisSwiching] = useState(false)
  const [profileUrl, setProfileUrl] = useState('');

  const handleDelete = (messageId:string)=>{
    setMessages(messages.filter(message => message._id !== messageId));
  }

  const {data:session} = useSession();

  // console.log(session.user);
  

    const form = useForm({
      resolver:zodResolver(acceptMessageSchema) 
    })

    const {watch,setValue} = form;

    const acceptMessages = watch('acceptMessages');

    const fetchData = useCallback(async ()=>{
      setisSwiching(true)
      try {
        const response = await axios.get('/api/accept-message');
        setValue('acceptMessages', response.data.isAcceptanceMessages)

        toast("");
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
         toast("Error Status Show!",{
            description: axiosError.response?.data.message || "Failed Message Status"
      });
      }finally{
        setisSwiching(false);
      }
    },[setValue])


    const fatchMessage = useCallback(async (refresh:boolean = false)=>{
      try {
        setisSwiching(false)
        setisLoading(true)
        const response = await axios.get<ApiResponse>('/api/get-messages')
        console.log(response);
        
        setMessages(response.data.messages || []);

        if(refresh){
          toast("Messages Refresh")
        }

      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>
         toast("Error Messages Fetching!",{
            description: axiosError.response?.data.message || "Resquest Failed Message"
      });
      }finally{
         setisSwiching(false)
        setisLoading(false)
      }
    },[setisLoading,setMessages])

    useEffect(()=>{
      if(!session || !session.user) return
      fatchMessage();
      fetchData();
    },[session,setValue,fatchMessage,fetchData])

    const { username } = (session?.user as User) || {};

    useEffect(() => {
      if (typeof window !== 'undefined' && username) {
        const protocol = `${window.location.protocol}//${window.location.host}`;
        setProfileUrl(`${protocol}/u/${username}`);
      }
    }, [username]);

    const handleSwitch = async(checked: boolean)=>{
      try {
        const response = await axios.post<ApiResponse>('/api/accept-message',{
          acceptMessages: checked
        })
        setValue('acceptMessages', checked);
        toast(response.data.message);
      } catch (error) {

          const axiosError = error as AxiosError<ApiResponse>
         toast("Messages Switching Error",{
            description: axiosError.response?.data.message || "Resquest Failed For Swiching!"
      });

      }
    }

    
    const copyToClipboard = ()=>{
      navigator.clipboard.writeText(profileUrl);
      toast("Profile URL Successfully Copied")
    }

    if(!session || !session.user){
        return <div>Please Login First</div>
    }

  return (
     <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          checked={acceptMessages}
          onCheckedChange={handleSwitch}
          disabled={isSwiching}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fatchMessage(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDelete}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

