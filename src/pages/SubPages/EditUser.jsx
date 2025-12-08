
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getSetupUsers, putSetupUser } from "../../api";
import SetupNavbar from "../../components/navbars/SetupNavbar";

const UserEdit = () => {
  const { siteId, id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getSetupUsers();
        const users = Array.isArray(res.data) ? res.data : [];
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
  }, [id]);

  // Handle normal input fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Yes/No → boolean conversion
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const boolValue = value === "Yes" ? true : value === "No" ? false : value;

    setFormData((prev) => ({
      ...prev,
      [name]: boolValue,
    }));
  };

  // Toggle user_status
  const updateStatus = (status) => {
    setFormData((prev) => ({
      ...prev,
      user_status: status,
    }));
  };

  // Submit the update
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
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading user details...
      </div>
    );

  const {
    firstname,
    lastname,
    email,
    mobile,
    user_status,
    lives_here,
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
    <section className="flex bg-gray-50 min-h-screen">
      <SetupNavbar />

      <div className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-xl border p-6">

          {/* HEADER */}
          <div className="flex justify-between mb-8">
            <h1 className="text-2xl font-bold">Edit User Details</h1>
            <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg">
              ← Back
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleUpdate} className="space-y-10">

            {/* BASIC INFORMATION */}
            <Section title="Basic Information">
              <Grid3>
                <InputBox label="First Name" name="firstname" value={firstname} onChange={handleChange} />
                <InputBox label="Last Name" name="lastname" value={lastname} onChange={handleChange} />
                <InputBox label="Email" name="email" value={email} onChange={handleChange} type="email" />
                <InputBox label="Mobile" name="mobile" value={mobile} onChange={handleChange} />

                {/* Status buttons */}
                <div className="bg-[#F9FAFB] p-4 rounded-lg">
                  <strong>Status:</strong>
                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(true)}
                      className={`px-1 py-1 rounded-lg border ${
                        user_status
                          ? "bg-green-600 text-white border-green-700"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      Active
                    </button>

                    <button
                      type="button"
                      onClick={() => updateStatus(false)}
                      className={`px-1 py-1 rounded-lg border ${
                        user_status === false
                          ? "bg-red-600 text-white border-red-700"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>

                <SelectBox
                  label="Lives Here"
                  name="lives_here"
                  value={lives_here ? "Yes" : "No"}
                  onChange={handleSelectChange}
                  options={["Yes", "No"]}
                />
              </Grid3>
            </Section>

            <hr />

            {/* CONTACT DETAILS */}
            <Section title="Contact Details">
              <Grid2>
                <InputBox label="Alternate Email" name="email_1" value={email_1} onChange={handleChange} />
                <InputBox label="Landline" name="landline_number" value={landline_number} onChange={handleChange} />
                <InputBox label="Intercom" name="intercom_number" value={intercom_number} onChange={handleChange} />
                <InputBox label="Address" name="user_address" value={user_address} onChange={handleChange} />
              </Grid2>
            </Section>

            <hr />

            {/* BUSINESS / SITE */}
            <Section title="Business / Site Info">
              <Grid2>
                <Read label="Ownership Type" value={user_sites?.[0]?.ownership_type} onChange={handleChange} />
                <Read label="Phase" value={user_phase} onChange={handleChange} />

                <InputBox label="GST Number" name="gst_number" value={gst_number} onChange={handleChange} />
                <InputBox label="PAN Number" name="pan_number" value={pan_number} onChange={handleChange} />

                <Read label="Building" value={building?.name} onChange={handleChange} />
                <Read label="Floor" value={floor?.name} onChange={handleChange}  />
                <Read label="Unit" value={unit?.name} onChange={handleChange}/>
                <Read label="Full Unit Name" value={full_unit_name} onChange={handleChange}/>
              </Grid2>
            </Section>

            <hr />

            {/* APP INFO */}
            <Section title="App Information">
              <Grid2>
                <SelectBox
                  label="App Downloaded"
                  name="is_downloaded"
                  value={is_downloaded ? "Yes" : "No"}
                  onChange={handleSelectChange}
                  options={["Yes", "No"]}
                />
                <InputBox label="User Type" name="user_type" value={user_type} onChange={handleChange} />
              </Grid2>
            </Section>

            <hr />

            {/* RECORD INFO */}
            <Section title="Record Information">
              <Grid2>
                <Read label="Created On" value={created_at} />
                <Read label="Updated On" value={updated_at} />
              </Grid2>
            </Section>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 text-white rounded-lg bg-blue-600"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
};

/* COMPONENTS */
const InputBox = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="border p-2 w-full rounded-lg"
    />
  </div>
);

const SelectBox = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border p-2 w-full rounded-lg"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const Read = ({ label, value }) => (
  <div className="bg-gray-100 p-3 rounded-lg">
    <label className="text-xs text-gray-600">{label}</label>
    <p className="font-medium">{value || "N/A"}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

const Grid2 = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Grid3 = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
);

export default UserEdit;
