import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { postForum } from "../../api";

function CreateForum() {
  const navigate = useNavigate();
  const themeColor = useSelector((state) => state.theme.color);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
    description: "",
    attachments: null,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // ✅ Image validation
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      attachments: file,
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Validation Function
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (formData.title.length < 5) {
      toast.error("Title must be at least 5 characters");
      return false;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (formData.tags && !/^#?\w+(,\s*#?\w+)*$/.test(formData.tags)) {
      toast.error("Tags format should be like: tag1, tag2");
      return false;
    }

    return true;
  };

  const handleCreateForum = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const postData = new FormData();
    postData.append("forum[thread_title]", formData.title);
    postData.append("forum[thread_category]", formData.category);
    postData.append("forum[thread_tags]", formData.tags);
    postData.append("forum[thread_description]", formData.description);

    if (formData.attachments) {
      postData.append("attachfiles[]", formData.attachments);
    }

    try {
      await postForum(postData);
      toast.success("Forum created successfully");

      // Reset form
      setFormData({
        title: "",
        category: "",
        tags: "",
        description: "",
        attachments: null,
      });

      navigate("/communication/forum");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create forum");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="w-full flex mx-3 flex-col overflow-hidden mb-5">
        <div className="flex justify-center">
          <div className="border border-gray-400 rounded-md my-5 w-4/5">
            <h2
              style={{ background: themeColor }}
              className="text-center text-xl font-bold my-2 p-2 rounded-md text-white mx-2"
            >
              Create Forum
            </h2>

            <div className="md:grid grid-cols-3 mx-5 gap-5 mt-5 mb-2">
              <div className="flex flex-col">
                <label className="font-semibold my-2">Title *</label>
                <input
                  type="text"
                  placeholder="Enter Title"
                  className="border p-2 px-4 border-gray-400 rounded-md"
                  onChange={handleChange}
                  value={formData.title}
                  name="title"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold my-2">Category *</label>
                <select
                  className="border p-2 px-4 border-gray-400 rounded-md"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="Discussion">Discussion</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Support">Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold my-2">Tags</label>
                <input
                  type="text"
                  placeholder="tag1, tag2"
                  className="border p-2 px-4 border-gray-400 rounded-md"
                  value={formData.tags}
                  name="tags"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mx-5 my-2">
              <label className="font-semibold my-2 block">
                Thread Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Description"
                className="border p-2 px-4 border-gray-400 rounded-md w-full"
              />
            </div>

            <div className="mx-5 flex flex-col gap-2">
              <label className="font-medium">
                Forum Profile Picture (Optional)
              </label>
              <input
                type="file"
                className="border p-2 rounded-md"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex justify-center my-4 gap-2">
              <button
                onClick={handleCreateForum}
                disabled={loading}
                style={{ background: themeColor }}
                className="text-white p-2 px-6 rounded-md font-medium disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Forum"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateForum;
