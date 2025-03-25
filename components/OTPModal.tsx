'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from "next/image";
import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "./ui/button";
import { sendEmailOtp, verifyOtp } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";



type ModalProps = {
  email: string
  accountId: string
}

const OTPModal = ({ email, accountId }: ModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {

    try {
      e.preventDefault()
      setLoading(true)

      //verify otp and create session
      const sessionId = await verifyOtp(accountId, password)

      if (sessionId) router.push("/")


    } catch (error) {
      console.log("failed to verify", error)
    }

    setLoading(false)

  }

  const handleResendOtp = async () => {
    await sendEmailOtp(email)
  }

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="shad-alert-dialog">
          <AlertDialogHeader className="flex justify-center relative">
            <AlertDialogTitle className="h2 text-center">
              Enter your OTP
              <Image className="absolute right-0 top-0 cursor-pointer" src={"/assets/icons/close-dark.svg"} alt="close" width={20} height={20} onClick={() => setIsOpen(false)} />
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center subtitle-2 text-light-200">
              We've sent you an OTP to {" "} <span className="pl-1 text-brand">{email}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <InputOTP value={password} onChange={setPassword} maxLength={6}>
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot index={0} className="shad-otp-slot" />
              <InputOTPSlot index={1} className="shad-otp-slot" />
              <InputOTPSlot index={2} className="shad-otp-slot" />
              <InputOTPSlot index={3} className="shad-otp-slot" />
              <InputOTPSlot index={4} className="shad-otp-slot" />
              <InputOTPSlot index={5} className="shad-otp-slot" />
            </InputOTPGroup>
          </InputOTP>

          <AlertDialogFooter >
            <div className="flex flex-col w-full">
              <AlertDialogAction className="shad-submit-btn h-12" type="button" onClick={handleSubmit}>
                {loading ?
                  <Image
                    src={"assets/icons/loader.svg"}
                    alt="loader"
                    width={24}
                    height={24}
                    className="animate-spin"
                  /> :
                  "Submit"
                }
              </AlertDialogAction>

              <div className="subtitle-2 mt-2 text-center text-light-100">
                Didn't get the code?
                <Button variant="link" className="pl-1 text-brand" onClick={handleResendOtp}>
                  Click to resend
                </Button>
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

export default OTPModal;
