"use client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export default function Home() {
  const router = useRouter();
  const { 
        data: session, 
    } = authClient.useSession() 

    const signOut = async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/"); // redirect to home page
            toast.success("Successfully signed out");
          },
        },
      });
    }
  return (
    <div>
      <ThemeToggle />
      <div>
        {
          session ? (
            <div>
              <span>{session.user.name}</span>
              <Button onClick={signOut}>Sign Out</Button>
            </div>
          ) : (
            <Button onClick={() => router.push("/login")}>Sign in</Button>
          )
        }
      </div>
    </div>
  );
}
