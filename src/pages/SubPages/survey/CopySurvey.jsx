import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import { IoStar } from "react-icons/io5";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import { CiStar } from "react-icons/ci";
function CopySurvey() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredAllIndex, setHoveredAllIndex] = useState(null);

  const recentData = [
    {
      title: "Untitled",
      created: "2/28/2025",
      modified: "2/28/2025",
      responses: 0,
      questions: 5,
      timeSpent: "2 mins",
    },
    {
      title: "Customer Satisfaction Template",
      created: "2/28/2025",
      modified: "2/28/2025",
      responses: 0,
      questions: 10,
      timeSpent: "2 mins",
    },
  ];
  const allData = [
    {
      title: "Untitled",
      created: "2/28/2025",
      modified: "2/28/2025",
      responses: 0,
      questions: 5,
      timeSpent: "2 mins",
    },
    {
      title: "Customer Satisfaction Template",
      created: "2/28/2025",
      modified: "2/28/2025",
      responses: 0,
      questions: 10,
      timeSpent: "2 mins",
    },
  ];

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex md:flex-row flex-col justify-between md:items-center my-5 gap-2">
          <h2 className="text-xl font-normal">Copy a past survey</h2>
          <div className="flex gap-2 pt-3">
            <input
              type="text"
              placeholder="Search By Survey Name"
              className="p-2 md:w-96 border-gray-300 rounded-md placeholder:text-sm outline-none border"
            />
            <button className="bg-gray-500 rounded-md px-5 py-2 text-white">
              All
            </button>
            <button className="border border-gray-500 rounded-md px-5 py-2 flex items-center gap-2">
              <IoStar /> Favorites
            </button>
          </div>
        </div>
        <div className="border-t my-5 pt-3">
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-lg font-semibold mb-3">Recent</h2>
            <div className="space-y-4">
              {recentData.map((item, index) => (
                <div
                  key={index}
                  className="border p-2 px-5 rounded-lg shadow-sm bg-white cursor-pointer transition-all hover:border-green-500 min-h-[60px] relative"
                  // onMouseEnter={() => setHoveredIndex(index)}
                  // onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex justify-between">
                    <div className="flex flex-col items-center">
                      <Link
                        to={`/admin/copy-survey-view-page`}
                        className="text-sm text-blue-500 underline"
                      >
                        {/* <BsEye className="text-gray-500 hover:text-green-500 transition text-xl" /> */}
                        view
                      </Link>
                    </div>
                    <span className="text-gray-500">
                      <CiStar size={18} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created: {item.created} | Modified: {item.modified}
                      </p>
                    </div>

                    <div className="flex-1 flex justify-end px-5 p-2 min-h-[40px] relative">
                      <div
                        className={`absolute inset-0 flex justify-end items-center transition-opacity duration-300 px-10 ${
                          hoveredIndex === index ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <Link to={`/admin/copy-survey-view-page`}>
                            <BsEye className="text-gray-500 hover:text-black transition text-xl" />
                          </Link>
                          <h2>Preview</h2>
                        </div>
                      </div>

                      <div
                        className={`flex justify-between items-center text-center divide-x divide-gray-300 w-full transition-opacity duration-300 ${
                          hoveredIndex === index ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <div className="flex-1 px-5 py-4 border-l">
                          <p className="text-lg font-medium">
                            {item.responses}
                          </p>
                          <p className="text-xs text-gray-500">Responses</p>
                        </div>
                        <div className="flex-1 px-5 py-4">
                          <p className="text-lg font-medium">
                            {item.questions}
                          </p>
                          <p className="text-xs text-gray-500">Questions</p>
                        </div>
                        <div className="flex-1 px-5 py-4">
                          <p className="text-lg font-medium">
                            {item.timeSpent}
                          </p>
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            Typical time spent
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-lg font-semibold mb-3">All</h2>
            <div className="space-y-4">
              {allData.map((item, index) => (
                <div
                  key={index}
                  className="border p-2 px-5 rounded-lg shadow-sm bg-white cursor-pointer  transition-all hover:border-green-500 min-h-[60px] relative"
                  // onMouseEnter={() => setHoveredAllIndex(index)}
                  // onMouseLeave={() => setHoveredAllIndex(null)}
                >
                  <div className="flex justify-between gap-2">
                    <div className="flex flex-col items-center">
                      <Link
                        to={`/admin/copy-survey-view-page`}
                        className="text-sm text-blue-500 underline"
                      >
                        {/* <BsEye className="text-gray-500 hover:text-green-500 transition text-xl" /> */}
                        view
                      </Link>
                    </div>
                    <span className="text-gray-500">
                      <CiStar size={18} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created: {item.created} | Modified: {item.modified}
                      </p>
                    </div>

                    <div className="flex-1 flex justify-end px-5 p-2 min-h-[40px] relative">
                      <div
                        className={`absolute inset-0 flex justify-end items-center transition-opacity duration-300 px-10 ${
                          hoveredAllIndex === index
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <Link to={`/admin/copy-survey-view-page`}>
                            <BsEye className="text-gray-500 hover:text-green-500 transition text-xl" />
                          </Link>
                          <h2>Preview</h2>
                        </div>
                      </div>
                      <div
                        className={`flex justify-between items-center text-center divide-x divide-gray-300 w-full transition-opacity duration-300 ${
                          hoveredAllIndex === index
                            ? "opacity-0"
                            : "opacity-100"
                        }`}
                      >
                        <div className="flex-1 px-5 py-4 border-l">
                          <p className="text-lg font-medium">
                            {item.responses}
                          </p>
                          <p className="text-xs text-gray-500">Responses</p>
                        </div>
                        <div className="flex-1 px-5 py-4">
                          <p className="text-lg font-medium">
                            {item.questions}
                          </p>
                          <p className="text-xs text-gray-500">Questions</p>
                        </div>
                        <div className="flex-1 px-5 py-4">
                          <p className="text-lg font-medium">
                            {item.timeSpent}
                          </p>
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            Typical time spent
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CopySurvey;
