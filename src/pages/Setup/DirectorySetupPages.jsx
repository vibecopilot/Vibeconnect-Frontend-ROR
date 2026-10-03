import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiEdit } from "react-icons/bi";
import { FaTrash, FaTimes } from "react-icons/fa";
import { getItemInLocalStorage } from "../../utils/localStorage";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import SiteHeader from "../../components/SiteHeader";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { deleteDirectory, getDirectory, postDirectory, putDirectory } from "../../api";

const DirectorySetupPages = () => {
  const [directories, setDirectories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  const themeColor = useSelector((state) => state.theme.color);

  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [icon, setIcon] = useState(null);
  const [existingIcon, setExistingIcon] = useState("");
  const [removeExistingIcon, setRemoveExistingIcon] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteDirectoryId, setDeleteDirectoryId] = useState(null);

  const fetchDirectories = useCallback(async () => {
    try {
      const res = await getDirectory();

      console.log("Directory API Response:", res.data);

      setDirectories(
        Array.isArray(res?.data?.directories)
          ? res.data.directories
          : []
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch directories");
      setDirectories([]);
    }
  }, []);

  useEffect(() => {
    fetchDirectories();
  }, [fetchDirectories, activeSiteId]);

  const resetForm = () => {
    setName("");
    setNumber("");
    setIcon(null);
    setExistingIcon("");
    setRemoveExistingIcon(false);
    setSelectedDirectory(null);
    setIsEdit(false);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (directory) => {
    setSelectedDirectory(directory);
    setName(directory.name || "");
    setNumber(directory.number || "");
    setExistingIcon(directory.icon_url || "");
    setRemoveExistingIcon(false);
    setIcon(null);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleCreateDirectory = async () => {
    try {
      const formData = new FormData();

      formData.append("directory[name]", name);
      formData.append("directory[number]", number);
      if (icon) {
        formData.append("directory[icon]", icon);
      }

      await postDirectory(formData);
      toast.success("Directory Created Successfully");
      fetchDirectories();
      setShowModal(false);
      resetForm();

    } catch (error) {
      console.log(error);
      toast.error("Failed To Create Directory");
    }
  };

  const handleUpdateDirectory = async () => {
    try {
      const formData = new FormData();
      formData.append("directory[name]", name);
      formData.append("directory[number]", number);

      if (icon) {
        formData.append("directory[icon]", icon);
      }

      if (removeExistingIcon) {
        formData.append("remove_icon", "true");
      }

      await putDirectory(selectedDirectory.id, formData);
      toast.success("Directory Updated Successfully");
      fetchDirectories();
      setShowModal(false);
      resetForm();

    } catch (error) {
      console.log(error);
      toast.error("Failed To Update Directory");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDirectory(deleteDirectoryId);
      toast.success("Directory Deleted Successfully");
      fetchDirectories();
      setShowDeleteModal(false);
      setDeleteDirectoryId(null);

    } catch (error) {
      toast.error("Failed To Delete Directory");
    }
  };

  return (
    <div className="flex">
      <SetupNavbar />

      <div className="w-full flex lg:mx-3 flex-col overflow-hidden">
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);
            setDirectories([]);
          }}
        />

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Directory Setup</h2>

            <button
              onClick={openCreateModal}
              className="text-white px-4 py-2 rounded flex items-center gap-2"
              style={{ background: themeColor }}
            >
              <Plus className="h-4 w-4" />
              <span>Add Directory</span>
            </button>
          </div>

          <div className="overflow-auto bg-white rounded shadow">
            <table className="w-full">
              <thead>
                <tr className="text-white" style={{ background: themeColor }}>
                  <th className="p-3 text-left">Sr No</th>
                  <th className="p-3 text-left">Icon</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Number</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(directories) &&
                  directories.map((directory, index) => (
                    <tr key={directory.id} className="border-b">
                      <td className="p-3">{index + 1}</td>

                      <td className="p-3">
                        <img
                          src={directory.icon_url}
                          alt={directory.name}
                          className="w-20 h-10 rounded object-cover"
                        />
                      </td>

                      <td className="p-3">{directory.name}</td>

                      <td className="p-3">{directory.number}</td>

                      <td className="p-3">
                        <div className="flex gap-3">
                          <button onClick={() => openEditModal(directory)}>
                            <BiEdit size={18} />
                          </button>

                          <button
                            onClick={() => {
                              setDeleteDirectoryId(directory.id);
                              setShowDeleteModal(true);
                            }}
                          >
                            <FaTrash size={18} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {directories.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500 font-medium">
                      No directories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Create / Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowModal(false)}
              />

              <div className="bg-white w-full max-w-lg rounded-lg p-5 relative z-10">
                <button
                  className="absolute top-3 right-3"
                  onClick={() => setShowModal(false)}
                >
                  <FaTimes />
                </button>

                <h2 className="text-lg font-semibold mb-4">
                  {isEdit ? "Edit Directory" : "Create Directory"}
                </h2>

                <div className="space-y-4">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Directory Name"
                    className="border w-full p-2 rounded"
                  />

                  <input
                    value={number}
                    maxLength={15}
                    minLength={10}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Phone Number"
                    className="border w-full p-2 rounded"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setIcon(e.target.files[0]);
                      }
                    }}
                  />

                  {/* Show existing attachments (only those not yet removed) */}
                  {isEdit && existingIcon && !removeExistingIcon && (
                    <div className="relative w-32">
                      <img
                        src={existingIcon}
                        alt=""
                        className="w-32 h-32 rounded object-cover border"
                      />

                      <button
                        type="button"
                        onClick={() => setRemoveExistingIcon(true)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}

                  {/* Show newly selected image preview */}
                  {icon && (
                    <div className="relative w-32">
                      <img
                        src={URL.createObjectURL(icon)}
                        className="w-32 h-32 rounded object-cover"
                        alt=""
                      />

                      <button
                        type="button"
                        onClick={() => setIcon(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={isEdit ? handleUpdateDirectory : handleCreateDirectory}
                    className="w-full bg-blue-600 text-white py-2 rounded"
                  >
                    {isEdit ? "Update Directory" : "Create Directory"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowDeleteModal(false)}
              />

              <div className="bg-white rounded-lg p-6 w-96 relative z-10">
                <h2 className="text-lg font-semibold mb-3">Delete Directory</h2>

                <p className="text-gray-600 mb-5">
                  Are you sure you want to delete this directory?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border rounded"
                  >
                    No
                  </button>

                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-white rounded bg-red-600"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectorySetupPages;