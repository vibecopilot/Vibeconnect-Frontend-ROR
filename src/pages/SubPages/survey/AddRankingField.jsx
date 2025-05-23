import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { PiQuestionDuotone } from "react-icons/pi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import MatrixBulkAnswerModal from "./MatrixBulkAnswerModal";
function AddRankingField() {
  const [bulkModal, setBulkModal] = useState(false);
  const [isNA, setIsNA] = useState(false);
  const [rowFields, setRowFields] = useState([
    { id: 1, value: "" },
    { id: 2, value: "" },
    { id: 3, value: "" },
  ]);

  const addRowField = () => {
    setRowFields([...rowFields, { id: Date.now(), value: "" }]);
  };

  const removeRowField = (id) => {
    setRowFields(rowFields.filter((field) => field.id !== id));
  };
  const onChangeRow = (id, value) => {
    setRowFields(
      rowFields.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="grid grid-cols-2 gap-5 border-t">
        <div className="w-full mx-auto col-span-2">
          <div className="w-full mx-auto p-4">
            {rowFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center space-x-3 mb-2 w-full"
              >
                <input
                  type="text"
                  placeholder="Enter a row label"
                  className="flex-1 px-3 py-2 border rounded-md w-full"
                  value={field.value}
                  onChange={(e) => onChangeRow(field.id, e.target.value)}
                />
                <button
                  onClick={addRowField}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <AiOutlinePlusCircle size={20} />
                </button>
                {rowFields.length > 1 && (
                  <button
                    onClick={() => removeRowField(field.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <AiOutlineMinusCircle size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-start items-center gap-2 px-4 mb-3">
            <button
              className="flex items-center gap-1 text-black"
              onClick={() => setBulkModal(true)}
            >
              <CiCirclePlus size={20} />
              <span>Bulk Answers</span>
            </button>
            <span>
              <PiQuestionDuotone size={20} />
            </span>
          </div>
          <div className="col-span-4 flex items-center justify-start border-t border-b py-3 px-4 bg-yellow-50">
            <input type="checkbox" id="" className="mr-2 w-3 h-3" />
            <label htmlFor="" className="text-sm font-medium text-gray-200">
              Use previous answer choices (carry forward responses)
            </label>
          </div>
          {isNA && (
            <div className="w-full my-5">
              <h2 className="mb-1">Not Applicable</h2>
              <input
                type="text"
                placeholder="NA"
                className="border px-2 py-2 flex-1 rounded-md w-[80%]"
              />
            </div>
          )}
          <div className="col-span-2 flex items-center justify-start border-t border-b py-3 px-4">
            <input
              type="checkbox"
              id=""
              checked={isNA}
              onChange={() => setIsNA(!isNA)}
              className="mr-2 w-3 h-3"
            />
            <label htmlFor="" className="text-sm font-medium text-gray-600">
              Add a N/A column.
            </label>
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
      {bulkModal && (
        <MatrixBulkAnswerModal onclose={() => setBulkModal(false)} />
      )}
    </div>
  );
}

export default AddRankingField;
