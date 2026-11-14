import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { IoStar } from "react-icons/io5";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import { CiStar } from "react-icons/ci";
import { getSurveys } from "../../../api";

function CopySurvey() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredAllIndex, setHoveredAllIndex] = useState(null);
  const [surveyList, setSurveyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = searchQuery ? { "q[survey_title_cont]": searchQuery } : {};
    getSurveys(params)
      .then((res) => {
        const list = res.data?.survey ?? res.data ?? [];
        setSurveyList(Array.isArray(list) ? list : []);
      })
      .catch(() => setSurveyList([]))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return isNaN(date.getTime()) ? d : date.toLocaleDateString();
  };
  const responseCount = (row) => (Array.isArray(row.survey_responses) ? row.survey_responses.length : 0);
  const questionCount = (row) => (Array.isArray(row.survey_questions) ? row.survey_questions.length : 0);
  const recentData = surveyList.slice(0, 10);
  const allData = surveyList;

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              {loading ? (
                <p className="text-gray-500">Loading surveys…</p>
              ) : recentData.length === 0 ? (
                <p className="text-gray-500">No surveys found.</p>
              ) : (
                recentData.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="border p-2 px-5 rounded-lg shadow-sm bg-white cursor-pointer transition-all hover:border-green-500 min-h-[60px] relative"
                  >
                    <div className="flex justify-between">
                      <div className="flex flex-col items-center">
                        <Link
                          to={`/admin/copy-survey-view-page/${item.id}`}
                          className="text-sm text-blue-500 underline"
                        >
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
                          {item.survey_title || "Untitled"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Created: {formatDate(item.created_at)} | Modified: {formatDate(item.updated_at)}
                        </p>
                      </div>
                      <div className="flex-1 flex justify-end px-5 p-2 min-h-[40px] relative">
                        <div className="flex justify-between items-center text-center divide-x divide-gray-300 w-full">
                          <div className="flex-1 px-5 py-4 border-l">
                            <p className="text-lg font-medium">{responseCount(item)}</p>
                            <p className="text-xs text-gray-500">Responses</p>
                          </div>
                          <div className="flex-1 px-5 py-4">
                            <p className="text-lg font-medium">{questionCount(item)}</p>
                            <p className="text-xs text-gray-500">Questions</p>
                          </div>
                          <div className="flex-1 px-5 py-4">
                            <p className="text-lg font-medium">—</p>
                            <p className="text-xs text-gray-500 whitespace-nowrap">Typical time spent</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-lg font-semibold mb-3">All</h2>
            <div className="space-y-4">
              {allData.map((item, index) => (
                <div
                  key={item.id || index}
                  className="border p-2 px-5 rounded-lg shadow-sm bg-white cursor-pointer transition-all hover:border-green-500 min-h-[60px] relative"
                >
                  <div className="flex justify-between gap-2">
                    <div className="flex flex-col items-center">
                      <Link
                        to={`/admin/copy-survey-view-page/${item.id}`}
                        className="text-sm text-blue-500 underline"
                      >
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
                        {item.survey_title || "Untitled"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created: {formatDate(item.created_at)} | Modified: {formatDate(item.updated_at)}
                      </p>
                    </div>
                    <div className="flex-1 flex justify-end px-5 p-2 min-h-[40px] relative">
                      <div className="flex justify-between items-center text-center divide-x divide-gray-300 w-full">
                        <div className="flex-1 px-5 py-4 border-l">
                          <p className="text-lg font-medium">{responseCount(item)}</p>
                          <p className="text-xs text-gray-500">Responses</p>
                        </div>
                        <div className="flex-1 px-5 py-4">
                          <p className="text-lg font-medium">{questionCount(item)}</p>
                          <p className="text-xs text-gray-500">Questions</p>
                        </div>
                        <div className="flex-1 px-5 py-4">
                          <p className="text-lg font-medium">—</p>
                          <p className="text-xs text-gray-500 whitespace-nowrap">Typical time spent</p>
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
