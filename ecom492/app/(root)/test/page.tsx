"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

const TestPage = () => {
  const [fileList, setFileList] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(file.size)
      setFileList([...fileList, file]);
    } else {
      console.log("No file selected");
    }
  };
  return (
    <div className="">
      <h1 className="text-3xl">Test Page</h1>
      <div className="flex gap-5 mt-5">
        <Input
          type="file"
          required
          min={1}
          accept="image/png, image/jpeg"
          onChange={handleChange}
        />
      </div>
      <div className="flex gap-5 mt-5">
        <ul>
          {fileList.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestPage;
