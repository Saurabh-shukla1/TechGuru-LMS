"use client";
import { useCallback, useEffect, useState } from 'react';
import {FileRejection, useDropzone} from 'react-dropzone'
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from './RenderState';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useContructUrl } from '@/hooks/use-contruct-url';

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: "image";
}

interface iAppProps {
    value?: string;
    onChange?: (value: string) => void;
}

export function Uploader({value, onChange}: iAppProps) {
    const fileUrl = useContructUrl(value || "");

    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: "image",
        key: value,
        objectUrl: fileUrl
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

        await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.onprogress = (event) => {
                if(event.lengthComputable) {
                    const percentageCompleted = (event.loaded / event.total) * 100;
                    setFileState((prev) => ({
                        ...prev,
                        progress: Math.round(percentageCompleted),
                    }));
                }
            }

            xhr.onload = () => {
                if(xhr.status === 200 || xhr.status === 204) {
                    setFileState((prev) => ({
                        ...prev,
                        progress: 100,
                        uploading: false,
                        key: key,
                    }));

                    onChange?.(key);
                    toast.success("File uploaded successfully");
                    resolve();
                }
                else {
                    reject(new Error("Failed to upload file"));
                }
            };
            
            xhr.onerror = () => {
                reject(new Error("Error during file upload"));
            };

            xhr.open('PUT', presignedUrl);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.send(file);
            
        })
       } catch {
            setFileState((prev) => ({
                ...prev,
                uploading: false,
                progress: 0,
                error: true,
            }));
            toast.error("An error occurred while uploading the file");
        }

    }
    const onDrop = useCallback((acceptedFiles : File[]) => {
        if(acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }

            setFileState({
                file: file,
                id: uuidv4(),
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                isDeleting: false,
                fileType: "image",
            });
            uploadFile(file);
        }
    }, [fileState.objectUrl]);

    async function handleRemoveFile() {
        if(fileState.isDeleting || !fileState.objectUrl) return;
        try {
            setFileState((prev) => ({
                ...prev,
                isDeleting: true,
            }))

            const Response = await fetch('/api/s3/delete', {
                method: 'DELETE',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    key: fileState.key,
                }),
            });

            if(!Response.ok) {
                toast.error("Failed to delete file");

                setFileState((prev) => ({
                    ...prev,
                    isDeleting: true,
                    error: true,
                }));

                return;
            }

            if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }


            onChange?.("");


            setFileState(() => ({
                file: null,
                uploading: false,
                progress: 0,
                objectUrl: undefined,
                error: false,
                fileType: "image",
                id: null,
                isDeleting: false,
            }));

            toast.success("File deleted successfully");
        } catch {
            toast.error("Error deleting file");
            setFileState((prev) => ({
                ...prev,
                isDeleting: false,
                error: true,
            }));
        }
    }

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

    function renderContent() {
        if(fileState.uploading) {
            return(
                <RenderUploadingState
                    progress={fileState.progress}
                    file={fileState.file as File}
                />
            )
        }

        if(fileState.error) {
            return <RenderErrorState />;
        }

        if(fileState.objectUrl) {
            return (
               <RenderUploadedState
                   previewUrl={fileState.objectUrl}
                   handleRemoveFile={handleRemoveFile}
                   isDeleting={fileState.isDeleting}

               />
            );
        }

        return <RenderEmptyState isDragActive={isDragActive} />;
    }

    //prevent memory leaks by revoking object URL when component unmounts or file changes
    //this is important to avoid memory leaks in the browser
    useEffect(() => {
        return () => {
            if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }
        };
    }, [fileState.objectUrl]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5 MB
        onDropRejected: rejectedFiles,
        disabled: fileState.uploading || !!fileState.objectUrl,
    })
    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
            isDragActive ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary"
        )}>
            <CardContent className='flex items-center justify-center h-full w-full p-4'>
               <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    )
}