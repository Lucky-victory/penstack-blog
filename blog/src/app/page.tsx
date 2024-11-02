"use client";

import { FileUrlUpload } from "./components/FileUpload";
import Medias from "./components/Medias";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <FileUrlUpload
        onUploadComplete={(media) => {
          console.log("url:", media);
        }}
      />
      <Medias />
    </main>
  );
}
