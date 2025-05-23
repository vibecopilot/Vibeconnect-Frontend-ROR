import React from "react";
import ModalWrapper from "../../../containers/modals/ModalWrapper";

function MatrixBulkAnswerModal({ onclose }) {
  return (
    <ModalWrapper onclose={onclose}>
      <div className="flex flex-col justify-center">
        <h2 className="flex gap-4 items-center justify-center font-bold text-lg">
          Add Answers in Bulk
        </h2>
        <div className="px-2 border-t py-5">
          <label className="text-sm">
            Enter each answer choice on a separate line.
          </label>
          <textarea
            id="message"
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder=""
          ></textarea>
        </div>
        <div className="border-t gap-2 py-5 flex justify-end">
          <button className="bg-red-500 text-white px-5 rounded-md py-1">
            Cancel
          </button>
          <button className="bg-green-500 text-white px-5 rounded-md py-1">
            Save
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default MatrixBulkAnswerModal;
