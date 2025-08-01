"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export const LoginForm = () => {
    const router = useRouter();
    const [githubPending, startGithubPending] = useTransition();
    const [emailPending, startEmailTransition] = useTransition();
    const [email, setEmail] = useState("");


    const signInWithGithub = async () => {
        startGithubPending(async () => {
            await authClient.signIn.social({
            provider: "github",
            callbackURL: "/",
            fetchOptions:{
                onSuccess: () => {
                   toast.success("Successfully signed in with Github"); 
                },
                onError: (error) => {
                    toast.error("Internal Server Error");
                }
            }
        })
    })
    }

    const signInWithEmail = async () => {
        startEmailTransition( async () => {
           await authClient.emailOtp.sendVerificationOtp({
            email: email,
            type: 'sign-in',
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Verification code sent to your email");
                    router.push(`/verify-request?email=${encodeURIComponent(email)}`);  
                },
                onError: (error) => {
                    toast.error("Failed to send verification code");
                }
           }})
        })
    }
    return (
     <Card>
            <CardHeader>
                <CardTitle className="test-xl">Welcome Back</CardTitle>
                <CardDescription>Login With Github</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Button 
                className="w-full" 
                variant="outline"
                disabled={githubPending}
                onClick={signInWithGithub}
                >
                   {
                    githubPending ? (
                        <>
                            <Loader className="size-4 animate-spin"/>
                        </>
                    ):
                    <>
                     <GithubIcon className="size-4" />
                     Sign in with Github
                   </>
                   }
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground"> 
                        Or continue with
                    </span>
                </div>
                <div className="grid gap-2">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        id="email" 
                        type="email" 
                        placeholder="you@example.com"
                        required
                        />
                    </div>
                    <Button 
                    className="w-full"
                    disabled={emailPending}
                    onClick={signInWithEmail}
                    >
                        {
                            emailPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin"/>
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="size-4" />
                                    <span>Continue with Email</span>
                                </>
                            )
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};