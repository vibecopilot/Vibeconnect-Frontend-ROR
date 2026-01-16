import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { getItemInLocalStorage } from "../utils/localStorage";
import {
  API_URL,
  getOutsideUsers,
  getProjectUsers,
  getVibeBackground,
  postNewProjectBoard,
  updateVibeBoardTemplate,
} from "../api";

import CustomBoardCreate from "./SubPages/Projectmanagement/BoardCreation";
import ProjectBoard from "./SubPages/Projectmanagement/ProjectBoard";
import ProjectBoardTemplate from "./SubPages/Projectmanagement/ProjectBoardTemplate";

const ProjectManagement = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const navigate = useNavigate();

  // ✅ Today date
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const todayDate = `${year}-${month}-${day}`;

  // ✅ user id
  const user_id = getItemInLocalStorage("VIBEUSERID");

  // ✅ background image should be STRING
  const [selectedBg, setSelectedBg] = useState("");

  // modals
  const [isModalOpen, setIsModalAddProjectOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // template
  const [selectedTemplateimage, setselectedTemplateimage] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [board_id_for_Temp, setboard_id_for_Temp] = useState("");

  // form
  const [boardName, setBoardName] = useState("");
  const [emails, setEmails] = useState([]);
  const [emailsOutsider, setEmailsOutsider] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedOptionOutsider, setSelectedOptionOutsider] = useState([]);
  const [dueDate, setDueDate] = useState(todayDate);
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState("");
  const [isSecondInputVisible, setIsSecondInputVisible] = useState(false);

  // ✅ Fetch users once
  useEffect(() => {
    if (!user_id) {
      console.warn("VIBEUSERID missing in localStorage");
      return;
    }
    GetUsersData();
    GetUsersDataOutsider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  // ✅ Fetch background once
  useEffect(() => {
    const Get_Background = async () => {
      try {
        if (!user_id) return;

        const resp = await getVibeBackground(user_id);

        // expected: { success: true, data: { image, index } }
        if (resp?.success && resp?.data?.image) {
          const full = `${API_URL}${resp.data.image}`;
          setSelectedBg(full);
        } else {
          setSelectedBg(""); // fallback no background
        }
      } catch (error) {
        console.error("Background Error:", error);
        setSelectedBg("");
      }
    };

    Get_Background();
  }, [user_id]);

  const openProjectModal = () => {
    setIsModalAddProjectOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalAddProjectOpen(false);
    setIsSecondInputVisible(false);
    setIsTemplateModalOpen(false);
  };

  const handleChangeSelect = (opt) => setSelectedOption(opt || []);
  const handleChangeSelectOutsider = (opt) => setSelectedOptionOutsider(opt || []);
  const handleFirstInputClick = () => setIsSecondInputVisible(true);

  const GetUsersData = async () => {
    const org_id = localStorage.getItem("VIBEORGID");
    try {
      const jsonData = await getProjectUsers(user_id, org_id);

      if (jsonData?.success) {
        const users = jsonData.data || [];
        const AssignEmails = users.map((user) => ({
          value: user.user_id,
          label: user.email,
        }));
        setEmails(AssignEmails);
      } else {
        console.log("getProjectUsers failed:", jsonData);
      }
    } catch (error) {
      console.error("GetUsersData Error:", error);
    }
  };

  const GetUsersDataOutsider = async () => {
    try {
      const jsonData = await getOutsideUsers(user_id);

      if (jsonData?.success) {
        const users = jsonData.data || [];
        const AssignEmailsOutsider = users.map((user) => ({
          value: user.id,
          label: user.email,
        }));
        setEmailsOutsider(AssignEmailsOutsider);
      } else {
        console.log("getOutsideUsers failed:", jsonData);
      }
    } catch (error) {
      console.error("GetUsersDataOutsider Error:", error);
    }
  };

  const handleDueDateChange = (e) => setDueDate(e.target.value);

  const goToProject = (id) => {
    navigate(`/project-management/customBoard/?id=${id}`);
  };

  const createBoard = async () => {
    if (!user_id) {
      toast.error("User ID missing (VIBEUSERID). Please login again.");
      return;
    }

    if (!boardName.trim()) {
      toast.error("Please Enter Board Name.");
      return;
    }

    const idString =
      Array.isArray(selectedOption) && selectedOption.length
        ? selectedOption.map((x) => parseInt(x.value, 10)).join(",")
        : "";

    const idStringOutsider =
      Array.isArray(selectedOptionOutsider) && selectedOptionOutsider.length
        ? selectedOptionOutsider.map((x) => parseInt(x.value, 10)).join(",")
        : "";

    const formData = new FormData();
    formData.append("board_name", boardName.trim());
    formData.append("assign_to", idString);
    formData.append("created_by", user_id);
    formData.append("due_date", dueDate);
    formData.append("access_to", idStringOutsider);
    formData.append("user_id", user_id);
    if (profile) formData.append("image", profile);
    formData.append("summery", summary || "");

    try {
      const boardResp = await postNewProjectBoard(formData);

      if (boardResp?.success && boardResp?.data?.id) {
        setboard_id_for_Temp(boardResp.data.id);
        setIsTemplateModalOpen(true);
      } else {
        console.log("postNewProjectBoard failed:", boardResp);
        toast.error("Unable to create board");
      }
    } catch (error) {
      console.error("createBoard error:", error);
      toast.error("Something went wrong while creating board");
    }
  };

  const Update_board_template = async () => {
    if (!board_id_for_Temp || !selectedTemplateId) {
      toast.error("Please select a template");
      return;
    }

    const formData = new FormData();
    formData.append("board_id", board_id_for_Temp);
    formData.append("template_id", selectedTemplateId);

    try {
      const response = await updateVibeBoardTemplate(formData);
      if (response?.success) {
        goToProject(board_id_for_Temp);
      } else {
        console.log("updateVibeBoardTemplate failed:", response);
        toast.error("Unable to update template");
      }
    } catch (error) {
      console.error("Update_board_template error:", error);
      toast.error("Template update failed");
    }
  };

  document.title = `Project Management - Vibe Connect`;

  return (
    <section
      className="flex min-h-screen"
      style={{
        background: selectedBg
          ? `url(${selectedBg}) no-repeat center center / cover`
          : "#f8fafc",
      }}
    >
      <Navbar />

      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <section className="my-2">
          <div>
            <div className="flex justify-end">
              <div
                onClick={openProjectModal}
                className="flex cursor-pointer bg-white shadow-custom-all-sides bg-opacity-55 rounded-md p-1 px-4 text-gray-800 items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                <p className="font-medium">Add Project</p>
              </div>
            </div>

            {isModalOpen && (
              <CustomBoardCreate
                closeProjectModal={closeProjectModal}
                profile={profile}
                setProfile={setProfile}
                setSummary={setSummary}
                summary={summary}
                boardName={boardName}
                setBoardName={setBoardName}
                handleChangeSelect={handleChangeSelect}
                emails={emails}
                handleChangeSelectOutsider={handleChangeSelectOutsider}
                emailsOutsider={emailsOutsider}
                dueDate={dueDate}
                setDueDate={setDueDate}
                handleFirstInputClick={handleFirstInputClick}
                createBoard={createBoard}
                isSecondInputVisible={isSecondInputVisible}
                handleDueDateChange={handleDueDateChange}
                todayDate={todayDate}
              />
            )}

            {isTemplateModalOpen && (
              <ProjectBoardTemplate
                isOpen={isTemplateModalOpen}
                closeProjectModal={closeProjectModal}
                selectedimage={selectedTemplateimage}
                setselectedimage={setselectedTemplateimage}
                selectedTemplateId={selectedTemplateId}
                setSelectedTemplateId={setSelectedTemplateId}
                board_id_for_Temp={board_id_for_Temp}
                goToProject={goToProject}
                Update_board_template={Update_board_template}
              />
            )}
          </div>

          <ProjectBoard />
        </section>
      </div>
    </section>
  );
};

export default ProjectManagement;
