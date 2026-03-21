import React, { useEffect, useState } from "react";
import {
  domainPrefix,
  getFacitilitySetupId,
  updateFacitilitySetup,
  saveAmenitySlotConfig,
  generateAmenitySlots,
} from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { Switch } from "../../Buttons";
import { FaCheck, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";


const EditAmenitySetup = () => {
  const { id } = useParams();
  const [allowMultipleSlots, setAllowMultipleSlots] = useState("no");
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(true);
  const [slotBy, setSlotBy] = useState(""); // Loading state
  const [dates, setDates] = useState({
    amenity: {
      book_before: "",
      cancel_before: "",
      advance_booking: "",
    },
  });

  const daysList = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
  ];

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


  const handleChange2 = (id, field, value) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)),
    );
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

  const handleSelectChange = (e) => {
    setAllowMultipleSlots(e.target.value);
  };
  const themeColor = useSelector((state) => state.theme.color);
  const sitID = getItemInLocalStorage("SITEID");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amenity: {
      site_id: sitID,
      fac_type: "",
      fac_name: "",
      member_charges: "",
      book_before: "",
      disclaimer: "",
      cancellation_policy: "",
      cutoff_min: "",
      return_percentage: "",
      create_by: "",
      active: true,
      member_price_adult: "",
      member_price_child: "",
      guest_price_adult: "",
      guest_price_child: "",
      tenant_price_child: "",
      tenant_price_adult: "",
      member: null,
      guest: null,
      tenant: null,
      non_member: false,
      non_member_price_adult: "",
      non_member_price_child: "",
      is_non_member_adult: false,
      is_non_member_child: false,
      min_people: "",
      max_people: "",
      cancel_before: "",
      book_before_days: "",
      book_before_hours: "",
      book_before_mins: "",
      advance_days: "",
      advance_hours: "",
      advance_mins: "",
      cancel_before_days: "",
      cancel_before_hours: "",
      cancel_before_mins: "",
      prepaid: null,
      postpaid: null,
      pay_on_facility: null,
      complimentary: null,
      fixed_amount: null,
      is_fixed: false,
      terms: "",
      gst_no: "",
      gst: "",
      sgst: "",
      advance_booking: false,
      deposit: "",
      description: "",
      max_slots: "",
      is_member_adult: true,
      is_member_child: false,
      is_guest_adult: true,
      is_guest_child: false,
      is_tenant_adult: true,
      is_tenant_child: false,
    },
    covers: [],
    attachments: [],
    slots: [
      {
        start_hr: "",
        end_hr: "",
        start_min: "",
        end_min: "",
      },
    ],
  });

  console.log("DATA:", formData);

  // Fetch the facility details for the specific ID
  const fetchFacilityBooking = async () => {
    try {
      const response = await getFacitilitySetupId(id); // API call
      if (!response.data) {
        throw new Error("Invalid response from API");
      }

      const facility = response.data;

      console.log("facility", facility);

      if (facility) {
        setDates({
          amenity: {
            book_before: facility.book_before || "",
            cancel_before: facility.cancel_before || "",
            advance_booking: facility.advance_booking || "",
          },
        });
        const normalizeDurationField = (duration) => {
          if (!duration) return { raw: [], days: "", hours: "", mins: "" };
          if (Array.isArray(duration)) {
            const raw = duration;
            const parsed = duration[1] && typeof duration[1] === "object" ? duration[1] : {};
            return {
              raw,
              days: parsed.days ?? "",
              hours: parsed.hours ?? "",
              mins: parsed.minutes ?? "",
            };
          }
          if (typeof duration === "object") {
            return {
              raw: ["", duration, ""],
              days: duration.days ?? "",
              hours: duration.hours ?? "",
              mins: duration.minutes ?? "",
            };
          }
          return { raw: [duration], days: "", hours: "", mins: "" };
        };

        const bookBeforeInfo = normalizeDurationField(facility.book_before);
        const cancelBeforeInfo = normalizeDurationField(facility.cancel_before);
        const advanceBookingInfo = normalizeDurationField(facility.advance_booking);

        setSlotData({
          startHour: facility.amenity_slots?.[0]?.start_hr
            ? String(facility.amenity_slots[0].start_hr).padStart(2, "0")
            : "09",
          startMinute: facility.amenity_slots?.[0]?.start_min
            ? String(facility.amenity_slots[0].start_min).padStart(2, "0")
            : "00",
          breakStartHour: "00",
          breakStartMinute: "00",
          breakEndHour: "00",
          breakEndMinute: "00",
          endHour: facility.amenity_slots?.[0]?.end_hr
            ? String(facility.amenity_slots[0].end_hr).padStart(2, "0")
            : "16",
          endMinute: facility.amenity_slots?.[0]?.end_min
            ? String(facility.amenity_slots[0].end_min).padStart(2, "0")
            : "00",
          concurrentSlots: facility.amenity_slots?.[0]?.concurrent_slots || "",
        });

        setSlotBy(facility.slot_by || "");

        setDays(
          daysList.map((day) => {
            // Find the first matching operational_day for this day_of_week
            const op = facility.operational_days?.find(
              (x) => Number(x.day_of_week) === Number(day.value),
            );
            return {
              ...day,
              // Keep the backend id so PUT sends id and updates, not creates
              db_id: op?.id ?? null,
              is_active: op?.is_active ?? false,
              start_time: op?.start_time || "",
              end_time: op?.end_time || "",
            };
          }),
        );

        setRules(
          facility.amenity_rules?.length
            ? facility.amenity_rules.map((rule) => ({
              id: rule.id || Date.now(),
              enumerator: rule.enumerator ?? "daily_limit",
              duration: rule.duration?.toString() || "60",
              level: rule.level || "user",
              times: rule.times_per_day?.toString() || "",
              period_type: rule.period_type || "day",
              enabled:
                rule.active ??
                rule.facility_can_be_booked ??
                rule.enabled ??
                true,
              // Always keep primeTime as array of { id, start_time, end_time }
              primeTime:
                Array.isArray(rule.prime_time) && rule.prime_time.length > 0
                  ? rule.prime_time.map((p) => ({
                    // Keep backend id so PUT updates existing prime_time records
                    id: p.id ?? null,
                    start_time: p.start_time || "",
                    end_time: p.end_time || "",
                  }))
                  : [{ id: null, start_time: "", end_time: "" }],
            }))
            : rules,
        );

        setFormData({
          amenity: {
            site_id: facility.site_id || "",
            fac_type: facility.fac_type || "",
            fac_name: facility.fac_name || "",
            member_charges: facility.member_charges || "",
            book_before: facility.book_before || [],
            book_before_days: bookBeforeInfo.days,
            book_before_hours: bookBeforeInfo.hours,
            book_before_mins: bookBeforeInfo.mins,
            cancel_before: facility.cancel_before || [],
            cancel_before_days: cancelBeforeInfo.days,
            cancel_before_hours: cancelBeforeInfo.hours,
            cancel_before_mins: cancelBeforeInfo.mins,
            advance_booking: facility.advance_booking || [],
            advance_days: advanceBookingInfo.days,
            advance_hours: advanceBookingInfo.hours,
            advance_mins: advanceBookingInfo.mins,
            disclaimer: facility.disclaimer || "",
            cancellation_policy: facility.cancellation_policy || "",
            cutoff_min: facility.cutoff_min || "",
            return_percentage: facility.return_percentage || "",
            create_by: facility.create_by || "",
            active: facility.active ?? true,
            member_price_adult: facility.member_price_adult || "",
            member_price_child: facility.member_price_child || "",
            guest_price_adult: facility.guest_price_adult || "",
            guest_price_child: facility.guest_price_child || "",
            tenant_price_child: facility.tenant_price_child || "",
            tenant_price_adult: facility.tenant_price_adult || "",
            min_people: facility.min_people || "",
            max_people: facility.max_people || "",
            terms: facility.terms || "",
            gst_no: facility.gst_no || "",
            gst: facility.gst || "",
            sgst: facility.sgst || "",
            deposit: facility.deposit || "",
            description: facility.description || "",
            max_slots: facility.max_slots || "",
            member: facility.member ?? null,
            is_member_adult: facility.is_member_adult ?? true,
            is_member_child: facility.is_member_child ?? false,
            guest: facility.guest ?? null,
            is_guest_adult: facility.is_guest_adult ?? true,
            is_guest_child: facility.is_guest_child ?? false,
            tenant: facility.tenant ?? null,
            is_tenant_adult: facility.is_tenant_adult ?? true,
            is_tenant_child: facility.is_tenant_child ?? false,
            non_member: facility.non_member ?? false,
            non_member_price_adult: facility.non_member_price_adult || "",
            non_member_price_child: facility.non_member_price_child || "",
            is_non_member_adult: facility.is_non_member_adult ?? false,
            is_non_member_child: facility.is_non_member_child ?? false,
            fixed_amount: facility.fixed_amount || "",
            is_fixed: facility.is_fixed ?? false,
            prepaid: facility.prepaid ?? null,
            postpaid: facility.postpaid ?? null,
            status: facility.status || "",
            payment_methods: facility.payment_methods || [],
            complimentary: facility.complimentary ?? null,
            pay_on_facility: facility.pay_on_facility ?? null,
            shreable: facility.shareable ?? facility.shreable ?? null,
            link_to_building: facility.link_to_building ?? false,
            slot_by: facility.slot_by || "",
            consecutive_slot_allowed: facility.consecutive_slot_allowed ?? false,
          },
          covers: facility.covers || [],
          attachments: facility.attachments || [],
          slots: facility.amenity_slots?.length
            ? facility.amenity_slots.map((slot) => ({
              id: slot.id || null,
              amenity_id: slot.amenity_id || null,
              start_hr: String(slot.start_hr ?? "").padStart(2, "0"),
              start_min: String(slot.start_min ?? "").padStart(2, "0"),
              end_hr: String(slot.end_hr ?? "").padStart(2, "0"),
              end_min: String(slot.end_min ?? "").padStart(2, "0"),
              break_start_hr: String(slot.break_start_hr ?? "0").padStart(2, "0"),
              break_start_min: String(slot.break_start_min ?? "0").padStart(2, "0"),
              break_end_hr: String(slot.break_end_hr ?? "0").padStart(2, "0"),
              break_end_min: String(slot.break_end_min ?? "0").padStart(2, "0"),
              concurrent_slots: slot.concurrent_slots || "",
              slot_duration: slot.slot_duration || "",
              wrap_up_time: slot.wrap_up_time || "",
            }))
            : [
              {
                start_hr: "", start_min: "", end_hr: "", end_min: "",
                break_start_hr: "00", break_start_min: "00",
                break_end_hr: "00", break_end_min: "00",
                concurrent_slots: "", slot_duration: "", wrap_up_time: "",
              },
            ],
        });
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching facility details:", error);
      setError(
        error.message || "Failed to fetch facility details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  const [slotData, setSlotData] = useState({
    startHour: "09",
    startMinute: "00",
    breakStartHour: "13",
    breakStartMinute: "00",
    breakEndHour: "14",
    breakEndMinute: "00",
    endHour: "16",
    endMinute: "00",
    concurrentSlots: "3",
  });

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  const minutes = ["00", "15", "30", "45"];

  const handleChange = (field, value) => {
    setSlotData({ ...slotData, [field]: value });
  };

  const [rules, setRules] = useState([
    {
      id: 1,
      enumerator: "daily_limit",
      duration: "",
      level: "",
      times: "",
      period_type: "",
      enabled: false,
      primeTime: [{ start_time: "", end_time: "" }],
    },
  ]);

  // Add new rule
  const handleAddRule = () => {
    const newRule = {
      id: Date.now(),
      enumerator: "daily_limit",
      duration: "60",
      level: "user",
      times: "1",
      period_type: "day",
      enabled: true,
      primeTime: [{ start_time: "", end_time: "" }],
    };
    setRules([...rules, newRule]);
  };

  const handlePrimeTimeChange = (ruleId, index, field, value) => {
    setRules((prev) =>
      prev.map((rule) => {
        if (rule.id !== ruleId) return rule;
        const updatedPrimeTimes = Array.isArray(rule.primeTime)
          ? [...rule.primeTime]
          : [{ start_time: "", end_time: "" }];
        updatedPrimeTimes[index] = { ...updatedPrimeTimes[index], [field]: value };
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
              ...(Array.isArray(rule.primeTime) ? rule.primeTime : []),
              { start_time: "", end_time: "" },
            ],
          }
          : rule
      )
    );
  };

  const handleRemovePrimeTime = (ruleId, index) => {
    setRules((prev) =>
      prev.map((rule) => {
        if (rule.id !== ruleId) return rule;
        const updatedPrimeTimes = Array.isArray(rule.primeTime)
          ? rule.primeTime.filter((_, i) => i !== index)
          : [];
        return { ...rule, primeTime: updatedPrimeTimes };
      })
    );
  };

  // Remove rule
  const handleRemoveRule = (id) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  // Handle input change
  const handleChange1 = (id, field, value) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)),
    );
  };
  useEffect(() => {
    fetchFacilityBooking();
  }, [id]); // Trigger when ID changes

  const updateAmenitiesSetup = async () => {
    const postData = new FormData();
    const a = formData.amenity;

    // helper: convert days/hours/mins fields to total minutes integer
    const calcTotalMinutes = (prefix) => {
      const d = parseInt(a[`${prefix}_days`]) || 0;
      const h = parseInt(a[`${prefix}_hours`]) || 0;
      const m = parseInt(a[`${prefix}_mins`]) || 0;
      return d * 24 * 60 + h * 60 + m;
    };

    // ── Basic info ────────────────────────────────────────────────────────────
    postData.append("amenity[site_id]", a.site_id || sitID);
    postData.append("amenity[fac_name]", a.fac_name || "");
    postData.append("amenity[fac_type]", a.fac_type || "bookable");
    postData.append("amenity[type_of_facility]", a.type_of_facility || "");
    postData.append("amenity[description]", a.description || "");
    postData.append("amenity[disclaimer]", a.disclaimer || "");
    postData.append("amenity[cancellation_policy]", a.cancellation_policy || "");
    postData.append("amenity[terms]", a.terms || "");
    postData.append("amenity[deposit]", a.deposit || "");
    postData.append("amenity[gst_no]", a.gst_no || "");
    postData.append("amenity[gst]", a.gst || "");
    postData.append("amenity[sgst]", a.sgst || "");
    postData.append("amenity[active]", a.active ? "true" : "false");
    postData.append("amenity[status]", a.status || "active");
    postData.append("amenity[shareable]", a.shreable ? "true" : "false");
    postData.append("amenity[link_to_building]", a.link_to_building ? "true" : "false");

    // ── People limits ─────────────────────────────────────────────────────────
    postData.append("amenity[min_people]", a.min_people || "");
    postData.append("amenity[max_people]", a.max_people || "");

    // ── Booking / schedule config ─────────────────────────────────────────────
    // Send as total minutes (integer), not the raw array from the API response
    postData.append("amenity[book_before]", calcTotalMinutes("book_before"));
    postData.append("amenity[cancel_before]", calcTotalMinutes("cancel_before"));
    postData.append("amenity[advance_booking]", calcTotalMinutes("advance"));
    postData.append("amenity[max_slots]", a.max_slots || "");
    postData.append("amenity[consecutive_slot_allowed]", a.consecutive_slot_allowed ? "true" : "false");
    postData.append("amenity[slot_by]", a.slot_by || slotBy || "");

    // ── Global payment methods ────────────────────────────────────────────────
    postData.append("amenity[prepaid]", a.prepaid ? "true" : "false");
    postData.append("amenity[postpaid]", a.postpaid ? "true" : "false");
    postData.append("amenity[pay_on_facility]", a.pay_on_facility ? "true" : "false");
    postData.append("amenity[complimentary]", a.complimentary ? "true" : "false");
    postData.append("amenity[payment_methods]", a.payment_methods || "");

    // ── Fixed / Flat ──────────────────────────────────────────────────────────
    postData.append("amenity[is_fixed]", a.is_fixed ? "true" : "false");
    postData.append("amenity[fixed_amount]", a.fixed_amount || "");

    // ── Member ────────────────────────────────────────────────────────────────
    postData.append("amenity[member]", a.member ? "true" : "false");
    postData.append("amenity[member_price_adult]", a.member_price_adult || "");
    postData.append("amenity[member_price_child]", a.member_price_child || "");
    postData.append("amenity[is_member_adult]", a.is_member_adult ? "true" : "false");
    postData.append("amenity[is_member_child]", a.is_member_child ? "true" : "false");

    // ── Guest ─────────────────────────────────────────────────────────────────
    postData.append("amenity[guest]", a.guest ? "true" : "false");
    postData.append("amenity[guest_price_adult]", a.guest_price_adult || "");
    postData.append("amenity[guest_price_child]", a.guest_price_child || "");
    postData.append("amenity[is_guest_adult]", a.is_guest_adult ? "true" : "false");
    postData.append("amenity[is_guest_child]", a.is_guest_child ? "true" : "false");

    // ── Tenant ────────────────────────────────────────────────────────────────
    postData.append("amenity[tenant]", a.tenant ? "true" : "false");
    postData.append("amenity[tenant_price_adult]", a.tenant_price_adult || "");
    postData.append("amenity[tenant_price_child]", a.tenant_price_child || "");
    postData.append("amenity[is_tenant_adult]", a.is_tenant_adult ? "true" : "false");
    postData.append("amenity[is_tenant_child]", a.is_tenant_child ? "true" : "false");

    // ── Non-Member ────────────────────────────────────────────────────────────
    postData.append("amenity[non_member]", a.non_member ? "true" : "false");
    postData.append("amenity[non_member_price_adult]", a.non_member_price_adult || "");
    postData.append("amenity[non_member_price_child]", a.non_member_price_child || "");
    postData.append("amenity[is_non_member_adult]", a.is_non_member_adult ? "true" : "false");
    postData.append("amenity[is_non_member_child]", a.is_non_member_child ? "true" : "false");

    // ── Slots ─────────────────────────────────────────────────────────────────
    formData.slots.forEach((slot, index) => {
      const slotBase = `amenity[amenity_slots_attributes][${index}]`;
      if (slot.id) postData.append(`${slotBase}[id]`, slot.id);
      postData.append(`${slotBase}[start_hr]`, slot.start_hr || "");
      postData.append(`${slotBase}[start_min]`, slot.start_min || "");
      postData.append(`${slotBase}[end_hr]`, slot.end_hr || "");
      postData.append(`${slotBase}[end_min]`, slot.end_min || "");
      postData.append(`${slotBase}[break_start_hr]`, slot.break_start_hr || "");
      postData.append(`${slotBase}[break_start_min]`, slot.break_start_min || "");
      postData.append(`${slotBase}[break_end_hr]`, slot.break_end_hr || "");
      postData.append(`${slotBase}[break_end_min]`, slot.break_end_min || "");
      postData.append(`${slotBase}[concurrent_slots]`, slot.concurrent_slots || "1");
      postData.append(`${slotBase}[slot_duration]`, slot.slot_duration || "");
      postData.append(`${slotBase}[wrap_up_time]`, slot.wrap_up_time || "0");
    });

    // ── Operational days ──────────────────────────────────────────────────────
    days.forEach((day, index) => {
      const base = `amenity[amenity_operational_days_attributes][${index}]`;
      // Pass id so Rails updates existing record, not creates a new one
      if (day.db_id) postData.append(`${base}[id]`, day.db_id);
      postData.append(`${base}[day_of_week]`, day.value);
      postData.append(`${base}[is_active]`, day.is_active ? "true" : "false");
      // Always send start/end time (empty string when inactive)
      postData.append(`${base}[start_time]`, day.is_active ? (day.start_time || "") : "");
      postData.append(`${base}[end_time]`, day.is_active ? (day.end_time || "") : "");
    });

    // ── Booking rules ─────────────────────────────────────────────────────────
    // primeTime is always an array of { start_time, end_time }
    rules.forEach((rule, index) => {
      const ruleAttr = `amenity[amenity_booking_rules_attributes][${index}]`;
      if (rule.id && typeof rule.id === "number" && rule.id < 1e12) {
        postData.append(`${ruleAttr}[id]`, rule.id);
      }
      postData.append(`${ruleAttr}[enumerator]`, rule.enumerator || "daily_limit");
      postData.append(`${ruleAttr}[duration]`, rule.duration || "60");
      postData.append(`${ruleAttr}[level]`, rule.level || "user");
      postData.append(`${ruleAttr}[active]`, rule.enabled ? "true" : "false");
      postData.append(`${ruleAttr}[site_id]`, sitID);
      postData.append(`${ruleAttr}[facility_can_be_booked]`, rule.enabled ? "true" : "false");
      postData.append(`${ruleAttr}[times_per_day]`, rule.times || "");
      postData.append(`${ruleAttr}[period_type]`, rule.period_type || "day");

      const primeTimes = Array.isArray(rule.primeTime)
        ? rule.primeTime.filter((pt) => pt.start_time && pt.end_time)
        : [];
      primeTimes.forEach((pt, pIdx) => {
        const primeBase = `${ruleAttr}[prime_times_attributes][${pIdx}]`;
        // Pass id so Rails updates existing prime_time, not creates a new one
        if (pt.id) postData.append(`${primeBase}[id]`, pt.id);
        postData.append(`${primeBase}[start_time]`, pt.start_time || "");
        postData.append(`${primeBase}[end_time]`, pt.end_time || "");
      });
    });

    // ── Cover images ──────────────────────────────────────────────────────────
    // Only append File objects (newly chosen files); skip objects with image_url (from server)
    formData.covers.forEach((cover) => {
      if (cover instanceof File) {
        postData.append("cover_images[]", cover);
      }
    });

    // ── Attachments ──────────────────────────────────────────────────────────
    // Only append File objects (newly chosen files); skip objects with image_url (from server)
    formData.attachments.forEach((attachment) => {
      if (attachment instanceof File) {
        postData.append("attachments[]", attachment);
      }
    });
    // ── Payment methods ────────────────────────────────────────────────────────
    if (formData.amenity.payment_methods?.length > 0) {
      formData.amenity.payment_methods.forEach((method) => {
        postData.append("amenity[payment_methods][]", method);
      });
    }

    try {
      if (!id) {
        throw new Error("Amenity ID is missing.");
      }

      toast.loading("Saving facility...");
      const response = await updateFacitilitySetup(postData, id);
      toast.dismiss();
      console.log(response);

      // ── Save slot config then generate slots ─────────────────────────────
      if (formData.slots?.length > 0) {
        const slot = formData.slots[0];
        const pad = (v) => String(v || "0").padStart(2, "0");
        const toTimeStr = (hr, min) => `${pad(hr)}:${pad(min)}:00`;

        const slotByLabels = {
          "15": "15 min", "30": "30 min", "45": "45 min",
          "60": "1 hr",  "90": "1.5 hr", "120": "2 hr",
          "180": "3 hr", "360": "6 hr",   "720": "12 hr", "1440": "24 hr",
        };

        const slotConfigPayload = {
          amenity_slot_config: {
            start_time:       toTimeStr(slot.start_hr,       slot.start_min),
            end_time:         toTimeStr(slot.end_hr,         slot.end_min),
            break_time_start: toTimeStr(slot.break_start_hr, slot.break_start_min),
            break_time_end:   toTimeStr(slot.break_end_hr,   slot.break_end_min),
            concurrent_slot:  Number(slot.concurrent_slots) || 1,
            slot_by:          slotByLabels[String(slotBy)] || slotBy || "",
            wrap_time:        Number(slot.wrap_up_time) || 0,
          },
        };

        try {
          toast.loading("Saving slot configuration...");
          await saveAmenitySlotConfig(id, slotConfigPayload);
          toast.dismiss();

          toast.loading("Generating time slots...");
          await generateAmenitySlots(id);
          toast.dismiss();
          toast.success("Updated and slots regenerated successfully!");
        } catch (slotErr) {
          toast.dismiss();
          console.error("Slot config/generate error:", slotErr);
          toast.error("Amenity saved but slot generation failed.");
        }
      } else {
        toast.success("Updated successfully!");
      }

      navigate("/setup/facility");
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error("Failed to update amenity setup. Please try again.");
    }
  };

  const handleCheckboxChange = (type) => {
    setFormData((prevState) => ({
      ...prevState,
      amenity: {
        ...prevState.amenity,
        [type]: prevState.amenity[type] === null ? true : null, // Toggle between true and null
      },
    }));
  };

  const handleChildToggle = (field) => {
    setFormData((prev) => ({
      ...prev,
      amenity: {
        ...prev.amenity,
        [field]: !prev.amenity[field],
      },
    }));
  };

  const handlePriceChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      amenity: {
        ...prevState.amenity,
        [field]: value,
      },
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setFormData((prev) => ({
      ...prev,
      [fieldName]: files, // Save File instances
    }));
  };

  const handleAmenityChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      amenity: {
        ...prev.amenity,
        [field]: value,
      },
    }));
  };

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

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedFormData = {
        ...prevData,
        amenity: {
          ...prevData.amenity,
          [name]: value, // Update the specific field
        },
      };

      // Dynamically calculate total minutes for time fields only when they change
      const calculateTotalMinutes = (prefix) => {
        const days = parseInt(updatedFormData.amenity[`${prefix}_days`]) || 0;
        const hours = parseInt(updatedFormData.amenity[`${prefix}_hours`]) || 0;
        const minutes =
          parseInt(updatedFormData.amenity[`${prefix}_mins`]) || 0;
        return days * 24 * 60 + hours * 60 + minutes;
      };

      if (name.includes("book_before")) {
        updatedFormData.amenity.book_before =
          calculateTotalMinutes("book_before");
      } else if (name.includes("advance")) {
        updatedFormData.amenity.advance_booking =
          calculateTotalMinutes("advance");
      } else if (name.includes("cancel_before")) {
        updatedFormData.amenity.cancel_before =
          calculateTotalMinutes("cancel_before");
      }

      return updatedFormData;
    });
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

  // const [rules, setRules] = useState([{ timesPerDay: "", selectedOption: "" }]);

  const options = ["Members", "Guests", "Tenant", "Staff", "Others"];

  const handleOptionChange = (index, field, value) => {
    const updatedRules = [...rules];
    updatedRules[index][field] = value;
    setRules(updatedRules);
  };

  // const handleRemoveRule = (index) => {
  //   setRules(rules.filter((_, i) => i !== index));
  // };

  // const handleAddRule = () => {
  //   if (rules.length < 4) {
  //     setRules([...rules, { timesPerDay: "", selectedOption: "" }]);
  //   }
  // };

  const [blockData, setBlockData] = useState({
    blockBy: "",
  });

  const handelRadioChange = (e) => {
    setFormData({
      ...formData,
      amenity: {
        ...formData.amenity,
        fac_type: e.target.value,
      },
    });
  };

  const removeImage = (index) => {
    const updatedCovers = formData.covers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      covers: updatedCovers,
    });
  };

  const removeAttachment = (index) => {
    const updatedAttachments = formData.attachments.filter(
      (_, i) => i !== index,
    );
    setFormData({
      ...formData,
      attachments: updatedAttachments,
    });
  };

  const handleSlotTimeChange = (index, timeType, timeValue) => {
    const parts = (timeValue || "").split(":");
    const hours = (parts[0] || "00").padStart(2, "0");
    const minutes = (parts[1] || "00").padStart(2, "0");
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

  console.log("slots", formData.slots);

  const handleDescriptionChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      amenity: {
        ...formData.amenity,
        description: value, // Update description in the state
      },
    });
  };

  //handle tearms
  const handleTermsChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      amenity: {
        ...formData.amenity,
        terms: value, // Update terms in the state
      },
    });
  };

  // Handle cancellation policy change
  const handleCancellationPolicyChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      amenity: {
        ...formData.amenity,
        cancellation_policy: value, // Update cancellation policy in the state
      },
    });
  };

  //Validate 2 Inputs
  const validateInput = (e) => {
    const { name, value } = e.target;
    const intValue = parseInt(value);

    if (isNaN(intValue) || intValue < 0) {
      toast.error(`${name.replace("_", " ")} must be a positive number.`);
      return;
    }

    if (name.includes("days") && intValue > 365) {
      toast.error(`${name.replace("_", " ")} cannot exceed 365 days.`);
    } else if (name.includes("hours") && intValue > 24) {
      toast.error(`${name.replace("_", " ")} cannot exceed 24 hours.`);
    } else if (name.includes("mins") && intValue > 59) {
      toast.error(`${name.replace("_", " ")} cannot exceed 59 minutes.`);
    }
  };
  const handelPayemntRadioChange = (e) => {
    const value = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      amenity: {
        ...prevState.amenity,
        prepaid: value === "prepaid",
        postpaid: value === "postpaid",
      },
    }));
  };

  const handlePaymentCheckbox = (e) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      amenity: {
        ...prev.amenity,
        [name]: checked,
      },
    }));
  };

  return (
    <section className="flex">
      {/* <Navbar /> */}
      <div className="w-full p-4 mb-5">
        <h1
          style={{ background: themeColor }}
          className="bg-black text-white font-semibold rounded-md text-center p-2"
        >
          Setup Edit Facility
        </h1>

        <div className="flex gap-4 my-4">
          <div className="flex gap-2 items-center">
            <input
              type="radio"
              name="type"
              id="bookable"
              value="bookable"
              checked={formData.amenity.fac_type === "bookable"}
              onChange={handelRadioChange}
            />
            <label htmlFor="bookable" className="text-lg">
              Bookable
            </label>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="radio"
              name="type"
              id="request"
              value="request"
              onChange={handelRadioChange}
              checked={formData.amenity.fac_type === "request"}
            />
            <label htmlFor="request" className="text-lg">
              Request
            </label>
          </div>
        </div>

        <div>
          <h2 className="border-b border-black text-lg font-medium my-3">
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
                id=""
                value={formData.amenity.fac_name}
                onChange={(e) =>
                  handleAmenityChange("fac_name", e.target.value)
                }
                className="border border-gray-400 rounded-md p-2"
                placeholder="Facility name"
              />
            </div>

            {/* Active */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">Active</label>
              <select
                className="border rounded-md border-gray-400 p-2 py-3"
                value={
                  formData.amenity.active === true
                    ? "true"
                    : formData.amenity.active === false
                      ? "false"
                      : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amenity: {
                      ...prev.amenity,
                      active: e.target.value === "true",
                    },
                  }))
                }
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Shreable */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">Shareable</label>
              <select
                className="border rounded-md border-gray-400 p-2 py-3"
                value={
                  formData.amenity.shreable === true
                    ? "true"
                    : formData.amenity.shreable === false
                      ? "false"
                      : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amenity: {
                      ...prev.amenity,
                      shreable: e.target.value === "true",
                    },
                  }))
                }
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Link To Building */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">Link To Building</label>
              <select
                className="border rounded-md border-gray-400 p-2 py-3"
                value={
                  formData.amenity.link_to_building === true
                    ? "true"
                    : formData.amenity.link_to_building === false
                      ? "false"
                      : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amenity: {
                      ...prev.amenity,
                      link_to_building: e.target.value === "true",
                    },
                  }))
                }
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </div>
        <div className="my-4">
          <div className="flex gap-4  border-black items-center mt-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="postpaid"
                checked={formData.amenity.postpaid}
                onChange={handlePaymentCheckbox}
              />
              Postpaid
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="prepaid"
                checked={formData.amenity.prepaid}
                onChange={handlePaymentCheckbox}
              />
              Prepaid
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="pay_on_facility"
                checked={formData.amenity.pay_on_facility}
                onChange={handlePaymentCheckbox}
              />
              Pay on facility
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="complimentary"
                checked={formData.amenity.complimentary}
                onChange={handlePaymentCheckbox}
              />
              Complimentary
            </label>

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
              <p className="text-center font-medium"> Child</p>
              <p className="text-center font-medium"> Flat Amount</p>
            </div>

            {/* Member Section */}
            <div className="grid grid-cols-4 items-center border-b">
              <div className="flex justify-center my-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.amenity.member === true}
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
                  checked={formData.amenity.is_member_adult}
                  disabled={!formData.amenity.member}
                  onChange={() => handleChildToggle("is_member_adult")}
                />
                {/* Adult Price Input */}
                <input
                  type="text"
                  disabled={
                    !formData.amenity.member ||
                    !formData.amenity.is_member_adult
                  }
                  value={formData.amenity.member_price_adult || ""}
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
                  checked={formData.amenity.is_member_child}
                  disabled={!formData.amenity.member}
                  onChange={() => handleChildToggle("is_member_child")}
                />
                {/* Child Price Input */}
                <input
                  type="text"
                  disabled={
                    !formData.amenity.member ||
                    !formData.amenity.is_member_child
                  }
                  value={formData.amenity.member_price_child || ""}
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
                  checked={formData.amenity.is_fixed || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amenity: {
                        ...prev.amenity,
                        is_fixed: e.target.checked,
                        fixed_amount: e.target.checked ? prev.amenity.fixed_amount : "",
                      },
                    }))
                  }
                />

                <input
                  type="text"
                  value={formData.amenity.fixed_amount || ""}
                  onChange={(e) =>
                    handlePriceChange("fixed_amount", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="₹100"
                />


                {/* <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="postpaid"
                      checked={formData.amenity.postpaid}
                      onChange={handlePaymentCheckbox}
                    />
                    Postpaid
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="pay_on_facility"
                      checked={formData.amenity.pay_on_facility}
                      onChange={handlePaymentCheckbox}
                    />
                    Pay on facility
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="prepaid"
                      checked={formData.amenity.prepaid}
                      onChange={handlePaymentCheckbox}
                    />
                    Prepaid
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="complimentary"
                      checked={formData.amenity.complimentary}
                      onChange={handlePaymentCheckbox}
                    />
                    Complimentary
                  </label>
                </div> */}
              </div>
            </div>

            {/* Non-Member Section */}
            <div className="grid grid-cols-4 items-center border-b">

              {/* Non Member */}
              <div className="flex justify-center my-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.amenity.non_member === true}
                    onChange={() => handleCheckboxChange("non_member")}
                  />
                  Non-Member
                </label>
              </div>

              {/* Adult */}
              <div className="flex justify-center my-2">
                <input
                  type="checkbox"
                  className="mx-2"
                  checked={formData.amenity.is_non_member_adult}
                  disabled={!formData.amenity.non_member}
                  onChange={() => handleChildToggle("is_non_member_adult")}
                />

                <input
                  type="text"
                  disabled={
                    !formData.amenity.non_member || !formData.amenity.is_non_member_adult
                  }
                  value={formData.amenity.non_member_price_adult || ""}
                  onChange={(e) =>
                    handlePriceChange("non_member_price_adult", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="₹100"
                />
              </div>

              {/* Child */}
              <div className="flex justify-center my-2">
                <input
                  type="checkbox"
                  className="mx-2"
                  checked={formData.amenity.is_non_member_child}
                  disabled={!formData.amenity.non_member}
                  onChange={() => handleChildToggle("is_non_member_child")}
                />

                <input
                  type="text"
                  disabled={
                    !formData.amenity.non_member || !formData.amenity.is_non_member_child
                  }
                  value={formData.amenity.non_member_price_child || ""}
                  onChange={(e) =>
                    handlePriceChange("non_member_price_child", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="₹100"
                />
              </div>

              {/* <div> */}
              {/* <div className="flex flex-col justify-center items-start gap-2 my-2 pl-4">
                  <div className="grid grid-cols-2 gap-x-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="non_postpaid"
                        checked={formData.amenity.non_postpaid}
                        onChange={handlePaymentCheckbox}
                      />
                      Postpaid
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="non_pay_on_facility"
                        checked={formData.amenity.non_pay_on_facility}
                        onChange={handlePaymentCheckbox}
                      />
                      Pay on facility
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="non_prepaid"
                        checked={formData.amenity.non_prepaid}
                        onChange={handlePaymentCheckbox}
                      />
                      Prepaid
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="non_complimentary"
                        checked={formData.amenity.non_complimentary}
                        onChange={handlePaymentCheckbox}
                      />
                      Complimentary
                    </label>
                  </div>
                </div> */}
              {/* </div> */}
            </div>

            {/* Guest Section */}
            <div className="grid grid-cols-4 items-center border-b">
              <div className="flex justify-center my-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.amenity.guest === true}
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
                  checked={formData.amenity.is_guest_adult}
                  disabled={!formData.amenity.guest}
                  onChange={() => handleChildToggle("is_guest_adult")}
                />
                {/* Adult Price Input */}
                <input
                  type="text"
                  disabled={
                    !formData.amenity.guest || !formData.amenity.is_guest_adult
                  }
                  value={formData.amenity.guest_price_adult || ""}
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
                  checked={formData.amenity.is_guest_child}
                  disabled={!formData.amenity.guest}
                  onChange={() => handleChildToggle("is_guest_child")}
                />
                {/* Child Price Input */}
                <input
                  type="text"
                  disabled={
                    !formData.amenity.guest || !formData.amenity.is_guest_child
                  }
                  value={formData.amenity.guest_price_child || ""}
                  onChange={(e) =>
                    handlePriceChange("guest_price_child", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="₹100"
                />
              </div>
              <div>
                {/* <div className="flex flex-col justify-center items-start gap-2 my-2 pl-4">
                  <div className="grid grid-cols-2 gap-x-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="guest_postpaid"
                        checked={formData.amenity.guest_postpaid}
                        onChange={handlePaymentCheckbox}
                      />
                      Postpaid
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="guest_pay_on_facility"
                        checked={formData.amenity.guest_pay_on_facility}
                        onChange={handlePaymentCheckbox}
                      />
                      Pay on facility
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="guest_prepaid"
                        checked={formData.amenity.guest_prepaid}
                        onChange={handlePaymentCheckbox}
                      />
                      Prepaid
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="guest_complimentary"
                        checked={formData.amenity.guest_complimentary}
                        onChange={handlePaymentCheckbox}
                      />
                      Complimentary
                    </label>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Tenant Section */}
            <div className="grid grid-cols-4 items-center border-b">
              <div className="flex justify-center my-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.amenity.tenant === true}
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
                  checked={formData.amenity.is_tenant_adult}
                  disabled={!formData.amenity.tenant}
                  onChange={() => handleChildToggle("is_tenant_adult")}
                />
                {/* Adult Price Input */}
                <input
                  type="text"
                  disabled={
                    !formData.amenity.tenant ||
                    !formData.amenity.is_tenant_adult
                  }
                  value={formData.amenity.tenant_price_adult || ""}
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
                  checked={formData.amenity.is_tenant_child}
                  disabled={!formData.amenity.tenant}
                  onChange={() => handleChildToggle("is_tenant_child")}
                />
                {/* Child Price Input */}
                <input
                  type="text"
                  disabled={
                    !formData.amenity.tenant ||
                    !formData.amenity.is_tenant_child
                  }
                  value={formData.amenity.tenant_price_child || ""}
                  onChange={(e) =>
                    handlePriceChange("tenant_price_child", e.target.value)
                  }
                  className="border border-gray-400 rounded p-2 outline-none"
                  placeholder="₹100"
                />
              </div>
              <div>
                {/* <div className="flex flex-col justify-center items-start gap-2 my-2 pl-4">
                  <div className="grid grid-cols-2 gap-x-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="tenant_postpaid"
                        checked={formData.amenity.tenant_postpaid}
                        onChange={handlePaymentCheckbox}
                      />
                      Postpaid
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="tenant_pay_on_facility"
                        checked={formData.amenity.tenant_pay_on_facility}
                        onChange={handlePaymentCheckbox}
                      />
                      Pay on facility
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="tenant_prepaid"
                        checked={formData.amenity.tenant_prepaid}
                        onChange={handlePaymentCheckbox}
                      />
                      Prepaid
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="tenant_complimentary"
                        checked={formData.amenity.tenant_complimentary}
                        onChange={handlePaymentCheckbox}
                      />
                      Complimentary
                    </label>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="my-2 flex flex-col gap-2">
                <label htmlFor="min_people" className="font-medium">
                  Minimum person allowed
                </label>
                <input
                  type="number"
                  name="min_people"
                  id="min_people"
                  className="border rounded-md p-2"
                  placeholder="Minimum person allowed"
                  value={formData.amenity.min_people}
                  onChange={handleInputChange}
                />
              </div>
              <div className="my-2 flex flex-col gap-2">
                <label htmlFor="max_people" className="font-medium">
                  Maximum person allowed
                </label>
                <input
                  type="number"
                  name="max_people"
                  id="max_people"
                  className="border rounded-md p-2"
                  placeholder="Maximum person allowed"
                  value={formData.amenity.max_people}
                  onChange={handleInputChange}
                />
              </div>
              <div className="my-2 flex flex-col gap-2">
                <label htmlFor="gst_no" className="font-medium">
                  GST No
                </label>
                <input
                  type="text"
                  name="gst_no"
                  id="gst_no"
                  className="border rounded-md p-2"
                  placeholder="GST Number"
                  value={formData.amenity.gst_no || ""}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      amenity: {
                        ...prevState.amenity,
                        gst_no: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="my-2 flex flex-col gap-2">
                <label htmlFor="gst" className="font-medium">
                  GST (%)
                </label>
                <input
                  type="number"
                  name="gst"
                  id="gst"
                  className="border rounded-md p-2"
                  placeholder="GST %"
                  value={formData.amenity.gst || ""}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      amenity: {
                        ...prevState.amenity,
                        gst: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="my-2 flex flex-col gap-2">
                <label htmlFor="sgst" className="font-medium">
                  SGST (%)
                </label>
                <input
                  type="number"
                  name="sgst"
                  id="sgst"
                  className="border rounded-md p-2"
                  placeholder="SGST %"
                  value={formData.amenity.sgst || ""}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      amenity: {
                        ...prevState.amenity,
                        sgst: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-y">
          {/* Booking Allowed Before */}
          <div className="grid grid-cols-5 items-center border-b px-4 gap-2">
            <div className="flex justify-center my-2">
              <label
                htmlFor="book_before_days"
                className="flex items-center gap-2"
              >
                Booking allowed before
              </label>
            </div>
            <div>{dates?.amenity?.book_before[0] || "Not Updated Dates"}</div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="text"
                name="book_before_days"
                value={formData.amenity.book_before_days}
                onChange={handleInputChange}
                onBlur={validateInput} // Validate on losing focus
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Day"
                maxLength="2" // Restrict input to a maximum of 2 characters
              />
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="text"
                name="book_before_hours"
                value={formData.amenity.book_before_hours}
                onChange={handleInputChange}
                onBlur={validateInput} // Validate on losing focus
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Hour"
                maxLength="2" // Restrict input to a maximum of 2 characters
              />
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="text"
                name="book_before_mins"
                value={formData.amenity.book_before_mins}
                onChange={handleInputChange}
                onBlur={validateInput} // Validate on losing focus
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Mins"
                maxLength="2" // Restrict input to a maximum of 2 characters
              />
            </div>
          </div>

          {/* Advance Booking */}
          <div className="grid grid-cols-5 items-center border-b px-4 gap-2">
            <div className="flex justify-center my-2">
              <label htmlFor="advance_days" className="flex items-center gap-2">
                Advance Booking
              </label>
            </div>
            <div>
              {dates?.amenity?.advance_booking[0] || "Not Updated Dates"}
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="text"
                name="advance_days"
                value={formData?.amenity?.advance_days || ""}
                onBlur={validateInput}
                onChange={handleInputChange}
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Day"
                maxLength="2"
              />
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="text"
                name="advance_hours"
                value={formData.amenity.advance_hours || ""}
                onBlur={validateInput}
                onChange={handleInputChange}
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Hour"
                maxLength="2"
              />
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="text"
                name="advance_mins"
                value={formData.amenity.advance_mins || ""}
                onBlur={validateInput}
                onChange={handleInputChange}
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Mins"
                maxLength="2"
              />
            </div>
          </div>

          {/* Can Cancel Before Schedule */}
          <div className="grid grid-cols-5 items-center px-4 gap-2">
            <div className="flex justify-center my-2">
              <label
                htmlFor="cancel_before_days"
                className="flex items-center gap-2"
              >
                Can Cancel Before Schedule
              </label>
            </div>
            <div>{dates?.amenity?.cancel_before[0] || "Not Updated Dates"}</div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="text"
                name="cancel_before_days"
                value={formData.amenity.cancel_before_days || ""}
                onBlur={validateInput}
                onChange={handleInputChange}
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Day"
                maxLength="2"
              />
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="text"
                name="cancel_before_hours"
                value={formData.amenity.cancel_before_hours || ""}
                onBlur={validateInput}
                onChange={handleInputChange}
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Hour"
                maxLength="2"
              />
            </div>
            <div className="flex justify-center my-2 w-full">
              <input
                type="text"
                name="cancel_before_mins"
                value={formData.amenity.cancel_before_mins || ""}
                onBlur={validateInput}
                onChange={handleInputChange}
                className="border border-gray-400 rounded-md p-2 outline-none w-full"
                placeholder="Mins"
                maxLength="2"
              />
            </div>
          </div>
        </div>
        {/* Booking Rule */}
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

              {/* Prime Time – one time-picker row per entry */}
              <div className="flex flex-col gap-2">
                {(Array.isArray(rule.primeTime) && rule.primeTime.length > 0
                  ? rule.primeTime
                  : [{ start_time: "", end_time: "" }]
                ).map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={pt.start_time || ""}
                      onChange={(e) =>
                        handlePrimeTimeChange(rule.id, pIdx, "start_time", e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="time"
                      value={pt.end_time || ""}
                      onChange={(e) =>
                        handlePrimeTimeChange(rule.id, pIdx, "end_time", e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {Array.isArray(rule.primeTime) && rule.primeTime.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePrimeTime(rule.id, pIdx)}
                        className="text-red-500"
                      >
                        <FaTrash size={12} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddPrimeTime(rule.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-xs mt-1 w-fit"
                >
                  + Add Prime Time
                </button>
              </div>

              {/* Sub Facility */}
              <div className="flex items-center gap-2">
                {/* <input
                                  type="checkbox"
                                  checked={subFacilityAvailable}
                                  onChange={(e) => setSubFacilityAvailable(e.target.checked)}
                                /> */}
                <span className="text-sm">Sub Facility</span>
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
            Add
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ================= COVER IMAGES ================= */}
          <div className="my-4">
            <h2 className="border-b border-black text-lg mb-3 font-medium">
              Cover Images
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "covers")}
              multiple
              className="mb-4"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.covers && formData.covers.length > 0 ? (
                formData.covers.map((cover, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg border overflow-hidden"
                  >
                    <img
                      src={
                        cover.image_url
                          ? domainPrefix + cover.image_url
                          : URL.createObjectURL(cover)
                      }
                      alt={`Cover ${index + 1}`}
                      className="object-cover w-full h-40"
                    />

                    {/* Remove Button */}

                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs"
                    >
                      ✕
                    </button>

                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No cover images available.
                </p>
              )}
            </div>
          </div>

          {/* ================= ATTACHMENTS ================= */}
          <div className="my-4">
            <h2 className="border-b border-black text-lg mb-3 font-medium">
              Attachments
            </h2>

            <input
              type="file"
              onChange={(e) => handleFileChange(e, "attachments")}
              multiple
              className="mb-4"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.attachments && formData.attachments.length > 0 ? (
                formData.attachments.map((doc, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg border overflow-hidden p-3 flex items-center justify-center bg-gray-50"
                  >
                    {doc.image_url || doc.type?.startsWith("image/") ? (
                      <img
                        src={
                          doc.image_url
                            ? domainPrefix + doc.image_url
                            : URL.createObjectURL(doc)
                        }
                        alt={`Attachment ${index + 1}`}
                        className="object-cover w-full h-32"
                      />
                    ) : (
                      <p className="text-sm text-gray-600 text-center">
                        {doc.name || "Document File"}
                      </p>
                    )}

                    {/* Remove Button */}

                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs"
                    >
                      ✕
                    </button>

                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No attachments available.
                </p>
              )}
            </div>
          </div>

        </div>
        <div>
          <div className="flex flex-col">
            <label htmlFor="description" className="font-medium">
              Description
            </label>
            <textarea
              id="description"
              cols="80"
              rows="3"
              className="border border-gray-400 p-1 placeholder:text-sm rounded-md"
              value={formData.amenity.description} // Bind value to state
              onChange={handleDescriptionChange} // Handle change
              placeholder="Enter a description..."
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md border p-6 mt-2 mb-3 border-gray-300">
          <h2 className="text-lg font-semibold mb-6">Configure Slot</h2>
          <div className="overflow-x-auto">
            {formData.slots.map((slot, slotIndex) => (
              <div key={slotIndex} className="flex gap-4 items-end mb-4 min-w-[1200px]">

                {/* Start Time */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Start time</label>
                  <input
                    type="time"
                    value={formatTime(slot.start_hr, slot.start_min)}
                    onChange={(e) => handleSlotTimeChange(slotIndex, "start", e.target.value)}
                    className="border rounded-md px-3 py-2"
                  />
                </div>

                {/* Break Start */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Break Start</label>
                  <input
                    type="time"
                    value={formatTime(slot.break_start_hr, slot.break_start_min)}
                    onChange={(e) => handleSlotTimeChange(slotIndex, "break_start", e.target.value)}
                    className="border rounded-md px-3 py-2"
                  />
                </div>

                {/* Break End */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Break End</label>
                  <input
                    type="time"
                    value={formatTime(slot.break_end_hr, slot.break_end_min)}
                    onChange={(e) => handleSlotTimeChange(slotIndex, "break_end", e.target.value)}
                    className="border rounded-md px-3 py-2"
                  />
                </div>

                {/* End Time */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">End Time</label>
                  <input
                    type="time"
                    value={formatTime(slot.end_hr, slot.end_min)}
                    onChange={(e) => handleSlotTimeChange(slotIndex, "end", e.target.value)}
                    className="border rounded-md px-3 py-2"
                  />
                </div>

                {/* Concurrent Slots */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Concurrent</label>
                  <input
                    type="number"
                    min="0"
                    value={slot.concurrent_slots || ""}
                    onChange={(e) => handleSlotFieldChange(slotIndex, "concurrent_slots", e.target.value)}
                    className="border rounded-md px-3 py-2 w-24"
                  />
                </div>

                {/* Slot By */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Slot By</label>
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
                  <label className="text-sm font-medium text-gray-600">Wrap Time</label>
                  <input
                    type="number"
                    min="0"
                    value={slot.wrap_up_time || ""}
                    onChange={(e) => handleSlotFieldChange(slotIndex, "wrap_up_time", e.target.value)}
                    className="border rounded-md px-3 py-2 w-24"
                  />
                </div>

                {/* Remove Slot */}
                {formData.slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(slotIndex)}
                    className="text-red-500 hover:text-red-700 mb-2"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddSlot}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            + Add Slot
          </button>
        </div>
        {/* <div className="my-4">
          <h2 className="border-b border-black text-lg mb-1 font-medium">
            Configure Slot
          </h2>

          {formData.slots.map((slot, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-2 bg-white my-2 rounded-lg"
            >
              <div className="flex flex-col">
                <label htmlFor={`start-time-${index}`} className="font-medium">
                  Start Time
                </label>
                <input
                  id={`start-time-${index}`}
                  type="time"
                  placeholder="Start Time"
                  value={`${String(slot.start_hr || 0).padStart(
                    2,
                    "0",
                  )}:${String(slot.start_min || 0).padStart(2, "0")}`}
                  onChange={(e) =>
                    handleSlotTimeChange(index, "start", e.target.value)
                  }
                  className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                />
              </div>
              <div className="flex flex-col mx-3">
                <label htmlFor={`end-time-${index}`} className="font-medium">
                  End Time
                </label>
                <input
                  id={`end-time-${index}`}
                  type="time"
                  placeholder="End Time"
                  value={`${String(slot.end_hr || 0).padStart(2, "0")}:${String(
                    slot.end_min || 0,
                  ).padStart(2, "0")}`}
                  onChange={(e) =>
                    handleSlotTimeChange(index, "end", e.target.value)
                  }
                  className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                />
              </div>
              <div className="flex items-end justify-end">
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

          <div className="flex">
            <button
              type="button"
              onClick={handleAddSlot}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <BiPlusCircle className="h-5 w-5 mr-2" />
              Add Slot
            </button>
          </div>
        </div> */}

        <div></div>
        <h1 className="text-[18px]"><b>Operatinal Days : </b></h1>
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
          <div>
            <div className="flex flex-col mt-4">
              <label htmlFor="terms" className="font-medium">
                Terms & Conditions
              </label>
              <textarea
                id="terms"
                rows="3"
                className="border border-gray-400 p-1 placeholder:text-sm rounded-md"
                value={formData.amenity.terms} // Bind value to state
                onChange={handleTermsChange} // Handle change
                placeholder="Enter terms and conditions..."
              />
            </div>
          </div>

          <div>
            <div className="flex flex-col my-4">
              <label htmlFor="cancellation_policy" className="font-medium">
                Cancellation Policy
              </label>
              <textarea
                id="cancellation_policy"
                rows="3"
                className="border border-gray-400 p-1 placeholder:text-sm rounded-md"
                value={formData.amenity.cancellation_policy} // Bind value to state
                onChange={handleCancellationPolicyChange} // Handle change
                placeholder="Enter cancellation policy..."
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center my-2 gap-3 mt-4">
          <button
            style={{ background: themeColor }}
            className=" text-white p-2 px-4 font-semibold rounded-md flex items-center gap-2"
            onClick={() => navigate("/setup/facility")}
          >
            <FaCheck /> Cancel
          </button>
          <button
            style={{ background: themeColor }}
            className=" text-white p-2 px-4 font-semibold rounded-md flex items-center gap-2"
            onClick={updateAmenitiesSetup}
          >
            <FaCheck /> Submit
          </button>
        </div>

      </div>
    </section>
  );
};

export default EditAmenitySetup;
