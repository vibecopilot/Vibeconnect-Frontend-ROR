import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiPlus, PiPlusCircle } from "react-icons/pi";

const AddThirdPartyUser = ({onclose}) => {
  const handleInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 12) {
      value = value.slice(0, 12);
    }
    let formattedValue =
      value
        .match(/.{1,4}/g)
        ?.join("-")
        .slice(0, 14) || "";
    setAadhar(formattedValue);
  };
  const [otpBtn, setOtpBtn] = useState(false);
  const [aadhar, setAadhar] = useState("");
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-xl  w-[60%] transition-transform duration-500 ease-in-out">
          <div className="flex justify-center border-b">
            <h1 className="text-xl font-medium text-center  flex items-center gap-2">
              <PiPlusCircle /> Add Third Party User
            </h1>
          </div>
        <div className="max-h-80 overflow-y-auto  transition-transform duration-500 ease-in-out p-1">
          <div className="flex gap-2 items-end">
            <div className="flex flex-col gap-1">
              <label className="font-medium">Aadhaar Number</label>
              <input
                type="text"
                id="aadharInput"
                value={aadhar}
                onChange={handleInputChange}
                maxLength={14}
                className="border border-gray-300 p-2 w-60 rounded"
                placeholder="xxxx-xxxx-xxxx"
              />
            </div>
            <div>
              {!otpBtn && (
                <button
                  className="bg-green-500 p-2 px-3 rounded text-white"
                  onClick={() => setOtpBtn(!otpBtn)}
                >
                  Send OTP
                </button>
              )}
            </div>
            {otpBtn && (
              <div className="flex gap-2">
                <input
                  type="text"
                  id="otpInput"
                  value=""
                  maxLength={6}
                  className="border border-gray-300 p-2 w-60 rounded"
                  placeholder="Enter OTP"
                />
                <button
                  className="bg-green-500 p-2 px-3 rounded text-white"
                  onClick={() => setOtpBtn(!otpBtn)}
                >
                  Verify
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 my-2">
            <div className="flex gap-1 flex-col">
              <label className="block text-gray-700 font-medium">
                First Name :
              </label>
              <input
                type="text"
                name="name"
                className="border border-gray-300 p-2 w-full rounded "
                placeholder="Enter First Name"
              />
            </div>
            <div className="flex gap-1 flex-col">
              <label className="block text-gray-700 font-medium">
                Last Name :
              </label>
              <input
                type="text"
                name="name"
                className="border border-gray-300 p-2 w-full rounded "
                placeholder="Enter Last Name"
              />
            </div>
            <div className="flex gap-1 flex-col">
              <label className="block text-gray-700 font-medium">Email :</label>
              <input
                type="email"
                name="email"
                className="border border-gray-300 p-2 w-full rounded "
                placeholder="Enter Email"
              />
            </div>
            <div className="flex gap-1 flex-col">
              <label className="block text-gray-700 font-medium">
                Mobile No. :
              </label>
              <input
                type="text"
                name="mobile"
                className="border border-gray-300 p-2 rounded w-full"
                pattern="[0-9]*"
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight"
                  ) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter Mobile No."
              />
            </div>
            <div className="flex gap-1 flex-col">
              <label className="block text-gray-700 font-medium">
                Select Gender :
              </label>
              <select className="border border-gray-300 p-2 rounded w-full">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-gray-700 font-medium">
              Permanent Address :
            </label>
            <textarea
              name="permanentAddress"
              cols="10"
              rows="2"
              className="border border-gray-300 p-2  rounded w-full"
              placeholder="Enter permanent address"
            ></textarea>
          </div>
          <div className="flex flex-col gap-1 mt-1">
            <label className="block text-gray-700 font-medium">
              Temporary Address :
            </label>
            <textarea
              name="temporaryAddress"
              cols="10"
              rows="2"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Enter temporary address"
            ></textarea>
          </div>
        </div>
        <div className="flex justify-center border-t mt-1 p-1">
          <button
            className=" ml-2 bg-red-500 text-white py-2 px-4 rounded-md flex items-center gap-2"
            onClick={() => onclose(false)}
          >
            <MdClose /> Close
          </button>
          <button
            className=" ml-2 bg-green-400 text-white py-2 px-4 rounded-md flex items-center gap-2"
            //   onClick={handleNext}
          >
            <FaCheck /> Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddThirdPartyUser;
