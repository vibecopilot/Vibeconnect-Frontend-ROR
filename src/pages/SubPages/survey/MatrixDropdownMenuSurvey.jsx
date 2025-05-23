import React, { useState } from "react";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { CiCirclePlus } from "react-icons/ci";
import { PiQuestionDuotone } from "react-icons/pi";
import MatrixAnswersChoicesSurveyModal from "./MatrixAnswersChoicesSurveyModal";
import MatrixBulkAnswerModal from "./MatrixBulkAnswerModal";

function MatrixDropdownMenuSurvey() {
  const [bulkModal, setBulkModal] = useState(false);
  const [answerChoiceModal, setAnswerChoiceBulkModal] = useState(false);
  const [rowFields, setRowFields] = useState([{ id: 1, value: "" }]);
  const [columnFields, setColumnFields] = useState([{ id: 1, value: "" }]);

  // Handle Row Change
  const onChangeRow = (id, newValue) => {
    setRowFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, value: newValue } : field
      )
    );
  };

  // Handle Column Change
  const onChangeColumn = (id, newValue) => {
    setColumnFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, value: newValue } : field
      )
    );
  };

  // Add Row
  const addRowField = () => {
    setRowFields([...rowFields, { id: Date.now(), value: "" }]);
  };

  // Remove Row
  const removeRowField = (id) => {
    setRowFields(rowFields.filter((field) => field.id !== id));
  };

  // Add Column
  const addColumnField = () => {
    setColumnFields([...columnFields, { id: Date.now(), value: "" }]);
  };

  // Remove Column
  const removeColumnField = (id) => {
    setColumnFields(columnFields.filter((field) => field.id !== id));
  };

  const [isAddOther, setIsAddOther] = useState(false);
  const [isParagraph, setIsParagraph] = useState(false);
  const [validationType, setValidationType] = useState("validate");

  const handleChangePara = (e) => {
    setIsParagraph(e.target.value === "option1");
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Row Section */}
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col col-span-2 border-t">
          <div className="flex gap-2">
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
          </div>
        </div>
        <div className="flex justify-start items-center gap-2">
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
      </div>

      {/* Column Section */}
      <div className="grid grid-col-1 border-t py-5">
        <div className="flex flex-col">
          <label className="my-1 font-medium">Columns</label>
          <div className="flex gap-2">
            <div className="w-full mx-auto p-4">
              {columnFields.map((field, index) => (
                <div key={field.id} className="mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Enter a Column label"
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={field.value}
                      onChange={(e) => onChangeColumn(field.id, e.target.value)}
                    />
                    <button
                      onClick={addColumnField}
                      className="text-gray-500 hover:text-blue-500"
                    >
                      <AiOutlinePlusCircle size={20} />
                    </button>
                    {columnFields.length > 1 && (
                      <button
                        onClick={() => removeColumnField(field.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <AiOutlineMinusCircle size={20} />
                      </button>
                    )}
                  </div>
                  <div className="w-full mt-2">
                    <button
                      className="flex items-center gap-1 text-sky-500 hover:underline"
                      onClick={() => setAnswerChoiceBulkModal(true)}
                    >
                      <CiCirclePlus size={20} />
                      <span>Enter Answer Choices</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-b">
        <div className="p-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={isAddOther}
              onChange={() => setIsAddOther(!isAddOther)}
            />
            <span>Add an "Other" Answer Option for Comments</span>
          </label>

          {isAddOther && (
            <div className="w-full my-5">
              <div className="grid grid-col-1 space-y-3">
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="options"
                    className="text-sm font-medium text-gray-700"
                  >
                    Label
                  </label>
                  <input
                    type="text"
                    placeholder="Other (please specify)"
                    className="border px-2 py-1 flex-1 rounded w-full"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="size"
                    className="text-sm font-medium text-gray-700"
                  >
                    Size
                  </label>
                  <div className="flex space-x-5">
                    <select
                      onChange={handleChangePara}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Paragraph Of Text</option>
                      <option value="option1">Single Line of Text</option>
                    </select>
                    {isParagraph && (
                      <select
                        id=""
                        className="border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="">2 Lines</option>
                        <option value="option1">3 Lines</option>
                        <option value="option1">4 Lines</option>
                        <option value="option1">5 Lines</option>
                        <option value="option1">6 Lines</option>
                        <option value="option1">7 Lines</option>
                        <option value="option1">8 Lines</option>
                        <option value="option1">9 Lines</option>
                        <option value="option1">10 Lines</option>
                        <option value="option1">11 Lines</option>
                        <option value="option1">12 Lines</option>
                        <option value="option1">13 Lines</option>
                        <option value="option1">14 Lines</option>
                        <option value="option1">15 Lines</option>
                        <option value="option1">16 Lines</option>
                        <option value="option1">17 Lines</option>
                        <option value="option1">18 Lines</option>
                        <option value="option1">19 Lines</option>
                        <option value="option1">20 Lines</option>
                      </select>
                    )}
                    <select
                      id=""
                      className="border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">5 Characters</option>
                      <option value="">10 Characters</option>
                      <option value="">20 Characters</option>
                      <option value="">30 Characters</option>
                      <option value="">40 Characters</option>
                      <option value="">50 Characters</option>
                      <option value="">60 Characters</option>
                      <option value="">70 Characters</option>
                      <option value="">80 Characters</option>
                      <option value="">90 Characters</option>
                      <option value="">100 Characters</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <label
                    htmlFor="options"
                    className="text-sm font-medium text-gray-700"
                  >
                    Validation
                  </label>
                  <div className="flex gap-5">
                    <select
                      id="options"
                      className="border border-gray-300 rounded-md px-3 py-2"
                      value={validationType}
                      onChange={(e) => setValidationType(e.target.value)}
                    >
                      <option value="validate">
                        Don't validate this answer.
                      </option>
                      <option value="specificLength">
                        Make sure it's a specific length
                      </option>
                      <option value="wholeNumber">
                        Make sure it's a whole number
                      </option>
                      <option value="decimalNumber">
                        Make sure it's a decimal number
                      </option>
                      <option value="date1">
                        Make sure it's a date (MM/DD/YYYY)
                      </option>
                      <option value="date2">
                        Make sure it's a date (DD/MM/YYYY)
                      </option>
                      <option value="email">
                        Make sure it's an email address.
                      </option>
                    </select>
                    <div>
                      {validationType === "specificLength" && (
                        <div className="flex gap-5 items-center">
                          <label>between</label>
                          <input
                            type="number"
                            placeholder="0"
                            className="border border-gray-300 rounded-md px-3 py-1 w-24"
                          />
                          <label>and</label>
                          <input
                            type="number"
                            placeholder="5000"
                            className="border border-gray-300 rounded-md px-3 py-1 w-24"
                          />
                          <label>characters</label>
                        </div>
                      )}

                      {validationType === "wholeNumber" && (
                        <div className="flex gap-5 items-center">
                          <label>between</label>
                          <input
                            type="number"
                            placeholder="0"
                            className="border border-gray-300 rounded-md px-3 py-1 w-24"
                          />
                          <label>and</label>
                          <input
                            type="number"
                            placeholder="5000"
                            className="border border-gray-300 rounded-md px-3 py-1 w-24"
                          />
                        </div>
                      )}

                      {validationType === "decimalNumber" && (
                        <div className="flex gap-5 items-center">
                          <label>between</label>
                          <input
                            type="number"
                            placeholder="0"
                            className="border border-gray-300 rounded-md px-3 py-1 w-24"
                          />
                          <label>and</label>
                          <input
                            type="number"
                            placeholder="5000"
                            className="border border-gray-300 rounded-md px-3 py-1 w-24"
                          />
                        </div>
                      )}

                      {validationType === "date1" && (
                        <div className="flex gap-5 items-center">
                          <label>between</label>
                          <input
                            type="date"
                            placeholder="0"
                            className="border border-gray-300 rounded-md px-3 py-1 w-24"
                          />
                          <label>and</label>
                          <input
                            type="date"
                            placeholder="5000"
                            className="border border-gray-300 rounded-md px-3 py-1 w-24"
                          />
                        </div>
                      )}

                      {validationType === "date2" && (
                        <>
                          <div className="flex gap-5 items-center">
                            <label>between</label>
                            <input
                              type="date"
                              placeholder="0"
                              className="border border-gray-300 rounded-md px-3 py-1 w-24"
                            />
                            <label>and</label>
                            <input
                              type="date"
                              placeholder="5000"
                              className="border border-gray-300 rounded-md px-3 py-1 w-24"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {[
                    "email",
                    "date2",
                    "date1",
                    "decimalNumber",
                    "wholeNumber",
                    "specificLength",
                  ].includes(validationType) && (
                    <div className="flex flex-col space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium text-gray-700"
                      >
                        When the answer is invalid, display this error message.
                      </label>
                      <div>
                        <textarea
                          id="message"
                          rows="4"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="The comment you entered is in an invalid format."
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-5">
        <button className="bg-red-500 text-white px-5 rounded-md py-1">
          Cancel
        </button>
        <button className="bg-green-500 text-white px-5 rounded-md py-1">
          Save
        </button>
      </div>

      {/* Modals */}
      {bulkModal && (
        <MatrixBulkAnswerModal onclose={() => setBulkModal(false)} />
      )}
      {answerChoiceModal && (
        <MatrixAnswersChoicesSurveyModal
          onclose={() => setAnswerChoiceBulkModal(false)}
        />
      )}
    </div>
  );
}

export default MatrixDropdownMenuSurvey;
