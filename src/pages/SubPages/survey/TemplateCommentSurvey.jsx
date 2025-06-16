import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { HiOutlineDotsVertical } from "react-icons/hi";
import profile1 from "/profile1.jpg";

function TemplateCommentSurvey({ isOpen, onClose }) {
  const [selectedQuestion, setSelectedQuestion] = useState("Q1");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeCommentDropdown, setActiveCommentDropdown] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); // Track the comment we're replying to
  const [newReply, setNewReply] = useState(""); // State for the new reply text
  const [activeReplyDropdown, setActiveReplyDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const addComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { text: newComment, replies: [] }]);
      setNewComment("");
    }
  };

  const addReply = (commentIndex) => {
    if (newReply.trim()) {
      const updatedComments = [...comments];
      updatedComments[commentIndex].replies.push(newReply); // Add the reply to the comment's replies
      setComments(updatedComments);
      setNewReply(""); // Reset the reply input field
      setReplyingTo(null); // Close the reply input field after submitting
    }
  };

  const toggleDropdown = (index, type) => {
    if (type === "comment") {
      setActiveCommentDropdown(activeCommentDropdown === index ? null : index);
    } else if (type === "reply") {
      setActiveReplyDropdown(activeReplyDropdown === index ? null : index);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveCommentDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transform z-10 border pb-3 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <h2 className="text-lg font-semibold">Comments on</h2>
          <select
            className="border px-5 py-1 rounded"
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
            <option value="Q5">Q5</option>
            <option value="Q6">Q6</option>
            <option value="Q7">Q7</option>
            <option value="Q8">Q8</option>
            <option value="Q9">Q9</option>
          </select>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-black">
          <IoMdClose size={20} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2 h-[calc(100%-130px)] overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet</p>
        ) : (
          comments.map((comment, index) => (
            <div key={index} className="flex flex-col relative">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 mx-2 items-center">
                  <img
                    src={profile1}
                    className="w-10 h-10 rounded-full"
                    alt="profile"
                  />
                  <div className="flex gap-1 items-center">
                    <h2 className="text-sm font-medium">Riya Singh</h2>
                    <p className="text-xs font-normal text-gray-500">
                      10 min ago
                    </p>
                  </div>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="p-1 px-2"
                    onClick={() => toggleDropdown(index, "comment")}
                  >
                    <HiOutlineDotsVertical />
                  </button>
                  {activeCommentDropdown === index && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                      <ul className="py-2 text-sm text-gray-700">
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                          Edit
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                          Delete
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                          Resolve
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-12">{comment.text}</div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-12 pl-4 mt-2 space-y-5">
                  {comment.replies.map((reply, replyIndex) => (
                    <div key={replyIndex} className="text-gray-600">
                      <div className="flex justify-between gap-2">
                        <div className="flex gap-2 mx-2 items-center">
                          <img
                            src={profile1}
                            className="w-10 h-10 rounded-full"
                            alt="profile"
                          />
                          <div className="flex gap-1 items-center">
                            <h2 className="text-sm font-medium">Riya Singh</h2>
                            <p className="text-xs font-normal text-gray-500">
                              10 min ago
                            </p>
                          </div>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                          <button
                            className="p-1 px-2"
                            onClick={() => toggleDropdown(replyIndex, "reply")}
                          >
                            <HiOutlineDotsVertical />
                          </button>
                          {activeReplyDropdown === replyIndex && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                              <ul className="py-2 text-sm text-gray-700">
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                  Edit
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                  Delete
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="ml-12">{reply}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Button */}
              <div className="ml-12 py-3">
                <button
                  className="text-sky-400 font-normal hover:underline"
                  onClick={() =>
                    setReplyingTo(replyingTo === index ? null : index)
                  }
                >
                  Reply
                </button>
              </div>

              {/* Input field for reply */}
              {replyingTo === index && (
                <div className="ml-12 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a reply"
                    className="flex-1 border px-2 py-1 rounded"
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                  />
                  <button
                    onClick={() => addReply(index)}
                    className="border-2 border-green-500 text-green-500 rounded-md px-5"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          placeholder="Add a comment"
          className="flex-1 border px-2 py-1 rounded"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={addComment}
          className="border-2 border-green-500 text-green-500 rounded-md px-5"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default TemplateCommentSurvey;
