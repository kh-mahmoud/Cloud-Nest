"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CreateAccount, signInUser } from "@/lib/actions/user.action"
import OTPModal from "./OTPModal"



type AuthFormProps = {
  type: 'sign-in' | 'sign-up';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [isLoading, setisLoading] = useState(false)
  const [AccountId, setAccountId] = useState()

  const formSchema = z.object({
    fullName: type == "sign-up" ? z.string().min(2).max(50) : z.string().optional(),
    email: z.string().email(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: ""
    },
  })

  form.watch("email")
  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    setisLoading(true)
    try {
      const user = type=="sign-up" ?
      
      await CreateAccount({
        fullName: values.fullName || '',
        email: values.email
      }
      ) :
      
      await signInUser(values.email)
      setAccountId(user.accountId)

    } catch (error) {
      console.log(error)
    } finally {
      setisLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">{type == "sign-in" ? "Sign In" : "Sign Up"}</h1>
          {type == "sign-up" &&
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input className="shad-input" placeholder="Enter your full name" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          }
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input className="shad-input " placeholder="Enter your email" {...field} />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} className="shad-submit-btn" type="submit">
            {isLoading ?
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                height={24}
                width={24}
                className="animate-spin"

              />
              :
              type == "sign-in" ? "Sign In" : "Sign Up"
            }
          </Button>

          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type == "sign-in" ? "Don't have an account? " : "Already have an account? "}
            </p>
            <Link href={type == "sign-in" ? "/sign-up" : "/sign-in"}>
              &nbsp;
              {type == "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>
      {AccountId && <OTPModal email={form.getValues("email")} accountId={AccountId} />}
    </>
  );
}

export default AuthForm;
