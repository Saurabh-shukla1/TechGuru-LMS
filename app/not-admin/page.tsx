import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminPage() {
    return(
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="bg-destructive/10 rounded-full w-fit p-4 mx-auto">
                        <ShieldX className="size-16 text-destructive"/>
                    </div>
                    <CardTitle className="text-2xl">
                        Access Restricted
                    </CardTitle>
                    <CardDescription className="max-w-xs mx-auto">
                        You do not have permission to access this page. Please contact your administrator if you believe this is an error.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Link href="/" className={buttonVariants({
                        className: "w-full",
                    })}>
                        <ArrowLeft className="mr-1 size-4" />
                        Go back to home
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}