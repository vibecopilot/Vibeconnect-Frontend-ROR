import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiEdit } from "react-icons/bi";
import { FaTrash, FaTimes } from "react-icons/fa";
import { getBanner, postBanner, putBanner, deleteBanner } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import SiteHeader from "../../components/SiteHeader";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  const themeColor = useSelector((state) => state.theme.color);

  const [selectedBanner, setSelectedBanner] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); 
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState([]); 

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBannerId, setDeleteBannerId] = useState(null);

  const fetchBanners = useCallback(async () => {
    try {
      const res = await getBanner();
      const filteredBanners = (res.data || []).filter(
        (item) => String(item.site_id) === String(activeSiteId)
      );
      setBanners(filteredBanners);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch banners");
    }
  }, [activeSiteId]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners, activeSiteId]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setSelectedBanner(null);
    setIsEdit(false);
    setRemovedAttachmentIds([]);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (banner) => {
    setSelectedBanner(banner);
    setTitle(banner.title || "");
    setDescription(banner.description || "");
    setImage(null);
    setRemovedAttachmentIds([]);
    setIsEdit(true);
    setShowModal(true);
  };

  // Called when user clicks ❌ on a prefilled (existing) attachment image
  const handleRemoveExistingImage = (attachmentId) => {
    setRemovedAttachmentIds((prev) => [...prev, attachmentId]);
  };

  // Called when user clicks ❌ on a newly selected (local preview) image
  const handleRemoveNewImage = () => {
    setImage(null);
  };

  const handleCreateBanner = async () => {
    try {
      const formData = new FormData();
      formData.append("banner[title]", title);
      formData.append("banner[description]", description);
      formData.append("banner[site_id]", activeSiteId);

      if (image) {
        formData.append("attachments[]", image);
      }

      await postBanner(formData);
      toast.success("Banner Created Successfully");
      fetchBanners();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.log(error);
      toast.error("Failed To Create Banner");
    }
  };

  const handleUpdateBanner = async () => {
    try {
      const formData = new FormData();
      formData.append("banner[title]", title);
      formData.append("banner[description]", description);

      // Only remove attachments the user explicitly clicked ❌ on
      removedAttachmentIds.forEach((id) => {
        formData.append("banner[remove_attachment_ids][]", id);
      });

      // Add new image if user selected one
      if (image) {
        formData.append("banner[attachments][]", image);
      }

      await putBanner(selectedBanner.id, formData);
      toast.success("Banner Updated Successfully");
      fetchBanners();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.log(error);
      toast.error("Failed To Update Banner");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBanner(deleteBannerId);
      toast.success("Banner Deleted Successfully");
      fetchBanners();
      setShowDeleteModal(false);
      setDeleteBannerId(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed To Delete Banner");
    }
  };

  // Existing attachments that have NOT been marked for removal
  const visibleExistingAttachments = (selectedBanner?.attachments || []).filter(
    (att) => !removedAttachmentIds.includes(att.id)
  );

  return (
    <div className="flex">
      <SetupNavbar />

      <div className="w-full flex lg:mx-3 flex-col overflow-hidden">
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);
            setBanners([]);
          }}
        />

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Banner Management</h2>

            <button
              onClick={openCreateModal}
              className="text-white px-4 py-2 rounded flex items-center gap-2"
              style={{ background: themeColor }}
            >
              <Plus className="h-4 w-4" />
              <span>Add Banner</span>
            </button>
          </div>

          <div className="overflow-auto bg-white rounded shadow">
            <table className="w-full">
              <thead>
                <tr className="text-white" style={{ background: themeColor }}>
                  <th className="p-3 text-left">Sr No</th>
                  <th className="p-3 text-left">Banner</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {banners?.map((banner, index) => (
                  <tr key={banner.id} className="border-b">
                    <td className="p-3">{index + 1}</td>

                    <td className="p-3">
                      <img
                        src={banner.attachments?.[0]?.document}
                        alt=""
                        className="w-20 h-10 rounded object-cover"
                      />
                    </td>

                    <td className="p-3">{banner.title}</td>

                    <td className="p-3">{banner.description}</td>

                    <td className="p-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEditModal(banner)}>
                          <BiEdit size={18} />
                        </button>

                        <button
                          onClick={() => {
                            setDeleteBannerId(banner.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash size={18} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {banners.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500 font-medium">
                      No submission yet
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
                  {isEdit ? "Edit Banner" : "Create Banner"}
                </h2>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border w-full p-2 rounded"
                  />

                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border w-full p-2 rounded"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setImage(e.target.files[0]);
                      }
                    }}
                  />

                  {/* Show existing attachments (only those not yet removed) */}
                  {isEdit && visibleExistingAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {visibleExistingAttachments.map((att) => (
                        <div key={att.id} className="relative w-40">
                          <img
                            src={att.document}
                            alt=""
                            className="w-40 h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(att.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            title="Remove this image"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Show newly selected image preview */}
                  {image && (
                    <div className="relative w-40">
                      <img
                        src={URL.createObjectURL(image)}
                        alt=""
                        className="w-40 h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveNewImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        title="Remove new image"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={isEdit ? handleUpdateBanner : handleCreateBanner}
                    className="w-full bg-blue-600 text-white py-2 rounded"
                  >
                    {isEdit ? "Update Banner" : "Create Banner"}
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
                <h2 className="text-lg font-semibold mb-3">Delete Banner</h2>

                <p className="text-gray-600 mb-5">
                  Are you sure you want to delete this banner?
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

export default BannerManagement;