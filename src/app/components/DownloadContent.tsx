"use client";

import { useState, useEffect } from "react";

interface UpdateFile {
  name: string;
  size: string;
  version: string;
  description: string;
  date: string;
}

export default function DownloadContent() {
  const [files, setFiles] = useState<UpdateFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files");
      const data = await response.json();
      if (data.success) {
        setFiles(data.files);
      } else {
        console.error("Server error:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (filename: string) => {
    setDownloading(filename);
    try {
      const response = await fetch(
        `/api/download?file=${encodeURIComponent(filename)}`
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Server Status</h2>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-200">Server Online</span>
        </div>
      </div>

      {/* Available Updates */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          Available Updates
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-white mt-2 text-sm">Loading updates...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.name}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="mb-3">
                  <h4 className="text-lg font-semibold text-white mb-1">
                    Version {file.version}
                  </h4>
                  <p className="text-blue-200 text-sm mb-2">
                    {file.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Size: {file.size}</span>
                    <span>{file.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => downloadFile(file.name)}
                  disabled={downloading === file.name}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed text-sm"
                >
                  {downloading === file.name ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Downloading...
                    </div>
                  ) : (
                    "Download Update"
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-4 text-blue-200 text-xs">
        <p>Make sure to close Lineage 2 before installing updates</p>
      </div>
    </div>
  );
}
