import React, { useState, useRef, useEffect } from "react";
import image from "/profile.png";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  domainPrefix,
  editVisitorDetails,
  getSetupUsers,
  getVisitorDetails,
  getVisitorStaffCategory,
  getParkingConfig,
  uploadVisitorLicense,
  uploadVisitorConsignment,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";

const EditVisitor = () => {
  const siteId = getItemInLocalStorage("SITEID");
  const userId = getItemInLocalStorage("UserId"); // kept (not used)
  const [behalf, setbehalf] = useState("Visitor"); // kept (not used)

  const inputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);

  const licenseInputRef = useRef(null);
  const consignmentInputRef = useRef(null);

  const [licenseFiles, setLicenseFiles] = useState([]); // ✅ MULTI (new selected)
  const [consignmentFiles, setConsignmentFiles] = useState([]); // ✅ MULTI (new selected)

  const [existingLicenseFileName, setExistingLicenseFileName] = useState("");
  const [existingConsignmentFileName, setExistingConsignmentFileName] =
    useState("");

  // ✅ existing attachments from backend (we will show + allow frontend-only remove from view)
  const [existingLicenseDocs, setExistingLicenseDocs] = useState([]);
  const [existingConsignmentDocs, setExistingConsignmentDocs] = useState([]);

  const [visitors, setVisitors] = useState([
    { id: "", name: "", mobile: "", _destroy: "0" },
  ]);
  const [selectedFrequency, setSelectedFrequency] = useState("Once");
  const [selectedVisitorType, setSelectedVisitorType] = useState("Guest");
  const [hosts, setHosts] = useState([]);
  const [staffCategories, setStaffCategories] = useState([]);
  const [slots, setSlots] = useState([]);
  const [passStartDate, setPassStartDate] = useState("");
  const [passEndDate, setPassEndDate] = useState("");

  const [formData, setFormData] = useState({
    visitorName: "",
    mobile: "",
    purpose: "",
    comingFrom: "",
    vehicleNumber: "",
    expectedDate: "",
    expectedTime: "",
    hostApproval: false,
    goodsInward: false,
    license: false,
    consignment: false,
    host: "",
    passNumber: "",
    supportCategory: "",
    slotNumber: "",
    noOfGoods: "",
    goodsDescription: "",
    notes: "",
  });

  const [details, setDetails] = useState({});
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

  const { id } = useParams();
  const navigate = useNavigate();
  const themeColor = useSelector((state) => state.theme.color);

  const boolToInt = (b) => (b ? "1" : "0");

  // ✅ time helpers
  const normalizeTimeForInput = (t) => {
    if (!t) return "";
    if (typeof t !== "string") return String(t);
    if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5);
    return t;
  };

  const normalizeTimeWithSeconds = (t) => {
    if (!t) return "";
    if (typeof t !== "string") return String(t);
    if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
    if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
    return t;
  };

  // ✅ attachment helpers
  const getDocUrl = (doc) => {
    const p = doc?.document;
    if (!p) return "";
    return String(p).startsWith("http") ? p : domainPrefix + p;
  };

  const safePathNoQuery = (url) => String(url || "").split("?")[0];
  const isImageUrl = (url) =>
    /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(safePathNoQuery(url));
  const isPdfUrl = (url) => /\.pdf$/i.test(safePathNoQuery(url));

  const getDocName = (doc, fallback = "Document") => {
    const url = getDocUrl(doc);
    if (!url) return fallback;
    try {
      const u = new URL(url);
      return u.pathname.split("/").pop() || fallback;
    } catch {
      const p = safePathNoQuery(url);
      return p.split("/").pop() || fallback;
    }
  };

  // ✅ remove selected new files (trash)
  const removeSelectedLicense = (idx) => {
    setLicenseFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeSelectedConsignment = (idx) => {
    setConsignmentFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // ✅ frontend-only remove existing from UI (does NOT delete from backend)
  const removeExistingLicenseFromView = (doc) => {
    const docId = doc?.id;
    setExistingLicenseDocs((prev) =>
      prev.filter((d) => String(d?.id) !== String(docId))
    );
    toast.success("Removed from view (frontend only)");
  };

  const removeExistingConsignmentFromView = (doc) => {
    const docId = doc?.id;
    setExistingConsignmentDocs((prev) =>
      prev.filter((d) => String(d?.id) !== String(docId))
    );
    toast.success("Removed from view (frontend only)");
  };

  // ✅ UI component for attachments
  const AttachmentList = ({
    title,
    existingDocs = [],
    newFiles = [],
    onRemoveNew,
    onRemoveExisting,
    kind = "Document",
  }) => {
    const hasExisting = Array.isArray(existingDocs) && existingDocs.length > 0;
    const hasNew = Array.isArray(newFiles) && newFiles.length > 0;

    if (!hasExisting && !hasNew) return null;

    return (
      <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="text-xs font-semibold text-gray-700 mb-2">{title}</div>

        {hasExisting && (
          <div className="mb-3">
            <div className="text-[11px] text-gray-500 mb-1">Existing:</div>
            <div className="space-y-2">
              {existingDocs.map((doc, idx) => {
                const url = getDocUrl(doc);
                const name = getDocName(doc, `${kind} ${idx + 1}`);
                const img = isImageUrl(url);
                const pdf = isPdfUrl(url);

                return (
                  <div
                    key={doc?.id || `${name}-${idx}`}
                    className="flex items-center gap-3 rounded-md bg-white border border-gray-200 p-2"
                  >
                    <div className="w-12 h-12 rounded-md border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-100 shrink-0">
                      {img && url ? (
                        <img
                          src={url}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-600 font-semibold">
                          {pdf ? "PDF" : "FILE"}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-800 truncate">
                        {name}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">
                        {url || "No URL"}
                      </div>
                    </div>

                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 underline shrink-0"
                      >
                        View
                      </a>
                    ) : null}

                    {onRemoveExisting ? (
                      <button
                        type="button"
                        onClick={() => onRemoveExisting(doc)}
                        className="text-sm text-red-600 underline shrink-0"
                        title="Remove from view (frontend only)"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {hasNew && (
          <div>
            <div className="text-[11px] text-gray-500 mb-1">New Selected:</div>
            <div className="space-y-2">
              {newFiles.map((f, idx) => {
                const isImg = String(f?.type || "").startsWith("image/");
                const preview = isImg ? URL.createObjectURL(f) : "";

                return (
                  <div
                    key={`${f.name}-${idx}`}
                    className="flex items-center gap-3 rounded-md bg-white border border-gray-200 p-2"
                  >
                    <div className="w-12 h-12 rounded-md border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-100 shrink-0">
                      {isImg ? (
                        <img
                          src={preview}
                          alt={f.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-600 font-semibold">
                          {String(f.name || "").toLowerCase().endsWith(".pdf")
                            ? "PDF"
                            : "FILE"}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-800 truncate">
                        {f.name}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {(f.size / 1024).toFixed(1)} KB
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveNew?.(idx)}
                      className="text-red-600 hover:text-red-700 p-1 shrink-0"
                      title="Remove selected file"
                    >
                      <FaTrash />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleImageClick = () => inputRef.current?.click();
  const handleImageChange = (event) =>
    setImageFile(event.target.files?.[0] || null);

  const handleLicenseFileClick = () => licenseInputRef.current?.click();
  const handleConsignmentFileClick = () => consignmentInputRef.current?.click();

  // ✅ MULTI select
  const handleLicenseFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setLicenseFiles(files);
    if (files.length > 0) setFormData((prev) => ({ ...prev, license: true }));
  };

  const handleConsignmentFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setConsignmentFiles(files);
    if (files.length > 0)
      setFormData((prev) => ({ ...prev, consignment: true }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFrequencyChange = (e) => setSelectedFrequency(e.target.value);

  const handleVisitorTypeChange = (e) => {
    setSelectedVisitorType(e.target.value);
    if (e.target.value !== "Support Staff") {
      setFormData((prev) => ({ ...prev, supportCategory: "" }));
    }
  };

  const currentDates = new Date();
  const year = currentDates.getFullYear();
  const month = String(currentDates.getMonth() + 1).padStart(2, "0");
  const day = String(currentDates.getDate()).padStart(2, "0");
  const todayDate = `${year}-${month}-${day}`;

  const handleWeekdaySelection = (weekday) => {
    const index = weekdaysMap.find((d) => d.day === weekday)?.index;
    if (index === undefined) return;

    setWeekdaysMap((prev) =>
      prev.map((d) =>
        d.index === index ? { ...d, isActive: !d.isActive } : d
      )
    );

    setSelectedWeekdays((prev) =>
      prev.includes(weekday)
        ? prev.filter((d) => d !== weekday)
        : [...prev, weekday]
    );
  };

  const handleAddVisitor = (event) => {
    event.preventDefault();
    setVisitors((prev) => [
      ...prev,
      { id: "", name: "", mobile: "", _destroy: "0" },
    ]);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    setVisitors((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  const handleRemoveVisitor = (index) => {
    setVisitors((prev) => {
      const updated = [...prev];
      if (updated[index].id) updated[index]._destroy = "1";
      else updated.splice(index, 1);
      return updated;
    });
  };

  const handlePassStartDateChange = (event) =>
    setPassStartDate(event.target.value);
  const handlePassEndDateChange = (event) => setPassEndDate(event.target.value);

  // ✅ helper: upload docs AFTER update (MULTI)
  const uploadDocsAfterUpdate = async () => {
    // license
    if (formData.license && licenseFiles.length > 0) {
      const fd = new FormData();
      fd.append("visitor_id", id);
      licenseFiles.forEach((file) => {
        fd.append("visitor_license[]", file, file.name);
      });
      await uploadVisitorLicense(fd);
    }

    // consignment
    if (formData.consignment && consignmentFiles.length > 0) {
      const fd = new FormData();
      fd.append("visitor_id", id);
      consignmentFiles.forEach((file) => {
        fd.append("visitor_consignment[]", file, file.name);
      });
      await uploadVisitorConsignment(fd);
    }
  };

  const fetchVisitorDetails = async () => {
    try {
      const detailsResp = await getVisitorDetails(id);
      const editDetail = detailsResp.data;
      setDetails(editDetail);

      // Prefer visitor_license & visitor_consignment arrays
      let licenseFileObj = null;
      let consignmentFileObj = null;

      const licenseArr = Array.isArray(editDetail.visitor_license)
        ? editDetail.visitor_license
        : [];
      const consignmentArr = Array.isArray(editDetail.visitor_consignment)
        ? editDetail.visitor_consignment
        : [];

      setExistingLicenseDocs(licenseArr);
      setExistingConsignmentDocs(consignmentArr);

      if (licenseArr.length > 0) licenseFileObj = licenseArr[0];
      if (consignmentArr.length > 0) consignmentFileObj = consignmentArr[0];

      // fallback old visitor_files
      if (!licenseFileObj && Array.isArray(editDetail.visitor_files)) {
        licenseFileObj = editDetail.visitor_files.find(
          (f) => f.category_type === "license"
        );
      }
      if (!consignmentFileObj && Array.isArray(editDetail.visitor_files)) {
        consignmentFileObj = editDetail.visitor_files.find(
          (f) => f.category_type === "consignment"
        );
      }

      // fallback list for old format
      if (licenseArr.length === 0 && licenseFileObj)
        setExistingLicenseDocs([licenseFileObj]);
      if (consignmentArr.length === 0 && consignmentFileObj)
        setExistingConsignmentDocs([consignmentFileObj]);

      setFormData((prevFormData) => ({
        ...prevFormData,
        visitorName: editDetail.name || "",
        mobile: editDetail.contact_no || "",
        purpose: editDetail.purpose || "",
        host: editDetail.vhost_id || editDetail.hosts?.[0]?.id || "",
        comingFrom: editDetail.coming_from || "",
        vehicleNumber: editDetail.vehicle_number || "",
        expectedDate: editDetail.expected_date || "",
        expectedTime: normalizeTimeForInput(editDetail.expected_time || ""),
        hostApproval: editDetail.skip_host_approval || false,
        goodsInward: editDetail.goods_inwards || false,
        license: !!licenseFileObj || false,
        consignment: !!consignmentFileObj || false,
        passNumber: editDetail.pass_number || "",
        supportCategory: editDetail.visitor_staff_category_id || "",
        slotNumber: editDetail.parking_slot_id || editDetail.parking_slot || "",
        noOfGoods:
          editDetail.goods_in_out?.no_of_goods ||
          editDetail.goods_inward_info?.no_of_goods ||
          "",
        goodsDescription:
          editDetail.goods_in_out?.description ||
          editDetail.goods_inward_info?.description ||
          "",
        notes: editDetail.notes || "",
      }));

      // show existing filename (count / first)
      if (licenseArr.length > 1) {
        setExistingLicenseFileName(`${licenseArr.length} file(s)`);
      } else if (licenseFileObj?.document) {
        setExistingLicenseFileName(getDocName(licenseFileObj, "License File"));
      } else setExistingLicenseFileName("");

      if (consignmentArr.length > 1) {
        setExistingConsignmentFileName(`${consignmentArr.length} file(s)`);
      } else if (consignmentFileObj?.document) {
        setExistingConsignmentFileName(
          getDocName(consignmentFileObj, "Consignment File")
        );
      } else setExistingConsignmentFileName("");

      // extra visitors
      if (
        Array.isArray(editDetail.extra_visitors) &&
        editDetail.extra_visitors.length > 0
      ) {
        const validVisitors = editDetail.extra_visitors.filter(
          (v) => v.name?.trim() || v.contact_no?.trim()
        );
        if (validVisitors.length > 0) {
          setVisitors(
            validVisitors.map((v) => ({
              id: v.id || "",
              name: v.name || "",
              mobile: v.contact_no || "",
              _destroy: "0",
            }))
          );
        } else setVisitors([{ id: "", name: "", mobile: "", _destroy: "0" }]);
      } else setVisitors([{ id: "", name: "", mobile: "", _destroy: "0" }]);

      // normalize type/freq
      setSelectedVisitorType(
        editDetail.visit_type === "support_staff" ? "Support Staff" : "Guest"
      );
      setSelectedFrequency(
        editDetail.frequency === "frequently" ? "Frequently" : "Once"
      );

      const formatPassTime = (dateString) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        if (Number.isNaN(d.getTime())) return "";
        return d.toISOString().slice(0, 16);
      };

      setPassStartDate(formatPassTime(editDetail.start_pass));
      setPassEndDate(formatPassTime(editDetail.end_pass));

      setSelectedWeekdays(
        Array.isArray(editDetail.working_days) ? editDetail.working_days : []
      );

      setWeekdaysMap((prev) =>
        prev.map((w) => ({
          ...w,
          isActive: Array.isArray(editDetail.working_days)
            ? editDetail.working_days.includes(w.day)
            : false,
        }))
      );
    } catch (error) {
      console.error("Error fetching visitor details:", error);
      toast.error("Failed to load visitor details.");
    }
  };

  const fetchInitialData = async () => {
    try {
      const [usersResp, visitorCat, parkingRes] = await Promise.all([
        getSetupUsers(),
        getVisitorStaffCategory(),
        getParkingConfig(),
      ]);

      setHosts(
        Array.isArray(usersResp.data)
          ? usersResp.data
          : usersResp.data?.hosts || usersResp.data?.data || []
      );
      setStaffCategories(visitorCat.data?.categories || []);

      let parkingSlots = [];
      if (Array.isArray(parkingRes.data)) parkingSlots = parkingRes.data;
      else if (Array.isArray(parkingRes.data?.slots))
        parkingSlots = parkingRes.data.slots;
      else if (Array.isArray(parkingRes.data?.parking_slots))
        parkingSlots = parkingRes.data.parking_slots;
      else if (Array.isArray(parkingRes.data?.data))
        parkingSlots = parkingRes.data.data;

      setSlots(parkingSlots);
    } catch (error) {
      console.error("Error fetching initial lists:", error);
      toast.error("Failed to load hosts, categories, or parking slots.");
      setSlots([]);
      setHosts([]);
      setStaffCategories([]);
    }
  };

  useEffect(() => {
    if (details.parking_slot && slots.length > 0 && formData.slotNumber === "") {
      const slotMatch = slots.find(
        (slot) =>
          slot.name === details.parking_slot ||
          slot.slot_name === details.parking_slot ||
          slot.id?.toString() === details.parking_slot
      );
      if (slotMatch) {
        setFormData((prev) => ({ ...prev, slotNumber: slotMatch.id }));
      }
    }
  }, [details.parking_slot, slots, formData.slotNumber]);

  useEffect(() => {
    fetchVisitorDetails();
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEditVisitor = async () => {
    if (formData.visitorName === "" || formData.purpose === "" || formData.mobile === "") {
      return toast.error("Visitor Name, Mobile, and Purpose are Required");
    }

    const postData = new FormData();
    const apiVisitType = selectedVisitorType === "Support Staff" ? "support_staff" : "guest";
    const apiFrequency = selectedFrequency === "Frequently" ? "frequently" : "once";

    postData.append("visitor[site_id]", siteId);
    postData.append("visitor[vhost_id]", formData.host);
    postData.append("visitor[name]", formData.visitorName);

    if (selectedVisitorType === "Support Staff") {
      postData.append("visitor[visitor_staff_category_id]", formData.supportCategory || "");
    }

    postData.append("visitor[contact_no]", formData.mobile);
    postData.append("visitor[purpose]", formData.purpose);
    postData.append("visitor[start_pass]", passStartDate);
    postData.append("visitor[end_pass]", passEndDate);
    postData.append("visitor[coming_from]", formData.comingFrom);
    postData.append("visitor[vehicle_number]", formData.vehicleNumber);
    postData.append("visitor[expected_date]", formData.expectedDate);
    postData.append("visitor[expected_time]", normalizeTimeWithSeconds(formData.expectedTime));
    postData.append("visitor[skip_host_approval]", boolToInt(formData.hostApproval));
    postData.append("visitor[goods_inwards]", boolToInt(formData.goodsInward));
    postData.append("visitor[visit_type]", apiVisitType);
    postData.append("visitor[frequency]", apiFrequency);
    postData.append("visitor[pass_number]", formData.passNumber);
    postData.append("visitor[parking_slot_id]", formData.slotNumber);
    postData.append("visitor[notes]", formData.notes || "");

    selectedWeekdays.forEach((dayStr) => {
      postData.append("visitor[working_days][]", dayStr);
    });

    visitors.forEach((extraVisitor, index) => {
      if (extraVisitor._destroy === "1" || extraVisitor.name?.trim() || extraVisitor.mobile?.trim()) {
        if (extraVisitor.id) {
          postData.append(`visitor[extra_visitors_attributes][${index}][id]`, extraVisitor.id);
        }
        postData.append(`visitor[extra_visitors_attributes][${index}][name]`, extraVisitor.name || "");
        postData.append(`visitor[extra_visitors_attributes][${index}][contact_no]`, extraVisitor.mobile || "");
        postData.append(`visitor[extra_visitors_attributes][${index}][_destroy]`, extraVisitor._destroy || "0");
      }
    });

    if (formData.goodsInward) {
      postData.append("visitor[no_of_goods]", formData.noOfGoods || "");
      postData.append("visitor[goods_description]", formData.goodsDescription || "");
    }

    if (imageFile) {
      postData.append("visitor[profile_picture]", imageFile, imageFile.name);
    }

    try {
      toast.loading("Updating visitor details...", { id: "editVisitor" });

      const visitResp = await editVisitorDetails(id, postData);

      // ✅ upload docs after update (MULTI)
      try {
        await uploadDocsAfterUpdate();
      } catch (docErr) {
        console.log("Doc Upload Error:", docErr?.response?.data || docErr);
        toast.error("Visitor updated, but license/consignment upload failed.");
      }

      toast.dismiss("editVisitor");
      toast.success("Visitor Edited Successfully");
      navigate(`/admin/passes/visitors/visitor-details/${visitResp.data.id}`);
    } catch (error) {
      toast.dismiss("editVisitor");

      if (error?.response?.data?.errors) {
        const msg = Object.entries(error.response.data.errors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join("\n");
        toast.error(msg);
      } else {
        toast.error("Failed to update visitor. Please check form data.");
      }
      console.log(error);
    }
  };

  return (
    <section className="flex">
      <Navbar />
      <div className=" w-full flex mx-3  flex-col overflow-hidden">
        <div className="flex justify-center items-center  w-full p-4">
          <div className="md:border border-gray-300 rounded-lg md:p-4 w-full md:mx-4 ">
            <h2
              style={{ background: themeColor }}
              className="text-center md:text-xl font-bold p-2 bg-black rounded-full text-white"
            >
              Edit visitor
            </h2>
            <br />

            <div
              onClick={handleImageClick}
              className="cursor-pointer flex justify-center items-center my-4"
            >
              {details.profile_picture ? (
                <img
                  src={domainPrefix + details.profile_picture}
                  alt="Profile"
                  className="w-48 h-48 rounded-full cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(domainPrefix + details.profile_picture, "_blank");
                  }}
                />
              ) : (
                <img src={image} alt="" className="w-48 h-48" />
              )}

              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="New Profile"
                  className="border-4 border-gray-300 rounded-full w-40 h-40 object-cover absolute"
                  style={{ zIndex: 10 }}
                />
              )}

              <input
                type="file"
                ref={inputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
                accept="image/*"
              />
            </div>

            <div className="flex md:flex-row flex-col my-5 gap-10">
              <div className="flex gap-2 flex-col">
                <h2 className="font-semibold">Visitor Type :</h2>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="Guest"
                      name="visitorType"
                      value="Guest"
                      checked={selectedVisitorType === "Guest"}
                      onChange={handleVisitorTypeChange}
                    />
                    <label htmlFor="Guest" className="font-semibold ">
                      Guest
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="staff"
                      name="visitorType"
                      value="Support Staff"
                      checked={selectedVisitorType === "Support Staff"}
                      onChange={handleVisitorTypeChange}
                    />
                    <label htmlFor="staff" className="font-semibold ">
                      Support Staff
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-col">
                <h2 className="font-semibold">Visiting Frequency :</h2>
                <div className="flex items-center gap-4 ">
                  <div className="flex items-center gap-2 ">
                    <input
                      type="radio"
                      id="once"
                      name="frequency"
                      value="Once"
                      checked={selectedFrequency === "Once"}
                      onChange={handleFrequencyChange}
                    />
                    <label htmlFor="once" className="font-semibold">
                      Once
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="frequently"
                      name="frequency"
                      value="Frequently"
                      checked={selectedFrequency === "Frequently"}
                      onChange={handleFrequencyChange}
                    />
                    <label htmlFor="frequently" className="font-semibold">
                      Frequently
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {selectedVisitorType === "Support Staff" && (
              <div className="grid gap-2 items-center w-1/3 mb-4">
                <label htmlFor="supportCategory" className="font-medium">
                  Select Support Category:
                </label>
                <select
                  id="supportCategory"
                  name="supportCategory"
                  value={formData.supportCategory}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                  required={selectedVisitorType === "Support Staff"}
                >
                  <option value="">Select Category</option>
                  {Array.isArray(staffCategories) && staffCategories.length > 0 ? (
                    staffCategories.map((category) => (
                      <option value={category.id} key={category.id}>
                        {category.name}
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

            <div className="grid md:grid-cols-3 gap-5">
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="visitorName" className="font-semibold">
                  Visitor Name:
                </label>
                <input
                  type="text"
                  id="visitorName"
                  value={formData.visitorName}
                  onChange={handleChange}
                  name="visitorName"
                  className="border border-gray-400 p-2 rounded-md"
                  placeholder="Enter Visitor Name"
                />
              </div>

              <div className="grid gap-2 items-center w-full">
                <label htmlFor="mobileNumber" className="font-semibold">
                  Mobile Number:
                </label>
                <input
                  type="number"
                  value={formData.mobile}
                  onChange={handleChange}
                  name="mobile"
                  id="mobileNumber"
                  className="border border-gray-400 p-2 rounded-md"
                  placeholder="Enter Mobile Number"
                />
              </div>

              <div className="grid gap-2 items-center w-full">
                <label htmlFor="purpose" className="font-semibold">
                  Purpose:
                </label>
                <input
                  type="text"
                  id="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  name="purpose"
                  className="border border-gray-400 p-2 rounded-md"
                  placeholder="Enter Purpose"
                />
              </div>

              <div className="grid gap-2 items-center w-full">
                <label htmlFor="host" className="font-medium">
                  Host:
                </label>
                <select
                  id="host"
                  className="border border-gray-400 p-2 rounded-md"
                  value={formData.host}
                  onChange={handleChange}
                  name="host"
                >
                  <option value="">Select Person to meet</option>
                  {Array.isArray(hosts) && hosts.length > 0 ? (
                    hosts.map((host) => (
                      <option value={host.id} key={host.id}>
                        {host.firstname} {host.lastname} {host.full_name || ""}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No hosts available
                    </option>
                  )}
                </select>
              </div>

              <div className="grid gap-2 items-center w-full">
                <label htmlFor="passNumber" className="font-semibold">
                  Pass Number
                </label>
                <input
                  value={formData.passNumber}
                  onChange={handleChange}
                  name="passNumber"
                  type="text"
                  id="passNumber"
                  className="border border-gray-400 p-2 rounded-md"
                  placeholder="Enter Pass number"
                />
              </div>

              <div className="grid gap-2 items-center w-full">
                <label htmlFor="comingFrom" className="font-semibold">
                  Coming from:
                </label>
                <input
                  type="text"
                  value={formData.comingFrom}
                  onChange={handleChange}
                  name="comingFrom"
                  id="comingFrom"
                  className="border border-gray-400 p-2 rounded-md"
                  placeholder="Enter Origin"
                />
              </div>

              <div className="grid gap-2 items-center w-full">
                <label htmlFor="vehicleNumber" className="font-semibold">
                  Vehicle Number:
                </label>
                <input
                  type="text"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  name="vehicleNumber"
                  id="vehicleNumber"
                  className="border border-gray-400 p-2 rounded-md"
                  placeholder="Enter Vehicle Number"
                />
              </div>

              <div className="grid gap-2 items-center w-full">
                <label htmlFor="slotNumber" className="font-semibold">
                  Select Parking Slot:
                </label>
                <select
                  id="slotNumber"
                  name="slotNumber"
                  value={formData.slotNumber}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                >
                  <option value="">Select Slot</option>
                  {Array.isArray(slots) && slots.length > 0 ? (
                    slots.map((slot) => (
                      <option value={slot.id} key={slot.id}>
                        {slot.name || slot.slot_name || `Slot ${slot.id}`}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {slots.length === 0 ? "No slots available" : "Loading..."}
                    </option>
                  )}
                </select>
              </div>

              <div className="grid gap-2 items-center w-full">
                <label htmlFor="notes" className="font-semibold">
                  Notes:
                </label>
                <input
                  type="text"
                  id="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  name="notes"
                  className="border border-gray-400 p-2 rounded-md"
                  placeholder="Enter Notes"
                />
              </div>

              <div className="grid gap-2 items-center w-full">
                <label htmlFor="expectedDate" className="font-semibold">
                  Expected Date:
                </label>
                <input
                  type="date"
                  id="expectedDate"
                  value={formData.expectedDate}
                  onChange={handleChange}
                  name="expectedDate"
                  min={todayDate}
                  className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                />
              </div>

              <div className="grid gap-2 items-center w-full">
                <label htmlFor="expectedTime" className="font-semibold">
                  Expected Time:
                </label>
                <input
                  type="time"
                  id="expectedTime"
                  value={formData.expectedTime}
                  onChange={handleChange}
                  name="expectedTime"
                  className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-8 items-center mt-6 border-t pt-4 border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer text-base font-semibold">
                <input
                  type="checkbox"
                  id="hostApproval"
                  name="hostApproval"
                  checked={formData.hostApproval}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-400"
                />
                Skip Host Approval
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-base font-semibold">
                <input
                  type="checkbox"
                  id="goodsInward"
                  name="goodsInward"
                  checked={formData.goodsInward}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-400"
                />
                Goods Inward
              </label>

              {/* ✅ LICENSE */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-base font-semibold">
                  <input
                    type="checkbox"
                    id="license"
                    name="license"
                    checked={formData.license}
                    onChange={(e) => {
                      handleChange(e);
                      if (!e.target.checked) setLicenseFiles([]);
                    }}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-400"
                  />
                  License Document
                </label>

                <button
                  type="button"
                  onClick={handleLicenseFileClick}
                  className="text-sm px-3 py-1 rounded border border-gray-400"
                  disabled={!formData.license}
                >
                  {licenseFiles.length > 0
                    ? "Change File(s)"
                    : existingLicenseFileName
                    ? "Replace License"
                    : "Upload License"}
                </button>

                <input
                  type="file"
                  ref={licenseInputRef}
                  style={{ display: "none" }}
                  onChange={handleLicenseFileChange}
                  accept=".pdf,image/*"
                  multiple
                />
              </div>

              {/* ✅ CONSIGNMENT */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-base font-semibold">
                  <input
                    type="checkbox"
                    id="consignment"
                    name="consignment"
                    checked={formData.consignment}
                    onChange={(e) => {
                      handleChange(e);
                      if (!e.target.checked) setConsignmentFiles([]);
                    }}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-400"
                  />
                  Consignment Document
                </label>

                <button
                  type="button"
                  onClick={handleConsignmentFileClick}
                  className="text-sm px-3 py-1 rounded border border-gray-400"
                  disabled={!formData.consignment}
                >
                  {consignmentFiles.length > 0
                    ? "Change File(s)"
                    : existingConsignmentFileName
                    ? "Replace Consignment"
                    : "Upload Consignment"}
                </button>

                <input
                  type="file"
                  ref={consignmentInputRef}
                  style={{ display: "none" }}
                  onChange={handleConsignmentFileChange}
                  accept=".pdf,image/*"
                  multiple
                />
              </div>
            </div>

            {/* ✅ Attachments fully shown (no top bar UI) */}
            <AttachmentList
              title="License Attachments"
              existingDocs={existingLicenseDocs}
              newFiles={licenseFiles}
              onRemoveNew={removeSelectedLicense}
              onRemoveExisting={removeExistingLicenseFromView}
              kind="License"
            />

            <AttachmentList
              title="Consignment Attachments"
              existingDocs={existingConsignmentDocs}
              newFiles={consignmentFiles}
              onRemoveNew={removeSelectedConsignment}
              onRemoveExisting={removeExistingConsignmentFromView}
              kind="Consignment"
            />

            {formData.goodsInward && (
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4 mt-6">
                <h3 className="font-bold text-lg text-blue-800 border-b pb-2 mb-4">
                  Goods Information (Edit)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="noOfGoods" className="font-semibold text-gray-700 text-sm">
                      No. of Goods:
                    </label>
                    <input
                      type="number"
                      name="noOfGoods"
                      id="noOfGoods"
                      className="border border-gray-300 p-2.5 rounded-lg text-sm"
                      placeholder="Enter Number"
                      value={formData.noOfGoods}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2 flex flex-col gap-1.5">
                    <label htmlFor="goodsDescription" className="font-semibold text-gray-700 text-sm">
                      Description:
                    </label>
                    <textarea
                      name="goodsDescription"
                      id="goodsDescription"
                      value={formData.goodsDescription}
                      onChange={handleChange}
                      className="border border-gray-300 p-2.5 rounded-lg text-sm"
                      rows={1}
                      placeholder="Enter Description of Goods"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="my-5">
              <h2 className="font-semibold">Additional Visitors:</h2>
              <div className="flex flex-col gap-5 my-5">
                {visitors.map(
                  (visitor, index) =>
                    visitor._destroy !== "1" && (
                      <div key={index} className="flex gap-5 items-end w-full">
                        <div className="grid gap-2 items-center w-full">
                          <label className="font-semibold">Name:</label>
                          <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            className="border border-gray-400 p-2 rounded-md"
                            value={visitor.name}
                            onChange={(event) => handleInputChange(index, event)}
                          />
                        </div>

                        <div className="grid gap-2 items-center w-full">
                          <label className="font-semibold">Mobile:</label>
                          <input
                            type="text"
                            placeholder="Mobile Number"
                            name="mobile"
                            className="border border-gray-400 p-2 rounded-md"
                            value={visitor.mobile}
                            onChange={(event) => handleInputChange(index, event)}
                          />
                        </div>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveVisitor(index);
                          }}
                          type="button"
                          className="mb-1 text-red-600"
                          title="Remove Visitor"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )
                )}
              </div>

              <div>
                <button
                  onClick={handleAddVisitor}
                  className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
                  type="button"
                >
                  Add Visitor
                </button>
              </div>
            </div>

            {selectedFrequency === "Frequently" && (
              <div className="flex flex-col gap-5 border border-gray-400 p-4 rounded-md">
                <h2 className="font-semibold">Pass Validity:</h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="grid gap-2 items-center w-full">
                    <label htmlFor="passStartDate" className="font-semibold">
                      Pass Start Date/Time:
                    </label>
                    <input
                      type="datetime-local"
                      id="passStartDate"
                      value={passStartDate}
                      onChange={handlePassStartDateChange}
                      className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                    />
                  </div>

                  <div className="grid gap-2 items-center w-full">
                    <label htmlFor="passEndDate" className="font-semibold">
                      Pass End Date/Time:
                    </label>
                    <input
                      type="datetime-local"
                      id="passEndDate"
                      value={passEndDate}
                      onChange={handlePassEndDateChange}
                      className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                    />
                  </div>
                </div>

                <p className="font-medium">Select Permitted Days :</p>
                <div className="flex gap-4 flex-wrap ">
                  {weekdaysMap.map((weekdayObj) => (
                    <button
                      key={weekdayObj.day}
                      className={`rounded-md p-2 px-4 shadow-custom-all-sides font-medium ${
                        selectedWeekdays?.includes(weekdayObj.day)
                          ? "bg-green-400 text-white "
                          : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleWeekdaySelection(weekdayObj.day);
                      }}
                      type="button"
                    >
                      {weekdayObj.day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-5 justify-center items-center my-4 mb-10">
              <button
                onClick={handleEditVisitor}
                className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditVisitor;
