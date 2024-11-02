"use client";

import { FileUpload, FileUrlUpload } from "./components/FileUpload";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <FileUpload
        onUploadComplete={(media) => {
          console.log({ media });
        }}
      />
      <FileUrlUpload
        onUploadComplete={(media) => {
          console.log("url:", media);
        }}
      />
    </main>
  );
}
