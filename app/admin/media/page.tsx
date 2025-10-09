// app/admin/media/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  X,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { deleteMedia, getMedia, uploadFiles } from "@/app/lib/api";

type MediaItem = {
  filename: string;
  url: string;
  resource_type: "image" | "video";
};
type Toast = { type: "success" | "error"; message: string };

export default function AdminMediaPage() {
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [images, setImages] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const data: MediaItem[] = await getMedia();
      setVideos(data.filter((item) => item.resource_type === "video"));
      setImages(data.filter((item) => item.resource_type === "image"));
    } catch (error) {
      console.error(error);
      setToast({ type: "error", message: "Failed to fetch media." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (
    filesToUpload: File[],
    type: "video" | "images"
  ) => {
    if (filesToUpload.length === 0) return;
    setIsUploading(true);
    try {
      await uploadFiles(filesToUpload, "factory");
      await fetchMedia();
      setToast({
        type: "success",
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`,
      });
      if (type === "video") setVideoFile(null);
      if (type === "images") setImageFiles([]);
    } catch (error) {
      console.error(error);
      setToast({ type: "error", message: "Upload failed." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (
      window.confirm("Are you sure you want to delete this file permanently?")
    ) {
      try {
        await deleteMedia("factory", filename);
        await fetchMedia();
        setToast({ type: "success", message: "File deleted successfully." });
      } catch (error) {
        console.error(error);
        setToast({ type: "error", message: "Failed to delete file." });
      }
    }
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-1/2 z-50 flex items-center gap-3 p-4 rounded-lg shadow-2xl ${
              toast.type === "success"
                ? "bg-brand-green-dark text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.type === "success" ? <CheckCircle /> : <AlertTriangle />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-4">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-bold text-brand-green-dark mb-6">
        Manage Homepage Media
      </h1>
      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Video /> Upload Homepage Video
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setVideoFile(e.target.files ? e.target.files[0] : null)
              }
              className="w-full p-2 border rounded"
            />
            <button
              onClick={() => videoFile && handleUpload([videoFile], "video")}
              disabled={isUploading || !videoFile}
              className="bg-brand-green-dark text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-green-light transition-colors disabled:opacity-50 flex-shrink-0"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ImageIcon /> Upload Homepage Images
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setImageFiles(e.target.files ? Array.from(e.target.files) : [])
              }
              className="w-full p-2 border rounded"
            />
            <button
              onClick={() => handleUpload(imageFiles, "images")}
              disabled={isUploading || imageFiles.length === 0}
              className="bg-brand-green-dark text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-green-light transition-colors disabled:opacity-50 flex-shrink-0"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Homepage Video</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : videos.length > 0 ? (
            videos.map((item) => (
              <div key={item.filename} className="relative max-w-lg">
                <video src={item.url} controls className="w-full rounded-lg" />
                <button
                  onClick={() => handleDelete(item.filename)}
                  className="absolute top-2 right-2 text-white bg-red-600 p-1.5 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No homepage video uploaded.
            </p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Homepage Images</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.length > 0 ? (
                images.map((item) => (
                  <div
                    key={item.filename}
                    className="relative aspect-square rounded-lg overflow-hidden group"
                  >
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(item.filename)}
                        className="text-white text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No homepage images uploaded.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
