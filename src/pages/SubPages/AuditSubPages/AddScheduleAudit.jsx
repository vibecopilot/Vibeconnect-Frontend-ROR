import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { PiPlusCircle } from "react-icons/pi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAssignedTo, getVendors } from "../../../api";

const API_BASE = "https://admin.vibecopilot.ai";

/**
 * ✅ This component:
 * - Makes all fields controlled (connected to state)
 * - Builds payload exactly like your sample:
 *   { audit: { ... } }
 * - Posts to: /audits.json?token=XXXX
 * - Handles allow_observations, look_overdue_task, supervisors[], etc.
 *
 * NOTE:
 * - If your backend expects different param names for tasks, adjust `audit_tasks`.
 */
const AddScheduleAudit = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const navigate = useNavigate();

  // UI toggles
  const [isOn, setIsOn] = useState(false); // "Create New" toggle (template selector)
  const [isOnTask, setIsOnTask] = useState(false); // "Create Task" toggle
  const [isOnWeight, setIsOnWeight] = useState(false); // "Weightage" toggle

  // checklist radio
  const [selection, setSelection] = useState(""); // individual | asset-group

  // for API
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const [assetGroups, setAssetGroups] = useState([]);
  const [subGroups, setSubGroups] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSubGroup, setSelectedSubGroup] = useState("");

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  // You can keep token in env, or paste it here for now
  const API_TOKEN =
    import.meta?.env?.VITE_MYCITI_TOKEN ||
    "e6fbf77f4fbb5a72c4150e495c961972f0f14059d8a6670f";

  // Audit type tabs (your earlier scheduleFor)
  const [scheduleFor, setScheduleFor] = useState("asset"); // asset | services | vendor | training | compliance

  const todayISO = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  useEffect(() => {
    const fetchAssetGroups = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/asset_groups.json`,
          {
            params: {
              token: API_TOKEN,
              "q[group_for_eq]": "asset",
            },
          }
        );

        setAssetGroups(res?.data || []);
      } catch (error) {
        console.error("Asset group error:", error);
      }
    };

    fetchAssetGroups();
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;

    const fetchSubGroups = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/sub_groups.json`,
          {
            params: {
              token: API_TOKEN,
              "q[group_id_eq]": selectedGroup, // 🔥 important
            },
          }
        );

        setSubGroups(res?.data || []);
      } catch (error) {
        console.error("Sub group error:", error);
      }
    };

    fetchSubGroups();
  }, [selectedGroup]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAssignedTo();
        setAssignedUsers(res?.data || []);
      } catch (err) {
        console.error("Assigned users fetch error:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await getVendors();
        setVendors(res?.data || []);
      } catch (err) {
        console.error("Vendors fetch error:", err);
      }
    };

    fetchVendors();
  }, []);

  const [formData, setFormData] = useState({
    audit_for: "asset",
    activity_name: "",
    description: "",
    allow_observations: true,
    checklist_type: "",
    // entity names (only one used depending on audit_for)
    asset_name: "",
    service_name: "",
    vendor_name: "",
    training_name: "",
    // schedule
    assign_to: "",
    scan_type: "",
    plan_duration: "",
    priority: "",
    email_trigger_rule: "",
    supervisors: "", // comma-separated ids in UI -> array in payload
    category: "",
    look_overdue_task: false,
    frequency: "",
    start_from: todayISO,
    end_at: "",
    select_supplier: "",
    created_by_id: "",
    // optional tasks
    audit_tasks: [],
  });

  // Dynamic task sections
  const [sections, setSections] = useState([]);

  const handleToggle = () => setIsOn((s) => !s);
  const handleToggle1 = () => setIsOnTask((s) => !s);
  const handleToggle2 = () => setIsOnWeight((s) => !s);

  const handleRadioChange = (e) => setSelection(e.target.value);

  const setAuditFor = (val) => {
    setScheduleFor(val);
    setFormData((p) => ({ ...p, audit_for: val }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // tasks
  const handleAddSectionClick = () => {
    setSections((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        group: "",
        subGroup: "",
        task: "",
        inputType: "",
        mandatory: false,
        reading: false,
        helpTextEnabled: false,
        helpTextLabel: "",
        helpTextFile: null,
        weightage: "",
        rating: false,
      },
    ]);
  };

  const handleDeleteSectionClick = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSection = (id, patch) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  };

  const buildSupervisorsArray = (raw) => {
    // UI: "5, 6" -> [5,6]
    if (!raw) return [];
    return raw
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n));
  };

  const buildAuditPayload = () => {
    const audit_for = formData.audit_for; // asset/services/vendor/training/compliance

    // Only keep the relevant name field; others -> null (like your sample)
    const names = {
      asset_name: null,
      service_name: null,
      vendor_name: null,
      training_name: null,
    };

    if (audit_for === "asset") names.asset_name = formData.asset_name || null;
    if (audit_for === "services")
      names.service_name = formData.service_name || null;
    if (audit_for === "vendor") names.vendor_name = formData.vendor_name || null;
    if (audit_for === "training")
      names.training_name = formData.training_name || null;

    // If your backend supports compliance_name, add it here
    // (your sample payload doesn't have it)
    // names.compliance_name = audit_for === "compliance" ? formData.compliance_name : null;

    const supervisorsArr = buildSupervisorsArray(formData.supervisors);

    // Convert sections -> audit_tasks (if backend expects it)
    const audit_tasks = sections.map((s) => ({
      group: s.group || null,
      sub_group: s.subGroup || null,
      task: s.task || null,
      input_type: s.inputType || null,
      mandatory: !!s.mandatory,
      reading: !!s.reading,
      help_text_enabled: !!s.helpTextEnabled,
      help_text_label: s.helpTextEnabled ? s.helpTextLabel || null : null,
      // file upload normally needs multipart; keeping reference here
      // help_text_file: s.helpTextFile || null,
      weightage: isOnWeight ? s.weightage || null : null,
      rating: isOnWeight ? !!s.rating : false,
    }));

    const audit = {
      audit_for,
      activity_name: formData.activity_name,
      description: formData.description,
      allow_observations: !!formData.allow_observations,
      checklist_type: formData.checklist_type || "",

      ...names,

      assign_to: formData.assign_to ? Number(formData.assign_to) : null,
      scan_type: formData.scan_type || null,
      plan_duration: formData.plan_duration || null,
      priority: formData.priority || null,
      email_trigger_rule: formData.email_trigger_rule || null,
      supervisors: supervisorsArr,
      category: formData.category || null,
      look_overdue_task: !!formData.look_overdue_task,
      frequency: formData.frequency || null,
      start_from: formData.start_from || null,
      end_at: formData.end_at || null,
      select_supplier: formData.select_supplier
        ? Number(formData.select_supplier)
        : null,
      created_by_id: formData.created_by_id
        ? Number(formData.created_by_id)
        : null,

      // optional tasks (remove this line if backend rejects it)
      ...(audit_tasks.length ? { audit_tasks } : {}),
    };

    return { audit };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");

    // very light validation
    if (!formData.activity_name?.trim()) {
      setErrorText("Activity Name is required.");
      return;
    }
    if (!formData.audit_for) {
      setErrorText("Audit For is required.");
      return;
    }

    setLoading(true);
    try {
      const payload = buildAuditPayload();

      // ✅ POST to audits.json with token (as per your URL pattern)
      const url = `${API_BASE}/audits.json?token=${encodeURIComponent(
        API_TOKEN
      )}`;

      const resp = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccessText("Audit created successfully ✅");
      navigate("/admin/audit");
      // If you want reset:
      // setSections([]);
      // setFormData((p) => ({ ...p, activity_name: "", description: "" }));
      console.log("Created audit:", resp?.data);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        JSON.stringify(err?.response?.data || {}) ||
        err?.message ||
        "Failed to create audit.";
      setErrorText(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (scheduleFor) {
      case "asset":
        return (
          <div className="grid md:grid-cols-1 gap-5">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="asset_name" className="font-semibold">
                Asset:
              </label>
              <input
                id="asset_name"
                name="asset_name"
                value={formData.asset_name}
                onChange={handleChange}
                placeholder="Enter Asset Name"
                className="border border-gray-400 p-2 rounded-md w-full"
              />
            </div>
          </div>
        );
      case "services":
        return (
          <div className="grid md:grid-cols-1 gap-5">
            <div className="grid gap-2 items-center w-full">
              <label htmlFor="service_name" className="font-semibold">
                Service Name
              </label>
              <input
                type="text"
                name="service_name"
                id="service_name"
                value={formData.service_name}
                onChange={handleChange}
                placeholder="Enter Service Name"
                className="border border-gray-400 p-2 rounded-md w-full"
              />
            </div>
          </div>
        );
      case "vendor":
        return (
          <div className="grid md:grid-cols-1 gap-5">
            <div className="grid gap-2 items-center w-full">
              <label htmlFor="vendor_name" className="font-semibold">
                Vendor Name
              </label>
              <input
                type="text"
                name="vendor_name"
                id="vendor_name"
                value={formData.vendor_name}
                onChange={handleChange}
                placeholder="Enter Vendor Name"
                className="border border-gray-400 p-2 rounded-md w-full"
              />
            </div>
          </div>
        );
      case "training":
        return (
          <div className="grid md:grid-cols-1 gap-5">
            <div className="grid gap-2 items-center w-full ">
              <label htmlFor="training_name" className="font-semibold">
                Training Name
              </label>
              <input
                type="text"
                name="training_name"
                id="training_name"
                value={formData.training_name}
                onChange={handleChange}
                placeholder="Enter Training Name"
                className="border border-gray-400 p-2 rounded-md w-full"
              />
            </div>
          </div>
        );
      case "compliance":
        return (
          <div className="grid md:grid-cols-1 gap-5">
            <div className="grid gap-2 items-center w-full ">
              <label className="font-semibold">Compliance</label>
              <input
                type="text"
                placeholder="Enter Compliance Name"
                className="border border-gray-400 p-2 rounded-md w-full"
                disabled
              />
              <small className="text-gray-500">
                Backend payload example doesn’t include compliance_name. If you
                have that key in API, tell me and I’ll add it.
              </small>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTaskFields = (section) => (
    <div className="grid md:grid-cols-3 gap-5">
      <div className="grid gap-2 items-center w-full">
        <label className="font-semibold">Group:</label>
        <input
          value={section.group}
          onChange={(e) => updateSection(section.id, { group: e.target.value })}
          className="border border-gray-400 p-2 rounded-md"
          placeholder="Enter Group"
        />
      </div>

      <div className="grid gap-2 items-center w-full">
        <label className="font-semibold">SubGroup:</label>
        <input
          value={section.subGroup}
          onChange={(e) =>
            updateSection(section.id, { subGroup: e.target.value })
          }
          className="border border-gray-400 p-2 rounded-md"
          placeholder="Enter SubGroup"
        />
      </div>

      <div className="grid gap-2 items-center w-full">
        <label className="font-semibold">Task:</label>
        <input
          value={section.task}
          onChange={(e) => updateSection(section.id, { task: e.target.value })}
          className="border border-gray-400 p-2 rounded-md"
          placeholder="Enter Task"
        />
      </div>

      <div className="grid gap-2 items-center w-full">
        <label className="font-semibold">Input Type:</label>
        <select
          value={section.inputType}
          onChange={(e) =>
            updateSection(section.id, { inputType: e.target.value })
          }
          className="border border-gray-400 p-2 rounded-md"
        >
          <option value="">Select Input Type</option>
          <option value="text">Text</option>
          <option value="dropdown">Drop Down</option>
          <option value="radio">Radio Button</option>
          <option value="checkbox">Checkbox</option>
          <option value="numeric">Numeric</option>
          <option value="multiline">Multiline</option>
          <option value="date">Date</option>
          <option value="options_inputs">Options & Inputs</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={section.mandatory}
            onChange={(e) =>
              updateSection(section.id, { mandatory: e.target.checked })
            }
          />
          Mandatory
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={section.reading}
            onChange={(e) =>
              updateSection(section.id, { reading: e.target.checked })
            }
          />
          Reading
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={section.helpTextEnabled}
            onChange={(e) =>
              updateSection(section.id, { helpTextEnabled: e.target.checked })
            }
          />
          Help Text
        </label>
      </div>

      {section.helpTextEnabled && (
        <div className="flex flex-col gap-2">
          <input
            type="file"
            onChange={(e) =>
              updateSection(section.id, { helpTextFile: e.target.files?.[0] })
            }
          />
          <input
            type="text"
            value={section.helpTextLabel}
            onChange={(e) =>
              updateSection(section.id, { helpTextLabel: e.target.value })
            }
            className="border border-gray-400 p-2 rounded-md"
            placeholder="Enter Help Text Label"
          />
          <small className="text-gray-500">
            If backend needs file upload, we must use multipart/form-data.
          </small>
        </div>
      )}

      {isOnWeight && (
        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">Weightage</label>
          <input
            type="text"
            value={section.weightage}
            onChange={(e) =>
              updateSection(section.id, { weightage: e.target.value })
            }
            placeholder="Enter Weightage"
            className="border border-gray-400 p-2 rounded-md"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={section.rating}
              onChange={(e) =>
                updateSection(section.id, { rating: e.target.checked })
              }
            />
            Rating
          </label>
        </div>
      )}
    </div>
  );

  const renderScheduleFields = () => (
    <div className="mt-6">
      <h2 className="border-b text-xl border-black mb-6 font-bold">Schedule</h2>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Checklist Type:</label>
          <div className="border rounded-md p-2 border-gray-400">
            <label>
              <input
                type="radio"
                name="selection"
                value="individual"
                checked={selection === "individual"}
                onChange={handleRadioChange}
              />
              &nbsp;Individual
            </label>
            &nbsp;&nbsp;&nbsp;
            <label>
              <input
                type="radio"
                name="selection"
                value="asset-group"
                checked={selection === "asset-group"}
                onChange={handleRadioChange}
              />
              &nbsp;Asset Group
            </label>
          </div>
        </div>

        {selection === "individual" && (
          <div className="grid gap-2 items-center w-full">{renderFormFields()}</div>
        )}

        {selection === "asset-group" && (
          <>
            {/* Asset Group Dropdown */}
            <div className="grid gap-2 items-center w-full">
              <label className="font-semibold">Group:</label>
              <select
                value={selectedGroup}
                onChange={(e) => {
                  setSelectedGroup(e.target.value);
                  setSelectedSubGroup(""); // reset sub group
                }}
                className="border border-gray-400 p-2 rounded-md w-full"
              >
                <option value="">Select Asset Group</option>
                {assetGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Group Dropdown */}
            <div className="grid gap-2 items-center w-full">
              <label className="font-semibold">Sub Group:</label>
              <select
                value={selectedSubGroup}
                onChange={(e) => setSelectedSubGroup(e.target.value)}
                className="border border-gray-400 p-2 rounded-md w-full"
                disabled={!selectedGroup}
              >
                <option value="">Select Sub Group</option>
                {subGroups.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">Assign To :</label>
          <select
            name="assign_to"
            value={formData.assign_to}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
          >
            <option value="">Select User</option>
            {assignedUsers.map((user) => {
              const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim();

              return (
                <option key={user.id} value={user.id}>
                  {fullName || `User ${user.id}`}
                </option>
              );
            })}
          </select>
        </div>

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">Scan Type:</label>
          <select
            name="scan_type"
            value={formData.scan_type}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
          >
            <option value="">Select Scan Type</option>
            <option value="qr">QR</option>
            <option value="nfc">NFC</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">Plan Duration:</label>
          <select
            name="plan_duration"
            value={formData.plan_duration}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
          >
            <option value="">Select Plan Duration</option>
            <option value="minutes">Minutes</option>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">Priority:</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
          >
            <option value="">Select Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">Email Trigger Rule:</label>
          <select
            name="email_trigger_rule"
            value={formData.email_trigger_rule}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
          >
            <option value="">Select Email Trigger Rule</option>
            <option value="on_create">On Create</option>
            <option value="reminder_1_day">Reminder (1 day)</option>
            <option value="reminder_30_days">Reminder (30 days)</option>
          </select>
        </div>

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">
            Supervisors:
          </label>
          <select
            name="assign_to"
            value={formData.assign_to}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
          >
            <option value="">Select Supervisors</option>
            {assignedUsers.map((user) => {
              const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim();

              return (
                <option key={user.id} value={user.id}>
                  {fullName || `User ${user.id}`}
                </option>
              );
            })}
          </select>
        </div>

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">Category:</label>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
            placeholder="e.g. safety"
          />
        </div>

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">Lock Overdue Task:</label>
          <select
            name="look_overdue_task"
            value={String(!!formData.look_overdue_task)}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                look_overdue_task: e.target.value === "true",
              }))
            }
            className="border border-gray-400 p-2 rounded-md"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">Frequency:</label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
          >
            <option value="">Select Frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="half_yearly">Half Yearly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">Start From:</label>
          <input
            type="date"
            name="start_from"
            value={formData.start_from}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
          />
        </div>

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">End At:</label>
          <input
            type="date"
            name="end_at"
            value={formData.end_at}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
          />
        </div>

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">Select Supplier :</label>
          <select
            name="select_supplier"
            value={formData.select_supplier}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
          >
            <option value="">Select Supplier</option>
            {vendors.map((vendor) => {
              const name =
                vendor.name ||
                vendor.company_name ||
                vendor.vendor_name ||
                `${vendor.firstname || ""} ${vendor.lastname || ""}`.trim();

              return (
                <option key={vendor.id} value={vendor.id}>
                  {name || `Vendor ${vendor.id}`}
                </option>
              );
            })}
          </select>
        </div>

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">Checklist Type (API):</label>
          <input
            name="checklist_type"
            value={formData.checklist_type}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
            placeholder="e.g. safety"
          />
        </div>

        <div className="grid gap-2 items-center w-full">
          <label className="font-semibold">Created By (ID):</label>
          <input
            name="created_by_id"
            value={formData.created_by_id}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
            placeholder="e.g. 1"
          />
        </div>
      </div>
    </div>
  );

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <div className="m-2">
          <h2
            style={{ background: themeColor }}
            className="text-center text-xl font-bold p-2 rounded-full text-white"
          >
            Schedule Audit
          </h2>

          <div className="md:mx-20 my-5 mb-10 sm:border border-gray-400 p-5 px-10 rounded-lg sm:shadow-xl">
            {/* toggles */}
            <div className="flex sm:flex-row flex-col justify-between w-full">
              <div className="flex w-full justify-between gap-6 flex-wrap">
                {/* Create New */}
                <div className="grid gap-2 items-center">
                  <label className="font-semibold cursor-pointer">Create New:</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={handleToggle}
                      className="hidden"
                    />
                    <div
                      onClick={handleToggle}
                      className={`w-10 h-4 rounded-full p-1 flex items-center ${isOn ? "bg-blue-500" : "bg-gray-300"
                        } cursor-pointer`}
                    >
                      <div
                        className={`w-3 h-3 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${isOn ? "translate-x-6" : "translate-x-0"
                          }`}
                      />
                    </div>

                    {isOn && (
                      <div className="mt-2 ml-4">
                        <select className="border p-1 px-4 border-gray-500 rounded-md w-70 mt-1 text-sm h-7">
                          <option value="">select from the existing template</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Create Task */}
                <div className="grid gap-2 items-center">
                  <label className="font-semibold cursor-pointer">Create Task:</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isOnTask}
                      onChange={handleToggle1}
                      className="hidden"
                    />
                    <div
                      onClick={handleToggle1}
                      className={`w-10 h-4 rounded-full p-1 flex items-center ${isOnTask ? "bg-blue-500" : "bg-gray-300"
                        } cursor-pointer`}
                    >
                      <div
                        className={`w-3 h-3 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${isOnTask ? "translate-x-6" : "translate-x-0"
                          }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Weightage */}
                <div className="grid gap-2 items-center">
                  <label className="font-semibold cursor-pointer">Weightage:</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isOnWeight}
                      onChange={handleToggle2}
                      className="hidden"
                    />
                    <div
                      onClick={handleToggle2}
                      className={`w-10 h-4 rounded-full p-1 flex items-center ${isOnWeight ? "bg-blue-500" : "bg-gray-300"
                        } cursor-pointer`}
                    >
                      <div
                        className={`w-3 h-3 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${isOnWeight ? "translate-x-6" : "translate-x-0"
                          }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* isOnTask mini UI (kept as you had) */}
            {isOnTask && (
              <div className="flex flex-col items-center mt-6 gap-2">
                <div>
                  Checklist Level&nbsp;&nbsp;&nbsp;
                  <input type="radio" />
                </div>
                <div>
                  Question Level&nbsp;&nbsp;&nbsp;
                  <input type="radio" />
                </div>

                <select className="border p-1 px-4 border-gray-500 rounded-md w-48 mt-1">
                  <option value="">select assigned to</option>
                </select>
                <select className="border p-1 px-4 border-gray-500 rounded-md w-48 mt-1">
                  <option value="">select category</option>
                </select>
              </div>
            )}

            {/* Basic Info */}
            {!isOn && (
              <div className="mt-6">
                <h2 className="border-b text-xl border-black mb-6 font-bold">
                  Basic Info
                </h2>

                <div className="my-5">
                  <div className="grid grid-cols-4 items-center">
                    <p className="font-semibold">Schedule For :</p>

                    <div className="col-span-3">
                      <div className="flex flex-wrap gap-2">
                        {[
                          { key: "asset", label: "Asset" },
                          { key: "services", label: "Services" },
                          { key: "vendor", label: "Vendor" },
                          { key: "training", label: "Training" },
                          { key: "compliance", label: "Compliance" },
                        ].map((t) => (
                          <p
                            key={t.key}
                            className={`border-2 p-1 px-6 border-black font-medium rounded-full cursor-pointer ${scheduleFor === t.key ? "bg-black text-white" : ""
                              }`}
                            onClick={() => setAuditFor(t.key)}
                          >
                            {t.label}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-around items-center">
                    <div className="flex flex-col w-full">
                      <label className="font-semibold mt-1 mb-2">
                        Activity Name
                      </label>
                      <input
                        type="text"
                        name="activity_name"
                        value={formData.activity_name}
                        onChange={handleChange}
                        placeholder="Enter Activity Name"
                        className="w-full border p-2 px-4 border-gray-500 rounded-md"
                      />
                    </div>

                    <div className="flex flex-col w-full">
                      <label className="font-semibold mt-3 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter Description"
                        className="w-full border p-2 px-4 border-gray-500 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="font-medium">Allow Observations</span>
                    <input
                      type="checkbox"
                      name="allow_observations"
                      checked={!!formData.allow_observations}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tasks */}
            {!isOn && (
              <div className="mt-6">
                <h2 className="border-b text-xl border-black mb-6 font-bold">
                  Task
                </h2>

                <div className="grid gap-2 items-center w-full">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="border border-gray-300 rounded-md p-3 my-1"
                    >
                      {renderTaskFields(section)}

                      <button
                        type="button"
                        className="text-sm text-red-500 hover:underline mt-3 flex items-center"
                        onClick={() => handleDeleteSectionClick(section.id)}
                      >
                        <FaTrash />
                        <span className="ml-2">Delete Section</span>
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddSectionClick}
                    className="bg-green-600 text-white p-2 px-4 rounded-md font-medium h-10 w-40 my-5 flex items-center gap-2"
                  >
                    <PiPlusCircle /> Add Section
                  </button>
                </div>
              </div>
            )}

            {/* Schedule (always visible in your original code) */}
            {renderScheduleFields()}

            {/* messages */}
            {errorText && (
              <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700">
                {errorText}
              </div>
            )}
            {successText && (
              <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-700">
                {successText}
              </div>
            )}

            {/* submit */}
            <div className="sm:flex justify-center grid gap-2 my-5">
              <button
                type="button"
                onClick={() => navigate("/admin/audit")}
                className="text-white p-2 px-6 rounded-md font-medium bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`text-white p-2 px-6 rounded-md font-medium ${loading ? "bg-gray-400" : "bg-gray-600"

                  }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>

            {/* <div className="text-xs text-gray-500 text-center">
              Posting to: {API_BASE}/audits.json?token=***
            </div> */}
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddScheduleAudit;
