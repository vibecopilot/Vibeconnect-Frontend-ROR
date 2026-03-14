import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SetupNavbar from "../../../components/navbars/SetupNavbar";
import {
  getSetupUsers,
  addUserToAnotherFlat,
  putSetupUser,
  updateUserAdminApproval,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";

const UserSetupDetails = () => {
  const { siteId, id } = useParams();
  const [user, setUser] = useState(null);
  const [showAddFlatModal, setShowAddFlatModal] = useState(false);
  const navigate = useNavigate();
  const token = getItemInLocalStorage("TOKEN");

  const handleAdminApproval = async (status) => {
    try {
      const payload = {
        user_status: true,
        is_admin_approved: status,
      };

      await updateUserAdminApproval(id, payload, token);

      toast.success(status ? "User Approved Successfully" : "User Rejected");

      fetchUserDetails(); // refresh user data
    } catch (error) {
      console.error(error);
      toast.error("Failed to update approval");
    }
  };

  const [profilePreview, setProfilePreview] = useState(null);

  const handleProfileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePreview(URL.createObjectURL(file));
  };

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

  const updateStatus = async (status) => {
    try {
      const updatedUser = { ...(user || {}), user_status: status };
      setUser(updatedUser);
      await putSetupUser(id, updatedUser);
      toast.success(status ? "User Activated" : "User Deactivated");
    } catch (err) {
      toast.error("Failed to update status");
      console.log(err);
    }
  };

  const [addFlatForm, setAddFlatForm] = useState({
    site: siteId || "",
    building: "",
    unit: "",
    tower: "",
    flatNumber: "",
    floor: "",
    ownershiptype: "",
    occupied: "",
    membershiptype: "Primary",
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
    if (!addFlatForm.floor) return toast.error("Please select a Floor");
    if (!addFlatForm.flatNumber) return toast.error("Please select a Unit");

    const payload = {
      user_id: id,
      tower: addFlatForm.tower,
      floor: addFlatForm.floor,
      resident_type: addFlatForm.residentType,
      lives_here: addFlatForm.livesHere === "Yes",
      allow_fitout: addFlatForm.allowFitout,
      status: addFlatForm.status,
      is_primary: addFlatForm.isPrimary === "Yes",
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

        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-white font-semibold">
            Loading user details...
          </p>
        </main>
      </div>
    );
  }

  return (
    <>
      <section className="flex flex-col md:flex-row min-h-screen">
        <SetupNavbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-auto">
          <div className="w-full bg-white/95 backdrop-blur shadow-xl rounded-2xl border border-white/40 p-6 sm:p-8">
            <div
              className="text-white text-xl font-bold py-4 text-center rounded-t-xl -mx-6 -mt-6 mb-6 sm:-mx-8 sm:-mt-8"
              style={{
                background:
                  "radial-gradient(897px at 9% 80.3%, rgb(55, 60, 245) 0%, rgba(234, 161, 15, 0.9) 100.2%)",
              }}
            >
              User Details
            </div>

            <div className="flex items-center justify-between mb-8">
              <button
                type="button"
                onClick={() => navigate("/setup/users-setup")}
                className="px-3 py-2 text-sm border border-gray-300 text-black bg-white rounded-lg hover:bg-gray-100 transition"
              >
                Back
              </button>

              <button
                type="button"
                onClick={openAddFlatModal}
                className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Add To Another Unit
              </button>
            </div>

            <div className="flex justify-center mb-10">
              <div className="flex flex-col items-center">
                <div className="w-[140px] h-[140px] rounded-full bg-indigo-100 border-4 border-indigo-400/50 shadow-md overflow-hidden">
                  <img
                    src={
                      profilePreview ||
                      user.profile_picture ||
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

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <InfoBox label="First Name" value={user.firstname} />
                <InfoBox label="Last Name" value={user.lastname} />
                <InfoBox label="Email" value={user.email} />
                <InfoBox label="Mobile" value={user.mobile} />

                <div className="bg-[#F9FAFB] p-4 rounded-lg shadow-sm">
                  <strong>Status:</strong>
                  <div className="mt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => updateStatus(true)}
                      className={`px-2 py-1.5 text-sm rounded-lg border font-medium
                        ${
                          user.user_status
                            ? "bg-green-600 text-white border-green-700"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      Active
                    </button>

                    <button
                      type="button"
                      onClick={() => updateStatus(false)}
                      className={`px-2 py-1.5 text-sm rounded-lg border font-medium
                        ${
                          !user.user_status
                            ? "bg-red-600 text-white border-red-700"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
                <div className="bg-[#F9FAFB] p-4 rounded-lg shadow-sm">
                  <strong>Approvals:</strong>

                  {/* Show Approve / Reject buttons only if admin approval is pending */}
                  {user.is_admin_approved === null ? (
                    <div className="mt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleAdminApproval(true)}
                        className="px-3 py-1.5 text-sm rounded-lg border font-medium bg-green-600 text-white border-green-700 hover:bg-green-700"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdminApproval(false)}
                        className="px-3 py-1.5 text-sm rounded-lg border font-medium bg-red-600 text-white border-red-700 hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <p
                      className={`mt-2 font-medium ${
                        user.is_admin_approved
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {user.is_admin_approved ? "Approved" : "Rejected"}
                    </p>
                  )}
                </div>
              </div>
            </section>

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

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                Other Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InfoBox
                  label="Ownership Type"
                  value={user.user_sites?.[0]?.ownership_type}
                />
                <InfoBox label="Phase" value={user.user_phase} />
                <InfoBox label="GST Number" value={user.gst_number} />
                <InfoBox label="PAN Number" value={user.pan_number} />
                <InfoBox label="Building" value={user.building?.name} />
                <InfoBox label="Floor" value={user.floor?.name} />
                <InfoBox label="Unit" value={user.unit?.name} />
                <InfoBox label="Full Unit Name" value={user.full_unit_name} />
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                App
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InfoBox
                  label="App Downloaded"
                  value={user.is_downloaded ? "Yes" : "No"}
                />
                <InfoBox label="User Type" value={user.user_type} />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                Record Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InfoBox
                  label="Created On"
                  value={
                    user.created_at
                      ? new Date(user.created_at).toLocaleString()
                      : "N/A"
                  }
                />
                <InfoBox
                  label="Updated On"
                  value={
                    user.updated_at
                      ? new Date(user.updated_at).toLocaleString()
                      : "N/A"
                  }
                />
              </div>
            </section>
          </div>
        </main>
      </section>

      {showAddFlatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={closeAddFlatModal}
          />

          <div className="relative z-10 w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-xl overflow-auto">
            <div
              className="text-white text-lg font-bold py-3 text-center rounded-t-2xl"
              style={{
                background:
                  "radial-gradient(897px at 9% 80.3%, rgb(55, 60, 245) 0%, rgba(234, 161, 15, 0.9) 100.2%)",
              }}
            >
              Add to Another Unit
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-b">
              <p className="text-sm text-gray-600">
                Fill the details to add this user to another unit.
              </p>
              <button
                onClick={closeAddFlatModal}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFlatSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInputOrSelect(
                  "Tower",
                  "tower",
                  "select",
                  addFlatForm,
                  handleFormChange,
                  [
                    { value: "", label: "Select" },
                    { value: "VC Tower", label: "VC Tower" },
                  ],
                )}

                {renderInputOrSelect(
                  "Floor",
                  "floor",
                  "select",
                  addFlatForm,
                  handleFormChange,
                  [
                    { value: "", label: "Select" },
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3" },
                  ],
                  addFlatForm.tower === "",
                )}

                {renderInputOrSelect(
                  "Unit Number",
                  "flatNumber",
                  "select",
                  addFlatForm,
                  handleFormChange,
                  [
                    { value: "", label: "Select" },
                    { value: "101", label: "101" },
                    { value: "102", label: "102" },
                    { value: "201", label: "201" },
                    { value: "202", label: "202" },
                  ],
                  addFlatForm.floor === "",
                )}

                {renderInputOrSelect(
                  "Ownership Type",
                  "ownershiptype",
                  "select",
                  addFlatForm,
                  handleFormChange,
                  [
                    { value: "", label: "Select" },
                    { value: "Owner", label: "Owner" },
                    { value: "Tenant", label: "Tenant" },
                    { value: "Builder", label: "Builder" },
                  ],
                )}

                {renderInputOrSelect(
                  "Occupied",
                  "occupied",
                  "select",
                  addFlatForm,
                  handleFormChange,
                  [
                    { value: "", label: "Select" },
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                  ],
                )}

                {renderInputOrSelect(
                  "Status",
                  "status",
                  "select",
                  addFlatForm,
                  handleFormChange,
                  [
                    { value: "", label: "Select" },
                    { value: "Approved", label: "Approved" },
                    { value: "Pending", label: "Pending" },
                    { value: "Rejected", label: "Rejected" },
                  ],
                )}

                {renderInputOrSelect(
                  "Membership Type",
                  "membershiptype",
                  "select",
                  addFlatForm,
                  handleFormChange,
                  [
                    { value: "Primary", label: "Primary" },
                    { value: "Secondary", label: "Secondary" },
                  ],
                )}

                {renderInputOrSelect(
                  "GST Number",
                  "gstNumber",
                  "text",
                  addFlatForm,
                  handleFormChange,
                )}
                {renderInputOrSelect(
                  "PAN Number",
                  "panNumber",
                  "text",
                  addFlatForm,
                  handleFormChange,
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeAddFlatModal}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-100"
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

const InfoBox = ({ label, value, color = "text-gray-700" }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow transition">
    <strong>{label}:</strong>
    <p className={`mt-1 ${color}`}>{value ?? "N/A"}</p>
  </div>
);

const renderInputOrSelect = (
  label,
  name,
  type,
  form,
  onChange,
  options = [],
  disabled = false,
) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {type === "select" ? (
        <select
          name={name}
          value={form[name] ?? ""}
          onChange={onChange}
          disabled={disabled}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          name={name}
          value={form[name] ?? ""}
          onChange={onChange}
          placeholder={label}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      )}
    </div>
  );
};

export default UserSetupDetails;
