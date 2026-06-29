import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import {
  createKonstructUpdate,
  getKonstructUpdate,
  updateKonstructUpdate,
  domainPrefix,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";

const initialForm = {
  project_id: "",
  title_of: "",
  share_with: "Individuals",
  status: "Pending",
  description: "",
};

const getImageUrl = (img) => {
  if (!img) return "";
  if (typeof img === "string")
    return img.startsWith("http") ? img : domainPrefix + img;
  const path = img.document || img.url || img.image_url || "";
  if (typeof path === "string" && path)
    return path.startsWith("http") ? path : domainPrefix + path;
  return "";
};

const getImageId = (img) => {
  if (!img) return null;
  return img.id || img.image_id || null;
};

const KonstructFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const themeColor = useSelector((state) => state.theme.color);
  const siteId = getItemInLocalStorage("SITE_ID");
  const userId = getItemInLocalStorage("VIBEUSERID");
  const isEdit = Boolean(id);
  const isView = isEdit && !window.location.pathname.endsWith("/edit");

  const [form, setForm] = useState(initialForm);
  const [newFiles, setNewFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removeIds, setRemoveIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getKonstructUpdate(id);
        const data = res.data.konstruct_update || res.data;
        console.log("KonstructUpdate API response:", data);
        setForm({
          project_id: data.project_id || "",
          title_of: data.title_of || "",
          share_with: data.share_with || "Individuals",
          status: data.status || "Pending",
          description: data.description || "",
        });
        const images = data.back_images || data.attached_images || [];
        if (Array.isArray(images) && images.length > 0) {
          console.log("Back images sample:", images[0]);
          setExistingImages(images);
        }
      } catch (err) {
        toast.error("Failed to load update");
        navigate("/v1/konstruct_updates");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRemoveExisting = (index) => {
    const img = existingImages[index];
    const imgId = getImageId(img);
    if (imgId) {
      setRemoveIds((prev) => [...prev, imgId]);
    }
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("konstruct_update[project_id]", form.project_id);
      formData.append("konstruct_update[title_of]", form.title_of);
      formData.append("konstruct_update[share_with]", form.share_with);
      formData.append("konstruct_update[status]", form.status);
      formData.append("konstruct_update[description]", form.description);
      formData.append("konstruct_update[created_by_id]", userId);
      formData.append("konstruct_update[site_id]", siteId);

      newFiles.forEach((file) => {
        formData.append("konstruct_update[back_images][]", file);
      });

      if (isEdit) {
        removeIds.forEach((rid) => {
          formData.append("konstruct_update[remove_ids][]", rid);
        });
        await updateKonstructUpdate(id, formData);
        toast.success("Update updated successfully");
      } else {
        await createKonstructUpdate(formData);
        toast.success("Update created successfully");
      }
      navigate("/v1/konstruct_updates");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save update");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="flex">
        <Navbar />
        <div className="w-full flex mx-3 flex-col overflow-hidden mb-5">
          <div className="p-6 text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
   <section className="flex min-h-screen bg-gray-50">
  <Navbar />
  <div className="w-full flex flex-col overflow-hidden">
    {/* Form Container Card */}
    <div className="my-5 mb-10 border border-gray-200 p-6 m-5 rounded-xl bg-white shadow-sm max-w-4xl mx-auto w-full">
      
      {/* Header Section: Back button and Title correctly aligned */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <button
          onClick={() => navigate("/v1/konstruct_updates")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        >
          <BiArrowBack size={20} />
        </button>
        
        <h1 className="text-xl font-semibold text-gray-800 flex-1 text-center pr-8">
          {isView
            ? "Konstruct Update"
            : isEdit
              ? "Edit Konstruct Update"
              : "New Konstruct Update"}
        </h1>
      </div>

      {/* Form Section */}
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {/* Grid Layout for Row inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">
                Project ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="project_id"
                value={form.project_id}
                onChange={handleChange}
                readOnly={isView}
                className={`border bg-gray-50 p-2.5 w-full border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  isView ? "cursor-default opacity-80" : ""
                }`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title_of"
                value={form.title_of}
                onChange={handleChange}
                readOnly={isView}
                className={`border bg-gray-50 p-2.5 w-full border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  isView ? "cursor-default opacity-80" : ""
                }`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">
                Share With
              </label>
              <select
                name="share_with"
                value={form.share_with}
                onChange={handleChange}
                disabled={isView}
                className={`border bg-gray-50 p-2.5 w-full border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  isView ? "cursor-default opacity-80" : ""
                }`}
              >
                <option value="Individuals">Individuals</option>
                <option value="Group">Group</option>
                <option value="Everyone">Everyone</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={isView}
                className={`border bg-gray-50 p-2.5 w-full border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  isView ? "cursor-default opacity-80" : ""
                }`}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Full Width Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              readOnly={isView}
              rows={4}
              className={`border bg-gray-50 p-2.5 w-full border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                isView ? "cursor-default opacity-80" : ""
              }`}
            />
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Back Images
            </label>
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={getImageUrl(img)}
                      alt={`Back image ${i + 1}`}
                      className="w-32 h-24 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    {!isView && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExisting(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <BsTrash size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {!isView && (
              <FileInputBox
                handleChange={(files) => setNewFiles(files)}
                fieldName="back_images"
                isMulti={true}
                fileType="image/*"
              />
            )}
          </div>

          {/* Action Buttons */}
          {!isView && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg text-white p-2.5 px-8 font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
                style={{ background: themeColor }}
              >
                {submitting ? "Submitting..." : isEdit ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/v1/konstruct_updates")}
                className="border border-gray-300 rounded-lg p-2.5 px-8 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {isView && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(`/v1/konstruct_updates/${id}/edit`)}
                className="rounded-lg text-white p-2.5 px-8 font-medium hover:opacity-90 transition-opacity"
                style={{ background: themeColor }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => navigate("/v1/konstruct_updates")}
                className="border border-gray-300 rounded-lg p-2.5 px-8 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to List
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  </div>
</section>
  );
};

export default KonstructFormPage;
