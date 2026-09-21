import React, { useEffect, useRef, useState } from "react";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { getItemInLocalStorage } from "../../utils/localStorage";
import {
  postEvents,
  getGroups,
  getSetupUsers,
  getBuildings,
} from "../../api";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaFilter } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MdClose } from "react-icons/md";

const CreateEvent = () => {
  const siteId = getItemInLocalStorage("SITEID");
  const userID = getItemInLocalStorage("UserId");

  const themeColor = useSelector((state) => state.theme.color);
  const navigate = useNavigate();

  const [share, setShare] = useState("all");

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);

  const [users, setUsers] = useState([]);

  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [units, setUnits] = useState([]);

  /*
   * Same filter state/logic as CreateBroadcast
   */
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterSearch, setFilterSearch] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

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
    created_by: userID,
    event_name: "",
    venue: "",
    description: "",
    start_date_time: null,
    end_date_time: null,
    user_ids: "",
    group_id: null,
    group_name: "",
    attachfiles: [],
    event_images: [],
    shared: "all",
    email_enabled: false,
    rsvp_enabled: false,
    important: false,
    group_member: [],
  });

  const datePickerRef = useRef(null);
  const currentDate = new Date();

  /*
   * Fetch users and towers
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, unitsRes] = await Promise.all([
          getSetupUsers(),
          getBuildings(),
        ]);

        const activeUsers = (usersRes.data || []).filter(
          (emp) => emp.user_status === true
        );

        const employeesList = activeUsers.map((emp) => ({
          id: emp.id,
          name: `${emp.firstname || ""} ${emp.lastname || ""}`.trim(),
          building_id:
            emp.building_id || emp.building?.id || null,
          userSites: emp.user_sites || [],
          building: emp.building || {},
          user_status: emp.user_status,
        }));

        setMembers(employeesList);

        /*
         * Same as CreateBroadcast:
         * Do NOT show users until filter is applied.
         */
        setFilteredMembers([]);
        setSelectedFilters([]);
        setIsFilterApplied(false);

        setUnits(unitsRes.data || []);

        const usersFormatted = activeUsers.map((user) => ({
          value: user.id,
          label: `${user.firstname || ""} ${
            user.lastname || ""
          }`.trim(),
        }));

        setUsers(usersFormatted);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  /*
   * Fetch groups when Groups tab is selected
   */
  useEffect(() => {
    if (share === "groups") {
      fetchGroups();
    }
  }, [share]);

  const fetchGroups = async () => {
    try {
      const response = await getGroups();
      setGroups(response.data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  /*
   * Same resident filter matching logic as CreateBroadcast
   */
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
          String(
            site?.lives_here ?? site?.livesHere ?? ""
          )
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

  /*
   * Apply the selected filters
   *
   * Resident filters:
   * Owner OR Tenant OR Primary etc.
   *
   * Tower filters:
   * Tower A OR Tower B etc.
   *
   * Resident + Tower:
   * Resident match AND Tower match.
   */
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
          matchesResidentFilter(
            member,
            filter.value
          )
        );

      const towerMatch =
        towerFilters.length === 0 ||
        towerFilters.some(
          (filter) =>
            Number(member.building_id) ===
            Number(filter.value)
        );

      return residentMatch && towerMatch;
    });

    setFilteredMembers(filtered);
    setIsFilterApplied(true);

    /*
     * Keep only selected users that are still
     * available after applying the new filters.
     */
    const validSelectedUsers =
      selectedMembers.filter((selected) =>
        filtered.some(
          (member) => member.id === selected.value
        )
      );

    setSelectedMembers(validSelectedUsers);

    setFormData((prev) => ({
      ...prev,
      user_ids: validSelectedUsers
        .map((user) => user.value)
        .join(","),
    }));
  };

  /*
   * Add/remove filter
   */
  const handleFilterToggle = (option) => {
    const alreadySelected = selectedFilters.some(
      (filter) =>
        filter.type === option.type &&
        String(filter.value) ===
          String(option.value)
    );

    const nextFilters = alreadySelected
      ? selectedFilters.filter(
          (filter) =>
            !(
              filter.type === option.type &&
              String(filter.value) ===
                String(option.value)
            )
        )
      : [...selectedFilters, option];

    setSelectedFilters(nextFilters);
    applyIndividualFilters(nextFilters);
  };

  /*
   * Remove individual filter chip
   */
  const removeFilter = (option) => {
    const nextFilters = selectedFilters.filter(
      (filter) =>
        !(
          filter.type === option.type &&
          String(filter.value) ===
            String(option.value)
        )
    );

    setSelectedFilters(nextFilters);
    applyIndividualFilters(nextFilters);
  };

  /*
   * Clear all filters
   */
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

  /*
   * Filter chip dot
   */
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

  /*
   * Member selection
   */
  const handleSelectChange = (selectedOptions) => {
    if (!selectedOptions) {
      setSelectedMembers([]);

      setFormData((prev) => ({
        ...prev,
        user_ids: "",
      }));

      return;
    }

    /*
     * Select All Members
     */
    if (
      selectedOptions.some(
        (option) =>
          option.value === "select_all"
      )
    ) {
      const allFilteredOptions =
        filteredMembers.map((member) => ({
          value: member.id,
          label: member.name,
        }));

      setSelectedMembers(allFilteredOptions);

      setFormData((prev) => ({
        ...prev,
        user_ids: allFilteredOptions
          .map((user) => user.value)
          .join(","),
      }));

      return;
    }

    setSelectedMembers(selectedOptions);

    setFormData((prev) => ({
      ...prev,
      user_ids: selectedOptions
        .map((option) => option.value)
        .join(","),
    }));
  };

  /*
   * Share tab change
   */
  const setShareTab = (value) => {
    setShare(value);

    setSelectedMembers([]);

    if (value !== "individual") {
      clearIndividualFilters();
    }

    setFormData((prev) => ({
      ...prev,
      shared: value,
      user_ids: "",
      group_id:
        value === "groups"
          ? prev.group_id
          : null,
    }));
  };

  const handleStartDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      start_date_time: date,
    }));
  };

  const handleEndDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      end_date_time: date,
    }));
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd HH:mm:ss");
  };

  const handleGroupChange = (event) => {
    const groupId =
      parseInt(event.target.value, 10) || 0;

    const selectedGroupObj = groups.find(
      (group) => group.id === groupId
    );

    setSelectedGroup(event.target.value);

    setFormData((prev) => ({
      ...prev,
      group_id: groupId,
      group_name:
        selectedGroupObj?.group_name || "",
    }));

    setGroupMembers(
      selectedGroupObj?.group_members || []
    );
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /*
   * Create Event
   */
  const handleCreateEvent = async () => {
    if (
      formData.event_name === "" ||
      !formData.start_date_time
    ) {
      return toast.error(
        "All fields are Required"
      );
    }

    try {
      toast.loading(
        "Creating Event Please Wait!",
        {
          id: "createEvent",
        }
      );

      const formDataSend = new FormData();

      formDataSend.append(
        "event[site_id]",
        formData.site_id
      );

      formDataSend.append(
        "event[event_name]",
        formData.event_name
      );

      /*
       * Backend expects "discription"
       * Keep existing API field.
       */
      formDataSend.append(
        "event[discription]",
        formData.description || ""
      );

      formDataSend.append(
        "event[start_date_time]",
        formatDateTime(
          formData.start_date_time
        )
      );

      formDataSend.append(
        "event[end_date_time]",
        formatDateTime(
          formData.end_date_time
        )
      );

      formDataSend.append(
        "event[venue]",
        formData.venue
      );

      formDataSend.append(
        "event[email_enabled]",
        formData.email_enabled
          ? "true"
          : "false"
      );

      formDataSend.append(
        "event[rsvp_enabled]",
        formData.rsvp_enabled
          ? "true"
          : "false"
      );

      formDataSend.append(
        "event[important]",
        formData.important ? "1" : "0"
      );

      formDataSend.append(
        "event[shared]",
        share
      );

      if (share === "individual") {
        formDataSend.append(
          "event[user_ids]",
          formData.user_ids
        );

        formDataSend.append(
          "event[group_id]",
          ""
        );
      } else if (share === "groups") {
        formDataSend.append(
          "event[group_id]",
          formData.group_id
        );

        formDataSend.append(
          "event[user_ids]",
          ""
        );
      } else {
        /*
         * All users
         */
        const allUserIds = users
          .map((user) => user.value)
          .join(",");

        formDataSend.append(
          "event[user_ids]",
          allUserIds
        );

        formDataSend.append(
          "event[group_id]",
          ""
        );
      }

      /*
       * Attach event images
       */
      if (
        formData.event_images &&
        formData.event_images.length > 0
      ) {
        formData.event_images.forEach(
          (file) => {
            if (file instanceof File) {
              formDataSend.append(
                "attachfiles[]",
                file
              );
            }
          }
        );
      }

      await postEvents(formDataSend);

      toast.success(
        "Event Created Successfully",
        {
          id: "createEvent",
        }
      );

      navigate("/communication/events");
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create event",
        {
          id: "createEvent",
        }
      );
    }
  };

  /*
   * Attachment handler
   */
  const handleFileAttachment = (files) => {
    let fileArray = [];

    if (files instanceof FileList) {
      fileArray = Array.from(files);
    } else if (Array.isArray(files)) {
      fileArray = files;
    } else if (files) {
      fileArray = [files];
    }

    setFormData((prev) => ({
      ...prev,
      event_images: fileArray,
    }));
  };

  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex justify-center">
          <div className="my-5 mb-10 border w-full max-w-[70rem] border-gray-400 p-2 rounded-lg">

            <h2
              style={{
                background: themeColor,
              }}
              className="text-center text-xl font-medium p-2 rounded-md text-white"
            >
              Create Event
            </h2>

            <h2 className="border-b text-xl border-black my-6 font-semibold">
              Event Info
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <div className="flex flex-col">
                <label className="font-medium">
                  Title :
                </label>

                <input
                  type="text"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleChange}
                  placeholder="Enter Title"
                  className="border-gray-400 border p-2 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">
                  Venue :
                </label>

                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Enter Venue"
                  className="border-gray-400 border p-2 rounded-md"
                />
              </div>

              <div className="flex items-center gap-2 w-full">

                <DatePicker
                  selected={
                    formData.start_date_time
                  }
                  onChange={
                    handleStartDateChange
                  }
                  showTimeSelect
                  dateFormat="dd/MM/yyyy h:mm aa"
                  placeholderText="Select start date & time"
                  ref={datePickerRef}
                  minDate={currentDate}
                  className="border border-gray-400 p-2 w-full rounded-md"
                />

                <span>-</span>

                <DatePicker
                  selected={
                    formData.end_date_time
                  }
                  onChange={
                    handleEndDateChange
                  }
                  showTimeSelect
                  dateFormat="dd/MM/yyyy h:mm aa"
                  placeholderText="Select end date & time"
                  minDate={currentDate}
                  className="border border-gray-400 rounded-md p-2 w-full"
                />

              </div>
            </div>

            <div className="flex flex-col gap-2 my-2">

              <label className="font-medium">
                Description:
              </label>

              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: value,
                  }))
                }
                placeholder="Enter Description"
                className="bg-white"
                style={{
                  minHeight: "120px",
                }}
              />

            </div>

            <div className="flex gap-4 my-5">

              <div className="flex gap-2 items-center">

                <input
                  type="checkbox"
                  id="imp"
                  checked={
                    formData.important === true
                  }
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      important:
                        !prev.important,
                    }))
                  }
                />

                <label
                  htmlFor="imp"
                  className="font-semibold"
                >
                  Important
                </label>

              </div>

              <div className="flex gap-2 items-center">

                <input
                  type="checkbox"
                  id="email"
                  checked={
                    formData.email_enabled === true
                  }
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      email_enabled:
                        !prev.email_enabled,
                    }))
                  }
                />

                <label
                  htmlFor="email"
                  className="font-semibold"
                >
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

                      {/* =========================
                          FILTER
                      ========================== */}

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

                          {selectedFilters.length ===
                          0 ? (
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

                            {/* SEARCH */}

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

                              {/* RESIDENT FILTERS */}

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

                              {/* TOWER */}

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

                            {/* CLEAR */}

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

                      {/* =========================
                          MEMBERS
                      ========================== */}

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

                  {/* =========================
                      GROUPS
                  ========================== */}

                  {share === "groups" && (
                    <div className="flex flex-col gap-2 mt-2 w-full">

                      <label
                        htmlFor="groupSelect"
                        className="font-medium mb-1"
                      >
                        Select Group
                      </label>

                      <select
                        id="groupSelect"
                        className="border p-3 border-gray-300 rounded-md"
                        value={selectedGroup}
                        onChange={
                          handleGroupChange
                        }
                      >
                        <option value="">
                          Select Group
                        </option>

                        {groups.map((group) => (
                          <option
                            key={group.id}
                            value={group.id}
                          >
                            {group.group_name}
                          </option>
                        ))}
                      </select>

                      {selectedGroup && (
                        <div className="mt-4 p-4 border rounded-md bg-gray-50">

                          <h2 className="text-lg font-semibold mb-2">
                            Group Members
                          </h2>

                          {groupMembers.length > 0 ? (
                            <div className="space-y-2">

                              {groupMembers.map(
                                (member, index) => (
                                  <div
                                    key={index}
                                    className="p-2 border rounded bg-white shadow-sm"
                                  >
                                    {
                                      member.user_name
                                    }
                                  </div>
                                )
                              )}

                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">
                              No members exist inside this group.
                            </p>
                          )}

                        </div>
                      )}

                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* RSVP */}

            <div className="mb-4 mt-2">

              <h2 className="border-b text-xl border-black font-semibold">
                RSVP
              </h2>

              <div className="flex gap-4 mt-2">

                <div className="flex gap-2">

                  <input
                    type="radio"
                    name="RSVP"
                    id="yes"
                    checked={
                      formData.rsvp_enabled ===
                      true
                    }
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        rsvp_enabled: true,
                      }))
                    }
                  />

                  <label
                    htmlFor="yes"
                    className="text-lg"
                  >
                    Yes
                  </label>

                </div>

                <div className="flex gap-2">

                  <input
                    type="radio"
                    name="RSVP"
                    id="no"
                    checked={
                      formData.rsvp_enabled ===
                      false
                    }
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        rsvp_enabled: false,
                      }))
                    }
                  />

                  <label
                    htmlFor="no"
                    className="text-lg"
                  >
                    No
                  </label>

                </div>

              </div>

            </div>

            {/* ATTACHMENTS */}

            <div>

              <h2 className="border-b text-xl border-black my-5 font-semibold">
                Upload Attachments
              </h2>

              <FileInputBox
                fieldName="event_images"
                handleChange={
                  handleFileAttachment
                }
                fileType="image/*"
              />

            </div>

            {/* BUTTONS */}

            <div className="flex justify-end mt-10 my-5 gap-3">

              <button
                className="bg-black text-white p-2 rounded-md flex items-center gap-2 px-4"
                onClick={() =>
                  navigate(
                    "/communication/events"
                  )
                }
              >
                <MdClose />
                Cancel
              </button>

              <button
                style={{
                  background: themeColor,
                }}
                className="text-white p-2 rounded-md flex items-center gap-2 px-4"
                onClick={handleCreateEvent}
              >
                <FaCheck />
                Submit
              </button>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateEvent;