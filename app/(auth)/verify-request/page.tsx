"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";


const Page = () => {
    const router = useRouter();
    const params = useSearchParams();
    const [otp, setOtp] = useState("");
    const [emailPending, startTransition] = useTransition();
    const email = params.get("email") as string;
    const isOtpValid = otp.length === 6;
    

    const verifyOtp = () => {
        startTransition(async () => {
            await authClient.signIn.emailOtp({
                email: email,
                otp: otp,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Email verified successfully");
                        router.push("/");
                    },
                    onError: (error) => {
                        toast.error("Failed to verify email/otp");
                    }
                }
            })
        })
    }
    return (
        <Card className="w-full max-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Please check your email</CardTitle>
                <CardDescription>
                    We have sent you a verification email code to your email address. Please enter the code to verify your email.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-2">
                    <InputOTP 
                    value={otp} 
                    onChange={(value) => setOtp(value)} 
                    maxLength={6} 
                    className="gap-2">
                    <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    </InputOTPGroup>
                    </InputOTP>
                    <p className="text-sm text-muted-foreground">Enter the code sent to your email</p>
                </div>
                <Button
                disabled={emailPending || !isOtpValid}
                onClick={verifyOtp}
                className="w-full"
                >
                    {
                        emailPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            "Verify Request"
                        )
                    }
                </Button>
            </CardContent>
        </Card>
    )
}

export default Page;