
import { z } from "zod";
export const courseLevels = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const courseStatus = ['Draft', 'Published', 'Archived'] as const;

export const courseCategories = ['Web Development', 'Data Science', 'Machine Learning', 'Mobile Development', 'Game Development'] as const;

export const courseSchema = z.object({
    title: z.string().min(3, {message: "Title must be at least 3 characters long"}).max(100, {message: "Max length Exceeded"}),
    description: z.string().min(3, {message: "Description must be at least 3 characters long"}).max(1000, {message: "Description must be at most 1000  characters long"}),
    fileKey: z.string().min(1, {message: "File key is required"}),

    price: z.number().min(1, { message: "Price must be positive number" }),
    duration: z.number()
    .min(1, { message: "Duration must be at least 1 hour" })
    .max(500, { message: "Duration must be at most 500 hours" }),

    

    level: z.enum(courseLevels, {message: "Level is required"}),
    category: z.enum(courseCategories, {message: "Category is required"}),
    smallDescription: z.string().min(3, {message: "Small description must be at least 3 characters long"}).max(200, {message: "Small description must be at most 200 characters long"}),
    slug: z.string().min(3, {message: "Slug must be at least 3 characters long"}),

    status: z.enum(courseStatus, {message: "Status is required"}),

});

export type CourseShemaType = z.infer<typeof courseSchema>;
