import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import {
  deleteOtherProject,
  getOtherProject,
  postOtherProject,
  postProjectLike,
  putOtherProject,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { PiPlusCircle } from "react-icons/pi";
import { FiEdit, FiTrash2, FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const OtherProject = () => {
  const userID = Number(getItemInLocalStorage("UserId")) || null;

  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedProjects, setLikedProjects] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    attachments: [],
    pdf: [],
  });

  /* ================= FETCH PROJECTS ================= */
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getOtherProject();

      const transformed = response.data.map((project) => ({
        ...project,
        likeCount: project.likes_count ?? project.likes?.length ?? 0,
        images:
          project.attachments?.length > 0
            ? project.attachments.map((a) =>
                a.document
                  ? `https://admin.vibecopilot.ai${a.document}`
                  : "https://via.placeholder.com/300"
              )
            : ["https://via.placeholder.com/300"],
      }));

      setProjects(transformed);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ================= HANDLERS ================= */
  const handleOpenModal = () => {
    setIsEditMode(false);
    setCurrentProjectId(null);
    setFormData({
      title: "",
      description: "",
      address: "",
      attachments: [],
      pdf: [],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    setIsEditMode(true);
    setCurrentProjectId(id);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      address: project.address || "",
      attachments: [],
      pdf: [],
    });
    setIsModalOpen(true);
  };

  const handleLikeSubmit = async (id) => {
    if (!userID) return toast.error("Please login to like");
    if (likedProjects.includes(id)) return;

    try {
      await postProjectLike({ other_project_id: id, status: "liked" });
      setLikedProjects((prev) => [...prev, id]);

      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, likeCount: p.likeCount + 1 } : p
        )
      );

      toast.success("Project liked");
    } catch {
      toast.error("Like failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteOtherProject(id);
      setProjects((p) => p.filter((proj) => proj.id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Processing...");

    const fd = new FormData();
    fd.append("other_project[title]", formData.title);
    fd.append("other_project[description]", formData.description);
    fd.append("other_project[address]", formData.address);

    if (formData.attachments?.length) {
      Array.from(formData.attachments).forEach((f) =>
        fd.append("attachments[]", f)
      );
    }
    if (formData.pdf?.length) {
      Array.from(formData.pdf).forEach((f) => fd.append("pdf[]", f));
    }

    try {
      isEditMode
        ? await putOtherProject(currentProjectId, fd)
        : await postOtherProject(fd);

      toast.success(
        isEditMode ? "Updated successfully" : "Created successfully",
        { id: toastId }
      );
      fetchProjects();
      setIsModalOpen(false);
    } catch {
      toast.error("Operation failed", { id: toastId });
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <section className="flex">
      <Navbar />

      <div className="min-h-screen bg-gray-100 w-full p-6">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">Other Projects</h1>
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
          >
            <PiPlusCircle size={20} /> Add New Project
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center h-64 items-center">
            <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const isOwnerOrAdmin =
                userID &&
                (Number(project.created_by_id) === Number(userID) ||
                  [574, 570].includes(Number(userID)));

              return (
                <div key={project.id} className="bg-white rounded-xl shadow-lg border">
                  {/* IMAGE */}
                  <div className="relative h-56">
                    <Slider {...sliderSettings}>
                      {project.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          className="h-56 w-full object-cover"
                          alt="project"
                        />
                      ))}
                    </Slider>
                  </div>

                  {/* CONTENT SECTION (UPDATED) */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="font-bold text-lg truncate">
                        {project.title}
                      </h2>

                      {isOwnerOrAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(project.id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FiEdit size ={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FiTrash2  size={16}/>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-blue-600">
                        {project.address}
                      </p>

                      <button
                        onClick={() => handleLikeSubmit(project.id)}
                        className={`flex items-center gap-1 ${
                          likedProjects.includes(project.id)
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      >
                        <FiHeart
                          fill={
                            likedProjects.includes(project.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                        <span className="text-sm">{project.likeCount}</span>
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">
              {isEditMode ? "Update Project" : "Create New Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Project Title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="border rounded-lg p-2 w-full"
              />

              <textarea
                placeholder="Description"
                rows="3"
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border rounded-lg p-2 w-full"
              />

              <input
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="border rounded-lg p-2 w-full"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setFormData({ ...formData, attachments: e.target.files })
                  }
                />
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={(e) =>
                    setFormData({ ...formData, pdf: e.target.files })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded"
                >
                  {isEditMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default OtherProject;
