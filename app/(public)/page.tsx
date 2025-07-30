
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface featuresProps {
    title: string;
    description: string;
    icon: string;
}

const features: featuresProps[] = [
    {
        title: "Comprehensive Courses",
        description: "Access a wide range of courses covering various subjects, from programming to design.",
        icon: "📚",
    },
    {
        title: "Interactive Learning",
        description: "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
        icon: "🖥️",
    },
    {
        title: "Flexible Scheduling",
        description: "Learn at your own pace with flexible scheduling options that fit your lifestyle.",
        icon: "⏰",
    },
    {
        title: "Progress Tracking",
        description: "Track your progress with detailed analytics and insights to help you stay on track.",
        icon: "📈",
    }
]


export default function Home() {
  
  return (
    <>
    <section className="relative py-20">
        <div className="flex flex-col items-center justify-center space-y-4">
            <Badge
            variant="outline"
            >
                The Future of online Learning
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Elevate your Learning Experience</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-2xl">Discover a new way to learn online with our modern, interactive learning platform. Access high-quality courses anytime, anywhere.</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link 
                className={buttonVariants({
                    variant: "default",
                    size: "lg",
                })} href="/courses">Explore Courses</Link>

                <Link 
                className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                })} href="/login">Sign-in</Link>
            </div>
        </div>
    </section>

    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
            </Card>
        ))}
    </section>
    </>
  );
}
