"use client"

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignOut = () => {
    const router = useRouter(); 
    const handleSignOut = async function signOut() {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/"); // redirect to home page
            toast.success("Successfully signed out");
          },
          onError: () => {
            toast.error("Failed to sign out");
          }
        },
      });
    }
    return handleSignOut;
}