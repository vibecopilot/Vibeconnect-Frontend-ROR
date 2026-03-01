import { useEffect } from "react";

const GroupedDashboardPage = () => {
  const readLS = (key) => {
    const raw = localStorage.getItem(key);
    if (raw == null) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  };

  const syncAndOpenHorizon = () => {
    // 1. Identify what you want to send
    const token = readLS("TOKEN") ?? readLS("token");
    const userDetails = readLS("user_details") ?? readLS("user");
    const activeSite = readLS("active_site") ?? readLS("SITEID");

    // 2. Prepare the URL
    const baseUrl = "http://localhost:8080";
      // "https://horizondashboard.vibecopilot.ai";
    
      const url = new URL(baseUrl);

    // Only add to URL if the data exists
    if (token) url.searchParams.set("t", String(token));
    if (userDetails) {
      url.searchParams.set(
        "u",
        typeof userDetails === "string" ? userDetails : JSON.stringify(userDetails)
      );
    }
    if (activeSite) url.searchParams.set("s", String(activeSite));

    // 3. Redirect
    window.location.replace(url.toString());
  };

  useEffect(() => {
    syncAndOpenHorizon();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">Redirecting to Horizon</h2>
        <p className="text-gray-400 mb-6">Syncing your session data...</p>
        <button
          onClick={syncAndOpenHorizon}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Click here if not redirected
        </button>
      </div>
    </div>
  );
};

export default GroupedDashboardPage;