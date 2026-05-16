import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import { getSetupUsers, putSetupUser } from "../../api";

const THEME_BG =
  "radial-gradient(897px at 9% 80.3%, rgb(55, 60, 245) 0%, rgba(234, 161, 15, 0.9) 100.2%)";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile image preview
  const [profileImage, setProfileImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    status: "",
    userType: "",
    occupancy_type: "",
    birth_date: "",
    lives_here: "",
    membershipType: "Primary",
    panCard: "",
    gstin: "",
    alternateAddress: "",
    anniversary: "",
    alternateEmail: "",
    intercomNumber: "",
    landlineNumber: "",
    evConnection: "",
    is_occupied: "",
    user_status: true,
    profile_picture: null,
  });

  // ── Load user data ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getSetupUsers();
        const users = Array.isArray(res?.data) ? res.data : [];
        const u = users.find((u) => String(u.id) === String(id));

        if (!u) {
          toast.error("User not found");
          return navigate("/setup/users-setup");
        }

        // Map API fields → our formData shape
        setFormData({
          title: u.title || "",
          firstname: u.firstname || "",
          lastname: u.lastname || "",
          email: u.email || "",
          mobile: u.mobile || "",
          status: u.status || "",
          userType: u.user_type || "",
          occupancy_type: u.user_sites?.[0]?.ownership || "",
          birth_date: u.birth_date ? u.birth_date.slice(0, 10) : "",
          lives_here:
            u.lives_here === true
              ? "true"
              : u.lives_here === false
              ? "false"
              : "",
          membershipType: u.user_sites?.[0]?.ownership_type || "Primary",
          panCard: u.pan_number || "",
          gstin: u.gst_number || "",
          alternateAddress: u.user_address || "",
          anniversary: u.anniversary ? u.anniversary.slice(0, 10) : "",
          alternateEmail: u.email_1 || "",
          intercomNumber: u.intercom_number || "",
          landlineNumber: u.landline_number || "",
          evConnection: u.ev_connection || "",
          is_occupied: u.is_occupied || "",
          user_status: u.user_status ?? true,
          profile_picture: u.profile_picture || null,
        });

        // If there's an existing profile picture URL, show it
        if (u.profile_picture && typeof u.profile_picture === "string") {
          setProfileImage(u.profile_picture);
        }
      } catch (err) {
        toast.error("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      return;
    }

    if (name === "mobile") {
      const digits = value.replace(/\D/g, "");
      return setFormData((prev) => ({
        ...prev,
        mobile: digits.slice(0, 10),
      }));
    }

    if (name === "email") {
      return setFormData((prev) => ({ ...prev, email: value.trim() }));
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const livesHereValue =
        formData.lives_here === "true" || formData.lives_here === true;

      const isAdmin = [
        "pms_admin",
        "security_guard",
        "employee",
        "pms_technician",
      ].includes(formData.userType?.toLowerCase());

      const sendData = new FormData();

      const userFields = {
        title: formData.title,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        mobile: formData.mobile,
        user_type: formData.userType || "user",
        user_status: formData.user_status,
        is_admin_approved: isAdmin ? true : null,
        birth_date: formData.birth_date,
        anniversary: formData.anniversary,
        email_1: formData.alternateEmail,
        landline_number: formData.landlineNumber,
        intercom_number: formData.intercomNumber,
        pan_number: formData.panCard,
        gst_number: formData.gstin,
        ev_connection: formData.evConnection,
        user_address: formData.alternateAddress,
        membership_type: formData.membershipType,
        lives_here: livesHereValue,
        occupancy_type: formData.occupancy_type,
        is_occupied: formData.is_occupied,
        status: formData.status,
      };

      Object.entries(userFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          sendData.append(`user[${key}]`, String(value));
        }
      });

      if (formData.profile_picture instanceof File) {
        sendData.append("user[profile_picture]", formData.profile_picture);
      }

      await putSetupUser(id, sendData);
      toast.success("User updated successfully!");
      navigate(`/setup/users-details/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err?.response?.data?.error || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading user details...
      </div>
    );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <section className="w-full p-6 flex bg-gray-50 min-h-screen">
      <SetupNavbar />

      <div className="w-full p-6">
        <form
          autoComplete="off"
          onSubmit={handleUpdate}
          className="w-full bg-white shadow-md rounded-2xl border p-6 sm:p-8"
        >
          {/* Header */}
          <div
            className="text-white text-xl font-bold py-4 text-center rounded-t-xl flex items-center justify-between px-6"
            style={{ background: THEME_BG }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition text-sm font-medium"
            >
              ← Back
            </button>
            <span>Edit User Details</span>
            <span className="w-24" />
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">
              Primary &amp; Contact Info
            </h3>

            {/* Profile + basic fields */}
            <div className="flex flex-wrap items-start">
              {/* Profile picture */}
              <div className="w-full sm:w-[150px] text-center mb-6 sm:mb-0">
                <div className="w-[120px] h-[120px] bg-indigo-100 rounded-full mx-auto overflow-hidden border-4 border-indigo-400/50 shadow-md">
                  <img
                    src={
                      profileImage ||
                      "https://www.pngitem.com/pimgs/m/137-1370051_avatar-generic-avatar-hd-png-download.png"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover mx-auto block"
                  />
                </div>

                <button
                  type="button"
                  className="text-2xl mt-2 text-indigo-600 hover:text-indigo-800 transition"
                  onClick={() =>
                    document.getElementById("profileUpload").click()
                  }
                >
                  📷
                </button>

                <input
                  type="file"
                  id="profileUpload"
                  name="profile_picture"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.files?.[0]) {
                      setProfileImage(
                        URL.createObjectURL(e.target.files[0])
                      );
                    }
                  }}
                />
              </div>

              {/* Name / email / mobile / password row */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ml-0 sm:ml-8">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Title
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select Title</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                </div>

                {/* First / Last name */}
                {[
                  { label: "First Name *", name: "firstname" },
                  { label: "Last Name *", name: "lastname" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-sm font-medium block mb-1">
                      {f.label}
                    </label>
                    <input
                      type="text"
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                ))}

                {/* Email */}
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="new-email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Mobile *
                  </label>
                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                {/* User Status */}
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Status
                  </label>
                  <div className="flex items-center gap-3 border border-gray-300 rounded-md px-3 py-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, user_status: true }))
                      }
                      className={`px-4 py-1 rounded-md border text-sm font-medium transition ${
                        formData.user_status
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, user_status: false }))
                      }
                      className={`px-4 py-1 rounded-md border text-sm font-medium transition ${
                        formData.user_status === false
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tower / Floor / Unit / Ownership row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 border-t pt-4">
              {/* Ownership Type */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  Ownership Type *
                </label>
                <select
                  name="occupancy_type"
                  value={formData.occupancy_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="" disabled>
                    Select Ownership Type
                  </option>
                  <option value="owner">Owner</option>
                  <option value="tenant">Tenant</option>
                </select>
              </div>

              {/* Approval Status */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  Approval Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="pending">Pending</option>
                  <option value="complete">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Occupied */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  Occupied
                </label>
                <select
                  name="is_occupied"
                  value={formData.is_occupied}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Membership Type */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  Membership Type
                </label>
                <select
                  name="membershipType"
                  value={formData.membershipType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                </select>
              </div>

              {/* User Type */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  User Type
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select</option>
                  <option value="pms_admin">Admin</option>
                  <option value="pms_technician">Technician</option>
                  <option value="security_guard">Security Guard</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              {/* Lives Here */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  Lives Here
                </label>
                <select
                  name="lives_here"
                  value={formData.lives_here}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            {/* Alternate Address */}
            <div className="mt-4">
              <label className="text-sm font-medium block mb-1">
                Alternate Address{" "}
                <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                name="alternateAddress"
                value={formData.alternateAddress}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full h-20 p-3"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t border-gray-300 p-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">
              Additional Info &amp; Utilities
              <span className="text-gray-400 text-sm ml-2">(Optional)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Birth Date", name: "birth_date", type: "date" },
                { label: "Anniversary", name: "anniversary", type: "date" },
                {
                  label: "Alternate Email",
                  name: "alternateEmail",
                  type: "email",
                },
                { label: "Intercom Number", name: "intercomNumber" },
                { label: "Landline Number", name: "landlineNumber" },
                { label: "PAN Card", name: "panCard" },
                { label: "GSTIN", name: "gstin" },
                {
                  label: "EV Connection",
                  name: "evConnection",
                  type: "select",
                  options: [
                    { value: "", label: "Select EV Connection" },
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ],
                },
              ].map((f) => (
                <div key={f.name}>
                  <label className="text-sm font-medium block mb-1">
                    {f.label}
                  </label>

                  {f.type === "select" ? (
                    <select
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {f.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type || "text"}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end px-6 py-4 rounded-b-xl border-t border-gray-200 gap-3">
            <button
              type="button"
              className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-900"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UserEdit;