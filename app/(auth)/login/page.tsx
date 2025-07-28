import { auth } from "@/lib/auth";
import { LoginForm } from "./_components/LoginForm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";



const Page = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(session) {
        return redirect("/"); // Redirect to home if already logged in
    }

    return <LoginForm />
}

export default Page;