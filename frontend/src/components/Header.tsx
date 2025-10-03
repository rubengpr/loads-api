export default function Header() {
  return (
    <header className="w-full mb-8 relative px-5 py-3 rounded-lg bg-gradient-to-b from-black via-gray-900 to-black shadow-2xl">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 p-[2px]">
        <div className="w-full h-full rounded-lg bg-gradient-to-b from-neutral-800 via-black to-neutral-800"></div>
      </div>

      <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-transparent via-white/5 to-white/10"></div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  src="/happyrobot-logo-white.svg"
                  alt="HappyRobot Logo"
                  className="h-11 w-auto"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-medium tracking-tight text-gray-900 dark:text-gray-50">
                  AI Agent Inbound Carrier Sales Metrics
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                  Real-time insights and analytics for your logistics operations
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Live Data
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-500">
                  Last updated
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Just now
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Status */}
          <div className="mt-4 lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Live Data
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Last updated: Just now
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
