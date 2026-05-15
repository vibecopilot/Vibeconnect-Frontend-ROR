import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Navbar from "../../../components/Navbar";
import {
  deleteOtherProject,
  domainPrefix,
  getOtherProject,
  postOtherProject,
  postProjectLike,
  putOtherProject,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { PiPlusCircle } from "react-icons/pi";
import { FiEdit, FiTrash2, FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const API_BASE = "https://admin.vibecopilot.ai";
const PLACEHOLDER = "https://via.placeholder.com/600x400?text=No+Image";

const OtherProject = () => {
  const userID = Number(getItemInLocalStorage("UserId")) || null;

  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Likes modal
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [likesModalData, setLikesModalData] = useState({
    title: "",
    likeCount: 0,
    users: [],
  });

  const [likedProjects, setLikedProjects] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
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
    contact_us: "",
    attachments: null,
    pdf: null,
    amenities: [
      {
        name: "",
        icon: null,
      },
    ],
  });

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      address: "",
      contact_us: "",
      attachments: null,
      pdf: null,
      amenities: [
        {
          name: "",
          icon: null,
        },
      ],
    });
    if (fileImageRef.current) fileImageRef.current.value = "";
    if (filePdfRef.current) filePdfRef.current.value = "";
  }, []);

  const buildFileUrl = (docPath) => {
    if (!docPath) return null;

    if (docPath.startsWith("http")) return docPath;

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

  const normalizeLikeUser = (like) => {
    // If API returns just number IDs
    if (typeof like === "number") {
      return { id: like, name: `User #${like}`, email: "", mobile: "", avatar: "" };
    }

    // Your backend format: { user_id, full_name, mobile, email }
    const id = Number(like?.user_id ?? like?.userId ?? like?.id) || null;

    const name =
      like?.full_name ||
      like?.name ||
      like?.username ||
      (id ? `User #${id}` : "Unknown User");

    const email = like?.email || "";
    const mobile = like?.mobile || "";

    return { id, name, email, mobile, avatar: "" };
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

  // ✅ open likes modal
  const openLikesModal = (project) => {
    const users = Array.isArray(project?.likeUsers) ? project.likeUsers : [];
    setLikesModalData({
      title: project?.title || "Project",
      likeCount: project?.likeCount ?? users.length ?? 0,
      users,
    });
    setIsLikesModalOpen(true);
  };

  const closeLikesModal = () => {
    setIsLikesModalOpen(false);
    setLikesModalData({ title: "", likeCount: 0, users: [] });
  };

  // ✅ JSX line so "others" becomes clickable
  const renderLikedByLine = (project) => {
    const count = Number(project?.likeCount || 0);
    if (!count) return null;

    const likedByMe = !!project?.likedByMe;
    const users = Array.isArray(project?.likeUsers) ? project.likeUsers : [];

    // names for displaying
    const names = users.map((u) => u?.name).filter(Boolean);

    if (likedByMe) {
      // You + others
      const othersCount = Math.max(0, count - 1);

      if (othersCount <= 0) {
        return (
          <button
            type="button"
            onClick={() => openLikesModal(project)}
            className="text-xs text-gray-600 hover:underline"
            title="View likes"
          >
            <b>View Likes</b>
          </button>
        );
      }

      return (
        <p className="text-xs text-gray-600 mb-2">
          Liked by{" "}
          <button
            type="button"
            onClick={() => openLikesModal(project)}
            className="hover:underline font-medium"
            title="View liked users"
          >
            You
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={() => openLikesModal(project)}
            className="hover:underline font-medium"
            title="View other liked users"
          >
            {othersCount} other{othersCount > 1 ? "s" : ""}
          </button>
        </p>
      );
    }

    // not liked by me
    const first = names[0] || "Someone";
    const remaining = Math.max(0, count - 1);

    if (remaining <= 0) {
      return (
        <button
          type="button"
          onClick={() => openLikesModal(project)}
          className="text-xs text-gray-600 hover:underline"
          title="View likes"
        >
          Liked by {first}
        </button>
      );
    }

    return (
      <p className="text-xs text-gray-600 mb-2">
        Liked by{" "}
        <button
          type="button"
          onClick={() => openLikesModal(project)}
          className="hover:underline font-medium"
          title="View liked users"
        >
          {first}
        </button>{" "}
        and{" "}
        <button
          type="button"
          onClick={() => openLikesModal(project)}
          className="hover:underline font-medium"
          title="View other liked users"
        >
          {remaining} other{remaining > 1 ? "s" : ""}
        </button>
      </p>
    );
  };

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getOtherProject();
      const list = Array.isArray(response?.data) ? response.data : [];
      const transformed = list.map((project) => {
        const attachments = Array.isArray(project?.attachments)
          ? project.attachments
          : [];
        const images = attachments
          .map((a) => buildFileUrl(a?.document))
          .filter(Boolean);

        const likesArr = Array.isArray(project?.likes) ? project.likes : [];

        // ✅ keep full like users for modal
        const likeUsers = likesArr.map(normalizeLikeUser);

        const likedByMe = didILikeProject(project);

        const likeCount =
          project?.likes_count ??
          (Array.isArray(project?.likes) ? project.likes.length : 0) ??
          0;

        const amenities = Array.isArray(project?.other_p_amenities)
          ? project.other_p_amenities.map((item) => ({
            id: item?.id,
            name: item?.name || "",
            icon: item?.icon_url
              ? buildFileUrl(item.icon_url)
              : null,
          }))
          : [];

        return {
          ...project,
          likeCount,
          likedByMe,
          likeUsers,
          amenities,
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

          // add You in likeUsers list on UI (if not there)
          const exists = Array.isArray(p.likeUsers)
            ? p.likeUsers.some((u) => Number(u?.id) === Number(userID))
            : false;

          const nextUsers = exists
            ? p.likeUsers
            : [{ id: userID, name: "You", email: "", avatar: "" }, ...(p.likeUsers || [])];

          return {
            ...p,
            likedByMe: true,
            likeCount: (p.likeCount || 0) + 1,
            likeUsers: nextUsers,
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

    const companyId = Number(getItemInLocalStorage("COMPANYID")) || null;

    const fd = new FormData();
    fd.append("other_project[title]", formData.title?.trim() || "");
    fd.append("other_project[description]", formData.description?.trim() || "");
    fd.append("other_project[address]", formData.address?.trim() || "");
    fd.append(
      "other_project[contact_us]",
      formData.contact_us?.trim() || ""
    );
    if (Array.isArray(formData.amenities)) {
      formData.amenities.forEach((amenity, index) => {
        fd.append(
          `other_project[other_p_amenities_attributes][${index}][name]`,
          amenity.name || ""
        );

        if (amenity.icon) {
          fd.append(`amenity_icons[${index}]`, amenity.icon);
        }
      });
    }
    if (companyId) {
      fd.append("other_project[company_id]", companyId);
    }
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

  const goToPrevImage = (projectId, total) => {
    setImageIndexes((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] ?? 0) - 1 + total) % total,
    }));
  };

  const goToNextImage = (projectId, total) => {
    setImageIndexes((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] ?? 0) + 1) % total,
    }));
  };

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
              const createdById = Number(
                project?.created_by_id ||
                project?.created_by?.id ||
                project?.created_by ||
                0
              );

              const isOwnerOrAdmin =
                Number(userID) > 0 &&
                (
                  createdById === Number(userID) ||
                  [574, 570].includes(Number(userID))
                );

              const hasMultipleImages = (project.images?.length || 0) > 1;
              const currentImgIndex = imageIndexes[project.id] ?? 0;
              const totalImages = project.images?.length || 1;

              const isLiked = likedProjects.includes(project.id);
              const likeBusy = likeLoadingIds.includes(project.id);

              return (

                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-lg border overflow-hidden "
                >
                  {/* IMAGE CAROUSEL */}
                  <div className="relative h-56 bg-gray-200 overflow-hidden">
                    <a
                      href={(project.images || [PLACEHOLDER])[currentImgIndex] ?? PLACEHOLDER}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={(project.images || [PLACEHOLDER])[currentImgIndex] ?? PLACEHOLDER}
                        className="h-56 w-full object-cover cursor-pointer"
                        alt={project?.title ? `Project: ${project.title}` : "project"}
                        onError={(e) => {
                          e.currentTarget.src = PLACEHOLDER;
                        }}
                      />
                    </a>

                    {hasMultipleImages && (
                      <>
                        <button
                          type="button"
                          onClick={() => goToPrevImage(project.id, totalImages)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 z-10"
                          title="Previous"
                        >
                          <FiChevronLeft size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => goToNextImage(project.id, totalImages)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 z-10"
                          title="Next"
                        >
                          <FiChevronRight size={18} />
                        </button>
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                          {project.images.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() =>
                                setImageIndexes((prev) => ({ ...prev, [project.id]: idx }))
                              }
                              className={`h-1.5 rounded-full transition-all ${idx === currentImgIndex
                                ? "w-4 bg-white"
                                : "w-1.5 bg-white/50"
                                }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
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
                        className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-gray-400"
                          } ${likeBusy ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
                          }`}
                        type="button"
                        title={isLiked ? "Liked" : "Like"}
                      >
                        <FiHeart fill={isLiked ? "currentColor" : "none"} />
                        <span className="text-sm">{project.likeCount ?? 0}</span>
                      </button>

                    </div>
                    {project.contact_us && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-blue-600 whitespace-nowrap">
                          Contact Number :
                        </span>

                        <span className="text-sm text-gray-700 break-all">
                          {project.contact_us}
                        </span>
                      </div>
                    )}

                    {/* ✅ Clickable "You and others" */}
                    {renderLikedByLine(project)}

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {project.description || "—"}
                    </p>
                    {/* Amenities */}
                    {Array.isArray(project?.amenities) &&
                      project.amenities.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-sm font-semibold text-gray-700 mb-2">
                            Amenities
                          </h3>

                          <div className="flex flex-wrap gap-3">
                            {project.amenities.map((amenity) => (
                              <div
                                key={amenity.id}
                                className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
                              >
                                {amenity.icon ? (
                                  <img
                                    src={amenity.icon}
                                    alt={amenity.name}
                                    className="h-8 w-8 rounded object-cover cursor-pointer"
                                    onClick={() => window.open(amenity.icon, "_blank")}
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : null}

                                <span className="text-sm text-gray-700">
                                  {amenity.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / UPDATE MODAL */}
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
                onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                className="border rounded-lg p-2 w-full"
              />

              <input
                placeholder="Contact Number"
                value={formData.contact_us}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    contact_us: e.target.value,
                  }))
                }
                className="border rounded-lg p-2 w-full"
              />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700">
                    Amenities
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        amenities: [
                          ...prev.amenities,
                          {
                            name: "",
                            icon: null,
                          },
                        ],
                      }))
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    + Add Amenity
                  </button>
                </div>

                {formData.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="Amenity Name"
                      value={amenity.name}
                      onChange={(e) => {
                        const updated = [...formData.amenities];
                        updated[index].name = e.target.value;

                        setFormData((prev) => ({
                          ...prev,
                          amenities: updated,
                        }));
                      }}
                      className="border rounded-lg p-2 w-full"
                    />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const updated = [...formData.amenities];
                        updated[index].icon = e.target.files[0];

                        setFormData((prev) => ({
                          ...prev,
                          amenities: updated,
                        }));
                      }}
                      className="w-full"
                    />

                    {formData.amenities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.amenities.filter(
                            (_, i) => i !== index
                          );

                          setFormData((prev) => ({
                            ...prev,
                            amenities: updated,
                          }));
                        }}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

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

      {/* ✅ LIKES USERS MODAL */}
      {isLikesModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div>
                <h3 className="text-lg font-bold">Liked Users</h3>
                <p className="text-xs text-gray-600">
                  {likesModalData?.title || "Project"} • {likesModalData?.likeCount || 0} like(s)
                </p>
              </div>
              <button
                type="button"
                onClick={closeLikesModal}
                className="p-2 hover:bg-gray-100 rounded"
                title="Close"
              >
                <FaTimes />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto p-4">
              {Array.isArray(likesModalData?.users) && likesModalData.users.length > 0 ? (
                <div className="space-y-3">
                  {likesModalData.users.map((u, idx) => (
                    <div
                      key={`${u?.id ?? "x"}-${idx}`}
                      className="flex items-center gap-3 border rounded-lg p-3"
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                        {u?.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u?.name || "user"}
                            className="h-10 w-10 object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        ) : (
                          <span className="text-sm font-semibold text-gray-600">
                            {(u?.name || "U").slice(0, 1).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold truncate">{u?.name || "Unknown User"}</p>
                        <p className="text-xs text-gray-600 truncate">
                          {u?.email ? u.email : "—"}
                          {u?.mobile ? ` • ${u.mobile}` : ""}
                          {(!u?.email && !u?.mobile && u?.id) ? `User ID: ${u.id}` : ""}
                        </p>

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No likes found.</p>
              )}
            </div>

            <div className="px-5 py-4 border-t flex justify-end">
              <button
                type="button"
                onClick={closeLikesModal}
                className="px-4 py-2 border rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OtherProject;
