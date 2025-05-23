import React from "react";
import ModalWrapper from "../../../containers/modals/ModalWrapper";

function LibrarySurveyModal({ onclose }) {
  return (
    <ModalWrapper onclose={onclose}>
      <div className="flex flex-col justify-center max-w-[500px] mx-auto">
        <h2 className="flex gap-4 items-center justify-center font-medium mb-5 text-lg">
          Add Question to Team Library
        </h2>
        <div className="px-2 border-t py-5">
          <h2 className="text-sm font-normal mb-2">
            Create a team question bank to save and quickly reuse the questions
            your team uses most often. This is available to SurveyMonkey
            Enterprise only.
          </h2>
          <div className="space-y-1">
            <label className="text-sm font-medium">Tags</label>
            <textarea
              id="message"
              rows="2"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Add Tags"
            ></textarea>
          </div>
        </div>
        <div className="border-t gap-2 py-5 flex justify-end">
          <button className="border border-black text-black text-sm px-5 rounded-md py-2">
            Cancel
          </button>
          <button className="bg-yellow-500 text-black px-5 rounded-md py-2 text-sm">
            UPGRADE TO ADD TO LIBRARY
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default LibrarySurveyModal;
