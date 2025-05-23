import React from "react";

function AddRangeField() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="grid grid-cols-12 gap-5 border-t py-4 items-center">
        <div className="col-span-1">
          <label className="text-sm font-medium text-gray-600">Left Side</label>
        </div>
        <div className="col-span-11">
          <input
            type="text"
            placeholder="Enter a label"
            className="px-3 py-2 border rounded-md w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5 items-center">
        <div className="col-span-1">
          <label className="text-sm font-medium text-gray-600">Center</label>
        </div>
        <div className="col-span-11">
          <input
            type="text"
            placeholder="Enter a label (optional)"
            className="px-3 py-2 border rounded-md w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5 py-4 items-center">
        <div className="col-span-1">
          <label className="text-sm font-medium text-gray-600">
            Right Side
          </label>
        </div>
        <div className="col-span-11">
          <input
            type="text"
            placeholder="100"
            className="px-3 py-2 border rounded-md w-full"
          />
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

export default AddRangeField;
