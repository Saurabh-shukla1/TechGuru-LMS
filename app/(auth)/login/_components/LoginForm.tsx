"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export const LoginForm = () => {
    const [githubPending, startGithubPending] = useTransition();


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
                        <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                    <Button className="w-full" variant="outline">
                        Continue with Email
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};