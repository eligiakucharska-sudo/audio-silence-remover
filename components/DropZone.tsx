
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function DropZone() {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [removed, setRemoved] = useState("");

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return;
    setLoading(true);

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/process", { method: "POST", body: formData });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);

    const removedSec = res.headers.get("X-Removed-Seconds") || "";
    setRemoved(removedSec);

    setLoading(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "audio/*": [] } });

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className="border-dashed border-2 p-8 text-center cursor-pointer">
        <input {...getInputProps()} />
        <p>Drag & drop your audio file here</p>
      </div>

      {loading && <p className="text-center text-blue-600">Processing...</p>}

      {removed && <p className="text-center text-green-600">Silence removed: {removed} sec</p>}

      {downloadUrl && (
        <div className="text-center">
          <a href={downloadUrl} download="processed.mp3" className="bg-blue-600 text-white px-4 py-2 rounded">
            Download
          </a>
        </div>
      )}
    </div>
  );
}
