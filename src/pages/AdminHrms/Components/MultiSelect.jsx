import React, { useState } from "react";

const MultiSelect = ({
  title,
  options,
  selectedOptions,
  setSelectedOptions,
  handleSelect,
  disabled,
  setOptions,
  searchOptions,
}) => {
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  //   const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(options.map((option) => option.value));
    }
  };

  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    if (searchValue.trim() === "") {
      setOptions(searchOptions);
    } else {
      const filteredResults = searchOptions.filter((item) =>
        item.label.toLowerCase().includes(searchValue.toLowerCase())
      );
      setOptions(filteredResults);
    }
  };
  return (
    <div className="mb-4">
      <label className="block font-semibold">{title}</label>
      <div className="mb-4  relative">
        <button
          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
            disabled && "bg-gray-100"
          } `}
          onClick={toggleDropdown}
          disabled={disabled}
        >
          {selectedOptions.length === 0
            ? "Click Here to Select Component"
            : `${selectedOptions.length} Selected`}
        </button>
        {isDropdownVisible && (
          <div className="absolute z-10 w-full border rounded shadow p-2 mt-2 bg-white">
            <input
              type="text"
              name=""
              value={searchText}
              onChange={handleSearch}
              id=""
              className="border-b w-full  p-1 outline-none"
              placeholder="Search"
            />
            <div className="mb-2">
              <button
                className={`p-2 w-full text-left ${
                  selectedOptions.length === options.length
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
                onClick={handleSelectAll}
              >
                Select all
              </button>
            </div>
            {options.map((option) => (
              <div key={option.value} className="mb-2">
                <label className="inline-flex items-center hover:bg-blue-500 w-full p-1 hover:text-white">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5"
                    checked={selectedOptions.includes(option.value)}
                    onChange={() => handleSelect(option.value)}
                  />
                  <span className="ml-2">{option.label}</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
