import React, { useState, useRef, useCallback, useEffect } from "react";
import image from "/profile.png";
import { useSelector } from "react-redux";
import Webcam from "react-webcam";
import { postNewVisitor } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
const AddSelfRegistration = () => {
  const [selectedVisitorType, setSelectedVisitorType] = useState("Guest");
  const [showWebcam, setShowWebcam] = useState(false);
  const [hosts, setHosts] = useState([]);
  // const siteId = getItemInLocalStorage("SITEID");
  const [capturedImage, setCapturedImage] = useState(null);
  const { id } = useParams();
  console.log(id);
  const [formData, setFormData] = useState({
    visitorName: "",
    mobile: "",
    purpose: "",
    comingFrom: "",
    host: "",
  });

  console.log("Host", hosts);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const pathSegments = location.pathname.split("/");
  const siteId = pathSegments[pathSegments.length - 1];
  useEffect(() => {
    const fetchUsers = async () => {
      try {

        if (!token) {
          console.error("Site ID or token is missing in the URL");
          return;   
        }

        console.log("Extracted site_id:", siteId);
        console.log("Extracted token:", token);
        const usersResp = await axios.get(
          `https://admin.vibecopilot.ai/visitors/fetch_potential_hosts.json`,
          {
            params: { site_id: siteId, token: token },
          }
        );

        console.log("API Response:", usersResp.data);

        if (usersResp.data.hosts) {
          setHosts(usersResp.data.hosts);
        } else {
          console.error("Hosts data missing in response:", usersResp.data);
        }
      } catch (error) {
        console.error(
          "Error fetching hosts:",
          error.response ? error.response.data : error
        );
      }
    };

    fetchUsers();
  }, [location]);

  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (
      formData.visitorName === "" ||
      formData.purpose === "" ||
      formData.mobile === ""
    ) {
      return toast.error("All fields are Required");
    }

    const mobilePattern = /^\d{10}$/;
    if (!mobilePattern.test(formData.mobile)) {
      return toast.error("Mobile number must be  10 digits.");
    }

    const postData = new FormData();
    postData.append("visitor[created_by_id]", siteId);
    postData.append("visitor[vhost_id]", formData.host);
    postData.append("visitor[name]", formData.visitorName);
    postData.append("visitor[contact_no]", formData.mobile);
    postData.append("visitor[purpose]", formData.purpose);
    postData.append("visitor[coming_from]", formData.comingFrom);
    postData.append("visitor[visit_type]", selectedVisitorType);

    if (capturedImage) {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      postData.append("visitor[profile_pic]", blob, "visitor_image.jpg");
    }

    try {
      toast.loading("Creating new visitor Please wait!");
      const visitResp = await axios.post(
        `https://admin.vibecopilot.ai/visitors.json`,
        postData,
        {
          params: { token: token },
        }
      );
      const visitorId = visitResp.data.id;
      navigate(
        `/admin/passes/self-registration-details/${visitorId}?token=${token}`
      );
      toast.dismiss();
      toast.success("Self Registration Added Successfully");
    } catch (error) {
      console.log(error);
      toast.dismiss();
    }
  };
  return (
    <div className="flex justify-center items-center  w-full p-4">
      <div className="md:border border-gray-300 rounded-lg md:p-4 w-full md:mx-4 ">
        <h2
          style={{ background: themeColor }}
          className="text-center md:text-xl font-bold p-2 bg-black rounded-full text-white"
        >
          Self Registration
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
              value={formData.visitorName}
              onChange={handleChange}
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
              value={formData.mobile}
              onChange={handleChange}
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
              value={formData.host}
              onChange={handleChange}
            >
              <option value="">Select Person to meet</option>
              {hosts.map((host) => (
                <option value={host.id} key={host.id}>
                  {host.name}
                </option>
              ))}
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
              value={formData.comingFrom}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="purpose" className="font-semibold">
              Visit Purpose:
            </label>
            <select
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
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
          <button
            className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSelfRegistration;
