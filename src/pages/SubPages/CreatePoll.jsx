import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Select from "react-select";
import { FaCheck, FaFilter } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getAssignedTo,
  getBuildings,
  getGroups,
  getSetupUsers,
  postPolls,
} from "../../api";
import { MdClose } from "react-icons/md";

function CreatePolls() {
  const themeColor = useSelector((state) => state.theme.color);
  const navigate = useNavigate();

  const [share, setShare] = useState("all");

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [units, setUnits] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState("");

  const [pollInput, setPollInput] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [selectedUserOption, setSelectedUserOption] = useState([]);
  const [pollsOption, setPollsOption] = useState([]);

  const [currentDate, setCurrentDate] = useState("");

  /*
   * Filter states
   */
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterSearch, setFilterSearch] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  /*
   * NEW:
   * Controls whether dropdown opens above or below.
   */
  const [filterMenuPosition, setFilterMenuPosition] =
    useState("bottom");

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
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    visibility: "",
    user_ids: "",
    group_id: "",
    shared: "",
    shared_with: "",
    group_name: "",
    send_mail: false,
    target_groups: [],
    poll_options_attributes: {},
    group_member: [],
  });

  /*
   * Current date
   */
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    setCurrentDate(formattedDate);
  }, []);

  /*
   * Fetch active users + towers
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
          name: `${emp.firstname || ""} ${
            emp.lastname || ""
          }`.trim(),
          building_id:
            emp.building_id ||
            emp.building?.id ||
            null,
          userSites: emp.user_sites || [],
          building: emp.building || {},
          user_status: emp.user_status,
        }));

        setMembers(employeesList);

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
        console.error(
          "Error fetching users/buildings:",
          error
        );
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

  /*
   * Existing assigned users
   */
  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const response = await getAssignedTo();

        const transformedUsers = (response.data || []).map(
          (user) => ({
            value: user.id,
            label: `${user.firstname || ""} ${
              user.lastname || ""
            }`.trim(),
          })
        );

        setAssignedTo(transformedUsers);
        setUsers(transformedUsers);
      } catch (error) {
        console.error(
          "Error fetching assigned users:",
          error
        );
      }
    };

    fetchAssignedUsers();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await getGroups();

      setGroups(response.data || []);
    } catch (error) {
      console.error(
        "Error fetching groups:",
        error
      );
    }
  };

  /*
   * NEW:
   * Open filter dropdown above/below depending
   * on available viewport space.
   */
  const toggleFilterMenu = (e) => {
    e?.stopPropagation();

    if (!showFilterMenu) {
      const triggerElement = e?.currentTarget;

      if (triggerElement) {
        const rect =
          triggerElement.getBoundingClientRect();

        const dropdownHeight = 450;

        const spaceBelow =
          window.innerHeight - rect.bottom;

        const spaceAbove = rect.top;

        if (
          spaceBelow < dropdownHeight &&
          spaceAbove > dropdownHeight
        ) {
          setFilterMenuPosition("top");
        } else {
          setFilterMenuPosition("bottom");
        }
      }
    }

    setShowFilterMenu((prev) => !prev);
  };

  /*
   * Add poll option
   */
  const handleAddPolls = (event) => {
    event.preventDefault();

    if (pollInput.trim() !== "") {
      if (pollsOption.length < 5) {
        setPollsOption([
          ...pollsOption,
          {
            pollOption: pollInput.trim(),
          },
        ]);

        setPollInput("");
      } else {
        toast.error(
          "You can only add up to 5 options"
        );
      }
    } else {
      toast.error(
        "Please enter a poll option"
      );
    }
  };

  /*
   * Remove poll option
   */
  const handleRemovePolls = (index) => {
    const newPollsOption = [...pollsOption];

    newPollsOption.splice(index, 1);

    setPollsOption(newPollsOption);
  };

  /*
   * Resident filter matching logic
   */
  const matchesResidentFilter = (
    member,
    filterValue
  ) => {
    return (member.userSites || []).some(
      (site) => {
        const ownership = String(
          site?.ownership || ""
        )
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
              site?.lives_here ??
                site?.livesHere ??
                ""
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
      }
    );
  };

  /*
   * Apply filters
   */
  const applyIndividualFilters = (
    filters
  ) => {
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

    const residentFilters =
      filters.filter(
        (filter) =>
          filter.type === "resident"
      );

    const towerFilters =
      filters.filter(
        (filter) =>
          filter.type === "tower"
      );

    const filtered = members.filter(
      (member) => {
        const residentMatch =
          residentFilters.length === 0 ||
          residentFilters.some(
            (filter) =>
              matchesResidentFilter(
                member,
                filter.value
              )
          );

        const towerMatch =
          towerFilters.length === 0 ||
          towerFilters.some(
            (filter) =>
              Number(
                member.building_id
              ) ===
              Number(filter.value)
          );

        return (
          residentMatch &&
          towerMatch
        );
      }
    );

    setFilteredMembers(filtered);
    setIsFilterApplied(true);

    const validSelectedUsers =
      selectedMembers.filter(
        (selected) =>
          filtered.some(
            (member) =>
              member.id ===
              selected.value
          )
      );

    setSelectedMembers(
      validSelectedUsers
    );

    setFormData((prev) => ({
      ...prev,
      user_ids:
        validSelectedUsers
          .map(
            (user) => user.value
          )
          .join(","),
    }));
  };

  /*
   * Toggle filter
   */
  const handleFilterToggle = (
    option
  ) => {
    const alreadySelected =
      selectedFilters.some(
        (filter) =>
          filter.type ===
            option.type &&
          String(filter.value) ===
            String(option.value)
      );

    const nextFilters =
      alreadySelected
        ? selectedFilters.filter(
            (filter) =>
              !(
                filter.type ===
                  option.type &&
                String(
                  filter.value
                ) ===
                  String(
                    option.value
                  )
              )
          )
        : [
            ...selectedFilters,
            option,
          ];

    setSelectedFilters(
      nextFilters
    );

    applyIndividualFilters(
      nextFilters
    );
  };

  /*
   * Remove one filter chip
   */
  const removeFilter = (
    option
  ) => {
    const nextFilters =
      selectedFilters.filter(
        (filter) =>
          !(
            filter.type ===
              option.type &&
            String(filter.value) ===
              String(option.value)
          )
      );

    setSelectedFilters(
      nextFilters
    );

    applyIndividualFilters(
      nextFilters
    );
  };

  /*
   * Clear all filters
   */
  const clearIndividualFilters =
    () => {
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
   * Filter dot color
   */
  const getFilterDotClass = (
    filter
  ) => {
    if (
      filter.type === "tower"
    ) {
      return "bg-lime-400";
    }

    return (
      FILTER_OPTIONS.find(
        (item) =>
          item.value ===
          filter.value
      )?.dot ||
      "bg-gray-400"
    );
  };

  /*
   * Member selection
   */
  const handleSelectChange = (
    selectedOptions
  ) => {
    if (!selectedOptions) {
      setSelectedMembers([]);

      setFormData((prev) => ({
        ...prev,
        user_ids: "",
      }));

      return;
    }

    if (
      selectedOptions.some(
        (option) =>
          option.value ===
          "select_all"
      )
    ) {
      const allFilteredOptions =
        filteredMembers.map(
          (member) => ({
            value: member.id,
            label: member.name,
          })
        );

      setSelectedMembers(
        allFilteredOptions
      );

      setFormData((prev) => ({
        ...prev,
        user_ids:
          allFilteredOptions
            .map(
              (user) =>
                user.value
            )
            .join(","),
      }));

      return;
    }

    setSelectedMembers(
      selectedOptions
    );

    setFormData((prev) => ({
      ...prev,
      user_ids:
        selectedOptions
          .map(
            (option) =>
              option.value
          )
          .join(","),
    }));
  };

  /*
   * Existing user select
   */
  const handleUserChangeSelect = (
    selectedUserOption
  ) => {
    const selected =
      selectedUserOption || [];

    setSelectedUserOption(
      selected
    );

    const targetGroups =
      selected.map(
        (user) => user.value
      );

    setFormData((prev) => ({
      ...prev,
      target_groups:
        targetGroups,
    }));
  };

  /*
   * Form change
   */
  const handleFormChange = (
    e
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  /*
   * Group change
   */
  const handleGroupChange = (
    event
  ) => {
    const groupId =
      parseInt(
        event.target.value,
        10
      ) || 0;

    const selectedGroupObj =
      groups.find(
        (group) =>
          group.id === groupId
      );

    setSelectedGroup(
      event.target.value
    );

    setFormData((prev) => ({
      ...prev,
      group_id: groupId,
      group_name:
        selectedGroupObj?.group_name ||
        "",
    }));

    setGroupMembers(
      selectedGroupObj?.group_members ||
        []
    );
  };

  /*
   * Share tab
   */
  const setShareTab = (
    value
  ) => {
    setShare(value);

    setSelectedMembers([]);

    if (
      value !== "individual"
    ) {
      clearIndividualFilters();
    }

    setFormData((prev) => ({
      ...prev,
      shared: value,
      user_ids: "",
      group_id:
        value === "groups"
          ? prev.group_id
          : "",
    }));
  };

  /*
   * Submit poll
   */
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error(
        "Please enter poll title"
      );
      return;
    }

    if (
      pollsOption.length < 2
    ) {
      toast.error(
        "Please add at least 2 poll options"
      );
      return;
    }

    if (
      share === "individual" &&
      !formData.user_ids
    ) {
      toast.error(
        "Please select at least one member"
      );
      return;
    }

    if (
      share === "groups" &&
      !formData.group_id
    ) {
      toast.error(
        "Please select a group"
      );
      return;
    }

    const sendData =
      new FormData();

    sendData.append(
      "poll[title]",
      formData.title
    );

    sendData.append(
      "poll[description]",
      formData.description
    );

    sendData.append(
      "poll[start_date]",
      formData.start_date ||
        currentDate
    );

    sendData.append(
      "poll[end_date]",
      formData.end_date
    );

    sendData.append(
      "poll[start_time]",
      formData.start_time
    );

    sendData.append(
      "poll[end_time]",
      formData.end_time
    );

    sendData.append(
      "poll[send_mail]",
      formData.send_mail
        ? "true"
        : "false"
    );

    sendData.append(
      "poll[visibility]",
      formData.visibility
    );

    if (share === "all") {
      sendData.append(
        "poll[shared]",
        "all"
      );

      const allUserIds = users
        .map(
          (user) => user.value
        )
        .join(",");

      sendData.append(
        "poll[user_ids]",
        allUserIds
      );
    } else if (
      share === "individual"
    ) {
      sendData.append(
        "poll[shared]",
        "individual"
      );

      sendData.append(
        "poll[user_ids]",
        formData.user_ids
      );
    } else if (
      share === "groups"
    ) {
      sendData.append(
        "poll[shared]",
        "groups"
      );

      sendData.append(
        "poll[group_id]",
        formData.group_id
      );

      sendData.append(
        "poll[group_name]",
        formData.group_name
      );
    }

    formData.target_groups.forEach(
      (group) => {
        sendData.append(
          "poll[target_groups]",
          group
        );
      }
    );

    pollsOption.forEach(
      (option, index) => {
        sendData.append(
          `poll[poll_options_attributes][${
            index + 1
          }][content]`,
          option.pollOption
        );
      }
    );

    try {
      await postPolls(sendData);

      toast.success(
        "Poll Added Successfully"
      );

      navigate(
        "/communication/polls"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create poll"
      );
    }
  };

  return (
    <section className="flex">

      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* CHANGED overflow-hidden -> overflow-visible */}
      <div className="w-full flex mx-3 flex-col overflow-visible">

        <div className="my-5 mb-10 border border-gray-200 p-2 m-5 px-2 rounded-lg">

          <h2
            className="text-center text-xl font-bold p-2 rounded-md text-white"
            style={{
              background: themeColor,
            }}
          >
            Create Polls
          </h2>

          {/* =========================
              POLL INFORMATION
          ========================== */}

          <div className="md:grid grid-cols-3 gap-5 my-5">

            <div className="flex flex-col">
              <label className="font-semibold my-2">
                Poll Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={
                  handleFormChange
                }
                placeholder="Enter Poll Title"
                className="border p-2 px-4 border-gray-400 rounded-md"
              />
            </div>

            <div className="flex flex-col">

              <label className="font-semibold my-2">
                Poll Options
              </label>

              <div className="flex xl:flex-row flex-col gap-3">

                <input
                  type="text"
                  placeholder="Poll Options"
                  className="border p-2 w-96 px-4 border-gray-400 rounded-md"
                  value={pollInput}
                  onChange={(e) =>
                    setPollInput(
                      e.target.value
                    )
                  }
                  disabled={
                    pollsOption.length >=
                    5
                  }
                />

                <button
                  type="button"
                  className="border-2 border-black rounded-md p-2 px-4"
                  onClick={
                    handleAddPolls
                  }
                  disabled={
                    pollsOption.length >=
                    5
                  }
                >
                  Add
                </button>

              </div>
            </div>

            <div className="flex flex-col">

              <label className="font-semibold my-2">
                Visibility
              </label>

              <select
                name="visibility"
                value={
                  formData.visibility
                }
                onChange={
                  handleFormChange
                }
                className="border py-2 px-4 border-gray-400 rounded-md"
              >
                <option value="">
                  Select Visibility
                </option>

                <option value="Public">
                  Public
                </option>

                <option value="Restricted">
                  Restricted
                </option>
              </select>

            </div>

            <div className="flex flex-col">

              <label className="font-semibold my-2">
                Start Date/Time
              </label>

              <input
                type="date"
                name="start_date"
                value={
                  formData.start_date
                }
                onChange={
                  handleFormChange
                }
                className="border p-2 px-4 border-gray-400 rounded-md"
              />

            </div>

            <div className="flex flex-col">

              <label className="font-semibold my-2">
                Start Time
              </label>

              <input
                type="time"
                name="start_time"
                value={
                  formData.start_time
                }
                onChange={
                  handleFormChange
                }
                className="border p-2 px-4 border-gray-400 rounded-md"
              />

            </div>

            <div className="flex flex-col">

              <label className="font-semibold my-2">
                End Date/Time
              </label>

              <input
                type="date"
                name="end_date"
                value={
                  formData.end_date
                }
                onChange={
                  handleFormChange
                }
                className="border p-2 px-4 border-gray-400 rounded-md"
              />

            </div>

            <div className="flex flex-col">

              <label className="font-semibold my-2">
                End Time
              </label>

              <input
                type="time"
                name="end_time"
                value={
                  formData.end_time
                }
                onChange={
                  handleFormChange
                }
                className="border p-2 px-4 border-gray-400 rounded-md"
              />

            </div>

          </div>

          {/* SEND EMAIL */}

          <div className="flex gap-2">

            <div className="flex gap-2 items-center">

              <input
                type="checkbox"
                name="send_mail"
                id="send_mail"
                checked={
                  formData.send_mail ===
                  true
                }
                onChange={() =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      send_mail:
                        !prev.send_mail,
                    })
                  )
                }
              />

              <label htmlFor="send_mail">
                Send Email
              </label>

            </div>

          </div>

          {/* =========================
              SHARE WITH
          ========================== */}

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
                      : tab ===
                        "individual"
                      ? "Individuals"
                      : "Groups"}
                  </h2>
                ))}

              </div>

              <div className="my-2 flex w-full">

                {/* =========================
                    INDIVIDUAL FILTER
                ========================== */}

                {share ===
                  "individual" && (
                  <div className="flex flex-col gap-2 mt-2 w-full">

                    {/* FILTER */}

                    <div className="relative w-full">

                      {/* FILTER INPUT */}

                      <div
                        className="min-h-[46px] border border-gray-300 rounded-md bg-white flex flex-wrap items-center gap-1 p-1 cursor-pointer"
                        onClick={
                          toggleFilterMenu
                        }
                      >

                        <button
                          type="button"
                          className="h-10 w-12 shrink-0 border-r border-gray-200 flex items-center justify-center text-gray-600"
                          onClick={
                            toggleFilterMenu
                          }
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
                                  {
                                    filter.label
                                  }
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

                      {/* FILTER MENU */}

                      {showFilterMenu && (
                        <div
                          className={`absolute z-[9999] left-0 w-full max-w-[520px] bg-white border border-gray-300 rounded-md shadow-xl ${
                            filterMenuPosition ===
                            "top"
                              ? "bottom-full mb-1"
                              : "top-full mt-1"
                          }`}
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >

                          {/* SEARCH */}

                          <div className="p-2 border-b border-gray-200">

                            <div className="relative">

                              <input
                                type="text"
                                value={
                                  filterSearch
                                }
                                onChange={(e) =>
                                  setFilterSearch(
                                    e.target
                                      .value
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

                          {/* SCROLLABLE FILTER VALUES */}

                          <div className="max-h-[350px] overflow-y-auto overscroll-contain">

                            {/* RESIDENT FILTERS */}

                            {FILTER_OPTIONS
                              .filter(
                                (option) =>
                                  option.label
                                    .toLowerCase()
                                    .includes(
                                      filterSearch.toLowerCase()
                                    )
                              )
                              .map(
                                (option) => {
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
                                      key={
                                        option.value
                                      }
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
                                        {
                                          option.label
                                        }
                                      </span>

                                      {selected && (
                                        <span className="ml-auto text-gray-500">
                                          ✓
                                        </span>
                                      )}

                                    </button>
                                  );
                                }
                              )}

                            {/* TOWER */}

                            <div className="border-t border-gray-200 px-4 py-3 font-semibold text-gray-700">
                              🏢 FILTER BY TOWER
                            </div>

                            {units
                              .filter(
                                (unit) =>
                                  String(
                                    unit.name ||
                                      ""
                                  )
                                    .toLowerCase()
                                    .includes(
                                      filterSearch.toLowerCase()
                                    )
                              )
                              .map(
                                (unit) => {
                                  const towerOption =
                                    {
                                      value:
                                        unit.id,
                                      label:
                                        unit.name,
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
                                        {
                                          unit.name
                                        }
                                      </span>

                                      {selected && (
                                        <span className="ml-auto text-gray-500">
                                          ✓
                                        </span>
                                      )}

                                    </button>
                                  );
                                }
                              )}

                          </div>

                          {/* CLEAR ALL */}

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

                        {filteredMembers.length >
                        0 ? (
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
                                  (
                                    member
                                  ) => ({
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
                              menuPlacement="auto"
                              styles={{
                                menu: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                                menuList: (base) => ({
                                  ...base,
                                  maxHeight: 250,
                                  overflowY: "auto",
                                }),
                              }}
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

                {share ===
                  "groups" && (
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
                      value={
                        selectedGroup
                      }
                      onChange={
                        handleGroupChange
                      }
                    >

                      <option value="">
                        Select Group
                      </option>

                      {groups.map(
                        (group) => (
                          <option
                            key={
                              group.id
                            }
                            value={
                              group.id
                            }
                          >
                            {
                              group.group_name
                            }
                          </option>
                        )
                      )}

                    </select>

                    {selectedGroup && (
                      <div className="mt-4 p-4 border rounded-md bg-gray-50">

                        <h2 className="text-lg font-semibold mb-2">
                          Group Members
                        </h2>

                        {groupMembers.length >
                        0 ? (
                          <div className="space-y-2">

                            {groupMembers.map(
                              (
                                member,
                                index
                              ) => (
                                <div
                                  key={
                                    index
                                  }
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

          {/* =========================
              DESCRIPTION
          ========================== */}

          <div className="flex flex-col">

            <label className="font-semibold my-2">
              Poll Description
            </label>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={
                handleFormChange
              }
              rows="3"
              placeholder="Description"
              className="border p-2 px-4 border-gray-400 rounded-md"
            />

          </div>

          {/* =========================
              POLL OPTIONS
          ========================== */}

          {pollsOption.length !==
            0 && (
            <div className="flex items-center gap-2 flex-wrap border rounded-md p-2 my-2">

              {pollsOption.map(
                (
                  option,
                  index
                ) => (
                  <div
                    key={index}
                    className="flex"
                  >

                    <div className="flex flex-row gap-3 items-center bg-blue-400 p-1 rounded-md">

                      <p className="bg-green-400 rounded-md text-white p-1">
                        {
                          option.pollOption
                        }
                      </p>

                      <button
                        type="button"
                        className="rounded-full bg-red-400 text-white p-1"
                        onClick={() =>
                          handleRemovePolls(
                            index
                          )
                        }
                      >
                        <MdClose />
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

          {/* =========================
              CREATE
          ========================== */}

          <div className="flex justify-center my-5 gap-2">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/communication/polls"
                )
              }
              className="bg-black text-white p-2 px-4 rounded-md font-medium flex items-center gap-2"
            >
              <MdClose />
              Cancel
            </button>

            <button
              type="button"
              onClick={
                handleSubmit
              }
              className="text-white p-2 px-4 rounded-md font-medium flex items-center gap-2"
              style={{
                background:
                  themeColor,
              }}
            >
              <FaCheck />
              Create Poll
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}

export default CreatePolls;

