import React from "react";

function FileUploadSurvey() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col w-full">
          <label className="my-2 font-medium">
            Instructions for Respondent
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Enter instructions for the respondent (Optional)."
              className="border px-2 py-1 flex-1 rounded w-full"
            />
          </div>
        </div>
        <div className="flex flex-col col-span-2 border-t border-b p-4">
          <div className="flex justify-between gap-5">
            <p className="text-sm text-gray-600">Allowable File Types</p>
            <div className="flex gap-5 items-center">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="pdf" className="w-4 h-4" />
                <label htmlFor="pdf" className="text-gray-700 text-sm">
                  PDF
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="doc" className="w-4 h-4" />
                <label htmlFor="doc" className="text-gray-700 text-sm">
                  DOC, DOCX
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="png" className="w-4 h-4" />
                <label htmlFor="png" className="text-gray-700 text-sm">
                  PNG
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="jpg" className="w-4 h-4" />
                <label htmlFor="jpg" className="text-gray-700 text-sm">
                  JPG, JPEG
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="gif" className="w-4 h-4" />
                <label htmlFor="gif" className="text-gray-700 text-sm">
                  GIF
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-600">File size limit is 16MB</p>
          </div>
        </div>
        <div className="flex flex-col col-span-2">
          <h2 className="font-medium my-5">Validation Message</h2>
          <div className="px-2">
            <label className="text-sm">
              When an invalid file type is uploaded, display this error message.
            </label>
            <textarea
              id="message"
              rows="2"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Only  files are supported."
            ></textarea>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-5">
        <button className="bg-red-500 text-white px-5 rounded-md py-1">
          Cancel
        </button>
        <button className="bg-green-500 text-white px-5 rounded-md py-1">
          Save
        </button>
      </div>
    </div>
  );
}

export default FileUploadSurvey;
