import React, { useState } from "react";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { FaHeart, FaSmile, FaStar, FaThumbsUp } from "react-icons/fa";

function AddStarField() {
  const [selectedShape, setSelectedShape] = useState("star");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [showColors, setShowColors] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [isAddOther, setIsAddOther] = useState(false);
  const [isParagraph, setIsParagraph] = useState(false);
  const [isNA, setIsNA] = useState(false);
  const [validationType, setValidationType] = useState("");
  const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFA500", "#800080"];

  const shapeIcons = {
    star: <FaStar size={25} color={selectedColor} />,
    smiley: <FaSmile size={25} color={selectedColor} />,
    heart: <FaHeart size={25} color={selectedColor} />,
    thumb: <FaThumbsUp size={25} color={selectedColor} />,
  };

  const [scale, setScale] = useState(5); // Default scale
  const [ratings, setRatings] = useState(
    Array.from({ length: scale }, (_, i) => ({
      stars: i + 1,
      label: "",
      weight: i + 1,
    }))
  );

  // Handle scale selection change
  const updateScale = (value) => {
    const newScale = parseInt(value, 10);
    setScale(newScale);

    // Adjust the ratings array based on the new scale
    setRatings((prevRatings) => {
      const updatedRatings = Array.from({ length: newScale }, (_, i) => ({
        stars: i + 1,
        label: prevRatings[i]?.label || "",
        weight: prevRatings[i]?.weight || i + 1,
      }));
      return updatedRatings;
    });
  };

  // Add a new rating field
  const addRating = () => {
    setRatings([
      ...ratings,
      { stars: ratings.length + 1, label: "", weight: ratings.length + 1 },
    ]);
  };

  // Remove a rating field
  const removeRating = (index) => {
    setRatings(ratings.filter((_, i) => i !== index));
  };

  // Update rating field values
  const updateRating = (index, field, value) => {
    const updatedRatings = ratings.map((rating, i) =>
      i === index ? { ...rating, [field]: value } : rating
    );
    setRatings(updatedRatings);
  };

  const handleChangePara = (event) => {
    setIsParagraph(event.target.value === "");
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="grid grid-cols-3 gap-5">
        <div className="flex flex-col mb-4">
          <label className="block text-gray-700 font-medium">Scale</label>
          <select
            className="w-full mt-1 p-2 border rounded"
            value={scale}
            onChange={(e) => updateScale(e.target.value)}
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 font-medium">Shape</label>
          <select
            className="w-full mt-1 p-2 border rounded"
            onChange={(e) => {
              setSelectedShape(e.target.value);
            }}
          >
            <option value="">Select a shape</option>
            <option value="star">Star</option>
            <option value="smiley">Smiley</option>
            <option value="heart">Heart</option>
            <option value="thumb">Thumb</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-700 font-medium">Color</label>
          <div className="flex space-x-5 items-start mt-1">
            <button
              className="w-8 h-8 rounded-md border"
              style={{ backgroundColor: selectedColor }}
              onClick={() => setShowColors(!showColors)}
            ></button>
            {selectedShape && (
              <div className="flex items-center space-x-2">
                <span>{shapeIcons[selectedShape]}</span>
              </div>
            )}
          </div>
          {showColors && (
            <div className="mt-2 flex gap-2 bg-white p-2 rounded-md shadow-md">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-md border"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setSelectedColor(color);
                    setShowColors(false); // Close the menu after selection
                  }}
                ></button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="border-t mt-5">
        <div className="p-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={isRating}
              onChange={() => setIsRating(!isRating)}
            />
            <span>Add rating labels</span>
          </label>

          {isRating && (
            <div className="w-full  flex flex-col my-5">
              {ratings.map((rating, index) => (
                <div key={index} className="flex flex-col space-y-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-16">
                      {rating.stars} Star{rating.stars > 1 ? "s" : ""}
                    </span>
                    <input
                      type="text"
                      placeholder="Enter a rating label"
                      value={rating.label}
                      onChange={(e) =>
                        updateRating(index, "label", e.target.value)
                      }
                      className="border px-2 py-1 flex-1 rounded"
                    />
                    <input
                      type="number"
                      value={rating.weight}
                      onChange={(e) =>
                        updateRating(index, "weight", e.target.value)
                      }
                      className="border px-2 py-1 w-16 text-center rounded"
                    />
                    {/* Add Button */}
                    <button onClick={addRating} className="text-green-600">
                      <AiOutlinePlusCircle size={20} />
                    </button>
                    {/* Remove Button (only if more than 1 rating exists) */}
                    {ratings.length > 1 && (
                      <button
                        onClick={() => removeRating(index)}
                        className="text-red-600"
                      >
                        <AiOutlineMinusCircle size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isNA && (
                <div className="w-full ml-[70px]">
                  <input
                    type="text"
                    placeholder="NA"
                    className="border px-2 py-1 flex-1 rounded w-[90%]"
                  />
                </div>
              )}
              <div className="flex gap-2 border-t mt-5 pt-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Use weights.</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={isNA}
                    onChange={() => setIsNA(!isNA)}
                  />
                  <span>Add a N/A column.</span>
                </label>
              </div>
            </div>
          )}
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

export default AddStarField;
