export default function HomeContent() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Welcome to 4 Seasons
        </h2>
        <p className="text-blue-200 text-lg mb-6">
          Your gateway to the Lineage 2 server experience
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="text-4xl mb-4">🔄</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Auto Updates
          </h3>
          <p className="text-blue-200 text-sm">
            Automatically download and install the latest game updates
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Fast Downloads
          </h3>
          <p className="text-blue-200 text-sm">
            High-speed downloads with resume capability
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-xl font-semibold text-white mb-2">Secure</h3>
          <p className="text-blue-200 text-sm">
            Verified and secure file downloads
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-xl font-semibold text-white mb-2">Community</h3>
          <p className="text-blue-200 text-sm">
            Join our vibrant gaming community
          </p>
        </div>
      </div>

      {/* Server Status */}
      <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 w-full max-w-md">
        <h3 className="text-xl font-semibold text-white mb-4">Server Status</h3>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-200">Server Online</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-blue-200 text-sm">
        <p>Ready to start your adventure?</p>
        <p className="text-xs mt-1 opacity-75">
          Use the navigation above to get started
        </p>
      </div>
    </div>
  );
}
