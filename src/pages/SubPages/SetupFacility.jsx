import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { FaCheck, FaTrash } from "react-icons/fa";
import { BiPlusCircle } from "react-icons/bi";
import { Switch } from "../../Buttons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { postFacilitySetup } from "../../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getItemInLocalStorage } from "../../utils/localStorage";

const SetupFacility = () => {
  const siteId = getItemInLocalStorage("SITEID");

  const [allowMultipleSlots, setAllowMultipleSlots] = useState("no");

  const handleSelectChange = (e) => {
    setAllowMultipleSlots(e.target.value);
  };
  // const id = useParams().id;
  // const id = getItemInLocalStorage("SITEID")
  const [isTenant, setIsTenant] = useState(false);
  const themeColor = useSelector((state) => state.theme.color);
  const [facilityError, setFacilityError] = useState("");
  const [activeError, setActiveError] = useState("");
  const [shareError, setShareError] = useState("");
  const [billingError, setBillingError] = useState("");
  const [formData, setFormData] = useState({
    type: "bookable",
    name: "",
    description: "",
    fac_name: "",
    fac_type: "bookable",
    active: "", //active yes or no
    shareable: "", //shareable yes or no
    billing: "",
    // tenant: false,
    flat: false,
    flat_charges: "",
    terms: "",
    min_people: "",
    max_people: "",
    member_charges: "",
    member: false,
    guest: false,
    covers: "",
    member_price_adult: "",
    // member_price_child: "",
    guest_price_adult: "",
    // guest_price_child: "",
    // tenant_price_adult: "",
    // tenant_price_child: "",
    prepaid: false,
    postpaid: false,
    pay_on_facility: false,
    complimentary: false,
    gst_no:"",
    cancellation_policy: "",
    slots: [
      {
        start_hr: "",
        end_hr: "",
        start_min: "",
        end_min: "",
      },
    ],
    attachments: [],
    cover_images: [],
  });

  const handleFileChange = (files, fieldName) => {
    // Changed to receive 'files' directly
    setFormData({
      ...formData,
      [fieldName]: files,
    });
    console.log(fieldName);
  };

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "fac_name" && value.trim().length === 0) {
      setFacilityError("This field is required");
    } else {
      setFacilityError("");
    }
  };

  const handleDropdownChange1 = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "active" && value === "") {
      setActiveError("Please select an option");
    } else {
      setActiveError("");
    }
  };

  const handleDropdownChange2 = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "shareable" && value === "") {
      setShareError("Please select an option");
    } else {
      setShareError("");
    }
  };

  const handleDropdownChange3 = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "billing" && value === "") {
      setBillingError("Please select an option");
    } else {
      setBillingError("");
    }

    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  const validateUserPaymentSelection = (formData) => {
    const paymentModes = [
      "postpaid",
      "prepaid",
      "pay_on_facility",
      "complimentary",
    ];

    const isAnySelected = paymentModes.some((mode) => formData[mode] === true);

    if (!isAnySelected) {
      toast.error("Please select at least one payment option.");
      return false;
    }

    return true;
  };

  console.log('Formdata',formData)

  const handleOnSubmit = (e) => {
    e.preventDefault();

    let invalidFields = [];
    let formIsValid = true;

    const requiredFields = [
      { key: "fac_name", label: "Facility Name" },
      { key: "active", label: "Active" },
      { key: "shareable", label: "Shareable" },
    ];

    const numericFields = [
      { key: "min_people", label: "Minimum people" },
      { key: "max_people", label: "Maximum people" },
      { key: "flat_charges", label: "Flat amount" },
      { key: "member_price_adult", label: "Member adult price" },
      { key: "guest_price_adult", label: "Guest adult price" },
    ];

    const isMemberSelected = formData.member;
    const isGuestSelected = formData.guest;
    const isFlatSelected = formData.flat === true; // assuming flat is a checkbox
    const hasFlatAmount = formData.flat_charges?.toString().trim() !== "";
    const hasMemberAmount =
      formData.member_price_adult?.toString().trim() !== "";
    const hasGuestAmount = formData.guest_price_adult?.toString().trim() !== "";

    //Check if at least one pricing category is selected
    if (!isMemberSelected && !isGuestSelected && !isFlatSelected) {
      toast.error("Please select at least one category (member/guest/flat).");
      formIsValid = false;
    }

    //If flat is selected, flat amount must be provided
    if (isFlatSelected && !hasFlatAmount) {
      toast.error("Please enter flat charges.");
      formIsValid = false;
    }

    //If member is selected, member amount must be provided
    if (isMemberSelected && !hasMemberAmount) {
      toast.error("Please enter member price.");
      formIsValid = false;
    }

    //If guest is selected, guest amount must be provided
    if (isGuestSelected && !hasGuestAmount) {
      toast.error("Please enter guest price.");
      formIsValid = false;
    }

    //Payment mode check
    const isPaymentValid = validateUserPaymentSelection(formData);
    if (!isPaymentValid) {
      formIsValid = false;
    }

    //Required fields check
    requiredFields.forEach(({ key, label }) => {
      if (!formData[key] || formData[key].toString().trim() === "") {
        invalidFields.push(label);
      }
    });

    //Numeric fields check
    numericFields.forEach(({ key, label }) => {
      const value = Number(formData[key]);

      // Skip validation for member/guest/flat prices if not selected
      if (
        (key === "flat_charges" && !formData.flat) ||
        (key === "member_price_adult" && !formData.member) ||
        (key === "guest_price_adult" && !formData.guest)
      ) {
        return; // skip this field
      }

      if (isNaN(value) || value <= 0) {
        invalidFields.push(label);
      }
    });

    if (invalidFields.length > 0) {
      toast.error(
        `Form is not valid. Please enter ${invalidFields.join(", ")}`
      );
      formIsValid = false;
    }

    //Slot configuration check
    if (!formData.slots || formData.slots.length === 0) {
      toast.error("Please configure at least one slot.");
      formIsValid = false;
    }

    // const timeToMinutes = (timeStr) => {
    //   const [hours, minutes] = timeStr.split(":").map(Number);
    //   return hours * 60 + minutes;
    // };

    // formData.slots.forEach((slot) => {
    //   if (
    //     !slot.startTime ||
    //     !slot.endTime ||
    //     slot.startTime.trim() === "" ||
    //     slot.endTime.trim() === ""
    //   ) {
    //     toast.error("All slots must have a valid start and end time.");
    //     formIsValid = false;
    //   } else {
    //     const startMinutes = timeToMinutes(slot.startTime);
    //     const endMinutes = timeToMinutes(slot.endTime);
    //     if (startMinutes >= endMinutes) {
    //       toast.error("Start time must be before end time.");
    //       formIsValid = false;
    //     }
    //   }
    // });

    //Final submission trigger
    if (formIsValid) {
      handleAddFacility(e);
    }
  };

  const navigate = useNavigate();
  // const handleSubmit = async () => {
  //   const sendData = new FormData();
  //   sendData.append("amenity[site_id]", siteId);
  //   sendData.append("amenity[name]", formData.name);
  //   sendData.append("amenity[description]", formData.description);
  //   formData.attachments.forEach((file, index) => {
  //     sendData.append(`attachments[]`, file);
  //   });
  //   formData.cover_images.forEach((file, index) => {
  //     sendData.append(`cover_images[]`, file);
  //   });
  //   try {
  //     toast.loading("please wait!");
  //     const response = await postFacilitySetup(sendData);
  //     toast.dismiss();
  //     toast.success("New Facility Setup Added Successfully!");
  //     navigate(`/setup/facility`);
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //     toast.dismiss();
  //     toast.error("Error Adding New Facility");
  //   }
  // };
  // const [slots, setSlots] = useState([
  //   {
  //     id: 1,
  //     startTime: "",
  //     breakTimeStart: "",
  //     breakTimeEnd: "",
  //     endTime: "",
  //     concurrentSlots: "",
  //     slotBy: "",
  //     wrapTime: "",
  //     day: "",
  //     isActive: false,
  //     isBookable: false,
  //   },
  // ]);

  // const handleAddSlot = () => {
  //   setSlots([
  //     ...slots,
  //     {
  //       id: slots.length + 1,
  //       startTime: "",
  //       breakTimeStart: "",
  //       breakTimeEnd: "",
  //       endTime: "",
  //       concurrentSlots: "",
  //       slotBy: "",
  //       wrapTime: "",
  //       day: "",
  //       isActive: false,
  //       isBookable: false,
  //     },
  //   ]);
  // };

  const handleAddSlot = () => {
    setFormData((prevState) => ({
      ...prevState,
      slots: [
        ...prevState.slots,
        {
          start_hr: "", // Hour for start time
          start_min: "", // Minute for start time
          end_hr: "", // Hour for end time
          end_min: "", // Minute for end time
        },
      ],
    }));
  };

  const handleRemoveSlot = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      slots: prevState.slots.filter((_, i) => i !== index),
    }));
  };

  const handleFacTypeChange = (e) => {
    setFormData({ ...formData, fac_type: e.target.value });
  };

  const [bookBefore, setBookBefore] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  // const handleRemoveSlot = (id) => {
  //   setSlots(slots.filter((slot) => slot.id !== id));
  // };

  const handleInputChange = (id, field, value) => {
    setSlots(
      slots.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
    );
  };

  const [timeValues, setTimeValues] = useState({
    time1: "00:00",
    time2: "00:00",
    time3: "00:00",
  });

  const handleTimeChange = (e, timeKey) => {
    const { value } = e.target;
    setTimeValues((prev) => ({
      ...prev,
      [timeKey]: value,
    }));
  };
  const [subFacilities, setSubFacilities] = useState([
    { name: "", status: "" },
  ]);

  const handleAddSubFacility = () => {
    setSubFacilities([...subFacilities, { name: "", status: "" }]);
  };
  const handleRemoveSubFacility = (index) => {
    const updatedSubFacilities = subFacilities.filter((_, i) => i !== index);
    setSubFacilities(updatedSubFacilities);
  };

  const handleSubChange = (index, field, value) => {
    const updatedSubFacilities = subFacilities.map((subFacility, i) =>
      i === index ? { ...subFacility, [field]: value } : subFacility
    );
    setSubFacilities(updatedSubFacilities);
  };
  const [subFacilityAvailable, setSubFacilityAvailable] = useState(false);

  const [rules, setRules] = useState([{ selectedOption: "", timesPerDay: "" }]);
  const options = ["Flat", "User", "Tenant", "Owner"];
  const handleAddRule = () => {
    if (rules.length < 5) {
      setRules([...rules, { selectedOption: "", timesPerDay: "" }]);
    }
  };
  const handleOptionChange = (index, field, value) => {
    const updatedRules = rules.map((rule, i) =>
      i === index ? { ...rule, [field]: value } : rule
    );
    setRules(updatedRules);
  };

  const handleRemoveRule = (index) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
  };

  const [blockData, setBlockData] = useState({
    blockBy: "",
  });

  const handleSlotTimeChange = (index, timeType, timeValue) => {
    const [hours, minutes] = timeValue.split(":");

    setFormData((prevState) => {
      const updatedSlots = [...prevState.slots];
      updatedSlots[index] = {
        ...updatedSlots[index],
        [`${timeType}_hr`]: hours,
        [`${timeType}_min`]: minutes,
      };
      return { ...prevState, slots: updatedSlots };
    });
  };

  const handleAddFacility = async (e) => {
    e.preventDefault();

    const bookBeforeArray = [
      `${bookBefore.days || 0} days, ${bookBefore.hours || 0} hours, ${
        bookBefore.minutes || 0
      } minutes`,
      JSON.stringify(bookBefore),
      null,
    ];

    const sendData = new FormData();
    // Fix: Use siteId from localStorage instead of formData.site_id
    sendData.append("amenity[site_id]", siteId);
    sendData.append("amenity[fac_name]", formData.fac_name || "");
    sendData.append("amenity[fac_type]", formData.fac_type || "");
    // sendData.append("amenity[tenant]", formData.tenant || false);
    sendData.append("amenity[description]", formData.description || "");
    sendData.append("amenity[terms]", formData.terms || "");
    sendData.append(
      "amenity[cancellation_policy]",
      formData.cancellation_policy || ""
    );
    sendData.append("amenity[min_people]", formData.min_people || "");
    sendData.append("amenity[max_people]", formData.max_people || "");
    sendData.append("amenity[member_charges]", formData.member_charges || "");
    sendData.append("amenity[member]", formData.member || false);
    sendData.append("amenity[guest]", formData.guest || false);
    sendData.append("amenity[is_fixed]", formData.flat || false);
    sendData.append("amenity[fixed_amount]", formData.flat_charges || "");
    sendData.append("amenity[postpaid]", formData.postpaid || false);
    sendData.append("amenity[prepaid]", formData.prepaid || false);
    sendData.append("amenity[pay_on_facility]", formData.pay_on_facility || false);
    sendData.append("amenity[complimentary]", formData.complimentary || false);
    sendData.append("amenity[gst_no]", formData.gst_no || 18 );
    // Add pricing fields
    sendData.append(
      "amenity[member_price_adult]",
      formData.member_price_adult || ""
    );
    // sendData.append(
    //   "amenity[member_price_child]",
    //   formData.member_price_child || ""
    // );
    sendData.append(
      "amenity[guest_price_adult]",
      formData.guest_price_adult || ""
    );
    // sendData.append(
    //   "amenity[guest_price_child]",
    //   formData.guest_price_child || ""
    // );
    // sendData.append(
    //   "amenity[tenant_price_adult]",
    //   formData.tenant_price_adult || ""
    // );
    // sendData.append(
    //   "amenity[tenant_price_child]",
    //   formData.tenant_price_child || ""
    // );
    sendData.append("book_before[0]", bookBeforeArray[0]);
    sendData.append("book_before[1]", bookBeforeArray[1]);
    sendData.append("book_before[2]", bookBeforeArray[2]);
    sendData.append("amenity[fac_type]", formData.fac_type || "bookable");

    // Add multiple slots data with correct parameter names
    // formData.slots.forEach((slot, index) => {
    //   if (slot.startTime && slot.endTime) {
    //     // Convert time format from "HH:MM" to separate hour and minute
    //     const [startHour, startMin] = slot.startTime.split(":");
    //     const [endHour, endMin] = slot.endTime.split(":");

    //     sendData.append(
    //       `amenity[amenity_slots_attributes][${index}][start_hr]`,
    //       startHour || ""
    //     );
    //     sendData.append(
    //       `amenity[amenity_slots_attributes][${index}][start_min]`,
    //       startMin || ""
    //     );
    //     sendData.append(
    //       `amenity[amenity_slots_attributes][${index}][end_hr]`,
    //       endHour || ""
    //     );
    //     sendData.append(
    //       `amenity[amenity_slots_attributes][${index}][end_min]`,
    //       endMin || ""
    //     );

    //     // Handle break times if provided
    //     // if (slot.breakTimeStart && slot.breakTimeEnd) {
    //     //   const [breakStartHour, breakStartMin] =
    //     //     slot.breakTimeStart.split(":");
    //     //   const [breakEndHour, breakEndMin] = slot.breakTimeEnd.split(":");
    //     //   sendData.append(
    //     //     `amenity[amenity_slots_attributes][${index}][break_start_hr]`,
    //     //     breakStartHour || ""
    //     //   );
    //     //   sendData.append(
    //     //     `amenity[amenity_slots_attributes][${index}][break_start_min]`,
    //     //     breakStartMin || ""
    //     //   );
    //     //   sendData.append(
    //     //     `amenity[amenity_slots_attributes][${index}][break_end_hr]`,
    //     //     breakEndHour || ""
    //     //   );
    //     //   sendData.append(
    //     //     `amenity[amenity_slots_attributes][${index}][break_end_min]`,
    //     //     breakEndMin || ""
    //     //   );
    //     // }

    //     // sendData.append(
    //     //   `amenity[amenity_slots_attributes][${index}][concurrent_slots]`,
    //     //   slot.concurrentSlots || "1"
    //     // );
    //     // sendData.append(
    //     //   `amenity[amenity_slots_attributes][${index}][slot_duration]`,
    //     //   slot.slotBy || "60"
    //     // );
    //     // sendData.append(
    //     //   `amenity[amenity_slots_attributes][${index}][wrap_up_time]`,
    //     //   slot.wrapTime || "0"
    //     // );
    //     // sendData.append(
    //     //   `amenity[amenity_slots_attributes][${index}][is_active]`,
    //     //   slot.isActive ? "1" : "0"
    //     // );
    //     // sendData.append(
    //     //   `amenity[amenity_slots_attributes][${index}][is_bookable]`,
    //     //   slot.isBookable ? "1" : "0"
    //     // );
    //   }
    // });

     formData.slots.forEach((slot, index) => {
       Object.entries(slot).forEach(([key, value]) => {
         sendData.append(
           `amenity[amenity_slots_attributes][${index}][${key}]`,
           value
         );
       });
     });
    // Remove these unpermitted parameters
    // sendData.append("amenity[startTime]", timeValues.time1 || "00:00");
    // sendData.append("amenity[endTime]", timeValues.time2 || "00:00");
    // sendData.append("amenity[cancelTime]", timeValues.time3 || "00:00");

    // Fix the file attachments - check if they exist and are arrays
    if (formData.attachments && formData.attachments.length > 0) {
      Array.from(formData.attachments).forEach((file) => {
        sendData.append("attachments[]", file);
      });
    }

    // Add cover images
    if (formData.cover_images && formData.cover_images.length > 0) {
      Array.from(formData.cover_images).forEach((file) => {
        sendData.append("cover_images[]", file);
      });
    }

    try {
      toast.loading("Please wait!");
      const response = await postFacilitySetup(sendData);

      toast.dismiss();
      toast.success("Facility added successfully");
      navigate("/setup/facility");
      console.log(response);
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Error adding facility");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  return (
    <section className="flex">
      <Navbar />
      <div className="w-full p-4 mb-5">
        <h1
          style={{ background: themeColor }}
          className="bg-black text-white font-semibold rounded-md text-center p-2"
        >
          Setup New Facility
        </h1>

        {/* Update the radio button section to set fac_type */}
        <div className="flex gap-4 my-4">
          <div className="flex gap-2 items-center">
            <input
              type="radio"
              name="fac_type"
              id="bookable"
              value="bookable"
              checked={formData.fac_type === "bookable"}
              onChange={handleChange}
            />
            <label htmlFor="bookable" className="text-lg">
              Bookable
            </label>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="radio"
              name="fac_type"
              id="request"
              value="request"
              checked={formData.fac_type === "request"}
              onChange={handleChange}
            />
            <label htmlFor="request" className="text-lg">
              Request
            </label>
          </div>
        </div>

        <div>
          <h2 className="border-b border-black text-lg  font-medium my-3">
            Facility Details
          </h2>
          <div className="grid md:grid-cols-4 gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="font-medium">
                Facility name
              </label>
              <input
                type="text"
                name="fac_name"
                onChange={handleChange1}
                onBlur={handleChange1}
                id=""
                value={formData.fac_name}
                className="border border-gray-400 rounded-md p-2"
                placeholder="Facility name"
              />
              {facilityError && (
                <div className="text-red-500 text-sm mt-2">{facilityError}</div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="font-medium">
                Active
              </label>
              <select
                name="active"
                id="active"
                value={formData.active}
                onChange={handleDropdownChange1}
                onBlur={handleDropdownChange1}
                className="border rounded-md border-gray-400 p-2 "
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {activeError && (
                <div className="text-red-500 text-sm mt-2">{activeError}</div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="font-medium">
                Shareable
              </label>
              <select
                name="shareable"
                id="shareable"
                value={formData.shareable}
                className="border rounded-md border-gray-400 p-2"
                onChange={handleDropdownChange2}
                onBlur={handleDropdownChange2}
              >
                <option value="">Select </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {shareError && (
                <div className="text-red-500 text-sm mt-2">{shareError}</div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="font-medium">
                Link to billing
              </label>
              <select
                name="billing"
                id="billing"
                value={formData.billing}
                className="border rounded-md border-gray-400 p-2"
                onChange={handleDropdownChange3}
                onBlur={handleDropdownChange3}
              >
                <option value="">Select </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {billingError && (
                <div className="text-red-500 text-sm mt-2">{billingError}</div>
              )}
            </div>
          </div>
          <div>
            <div className="my-2">
              <label htmlFor="subFacility" className="flex items-center gap-2">
                Sub Facility
                <input
                  type="checkbox"
                  name=""
                  id="subFacility"
                  checked={subFacilityAvailable === true}
                  onChange={() =>
                    setSubFacilityAvailable(!subFacilityAvailable)
                  }
                  className="h-4 w-4"
                />
              </label>
            </div>
            {subFacilityAvailable && (
              <>
                <div className="grid grid-cols-3 gap-x-5">
                  {subFacilities.map((subFacility, index) => (
                    <div className="flex items-end gap-2 mb-4" key={index}>
                      <div className="flex flex-col">
                        <label
                          htmlFor={`name-${index}`}
                          className="font-medium"
                        >
                          Sub Facility name
                        </label>
                        <input
                          type="text"
                          name={`name-${index}`}
                          id={`name-${index}`}
                          className="border p-2 rounded-md"
                          placeholder="Sub Facility name"
                          value={subFacility.name}
                          onChange={(e) =>
                            handleSubChange(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex flex-col">
                        <label
                          htmlFor={`status-${index}`}
                          className="font-medium"
                        >
                          Active
                        </label>
                        <select
                          name={`status-${index}`}
                          id={`status-${index}`}
                          className="border p-2 rounded-md w-48"
                          value={subFacility.status}
                          onChange={(e) =>
                            handleSubChange(index, "status", e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <button
                        onClick={() => handleRemoveSubFacility(index)}
                        className="text-red-500 mb-2 "
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddSubFacility}
                  className="mt-2 p-2 bg-blue-500 text-white rounded-md"
                >
                  Add Sub Facility
                </button>
              </>
            )}
          </div>
        </div>
        <div className="my-4">
          <h2 className="border-b border-black font-medium text-lg">
            Fee Setup
          </h2>

          <div className="border rounded-lg bg-blue-50 p-1 my-2">
            <div className="grid grid-cols-4 border-b border-gray-400">
              <p className="text-center font-medium">Member Type</p>
              <p className="text-center font-medium">Adult</p>
              <p className="text-center font-medium"> Flat amount</p>
              <p className="text-center font-medium">Configure Payment</p>
            </div>
            <div className="grid grid-cols-4 items-center border-b">
              <div className="flex justify-center my-2">
                <label htmlFor="">
                  <input
                    type="checkbox"
                    name="member"
                    id=""
                    checked={formData.member}
                    onChange={(e) =>
                      setFormData({ ...formData, member: e.target.checked })
                    }
                  />{" "}
                  Member
                </label>
              </div>
              <div className="flex justify-center my-2">
                <div className="flex items-center">
                  {/* <div className="rounded-l-md border p-2 border-gray-400">
                    <input type="checkbox" name="" id="" />
                  </div> */}
                  <input
                    type="number"
                    name="member_price_adult"
                    id=""
                    min={0}
                    value={formData.member_price_adult}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        member_price_adult: e.target.value,
                      })
                    }
                    required={formData.member === true}
                    // className="border border-gray-400 rounded-r-md p-2 outline-none"
                    className={`border border-gray-400 rounded p-2 outline-none ${
                      !formData.member
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder="₹100"
                  />
                </div>
              </div>
              <div className="flex justify-center my-2">
                <div className="flex items-center">
                  <div className="rounded-l-md border p-2 border-gray-400">
                    <input
                      type="checkbox"
                      name="flat"
                      id="flat"
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFormData({ ...formData, flat: isChecked });
                      }}
                    />
                  </div>
                  <input
                    type="number"
                    name="flat_charges"
                    id="flat_charges"
                    min={0}
                    value={formData.flat_charges}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        flat_charges: e.target.value,
                      })
                    }
                    disabled={!formData.flat}
                    // className="border border-gray-400 rounded-r-md p-2 outline-none"
                    className={`border border-gray-400 rounded-r-md p-2 outline-none ${
                      !formData.flat
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder="₹100"
                  />
                </div>
              </div>
              <div className="flex justify-center my-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="" className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="postpaid"
                        id="postpaid"
                        checked={formData.postpaid}
                        onChange={handlePaymentCheckbox}
                      />{" "}
                      Postpaid
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="prepaid"
                        id="prepaid"
                        checked={formData.prepaid}
                        onChange={handlePaymentCheckbox}
                      />{" "}
                      Prepaid
                    </label>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="" className="flex items-center gap-2 ">
                      <input
                        type="checkbox"
                        name="pay_on_facility"
                        id="pay_on_facility"
                        checked={formData.pay_on_facility}
                        onChange={handlePaymentCheckbox}
                      />{" "}
                      Pay on facility
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="complimentary"
                        id="complimentary"
                        checked={formData.complimentary}
                        onChange={handlePaymentCheckbox}
                      />{" "}
                      Complimentary
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="grid grid-cols-4 items-center border-b ">
              <div className="flex justify-center my-2">
                <label htmlFor="" className="flex items-center gap-2">
                  <input type="checkbox" name="" id="" />
                  Non-Member
                </label>
              </div>
              <div className="flex justify-center my-2">
                <div className="flex items-center">
                  <div className="rounded-l-md border p-2 border-gray-400">
                    <input type="checkbox" name="" id="" />
                  </div>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-r-md p-2 outline-none"
                    placeholder="₹100"
                  />
                </div>
              </div>
              <div className="flex justify-center my-2">
                <div className="flex items-center">
                  <div className="rounded-l-md border p-2 border-gray-400">
                    <input type="checkbox" name="" id="" />
                  </div>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-r-md p-2 outline-none"
                    placeholder="₹100"
                  />
                </div>
              </div>
              <div className="flex justify-center my-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="" className="flex items-center gap-2">
                      <input type="checkbox" name="" id="" /> Postpaid
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input type="checkbox" name="" id="" /> Prepaid
                    </label>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="" className="flex items-center gap-2 ">
                      <input type="checkbox" name="" id="" /> Pay on facility
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input type="checkbox" name="" id="" /> Complimentary
                    </label>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="grid grid-cols-4 items-center border-b">
              <div className="flex justify-center my-2">
                <label htmlFor="" className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="guest"
                    checked={formData.guest}
                    onChange={(e) =>
                      setFormData({ ...formData, guest: e.target.checked })
                    }
                    id=""
                  />
                  Guest
                </label>
              </div>
              <div className="flex justify-center my-2">
                <div className="flex items-center">
                  {/* <div className="rounded-l-md border p-2 border-gray-400">
                    <input type="checkbox" name="" id="" />
                  </div> */}
                  <input
                    type="text"
                    name="guest_price_adult"
                    id=""
                    value={formData.guest_price_adult}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guest_price_adult: e.target.value,
                      })
                    }
                    disabled={!formData.guest}
                    required={formData.guest === true}
                    // className="border border-gray-400 rounded-r-md p-2 outline-none"
                    className={`border border-gray-400 rounded p-2 outline-none ${
                      !formData.guest
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder="₹100"
                  />
                </div>
              </div>
              <div></div>
              {/* <div className="flex justify-center my-2">
                <div className="flex items-center">
                  <div className="rounded-l-md border p-2 border-gray-400">
                    <input type="checkbox" name="" id="" />
                  </div>
                  <input
                    type="text"
                    name="guest_price_child"
                    id=""
                    value={formData.guest_price_child}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guest_price_child: e.target.value,
                      })
                    }
                    className="border border-gray-400 rounded-r-md p-2 outline-none"
                    placeholder="₹100"
                  />
                </div>
              </div> */}
              {/* <div className="flex justify-center my-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="" className="flex items-center gap-2">
                      <input type="checkbox" name="" id="" /> Postpaid
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input type="checkbox" name="" id="" /> Prepaid
                    </label>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="" className="flex items-center gap-2 ">
                      <input type="checkbox" name="" id="" /> Pay on facility
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input type="checkbox" name="" id="" /> Complimentary
                    </label>
                  </div>
                </div>
              </div> */}
            </div>
            {/* <div className="grid grid-cols-4 items-center border-b ">
              <div className="flex justify-center my-2">
                <label htmlFor="" className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="tenant"
                    id=""
                    value={formData.tenant}
                    // checked={isTenant}
                    onChange={(e) =>
                      setFormData({ ...formData, tenant: e.target.checked })
                    }
                  />
                  Tenant
                </label>
              </div>
              <div className="flex justify-center my-2">
                <div className="flex items-center">
                  <div className="rounded-l-md border p-2 border-gray-400">
                    <input type="checkbox" name="" id="" />
                  </div>
                  <input
                    type="text"
                    name="tenant_price_adult"
                    id=""
                    value={formData.tenant_price_adult}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tenant_price_adult: e.target.value,
                      })
                    }
                    className="border border-gray-400 rounded-r-md p-2 outline-none"
                    placeholder="₹100"
                  />
                </div>
              </div>
              <div className="flex justify-center my-2">
                <div className="flex items-center">
                  <div className="rounded-l-md border p-2 border-gray-400">
                    <input type="checkbox" name="" id="" />
                  </div>
                  <input
                    type="text"
                    name="tenant_price_child"
                    id=""
                    value={formData.tenant_price_child}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tenant_price_child: e.target.value,
                      })
                    }
                    className="border border-gray-400 rounded-r-md p-2 outline-none"
                    placeholder="₹100"
                  />
                </div>
              </div>
              <div className="flex justify-center my-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="" className="flex items-center gap-2">
                      <input type="checkbox" name="" id="" /> Postpaid
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input type="checkbox" name="" id="" /> Prepaid
                    </label>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="" className="flex items-center gap-2 ">
                      <input type="checkbox" name="" id="" /> Pay on facility
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input type="checkbox" name="" id="" /> Complimentary
                    </label>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="grid grid-cols-3 gap-4">
              <div className="my-2 flex flex-col gap-2">
                <label htmlFor="" className="font-medium">
                  Minimum person allowed
                </label>
                <input
                  type="number"
                  name="min_people"
                  min={0}
                  value={formData.min_people}
                  onChange={(e) =>
                    setFormData({ ...formData, min_people: e.target.value })
                  }
                  id=""
                  className="border rounded-md p-2"
                  placeholder="Minimum person allowed"
                />
              </div>
              <div className="my-2 flex flex-col gap-2">
                <label htmlFor="" className="font-medium">
                  Maximum person allowed
                </label>
                <input
                  type="number"
                  name="max_people"
                  id=""
                  min={0}
                  value={formData.max_people}
                  onChange={(e) =>
                    setFormData({ ...formData, max_people: e.target.value })
                  }
                  className="border rounded-md p-2"
                  placeholder="Maximum person allowed"
                />
              </div>
              <div className="my-2 flex flex-col gap-2">
                <label htmlFor="" className="font-medium">
                  GST
                </label>
                <input
                  type="number"
                  name="gst_no"
                  id="gst_no"
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="GST(%)"
                  min={18}
                  value={formData.gst_no || ""}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      gst_no: e.target.value, // ✅ Correctly updates gst in formData
                    }))
                  }
                />
              </div>
            </div>
            <div className="my-2 flex items-center gap-2">
              <label htmlFor="" className="font-medium">
                Consecutive slots Allowed
              </label>
              <Switch />
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border-y">
          <div className="grid grid-cols-4 items-center border-b px-4 gap-2">
            <div className="flex justify-center my-2">
              <label htmlFor="" className="flex items-center gap-2">
                Booking allowed before
              </label>
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="number"
                name="bookBefore[days]"
                min={0}
                id=""
                value={bookBefore.days}
                onChange={(e) =>
                  setBookBefore({
                    ...bookBefore,
                    days: e.target.value || "day",
                  })
                }
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Day"
              />
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="number"
                name="bookBefore[hours]"
                min={0}
                id=""
                value={bookBefore.hours}
                onChange={(e) =>
                  setBookBefore({
                    ...bookBefore,
                    hours: e.target.value || "Hour",
                  })
                }
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Hour"
              />
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="number"
                name="bookBefore[minutes]"
                id=""
                min={0}
                value={bookBefore.minutes}
                onChange={(e) =>
                  setBookBefore({
                    ...bookBefore,
                    minutes: parseInt(e.target.value) || "Mins",
                  })
                }
                className="border border-gray-400 rounded-md w-full p-2 outline-none"
                placeholder="Mins"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center border-b px-4 gap-2">
            <div className="flex justify-center my-2">
              <label htmlFor="" className="flex items-center gap-2">
                Advance Booking
              </label>
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="number"
                name=""
                id=""
                min={0}
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Day"
              />
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="number"
                name=""
                id=""
                min={0}
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Hour"
              />
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="number"
                name=""
                id=""
                min={0}
                className="border border-gray-400 rounded-md w-full p-2 outline-none"
                placeholder="Mins"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center  px-4 gap-2">
            <div className="flex justify-center my-2">
              <label htmlFor="" className="flex items-center gap-2">
                Can Cancel Before Schedule
              </label>
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="number"
                name=""
                id=""
                min={0}
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Day"
              />
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="number"
                name=""
                id=""
                min={0}
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Hour"
              />
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="number"
                name=""
                id=""
                min={0}
                className="border border-gray-400 rounded-md w-full p-2 outline-none"
                placeholder="Mins"
              />
            </div>
          </div>
        </div>
        {/* <div className="w-full mt-2">
          <h2
            htmlFor=""
            className="font-medium border-b border-black w-full text-lg"
          >
            Booking Rule
          </h2>
          <div className=" grid  gap-2 border-gray-400 py-2">
            {rules.map((rule, index) => (
              <div key={index} className="mb-2 grid grid-cols-12">
                <label className="flex gap-2 items-center col-span-5">
                  <input type="checkbox" className="h-4 w-4" />
                  Facility can be booked
                  <input
                    type="text"
                    value={rule.timesPerDay}
                    onChange={(e) =>
                      handleOptionChange(index, "timesPerDay", e.target.value)
                    }
                    className="border border-gray-400 rounded-md w-full p-1 outline-none max-w-14"
                    placeholder="Enter times"
                  />
                  times per day by
                  <select
                    value={rule.selectedOption}
                    onChange={(e) =>
                      handleOptionChange(
                        index,
                        "selectedOption",
                        e.target.value
                      )
                    }
                    className="border border-gray-400 rounded-md w-full p-1 outline-none max-w-28"
                  >
                    <option value="">Select</option>
                    {options.map((option) => (
                      <option
                        key={option}
                        value={option}
                        disabled={rules.some(
                          (r) => r.selectedOption === option
                        )}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  onClick={() => handleRemoveRule(index)}
                  className="ml-4 bg-red-500 text-white px-2 py-1 rounded-md w-fit"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <div className="flex">
              <button
                onClick={handleAddRule}
                disabled={rules.length === 4}
                className={`${
                  rules.length === 4
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500"
                } mt-2  text-white px-4 py-2 rounded-md`}
              >
                Add Rule
              </button>
            </div>
            {/* </div> *
          </div>
        </div> */}
        <div className="my-4">
          <h2 className="border-b border-black text-lg mb-1 font-medium">
            Cover Images
          </h2>
          <FileInputBox
            handleChange={(files) => handleFileChange(files, "cover_images")}
            fieldName={"cover_images"}
            isMulti={true}
          />
        </div>
        <div className="my-4">
          <h2 className="border-b border-black text-lg mb-1 font-medium">
            Attachments
          </h2>
          <FileInputBox
            handleChange={(files) => handleFileChange(files, "attachments")}
            fieldName={"attachments"}
            isMulti={true}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="" className="font-medium">
            Description
          </label>
          <textarea
            name="description"
            id=""
            value={formData.description}
            onChange={handleChange1}
            cols="80"
            rows="3"
            // onChange={handleDescriptionChange}
            className="border border-gray-400 p-1 placeholder:text-sm rounded-md"
          />
        </div>
        <div className="my-4">
          <h2 className="border-b border-black text-lg mb-1 font-medium">
            Configure Slot
          </h2>

          {formData.slots.map((slot, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-2 bg-white my-2 rounded-lg"
            >
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Start time
                </label>
                <input
                  type="time"
                  placeholder="Start Time"
                  value={`${slot.start_hr}:${slot.start_min}`}
                  onChange={(e) =>
                    handleSlotTimeChange(index, "start", e.target.value)
                  }
                  className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                />
              </div>
              <div className="flex flex-col mx-3">
                <label htmlFor="" className="font-medium">
                  End Time
                </label>
                <input
                  type="time"
                  placeholder="End Time"
                  value={`${slot.end_hr}:${slot.end_min}`}
                  onChange={(e) =>
                    handleSlotTimeChange(index, "end", e.target.value)
                  }
                  className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                />
              </div>
              <div className="flex item-end">
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(index)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex ">
            <button
              type="button"
              onClick={handleAddSlot}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <BiPlusCircle className="h-5 w-5 mr-2" />
              Add Slot
            </button>
          </div>
        </div>
        <div></div>
        <div className="flex flex-col">
          <label htmlFor="terms" className="font-medium">
            Terms & Conditions
          </label>
          <textarea
            name="terms"
            id="terms"
            value={formData.terms}
            onChange={(e) =>
              setFormData({ ...formData, terms: e.target.value })
            }
            rows="3"
            className="border border-gray-400 rounded-md"
          />
        </div>
        <div className="flex flex-col my-4">
          <label htmlFor="" className="font-medium">
            Cancellation Policy
          </label>
          <textarea
            name="cancellation_policy"
            id=""
            onChange={(e) =>
              setFormData({ ...formData, cancellation_policy: e.target.value })
            }
            value={formData.cancellation_policy}
            rows="3"
            className="border border-gray-400 rounded-md"
          />
        </div>
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left font-medium text-sm text-gray-500 py-2">
                  Rules Description
                </th>
                <th className="text-center font-medium text-sm text-gray-500 py-2">
                  Time
                </th>

                <th className="text-right font-medium text-sm text-gray-500 py-2">
                  Deduction (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr className="border-t">
                <td className="text-sm py-2">
                  If user cancels the booking selected hours/days prior to
                  schedule, the given percentage of amount will be deducted
                </td>

                <td className="text-center py-2">
                  <input
                    type="time"
                    value={timeValues.time1}
                    onChange={(e) => handleTimeChange(e, "time1")}
                    className=" border rounded-md p-2 w-full"
                  />
                </td>
                <td className="flex items-center justify-end gap-2 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    className=" px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">%</span>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="border-t">
                <td className="text-sm py-2">
                  If user cancels the booking selected hours/days prior to
                  schedule, the given percentage of amount will be deducted
                </td>

                <td className="text-center py-2">
                  <input
                    type="time"
                    value={timeValues.time2}
                    onChange={(e) => handleTimeChange(e, "time2")}
                    className=" border rounded-md p-2 w-full"
                  />
                </td>
                <td className="flex items-center justify-end gap-2 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    className=" px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">%</span>
                </td>
              </tr>

              <tr className="border-t">
                <td className="text-sm py-2">
                  If user cancels the booking selected hours/days prior to
                  schedule, the given percentage of amount will be deducted
                </td>

                <td className="text-center py-2">
                  <input
                    type="time"
                    value={timeValues.time3}
                    onChange={(e) => handleTimeChange(e, "time3")}
                    className=" border rounded-md p-2 w-full"
                  />
                </td>
                <td className="flex items-center justify-end gap-2 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    className=" px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="font-medium border-b border-black">Block Days</h2>
          <div className="flex items-center gap-2">
            <DatePicker
              selectsRange={true}
              // startDate={startDate}
              // endDate={endDate}
              // onChange={(update) => {
              //   setStartDate(update[0]);
              //   setEndDate(update[1]);
              //   setFilteredPPMData(filterByDateRange(ppmData));
              // }}
              isClearable={true}
              placeholderText="Select date"
              className="p-1 border-gray-300 rounded-md w-64  my-2 outline-none border"
            />

            <select
              name=""
              id=""
              value={blockData.blockBy}
              onChange={(e) =>
                setBlockData({ ...blockData, blockBy: e.target.value })
              }
              className="p-1 border-gray-300 rounded-md w-64  my-2 outline-none border"
            >
              <option value="entire day">Entire day</option>
              <option value="selected slots">Selected Slots</option>
            </select>

            <textarea
              placeholder="Block reason"
              name=""
              id=""
              rows={1}
              className="p-2 border-gray-300 rounded-md w-96  my-2 outline-none border"
            ></textarea>
          </div>
          {blockData.blockBy === "selected slots" && (
            <div className="bg-blue-50 rounded-md p-2">
              <h2 className="font-medium border-b">Select slots</h2>
            </div>
          )}
        </div>
        <div className="flex justify-center my-2">
          <button
            onClick={handleOnSubmit}
            style={{ background: themeColor }}
            className=" text-white p-2 px-4 font-semibold rounded-md flex items-center gap-2"
          >
            <FaCheck /> Submit
          </button>
        </div>
      </div>
    </section>
  );
};

export default SetupFacility;
