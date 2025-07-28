import { BreadcrumbLink } from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
       <div className="relative flex min-h-svh flex-col items-center justify-center">
        <Link href="/" className={buttonVariants({
            variant: 'outline',
            className: "absolute top-4 left-4"
        }
        )}>
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Link>
         <div className="flex w-full max-w-sm flex-col gap-6">
            <Link 
            href="/" 
            className="text-center flex gap-2 self-center font-bold">
                <Image
                    src="/logo.svg"
                    alt="TechGuru LMS"
                    width={32}
                    height={32}
                />
                TechGuru LMS
            </Link>
            {children}
        </div>
        <div className="text-balance text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our <span className="hover:text-primary hover:underline">Terms of Service</span>
            {" "} 
            and <span className="hover:text-primary hover:underline">Privacy Policy</span>.
        </div>
       </div>
    )
}