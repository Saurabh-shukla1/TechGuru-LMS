import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import S3 from "@/lib/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


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


export async function DELETE(request: Request) {

    const session = await requireAdmin();

    try {

        const decision = await aj.protect(request,{
            fingerprint: session?.user.id as string,
        });

        if(decision.isDenied()){
            return NextResponse.json(
                {
                    error: "Request Denied",
                },
                {
                    status: 429,//429 Too Many Requests
                }
            )
        }

        const body = await request.json();

        const key = body.key;

        if (!key) {
            return NextResponse.json(
                { error: "Invalid or missing Object Key" },
                { status: 400 }
            );
        }


        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: key,
        });

        await S3.send(command);

        return NextResponse.json(
            { message: "File deleted successfully" },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            { error: "Failed to delete file" },
            { status: 500 }
        );
    }
}