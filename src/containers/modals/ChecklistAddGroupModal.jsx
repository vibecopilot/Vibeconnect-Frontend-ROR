import React, { useState, useEffect } from "react";
import ModalWrapper from "./ModalWrapper";

const CheckListAddGroupModal = ({ onclose, onSave, editData }) => {
  const [groupName, setGroupName] = useState("");

  // ✅ Prefill data when editing
  useEffect(() => {
    if (editData) {
      setGroupName(editData.groupName);
    }
  }, [editData]);

  // ✅ Handle submit
  const handleSubmit = () => {
    if (!groupName.trim()) {
      alert("Group name is required");
      return;
    }

    onSave(groupName); // send data to parent
    setGroupName("");
  };

  return (
    <ModalWrapper onclose={onclose}>
      <div className="flex flex-col justify-center">
        <h2 className="flex gap-4 items-center justify-center font-bold text-lg my-2">
          {editData ? "Edit Group" : "Create Group"}
        </h2>

        <div className="border-t-2 border-black">
          <div className="grid grid-cols-1 gap-2 my-3">
            <div className="grid grid-col gap-2">
              <label className="text-sm font-medium mt-1">
                Enter Group Name
              </label>

              <input
                type="text"
                placeholder="Enter Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="border rounded-md border-gray-500 px-2 py-2"
              />
            </div>
          </div>
        </div>

        <div className="border-t-2 border-black my-4"></div>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleSubmit}
            className="bg-black px-4 py-1 border-2 rounded-md text-white font-medium border-black hover:bg-white hover:text-black transition-all duration-300"
          >
            {editData ? "Update" : "Submit"}
          </button>

          <button
            onClick={onclose}
            className="px-4 py-1 border-2 rounded-md font-medium border-gray-400 hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CheckListAddGroupModal;