"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";

interface Props {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
}

export const ImageUpload = ({ onChange, value, endpoint }: Props) => {
  if (value) {
    return (
      <div className="relative size-40">
        <img src={value} alt="upload" className="rounded-md size-40 object-cover" />
        <button className="absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm"
          onClick={() => onChange("")}
          type="button"
        >
          <XIcon className="size-4 text-white"/>
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  )
}
