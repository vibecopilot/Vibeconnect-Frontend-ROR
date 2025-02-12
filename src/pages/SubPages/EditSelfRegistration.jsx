import React, { useState, useRef, useCallback } from "react";
import image from "/profile.png";
import { useSelector } from "react-redux";
import Webcam from "react-webcam";
const EditSelfRegistration = () => {
  const [selectedVisitorType, setSelectedVisitorType] = useState("Guest");
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const handleOpenCamera = () => {
    setShowWebcam(true);
  };

  const handleCloseCamera = () => {
    setShowWebcam(false);
  };

  const handleVisitorTypeChange = (e) => {
    setSelectedVisitorType(e.target.value);
  };
  const themeColor = useSelector((state) => state.theme.color);
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
    setShowWebcam(false);
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  return (
    <div className="flex justify-center items-center  w-full p-4">
      <div className="md:border border-gray-300 rounded-lg md:p-4 w-full md:mx-4 ">
        <h2
          style={{ background: themeColor }}
          className="text-center md:text-xl font-bold p-2 bg-black rounded-full text-white"
        >
          Edit Self Registration
        </h2>
        <br />
        <div className="flex justify-center">
          {!showWebcam ? (
            <button onClick={handleOpenCamera}>
              <img
                src={capturedImage || image}
                alt="Uploaded"
                className="border-4 border-gray-300 rounded-full w-40 h-40 object-cover"
              />
            </button>
          ) : (
            <div>
              <div className="rounded-full">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="rounded-full w-60 h-60 object-cover"
                />
              </div>
              <div className="flex gap-2 justify-center my-2 items-center">
                <button
                  onClick={capture}
                  className="bg-green-400 rounded-md text-white p-1 px-4"
                >
                  Capture
                </button>
                <button
                  onClick={handleCloseCamera}
                  className="bg-red-400 rounded-md text-white p-1 px-4"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex md:flex-row flex-col  my-5 gap-10">
          <div className="flex gap-2 flex-col">
            <h2 className="font-semibold">Visitor Type :</h2>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="Guest"
                  name="attendance"
                  value="Guest"
                  checked={selectedVisitorType === "Guest"}
                  onChange={handleVisitorTypeChange}
                />
                <label htmlFor="Guest" className="font-semibold ">
                  Guest
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="visitorName" className="font-semibold">
              Visitor Name:
            </label>
            <input
              type="text"
              name="visitorName"
              id="visitorName"
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Visitor Name"
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="mobileNumber" className="font-semibold">
              Mobile Number :
            </label>
            <input
              type="number"
              name="mobile"
              id="mobileNumber"
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Mobile Number"
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="" className="font-medium">
              Host :
            </label>
            <select
              className="border border-gray-400 p-2 rounded-md"
              name="host"
            >
              <option value="">Select Person to meet</option>
            </select>
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="comingFrom" className="font-semibold">
              Coming from:
            </label>
            <input
              type="text"
              id="comingFrom"
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Origin"
              name="comingFrom"
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="purpose" className="font-semibold">
              Visit Purpose:
            </label>
            <select
              id="purpose"
              name="purpose"
              className="border border-gray-400 p-2 rounded-md"
            >
              <option value="">Select Purpose</option>
              <option value="Meeting">Meeting</option>
              <option value="Delivery">Delivery</option>
              <option value="Personal">Personal</option>
              <option value="Fitout Staff">Fitout Staff</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex gap-5 justify-center items-center my-4 mb-10">
          <button className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSelfRegistration;
