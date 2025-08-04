import { env } from "@/lib/env";
import { PutObjectCommand} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import z, { boolean } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3 from "@/lib/s3Client";
 

export const fileUploadSchema = z.object({
    fileName: z.string().min(1,{ message: "File name is required"}),
    contentType: z.string().min(1, { message: "Content type is required" }),
    size: z.number().min(1, { message: "File size must be greater than 0" }),
    isImage: z.boolean(),
})

export async function POST(request: Request) {
    

    try {
        const body = await request.json();

        const validation = fileUploadSchema.safeParse(body);

        if(!validation.success){
            return NextResponse.json(
                {error: "Invalid Request Body"},
            )
        }

        const { fileName, contentType, size, isImage } = validation.data;

        const uniqueKey = `${uuidv4()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            ContentType: contentType,
            ContentLength: size,
            Key: uniqueKey
        });

        const presignedUrl = await getSignedUrl(S3, command, {
            expiresIn: 360, // URL valid for 6 min
        })

        const response = {
            presignedUrl,
            key: uniqueKey,
        }

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to generate presigned URL" },
            { status: 500 }
        );
    }
}