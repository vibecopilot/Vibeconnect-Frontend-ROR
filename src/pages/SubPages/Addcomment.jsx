import { useState } from "react";

const CommentModal = ({ isOpen, onClose, onSubmit }) => {
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Add Comment</h2>
        <textarea
          className="w-full p-2 border rounded-md"
          rows="4"
          placeholder="Enter your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-purple-800 text-white px-4 py-2 rounded-md"
            onClick={() => {
              onSubmit(comment);
              onClose();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;