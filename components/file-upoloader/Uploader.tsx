"use client";
import { useCallback, useState } from 'react';
import {FileRejection, useDropzone} from 'react-dropzone'
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { RenderEmptyState } from './RenderState';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: "image" | "video"
}

export function Uploader() {

    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: "image",
    });
    async function uploadFile(file: File) {
       setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
       }));

       try {
        //preseigned URL request
        const preseignedResponse = await fetch('/api/s3/upload', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                fileName: file.name,
                contentType: file.type,
                size: file.size,
                isImage: true, // Assuming all files are images for this example
            }),
        });

        if(!preseignedResponse.ok) {
            toast.error("Failed to get presigned URL");
            setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true,
                }));
                return;
        }

        const { presignedUrl, key } = await preseignedResponse.json();

        await new Promise((resolve, reject) => {

        })
       } catch (error) {
        
       }

    }
    const onDrop = useCallback((acceptedFiles : File[]) => {
        if(acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            setFileState({
                file: file,
                id: uuidv4(),
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                isDeleting: false,
                fileType: "image",
            })
        }
    }, [])

    function rejectedFiles(fileRejections: FileRejection[]) {
        if(fileRejections.length){
            const tooManyFiles = fileRejections.find((rejection) => rejection.errors[0].code === 'too-many-files');
            const fileTooLarge = fileRejections.find((rejection) => rejection.errors[0].code === 'file-too-large');
            if(fileTooLarge) {
                toast.error("File is too large. Maximum size is 5MB.");
            }

            if(tooManyFiles) {
                toast.error("You can only upload one file at a time.");
            }
        }
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5 MB
        onDropRejected: rejectedFiles,
    })
    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
            isDragActive ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary"
        )}>
            <CardContent className='flex items-center justify-center h-full w-full p-4'>
               <input {...getInputProps()} />
                <RenderEmptyState isDragActive={isDragActive} />
            </CardContent>
        </Card>
    )
}