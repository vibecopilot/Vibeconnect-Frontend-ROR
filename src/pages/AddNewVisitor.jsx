import { useState, useRef, useEffect, useCallback } from "react";
import image from "/profile.png";
import { FaTrash } from "react-icons/fa";
import { getItemInLocalStorage } from "../utils/localStorage";
import toast from "react-hot-toast";
import {
  getHostList,
  getParkingConfig,
  getVisitorStaffCategory,
  postNewGoods,
  postNewVisitor,
  uploadVisitorLicense,
  uploadVisitorConsignment,
} from "../api";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import FileInputBox from "../containers/Inputs/FileInputBox";

const AddNewVisitor = () => {
  const siteId = getItemInLocalStorage("SITEID");
  const userId = getItemInLocalStorage("UserId");
  const companyId = getItemInLocalStorage("COMPANYID");
  const isCompany55 = companyId == 55;
  const expectedDateLabel = isCompany55 ? "Planned Date" : "Expected Date";
  const expectedTimeLabel = isCompany55 ? "Planned Time" : "Expected Time";
  const navigate = useNavigate();

  const themeColor = "#222";
  const currentDate = new Date().toISOString().split("T")[0];
  const todayDate = currentDate;

  const [behalf] = useState("Visitor"); // kept (if used later)
  const [visitors, setVisitors] = useState([{ name: "", mobile: "" }]);
  const [selectedFrequency, setSelectedFrequency] = useState("Once");
  const [selectedVisitorType, setSelectedVisitorType] = useState("Guest");
  const [hosts, setHosts] = useState([]);
  const [staffCategories, setStaffCategories] = useState([]);
  const [slots, setSlots] = useState([]);
  const [passStartDate, setPassStartDate] = useState("");
  const [passEndDate, setPassEndDate] = useState("");

  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);

  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [weekdaysMap, setWeekdaysMap] = useState([
    { day: "Mon", index: 0, isActive: false },
    { day: "Tue", index: 1, isActive: false },
    { day: "Wed", index: 2, isActive: false },
    { day: "Thu", index: 3, isActive: false },
    { day: "Fri", index: 4, isActive: false },
    { day: "Sat", index: 5, isActive: false },
    { day: "Sun", index: 6, isActive: false },
  ]);

  const [formData, setFormData] = useState({
    visitorName: "",
    mobile: "",
    purpose: "",
    comingFrom: "",
    vehicleNumber: "",
    expectedDate: currentDate,
    expectedTime: "",
    hostApproval: false,
    goodsInward: false,
    license: false,
    consignment: false,
    host: "",
    passNumber: "",
    noOfGoods: "",
    goodsDescription: "",
    goodsAttachments: [],
    licenseAttachments: [],
    consignmentAttachments: [],
    supportCategory: "",
    slotNumber: "",
  });

  const getHeadingText = () => "NEW VISITOR";

  // ✅ Safety helpers (prevents runtime crashes + handles different API shapes)
  const safeArray = (val) => {
    if (Array.isArray(val)) return val;
    if (val && typeof val === "object") {
      if (Array.isArray(val.data)) return val.data;
      if (Array.isArray(val.hosts)) return val.hosts;
      if (Array.isArray(val.users)) return val.users;
      if (Array.isArray(val.results)) return val.results;
    }
    return [];
  };

  const safeHosts = safeArray(hosts);
  const safeSlots = safeArray(slots);
  const safeStaffCategories = safeArray(staffCategories);

  // ✅ File normalizer (supports: File, {file}, {originFileObj}, FileList, array)
  const normalizeFileArray = (files) => {
    const raw = Array.isArray(files) ? files : Array.from(files || []);
    return raw
      .map((f) => {
        if (f instanceof File) return f;
        if (f?.file instanceof File) return f.file;
        if (f?.originFileObj instanceof File) return f.originFileObj;
        if (f?.blob instanceof File) return f.blob;
        return null;
      })
      .filter(Boolean);
  };

useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const [usersResp, visitorCat, parkingRes] = await Promise.all([
        getHostList(siteId),
        getVisitorStaffCategory(),
        getParkingConfig(),
      ]);

      // ✅ host list normalization
      setHosts(safeArray(usersResp?.data));

      // ✅ FIXED: Correct key + filter null names
      const categoriesData =
        visitorCat?.data?.staff_categories || [];

      const filteredCategories = categoriesData.filter(
        (cat) => cat?.name && cat.name.trim() !== ""
      );

      setStaffCategories(filteredCategories);

      // ✅ parking normalization
      let parkingSlots = [];
      if (Array.isArray(parkingRes?.data)) parkingSlots = parkingRes.data;
      else if (Array.isArray(parkingRes?.data?.slots)) parkingSlots = parkingRes.data.slots;
      else if (Array.isArray(parkingRes?.data?.parking_slots))
        parkingSlots = parkingRes.data.parking_slots;
      else if (Array.isArray(parkingRes?.data?.data))
        parkingSlots = parkingRes.data.data;

      setSlots(safeArray(parkingSlots));

    } catch (error) {
      console.error("Error fetching initial data:", error?.response?.data || error);
      toast.error("Failed to load hosts, categories, or parking slots.");
      setSlots([]);
      setHosts([]);
      setStaffCategories([]);
    }
  };

  fetchInitialData();
}, [siteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
      ...(name === "license" && !checked ? { licenseAttachments: [] } : {}),
      ...(name === "consignment" && !checked ? { consignmentAttachments: [] } : {}),
    }));
  };

  const handleFrequencyChange = (e) => setSelectedFrequency(e.target.value);

  const handleVisitorTypeChange = (e) => {
    setSelectedVisitorType(e.target.value);
    if (e.target.value !== "Support Staff") {
      setFormData((prev) => ({ ...prev, supportCategory: "" }));
    }
  };

  /**
   * ✅ BIG FIX:
   * FileInputBox kabhi direct files bhejta hai, kabhi event, kabhi {fileList}.
   * Is function se sab cases handle ho jayenge — warna attachments empty reh jaate hain
   * aur upload call hi nahi hota.
   */
  const handleFileChange = (input, fieldName) => {
    let files = input;

    // normal <input type="file" /> event
    if (input?.target?.files) files = input.target.files;

    // antd Upload like shapes
    else if (Array.isArray(input?.fileList)) files = input.fileList;

    // custom wrapper
    else if (Array.isArray(input?.files)) files = input.files;

    const normalized = normalizeFileArray(files);

    // 🔎 debug (remove later if you want)
    // console.log("FILE SET:", fieldName, normalized);

    setFormData((prev) => ({ ...prev, [fieldName]: normalized }));
  };

  const handlePassStartDateChange = (event) => {
    const selectedDateTime = event.target.value ? event.target.value + ":00" : "";
    setPassStartDate(selectedDateTime);

    if (passEndDate && selectedDateTime && selectedDateTime > passEndDate) {
      setPassEndDate("");
      toast.error("End date cannot be earlier than the start date.");
    }
  };

  const handlePassEndDateChange = (event) => {
    const selectedDateTime = event.target.value ? event.target.value + ":00" : "";

    if (passStartDate && selectedDateTime && selectedDateTime < passStartDate) {
      toast.error("End date cannot be earlier than the start date.");
      return;
    }
    setPassEndDate(selectedDateTime);
  };

  const handleAddVisitor = (event) => {
    event.preventDefault();
    const lastVisitor = visitors[visitors.length - 1];
    if (lastVisitor && lastVisitor.name === "" && lastVisitor.mobile === "") {
      return toast.error("Please fill the current additional visitor's details first.");
    }
    setVisitors((prev) => [...prev, { name: "", mobile: "" }]);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    setVisitors((prev) => {
      const newVisitors = [...prev];
      newVisitors[index][name] = value;
      return newVisitors;
    });
  };

  const handleRemoveVisitor = (index) => {
    setVisitors((prev) => {
      const newVisitors = [...prev];
      newVisitors.splice(index, 1);
      return newVisitors;
    });
  };

  const handleOpenCamera = () => setShowWebcam(true);
  const handleCloseCamera = () => setShowWebcam(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setShowWebcam(false);
    setCapturedImage(imageSrc);
  }, []);

  const handleWeekdaySelection = (weekday) => {
    const index = weekdaysMap.find((dayObj) => dayObj.day === weekday)?.index;
    if (index === undefined) return;

    setWeekdaysMap((prevMap) =>
      prevMap.map((dayObj) =>
        dayObj.index === index ? { ...dayObj, isActive: !dayObj.isActive } : dayObj
      )
    );

    setSelectedWeekdays((prevSelectedWeekdays) =>
      prevSelectedWeekdays.includes(weekday)
        ? prevSelectedWeekdays.filter((day) => day !== weekday)
        : [...prevSelectedWeekdays, weekday]
    );
  };

  // ✅ API expects "HH:MM:SS"
  const normalizeTimeWithSeconds = (t) => {
    if (!t) return "";
    if (typeof t !== "string") return String(t);
    if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
    if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
    return t;
  };

  // ✅ Upload docs using required API keys
  const uploadVisitorDocs = async ({ visitorId, licenseFiles = [], consignmentFiles = [] }) => {
    const safeLicenseFiles = normalizeFileArray(licenseFiles);
    const safeConsignmentFiles = normalizeFileArray(consignmentFiles);

    // 🔎 debug (remove later)
    // console.log("LICENSE FILES:", safeLicenseFiles);
    // console.log("CONSIGNMENT FILES:", safeConsignmentFiles);

    // license
    if (safeLicenseFiles.length > 0) {
      const fd = new FormData();
     fd.append("visitor[visitor_id]", String(visitorId));

safeLicenseFiles.forEach((file) =>
  fd.append("visitor[visitor_license][]", file, file.name)
);

      try {
        // ⚠️ If your axios instance forces JSON headers, fix it in ../api (multipart/form-data).
        await uploadVisitorLicense(fd);
      } catch (err) {
        console.log("License upload error:", err?.response?.data || err);
        toast.error("Visitor created but license upload failed");
      }
    }

    // consignment
    if (safeConsignmentFiles.length > 0) {
      const fd = new FormData();
    fd.append("visitor[visitor_id]", String(visitorId));

safeConsignmentFiles.forEach((file) =>
  fd.append("visitor[visitor_consignment][]", file, file.name)
);
      try {
        // ⚠️ If your axios instance forces JSON headers, fix it in ../api (multipart/form-data).
        await uploadVisitorConsignment(fd);
      } catch (err) {
        console.log("Consignment upload error:", err?.response?.data || err);
        toast.error("Visitor created but consignment upload failed");
      }
    }
  };

  const createNewVisitor = async (e) => {
    e.preventDefault();

    if (formData.visitorName === "" || formData.purpose === "" || formData.mobile === "") {
      return toast.error("Visitor Name, Mobile, and Purpose are Required");
    }

    const mobile = String(formData.mobile || "").replace(/\D/g, "");
    const mobilePattern = /^\d{10}$/;
    if (!mobilePattern.test(mobile)) {
      return toast.error("Mobile number must be 10 digits.");
    }

    const apiVisitType = selectedVisitorType === "Support Staff" ? "support_staff" : "guest";
    const apiFrequency = selectedFrequency === "Frequently" ? "frequently" : "once";

    const postData = new FormData();
    postData.append("visitor[site_id]", siteId);
    postData.append("visitor[created_by_id]", userId);
    postData.append("visitor[vhost_id]", formData.host);
    postData.append("visitor[name]", formData.visitorName);

    if (apiVisitType === "support_staff" && formData.supportCategory) {
      postData.append("visitor[visitor_staff_category_id]", formData.supportCategory);
    }

    postData.append("visitor[contact_no]", mobile);
    postData.append("visitor[purpose]", formData.purpose);

    // pass dates
    postData.append("visitor[start_pass]", passStartDate);
    postData.append("visitor[end_pass]", passEndDate);
    postData.append("visitor[pass_start_date]", passStartDate);
    postData.append("visitor[pass_end_date]", passEndDate);

    postData.append("visitor[coming_from]", formData.comingFrom);
    postData.append("visitor[vehicle_number]", formData.vehicleNumber);
    postData.append("visitor[expected_date]", formData.expectedDate);
    postData.append("visitor[expected_time]", normalizeTimeWithSeconds(formData.expectedTime));

    postData.append("visitor[skip_host_approval]", formData.hostApproval ? "1" : "0");
    postData.append("visitor[goods_inwards]", formData.goodsInward ? "1" : "0");
    postData.append("visitor[visit_type]", apiVisitType);
    postData.append("visitor[frequency]", apiFrequency);
    postData.append("visitor[pass_number]", formData.passNumber || "");

    if (formData.slotNumber) postData.append("visitor[parking_slot_id]", formData.slotNumber);

    // webcam -> profile_picture
    if (capturedImage) {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      postData.append("visitor[profile_picture]", blob, "visitor_image.jpg");
    }

    // working_days if frequently
    if (apiFrequency === "frequently") {
      selectedWeekdays.forEach((day) => postData.append("visitor[working_days][]", day));
    }

    // extra visitors
    visitors.forEach((extraVisitor, index) => {
      const name = (extraVisitor.name || "").trim();
      const mob = String(extraVisitor.mobile || "").replace(/\D/g, "");

      if (name || mob) {
        postData.append(`visitor[extra_visitors_attributes][${index}][name]`, name);
        postData.append(`visitor[extra_visitors_attributes][${index}][contact_no]`, mob);
      }
    });

    try {
      toast.loading("Creating new visitor, please wait...", { id: "createVisitor" });

      const visitResp = await postNewVisitor(postData);
      const visitorId = visitResp?.data?.id || visitResp?.data?.visitor?.id;

      if (!visitorId) {
        toast.dismiss("createVisitor");
        console.error("No visitorId in response:", visitResp?.data);
        return toast.error("Visitor created but visitor ID not received.");
      }

      // ✅ upload license/consignment AFTER create
      // await uploadVisitorDocs({
      //   visitorId,
      //   licenseFiles: formData.licenseAttachments || [],
      //   consignmentFiles: formData.consignmentAttachments || [],
      // });

    // LICENSE UPLOAD
    console.log("licenseAttachments:", formData.licenseAttachments);
if (formData.license && formData.licenseAttachments?.length > 0) {

  const fd = new FormData();

  fd.append("visitor_id", visitorId);

  formData.licenseAttachments.forEach((file) => {
    fd.append("file", file);
  });

  try {
    const res = await uploadVisitorLicense(fd);
    console.log("License uploaded:", res.data);
  } catch (err) {
    console.log("License upload error:", err?.response?.data || err);
  }

}

// CONSIGNMENT UPLOAD
if (formData.consignment && formData.consignmentAttachments.length > 0) {

  const fd = new FormData();

  // fd.append("visitor_consignment[visitor_id]", visitorId);
     fd.append("visitor_consignment[visitor_id]", String(visitorId));
 formData.consignmentAttachments.forEach((file) => {
  fd.append("visitor_consignment[file]", file);
});
  try {
    await uploadVisitorConsignment(fd);
  } catch (err) {
    console.log("Consignment upload error:", err?.response?.data || err);
    toast.error("Visitor created but consignment upload failed");
  }
}

// if (formData.consignment && formData.consignmentAttachments?.length > 0) {
//   await uploadVisitorDocs({
//     visitorId,
//     consignmentFiles: formData.consignmentAttachments,
//   });
// }
      // goods inward after create
      const hasGoodsPayload =
        formData.goodsInward &&
        (String(formData.noOfGoods || "").trim() ||
          String(formData.goodsDescription || "").trim() ||
          (formData.goodsAttachments?.length || 0) > 0);

      if (hasGoodsPayload) {
        const postGoods = new FormData();

        const safeGoodsFiles = normalizeFileArray(formData.goodsAttachments);
        if (safeGoodsFiles.length > 0) {
          safeGoodsFiles.forEach((file) => {
            postGoods.append("goods_in_out[goods_files][]", file, file.name);
          });
        }

        postGoods.append("goods_in_out[visitor_id]", visitorId);
        postGoods.append("goods_in_out[no_of_goods]", formData.noOfGoods || "");
        postGoods.append("goods_in_out[description]", formData.goodsDescription || "");
        postGoods.append("goods_in_out[ward_type]", "in");
        postGoods.append("goods_in_out[vehicle_no]", formData.vehicleNumber || "");
        postGoods.append("goods_in_out[person_name]", formData.visitorName || "");
        postGoods.append("goods_in_out[created_by_id]", userId);

        try {
          await postNewGoods(postGoods);
        } catch (error) {
          console.error("Error posting goods:", error?.response?.data || error);
          toast.error("Visitor created but goods inward failed");
        }
      }

      toast.dismiss("createVisitor");
      toast.success("Visitor Added Successfully");
      navigate("/admin/passes/visitors");
    } catch (error) {
      console.error("Error creating visitor:", error?.response?.data || error);
      toast.dismiss("createVisitor");

      if (error?.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
          .join("\n");
        toast.error(errorMessages || "Failed to add visitor");
      } else {
        toast.error(error?.response?.data?.message || "Failed to add visitor. Please check form data.");
      }
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-50">
      <div className="bg-white shadow-xl w-full">
        <div
          className="text-center md:text-xl font-bold p-2 bg-black rounded-full text-white mb-6 mx-4 mt-4"
          style={{
            background:
              "radial-gradient(897px at 9% 80.3%, rgb(55, 60, 245) 0%, rgba(234, 161, 15, 0.9) 100.2%)",
          }}
        >
          <h2 className="text-center text-xl sm:text-2xl font-bold text-white tracking-widest">
            {getHeadingText()}
          </h2>
        </div>

        <div className="flex justify-center -mt-45 mb-4 ">
          <button
            type="button"
            onClick={handleOpenCamera}
            className="group block relative p-1 rounded-full bg-white shadow-lg transition-transform hover:scale-[1.02]"
          >
            <img
              src={capturedImage || image}
              alt="Visitor Profile"
              className="rounded-full w-32 h-32 sm:w-40 sm:h-40 object-cover border-4 border-white transition-opacity group-hover:opacity-90"
            />
            <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white bg-black bg-opacity-50 p-2 rounded-lg text-xs font-semibold">
                {capturedImage ? "Retake Photo" : "Take Photo"}
              </span>
            </div>
          </button>
        </div>

        <form onSubmit={createNewVisitor} className="pt-4 p-4 sm:p-8 md:p-12 space-y-8">
          {showWebcam && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex flex-col items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Capture Profile Picture</h3>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-md shadow-md"
                  videoConstraints={{ facingMode: "user" }}
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleCloseCamera}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={capture}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Capture Photo
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6 p-4 pt-0">
            <div className="flex flex-wrap gap-8 items-center">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-gray-700">Visitor Type:</h3>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visitorType"
                      value="Guest"
                      checked={selectedVisitorType === "Guest"}
                      onChange={handleVisitorTypeChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-800">Guest</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visitorType"
                      value="Support Staff"
                      checked={selectedVisitorType === "Support Staff"}
                      onChange={handleVisitorTypeChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-800">Support Staff</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-gray-700">Visiting Frequency:</h3>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value="Once"
                      checked={selectedFrequency === "Once"}
                      onChange={handleFrequencyChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-800">Once</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value="Frequently"
                      checked={selectedFrequency === "Frequently"}
                      onChange={handleFrequencyChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-800">Frequently</span>
                  </label>
                </div>
              </div>
            </div>

            {selectedVisitorType === "Support Staff" && (
              <div className="max-w-xs pt-4">
                <select
                  id="supportCategory"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm"
                  value={formData.supportCategory}
                  onChange={handleChange}
                  name="supportCategory"
                  required
                >
                  <option value="">Select Category</option>
                  {safeStaffCategories.length > 0 ? (
                    safeStaffCategories.map((staffCat) => (
                      <option value={staffCat.id} key={staffCat.id}>
                        {staffCat.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No categories available
                    </option>
                  )}
                </select>
              </div>
            )}
          </div>

          <hr className="border-t border-gray-200" />

          {/* FORM FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-sm">
                Visitor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.visitorName}
                onChange={handleChange}
                name="visitorName"
                className="border border-gray-300 p-2.5 rounded-lg text-sm"
                placeholder="Enter Visitor Name"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-sm">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={formData.mobile}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData((p) => ({ ...p, mobile: v }));
                }}
                name="mobile"
                className="border border-gray-300 p-2.5 rounded-lg text-sm"
                placeholder="Enter Mobile Number"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-sm">Host</label>
              <select
                className="border border-gray-300 p-2.5 rounded-lg text-sm"
                value={formData.host}
                onChange={handleChange}
                name="host"
                required
              >
                <option value="">Select Person to meet</option>
                {safeHosts.length > 0 ? (
                  safeHosts.map((host) => (
                    <option value={host.id} key={host.id}>
                      {host.name ||
                        `${host.firstname || ""} ${host.lastname || ""}`.trim() ||
                        host.full_name ||
                        `Host ${host.id}`}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No hosts available
                  </option>
                )}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-sm">Pass Number</label>
              <input
                type="text"
                value={formData.passNumber}
                onChange={handleChange}
                name="passNumber"
                className="border border-gray-300 p-2.5 rounded-lg text-sm"
                placeholder="Enter Pass Number"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-sm">Coming From</label>
              <input
                type="text"
                className="border border-gray-300 p-2.5 rounded-lg text-sm"
                placeholder="Enter Origin"
                value={formData.comingFrom}
                name="comingFrom"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-sm">Vehicle Number</label>
              <input
                type="text"
                className="border border-gray-300 p-2.5 rounded-lg text-sm"
                placeholder="Enter Vehicle Number"
                value={formData.vehicleNumber}
                name="vehicleNumber"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-sm">Select Parking Slot</label>
              <select
                name="slotNumber"
                value={formData.slotNumber}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg text-sm"
              >
                <option value="">Select Slot</option>
                {safeSlots.length > 0 ? (
                  safeSlots.map((slot) => (
                    <option value={slot.id} key={slot.id}>
                      {slot.name || slot.slot_name || `Slot ${slot.id}`}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {safeSlots.length === 0 ? "No slots available" : "Loading..."}
                  </option>
                )}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-sm">{expectedDateLabel}</label>
              <input
                type="date"
                className="border border-gray-300 p-2.5 rounded-lg text-sm"
                value={formData.expectedDate}
                onChange={handleChange}
                name="expectedDate"
                min={todayDate}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-sm">{expectedTimeLabel}</label>
              <input
                type="time"
                value={formData.expectedTime}
                onChange={handleChange}
                name="expectedTime"
                className="border border-gray-300 p-2.5 rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-sm">
                Visit Purpose <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.purpose}
                onChange={handleChange}
                name="purpose"
                className="border border-gray-300 p-2.5 rounded-lg text-sm"
                required
              >
                <option value="">Select Purpose</option>
                <option value="Meeting">Meeting</option>
                <option value="Delivery">Delivery</option>
                <option value="Personal">Personal</option>
                <option value="Fitout Staff">Fitout Staff</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="lg:col-span-3 flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                <input
                  type="checkbox"
                  name="hostApproval"
                  checked={formData.hostApproval}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-4 w-4 rounded border-gray-400"
                />
                Skip Host Approval
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                <input
                  type="checkbox"
                  name="goodsInward"
                  checked={formData.goodsInward}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-4 w-4 rounded border-gray-400"
                />
                Goods Inwards
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                <input
                  type="checkbox"
                  name="license"
                  checked={formData.license}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-4 w-4 rounded border-gray-400"
                />
                License
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                <input
                  type="checkbox"
                  name="consignment"
                  checked={formData.consignment}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-4 w-4 rounded border-gray-400"
                />
                Consignment
              </label>
            </div>
          </div>

          {/* GOODS */}
          {formData.goodsInward && (
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4">
              <h3 className="font-bold text-lg text-blue-800 border-b pb-2 mb-4">Goods Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700 text-sm">No. of Goods:</label>
                  <input
                    type="number"
                    name="noOfGoods"
                    className="border border-gray-300 p-2.5 rounded-lg text-sm"
                    placeholder="Enter Number"
                    value={formData.noOfGoods}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700 text-sm">Description:</label>
                  <textarea
                    name="goodsDescription"
                    value={formData.goodsDescription}
                    onChange={handleChange}
                    className="border border-gray-300 p-2.5 rounded-lg text-sm"
                    rows={1}
                    placeholder="Enter Description of Goods"
                  />
                </div>
              </div>
              <div className="pt-2">
                <label className="font-semibold text-gray-700 mb-1 block text-sm">
                  Goods Attachments (Optional)
                </label>
                <FileInputBox
                  handleChange={(input) => handleFileChange(input, "goodsAttachments")}
                  fieldName={"goodsAttachments"}
                  isMulti={true}
                />
              </div>
            </div>
          )}

          {/* LICENSE / CONSIGNMENT */}
          {(formData.license || formData.consignment) && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
              <h3 className="font-bold text-lg text-gray-700 border-b pb-2 mb-4">
                Supporting Documents
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {formData.license && (
                  <div>
                    <label className="font-semibold text-gray-700 mb-1 block text-sm">
                      License Attachments
                    </label>
                   <FileInputBox
      handleChange={(input) => handleFileChange(input, "licenseAttachments")}
      fieldName={"licenseAttachments"}
      isMulti={true}
    />
                    {/* <FileInputBox
  handleChange={(files) =>
    setFormData((prev) => ({
      ...prev,
      licenseAttachments: normalizeFileArray(files),
    }))
  }
  isMulti={true}
/> */}
                  </div>
                )}

                {formData.consignment && (
                  <div>
                    <label className="font-semibold text-gray-700 mb-1 block text-sm">
                      Consignment Attachments
                    </label>
                    <FileInputBox
                      handleChange={(input) => handleFileChange(input, "consignmentAttachments")}
                      fieldName={"consignmentAttachments"}
                      isMulti={true}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ADDITIONAL VISITORS */}
          <div className="flex justify-between items-center pb-2">
            <h3 className="font-bold text-lg text-gray-700">Additional Visitor(s)</h3>
            <button
              type="button"
              onClick={handleAddVisitor}
              className="bg-black text-white font-semibold py-1.5 px-4 rounded-lg transition-colors text-sm shadow-md"
            >
              + Add Visitor
            </button>
          </div>

          <div className="space-y-4">
            {visitors.map((visitor, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg relative bg-white shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-700 text-xs">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={visitor.name}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border border-gray-300 p-2 rounded-lg text-sm"
                      placeholder="Enter Visitor Name"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-700 text-xs">Mobile</label>
                    {/* ✅ removed arrows by using tel */}
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      name="mobile"
                      value={visitor.mobile}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setVisitors((prev) => {
                          const copy = [...prev];
                          copy[index] = { ...copy[index], mobile: v };
                          return copy;
                        });
                      }}
                      className="border border-gray-300 p-2 rounded-lg text-sm"
                      placeholder="Enter Mobile Number"
                    />
                  </div>
                </div>

                {visitors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveVisitor(index)}
                    className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 rounded-full bg-gray-100 hover:bg-gray-200"
                    aria-label={`Remove visitor ${index + 1}`}
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <hr className="border-t border-gray-200" />

          {/* PASS VALIDITY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-sm">Pass Valid From</label>
              <input
                type="datetime-local"
                value={passStartDate ? passStartDate.slice(0, 16) : ""}
                onChange={handlePassStartDateChange}
                className="border border-gray-300 p-2.5 rounded-lg text-sm"
                min={todayDate}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-sm">Pass Valid To</label>
              <input
                type="datetime-local"
                value={passEndDate ? passEndDate.slice(0, 16) : ""}
                onChange={handlePassEndDateChange}
                className="border border-gray-300 p-2.5 rounded-lg text-sm"
                min={passStartDate ? passStartDate.slice(0, 16) : todayDate}
              />
            </div>

            {selectedFrequency === "Frequently" && (
              <div className="sm:col-span-2">
                <h4 className="font-semibold text-gray-700 text-sm mb-2">Select Working Days:</h4>
                <div className="flex flex-wrap gap-4">
                  {weekdaysMap.map((dayObj) => (
                    <button
                      key={dayObj.day}
                      type="button"
                      onClick={() => handleWeekdaySelection(dayObj.day)}
                      className={`py-1 px-3 border rounded-lg text-xs font-medium transition-colors ${
                        dayObj.isActive
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {dayObj.day}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              style={{ backgroundColor: themeColor }}
              className="px-10 py-3 text-lg font-bold text-white rounded-lg shadow-xl hover:opacity-90 transition-opacity"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewVisitor;