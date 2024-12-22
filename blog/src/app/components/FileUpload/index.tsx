"use client";
import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { LuLink, LuLoader2, LuUpload, LuX } from "react-icons/lu";
import { MediaResponse } from "@/src/types";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Toast,
  useToast,
  VStack,
  HStack,
  Image,
  Text,
  IconButton,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";

interface FileUploadProps {
  folder?: string;
  onUploadComplete?: (media: MediaResponse) => void;
  maxSize?: number;
  acceptedFileTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  folder = "uploads",
  onUploadComplete,
  maxSize = 10485760,
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
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const uploadedImagesRef = useRef<{ [key: string]: string }>({});
  const toast = useToast({
    position: "top",
    status: "success",
    duration: 3000,
    isClosable: true,
  });

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

  const handleRemoveImage = (index: number) => {
    const removedImage = images[index];
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[removedImage.name];
      return newProgress;
    });
    URL.revokeObjectURL(uploadedImagesRef.current[removedImage.name]);
    delete uploadedImagesRef.current[removedImage.name];
  };

  const handleUpload = async () => {
    setUploading(true);
    setError(null);

    try {
      for (const file of images) {
        const signatureData = await getSignature();
        const cloudinaryData = await uploadToCloudinary(file, signatureData);
        const savedMedia = await saveToDatabase(cloudinaryData);
        onUploadComplete?.(savedMedia);
      }
      queryClient.invalidateQueries({
        queryKey: ["media"],
        refetchType: "active",
      });
      toast({
        title: "Media uploaded successfully",
      });
      setImages([]);
      setUploadProgress({});
    } catch (err) {
      toast({
        title: "Failed to upload file. Please try again.",
        status: "error",
      });
      console.error("Upload error:", err);
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    acceptedFiles.forEach((file) => {
      uploadedImagesRef.current[file.name] = URL.createObjectURL(file);
    });
    setImages((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedFileTypes.reduce(
      (acc, curr) => ({ ...acc, [curr]: [] }),
      {}
    ),
  });

  return (
    <Box mx={"auto"} h={"full"} w={"full"}>
      <VStack spacing={4} w="full">
        <VStack
          minH={"400"}
          justify={"center"}
          w="full"
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
              <VStack>
                <LuLoader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p>Uploading...</p>
              </VStack>
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
        </VStack>

        {images.length > 0 && (
          <VStack
            spacing={4}
            w="full"
            bg={"white"}
            px={3}
            py={4}
            rounded={"xl"}
            maxW={900}
          >
            {images.map((image, index) => (
              <HStack
                key={index}
                w="full"
                spacing={4}
                p={2}
                bg="gray.100"
                borderRadius="lg"
              >
                <Image
                  src={uploadedImagesRef.current[image.name]}
                  alt={`Thumbnail ${index + 1}`}
                  objectFit="cover"
                  boxSize="50px"
                  borderRadius="md"
                />
                <Text flex={1} isTruncated>
                  {image.name}
                </Text>
                <CircularProgress
                  value={uploadProgress[image.name] || 0}
                  size="40px"
                  color="blue.500"
                >
                  <CircularProgressLabel>
                    {uploadProgress[image.name] || 0}%
                  </CircularProgressLabel>
                </CircularProgress>
                <Text>{(image.size / 1024).toFixed(2)} KB</Text>
                <IconButton
                  aria-label="remove image"
                  colorScheme="red"
                  size={"xs"}
                  rounded={"full"}
                  isDisabled={uploading}
                  onClick={() => handleRemoveImage(index)}
                >
                  <LuX />
                </IconButton>
              </HStack>
            ))}
            <Button
              colorScheme="blue"
              onClick={handleUpload}
              rounded={"full"}
              isLoading={uploading}
              loadingText="Uploading..."
            >
              Upload Files
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

interface UrlUploadProps {
  folder?: string;
  onUploadComplete?: (media: MediaResponse) => void;
}

export const FileUrlUpload: React.FC<UrlUploadProps> = ({
  folder = "uploads",
  onUploadComplete,
}) => {
  const toast = useToast({
    position: "top",
    status: "success",
    duration: 3000,
    isClosable: true,
  });
  const [url, setUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setUploading(true);
    setError(null);

    try {
      const { data, status } = await axios.post("/api/upload/url", {
        url,
        folder,
        filename: filename || undefined,
      });

      if (status !== 200) throw new Error("Upload failed");

      const result = data;
      onUploadComplete?.(result);
      setUrl("");
      setFilename("");
      toast({ title: "Uploaded successfully" });
    } catch (err) {
      setError("Failed to upload from URL. Please try again.");
      toast({
        title: "Failed to upload from URL. Please try again.",
        status: "error",
      });
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormControl isRequired>
          <FormLabel htmlFor="url" fontSize={"small"} color="'gray.700">
            Image URL
          </FormLabel>
          <Input
            id="url"
            rounded={"full"}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            isDisabled={uploading}
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize={"small"} htmlFor="filename" color="'gray.700">
            Custom Filename (optional)
          </FormLabel>
          <Input
            rounded={"full"}
            id="filename"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="custom-filename"
            isDisabled={uploading}
          />
        </FormControl>

        <Button
          rounded={"full"}
          type="submit"
          isDisabled={uploading || !url}
          className="w-full"
        >
          {uploading ? (
            <>
              <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <LuLink className="mr-2 h-4 w-4" />
              Upload from URL
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
