import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { FaCheck, FaTrash } from "react-icons/fa";
import { BiPlusCircle } from "react-icons/bi";
import { Switch } from "../../Buttons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { postFacilitySetup, generateAmenitySlots, saveAmenitySlotConfig } from "../../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getItemInLocalStorage } from "../../utils/localStorage";

const SetupFacility = () => {
  const siteId = getItemInLocalStorage("SITEID");

  const [allowMultipleSlots, setAllowMultipleSlots] = useState("no");

  const daysList = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
  ];
  const handleSelectChange = (e) => {
    setAllowMultipleSlots(e.target.value);
  };
  // const id = useParams().id;
  // const id = getItemInLocalStorage("SITEID")
  const [isTenant, setIsTenant] = useState(false);
  const themeColor = useSelector((state) => state.theme.color);
  const [facilityError, setFacilityError] = useState("");
  const [activeError, setActiveError] = useState("");
  const [slotBy, setSlotBy] = useState(""); // Loading state
  const [shareError, setShareError] = useState("");
  const [billingError, setBillingError] = useState("");
  const [days, setDays] = useState(
    daysList.map((day) => ({
      ...day,
      is_active: false,
      start_time: "",
      end_time: "",
    })),
  );

  // ✅ Handle checkbox
  const handleCheck = (index) => {
    const updated = [...days];
    updated[index].is_active = !updated[index].is_active;
    setDays(updated);
  };

  // ✅ Handle time change
  const handleTimeChange1 = (index, field, value) => {
    const updated = [...days];
    updated[index][field] = value;
    setDays(updated);
  };

  // ✅ Convert UI → API payload
  const getPayload = () => {
    return days.map((d) => ({
      day_of_week: d.value,
      start_time: d.start_time || "",
      end_time: d.end_time || "",
      is_active: d.is_active,
    }));
  };

  const [formData, setFormData] = useState({
    type: "bookable",
    name: "",
    description: "",
    fac_name: "",
    fac_type: "bookable",
    active: "",
    shareable: "",
    billing: "",
    is_fixed: false,
    fixed_amount: "",
    terms: "",
    min_people: "",
    max_people: "",
    member_charges: "",
    // Member row
    member: false,
    member_price_adult: "",
    member_price_child: "",
    member_postpaid: false,
    member_prepaid: false,
    member_pay_on_facility: false,
    member_complimentary: false,
    // Non-Member row
    non_member: false,
    non_member_price_adult: "",
    non_member_price_child: "",
    non_member_postpaid: false,
    non_member_prepaid: false,
    non_member_pay_on_facility: false,
    non_member_complimentary: false,
    // Guest row
    guest: false,
    guest_price_adult: "",
    guest_price_child: "",
    guest_postpaid: false,
    guest_prepaid: false,
    guest_pay_on_facility: false,
    guest_complimentary: false,
    // Tenant row
    tenant: false,
    tenant_price_adult: "",
    tenant_price_child: "",
    tenant_postpaid: false,
    tenant_prepaid: false,
    tenant_pay_on_facility: false,

    is_member_adult: false,
    is_member_child: false,
    is_non_member_adult: false,
    is_non_member_child: false,
    is_guest_adult: false,
    is_guest_child: false,
    is_tenant_adult: false,
    is_tenant_child: false,
    tenant_complimentary: false,
    // Legacy global payment (kept for compatibility)
    prepaid: false,
    postpaid: false,
    pay_on_facility: false,
    complimentary: false,
    gst_no: "",
    cancellation_policy: "",
    book_before: "",
    cancel_before: "",
    advance_booking: "",
    max_slots: "",
    consecutive_slot_allowed: false,
    slots: [
      {
        start_hr: "",
        start_min: "",
        end_hr: "",
        end_min: "",
        break_start_hr: "",
        break_start_min: "",
        break_end_hr: "",
        break_end_min: "",
        concurrent_slots: "",
        slot_duration: "",
        wrap_up_time: "",
        prime_time_start_hr: "",
        prime_time_start_min: "",
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

  const handlePriceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value, // ← no more amenity nesting
    }));
  };

  const handleCheckboxChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleChildToggle = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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

  console.log("Formdata", formData);

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
      // { key: "fixed_amount", label: "Flat amount" },
      // { key: "member_price_adult", label: "Member adult price" },
      // { key: "guest_price_adult", label: "Guest adult price" },
    ];

    const isMemberSelected = formData.member;
    const isGuestSelected = formData.guest;
    const isFlatSelected = formData.is_fixed === true; // assuming flat is a checkbox
    const hasFlatAmount = formData.fixed_amount?.toString().trim() !== "";
    const hasMemberAmount =
      formData.member_price_adult?.toString().trim() !== "";
    const hasGuestAmount = formData.guest_price_adult?.toString().trim() !== "";

    //Check if at least one pricing category is selected
    // if (!isMemberSelected && !isGuestSelected && !isFlatSelected) {
    //   toast.error("Please select at least one category (member/guest/flat).");
    //   formIsValid = false;
    // }

    // //If flat is selected, flat amount must be provided
    // if (isFlatSelected && !hasFlatAmount) {
    //   toast.error("Please enter flat charges.");
    //   formIsValid = false;
    // }

    // //If member is selected, member amount must be provided
    // if (isMemberSelected && !hasMemberAmount) {
    //   toast.error("Please enter member price.");
    //   formIsValid = false;
    // }

    // //If guest is selected, guest amount must be provided
    // if (isGuestSelected && !hasGuestAmount) {
    //   toast.error("Please enter guest price.");
    //   formIsValid = false;
    // }

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
        (key === "fixed_amount" && !formData.flat) ||
        (key === "member_price_adult" && !formData.member) ||
        (key === "guest_price_adult" && !formData.guest)
      ) {
        return; // skip this field
      }

      if (isNaN(value) || value <= 0) {
        invalidFields.push(label);
      }
    });

    // if (invalidFields.length >= 0) {
    //   toast.error(
    //     `Form is not valid. Please enter ${invalidFields.join(", ")}`,
    //   );
    //   formIsValid = false;
    // }

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



  const handleAddSlot = () => {
    setFormData((prevState) => ({
      ...prevState,
      slots: [
        ...prevState.slots,
        {
          start_hr: "",
          start_min: "",
          end_hr: "",
          end_min: "",
          break_start_hr: "",
          break_start_min: "",
          break_end_hr: "",
          break_end_min: "",
          concurrent_slots: "",
          slot_duration: "",
          wrap_up_time: "",
          prime_time_start_hr: "",
          prime_time_start_min: "",
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
      slots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot,
      ),
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
      i === index ? { ...subFacility, [field]: value } : subFacility,
    );
    setSubFacilities(updatedSubFacilities);
  };
  const [subFacilityAvailable, setSubFacilityAvailable] = useState(false);

  const [rules, setRules] = useState([
    {
      id: Date.now(),
      enumerator: "daily_limit",
      duration: "",
      level: "",
      times: "",
      period_type: "",
      enabled: false,
      primeTime: [{ start_time: "", end_time: "" }],
    },
  ]);

  const normalizeRules = (rulesData) => {
    return rulesData.map((rule) => ({
      ...rule,
      primeTime:
        Array.isArray(rule.primeTime) && rule.primeTime.length > 0
          ? rule.primeTime
          : [{ start_time: "", end_time: "" }], // ✅ fallback
    }));
  };

  const handlePrimeTimeChange = (ruleId, index, field, value) => {
    setRules((prev) =>
      prev.map((rule) => {
        if (rule.id !== ruleId) return rule;

        const updatedPrimeTimes = [...rule.primeTime];
        // Ensure it's an array of objects
        if (!Array.isArray(updatedPrimeTimes)) {
          updatedPrimeTimes = [{ start_time: "", end_time: "" }];
        }

        // Update the specific prime time
        updatedPrimeTimes[index] = {
          ...updatedPrimeTimes[index],
          [field]: value,
        };

        return { ...rule, primeTime: updatedPrimeTimes };
      })
    );
  };

  const handleRemovePrimeTime = (ruleId, index) => {
    setRules((prev) =>
      prev.map((rule) => {
        if (rule.id !== ruleId) return rule;

        const updatedPrimeTimes = [...rule.primeTime];
        if (Array.isArray(updatedPrimeTimes)) {
          updatedPrimeTimes.splice(index, 1);
        }

        return { ...rule, primeTime: updatedPrimeTimes };
      })
    );
  };

  const handleAddPrimeTime = (ruleId) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
            ...rule,
            primeTime: [
              ...(rule.primeTime && Array.isArray(rule.primeTime) ? rule.primeTime : [{ start_time: "", end_time: "" }]),
              { start_time: "", end_time: "" },
            ],
          }
          : rule
      )
    );
  };
  const options = ["Flat", "User", "Tenant", "Owner"];

  const handleAddRule = () => {
    const newRule = {
      id: Date.now(),
      enumerator: "daily_limit",
      duration: "60",
      level: "",
      times: "",
      period_type: "",
      enabled: true,
      primeTime: [{ start_time: "", end_time: "" }],
    };
    setRules([...rules, newRule]);
  };
  const handleRemoveRule = (id) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const handleChange2 = (id, field, value) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)),
    );
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
        [`${timeType}_hr`]: hours ?? "",
        [`${timeType}_min`]: minutes ?? "",
      };
      return { ...prevState, slots: updatedSlots };
    });
  };

  const handleSlotFieldChange = (index, field, value) => {
    setFormData((prevState) => {
      const updatedSlots = [...prevState.slots];
      updatedSlots[index] = { ...updatedSlots[index], [field]: value };
      return { ...prevState, slots: updatedSlots };
    });
  };

  const formatTime = (hours, minutes) => {
    if (!hours && !minutes) return "";
    const hh = `${hours || ""}`.padStart(2, "0");
    const mm = `${minutes || ""}`.padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const handleAddFacility = async (e) => {
    e.preventDefault();

    const sendData = new FormData();

    // ── Basic info ────────────────────────────────────────────────────────────
    sendData.append("amenity[site_id]", siteId);
    sendData.append("amenity[fac_name]", formData.fac_name || "");
    sendData.append("amenity[fac_type]", formData.fac_type || "bookable");
    sendData.append("amenity[type_of_facility]", formData.type_of_facility || "");
    sendData.append("amenity[description]", formData.description || "");
    sendData.append("amenity[disclaimer]", formData.disclaimer || "");
    sendData.append("amenity[cancellation_policy]", formData.cancellation_policy || "");
    sendData.append("amenity[terms]", formData.terms || "");
    sendData.append("amenity[deposit]", formData.deposit || "");
    sendData.append("amenity[gst_no]", formData.gst_no || "");
    sendData.append("amenity[gst]", formData.gst || "18");
    sendData.append("amenity[sgst]", formData.sgst || "9");

    // active expects boolean on backend
    sendData.append("amenity[active]", formData.active === "yes" ? "true" : "false");
    sendData.append("amenity[status]", formData.status || "active");
    sendData.append("amenity[shareable]", formData.shareable || "");
    sendData.append("amenity[billing]", formData.billing || "");

    // ── People limits ─────────────────────────────────────────────────────────
    sendData.append("amenity[min_people]", formData.min_people || "");
    sendData.append("amenity[max_people]", formData.max_people || "");

    // ── Booking / schedule config ─────────────────────────────────────────────
    sendData.append("amenity[book_before]", formData.book_before || "");
    sendData.append("amenity[cancel_before]", formData.cancel_before || "");
    sendData.append("amenity[advance_booking]", formData.advance_booking || "");
    sendData.append("amenity[max_slots]", formData.max_slots || "");
    sendData.append("amenity[consecutive_slot_allowed]", formData.consecutive_slot_allowed ? "true" : "false");
    sendData.append("amenity[slot_by]", slotBy || "");

    // ── Global payment methods ────────────────────────────────────────────────
    sendData.append("amenity[prepaid]", formData.prepaid ? "true" : "false");
    sendData.append("amenity[postpaid]", formData.postpaid ? "true" : "false");
    sendData.append("amenity[pay_on_facility]", formData.pay_on_facility ? "true" : "false");
    sendData.append("amenity[payment_methods]", formData.payment_methods || "");

    // ── Fixed / Flat ──────────────────────────────────────────────────────────
    sendData.append("amenity[is_fixed]", formData.is_fixed ? "true" : "false");
    sendData.append("amenity[fixed_amount]", formData.fixed_amount || "");

    // ── Member ────────────────────────────────────────────────────────────────
    sendData.append("amenity[member]", formData.member ? "true" : "false");
    sendData.append("amenity[member_price_adult]", formData.member_price_adult || "");
    sendData.append("amenity[member_price_child]", formData.member_price_child || "");
    sendData.append("amenity[member_postpaid]", formData.member_postpaid ? "true" : "false");
    sendData.append("amenity[member_prepaid]", formData.member_prepaid ? "true" : "false");
    sendData.append("amenity[member_pay_on_facility]", formData.member_pay_on_facility ? "true" : "false");
    sendData.append("amenity[member_complimentary]", formData.member_complimentary ? "true" : "false");

    // ── Guest ─────────────────────────────────────────────────────────────────
    sendData.append("amenity[guest]", formData.guest ? "true" : "false");
    sendData.append("amenity[guest_price_adult]", formData.guest_price_adult || "");
    sendData.append("amenity[guest_price_child]", formData.guest_price_child || "");
    sendData.append("amenity[guest_postpaid]", formData.guest_postpaid ? "true" : "false");
    sendData.append("amenity[guest_prepaid]", formData.guest_prepaid ? "true" : "false");
    sendData.append("amenity[guest_pay_on_facility]", formData.guest_pay_on_facility ? "true" : "false");
    sendData.append("amenity[guest_complimentary]", formData.guest_complimentary ? "true" : "false");

    // ── Tenant ────────────────────────────────────────────────────────────────
    sendData.append("amenity[tenant]", formData.tenant ? "true" : "false");
    sendData.append("amenity[tenant_price_adult]", formData.tenant_price_adult || "");
    sendData.append("amenity[tenant_price_child]", formData.tenant_price_child || "");
    sendData.append("amenity[tenant_postpaid]", formData.tenant_postpaid ? "true" : "false");
    sendData.append("amenity[tenant_prepaid]", formData.tenant_prepaid ? "true" : "false");
    sendData.append("amenity[tenant_pay_on_facility]", formData.tenant_pay_on_facility ? "true" : "false");
    sendData.append("amenity[tenant_complimentary]", formData.tenant_complimentary ? "true" : "false");

    // ── Non-Member ────────────────────────────────────────────────────────────
    sendData.append("amenity[non_member]", formData.non_member ? "true" : "false");
    sendData.append("amenity[non_member_price_adult]", formData.non_member_price_adult || "");
    sendData.append("amenity[non_member_price_child]", formData.non_member_price_child || "");
    sendData.append("amenity[non_member_postpaid]", formData.non_member_postpaid ? "true" : "false");
    sendData.append("amenity[non_member_prepaid]", formData.non_member_prepaid ? "true" : "false");
    sendData.append("amenity[non_member_pay_on_facility]", formData.non_member_pay_on_facility ? "true" : "false");
    sendData.append("amenity[non_member_complimentary]", formData.non_member_complimentary ? "true" : "false");

    // ── Slots ─────────────────────────────────────────────────────────────────
    formData.slots.forEach((slot, index) => {
      const slotBase = `amenity[amenity_slots_attributes][${index}]`;
      sendData.append(`${slotBase}[start_hr]`, slot.start_hr || "");
      sendData.append(`${slotBase}[start_min]`, slot.start_min || "");
      sendData.append(`${slotBase}[end_hr]`, slot.end_hr || "");
      sendData.append(`${slotBase}[end_min]`, slot.end_min || "");
      sendData.append(`${slotBase}[break_start_hr]`, slot.break_start_hr || "");
      sendData.append(`${slotBase}[break_start_min]`, slot.break_start_min || "");
      sendData.append(`${slotBase}[break_end_hr]`, slot.break_end_hr || "");
      sendData.append(`${slotBase}[break_end_min]`, slot.break_end_min || "");
      sendData.append(`${slotBase}[concurrent_slots]`, slot.concurrent_slots || "1");
      sendData.append(`${slotBase}[slot_duration]`, slot.slot_duration || "");
      sendData.append(`${slotBase}[wrap_up_time]`, slot.wrap_up_time || "0");
    });

    // ── Operational days ──────────────────────────────────────────────────────
    days.forEach((day, idx) => {
      const base = `amenity[amenity_operational_days_attributes][${idx}]`;
      sendData.append(`${base}[day_of_week]`, day.value);
      sendData.append(`${base}[is_active]`, day.is_active ? "true" : "false");
      if (day.is_active) {
        sendData.append(`${base}[start_time]`, day.start_time || "");
        sendData.append(`${base}[end_time]`, day.end_time || "");
      }
    });

    // ── Booking rules ─────────────────────────────────────────────────────────
    // primeTime is always an array of { start_time, end_time } objects
    rules.forEach((rule, idx) => {
      const ruleBase = `amenity[amenity_booking_rules_attributes][${idx}]`;
      sendData.append(`${ruleBase}[enumerator]`, rule.enumerator || "daily_limit");
      sendData.append(`${ruleBase}[duration]`, rule.duration || "60");
      sendData.append(`${ruleBase}[level]`, rule.level || "");
      sendData.append(`${ruleBase}[active]`, rule.enabled ? "true" : "false");
      sendData.append(`${ruleBase}[site_id]`, siteId);
      sendData.append(`${ruleBase}[facility_can_be_booked]`, rule.enabled ? "true" : "false");
      sendData.append(`${ruleBase}[times_per_day]`, rule.times || "");
      sendData.append(`${ruleBase}[period_type]`, rule.period_type || "edit");

      // primeTime is an array of { start_time, end_time } objects
      const primeTimes = Array.isArray(rule.primeTime)
        ? rule.primeTime.filter((pt) => pt.start_time && pt.end_time)
        : [];

      primeTimes.forEach((pt, pIdx) => {
        const primeBase = `${ruleBase}[prime_times_attributes][${pIdx}]`;
        sendData.append(`${primeBase}[start_time]`, pt.start_time || "");
        sendData.append(`${primeBase}[end_time]`, pt.end_time || "");
      });
    });

    // ── Files ─────────────────────────────────────────────────────────────────
    if (formData.attachments?.length) {
      Array.from(formData.attachments).forEach((file) => {
        sendData.append("attachments[]", file);
      });
    }

    if (formData.cover_images?.length) {
      Array.from(formData.cover_images).forEach((file) => {
        sendData.append("cover_images[]", file);
      });
    }

    try {
      toast.loading("Saving facility...");
      const response = await postFacilitySetup(sendData);
      toast.dismiss();

      // Extract the new amenity's ID from the response
      const amenityId =
        response?.data?.id ||
        response?.data?.amenity?.id ||
        response?.data?.data?.id;

      // ── Save slot config then generate slots ─────────────────────────────
      if (amenityId && formData.slots?.length > 0) {
        const slot = formData.slots[0];
        const pad = (v) => String(v || "0").padStart(2, "0");
        const toTimeStr = (hr, min) => `${pad(hr)}:${pad(min)}:00`;

        // slotBy is stored in minutes; map to the label the API expects
        const slotByLabels = {
          "15": "15 min", "30": "30 min", "45": "45 min",
          "60": "1 hr", "90": "1.5 hr", "120": "2 hr",
          "180": "3 hr", "360": "6 hr", "720": "12 hr", "1440": "24 hr",
        };

        const slotConfigPayload = {
          amenity_slot_config: {
            start_time: toTimeStr(slot.start_hr, slot.start_min),
            end_time: toTimeStr(slot.end_hr, slot.end_min),
            break_time_start: toTimeStr(slot.break_start_hr, slot.break_start_min),
            break_time_end: toTimeStr(slot.break_end_hr, slot.break_end_min),
            concurrent_slot: Number(slot.concurrent_slots) || 1,
            slot_by: slotByLabels[String(slotBy)] || slotBy || "",
            wrap_time: Number(slot.wrap_up_time) || 0,
          },
        };

        try {
          toast.loading("Saving slot configuration...");
          await saveAmenitySlotConfig(amenityId, slotConfigPayload);
          toast.dismiss();

          toast.loading("Generating time slots...");
          await generateAmenitySlots(amenityId);
          toast.dismiss();

          toast.success("Facility and slots created successfully!");
        } catch (slotErr) {
          toast.dismiss();
          console.error("Slot config/generate error:", slotErr);
          toast.error("Facility saved but slot generation failed.");
        }
      } else {
        toast.success("Facility created successfully!");
      }

      navigate("/setup/facility");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to create facility");
      console.error(err);
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
                Link to building
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
          {/* <div className="grid md:grid-cols-5 gap-2 mt-3">
            <div className="flex flex-col gap-1">
              <label className="font-medium">Book Before Days</label>
              <input
                type="number"
                min={0}
                className="border border-gray-400 rounded-md p-2"
                value={formData.book_before}
                onChange={(e) =>
                  setFormData({ ...formData, book_before: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Cancel Before (mins)</label>
              <input
                type="number"
                min={0}
                className="border border-gray-400 rounded-md p-2"
                value={formData.cancel_before}
                onChange={(e) =>
                  setFormData({ ...formData, cancel_before: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Advance Booking (days)</label>
              <input
                type="number"
                min={0}
                className="border border-gray-400 rounded-md p-2"
                value={formData.advance_booking}
                onChange={(e) =>
                  setFormData({ ...formData, advance_booking: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Max Slots</label>
              <input
                type="number"
                min={1}
                className="border border-gray-400 rounded-md p-2"
                value={formData.max_slots}
                onChange={(e) =>
                  setFormData({ ...formData, max_slots: e.target.value })
                }
              />
            </div>
            <div className="flex items-end gap-2">
              <label className="font-medium">Consecutive Slot Allowed</label>
              <input
                type="checkbox"
                checked={formData.consecutive_slot_allowed}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    consecutive_slot_allowed: e.target.checked,
                  })
                }
              />
            </div>
          </div> */}
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

        {/* Payment Options */}
        <div className="flex gap-4  border-black items-center mt-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="postpaid"
              checked={formData.postpaid}
              onChange={handlePaymentCheckbox}
            />
            Postpaid
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="prepaid"
              checked={formData.prepaid}
              onChange={handlePaymentCheckbox}
            />
            Prepaid
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="pay_on_facility"
              checked={formData.pay_on_facility}
              onChange={handlePaymentCheckbox}
            />
            Pay on facility
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="complimentary"
              checked={formData.complimentary}
              onChange={handlePaymentCheckbox}
            />
            Complimentary
          </label>

        </div>

        <div className="my-4">
          <h2 className="border-b border-black font-medium text-lg mb-3">
            Fee Setup
          </h2>
          <div className="border rounded-lg bg-blue-50 p-1 my-2">
            <div className="grid grid-cols-4 border-b border-gray-400">
              <p className="text-center font-medium">Member Type</p>
              <p className="text-center font-medium">Adult</p>
              <p className="text-center font-medium"> Child</p>
              <p className="text-center font-medium"> Flat Amount</p>
            </div>

            {/* Member Section */}
            <div className="grid grid-cols-4 items-center border-b">
              <div className="flex justify-center my-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.member === true}
                    onChange={() => handleCheckboxChange("member")}
                  />
                  Member
                </label>
              </div>

              {/* Adult */}
              <div className="flex justify-center my-2">
                {/* Adult Checkbox */}
                <input
                  type="checkbox"
                  className="mx-2"
                  checked={formData.is_member_adult}
                  disabled={!formData.member}
                  onChange={() => handleChildToggle("is_member_adult")}
                />
                {/* Adult Price Input */}
                <input
                  type="text"
                  disabled={!formData.member || !formData.is_member_adult}
                  value={formData.member_price_adult || ""}
                  onChange={(e) =>
                    handlePriceChange("member_price_adult", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="₹100"
                />
              </div>

              {/* Child */}
              <div className="flex justify-center my-2">
                {/* Child Checkbox */}
                <input
                  type="checkbox"
                  className="mx-2"
                  checked={formData.is_member_child}
                  disabled={!formData.member}
                  onChange={() => handleChildToggle("is_member_child")}
                />
                {/* Child Price Input */}
                <input
                  type="text"
                  disabled={!formData.member || !formData.is_member_child}
                  value={formData.member_price_child || ""}
                  onChange={(e) =>
                    handlePriceChange("member_price_child", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="₹100"
                />
              </div>

              {/* Flat */}
              <div className="flex justify-center my-2">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  className="mx-2"
                  checked={formData.is_fixed || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_fixed: e.target.checked,
                      fixed_amount: e.target.checked ? formData.fixed_amount : ""
                    })
                  }
                />

                {/* Fixed Amount Input */}
                <input
                  type="text"
                  value={formData.fixed_amount || ""}
                  onChange={(e) =>
                    handlePriceChange("fixed_amount", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none w-62"
                  placeholder="₹100"
                  disabled={!formData.is_fixed}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center border-b">
              <div className="flex justify-center my-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.non_member === true}
                    onChange={() => handleCheckboxChange("non_member")}
                  />
                  Non-Member
                </label>
              </div>

              {/* Adult */}
              <div className="flex justify-center my-2">
                {/* Adult Checkbox */}
                <input
                  type="checkbox"
                  className="mx-2"
                  checked={formData.is_non_member_adult}
                  disabled={!formData.non_member}
                  onChange={() => handleChildToggle("is_non_member_adult")}
                />
                {/* Adult Price Input */}
                <input
                  type="text"
                  disabled={
                    !formData.non_member || !formData.is_non_member_adult
                  }
                  value={formData.non_member_price_adult || ""}
                  onChange={(e) =>
                    handlePriceChange("non_member_price_adult", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="₹100"
                />
              </div>

              {/* Child */}
              <div className="flex justify-center my-2">
                {/* Child Checkbox */}
                <input
                  type="checkbox"
                  className="mx-2"
                  checked={formData.is_non_member_child}
                  disabled={!formData.non_member}
                  onChange={() => handleChildToggle("is_non_member_child")}
                />
                {/* Child Price Input */}
                <input
                  type="text"
                  disabled={
                    !formData.non_member || !formData.is_non_member_child
                  }
                  value={formData.non_member_price_child || ""}
                  onChange={(e) =>
                    handlePriceChange("non_member_price_child", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="₹100"
                />
              </div>
              {/* <div className="flex justify-center my-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="" className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="postpaid"
                        id="postpaid"
                        checked={formData.non_member_postpaid}
                        onChange={handlePaymentCheckbox}
                      />{" "}
                      Postpaid
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="prepaid"
                        id="prepaid"
                        checked={formData.non_member_prepaid}
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
                        checked={formData.non_member_pay_on_facility}
                        onChange={handlePaymentCheckbox}
                      />{" "}
                      Pay on facility
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="complimentary"
                        id="complimentary"
                        checked={formData.non_member_complimentary}
                        onChange={handlePaymentCheckbox}
                      />{" "}
                      Complimentary
                    </label>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Guest Section */}
            <div className="grid grid-cols-4 items-center border-b">
              <div className="flex justify-center my-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.guest === true}
                    onChange={() => handleCheckboxChange("guest")}
                  />
                  Guest
                </label>
              </div>

              {/* Adult */}
              <div className="flex justify-center my-2">
                {/* Adult Checkbox */}
                <input
                  type="checkbox"
                  className="mx-2"
                  checked={formData.is_guest_adult}
                  disabled={!formData.guest}
                  onChange={() => handleChildToggle("is_guest_adult")}
                />
                {/* Adult Price Input */}
                <input
                  type="text"
                  disabled={!formData.guest || !formData.is_guest_adult}
                  value={formData.guest_price_adult || ""}
                  onChange={(e) =>
                    handlePriceChange("guest_price_adult", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="₹100"
                />
              </div>

              {/* Child */}
              <div className="flex justify-center my-2">
                {/* Child Checkbox */}
                <input
                  type="checkbox"
                  className="mx-2"
                  checked={formData.is_guest_child}
                  disabled={!formData.guest}
                  onChange={() => handleChildToggle("is_guest_child")}
                />
                {/* Child Price Input */}
                <input
                  type="text"
                  disabled={!formData.guest || !formData.is_guest_child}
                  value={formData.guest_price_child || ""}
                  onChange={(e) =>
                    handlePriceChange("guest_price_child", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="₹100"
                />
              </div>
              {/* <div className="flex justify-center my-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="" className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="postpaid"
                        id="postpaid"
                        checked={formData.guest_postpaid}
                        onChange={handlePaymentCheckbox}
                      />{" "}
                      Postpaid
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="prepaid"
                        id="prepaid"
                        checked={formData.guest_prepaid}
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
                        checked={formData.guest_pay_on_facility}
                        onChange={handlePaymentCheckbox}
                      />{" "}
                      Pay on facility
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="complimentary"
                        id="complimentary"
                        checked={formData.guest_complimentary}
                        onChange={handlePaymentCheckbox}
                      />{" "}
                      Complimentary
                    </label>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Tenant Section */}
            <div className="grid grid-cols-4 items-center border-b">
              <div className="flex justify-center my-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.tenant === true}
                    onChange={() => handleCheckboxChange("tenant")}
                  />
                  Tenant
                </label>
              </div>

              {/* Adult */}
              <div className="flex justify-center my-2">
                {/* Adult Checkbox */}
                <input
                  type="checkbox"
                  className="mx-2"
                  checked={formData.is_tenant_adult}
                  disabled={!formData.tenant}
                  onChange={() => handleChildToggle("is_tenant_adult")}
                />
                {/* Adult Price Input */}
                <input
                  type="text"
                  disabled={!formData.tenant || !formData.is_tenant_adult}
                  value={formData.tenant_price_adult || ""}
                  onChange={(e) =>
                    handlePriceChange("tenant_price_adult", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="₹100"
                />
              </div>

              {/* Child */}
              <div className="flex justify-center my-2">
                {/* Child Checkbox */}
                <input
                  type="checkbox"
                  className="mx-2"
                  checked={formData.is_tenant_child}
                  disabled={!formData.tenant}
                  onChange={() => handleChildToggle("is_tenant_child")}
                />
                {/* Child Price Input */}
                <input
                  type="text"
                  disabled={!formData.tenant || !formData.is_tenant_child}
                  value={formData.tenant_price_child || ""}
                  onChange={(e) =>
                    handlePriceChange("tenant_price_child", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="₹100"
                />
              </div>
              {/* <div className="flex justify-center my-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="" className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="postpaid"
                        id="postpaid"
                        checked={formData.tenant_postpaid}
                        onChange={handlePaymentCheckbox}
                      />{" "}
                      Postpaid
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="prepaid"
                        id="prepaid"
                        checked={formData.tenant_prepaid}
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
                        checked={formData.tenant_pay_on_facility}
                        onChange={handlePaymentCheckbox}
                      />{" "}
                      Pay on facility
                    </label>
                    <label htmlFor="" className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="complimentary"
                        id="complimentary"
                        checked={formData.tenant_complimentary}
                        onChange={handlePaymentCheckbox}
                      />{" "}
                      Complimentary
                    </label>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Checkbox */}
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
                  value={formData.gst || ""}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      gst: e.target.value, // ✅ Correctly updates gst in formData
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
        <div className="border rounded-md mt-6">
          <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
            Booking Rule
          </div>

          {rules.map((rule, index) => (
            <div
              key={rule.id}
              className="flex flex-wrap items-center gap-4 px-4 py-3 border-b last:border-b-0"
            >
              {/* Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rule.enabled || false}
                  onChange={(e) =>
                    handleChange2(rule.id, "enabled", e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">Facility can be Booked</span>
              </div>

              {/* Times Input */}
              <input
                type="number"
                placeholder="Enter"
                value={rule.times || ""}
                onChange={(e) =>
                  handleChange2(rule.id, "times", e.target.value)
                }
                className="border border-gray-300 rounded px-2 py-1 w-24 text-sm"
              />
              {/* Select Time per day */}
              <span className="text-sm">times per day by </span>
              <select
                value={rule.level || ""}
                onChange={(e) => handleChange2(rule.id, "level", e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm w-[150px]"
              >
                <option value="">Select</option>
                <option value="user">User</option>
                <option value="flat">Flat</option>
                <option value="owner">Owner</option>
                <option value="tenant">Tenant</option>
              </select>

              {/* Select Period */}
              <select
                value={rule.period_type || ""}
                onChange={(e) => handleChange2(rule.id, "period_type", e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="">Select Slots For</option>
                <option value="Day">Day</option>
                <option value="Week">Week</option>
                <option value="Month">Month</option>
                <option value="Year">Year</option>
              </select>

              {/* Prime Time Label */}
              <span className="text-sm font-medium text-gray-700">
                Prime Time
              </span>

              {/* Prime Time Editable Input */}
              {(rule.primeTime && rule.primeTime.length > 0 ? rule.primeTime : [{ start_time: "", end_time: "" }]).map((pt, pIdx) => (
                <div key={pIdx} className="flex items-center gap-2 mb-2">
                  {/* Start Time */}
                  <input
                    type="time"
                    value={pt.start_time}
                    onChange={(e) =>
                      handlePrimeTimeChange(rule.id, pIdx, "start_time", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  {/* End Time */}
                  <input
                    type="time"
                    value={pt.end_time}
                    onChange={(e) =>
                      handlePrimeTimeChange(rule.id, pIdx, "end_time", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  {/* Delete Button */}
                  {rule.primeTime.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePrimeTime(rule.id, pIdx)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddPrimeTime(rule.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm mx-4 mt-3 mb-3"
              >
                + Add Prime Time
              </button>

              {/* Sub Facility */}
              <div className="flex items-center gap-2">
                {/* <input
                          type="checkbox"
                          checked={subFacilityAvailable}
                          onChange={(e) => setSubFacilityAvailable(e.target.checked)}
                        /> */}
                {/* <span className="text-sm">Sub Facility</span> */}
              </div>

              {/* Delete Button (shown for all rows) */}
              {rules.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRule(rule.id)}
                  className="text-red-500 hover:text-red-700 ml-auto"
                  title="Remove rule"
                >
                  <FaTrash size={14} />
                </button>
              )}
            </div>
          ))}

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAddRule}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm mx-4 mt-3 mb-3"
          >
            +  Add Rule
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cover Images */}
          <div className="my-4">
            <h2 className="border-b border-black text-lg mb-2 font-medium">
              Cover Images
            </h2>
            <FileInputBox
              handleChange={(files) => handleFileChange(files, "cover_images")}
              fieldName="cover_images"
              isMulti={true}
            />
          </div>

          {/* Attachments */}
          <div className="my-4">
            <h2 className="border-b border-black text-lg mb-2 font-medium">
              Attachments
            </h2>
            <FileInputBox
              handleChange={(files) => handleFileChange(files, "attachments")}
              fieldName="attachments"
              isMulti={true}
            />
          </div>
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
        <div className="bg-white rounded-xl shadow-md border p-6 mt-2 mb-3 border-gray-300">
          <h2 className="text-lg font-semibold mb-6">Configure Slot</h2>
          <div className="overflow-x-auto ">
            {formData.slots.map((slot, slotIndex) => (
              <div
                key={slotIndex}
                className="flex gap-4 items-end mb-4 min-w-[1200px]"
              >
                {/* Start Time */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Start time
                  </label>
                  <input
                    type="time"
                    value={formatTime(slot.start_hr, slot.start_min)}
                    onChange={(e) =>
                      handleSlotTimeChange(slotIndex, "start", e.target.value)
                    }
                    className="border rounded-md px-3 py-2"
                  />
                </div>

                {/* Break Start */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Break Start
                  </label>
                  <input
                    type="time"
                    value={formatTime(slot.break_start_hr, slot.break_start_min)}
                    onChange={(e) =>
                      handleSlotTimeChange(slotIndex, "break_start", e.target.value)
                    }
                    className="border rounded-md px-3 py-2"
                  />
                </div>

                {/* Break End */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Break End
                  </label>
                  <input
                    type="time"
                    value={formatTime(slot.break_end_hr, slot.break_end_min)}
                    onChange={(e) =>
                      handleSlotTimeChange(slotIndex, "break_end", e.target.value)
                    }
                    className="border rounded-md px-3 py-2"
                  />
                </div>

                {/* End Time */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formatTime(slot.end_hr, slot.end_min)}
                    onChange={(e) =>
                      handleSlotTimeChange(slotIndex, "end", e.target.value)
                    }
                    className="border rounded-md px-3 py-2"
                  />
                </div>

                {/* Concurrent Slots */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Concurrent
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={slot.concurrent_slots || ""}
                    onChange={(e) =>
                      handleSlotFieldChange(
                        slotIndex,
                        "concurrent_slots",
                        e.target.value
                      )
                    }
                    className="border rounded-md px-3 py-2 w-24"
                  />
                </div>

                {/* Slot By */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Slot By
                  </label>
                  <select
                    value={slotBy}
                    onChange={(e) => setSlotBy(e.target.value)}
                    className="border rounded-md px-3 py-2"
                  >
                    <option value="">Select</option>
                    <option value="15">15 Min</option>
                    <option value="30">30 Min</option>
                    <option value="45">45 Min</option>
                    <option value="60">1 Hour</option>
                    <option value="90">1.5 Hour</option>
                    <option value="120">2 Hour</option>
                    <option value="180">3 Hour</option>
                    <option value="360">6 Hour</option>
                    <option value="720">12 Hour</option>
                    <option value="1440">24 Hour</option>
                  </select>
                </div>

                {/* Wrap Time */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Wrap Time
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={slot.wrap_up_time || ""}
                    onChange={(e) =>
                      handleSlotFieldChange(
                        slotIndex,
                        "wrap_up_time",
                        e.target.value
                      )
                    }
                    className="border rounded-md px-3 py-2 w-24"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            {/* <button
              type="button"
              onClick={handleAddSlot}
              className=" text-white px-4 py-2 rounded-md"
              style={{ background: themeColor }}
            >
              + Add Slot
            </button> */}
          </div>
        </div>
        <div></div>
        <h1 className="text-[18px]"><b>Operational Days : </b></h1>
        <div className="border rounded mt-3">

          {/* Header */}
          <div className="grid grid-cols-4 bg-gradient-to-r from-purple-600 to-orange-400 text-white p-2 font-semibold">
            <div></div>
            <div>Day</div>
            <div>Start</div>
            <div>End</div>
          </div>

          {/* Rows */}
          {days.map((day, index) => (
            <div
              key={day.day_of_week}
              className="grid grid-cols-4 items-center border-b p-2"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={day.is_active}
                onChange={() => handleCheck(index)}
              />

              {/* Day */}
              <div>{day.label}</div>

              {/* Start Time */}
              <input
                type="time"
                value={day.start_time}
                disabled={!day.is_active}
                onChange={(e) =>
                  handleTimeChange1(index, "start_time", e.target.value)
                }
              />

              {/* End Time */}
              <input
                type="time"
                value={day.end_time}
                disabled={!day.is_active}
                onChange={(e) =>
                  handleTimeChange1(index, "end_time", e.target.value)
                }
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col my-4 mt-4">
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
                setFormData({
                  ...formData,
                  cancellation_policy: e.target.value,
                })
              }
              value={formData.cancellation_policy}
              rows="3"
              className="border border-gray-400 rounded-md"
            />
          </div>
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
        <div className="flex justify-end my-2 gap-3">
          <button
            className="bg-gray-800 text-white p-2 px-4 font-semibold rounded-md flex items-center gap-2"
            onClick={() => navigate("/setup/facility")}
          >
            Cancel
          </button>
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
