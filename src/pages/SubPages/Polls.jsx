import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Communication from "../Communication";
import { getPolls, getSearchPolls } from "../../api";
import { PiPlusCircleBold } from "react-icons/pi";
import { DNA } from "react-loader-spinner";
import SiteHeader from "../../components/SiteHeader";

function Polls() {
  const themeColor = useSelector((state) => state.theme.color);

  const [pollsData, setPollsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Polls
  useEffect(() => {
    fetchPolls();
  }, [debouncedSearch]);

  const fetchPolls = async () => {
    setLoading(true);

    try {
      let response;

      const trimmedSearch = debouncedSearch.trim();

      setIsSearching(trimmedSearch.length > 0);

      // Search API
      if (trimmedSearch.length > 0) {
        response = await getSearchPolls(trimmedSearch);
      } else {
        // Get All Polls
        response = await getPolls();
      }

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      const sortedPolls = data.sort((a, b) => {
        return (
          new Date(b.created_at) -
          new Date(a.created_at)
        );
      });

      setPollsData(sortedPolls);
    } catch (err) {
      console.error("Failed to fetch polls data:", err);
      setPollsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
  };

  return (
    <div className="flex">
      <Navbar />

      <div className="p-2 w-full flex md:mx-2 overflow-hidden flex-col">
        {/* Site Header */}
        <SiteHeader onSiteChange={fetchPolls} />

        <Communication />

        <div className="grid grid-cols-12 my-2 gap-2">
          {/* Search */}
          <div className="relative col-span-10">
            <input
              type="text"
              placeholder="Search polls by title..."
              className="border p-2 pr-20 w-full border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-2 text-sm text-gray-500"
              >
                Clear
              </button>
            )}
          </div>

          {/* Create Button */}
          <Link
            to={`/admin/create-polls`}
            style={{ background: themeColor }}
            className="font-semibold text-white px-4 py-2 flex gap-2 justify-center items-center rounded-md whitespace-nowrap col-span-2"
          >
            <PiPlusCircleBold size={20} />
            Create
          </Link>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center mt-10 h-60">
            <DNA
              visible={true}
              height={120}
              width={130}
            />
          </div>
        ) : (
          <div className="md:grid grid-cols-2 gap-2">
            {pollsData.length > 0 ? (
              pollsData.map((poll) => {
                // Total votes
                const totalVotes =
                  poll.poll_options?.reduce(
                    (sum, option) =>
                      sum + option.votes,
                    0
                  ) || 0;

                // Days left
                const endDate = new Date(
                  poll.end_date
                );

                const currentDate = new Date();

                const timeDiff =
                  endDate - currentDate;

                const daysLeft = Math.ceil(
                  timeDiff /
                  (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={poll.id}
                    className="flex w-full p-2"
                  >
                    <div className="max-w-2xl w-full">
                      <div className="bg-white shadow-custom-all-sides rounded-lg p-6 h-full">
                        {/* Poll Title */}
                        <h2 className="text-xl font-semibold mb-4">
                          {poll.title}
                        </h2>

                        {/* Header */}
                        <div className="flex justify-between my-3">
                          <span className="text-gray-500 text-sm">
                            {totalVotes} Responded
                          </span>

                          <span className="text-gray-500 text-sm uppercase">
                            {poll.visibility}
                          </span>
                        </div>

                        {/* Poll Options */}
                        <div className="space-y-4 border-t border-b border-gray-200 py-4">
                          {poll.poll_options?.map(
                            (option) => (
                              <div
                                key={option.id}
                                className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                              >
                                <span>
                                  {option.content}
                                </span>

                                <span className="text-blue-600 font-semibold">
                                  {option.votes} votes
                                </span>
                              </div>
                            )
                          )}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 text-gray-500 text-sm">
                          <p>
                            {totalVotes} votes •{" "}
                            {daysLeft > 0
                              ? `${daysLeft}d left`
                              : "Poll closed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 flex justify-center items-center h-40">
                <p className="text-gray-500 text-center">
                  {isSearching
                    ? "No polls match your search. Try different keywords."
                    : "No polls available"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Polls;