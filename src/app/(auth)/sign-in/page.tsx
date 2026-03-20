"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as  z  from "zod"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {Form ,FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Loader2} from "lucide-react"
import { signinSchema } from "@/schema/signinSchema"
import { signIn } from "next-auth/react"


export default function Page() {

    const [isSubmitting,setisSubmitting] = useState(false)

    const router = useRouter();

    const form = useForm<z.infer<typeof signinSchema>>({
        resolver:zodResolver(signinSchema),
        defaultValues:{
            identifier:'',
            password:''
        }
    })


    const onSubmit = async (data:z.infer<typeof signinSchema>)=>{
      setisSubmitting(true)
          const result = await signIn('credentials',{
            redirect:false,
            identifier:data.identifier,
            password:data.password
          })

          if(result?.error){
            toast("Login faild!",{
              description:"Incorrect Email or Password!"
            })
          }

          if(result?.url){
            router.replace('/dashboard')
            toast("Successfully Login",{
              description:"Welcome to the Dashboard!"
            })


          }

          setisSubmitting(false)

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
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username/Email</FormLabel>
              <FormControl>
                <Input placeholder="Username/Email" {...field}/>
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
            ) : ('Login')
          }
        </Button>
      </form>
    </Form>

    <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
