import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReactDatePicker from "react-datepicker";
import Select from "react-select";
import { getGroups, getBuildings, getSetupUsers, getBroadCast, editBroadcastDetails, getBroadcastDetails } from "../../api";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaCheck } from "react-icons/fa";
import ReactQuill from "react-quill";

const EditBroadcast = () => {
  const { id } = useParams();
  const [share, setShare] = useState("all");
  const themeColor = useSelector((state) => state.theme.color);
  const siteId = getItemInLocalStorage("SITEID");

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [units, setUnits] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedOwnership, setSelectedOwnership] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    site_id: siteId,
    notice_title: "",
    notice_discription: "",
    expiry_date: "",
    user_ids: "",
    notice_image: [],
    shared: "all",
    group_id: "",
    important: false,
    group_ids: "",
    send_email: false,
  });

  const datePickerRef = useRef(null);
  const currentDate = new Date();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleExpiryDateChange = (date) => {
    setFormData((p) => ({ ...p, expiry_date: date }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((p) => ({ ...p, notice_discription: value }));
  };

  // Fetch users + buildings + existing broadcast data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, unitsRes, broadcastRes] = await Promise.all([
          getSetupUsers(),
          getBuildings(),
          getBroadcastDetails(id),
        ]);

        // --- Units ---
        setUnits(unitsRes.data || []);

        // --- Members ---
        const activeUsers = (usersRes.data || []).filter(
          (emp) => emp.user_status === true
        );

        const employeesList = activeUsers.map((emp) => ({
          id: emp.id,
          name: `${emp.firstname || ""} ${emp.lastname || ""}`.trim(),
          building_id: emp.building_id || emp.building?.id || null,
          userSites: emp.user_sites || [],
          building: emp.building || {},
        }));

        setMembers(employeesList);
        setFilteredMembers(employeesList);

        const usersFormatted = activeUsers.map((emp) => ({
          value: emp.id,
          label: `${emp.firstname || ""} ${emp.lastname || ""}`.trim(),
        }));
        setUsers(usersFormatted);

        // --- Pre-populate form from existing broadcast ---
        const broadcast = broadcastRes.data;
        if (broadcast) {
          const sharedValue = broadcast.shared || "all";
          setShare(sharedValue);

          // Pre-select members if individual
          // API returns `users` array with `user_id` field (not a flat user_ids string)
          let prefilledUserIds = "";
          if (sharedValue === "individual" && Array.isArray(broadcast.users) && broadcast.users.length > 0) {
            const existingUserIds = broadcast.users.map((u) => u.user_id);
            const preSelected = employeesList
              .filter((m) => existingUserIds.includes(m.id))
              .map((m) => ({ value: m.id, label: m.name }));
            setSelectedMembers(preSelected);
            prefilledUserIds = existingUserIds.join(",");
          }

          setFormData({
            site_id: siteId,
            notice_title: broadcast.notice_title || "",
            notice_discription: broadcast.notice_discription || "",
            expiry_date: broadcast.expiry_date
              ? new Date(broadcast.expiry_date)
              : "",
            user_ids: prefilledUserIds,
            notice_image: [],
            shared: sharedValue,
            group_id: broadcast.group_id || "",
            important: broadcast.important === true || broadcast.important === 1,
            group_ids: broadcast.group_id ? String(broadcast.group_id) : "",
            send_email: broadcast.send_email === true || broadcast.send_email === 1,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load broadcast data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Fetch groups when share === "groups"
  useEffect(() => {
    if (share === "groups") {
      fetchGroups();
    }
  }, [share]);

  const fetchGroups = async () => {
    try {
      const res = await getGroups();
      const transformedGroups = (res.data || []).map((group) => ({
        value: group.id,
        label: group.group_name,
      }));
      setGroups(transformedGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  // Also fetch groups on initial load if the broadcast is shared with groups
  useEffect(() => {
    fetchGroups();
  }, []);

  const handleFilter = () => {
    const filtered = members.filter((member) => {
      const buildingMatch =
        !selectedUnit ||
        Number(member.building_id) === Number(selectedUnit);

      const ownershipMatch =
        !selectedOwnership ||
        member.userSites.some(
          (site) =>
            site.ownership?.toLowerCase() === selectedOwnership.toLowerCase()
        );

      return buildingMatch && ownershipMatch;
    });

    if (filtered.length === 0) {
      toast.error("No users found with the selected filters");
      return;
    }

    setFilteredMembers(filtered);
    toast.success(`${filtered.length} users found`);
  };

  const handleSelectChange = (selectedOptions) => {
    if (!selectedOptions) return;

    if (selectedOptions.some((option) => option.value === "select_all")) {
      const allFilteredOptions = filteredMembers.map((member) => ({
        value: member.id,
        label: member.name,
      }));
      setSelectedMembers(allFilteredOptions);
      setFormData((p) => ({
        ...p,
        user_ids: allFilteredOptions.map((u) => u.value).join(","),
      }));
    } else {
      setSelectedMembers(selectedOptions);
      setFormData((p) => ({
        ...p,
        user_ids: selectedOptions.map((opt) => opt.value).join(","),
      }));
    }
  };

  const handleFileChange = (files, fieldName) => {
    setFormData((p) => ({ ...p, [fieldName]: files }));
  };

  const handleSelectGroupChange = (selectedOptions) => {
    const groupIdsString = selectedOptions
      ? selectedOptions.map((option) => option.value).join(",")
      : "";
    setFormData((p) => ({ ...p, group_ids: groupIdsString }));
  };

  const setShareTab = (value) => {
    setShare(value);
    setSelectedMembers([]);
    setFormData((p) => ({
      ...p,
      shared: value,
      user_ids: value === "individual" ? p.user_ids : "",
      group_ids: value === "groups" ? p.group_ids : "",
    }));
  };

  const handleUpdateBroadCast = async () => {
    if (formData.notice_title === "" || formData.expiry_date === "") {
      return toast.error("Please Enter Title & Expiry Date");
    }

    try {
      toast.loading("Updating Broadcast Please Wait!", { id: "broadcast" });

      const formDataSend = new FormData();
      formDataSend.append("notice[site_id]", formData.site_id);
      formDataSend.append("notice[notice_title]", formData.notice_title);
      formDataSend.append("notice[notice_discription]", formData.notice_discription);
      formDataSend.append(
        "notice[expiry_date]",
        formData.expiry_date instanceof Date
          ? formData.expiry_date.toISOString()
          : formData.expiry_date
      );
      formDataSend.append("notice[important]", formData.important ? "1" : "0");
      formDataSend.append("notice[send_email]", formData.send_email ? "1" : "0");

      if (share === "all") {
        const allUserIds = users.map((user) => user.value).join(",");
        formDataSend.append("notice[shared]", "all");
        formDataSend.append("notice[user_ids]", allUserIds);
      } else if (share === "individual") {
        formDataSend.append("notice[shared]", "individual");
        formDataSend.append("notice[user_ids]", formData.user_ids);
      } else if (share === "groups") {
        formDataSend.append("notice[shared]", "groups");
        formDataSend.append("notice[group_id]", formData.group_ids);
      }

      (formData.notice_image || []).forEach((file) => {
        if (file instanceof File) {
          formDataSend.append("attachfiles[]", file);
        }
      });

      const result = await editBroadcastDetails(id, formDataSend);
      toast.dismiss("broadcast");
      toast.success("Broadcast Updated Successfully");
      navigate("/communication/broadcast");
    } catch (error) {
      console.error(error);
      toast.dismiss("broadcast");
      toast.error("Failed to update broadcast");
    }
  };

  if (loading) {
    return (
      <section className="flex">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="w-full flex items-center justify-center h-screen">
          <p className="text-gray-500 text-lg">Loading broadcast data...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex justify-center">
          <div className="md:mx-20 my-5 mb-10 md:border p-2 md:px-2 rounded-lg w-full">
            <h2
              style={{ background: themeColor }}
              className="text-center text-xl font-bold p-2 mb-2 rounded-md text-white"
            >
              Edit Broadcast
            </h2>
            <h2 className="border-b text-xl border-gray-400 mb-6 font-medium">
              Communication Info
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="font-semibold">Title :</label>
                <input
                  type="text"
                  name="notice_title"
                  value={formData.notice_title}
                  onChange={handleChange}
                  placeholder="Enter Title"
                  className="border p-2 rounded-md border-gray-400 placeholder:text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold">Description :</label>
                <ReactQuill
                  theme="snow"
                  value={formData.notice_discription}
                  onChange={handleDescriptionChange}
                  placeholder="Enter Description"
                  className="bg-white"
                  style={{ minHeight: "120px", minWidth: "120px" }}
                />
              </div>

              <div className="grid grid-cols-2 items-end gap-4">
                <div className="flex flex-col">
                  <p className="font-medium">Expire on</p>
                  <ReactDatePicker
                    selected={formData.expiry_date}
                    onChange={handleExpiryDateChange}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy h:mm aa"
                    placeholderText="Select Date & Time"
                    ref={datePickerRef}
                    className="border border-gray-400 w-full p-2 rounded-md"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id="imp"
                    checked={formData.important === true}
                    onChange={() =>
                      setFormData((p) => ({ ...p, important: !p.important }))
                    }
                  />
                  <label htmlFor="imp">Mark as Important</label>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id="email"
                    checked={formData.send_email === true}
                    onChange={() =>
                      setFormData((p) => ({ ...p, send_email: !p.send_email }))
                    }
                  />
                  <label htmlFor="email">Send Email</label>
                </div>
              </div>

              <div>
                <h2 className="border-b border-black my-5 text-lg font-semibold">
                  Share With
                </h2>

                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-row gap-2 w-full font-semibold p-2">
                    {["all", "individual", "groups"].map((tab) => (
                      <h2
                        key={tab}
                        className={`p-1 ${
                          share === tab ? "bg-black text-white" : ""
                        } rounded-full px-6 cursor-pointer border-2 border-black capitalize`}
                        onClick={() => setShareTab(tab)}
                      >
                        {tab === "all"
                          ? "All"
                          : tab === "individual"
                          ? "Individuals"
                          : "Groups"}
                      </h2>
                    ))}
                  </div>

                  <div className="my-2 flex w-full">
                    {share === "individual" && (
                      <div className="flex flex-col gap-2 mt-2 w-full">
                        <div className="flex gap-2 items-end">
                          <select
                            className="border p-3 border-gray-300 rounded-md flex-1"
                            value={selectedUnit ?? ""}
                            onChange={(e) =>
                              setSelectedUnit(
                                e.target.value ? Number(e.target.value) : null
                              )
                            }
                          >
                            <option value="">Select Tower</option>
                            {units.map((unit) => (
                              <option key={unit.id} value={unit.id}>
                                {unit.name}
                              </option>
                            ))}
                          </select>

                          <select
                            className="border p-3 border-gray-300 rounded-md flex-1"
                            value={selectedOwnership}
                            onChange={(e) =>
                              setSelectedOwnership(e.target.value)
                            }
                          >
                            <option value="">Select Ownership</option>
                            <option value="tenant">Tenant</option>
                            <option value="owner">Owner</option>
                          </select>

                          <button
                            style={{ background: themeColor }}
                            onClick={handleFilter}
                            className="text-white px-4 py-2 rounded-md hover:opacity-90"
                          >
                            Filter
                          </button>

                          <button
                            style={{ background: themeColor }}
                            onClick={() => {
                              setSelectedUnit(null);
                              setSelectedOwnership("");
                              setFilteredMembers(members);
                              setSelectedMembers([]);
                              setFormData((p) => ({ ...p, user_ids: "" }));
                            }}
                            className="text-white px-4 py-2 rounded-md hover:opacity-90"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="w-full mt-3 mb-3">
                          <Select
                            options={[
                              { value: "select_all", label: "Select All" },
                              ...filteredMembers.map((member) => ({
                                value: member.id,
                                label: member.name,
                              })),
                            ]}
                            onChange={handleSelectChange}
                            value={selectedMembers}
                            isMulti
                            closeMenuOnSelect={false}
                            placeholder="Select members"
                          />
                        </div>
                      </div>
                    )}

                    {share === "groups" && (
                      <Select
                        options={groups}
                        closeMenuOnSelect={false}
                        placeholder="Select Group"
                        value={groups.filter((g) =>
                          (formData.group_ids || "")
                            .split(",")
                            .filter(Boolean)
                            .includes(String(g.value))
                        )}
                        onChange={handleSelectGroupChange}
                        isMulti
                        className="w-full"
                      />
                    )}
                  </div>
                </div>

                <div className="my-5">
                  <h2 className="border-b text-center text-xl border-black mb-6 font-bold">
                    Attachments
                  </h2>
                  <FileInputBox
                    fieldName={"notice_image"}
                    isMulti={true}
                    handleChange={(files) =>
                      handleFileChange(files, "notice_image")
                    }
                  />
                </div>
              </div>

              <div className="flex justify-center mt-10 my-5">
                <button
                  style={{ background: themeColor }}
                  onClick={handleUpdateBroadCast}
                  className="px-4 text-white p-2 rounded-md flex items-center gap-2"
                >
                  <FaCheck /> Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditBroadcast;