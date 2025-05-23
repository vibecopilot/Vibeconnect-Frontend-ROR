import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { PiQuestionDuotone } from "react-icons/pi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import MatrixBulkAnswerModal from "./MatrixBulkAnswerModal";
function AddDateTimeField() {
  const [bulkModal, setBulkModal] = useState(false);
  const [isDateTime, setIsDateTime] = useState(false);
  const [isTimeInfo, setIsTimeInfo] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("MM/DD/YYYY");
  const [dateTimeFields, setDateTimeFields] = useState([
    { id: 1, dateTime: "" },
  ]);

  const addDateTimeField = () => {
    setDateTimeFields([...dateTimeFields, { id: Date.now(), dateTime: "" }]);
  };

  const removeDateTimeField = (id) => {
    setDateTimeFields(dateTimeFields.filter((field) => field.id !== id));
  };

  const onChangeDateTime = (id, value) => {
    setDateTimeFields(
      dateTimeFields.map((field) =>
        field.id === id ? { ...field, dateTime: value } : field
      )
    );
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="grid grid-cols-2 gap-5 border-t">
        <div className="w-full mx-auto col-span-2">
          <div className="w-full mx-auto p-4">
            {dateTimeFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center space-x-3 mb-2 w-full"
              >
                <label className=" text-gray-700 font-medium">
                  Label {index + 1}
                </label>
                <input
                  type="text"
                  placeholder="Enter Date / Time"
                  className="flex-1 px-3 py-2 border rounded-md w-full"
                  value={field.dateTime}
                  onChange={(e) => onChangeDateTime(field.id, e.target.value)}
                />
                <button
                  onClick={addDateTimeField}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <AiOutlinePlusCircle size={20} />
                </button>
                {dateTimeFields.length > 1 && (
                  <button
                    onClick={() => removeDateTimeField(field.id)}
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
          <div className="col-span-2 flex gap-5 items-center justify-between border-t border-b py-3 px-4">
            <div className="flex gap-5">
              <span className="font-medium">Collect :</span>
              <div>
                <input
                  type="checkbox"
                  id="dateInfo"
                  checked={isDateTime}
                  onChange={() => setIsDateTime(!isDateTime)}
                  disabled={isTimeInfo}
                  className="mr-2 w-3 h-3"
                />
                <label
                  htmlFor="dateInfo"
                  className="text-sm font-medium text-gray-600"
                >
                  Date Info
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="timeInfo"
                  checked={isTimeInfo}
                  onChange={() => {
                    setIsTimeInfo(!isTimeInfo);
                    if (!isTimeInfo) setIsDateTime(true);
                  }}
                  className="mr-2 w-3 h-3"
                />
                <label
                  htmlFor="timeInfo"
                  className="text-sm font-medium text-gray-600"
                >
                  Time Info
                </label>
              </div>
            </div>

            {isDateTime && (
              <div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="dateFormat"
                      value="MM/DD/YYYY"
                      checked={selectedFormat === "MM/DD/YYYY"}
                      onChange={() => setSelectedFormat("MM/DD/YYYY")}
                      className="hidden"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedFormat === "MM/DD/YYYY"
                          ? "border-green-500"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedFormat === "MM/DD/YYYY" && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="ml-2 text-gray-700">MM / DD / YYYY</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="dateFormat"
                      value="DD/MM/YYYY"
                      checked={selectedFormat === "DD/MM/YYYY"}
                      onChange={() => setSelectedFormat("DD/MM/YYYY")}
                      className="hidden"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedFormat === "DD/MM/YYYY"
                          ? "border-green-500"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedFormat === "DD/MM/YYYY" && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="ml-2 text-gray-700">DD / MM / YYYY</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className="w-full m-3">
            <h2 className="text-sm text-gray-800">
              Customize Date Validation Message
            </h2>
            <div className="px-5 py-3">
              <label className="text-sm text-gray-800">
                When an invalid date or time is entered, display this error
                message.
              </label>
              <textarea
                placeholder="Please enter a valid date."
                className="border px-2 py-2 flex-1 rounded-md w-full resize-none"
                rows="3"
              />
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
      {bulkModal && (
        <MatrixBulkAnswerModal onclose={() => setBulkModal(false)} />
      )}
    </div>
  );
}

export default AddDateTimeField;
