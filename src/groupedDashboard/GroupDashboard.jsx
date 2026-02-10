import { useEffect } from "react";

const GroupedDashboardPage = () => {
  useEffect(() => {
    // Automatically open the dashboard in a new tab
    window.open("https://horizondashboard.vibecopilot.ai/", "_blank");
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Grouped Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The dashboard has been opened in a new tab.
        </p>
        <button
          onClick={() => window.open("https://horizondashboard.vibecopilot.ai/", "_blank")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Dashboard Again
        </button>
      </div>
    </div>
  );
};

export default GroupedDashboardPage;
