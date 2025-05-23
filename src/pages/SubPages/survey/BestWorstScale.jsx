import React, { useState } from "react";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { LuArrowRightLeft } from "react-icons/lu";

function BestWorstScale() {
  const [fields, setFields] = useState([{ id: Date.now(), label: "" }]);

  const addField = () => {
    setFields([...fields, { id: Date.now(), label: "" }]);
  };

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="grid grid-cols-1 gap-5">
        <div className="flex flex-col w-full">
          <label className="my-1 font-medium">Labels</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Enter a column label"
              className="border px-2 py-1 flex-1 rounded w-full"
            />
            <span>
              <LuArrowRightLeft size={20} />
            </span>
            <input
              type="text"
              placeholder="Enter a column label"
              className="border px-2 py-1 flex-1 rounded w-full"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="my-1 font-medium">Items</label>
          <div className="flex gap-2">
            <div className="w-full mx-auto p-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-3 mb-2"
                >
                  <input type="radio" name="rowSelection" className="w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Enter a row label"
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addField}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <AiOutlinePlusCircle size={20} />
                  </button>
                  {fields.length > 1 && (
                    <button
                      onClick={() => removeField(field.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <AiOutlineMinusCircle size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
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

export default BestWorstScale;
