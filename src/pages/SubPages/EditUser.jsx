import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getSetupUsers, putSetupUser } from "../../api";
import SetupNavbar from "../../components/navbars/SetupNavbar";

const THEME_BG ="radial-gradient(897px at 9% 80.3%, rgb(55, 60, 245) 0%, rgba(234, 161, 15, 0.9) 100.2%)";

const UserEdit = () => {
  const { siteId, id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profilePreview, setProfilePreview] = useState(null);

  const handleProfileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getSetupUsers();
        const users = Array.isArray(res?.data) ? res.data : [];
        const foundUser = users.find((u) => String(u.id) === String(id));

        if (!foundUser) {
          toast.error("User not found");
          return navigate("/setup/users-setup");
        }

        setFormData(foundUser);
      } catch (err) {
        toast.error("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const digits = String(value || "").replace(/\D/g, "");
      return setFormData((prev) => ({ ...prev, mobile: digits.slice(0, 10) }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const boolValue = value === "Yes" ? true : value === "No" ? false : value;

    setFormData((prev) => ({
      ...prev,
      [name]: boolValue,
    }));
  };

  const updateStatus = (status) => {
    setFormData((prev) => ({
      ...prev,
      user_status: status,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await putSetupUser(id, formData);
      toast.success("User updated successfully");
      navigate(`/setup/users-details/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading user details...
      </div>
    );

  const {
    firstname,
    lastname,
    email,
    mobile,
    user_status,
    email_1,
    landline_number,
    intercom_number,
    user_address,
    user_sites,
    user_phase,
    gst_number,
    pan_number,
    building,
    floor,
    unit,
    full_unit_name,
    is_downloaded,
    user_type,
    created_at,
    updated_at,
  } = formData;

  return (
    <section className="flex min-h-screen">
      <SetupNavbar />

      <div className="flex-1 p-10">
        <div className="bg-white/95 backdrop-blur shadow-xl rounded-2xl border border-white/40 overflow-hidden">
          <div className="px-8 py-5 text-white" style={{ background: THEME_BG }}>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition"
              >
                Back
              </button>
              <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold">
                Edit User
              </h1>
            </div>
          </div>

          <div className="p-8">
            <div className="flex justify-center mb-10">
              <div className="flex flex-col items-center">
                <div className="w-[140px] h-[140px] rounded-full bg-white border-4 border-indigo-300 shadow-lg overflow-hidden">
                  <img
                    src={
                      profilePreview ||
                      formData.profile_picture ||
                      "https://www.pngitem.com/pimgs/m/137-1370051_avatar-generic-avatar-hd-png-download.png"
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("profileUpload")?.click()
                  }
                  className="text-3xl mt-3 text-indigo-600 hover:text-indigo-800 transition"
                >
                  📷
                </button>

                <input
                  type="file"
                  id="profileUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileUpload}
                />
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-10">
              <Section title="Basic Information">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <Grid3>
                    <InputBox
                      label="First Name"
                      name="firstname"
                      value={firstname}
                      onChange={handleChange}
                    />
                    <InputBox
                      label="Last Name"
                      name="lastname"
                      value={lastname}
                      onChange={handleChange}
                    />
                    <InputBox
                      label="Email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      type="email"
                    />
                    <InputBox
                      label="Mobile"
                      name="mobile"
                      value={mobile}
                      onChange={handleChange}
                    />

                    <div className="md:col-span-1">
                      <span className="text-base text-gray-900">Status</span>
                      <div className="border p-3 w-full rounded-lg mt-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200">
                        <div className="flex items-center gap-4">

                          <button
                            type="button"
                            onClick={() => updateStatus(true)}
                            className={`px-5 py-0 rounded-lg border text-sm font-medium transition
                              ${
                                user_status
                                  ? "bg-green-600 text-white border-green-600"
                                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                              }`}
                          >
                            Active
                          </button>

                          <button
                            type="button"
                            onClick={() => updateStatus(false)}
                            className={`px-5 py-0 rounded-lg border text-sm font-medium transition
                              ${
                                user_status === false
                                  ? "bg-red-600 text-white border-red-600"
                                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                              }`}
                          >
                            Inactive
                          </button>
                        </div>
                      </div>
                    </div>

                  </Grid3>
                </div>
              </Section>

              <Section title="Contact Details">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <Grid2>
                    <InputBox
                      label="Alternate Email"
                      name="email_1"
                      value={email_1}
                      onChange={handleChange}
                    />
                    <InputBox
                      label="Landline"
                      name="landline_number"
                      value={landline_number}
                      onChange={handleChange}
                    />
                    <InputBox
                      label="Intercom"
                      name="intercom_number"
                      value={intercom_number}
                      onChange={handleChange}
                    />
                    <InputBox
                      label="Address"
                      name="user_address"
                      value={user_address}
                      onChange={handleChange}
                    />
                  </Grid2>
                </div>
              </Section>

              <Section title="Other Details">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <Grid2>
                    <Read
                      label="Ownership Type"
                      value={user_sites?.[0]?.ownership_type}
                    />
                    <Read label="Phase" value={user_phase} />

                    <InputBox
                      label="GST Number"
                      name="gst_number"
                      value={gst_number}
                      onChange={handleChange}
                    />
                    <InputBox
                      label="PAN Number"
                      name="pan_number"
                      value={pan_number}
                      onChange={handleChange}
                    />

                    <Read label="Building" value={building?.name} />
                    <Read label="Floor" value={floor?.name} />
                    <Read label="Unit" value={unit?.name} />
                    <Read label="Full Unit Name" value={full_unit_name} />
                  </Grid2>
                </div>
              </Section>

              <Section title="App Information">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <Grid2>
                    <SelectBox
                      label="App Downloaded"
                      name="is_downloaded"
                      value={is_downloaded ? "Yes" : "No"}
                      onChange={handleSelectChange}
                      options={["Yes", "No"]}
                    />
                    <InputBox
                      label="User Type"
                      name="user_type"
                      value={user_type}
                      onChange={handleChange}
                    />
                  </Grid2>
                </div>
              </Section>

              <Section title="Record Information">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <Grid2>
                    <Read label="Created On" value={created_at} />
                    <Read label="Updated On" value={updated_at} />
                  </Grid2>
                </div>
              </Section>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-5 py-2 border rounded-lg bg-white text-gray-700 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const InputBox = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="border p-3 w-full rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
    />
  </div>
);

const SelectBox = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border p-3 w-full rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

const Read = ({ label, value }) => (
  <div className="bg-white p-3 rounded-lg border">
    <label className="text-xs text-gray-500">{label}</label>
    <p className="font-medium text-gray-800">{value || "N/A"}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
    {children}
  </div>
);

const Grid2 = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
);

const Grid3 = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{children}</div>
);

export default UserEdit;
