"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponseProps } from "@/lib/types";
import { courseSchema, CourseShemaType } from "@/lib/zodSchema";
import { headers } from "next/headers";

export async function CreateCourse(values: CourseShemaType): Promise<ApiResponseProps> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

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