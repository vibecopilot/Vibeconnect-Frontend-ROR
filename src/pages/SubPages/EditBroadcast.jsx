import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReactDatePicker from "react-datepicker";
import Select from "react-select";
import {
  editBroadcastDetails,
  getBroadcastDetails,
  getGroups,
  getSetupUsers,
} from "../../api";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaCheck } from "react-icons/fa";

const EditBroadcast = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const siteId = getItemInLocalStorage("SITEID");
  const datePickerRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const [share, setShare] = useState("all");

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [formData, setFormData] = useState({
    site_id: siteId,
    notice_title: "",
    notice_discription: "",
    expiry_date: null,
    user_ids: "",
    notice_image: [],
    important: false,
    shared: "all",
    group_ids: "",
    send_email: false,
  });

  const parseIds = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw
        .map((x) => Number(String(x).trim()))
        .filter((n) => Number.isFinite(n) && n > 0);
    }
    return String(raw)
      .split(",")
      .map((x) => Number(String(x).trim()))
      .filter((n) => Number.isFinite(n) && n > 0);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExpiryDateChange = (date) => {
    setFormData((prev) => ({ ...prev, expiry_date: date }));
  };

  const handleFileChange = (files, fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: files }));
  };

  const fetchUsers = async () => {
    try {
      const response = await getSetupUsers();
      const transformedUsers = (response?.data || []).map((u) => ({
        value: u.id,
        label: `${u.firstname || ""} ${u.lastname || ""}`.trim(),
      }));
      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching setup users:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await getGroups();
      const transformedGroups = (res?.data || []).map((g) => ({
        value: g.id,
        label: g.group_name || g.name || `Group ${g.id}`,
      }));
      setGroups(transformedGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchBroadcastDetails = async () => {
    try {
      const res = await getBroadcastDetails(id);
      const response = res?.data || {};

      const sharedValue =
        response.shared ||
        response.share_with ||
        response.notice_shared ||
        response?.notice?.shared ||
        "all";

      // users ids (robust)
      const userIds = parseIds(
        response.user_ids ||
          response.notice_user_ids ||
          response.shared_user_ids ||
          response?.notice?.user_ids ||
          []
      );

      // groups ids (some APIs store as group_id as comma-separated)
      const groupIds = parseIds(
        response.group_ids ||
          response.notice_group_ids ||
          response.shared_group_ids ||
          response.group_id ||
          response.notice_group_id ||
          response?.notice?.group_ids ||
          response?.notice?.group_id ||
          []
      );

      setShare(sharedValue);

      setFormData((prev) => ({
        ...prev,
        notice_title: response.notice_title || "",
        notice_discription: response.notice_discription || "",
        expiry_date: response.expiry_date
          ? new Date(response.expiry_date)
          : null,
        important: !!response.important,
        notice_image: Array.isArray(response.notice_image)
          ? response.notice_image
          : [],
        user_ids: userIds.join(","),
        group_ids: groupIds.join(","),
        shared: sharedValue,
        send_email: !!response.send_email,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBroadcastDetails();
    fetchUsers();
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const ids = parseIds(formData.user_ids);
    const selected = users.filter((u) => ids.includes(Number(u.value)));
    setSelectedMembers(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, formData.user_ids]);

  useEffect(() => {
    const ids = parseIds(formData.group_ids);
    const selected = groups.filter((g) => ids.includes(Number(g.value)));
    setSelectedGroups(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, formData.group_ids]);

  const handleMemberSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((o) => o.value)
      : [];
    setSelectedMembers(selectedOptions || []);
    setFormData((prev) => ({ ...prev, user_ids: selectedIds.join(",") }));
  };

  const handleGroupSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((o) => o.value)
      : [];
    setSelectedGroups(selectedOptions || []);
    setFormData((prev) => ({ ...prev, group_ids: selectedIds.join(",") }));
  };

  const setShareTab = (value) => {
    setShare(value);
    setSelectedMembers([]);
    setSelectedGroups([]);
    setFormData((prev) => ({
      ...prev,
      shared: value,
      user_ids: value === "individual" ? prev.user_ids : "",
      group_ids: value === "groups" ? prev.group_ids : "",
    }));
  };

  const handleEditBroadCast = async () => {
    if (formData.notice_title === "" || !formData.expiry_date) {
      return toast.error("Please Enter Title & Expiry Date");
    }

    try {
      toast.loading("Updating Broadcast Please Wait!", { id: "edit_broadcast" });

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
      formDataSend.append("notice[shared]", share);
      formDataSend.append(
        "notice[send_email]",
        formData.send_email ? "1" : "0"
      );

      // backend same as Create
      if (share === "individual") {
        formDataSend.append("notice[user_ids]", formData.user_ids || "");
        formDataSend.append("notice[group_id]", "");
      } else if (share === "groups") {
        formDataSend.append("notice[group_id]", formData.group_ids || "");
        formDataSend.append("notice[user_ids]", "");
      } else {
        formDataSend.append("notice[user_ids]", "");
        formDataSend.append("notice[group_id]", "");
      }

      (formData.notice_image || []).forEach((file) => {
        if (file instanceof File) {
          formDataSend.append("attachfiles[]", file);
        }
      });

      await editBroadcastDetails(id, formDataSend);

      toast.dismiss("edit_broadcast");
      toast.success("Broadcast Updated Successfully");

      navigate(`/communication/broadcast/broadcast-details/${id}`, {
        state: { refresh: Date.now() },
      });
    } catch (error) {
      console.log(error);
      toast.dismiss("edit_broadcast");
      toast.error("Failed to update broadcast");
    }
  };

  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex justify-center">
          <div className="md:mx-20 my-5 mb-10 md:border md:p-2 md:px-2 rounded-lg w-full">
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
                <textarea
                  name="notice_discription"
                  value={formData.notice_discription}
                  onChange={handleChange}
                  placeholder="Enter Description"
                  rows="3"
                  className="border p-2 rounded-md border-gray-400 placeholder:text-sm"
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
                      setFormData((prev) => ({
                        ...prev,
                        important: !prev.important,
                      }))
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
                      setFormData((prev) => ({
                        ...prev,
                        send_email: !prev.send_email,
                      }))
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
                    <h2
                      className={`p-1 ${
                        share === "all" ? "bg-black text-white" : ""
                      } rounded-full px-6 cursor-pointer border-2 border-black`}
                      onClick={() => setShareTab("all")}
                    >
                      All
                    </h2>

                    <h2
                      className={`p-1 ${
                        share === "individual" ? "bg-black text-white" : ""
                      } rounded-full px-4 cursor-pointer border-2 border-black`}
                      onClick={() => setShareTab("individual")}
                    >
                      Individuals
                    </h2>

                    <h2
                      className={`p-1 ${
                        share === "groups" ? "bg-black text-white" : ""
                      } rounded-full px-4 cursor-pointer border-2 border-black`}
                      onClick={() => setShareTab("groups")}
                    >
                      Groups
                    </h2>
                  </div>

                  <div className="my-2 flex w-full">
                    {share === "individual" && (
                      <Select
                        options={users}
                        closeMenuOnSelect={false}
                        placeholder="Select User"
                        value={selectedMembers}
                        onChange={handleMemberSelectChange}
                        isMulti
                        className="w-full"
                      />
                    )}

                    {share === "groups" && (
                      <Select
                        options={groups}
                        closeMenuOnSelect={false}
                        placeholder="Select Group"
                        value={selectedGroups}
                        onChange={handleGroupSelectChange}
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
                  onClick={handleEditBroadCast}
                  className="px-4 text-white p-2 rounded-md flex items-center gap-2"
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

export default EditBroadcast;
