import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReactDatePicker from "react-datepicker";
import Select from "react-select";
import {
  getGroups,
  postBroadCast,
  getBuildings,
  getSetupUsers,
} from "../../api";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaCheck, FaFilter } from "react-icons/fa";
import ReactQuill from "react-quill";

const CreateBroadcast = () => {
  const [share, setShare] = useState("all");
  const themeColor = useSelector((state) => state.theme.color);
  const siteId = getItemInLocalStorage("SITEID");

  const [units, setUnits] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterSearch, setFilterSearch] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const FILTER_OPTIONS = [
    {
      value: "owner",
      label: "Owner",
      type: "resident",
      dot: "bg-red-500",
    },
    {
      value: "tenant",
      label: "Tenant",
      type: "resident",
      dot: "bg-cyan-500",
    },
    {
      value: "primary",
      label: "Primary",
      type: "resident",
      dot: "bg-pink-500",
    },
    {
      value: "secondary",
      label: "Secondary",
      type: "resident",
      dot: "bg-gray-200",
    },
    {
      value: "lives_here",
      label: "Lives Here",
      type: "resident",
      dot: "bg-green-500",
    },
  ];

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
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const handleExpiryDateChange = (date) => {
    setFormData((p) => ({
      ...p,
      expiry_date: date,
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((p) => ({
      ...p,
      notice_discription: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, unitsRes] = await Promise.all([
          getSetupUsers(),
          getBuildings(),
        ]);

        setUnits(unitsRes.data || []);

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
        setFilteredMembers([]);
        setSelectedFilters([]);
        setIsFilterApplied(false);

        const usersFormatted = activeUsers.map((emp) => ({
          value: emp.id,
          label: `${emp.firstname || ""} ${emp.lastname || ""}`.trim(),
        }));

        setUsers(usersFormatted);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

  const matchesResidentFilter = (member, filterValue) => {
    return (member.userSites || []).some((site) => {
      const ownership = String(site?.ownership || "")
        .toLowerCase()
        .trim();

      const residentType = String(
        site?.resident_type ??
          site?.residentType ??
          site?.resident_status ??
          site?.residentStatus ??
          site?.relation ??
          site?.user_type ??
          site?.userType ??
          site?.member_type ??
          site?.memberType ??
          site?.occupancy_type ??
          site?.occupancyType ??
          ""
      )
        .toLowerCase()
        .trim();

      const primary =
        site?.primary === true ||
        site?.is_primary === true ||
        site?.isPrimary === true ||
        residentType === "primary";

      const secondary =
        site?.secondary === true ||
        site?.is_secondary === true ||
        site?.isSecondary === true ||
        residentType === "secondary";

      const livesHere =
        site?.lives_here === true ||
        site?.livesHere === true ||
        site?.is_lives_here === true ||
        ["yes", "true"].includes(
          String(site?.lives_here ?? site?.livesHere ?? "")
            .toLowerCase()
            .trim()
        ) ||
        residentType === "lives here" ||
        residentType === "lives_here";

      switch (filterValue) {
        case "owner":
          return ownership === "owner";

        case "tenant":
          return ownership === "tenant";

        case "primary":
          return primary;

        case "secondary":
          return secondary;

        case "lives_here":
          return livesHere;

        default:
          return false;
      }
    });
  };

  const applyIndividualFilters = (filters) => {
    if (filters.length === 0) {
      setFilteredMembers([]);
      setSelectedMembers([]);
      setIsFilterApplied(false);

      setFormData((prev) => ({
        ...prev,
        user_ids: "",
      }));

      return;
    }

    const residentFilters = filters.filter(
      (filter) => filter.type === "resident"
    );

    const towerFilters = filters.filter(
      (filter) => filter.type === "tower"
    );

    const filtered = members.filter((member) => {
      const residentMatch =
        residentFilters.length === 0 ||
        residentFilters.some((filter) =>
          matchesResidentFilter(member, filter.value)
        );

      const towerMatch =
        towerFilters.length === 0 ||
        towerFilters.some(
          (filter) =>
            Number(member.building_id) === Number(filter.value)
        );

      return residentMatch && towerMatch;
    });

    setFilteredMembers(filtered);
    setIsFilterApplied(true);

    const validSelectedUsers = selectedMembers.filter((selected) =>
      filtered.some((member) => member.id === selected.value)
    );

    setSelectedMembers(validSelectedUsers);

    setFormData((prev) => ({
      ...prev,
      user_ids: validSelectedUsers
        .map((user) => user.value)
        .join(","),
    }));
  };

  const handleFilterToggle = (option) => {
    const alreadySelected = selectedFilters.some(
      (filter) =>
        filter.type === option.type &&
        String(filter.value) === String(option.value)
    );

    const nextFilters = alreadySelected
      ? selectedFilters.filter(
          (filter) =>
            !(
              filter.type === option.type &&
              String(filter.value) === String(option.value)
            )
        )
      : [...selectedFilters, option];

    setSelectedFilters(nextFilters);
    applyIndividualFilters(nextFilters);
  };

  const removeFilter = (option) => {
    const nextFilters = selectedFilters.filter(
      (filter) =>
        !(
          filter.type === option.type &&
          String(filter.value) === String(option.value)
        )
    );

    setSelectedFilters(nextFilters);
    applyIndividualFilters(nextFilters);
  };

  const clearIndividualFilters = () => {
    setSelectedFilters([]);
    setFilterSearch("");
    setShowFilterMenu(false);
    setFilteredMembers([]);
    setSelectedMembers([]);
    setIsFilterApplied(false);

    setFormData((prev) => ({
      ...prev,
      user_ids: "",
    }));
  };

  const getFilterDotClass = (filter) => {
    if (filter.type === "tower") {
      return "bg-lime-400";
    }

    return (
      FILTER_OPTIONS.find(
        (item) => item.value === filter.value
      )?.dot || "bg-gray-400"
    );
  };

  const handleSelectChange = (selectedOptions) => {
    if (!selectedOptions) {
      return;
    }

    if (
      selectedOptions.some(
        (option) => option.value === "select_all"
      )
    ) {
      const allFilteredOptions = filteredMembers.map((member) => ({
        value: member.id,
        label: member.name,
      }));

      setSelectedMembers(allFilteredOptions);

      setFormData((p) => ({
        ...p,
        user_ids: allFilteredOptions
          .map((u) => u.value)
          .join(","),
      }));
    } else {
      setSelectedMembers(selectedOptions);

      setFormData((p) => ({
        ...p,
        user_ids: selectedOptions
          .map((opt) => opt.value)
          .join(","),
      }));
    }
  };

  const handleFileChange = (files, fieldName) => {
    setFormData((p) => ({
      ...p,
      [fieldName]: files,
    }));
  };

  const handleSelectGroupChange = (selectedOptions) => {
    const groupIdsString = selectedOptions
      ? selectedOptions.map((option) => option.value).join(",")
      : "";

    setFormData((p) => ({
      ...p,
      group_ids: groupIdsString,
    }));
  };

  const setShareTab = (value) => {
    setShare(value);
    setSelectedMembers([]);

    if (value !== "individual") {
      clearIndividualFilters();
    }

    setFormData((p) => ({
      ...p,
      shared: value,
      user_ids: "",
      group_ids: value === "groups" ? p.group_ids : "",
    }));
  };

  const handleCreateBroadCast = async () => {
    if (
      formData.notice_title === "" ||
      formData.expiry_date === ""
    ) {
      return toast.error("Please Enter Title & Expiry Date");
    }

    try {
      toast.loading("Creating Broadcast Please Wait!", {
        id: "broadcast",
      });

      const formDataSend = new FormData();

      formDataSend.append(
        "notice[site_id]",
        formData.site_id
      );

      formDataSend.append(
        "notice[notice_title]",
        formData.notice_title
      );

      formDataSend.append(
        "notice[notice_discription]",
        formData.notice_discription
      );

      formDataSend.append(
        "notice[expiry_date]",
        formData.expiry_date instanceof Date
          ? formData.expiry_date.toISOString()
          : formData.expiry_date
      );

      formDataSend.append(
        "notice[important]",
        formData.important ? "1" : "0"
      );

      formDataSend.append(
        "notice[send_email]",
        formData.send_email ? "1" : "0"
      );

      if (share === "all") {
        const allUserIds = users
          .map((user) => user.value)
          .join(",");

        formDataSend.append(
          "notice[shared]",
          "all"
        );

        formDataSend.append(
          "notice[user_ids]",
          allUserIds
        );
      } else if (share === "individual") {
        formDataSend.append(
          "notice[shared]",
          "individual"
        );

        formDataSend.append(
          "notice[user_ids]",
          formData.user_ids
        );
      } else if (share === "groups") {
        formDataSend.append(
          "notice[shared]",
          "groups"
        );

        formDataSend.append(
          "notice[group_id]",
          formData.group_ids
        );
      }

      (formData.notice_image || []).forEach((file) => {
        if (file instanceof File) {
          formDataSend.append(
            "attachfiles[]",
            file
          );
        }
      });

      await postBroadCast(formDataSend);

      toast.success(
        "Broadcast Created Successfully"
      );

      toast.dismiss("broadcast");

      navigate("/communication/broadcast");
    } catch (error) {
      console.error(error);

      toast.dismiss("broadcast");

      toast.error(
        "Failed to create broadcast"
      );
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
              className="text-center text-xl font-bold p-2 mb-2 rounded-md text-white"
            >
              Create Broadcast
            </h2>

            <h2 className="border-b text-xl border-gray-400 mb-6 font-medium">
              Communication Info
            </h2>

            <div className="flex flex-col gap-4">

              <div className="flex flex-col">
                <label className="font-semibold">
                  Title :
                </label>

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
                <label className="font-semibold">
                  Description :
                </label>

                <ReactQuill
                  theme="snow"
                  value={formData.notice_discription}
                  onChange={handleDescriptionChange}
                  placeholder="Enter Description"
                  className="bg-white"
                  style={{
                    minHeight: "120px",
                    minWidth: "120px",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 items-end gap-4">

                <div className="flex flex-col">
                  <p className="font-medium">
                    Expire on
                  </p>

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
                    id="imp"
                    checked={
                      formData.important === true
                    }
                    onChange={() =>
                      setFormData((p) => ({
                        ...p,
                        important: !p.important,
                      }))
                    }
                  />

                  <label htmlFor="imp">
                    Mark as Important
                  </label>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id="email"
                    checked={
                      formData.send_email === true
                    }
                    onChange={() =>
                      setFormData((p) => ({
                        ...p,
                        send_email: !p.send_email,
                      }))
                    }
                  />

                  <label htmlFor="email">
                    Send Email
                  </label>
                </div>

              </div>

              <div>

                <h2 className="border-b border-black my-5 text-lg font-semibold">
                  Share With
                </h2>

                <div className="flex flex-col items-center justify-center">

                  <div className="flex flex-row gap-2 w-full font-semibold p-2">

                    {[
                      "all",
                      "individual",
                      "groups",
                    ].map((tab) => (
                      <h2
                        key={tab}
                        className={`p-1 ${
                          share === tab
                            ? "bg-black text-white"
                            : ""
                        } rounded-full px-6 cursor-pointer border-2 border-black capitalize`}
                        onClick={() =>
                          setShareTab(tab)
                        }
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

                        {/* FILTER */}
                        <div className="relative w-full">

                          <div
                            className="min-h-[46px] border border-gray-300 rounded-md bg-white flex flex-wrap items-center gap-1 p-1 cursor-pointer"
                            onClick={() =>
                              setShowFilterMenu(
                                (prev) => !prev
                              )
                            }
                          >

                            <button
                              type="button"
                              className="h-10 w-12 shrink-0 border-r border-gray-200 flex items-center justify-center text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();

                                setShowFilterMenu(
                                  (prev) => !prev
                                );
                              }}
                              aria-label="Open filters"
                            >
                              <FaFilter className="text-lg" />
                            </button>

                            {selectedFilters.length === 0 ? (
                              <span className="text-gray-400 px-2">
                                Filter
                              </span>
                            ) : (
                              selectedFilters.map(
                                (filter) => (
                                  <span
                                    key={`${filter.type}-${filter.value}`}
                                    className="inline-flex items-center gap-1 border border-gray-300 rounded-md bg-gray-50 px-2 py-1 text-sm"
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                  >

                                    <span
                                      className={`w-3 h-3 rounded-full ${getFilterDotClass(
                                        filter
                                      )}`}
                                    />

                                    <span>
                                      {filter.label}
                                    </span>

                                    <button
                                      type="button"
                                      className="text-gray-400 hover:text-red-500 font-bold"
                                      onClick={() =>
                                        removeFilter(
                                          filter
                                        )
                                      }
                                      aria-label={`Remove ${filter.label}`}
                                    >
                                      ×
                                    </button>

                                  </span>
                                )
                              )
                            )}

                          </div>

                          {showFilterMenu && (
                            <div
                              className="absolute z-50 left-0 top-full mt-1 w-full max-w-[520px] bg-white border border-gray-300 rounded-md shadow-lg"
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                            >

                              <div className="p-2 border-b border-gray-200">

                                <div className="relative">

                                  <input
                                    type="text"
                                    value={filterSearch}
                                    onChange={(e) =>
                                      setFilterSearch(
                                        e.target.value
                                      )
                                    }
                                    placeholder="Search Filter..."
                                    className="w-full border border-teal-500 rounded-md p-2 pr-9 outline-none"
                                    autoFocus
                                  />

                                  <span className="absolute right-3 top-2.5 text-gray-400">
                                    🔍
                                  </span>

                                </div>

                              </div>

                              <div className="max-h-[420px] overflow-y-auto">

                                {FILTER_OPTIONS
                                  .filter((option) =>
                                    option.label
                                      .toLowerCase()
                                      .includes(
                                        filterSearch.toLowerCase()
                                      )
                                  )
                                  .map((option) => {

                                    const selected =
                                      selectedFilters.some(
                                        (filter) =>
                                          filter.type ===
                                            option.type &&
                                          filter.value ===
                                            option.value
                                      );

                                    return (
                                      <button
                                        type="button"
                                        key={option.value}
                                        onClick={() =>
                                          handleFilterToggle(
                                            option
                                          )
                                        }
                                        className={`w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-gray-50 ${
                                          selected
                                            ? "bg-gray-50"
                                            : ""
                                        }`}
                                      >

                                        <span
                                          className={`w-3 h-3 rounded-full ${option.dot}`}
                                        />

                                        <span className="text-base">
                                          {option.label}
                                        </span>

                                        {selected && (
                                          <span className="ml-auto text-gray-500">
                                            ✓
                                          </span>
                                        )}

                                      </button>
                                    );
                                  })}

                                <div className="border-t border-gray-200 px-4 py-3 font-semibold text-gray-700">
                                  🏢 FILTER BY TOWER
                                </div>

                                {units
                                  .filter((unit) =>
                                    String(
                                      unit.name || ""
                                    )
                                      .toLowerCase()
                                      .includes(
                                        filterSearch.toLowerCase()
                                      )
                                  )
                                  .map((unit) => {

                                    const towerOption = {
                                      value: unit.id,
                                      label: unit.name,
                                      type: "tower",
                                    };

                                    const selected =
                                      selectedFilters.some(
                                        (filter) =>
                                          filter.type ===
                                            "tower" &&
                                          Number(
                                            filter.value
                                          ) ===
                                            Number(
                                              unit.id
                                            )
                                      );

                                    return (
                                      <button
                                        type="button"
                                        key={`tower-${unit.id}`}
                                        onClick={() =>
                                          handleFilterToggle(
                                            towerOption
                                          )
                                        }
                                        className={`w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-gray-50 ${
                                          selected
                                            ? "bg-gray-50"
                                            : ""
                                        }`}
                                      >

                                        <span className="w-3 h-3 rounded-full bg-lime-400" />

                                        <span className="text-base">
                                          {unit.name}
                                        </span>

                                        {selected && (
                                          <span className="ml-auto text-gray-500">
                                            ✓
                                          </span>
                                        )}

                                      </button>
                                    );
                                  })}

                              </div>

                              <div className="border-t border-gray-200 p-2 flex justify-end">

                                <button
                                  type="button"
                                  className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
                                  onClick={
                                    clearIndividualFilters
                                  }
                                >
                                  Clear All
                                </button>

                              </div>

                            </div>
                          )}

                        </div>

                        {/* MEMBERS */}
                        {isFilterApplied && (
                          <div className="w-full mt-2 mb-3">

                            {filteredMembers.length > 0 ? (
                              <>
                                <Select
                                  options={[
                                    {
                                      value:
                                        "select_all",
                                      label:
                                        "Select All Members",
                                    },
                                    ...filteredMembers.map(
                                      (member) => ({
                                        value:
                                          member.id,
                                        label:
                                          member.name,
                                      })
                                    ),
                                  ]}
                                  onChange={
                                    handleSelectChange
                                  }
                                  value={
                                    selectedMembers
                                  }
                                  isMulti
                                  closeMenuOnSelect={
                                    false
                                  }
                                  placeholder="Select members"
                                  className="w-full"
                                />

                                <div className="text-xs text-gray-500 mt-1">
                                  {
                                    filteredMembers.length
                                  }{" "}
                                  member
                                  {filteredMembers.length ===
                                  1
                                    ? ""
                                    : "s"}{" "}
                                  found
                                </div>
                              </>
                            ) : (
                              <div className="border border-gray-300 rounded-md p-3 text-gray-500 text-center">
                                No users found with the selected filters
                              </div>
                            )}

                          </div>
                        )}

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
                            .includes(
                              String(g.value)
                            )
                        )}
                        onChange={
                          handleSelectGroupChange
                        }
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
                    fieldName="notice_image"
                    isMulti={true}
                    handleChange={(files) =>
                      handleFileChange(
                        files,
                        "notice_image"
                      )
                    }
                  />

                </div>

              </div>

              <div className="flex justify-center mt-10 my-5">

                <button
                  style={{
                    background: themeColor,
                  }}
                  onClick={
                    handleCreateBroadCast
                  }
                  className="px-4 text-white p-2 rounded-md flex items-center gap-2"
                >
                  <FaCheck />
                  Submit
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