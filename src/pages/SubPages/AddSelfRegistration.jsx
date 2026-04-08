import React, { useState, useRef, useCallback, useEffect } from "react";
import image from "/profile.png";
import { useSelector } from "react-redux";
import Webcam from "react-webcam";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import Select from "react-select";
import { API_URL } from "../../api";

const translations = {
  English: {
    title: "Self Registration",
    Visitor: "Visitor Type",
    visitorName: "Visitor Name",
    mobile: "Mobile Number",
    host: "Host",
    comingFrom: "Coming From",
    purpose: "Visit Purpose",
    selectPurpose: "Select Purpose",
    meeting: "Meeting",
    delivery: "Delivery",
    personal: "Personal",
    fitout: "Fitout Staff",
    other: "Other",
    cancel: "Cancel",
    submit: "Submit",
    guest: "Guest",
    visitorNamePlaceholder: "Enter Visitor Name",
    mobilePlaceholder: "Enter 10 digit mobile number",
    comingFromPlaceholder: "Enter Origin",
    hostPlaceholder: "Search Host...",
    capture: "Capture",
    close: "Close",
    thankYouTitle: "Registration Successful!",
    thankYouMsg: "Thank you for registering. Your host will be notified shortly.",
    registerAnother: "Register Another",
  },
  Hindi: {
    title: "स्वयं पंजीकरण",
    Visitor: "आगंतुक प्रकार",
    visitorName: "आगंतुक का नाम",
    mobile: "मोबाइल नंबर",
    host: "होस्ट",
    comingFrom: "कहां से आए हैं",
    purpose: "आने का उद्देश्य",
    selectPurpose: "उद्देश्य चुनें",
    meeting: "मीटिंग",
    delivery: "डिलीवरी",
    personal: "व्यक्तिगत",
    fitout: "फिटआउट स्टाफ",
    other: "अन्य",
    cancel: "रद्द करें",
    submit: "सबमिट",
    guest: "अतिथि",
    visitorNamePlaceholder: "आगंतुक का नाम दर्ज करें",
    mobilePlaceholder: "10 अंकों का मोबाइल नंबर दर्ज करें",
    comingFromPlaceholder: "कहां से आए हैं दर्ज करें",
    hostPlaceholder: "होस्ट खोजें...",
    capture: "कैप्चर करें",
    close: "बंद करें",
    thankYouTitle: "पंजीकरण सफल!",
    thankYouMsg: "पंजीकरण के लिए धन्यवाद। आपके होस्ट को शीघ्र ही सूचित किया जाएगा।",
    registerAnother: "एक और पंजीकरण करें",
  },
  Marathi: {
    title: "स्वयं नोंदणी",
    Visitor: "पाहुण्याचा प्रकार",
    visitorName: "पाहुण्याचे नाव",
    mobile: "मोबाईल क्रमांक",
    host: "होस्ट",
    comingFrom: "कोठून आले",
    purpose: "भेटीचा उद्देश",
    selectPurpose: "उद्देश निवडा",
    meeting: "बैठक",
    delivery: "डिलिव्हरी",
    personal: "वैयक्तिक",
    fitout: "फिटआउट कर्मचारी",
    other: "इतर",
    cancel: "रद्द करा",
    submit: "सबमिट करा",
    guest: "पाहुणे",
    visitorNamePlaceholder: "पाहुण्याचे नाव प्रविष्ट करा",
    mobilePlaceholder: "10 अंकी मोबाईल क्रमांक प्रविष्ट करा",
    comingFromPlaceholder: "कोठून आले ते प्रविष्ट करा",
    hostPlaceholder: "होस्ट शोधा...",
    capture: "कॅप्चर करा",
    close: "बंद करा",
    thankYouTitle: "नोंदणी यशस्वी!",
    thankYouMsg: "नोंदणीसाठी धन्यवाद. तुमच्या होस्टला लवकरच कळवले जाईल.",
    registerAnother: "आणखी एक नोंदणी करा",
  },
};

const AddSelfRegistration = () => {
  const [language, setLanguage] = useState("English");
  const t = translations[language];
  const [selectedVisitorType, setSelectedVisitorType] = useState(
    "Guest-SelfRegistration",
  );
  const [showWebcam, setShowWebcam] = useState(false);
  const [hosts, setHosts] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Get siteId from URL params — works without login
  const { id: siteId } = useParams();

  // Get token from URL query string — admin bakes it into the QR code URL
  const location = useLocation();
  const urlToken = new URLSearchParams(location.search).get("token");

  // themeColor from Redux (may be undefined if not logged in) — fallback to brand color
  const themeColor = useSelector((state) => state.theme?.color) || "#1a1a2e";

  const [capturedImage, setCapturedImage] = useState(null);

  const [formData, setFormData] = useState({
    visitorName: "",
    mobile: "",
    purpose: "",
    comingFrom: "",
    host: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenCamera = () => setShowWebcam(true);
  const handleCloseCamera = () => setShowWebcam(false);

  const handleVisitorTypeChange = (e) => {
    setSelectedVisitorType(e.target.value);
  };

  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setShowWebcam(false);
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  // Fetch hosts using siteId + token from QR URL
  useEffect(() => {
    const fetchHosts = async () => {
      if (!siteId) return;
      try {
        const response = await axios.get(
          `${API_URL}/visitors/fetch_potential_hosts.json?site_id=${siteId}`,
          { params: { token: urlToken } },
        );
        if (response?.data?.hosts) {
          setHosts(response.data.hosts);
        } else {
          setHosts([]);
        }
      } catch (error) {
        console.error("Error fetching hosts:", error.response?.data || error);
      }
    };
    fetchHosts();
  }, [siteId, urlToken]);

  const hostOptions = hosts.map((host) => ({
    value: host.id,
    label: host.full_name || host.name,
  }));

  const handleSubmit = async () => {
    if (!formData.visitorName || !formData.mobile || !formData.purpose) {
      return toast.error("All fields are required");
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      return toast.error("Mobile number must be 10 digits");
    }

    if (!formData.host) {
      return toast.error("Please select Host");
    }

    const postData = new FormData();
    postData.append("visitor[created_by_id]", siteId);
    postData.append("visitor[name]", formData.visitorName);
    postData.append("visitor[contact_no]", formData.mobile);
    postData.append("visitor[purpose]", formData.purpose);
    postData.append("visitor[coming_from]", formData.comingFrom);
    postData.append("visitor[visit_type]", selectedVisitorType);
    postData.append("visitor[host_ids][]", formData.host);

    if (capturedImage) {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      postData.append("visitor[profile_pic]", blob, "visitor.jpg");
    }

    try {
      toast.loading("Submitting registration...");
      // Pass the token from the QR URL so the API accepts the request
      await axios.post(`${API_URL}/visitors.json`, postData, {
        params: { token: urlToken },
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.dismiss();
      toast.success("Self Registration Added Successfully");
      setSubmitted(true);
    } catch (error) {
      toast.dismiss();
      console.error(error.response?.data || error);
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setCapturedImage(null);
    setFormData({ visitorName: "", mobile: "", purpose: "", comingFrom: "", host: "" });
    setSelectedVisitorType("Guest-SelfRegistration");
  };

  // ── Thank-You Screen ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: themeColor }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{t.thankYouTitle}</h2>
          <p className="text-gray-500 mb-8">{t.thankYouMsg}</p>
          <button
            onClick={handleReset}
            className="font-semibold py-2 px-6 rounded-lg text-white transition-opacity hover:opacity-80"
            style={{ background: themeColor }}
          >
            {t.registerAnother}
          </button>
        </div>
      </div>
    );
  }

  // ── Registration Form ─────────────────────────────────────────────────────
  return (
    <div className="m-3 justify-center items-center w-full md:mx-5">
      <div className="md:border rounded-lg md:p-4 w-full">
        <h2
          className="text-center md:text-xl font-bold p-2 bg-black rounded-full text-white"
          style={{ background: themeColor }}
        >
          {t.title}
        </h2>
        <br />

        {/* Photo capture */}
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
                  {t.capture}
                </button>
                <button
                  onClick={handleCloseCamera}
                  className="bg-red-400 rounded-md text-white p-1 px-4"
                >
                  {t.close}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Language selector */}
        <div className="absolute right-20 top-30">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="" disabled>
              Select Language
            </option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
          </select>
        </div>

        {/* Visitor type */}
        <div className="flex md:flex-row flex-col my-5 gap-10">
          <div className="flex gap-2 flex-col">
            <h2 className="font-semibold">{t.Visitor} :</h2>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="Guest"
                  name="attendance"
                  value="Guest"
                  checked={selectedVisitorType === "Guest-SelfRegistration"}
                  onChange={handleVisitorTypeChange}
                />
                <label htmlFor="Guest" className="font-semibold">
                  {t.guest}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="grid gap-2 items-center w-full">
            <label className="font-semibold">{t.visitorName}</label>
            <input
              type="text"
              name="visitorName"
              value={formData.visitorName}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder={t.visitorNamePlaceholder}
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="mobileNumber" className="font-semibold">
              {t.mobile} :
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  setFormData({ ...formData, mobile: value });
                }
              }}
              className="border p-2 rounded w-full"
              placeholder={t.mobilePlaceholder}
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label className="font-semibold">{t.host} :</label>
            <Select
              options={hostOptions}
              placeholder={t.hostPlaceholder}
              onChange={(selectedOption) =>
                setFormData({ ...formData, host: selectedOption?.value })
              }
              isSearchable
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="comingFrom" className="font-semibold">
              {t.comingFrom} :
            </label>
            <input
              type="text"
              id="comingFrom"
              className="border border-gray-400 p-2 rounded-md"
              placeholder={t.comingFromPlaceholder}
              name="comingFrom"
              value={formData.comingFrom}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="purpose" className="font-semibold">
              {t.purpose} :
            </label>
            <select
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded-md"
            >
              <option value="">{t.selectPurpose}</option>
              <option value="Meeting">{t.meeting}</option>
              <option value="Delivery">{t.delivery}</option>
              <option value="Personal">{t.personal}</option>
              <option value="Fitout Staff">{t.fitout}</option>
              <option value="Other">{t.other}</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end items-center my-4 mb-10 md:mx-5">
          <button
            className="bg-green-500 text-white hover:bg-green-600 font-semibold py-2 px-6 rounded"
            onClick={handleSubmit}
            style={{ background: themeColor }}
          >
            {t.submit}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSelfRegistration;