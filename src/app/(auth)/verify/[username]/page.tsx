"use client"

import { Button } from "@/components/ui/button";
import {Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { varifySchema } from "@/schema/varifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function Page() {
    const route = useRouter();
    const param = useParams<{username:string}>();

    const form = useForm<z.infer<typeof varifySchema>>({
        resolver:zodResolver(varifySchema)
    })

    const onSubmit = async (data:z.infer<typeof varifySchema>)=>{
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`,{
                username: param.username,
                verifyCode:data.code
            });
            
            if(response.data.message === "User Verification Successfully!"){
                 toast("User Verification Successfully",{
                description:response.data.message
            })

            route.replace('/sign-in');
            }else if(response.data.message === "Wrong Verification Code"){
                     toast("Wrong Verification Code",{
                         description:response.data.message
                    })
            }else if(response.data.message === "Your Code is Expire.Please SignUp Again!"){
                     toast("Your Code is Expire",{
                         description:response.data.message
                    })
            }

        } catch (error) {
              const axiosError = error as AxiosError<ApiResponse>;
      toast("Verification Failed",{
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.'
      });
        }
    }

  return (
     <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
