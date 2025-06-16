import React, { useState } from "react";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { CiCirclePlus } from "react-icons/ci";
import { PiQuestionDuotone } from "react-icons/pi";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import MatrixBulkAnswerModal from "./MatrixBulkAnswerModal";

function AddDropdownField() {
  const [bulkModal, setBulkModal] = useState(false);
  const [isAddOther, setIsAddOther] = useState(false);
  const [isParagraph, setIsParagraph] = useState(false);
  const [validationType, setValidationType] = useState("validate");
  const [isChecked, setIsChecked] = useState(false);

  const handleChangePara = (e) => {
    setIsParagraph(e.target.value === "option1");
  };

  const [answerChoices, setAnswerChoices] = useState([
    { id: 1, value: "", checked: false, points: 0 },
  ]);
  const [selectAll, setSelectAll] = useState(false);
  const maxPoints = Math.max(
    ...answerChoices.map((choice) => choice.points),
    0
  );

  const toggleSelectAll = () => {
    const newCheckedState = !selectAll;
    setSelectAll(newCheckedState);
    setAnswerChoices((prev) =>
      prev.map((choice) => ({ ...choice, checked: newCheckedState }))
    );
  };

  const toggleChecked = (id) => {
    setAnswerChoices((prev) =>
      prev.map((choice) =>
        choice.id === id ? { ...choice, checked: !choice.checked } : choice
      )
    );
  };

  const onChangeAnswerChoice = (id, newValue) => {
    setAnswerChoices((prev) =>
      prev.map((choice) =>
        choice.id === id ? { ...choice, value: newValue } : choice
      )
    );
  };

  const incrementPoints = (id) => {
    setAnswerChoices((prev) =>
      prev.map((choice) =>
        choice.id === id ? { ...choice, points: choice.points + 1 } : choice
      )
    );
  };

  const decrementPoints = (id) => {
    setAnswerChoices((prev) =>
      prev.map((choice) =>
        choice.id === id && choice.points > 0
          ? { ...choice, points: choice.points - 1 }
          : choice
      )
    );
  };

  const addAnswerChoice = () => {
    setAnswerChoices([
      ...answerChoices,
      {
        id: answerChoices.length + 1,
        value: "",
        checked: selectAll,
        points: 0,
      },
    ]);
  };

  const removeAnswerChoice = (id) => {
    setAnswerChoices(answerChoices.filter((choice) => choice.id !== id));
  };
  // Handle checkbox change
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Row Section */}
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col col-span-2 border-t">
          <div className="flex gap-2">
            <div className="w-full mx-auto p-4">
              {isChecked && (
                <div className="flex justify-between mx-10">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="hidden"
                    />
                    <label
                      onClick={toggleSelectAll}
                      className="cursor-pointer text-sm"
                    >
                      Select correct answer below
                    </label>
                  </div>
                  <div className="mx-16">
                    <span className="cursor-pointer text-sm">Points</span>
                  </div>
                </div>
              )}

              {answerChoices.map((choice) => (
                <div
                  key={choice.id}
                  className="flex items-center space-x-3 mb-2 w-full"
                >
                  {isChecked && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={choice.checked}
                        onChange={() => toggleChecked(choice.id)}
                        className="hidden"
                      />
                      <div
                        className={`w-6 h-6 border-2 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${
                          choice.checked
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-gray-300 text-white border-gray-300"
                        }`}
                      >
                        <IoMdCheckmark />
                      </div>
                    </label>
                  )}
                  <input
                    type="text"
                    placeholder="Enter an answer choice"
                    className="flex-1 px-3 py-2 border rounded-md w-full"
                    value={choice.value}
                    onChange={(e) =>
                      onChangeAnswerChoice(choice.id, e.target.value)
                    }
                  />
                  {isChecked && (
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-gray-200"
                        onClick={() => decrementPoints(choice.id)}
                      >
                        <FiMinus className="w-4 h-4 text-gray-600" />
                      </button>
                      <input
                        type="number"
                        className="w-12 h-8 text-center border-t border-b border-gray-200"
                        value={choice.points}
                        readOnly
                      />
                      <button
                        className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-gray-200"
                        onClick={() => incrementPoints(choice.id)}
                      >
                        <FiPlus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={addAnswerChoice}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <AiOutlinePlusCircle size={20} />
                  </button>
                  {answerChoices.length > 1 && (
                    <button
                      onClick={() => removeAnswerChoice(choice.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <AiOutlineMinusCircle size={20} />
                    </button>
                  )}
                </div>
              ))}

              {isChecked && (
                <div className="mt-4 text-sm flex justify-end mx-24">
                  Max {maxPoints}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between col-span-2">
          <button className="text-blue-400 hover:underline">
            Reverse answer order
          </button>
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
      </div>
      <div className="col-span-4 flex items-center justify-start mt-3 border-t py-3 px-4">
        <input
          type="checkbox"
          id="scoreThisQuestion"
          className="mr-2 w-3 h-3"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label
          htmlFor="scoreThisQuestion"
          className="text-sm font-medium text-gray-600"
        >
          Score this question (enable quiz mode)
        </label>
      </div>
      <div className="col-span-4 flex items-center justify-start mt-3 border-t py-3 px-4 bg-yellow-50">
        <input
          type="checkbox"
          id="scoreThisQuestion"
          className="mr-2 w-3 h-3"
          disabled
        />
        <label htmlFor="" className="text-sm font-medium text-gray-200">
          Use previous answer choices (carry forward responses)
        </label>
      </div>
      <div className="border-t border-b">
        <div className="px-4 py-3 text-sm font-medium text-gray-600">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-3 h-3"
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
    </div>
  );
}

export default AddDropdownField;
