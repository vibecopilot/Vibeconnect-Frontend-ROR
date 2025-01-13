import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegComment } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import image from "/profile.png";
import ForumCommentsModal from "../../../containers/modals/ForumCommentModal";
import Navbar from "../../../components/Navbar";
import Communication from "../../Communication";
import {
  getForum,
  likeForum,
  deleteForum,
  hideForum,
  domainPrefix,
} from "../../../api/index";
import { PiBookBookmark, PiEye } from "react-icons/pi";
import { FormattedDateToShowProperly } from "../../../utils/dateUtils";
import { toast } from "react-hot-toast";
import EmployeeCommunication from "./EmployeeCommunication";
import { useSelector } from "react-redux";
function EmployeeForum() {
  const themeColor = useSelector((state) => state.theme.color);
  const [modal, showModal] = useState(false);
  const [comments, setComments] = useState({});
  const [forums, setForums] = useState([]);
  const [forumId, setForumId] = useState(null);
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState({});
  const [dropdownState, setDropdownState] = useState({});
  const [savedPosts, setSavedPosts] = useState([]);
  const [hiddenForum, setHiddenForum] = useState([]);
  const [isRed, setIsRed] = useState({}); //

  const toggleDropdown = (index) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const handleCommentAdded = (forumId, newCount) => {
    setComments((prev) => ({ ...prev, [forumId]: newCount }));
  };

   const handleLikeToggle = async (forumId) => {
      try {
        const response = await likeForum(forumId);
        if (response.success) {
          setLikes((prevLikes) => {
            const updatedLikes = { ...prevLikes };
            updatedLikes[forumId] = response.liked_count;
            return updatedLikes;
          });
          setIsLiked((prevIsLiked) => {
            const updatedIsLiked = { ...prevIsLiked };
            updatedIsLiked[forumId] = !prevIsLiked[forumId];
            return updatedIsLiked;
          });
          // Toggle background color
          setIsRed((prevIsRed) => {
            const updatedIsRed = { ...prevIsRed };
            updatedIsRed[forumId] = !prevIsRed[forumId];
            return updatedIsRed;
          });
        }
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    };

  const fetchForums = async () => {
    try {
      const res = await getForum();
      console.log(res.data);
      setForums(res.data);

      const likeCounts = res.data.reduce((acc, forum) => {
        if (forum.id && forum["liked_count"] !== undefined) {
          acc[forum.id] = forum["liked_count"];
        }
        return acc;
      }, {});

      const CommentCounts = res.data.reduce((acc, forum) => {
        if (forum.id && forum["comment_count"] !== undefined) {
          acc[forum.id] = forum["comment_count"];
        }
        return acc;
      }, {});

      console.log(likeCounts);
      setLikes(likeCounts);

      console.log(CommentCounts);
      setComments(CommentCounts);
    } catch (error) {
      console.error("Error fetching forums:", error);
    }
  };

  useEffect(() => {
    fetchForums();
  }, []);

  return (
    <section className="flex ">
      <Navbar />
      <div className="p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
        <EmployeeCommunication />
        <div className="flex justify-between md:flex-row flex-col my-5 gap-y-3">
          {/* <input
          type="text"
          placeholder="search"
          className="border-2 p-2 w-70 border-gray-300 rounded-lg "
        /> */}
          {/* { <Link to={`/employee/employee-communication-create-forum`} className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center justify-center rounded-md ">
          Create Forum
        </Link> } */}
        </div>
        <div className="grid grid-cols-3 my-10">
          <div></div>
          <div className="flex flex-col justify-center items-center flex-wrap gap-5 w-full">
            {forums.map((forum, index) => (
              <div
                key={forum.id}
                className="shadow-custom-all-sides rounded-md mb-10 md:w-full relative"
              >
                <div className="flex justify-between gap-2 md:mx-8 my-5 mt-5">
                  <div className="flex gap-3">
                    <img src={image} className="w-10 h-10" alt="forum-profile" />
                    <div>
                      <h2 className="text-md font-semibold">
                        {forum.created_by_name?.firstname}{" "}
                        {forum.created_by_name?.lastname || ""}
                      </h2>
                      <p className="text-xs font-normal">
                        {FormattedDateToShowProperly(forum.created_at) ||
                          "Unknown Date"}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(index)}
                      type="button"
                      className="inline-flex justify-center w-full text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full py-2 px-2"
                    >
                      <BsThreeDots size={15} />
                    </button>
                    {dropdownState[index] && (
                      <div
                        className="absolute right-0 mt-0 w-28 flex justify-start rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                      >
                        <div className="py-1" role="none">
                          <a
                            href="#"
                            className="text-gray-700 block px-4 py-2 text-sm"
                            role="menuitem"
                          >
                            <button
                              onClick={() => {
                                handleSavePost(forum.id);
                                toggleDropdown(index); // Close dropdown
                              }}
                            >
                              Save
                            </button>
                          </a>
                          <a
                            href="#"
                            className="text-gray-700 block px-4 py-2 text-sm"
                            role="menuitem"
                          >
                            <button
                              onClick={() => {
                                handleDelete(forum.id);
                                toggleDropdown(index); // Close dropdown
                              }}
                            >
                              Delete
                            </button>
                          </a>
                          <a
                            href="#"
                            className="text-gray-700 block px-4 py-2 text-sm"
                            role="menuitem"
                          >
                            <button
                              onClick={() => {
                                handleForumVisibility(forum.id);
                                toggleDropdown(index); // Close dropdown
                              }}
                            >
                              Hide
                            </button>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="px-8 font-semibold">
                    {forum.thread_title || "No Title"}
                  </h3>
                  <p className="px-8 text-sm">
                    {forum.thread_description || "No description available."}
                  </p>
                  {forum.forums_image && forum.forums_image.length > 0 && (
                    <div className="flex flex-col items-center px-10 py-5">
                      <img
                        src={domainPrefix + forum.forums_image[0].document}
                        className=" w-full h-auto object-cover m-2 rounded-md"
                        alt="forum-content"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-start gap-5 mx-8 my-3">
                  <div className="flex gap-3 mb-5">
                    <div className="flex flex-col">
                      <button
                        key={forum.id}
                        onClick={() => handleLikeToggle(forum.id)}
                        className="flex items-center"
                      >
                        <div className="relative">
                          <FaRegHeart
                            size={22}
                            color={isRed[forum.id] ? "red" : "black"}
                            className="relative z-10"
                          />
                          <div
                            className="absolute inset-0 z-0"
                            style={{
                              backgroundColor: isRed[forum.id]
                                ? "red"
                                : "white",
                              clipPath:
                                "path('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z')",
                              transform: "scale(1.1)",
                              transition: "background-color 0.1s ease", // Added smooth transition
                            }}
                          />
                        </div>
                      </button>
                      <span className=" text-sm text-gray-500 flex justify-center">
                        {likes[forum.id] || 0}
                      </span>
                    </div>

                    <button>
                      <FaRegComment
                        className="w-6"
                        size={22}
                        onClick={() => {
                          setForumId(forum.id);
                          showModal((prev) => !prev);
                        }}
                      />
                      <span className="ml-1 flex text-sm text-gray-500">
                        {comments[forum.id] || 0}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-span-1 md:mx-8 h-40">
            {modal && forumId && (
              <ForumCommentsModal
                onclose={() => {
                  showModal(false);
                  setForumId(null); // Reset the forumId when modal closes
                }}
                forumId={forumId}
                onCommentAdded={handleCommentAdded}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmployeeForum;
