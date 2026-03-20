"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as  z  from "zod"
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schema/signupSchema"
import axios,{AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import {Form ,FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Loader2} from "lucide-react"



export default function Page() {
    const [username,setusername] = useState('')
    const [usernameMessage,setusernameMessage] = useState('')
    const [CheckingUsername,setCheckingUsername] = useState(false)
    const [isSubmitting,setisSubmitting] = useState(false)
    const usernamedebouncedValue = useDebounceCallback(setusername, 300)

    const router = useRouter();

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver:zodResolver(signupSchema),
        defaultValues:{
            username:'',
            email:'',
            password:''
        }
    })

    useEffect(()=>{
        const CheckingUsernameUnique = async () =>{
            if (username) {
                setCheckingUsername(true)
                setusernameMessage('')
                
                try {
                    const usernameCheckingRequest = await axios.get(`/api/username-checking?username=${username}`)
                    const message = usernameCheckingRequest.data.message
                    setusernameMessage(message);
                } catch (error) {
                    const AxiosError = error as AxiosError<ApiResponse>;
                    const message = AxiosError.response?.data.message ?? "Error Checking Username";
                    setusernameMessage(message);
                }
                finally{
                    setCheckingUsername(false)
            }
            } 
        }
        CheckingUsernameUnique();
    },[username])

    const onSubmit = async (data:z.infer<typeof signupSchema>)=>{
        setisSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up',data);
            toast('The User is SignUp Successfully!',{
            description: response.data.message
            })
            router.replace(`/verify/${username}`)
             setisSubmitting(false);
             console.log('The User is SignUp Successfully!');
        } catch {
            console.log('Error in Signup of User');
             toast.error('Error in Signup of User')
              setisSubmitting(false);
        }

    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} onChange={(e)=>{
                    field.onChange(e)
                    usernamedebouncedValue(e.target.value)
                    }}/>
              </FormControl>
              {CheckingUsername && <Loader2 className="animate-spin" />}
              <p className={`text-sm ${usernameMessage === "username is unique!" ? 'text-green-700' : 'text-red-600'}`}>{usernameMessage}</p>
             <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field}/>
              </FormControl>
             <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field}/>
              </FormControl>
             <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting ? ( 
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    please wait
                    </>
            ) : ('Signup')
          }
        </Button>
      </form>
    </Form>

    <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
