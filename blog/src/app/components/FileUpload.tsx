"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { LuLoader2, LuUpload } from "react-icons/lu";
import { MediaResponse } from "@/src/types";
import axios from "axios";
import { Toast } from "@chakra-ui/react";

interface FileUploadProps {
  folder?: string;
  onUploadComplete?: (media: MediaResponse) => void;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  folder = "uploads",
  onUploadComplete,
  maxSize = 10485760, // 10MB default
  acceptedFileTypes = [
    "image/*",
    "video/*",
    "audio/*",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ],
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSignature = async () => {
    const response = await fetch(`/api/upload/signature?folder=${folder}`);
    return response.json();
  };

  const uploadToCloudinary = async (file: File, signatureData: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", signatureData.timestamp.toString());
    formData.append("signature", signatureData.signature);
    formData.append("folder", folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    return await response.json();
  };

  const saveToDatabase = async (cloudinaryData: any) => {
    const response = await axios.post("/api/upload", cloudinaryData);

    return response.data;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      setError(null);

      try {
        for (const file of acceptedFiles) {
          const signatureData = await getSignature();
          const cloudinaryData = await uploadToCloudinary(file, signatureData);
          const savedMedia = await saveToDatabase(cloudinaryData);
          onUploadComplete?.(savedMedia);
        }
      } catch (err) {
        setError("Failed to upload file. Please try again.");
        console.error("Upload error:", err);
      } finally {
        setUploading(false);
      }
    },
    [folder, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedFileTypes.reduce(
      (acc, curr) => ({ ...acc, [curr]: [] }),
      {}
    ),
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <>
              <LuLoader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p>Uploading...</p>
            </>
          ) : (
            <>
              <LuUpload className="h-8 w-8 text-gray-400" />
              <p>Drag & drop files here, or click to select files</p>
              <p className="text-sm text-gray-500">
                Maximum file size: {(maxSize / 1024 / 1024).toFixed(0)}MB
              </p>
            </>
          )}
        </div>
      </div>

      {error && <Toast title={error} />}
    </div>
  );
};
export const FileUploadUrl = () => {};
