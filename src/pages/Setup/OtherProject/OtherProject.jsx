import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const API_BASE = "https://admin.vibecopilot.ai";
const PLACEHOLDER = "https://via.placeholder.com/600x400?text=No+Image";

const OtherProject = () => {
  const userID = Number(getItemInLocalStorage("UserId")) || null;

  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedProjects, setLikedProjects] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoadingIds, setLikeLoadingIds] = useState([]);

  const fileImageRef = useRef(null);
  const filePdfRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    attachments: null, 
    pdf: null, 
  });

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      address: "",
      attachments: null,
      pdf: null,
    });
    if (fileImageRef.current) fileImageRef.current.value = "";
    if (filePdfRef.current) filePdfRef.current.value = "";
  }, []);

  const buildImageUrl = (docPath) => {
    if (!docPath || typeof docPath !== "string") return null;
    if (docPath.startsWith("http://") || docPath.startsWith("https://")) return docPath;
    return `${API_BASE}${docPath}`;
  };

  const extractLikeUserName = (like) => {
    const u = like?.user || like?.liked_by || like?.created_by || null;
    return (
      u?.username ||
      u?.full_name ||
      u?.name ||
      like?.username ||
      like?.full_name ||
      like?.name ||
      like?.email ||
      null
    );
  };

  const didILikeProject = (project) => {
    if (!userID) return false;
    const likes = Array.isArray(project?.likes) ? project.likes : [];
    return likes.some((l) => {
      const candidate =
        typeof l === "number"
          ? l
          : Number(l?.user_id ?? l?.userId ?? l?.user?.id ?? l?.id);
      return Number(candidate) === Number(userID);
    });
  };

  const buildLikedByText = (likeNames = [], didILike = false) => {
    const clean = (Array.isArray(likeNames) ? likeNames : []).filter(Boolean);
    if (clean.length === 0) return "";

    if (didILike) {
      const withYou = clean.includes("You") ? clean : ["You", ...clean];
      const othersCount = Math.max(0, withYou.length - 1);
      if (othersCount === 0) return "Liked by You";
      return `Liked by You and ${othersCount} other${othersCount > 1 ? "s" : ""}`;
    }

    const first = clean[0];
    const remaining = clean.length - 1;
    if (remaining <= 0) return `Liked by ${first}`;
    return `Liked by ${first} and ${remaining} other${remaining > 1 ? "s" : ""}`;
  };

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getOtherProject();
      const list = Array.isArray(response?.data) ? response.data : [];

      const transformed = list.map((project) => {
        const attachments = Array.isArray(project?.attachments) ? project.attachments : [];
        const images = attachments
          .map((a) => buildImageUrl(a?.document))
          .filter(Boolean);

        const likesArr = Array.isArray(project?.likes) ? project.likes : [];
        const likeNamesRaw = likesArr.map(extractLikeUserName).filter(Boolean);

        const likedByMe = didILikeProject(project);
        const likeNames = likedByMe
          ? ["You", ...likeNamesRaw.filter((n) => n !== "You")]
          : likeNamesRaw;

        const likeCount =
          project?.likes_count ??
          (Array.isArray(project?.likes) ? project.likes.length : 0) ??
          0;

        return {
          ...project,
          likeCount,
          likeNames,
          likedByMe,
          images: images.length > 0 ? images : [PLACEHOLDER],
        };
      });

      setProjects(transformed);

      if (userID) {
        const likedIds = transformed.filter((p) => p.likedByMe).map((p) => p.id);
        setLikedProjects(likedIds);
      } else {
        setLikedProjects([]);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [userID]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenModal = () => {
    setIsEditMode(false);
    setCurrentProjectId(null);
    resetForm();
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
      attachments: null,
      pdf: null,
    });

    if (fileImageRef.current) fileImageRef.current.value = "";
    if (filePdfRef.current) filePdfRef.current.value = "";

    setIsModalOpen(true);
  };

  const handleLikeSubmit = async (id) => {
    if (!userID) return toast.error("Please login to like");
    if (likedProjects.includes(id)) return;
    if (likeLoadingIds.includes(id)) return;

    try {
      setLikeLoadingIds((prev) => [...prev, id]);

      await postProjectLike({ other_project_id: id, status: "liked" });

      setLikedProjects((prev) => [...prev, id]);

      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;

          const existingNames = Array.isArray(p.likeNames) ? p.likeNames : [];
          const nextNames = ["You", ...existingNames.filter((n) => n !== "You")];

          return {
            ...p,
            likedByMe: true,
            likeCount: (p.likeCount || 0) + 1,
            likeNames: nextNames,
          };
        })
      );

      toast.success("Project liked");
    } catch (err) {
      console.log(err);
      toast.error("Like failed");
    } finally {
      setLikeLoadingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteOtherProject(id);
      setProjects((p) => p.filter((proj) => proj.id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Processing...");

    const fd = new FormData();
    fd.append("other_project[title]", formData.title?.trim() || "");
    fd.append("other_project[description]", formData.description?.trim() || "");
    fd.append("other_project[address]", formData.address?.trim() || "");

    if (formData.attachments && formData.attachments.length) {
      Array.from(formData.attachments).forEach((f) => fd.append("attachments[]", f));
    }
    if (formData.pdf && formData.pdf.length) {
      Array.from(formData.pdf).forEach((f) => fd.append("pdf[]", f));
    }

    try {
      if (isEditMode && currentProjectId) {
        await putOtherProject(currentProjectId, fd);
      } else {
        await postOtherProject(fd);
      }

      toast.success(isEditMode ? "Updated successfully" : "Created successfully", {
        id: toastId,
      });

      setIsModalOpen(false);
      resetForm();
      fetchProjects();
    } catch (err) {
      console.log(err);
      toast.error("Operation failed", { id: toastId });
    }
  };

  const baseSliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      adaptiveHeight: false,
    }),
    []
  );

  return (
    <section className="flex">
      <Navbar />

      <div className="min-h-screen bg-gray-100 w-full p-6">
        <div className="flex justify-between mb-8 gap-4 flex-wrap">
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
            <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const createdById =
                project?.created_by_id ??
                project?.created_by?.id ??
                project?.created_by ??
                null;

              const isOwnerOrAdmin =
                userID &&
                (Number(createdById) === Number(userID) ||
                  [574, 570].includes(Number(userID)));

              const hasMultipleImages = (project.images?.length || 0) > 1;
              const sliderSettings = {
                ...baseSliderSettings,
                dots: hasMultipleImages,
                arrows: hasMultipleImages,
                infinite: hasMultipleImages,
              };

              const isLiked = likedProjects.includes(project.id);
              const likeBusy = likeLoadingIds.includes(project.id);

              const likedByText =
                project.likeCount > 0
                  ? buildLikedByText(project.likeNames || [], isLiked)
                  : "";

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-lg border overflow-hidden"
                >
                  {/* IMAGE */}
                  <div className="relative h-56 bg-gray-200">
                    <Slider {...sliderSettings}>
                      {(project.images || [PLACEHOLDER]).map((img, i) => (
                        <img
                          key={`${project.id}-${i}`}
                          src={img}
                          className="h-56 w-full object-cover"
                          alt={project?.title ? `Project: ${project.title}` : "project"}
                          onError={(e) => {
                            e.currentTarget.src = PLACEHOLDER;
                          }}
                        />
                      ))}
                    </Slider>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <h2
                        className="font-bold text-lg truncate"
                        title={project.title || ""}
                      >
                        {project.title || "—"}
                      </h2>

                      {isOwnerOrAdmin && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleEdit(project.id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                            type="button"
                          >
                            <FiEdit size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(project.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                            type="button"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-2 gap-3">
                      <p
                        className="text-sm text-blue-600 truncate"
                        title={project.address || ""}
                      >
                        {project.address || "—"}
                      </p>

                      <button
                        onClick={() => handleLikeSubmit(project.id)}
                        disabled={isLiked || likeBusy}
                        className={`flex items-center gap-1 ${
                          isLiked ? "text-red-500" : "text-gray-400"
                        } ${likeBusy ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}
                        type="button"
                        title={isLiked ? "Liked" : "Like"}
                      >
                        <FiHeart fill={isLiked ? "currentColor" : "none"} />
                        <span className="text-sm">{project.likeCount ?? 0}</span>
                      </button>
                    </div>

                    {likedByText ? (
                      <p className="text-xs text-gray-600 mb-2">{likedByText}</p>
                    ) : null}

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {project.description || "—"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                className="border rounded-lg p-2 w-full"
              />

              <textarea
                placeholder="Description"
                rows="3"
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                className="border rounded-lg p-2 w-full"
              />

              <input
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, address: e.target.value }))
                }
                className="border rounded-lg p-2 w-full"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Images</p>
                  <input
                    ref={fileImageRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, attachments: e.target.files }))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-600">PDF</p>
                  <input
                    ref={filePdfRef}
                    type="file"
                    multiple
                    accept="application/pdf,.pdf"
                    onChange={(e) => setFormData((p) => ({ ...p, pdf: e.target.files }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
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
