import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import MultiSelect from "../AdminHrms/Components/MultiSelect";
import { editGroups, getGroupsDetails, getSetupUsers } from "../../api";

function EditGroupDetails({ onclose, fetchGroupDetails }) {
  const [formData, setFormData] = useState({
    groupName: "",
    groupDescription: "",
    attachment: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const themeColor = useSelector((state) => state.theme.color);

  const { id } = useParams();

  // Fetch group details on mount
  useEffect(() => {
    const fetchGroupDetailsData = async () => {
      try {
        const res = await getGroupsDetails(id);
        setFormData({
          groupName: res.data.group_name,
          groupDescription: res.data.group_description,
          attachment: res.data.attachment,
        });
        setPreviewImage(res.data.attachment); // Set the initial image preview

        const selectedMembers = res.data.group_members.map((member) => ({
          value: member.user_id,
          label: `${member.user_name}`,
        }));
        setSelectedOptions(selectedMembers.map((item) => item.value));
      } catch (error) {
        console.error("Failed to fetch group details:", error);
        toast.error("Unable to fetch group details.");
      }
    };
    fetchGroupDetailsData();
  }, [id]);

  // Fetch all members on mount
  useEffect(() => {
    const fetchAllMembers = async () => {
      try {
        const res = await getSetupUsers();
        const employeesList = res.data.map((emp) => ({
          value: emp.id,
          label: `${emp.firstname} ${emp.lastname}`,
        }));
        setMembers(employeesList);
        setFilteredMembers(employeesList);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        toast.error("Unable to fetch members.");
      }
    };
    fetchAllMembers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, attachment: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("group[groupName]", formData.groupName);
      formDataToSend.append(
        "group[groupDescription]",
        formData.groupDescription
      );
      if (formData.attachment instanceof File) {
        formDataToSend.append("group[attachment]", formData.attachment);
      }

      // Send API request to update group
      const response = await editGroups(id, formDataToSend);
      if (response.status === 200) {
        toast.success("Group details updated successfully!");
        fetchGroupDetails(); // Refresh parent component data
        onclose(); // Close modal
      } else {
        toast.error("Failed to update group details.");
      }
    } catch (error) {
      console.error("Failed to update group details:", error);
      toast.error("Unable to update group details.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="max-h-screen bg-white p-4 w-[40rem] rounded-xl shadow-lg overflow-y-auto">
        <h2 className="flex items-center justify-center gap-2 border-b font-medium text-xl p-2">
          <BiEditAlt size={20} /> Edit Group
        </h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <label className="font-medium">Group Name</label>
            <input
              type="text"
              name="groupName"
              placeholder="Group name"
              value={formData.groupName}
              onChange={handleChange}
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <MultiSelect
              options={members}
              title="Select Members"
              handleSelect={(option) => {
                if (selectedOptions.includes(option)) {
                  setSelectedOptions(
                    selectedOptions.filter((item) => item !== option)
                  );
                } else {
                  setSelectedOptions([...selectedOptions, option]);
                }
              }}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              setOptions={setMembers}
              searchOptions={filteredMembers}
              compTitle="Select Group Members"
            />
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <label className="font-medium">Description</label>
          <textarea
            name="groupDescription"
            rows="3"
            placeholder="Group description"
            value={formData.groupDescription}
            onChange={handleChange}
            className="border p-2 rounded-md"
          ></textarea>
        </div>
        <div className="flex flex-col mt-4">
          <label className="font-medium">Group Cover Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded-md"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-full"
            />
          )}
        </div>
        <div className="flex justify-end items-center gap-4 mt-6">
          <button
            className="flex items-center gap-2 bg-red-400 text-white p-2 rounded-full"
            onClick={onclose}
          >
            <MdClose /> Close
          </button>
          <button
            className="flex items-center gap-2 bg-green-400 text-white p-2 rounded-full"
            onClick={handleSave}
          >
            <FaCheck /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditGroupDetails;
