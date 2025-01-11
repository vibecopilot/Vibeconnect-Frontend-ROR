import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { useSelector } from "react-redux";
import { FaDownload } from "react-icons/fa";
const ReceiptInvoiceModal = ({ onclose }) => {
  const themeColor = useSelector((state) => state.theme.color);
  const [upload, setUpload] = useState([]);
  
    const handleFileChange = (event) => {
      const files = Array.from(event.target.files); // Convert FileList to array
      setUpload(files); // Store files as an array
    };
  return (
    <ModalWrapper onclose={onclose}>
      <div className="flex flex-col justify-center w-80">
        <h2 className="flex gap-4 items-center justify-center font-bold text-lg my-2">
          Import Invoice
        </h2>
        <div className="border-t-2 border-black">
          <div className="my-2">
            <div className="my-5 w-full">
              <input
                type="file"
                onChange={handleFileChange}
                multiple // Allows multiple files to be selected
              />
            </div>
            <button
              className="font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md w-full"
              style={{ background: themeColor }}
            >
              <FaDownload />
              Sample
            </button>
          </div>
        </div>
        <div className="flex justify-end border-t-2 py-5 border-black">
          <button
            className="p-1 px-4 border-2 rounded-md text-white font-medium"
            style={{ background: themeColor }}
          >
            Submit
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ReceiptInvoiceModal