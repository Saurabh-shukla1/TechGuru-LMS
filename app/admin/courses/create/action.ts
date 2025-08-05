"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponseProps } from "@/lib/types";
import { courseSchema, CourseShemaType } from "@/lib/zodSchema";
import { request } from "@arcjet/next";


const aj = arcjet.withRule(
        detectBot({
            mode: "LIVE",
            allow: [],
        })
    )
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5,
        })
    );

export async function CreateCourse(values: CourseShemaType): Promise<ApiResponseProps> {

    
    const session = await requireAdmin();
    try {

        const req = await request()
        const decision = await aj.protect(req, {
            fingerprint: session?.user.id as string,
        });

        if (decision.isDenied()) {
            if(decision.reason.isRateLimit()){
                return {
                    status: "error",
                    message: "You have been blocked due to too many requests. Please try again later.",
                }
            }
            else{
                return {
                    status: "error",
                    message: "You are a bot! if you are not a bot, please contact support.",
                };
            }
        }

        if (!session?.user) {
            return {
                status: "error",
                message: "Unauthorized",
            };
        }

        const validation = courseSchema.safeParse(values);

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid course data",
            };
        }

        const data = await prisma.course.create({
            data: {
                ...validation.data,
                userId: session.user.id as string,
            }
        });

        // Return success response
        return {
            status: "success",
            message: "Course created successfully",
        };

    } catch (error) {
        console.log("Error creating course:", error);
        return {
            status: "error",
            message: "Failed to create course",
        };
    }
}