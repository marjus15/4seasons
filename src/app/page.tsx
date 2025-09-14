"use client";

import { useState } from "react";
import Header from "./components/Header";
import HomeContent from "./components/HomeContent";
import DownloadContent from "./components/DownloadContent";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeContent />;
      case "download":
        return <DownloadContent />;
      case "news":
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">News</h2>
              <p className="text-blue-200">News content coming soon...</p>
            </div>
          </div>
        );
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Glass effect box */}
      <div className="w-160 h-220 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex flex-col">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        {/* Main content area */}
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
