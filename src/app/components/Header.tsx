interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-6 border-b border-white/20">
      {/* Logo space */}
      <div className="flex items-center space-x-4">
        <div
          className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity duration-200"
          onClick={() => onTabChange("home")}
        >
          <img
            src="/images/logo.png"
            alt="4 Seasons Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-white text-xl font-semibold">4 Seasons</h1>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-6 cursor-pointer">
        <button
          onClick={() => onTabChange("home")}
          className={`transition-colors duration-200 font-medium cursor-pointer ${
            activeTab === "home"
              ? "text-blue-300 border-b-2 border-blue-300"
              : "text-white hover:text-blue-300"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onTabChange("download")}
          className={`transition-colors duration-200 font-medium cursor-pointer ${
            activeTab === "download"
              ? "text-blue-300 border-b-2 border-blue-300"
              : "text-white hover:text-blue-300"
          }`}
        >
          Download
        </button>
        <button
          onClick={() => onTabChange("news")}
          className={`transition-colors duration-200 font-medium cursor-pointer ${
            activeTab === "news"
              ? "text-blue-300 border-b-2 border-blue-300"
              : "text-white hover:text-blue-300"
          }`}
        >
          News
        </button>
      </nav>
    </header>
  );
}
