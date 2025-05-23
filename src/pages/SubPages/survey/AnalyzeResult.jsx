import React from "react";

function AnalyzeResult() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">EXPORTS</h2>
          <button className="text-gray-500">&times;</button>
        </div>
        <div className="bg-yellow-100 p-3 mt-3 rounded">
          <p className="text-sm font-medium">PAID FEATURE</p>
          <p className="text-xs text-gray-700">
            Export your survey data in .PDF, .XLS, .CSV, .PPTX, or SPSS format.
          </p>
          <button className="mt-2 bg-yellow-500 text-white px-3 py-1 text-sm rounded">
            Upgrade
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white px-6 py-3 border-b shadow-sm">
          <div className="flex space-x-4">
            <button className="text-gray-700 font-medium">Rules</button>
            <button className="text-gray-700 font-medium">Saved Views</button>
            <button className="text-gray-700 font-medium">Exports</button>
            <button className="text-gray-700 font-medium">Shared Data</button>
            <button className="text-gray-700 font-medium">Insights</button>
          </div>
          <div className="flex space-x-3">
            <button className="bg-gray-100 px-3 py-1 rounded text-sm">
              Multi-survey analysis
            </button>
            <button className="bg-gray-100 px-3 py-1 rounded text-sm">
              Share
            </button>
            <button className="bg-green-500 text-white px-4 py-1 rounded text-sm">
              Save as
            </button>
          </div>
        </header>

        {/* Survey Responses */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-gray-600 text-sm font-medium">
            RESPONDENTS: 0 of 0
          </p>
          <div className="border rounded-md p-10 flex flex-col items-center space-y-3">
            <div className="text-gray-500 text-2xl">⚠</div>
            <p className="text-gray-700">Your survey has no responses</p>
            <div className="flex space-x-3">
              <button className="bg-green-500 text-white px-4 py-2 rounded">
                Collect responses
              </button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded">
                Buy responses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyzeResult;
