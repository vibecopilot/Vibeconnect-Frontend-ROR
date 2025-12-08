import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SetupNavbar from "../../../components/navbars/SetupNavbar";
import { getSetupUsers, addUserToAnotherFlat, putSetupUser } from "../../../api"; 

const UserSetupDetails = () => {
  const { siteId, id } = useParams();
  const [user, setUser] = useState(null);
  const [showAddFlatModal, setShowAddFlatModal] = useState(false);
  const navigate = useNavigate();

  /* ===========================
        FETCH USER
  ============================ */
  const fetchUserDetails = useCallback(async () => {
    try {
      const res = await getSetupUsers();

      if (!res || !res.data) {
        toast.error("Failed to fetch users");
        return;
      }

      const foundUser = res.data.find((u) => String(u.id) === String(id));

      if (foundUser) {
        setUser(foundUser);
      } else {
        toast.error("User not found");
        navigate("/setup/users-setup");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching user details");
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);


  /* ===========================
        UPDATE STATUS
  ============================ */
  const updateStatus = async (status) => {
    try {
      // UI Update
      setUser((prev) => ({ ...prev, user_status: status }));

      // API Update (you can change API if yours is different)
      await putSetupUser(id, { ...user, user_status: status });

      toast.success(status ? "User Activated" : "User Deactivated");
    } catch (err) {
      toast.error("Failed to update status");
      console.log(err);
    }
  };


  /* ===========================
        ADD TO ANOTHER FLAT
  ============================ */
  const [addFlatForm, setAddFlatForm] = useState({
    tower: "",
    flatNumber: "",
    residentType: "Owner",
    livesHere: "Yes",
    allowFitout: "",
    status: "",
    isPrimary: "",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAddFlatForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAddFlatModal = () => {
    setAddFlatForm((prev) => ({
      ...prev,
      tower: user?.building?.name || "",
      flatNumber: user?.unit?.name || "",
      landlineNumber: user?.landline_number || "",
      intercomNumber: user?.intercom_number || "",
      gstNumber: user?.gst_number || "",
      panNumber: user?.pan_number || "",
    }));
    setShowAddFlatModal(true);
  };

  const closeAddFlatModal = () => setShowAddFlatModal(false);

  const handleAddFlatSubmit = async (e) => {
    e.preventDefault();

    if (!addFlatForm.tower) return toast.error("Please select a Tower");
    if (!addFlatForm.flatNumber) return toast.error("Please enter a Flat Number");

    const payload = {
      user_id: id,
      tower: addFlatForm.tower,
      flat_number: addFlatForm.flatNumber,
      resident_type: addFlatForm.residentType,
      lives_here: addFlatForm.livesHere === "Yes",
      allow_fitout: addFlatForm.allowFitout,
      status: addFlatForm.status,
      is_primary: addFlatForm.isPrimary,
      landline_number: addFlatForm.landlineNumber,
      intercom_number: addFlatForm.intercomNumber,
      gst_number: addFlatForm.gstNumber,
      pan_number: addFlatForm.panNumber,
    };

    try {
      await addUserToAnotherFlat(payload);
      toast.success("Successfully added to another flat");
      setShowAddFlatModal(false);
      fetchUserDetails();
    } catch (err) {
      toast.error("Failed to add to another flat");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex">
        <aside className="hidden md:flex w-64 bg-white border-r p-4">
          <SetupNavbar />
        </aside>
        <main className="flex-1 flex items-center justify-center bg-gray-100">
          <p className="text-lg text-gray-500">Loading user details...</p>
        </main>
      </div>
    );
  }

  return (
    <>
      {/* MAIN PAGE */}
      <section className="flex flex-col md:flex-row bg-[#F9FAFB] min-h-screen">
        <SetupNavbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-auto">
          <div className="w-full bg-white shadow-md rounded-2xl border p-6 sm:p-8">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">User Details</h1>
                <p className="text-gray-600 text-sm">View complete information of this user</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="px-3 text-sm border text-gray-700 bg-white rounded-lg hover:bg-gray-100"
                >
                  ← Back
                </button>

                <button
                  onClick={openAddFlatModal}
                  className="px-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-800"
                >
                  Add To Another Flat
                </button>
              </div>
            </div>

            {/* BASIC INFO */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <InfoBox label="First Name" value={user.firstname} />
                <InfoBox label="Last Name" value={user.lastname} />
                <InfoBox label="Email" value={user.email} />
                <InfoBox label="Mobile" value={user.mobile} />

                {/* STATUS BUTTONS */}
                <div className="bg-[#F9FAFB] p-4 rounded-lg shadow-sm">
                  <strong>Status:</strong>
                  <div className="mt-2 flex gap-3">

                    <button
                      // onClick={() => updateStatus(true)}
                      className={`px-2 py-1.5 text-sm rounded-lg border font-medium
                        ${user.user_status
                          ? "bg-green-600 text-white border-green-700"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      Active
                    </button>

                    <button
                      // onClick={() => updateStatus(false)}
                      className={`px-2 py-1.5 text-sm rounded-lg border font-medium
                        ${!user.user_status
                          ? "bg-red-600 text-white border-red-700"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>

                <InfoBox label="Lives Here" value={user.lives_here ? "Yes" : "No"} />
              </div>
            </section>

            {/* CONTACT DETAILS */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InfoBox label="Alternate Email" value={user.email_1} />
                <InfoBox label="Landline" value={user.landline_number} />
                <InfoBox label="Intercom" value={user.intercom_number} />
                <InfoBox label="Alternate Address" value={user.user_address} />
              </div>
            </section>

            {/* BUSINESS INFO */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                Business / Site Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InfoBox label="Ownership Type" value={user.user_sites?.[0]?.ownership_type} />
                <InfoBox label="Phase" value={user.user_phase} />
                <InfoBox label="GST Number" value={user.gst_number} />
                <InfoBox label="PAN Number" value={user.pan_number} />

                <InfoBox label="Building" value={user.building?.name} />
                <InfoBox label="Floor" value={user.floor?.name} />
                <InfoBox label="Unit" value={user.unit?.name} />
                <InfoBox label="Full Unit Name" value={user.full_unit_name} />
              </div>
            </section>

            {/* APP INFO */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                App / Access Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InfoBox label="App Downloaded" value={user.is_downloaded ? "Yes" : "No"} />
                <InfoBox label="User Type" value={user.user_type} />
              </div>
            </section>

            {/* RECORD INFO */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                Record Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InfoBox
                  label="Created On"
                  value={user.created_at ? new Date(user.created_at).toLocaleString() : "N/A"}
                  
                />
                <InfoBox
                  label="Updated On"
                  value={user.updated_at ? new Date(user.updated_at).toLocaleString() : "N/A"}
                />
              </div>
            </section>
          </div>
        </main>
      </section>


      {/* ADD FLAT MODAL */}
      {showAddFlatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={closeAddFlatModal}
          />

          <div className="relative z-10 w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-xl overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Add to Another Flat</h3>
              <button onClick={closeAddFlatModal} className="text-gray-500 hover:text-gray-800">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFlatSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInputOrSelect("Tower", "tower", "select", addFlatForm, handleFormChange, [
                  { value: "", label: "Select" },
                  { value: "VC Tower", label: "VC Tower" },
                ])}

                {renderInputOrSelect("Flat Number", "flatNumber", "text", addFlatForm, handleFormChange)}

                {renderInputOrSelect("Resident Type", "residentType", "select", addFlatForm, handleFormChange, [
                  { value: "Owner", label: "Owner" },
                  { value: "Tenant", label: "Tenant" },
                  { value: "Other", label: "Other" },
                ])}

                {renderInputOrSelect("Lives Here", "livesHere", "select", addFlatForm, handleFormChange, [
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ])}

                {renderInputOrSelect("Allow Fitout", "allowFitout", "select", addFlatForm, handleFormChange, [
                  { value: "", label: "Select" },
                  { value: "Allowed", label: "Allowed" },
                  { value: "Not Allowed", label: "Not Allowed" },
                ])}

                {renderInputOrSelect("Status", "status", "select", addFlatForm, handleFormChange, [
                  { value: "", label: "Select" },
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ])}

                {renderInputOrSelect("Is Primary", "isPrimary", "select", addFlatForm, handleFormChange, [
                  { value: "", label: "Select" },
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ])}

                {renderInputOrSelect("Landline Number", "landlineNumber", "text", addFlatForm, handleFormChange)}
                {renderInputOrSelect("Intercom Number", "intercomNumber", "text", addFlatForm, handleFormChange)}
                {renderInputOrSelect("GST Number", "gstNumber", "text", addFlatForm, handleFormChange)}
                {renderInputOrSelect("PAN Number", "panNumber", "text", addFlatForm, handleFormChange)}
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={closeAddFlatModal}
                  className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};


/* ===========================
      REUSABLE COMPONENTS
=========================== */

const InfoBox = ({ label, value, color = "text-gray-700" }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow transition">
    <strong>{label}:</strong>
    <p className={`mt-1 ${color}`}>{value ?? "N/A"}</p>
  </div>
);

const renderInputOrSelect = (label, name, type, form, onChange, options = []) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      {type === "select" ? (
        <select
          name={name}
          value={form[name]}
          onChange={onChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          name={name}
          value={form[name]}
          onChange={onChange}
          placeholder={label}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      )}
    </div>
  );
};

export default UserSetupDetails;
