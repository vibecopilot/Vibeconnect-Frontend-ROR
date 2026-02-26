import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Communication from "../Communication";
import { getPolls, getSearchPolls } from "../../api";
import { PiPlusCircleBold } from "react-icons/pi";
import toast from "react-hot-toast";

function Polls() {
  const themeColor = useSelector((state) => state.theme.color);
  const location = useLocation();

  const [pollsData, setPollsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  /* ------------------ Debounce Search ------------------ */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* ------------------ Fetch Polls ------------------ */
  useEffect(() => {
    const fetchPollsData = async () => {
      setLoading(true);
      try {
        let response;

        if (debouncedSearch.length >= 2) {
          setIsSearching(true);
          response = await getSearchPolls(debouncedSearch);
        } else {
          setIsSearching(false);
          response = await getPolls();
        }

        const data = Array.isArray(response?.data)
          ? response.data
          : response?.data?.polls || [];

        const sortedPolls = data.sort(
          (a, b) =>
            new Date(b.created_at || 0) -
            new Date(a.created_at || 0)
        );

        setPollsData(sortedPolls);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch polls ❌");
        setPollsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPollsData();
  }, [debouncedSearch]);

  /* Refresh after create */
  useEffect(() => {
    if (location.state?.refresh) {
      setDebouncedSearch("");
    }
  }, [location.state]);

  /* ------------------ UI ------------------ */
  return (
    <div className="flex">
      <Navbar />
      <div className="p-4 w-full flex flex-col">
        <Communication />

        {/* Search + Create */}
        <div className="flex justify-between md:flex-row flex-col my-2 gap-2">
          <input
            type="text"
            placeholder="Search polls by title..."
            className="border p-2 w-full border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Link
            to="/admin/create-polls"
            style={{ background: themeColor }}
            className="font-semibold text-white px-4 py-1 flex gap-2 items-center rounded-md whitespace-nowrap"
          >
            <PiPlusCircleBold size={20} /> Create
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 my-4">
            Loading...
          </p>
        )}

        {/* Poll List */}
        <div className="grid md:grid-cols-2 gap-4">
          {!loading && pollsData.length > 0 ? (
            pollsData.map((poll) => {
              const totalVotes = (poll.poll_options || []).reduce(
                (sum, option) => sum + (option.votes || 0),
                0
              );

              const endDate = poll.end_date
                ? new Date(poll.end_date)
                : null;

              const daysLeft = endDate
                ? Math.ceil(
                    (endDate - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0;

              return (
                <div
                  key={poll.id}
                  className="bg-white shadow rounded-lg p-4"
                >
                  <h2 className="text-lg font-semibold mb-2">
                    {poll.title}
                  </h2>

                  <div className="text-sm text-gray-500 mb-3">
                    {poll.visibility || "Public"}
                  </div>

                  <div className="space-y-2 border-t border-b py-3">
                    {(poll.poll_options || []).map((option) => (
                      <div
                        key={option.id}
                        className="flex justify-between bg-gray-50 p-2 rounded"
                      >
                        <span>{option.content}</span>
                        <span>
                          {option.votes || 0} votes
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 text-sm text-gray-500">
                    {totalVotes} votes •{" "}
                    {daysLeft > 0
                      ? `${daysLeft}d left`
                      : "Poll closed"}
                  </div>
                </div>
              );
            })
          ) : (
            !loading && (
              <p className="text-center text-gray-500 w-full col-span-2">
                {isSearching
                  ? "No polls match your search."
                  : "No polls available"}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Polls;