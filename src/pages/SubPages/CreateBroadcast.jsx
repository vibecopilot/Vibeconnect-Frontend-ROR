import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReactDatePicker from "react-datepicker";
import Select from "react-select";
import { getGroups, postBroadCast, getBuildings, getSetupUsers } from "../../api";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaCheck } from "react-icons/fa";
import ReactQuill from "react-quill";

const CreateBroadcast = () => {
  const [share, setShare] = useState("all");
  const themeColor = useSelector((state) => state.theme.color);
  const siteId = getItemInLocalStorage("SITEID");

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [units, setUnits] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedOwnership, setSelectedOwnership] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [members, setMembers] = useState([]);

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

  const [groups, setGroups] = useState([]);
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

 useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await getSetupUsers();
      const employeesList = (response.data || []).map((emp) => ({
        id: emp.id,
        firstname: emp.firstname,
        lastname: emp.lastname,
        name: `${emp.firstname || ""} ${emp.lastname || ""}`.trim(),
        building_id: emp.building_id || emp.building?.id || null,
        userSites: emp.user_sites || [],
        building: emp.building || {},
      }));
      setMembers(employeesList);
      setFilteredMembers(employeesList);
    } catch (error) {
      console.error("Error fetching setup users:", error);
    }
  };
<<<<<<< HEAD
=======
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAssignedTo();
        const transformedUsers = response.data.map((user) => ({
          value: user.id,
          label: `${user.firstname} ${user.lastname}`,
        }));
        setUsers(transformedUsers);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };

    // Fetch groups when 'share' is set to 'groups'
    if (share === "groups") {
      fetchGroups();
    }

    fetchUsers();
  }, [share]);

  useEffect(() => {
    const fetchData = async () => {
      try {
       const usersRes = await getSetupUsers();
const unitsRes = await getBuildings();

setUnits(unitsRes.data);

// ✅ filter only active users
const activeUsers = usersRes.data.filter((emp) => emp.user_status === true);

const employeesList = activeUsers.map((emp) => ({
  id: emp.id,
  name: `${emp.firstname} ${emp.lastname}`,
  building_id: emp.building_id || emp.building?.id || null,
  userSites: emp.user_sites || [],
  building: emp.building || {},
}));

setMembers(employeesList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

const handleFilter = () => {
const filtered = members.filter((member) => {
  const buildingMatch =
    selectedUnits.length === 0 ||
    selectedUnits.some(
      (unit) => Number(member.building_id) === Number(unit.value)
    );

  const ownershipMatch =
    !selectedOwnership ||
    member.userSites.some(
      (site) =>
        site.ownership?.toLowerCase() === selectedOwnership.toLowerCase()
    );

  return buildingMatch && ownershipMatch;
  });

  setFilteredMembers(filtered);
  toast.success("Filter applied");
};
>>>>>>> 6e2895ca2862289879c854c200b55d4d5d9a92f1

  const fetchGroups = async () => {
    try {
      const res = await getGroups();
      const unitsRes = await getBuildings();

      setUnits(unitsRes.data || []);

      const transformedGroups = (res.data || []).map((group) => ({
        value: group.id,
        label: group.group_name,
      }));
      setGroups(transformedGroups);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch users and groups only once on component mount
  fetchUsers();
  fetchGroups();
}, []); // Empty dependency array ensures the effect is only run once

const handleSelectChange = (selectedOptions) => {
  if (!selectedOptions) return;

  // If "Select All" is clicked, select all users in the filtered list
  if (selectedOptions.some(option => option.value === 'select_all')) {
    const allFilteredOptions = filteredMembers.map((member) => ({
      value: member.id,
      label: member.name,
    }));
    setSelectedMembers(allFilteredOptions); // Select all filtered users
    setFormData((p) => ({
      ...p,
      user_ids: allFilteredOptions.map((u) => u.value).join(","),
    }));
  } else {
    // Otherwise, handle the manual selection/deselection of users
    const newSelections = selectedOptions || [];
    setSelectedMembers(newSelections);
    const userIdsString = newSelections.map((opt) => opt.value).join(",");
    setFormData((p) => ({ ...p, user_ids: userIdsString }));
  }
};
const handleFilter = () => {
  let filtered = members;

  // Filter by selected tower (unit)
  if (selectedUnit) {
    filtered = filtered.filter(
      (member) => Number(member.building_id ?? member.building?.id) === Number(selectedUnit)
    );
  }

  if (filtered.length === 0) {
    toast.error("No users found in this tower");
    return;
  }

  // Update filtered members state only once
  setFilteredMembers(filtered);

  // 🔥 Add the "Select All" option at the top of the filtered list (ensure no duplicates)
  const selectAllOption = {
    value: 'select_all',
    label: 'Select All',
  };
  const allFilteredOptions = [selectAllOption, ...filtered.map((member) => ({
    value: member.id,
    label: member.name,
  }))];

  // Update selected members state, this will select all filtered users by default
  setSelectedMembers(allFilteredOptions);

  // Update formData for backend submission
  setFormData((p) => ({
    ...p,
    user_ids: allFilteredOptions.map((u) => u.value).join(","),
  }));

  toast.success(`${filtered.length} users selected from this tower`);
};


  const handleFileChange = (files, fieldName) => {
    setFormData((p) => ({
      ...p,
      [fieldName]: files,
    }));
  };

  const handleSelectGroupChange = (selectedOptions) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    const groupIdsString = selectedIds.join(",");
    setFormData((p) => ({ ...p, group_ids: groupIdsString }));
  };

  const setShareTab = (value) => {
    setShare(value);
    setSelectedMembers([]);
    setFormData((p) => ({
      ...p,
      shared: value,
      // clear opposite ids to avoid stale
      user_ids: value === "individual" ? p.user_ids : "",
      group_ids: value === "groups" ? p.group_ids : "",
    }));
  };

  const handleCreateBroadCast = async () => {
    if (formData.notice_title === "" || formData.expiry_date === "") {
      return toast.error("Please Enter Title & Expiry Date");
    }

    try {
      toast.loading("Creating Broadcast Please Wait!", { id: "broadcast" });

      const formDataSend = new FormData();

      formDataSend.append("notice[site_id]", formData.site_id);
      formDataSend.append("notice[notice_title]", formData.notice_title);
      formDataSend.append(
        "notice[notice_discription]",
        formData.notice_discription
      );

      const expiry =
        formData.expiry_date instanceof Date
          ? formData.expiry_date.toISOString()
          : formData.expiry_date;
      formDataSend.append("notice[expiry_date]", expiry);

      formDataSend.append("notice[important]", formData.important ? "1" : "0");
      formDataSend.append("notice[shared]", formData.shared);
      formDataSend.append(
        "notice[send_email]",
        formData.send_email ? "1" : "0"
      );

      // keep backend keys consistent (groups stored in notice[group_id] as comma-separated)
      if (formData.shared === "individual") {
        formDataSend.append("notice[user_ids]", formData.user_ids || "");
        formDataSend.append("notice[group_id]", "");
      } else if (formData.shared === "groups") {
        formDataSend.append("notice[user_ids]", "");
        formDataSend.append("notice[group_id]", formData.group_ids || "");
      } else {
        formDataSend.append("notice[user_ids]", "");
        formDataSend.append("notice[group_id]", "");
      }

      (formData.notice_image || []).forEach((file) => {
        formDataSend.append("attachfiles[]", file);
      });

      await postBroadCast(formDataSend);

      toast.success("Broadcast Created Successfully");
      toast.dismiss("broadcast");
      navigate("/communication/broadcast");
    } catch (error) {
      console.log(error);
      toast.dismiss("broadcast");
      toast.error("Failed to create broadcast");
    }
  };

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
              className="text-center text-xl font-bold p-2 mb-2  rounded-md text-white"
            >
              Create Broadcast
            </h2>
            <h2 className="border-b text-xl border-gray-400 mb-6 font-medium">
              Communication Info
            </h2>
            <div className="flex flex-col gap-4 ">
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Title :
                </label>
                <input
                  type="text"
                  name="notice_title"
                  value={formData.notice_title}
                  onChange={handleChange}
                  placeholder="Enter Title"
                  id=""
                  className="border p-2 rounded-md border-gray-400 placeholder:text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Description :
                </label>
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
                    minDate={currentDate}
                    className="border border-gray-400 w-full p-2 rounded-md"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name=""
                    id="imp"
                    checked={formData.important === true}
                    onChange={() =>
                      setFormData((p) => ({
                        ...p,
                        important: !p.important,
                      }))
                    }
                  />
                  <label htmlFor="imp">Mark as Important</label>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name=""
                    id="email"
                    checked={formData.send_email === true}
                    onChange={() =>
                      setFormData((p) => ({
                        ...p,
                        send_email: !p.send_email,
                      }))
                    }
                  />
                  <label htmlFor="email">Send Email</label>
                </div>
              </div>

              <div className="">
                <h2 className="border-b t border-black my-5 text-lg font-semibold">
                  Share With
                </h2>

                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-row gap-2 w-full font-semibold p-2 ">
                    <h2
                      className={`p-1 ${
                        share === "all" && "bg-black text-white"
                      } rounded-full px-6 cursor-pointer border-2 border-black`}
                      onClick={() => setShareTab("all")}
                    >
                      All
                    </h2>

                    <h2
                      className={`p-1 ${
                        share === "individual" && "bg-black text-white"
                      } rounded-full px-4 cursor-pointer border-2 border-black`}
                      onClick={() => setShareTab("individual")}
                    >
                      Individuals
                    </h2>

                    <h2
                      className={`p-1 ${
                        share === "groups" && "bg-black text-white"
                      } rounded-full px-4 cursor-pointer border-2 border-black`}
                      onClick={() => setShareTab("groups")}
                    >
                      Groups
                    </h2>
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
    setSelectedUnit(null); // Reset selected tower (Unit)
    setSelectedOwnership(""); // Reset ownership selection
    setFilteredMembers(members); // Reset filtered members to show all users
    setSelectedMembers([]); // Clear the selected members
    setFormData((prevFormData) => ({
      ...prevFormData,
      user_ids: "", // Reset the user_ids for form submission
    }));
  }}
  className="text-white px-4 py-2 rounded-md hover:opacity-90"
>
  Cancel
</button>

                        </div>

                        <div className="w-full mt-3 mb-3">
                     <Select
  options={filteredMembers.map((member) => ({
    value: member.id,
    label: member.name,
  }))}
  onChange={handleSelectChange}
  value={selectedMembers}
  isMulti
  closeMenuOnSelect={false}
  placeholder="Select members"
/>

{/* Render the selected members */}
{/* <div className="mt-2 flex flex-wrap gap-2">
  {selectedMembers.map((member) => (
    <div
      key={member.value}
      className="px-2 py-1 bg-gray-200 rounded-full flex items-center gap-1"
    >
      {member.label}
      <button
        onClick={() => {
          const newSelection = selectedMembers.filter(
            (u) => u.value !== member.value
          );
          setSelectedMembers(newSelection);
          setFormData((p) => ({
            ...p,
            user_ids: newSelection.map((u) => u.value).join(","),
          }));
        }}
        className="text-red-500 font-bold"
      >
        x
      </button>
    </div>
  ))}
</div> */}

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
                  onClick={handleCreateBroadCast}
                  className="px-4 text-white p-2 rounded-md  flex items-center gap-2"
                >
                  <FaCheck /> Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateBroadcast;



