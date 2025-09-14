"use client";

import { useState, useEffect } from "react";

interface UpdateFile {
  name: string;
  size: string;
  version: string;
  description: string;
  date: string;
}

export default function DownloadPage() {
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
        // You could show an error message to the user here
      }
    } catch (error) {
      console.error("Failed to fetch files:", error);
      // You could show an error message to the user here
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

      // Create a blob from the response
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Cleanup
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
    <div className="min-h-screen relative">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Lineage 2 Server Updater
          </h1>
          <p className="text-xl text-blue-200 mb-8">
            Download the latest updates for your Lineage 2 client
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Server Status
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-200">Server Online</span>
            </div>
          </div>
        </div>

        {/* Files List */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Available Updates
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white mt-4">Loading updates...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Version {file.version}
                    </h3>
                    <p className="text-blue-200 text-sm mb-3">
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
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {downloading === file.name ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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
        <div className="text-center mt-16 text-blue-200">
          <p className="text-sm">
            Make sure to close Lineage 2 before installing updates
          </p>
          <p className="text-xs mt-2 opacity-75">
            If you encounter any issues, contact the server administrator
          </p>
        </div>
      </div>
    </div>
  );
}
