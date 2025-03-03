"use client";

import { Button } from "@/components/ui/button";
import { CldUploadWidget, CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults } from "next-cloudinary";

interface CloudinaryWidgetProps {
    imageHandler: (images: string[]) => void;
    currentImages: string[];
}


const CloudinaryWidget = ({ imageHandler, currentImages }: CloudinaryWidgetProps) => {
    const handleSuccess = (e: CloudinaryUploadWidgetResults) => {
        const newImages = e.info as CloudinaryUploadWidgetInfo;
        console.log(`currentImages: ${currentImages}, newImages: ${newImages.public_id}`);
        imageHandler([...currentImages, newImages.public_id]);
    };

    return (
        <>
            <CldUploadWidget
                options={{
                    sources: [
                        "local",
                        "camera",
                        "dropbox",
                        "google_drive",
                        "url",
                        "unsplash",
                    ],
                }}
                signatureEndpoint="/api/sign-cloudinary-params"
                onSuccess={(e) => handleSuccess(e)}
            >
                {({ open }) => {
                    return <Button onClick={() => open()}>Upload Images</Button>;
                }}
            </CldUploadWidget>
        </>
    );
};

export default CloudinaryWidget;
