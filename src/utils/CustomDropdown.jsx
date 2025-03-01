import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export const CustomDropdown = ({ AllSites, selectedValue, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // Always include "Select All Sites" as the first option
  const filteredSites = [
    { site_name: "Select All Sites" },
    ...AllSites.filter(
      (site) =>
        site && site.site_name.toLowerCase().includes(searchText.toLowerCase())
    ),
  ];

  // Close dropdown if clicking outside (but not on the button)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate the position of the dropdown relative to the button
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY, // account for scroll
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // The dropdown panel rendered via a portal so it’s not clipped
  const dropdownContent = (
    <div
      ref={dropdownRef}
      className="my-1 bg-white border border-gray-400 rounded-lg shadow-lg"
      style={{
        position: "absolute",
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 9999,
      }}
    >
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by text..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full p-2 border-b border-gray-300 rounded-t-lg focus:outline-none"
        autoComplete="off"
      />
      {/* Options list with fixed height; scroll enabled */}
      <div className="h-60 overflow-y-auto">
        {filteredSites.length === 0 ? (
          <div className="p-2 text-gray-500">No options found</div>
        ) : (
          filteredSites.map((site, index) => (
            <div
              key={index}
              onClick={() => {
                onSelect(site);
                setIsOpen(false);
                setSearchText("");
              }}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {site.site_name}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="relative w-full min-w-[100px] max-w-md">
      {/* Trigger button with ref and stopPropagation to prevent double toggling */}
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="bg-white w-full border border-gray-400 rounded-lg p-2 text-left"
      >
        {selectedValue?.site_name || "Select All Sites"}
      </button>
      {/* Render dropdown panel via portal */}
      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
};



