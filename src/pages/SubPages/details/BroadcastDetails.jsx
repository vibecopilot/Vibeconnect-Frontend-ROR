import React, { useEffect, useState } from "react";
import {
  domainPrefix,
  getBroadcastDetails,
  getSetupUsers,
  getGroups,
} from "../../../api";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { FaRegFileAlt } from "react-icons/fa";
import {
  FaUser,
  FaShareAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaInfoCircle,
  FaUsers,
  FaLayerGroup,
  FaQrcode,
} from "react-icons/fa";

const BroadcastDetails = () => {
  const [broadcastDetails, setBroadcastDetails] = useState({});
  const [resolvedMembers, setResolvedMembers] = useState([]);
  const [resolvedGroups, setResolvedGroups] = useState([]);
  const { id } = useParams();
  const location = useLocation();

  const themeColor = useSelector((state) => state.theme.color);

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

  const getUserIdsFromDetails = (d) => {
    return parseIds(
      d?.user_ids ??
        d?.notice_user_ids ??
        d?.shared_user_ids ??
        d?.notice?.user_ids ??
        d?.notice?.notice_user_ids ??
        d?.notice?.shared_user_ids ??
        d?.notice?.notice?.user_ids ??
        []
    );
  };

  const getGroupIdsFromDetails = (d) => {
    const maybeSingle =
      d?.group_id ??
      d?.notice_group_id ??
      d?.shared_group_id ??
      d?.notice?.group_id ??
      d?.notice?.notice_group_id ??
      d?.notice?.shared_group_id ??
      null;

    const multiple = parseIds(
      d?.group_ids ??
        d?.notice_group_ids ??
        d?.shared_group_ids ??
        d?.notice?.group_ids ??
        d?.notice?.notice_group_ids ??
        d?.notice?.shared_group_ids ??
        []
    );

    if (multiple.length > 0) return multiple;
    if (maybeSingle)
      return [Number(maybeSingle)].filter((n) => Number.isFinite(n) && n > 0);
    return [];
  };

  const fetchBroadcastDetails = async () => {
    try {
      const resp = await getBroadcastDetails(id);
      setBroadcastDetails(resp?.data || {});
    } catch (error) {
      console.log(error);
      setBroadcastDetails({});
    }
  };

  useEffect(() => {
    fetchBroadcastDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location?.state?.refresh]);

  useEffect(() => {
    const onFocus = () => fetchBroadcastDetails();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  // 🔥 ADD THIS HERE (inside BroadcastDetails component)
useEffect(() => {
  const container = document.querySelector(".description-content");
  if (!container) return;

  const links = container.querySelectorAll("a");

  links.forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.style.color = "#2563eb";
    link.style.textDecoration = "underline";
    link.style.cursor = "pointer";
  });
}, [broadcastDetails]);

  const shareWithRaw =
    broadcastDetails?.shared ||
    broadcastDetails?.share_with ||
    broadcastDetails?.notice_shared ||
    broadcastDetails?.notice?.shared ||
    "";

  // resolve members ONLY when shared === individual
  useEffect(() => {
    const resolveMembers = async () => {
      try {
        const apiUsers =
          broadcastDetails?.users ||
          broadcastDetails?.shared_users ||
          broadcastDetails?.members ||
          broadcastDetails?.notice_users ||
          broadcastDetails?.notice?.users ||
          broadcastDetails?.notice?.notice_users ||
          broadcastDetails?.notice_members || // ✅ added
          broadcastDetails?.notice?.members; // ✅ added

        // ✅ FIX: sometimes API returns shareWith = "members" / "user" / "users"
        const isIndividual =
          shareWithRaw === "individual" ||
          shareWithRaw === "member" ||
          shareWithRaw === "members" ||
          shareWithRaw === "user" ||
          shareWithRaw === "users";

        if (!isIndividual) {
          setResolvedMembers([]);
          return;
        }

        // ✅ FIX: sometimes member list is nested under notice
        const directMembers =
          broadcastDetails?.notice_members ||
          broadcastDetails?.notice?.notice_members ||
          broadcastDetails?.notice?.members ||
          broadcastDetails?.members ||
          broadcastDetails?.users ||
          broadcastDetails?.shared_users;

        if (Array.isArray(directMembers) && directMembers.length > 0) {
          setResolvedMembers(directMembers);
          return;
        }

        if (Array.isArray(apiUsers) && apiUsers.length > 0) {
          setResolvedMembers(apiUsers);
          return;
        }

        const ids = getUserIdsFromDetails(broadcastDetails);
        if (ids.length === 0) {
          setResolvedMembers([]);
          return;
        }

        const usersRes = await getSetupUsers();
        const all = usersRes?.data || [];

        const normalizedAll = all
          .map((u) => ({
            id: u.id,
            name: `${u.firstname || ""} ${u.lastname || ""}`.trim(),
            firstname: u.firstname,
            lastname: u.lastname,
            user_name: u.user_name,
          }))
          .filter((u) => u.id);

        const mapped = ids
          .map((uid) => normalizedAll.find((x) => Number(x.id) === Number(uid)))
          .filter(Boolean);

        setResolvedMembers(mapped);
      } catch (e) {
        console.log("resolveMembers error:", e);
        setResolvedMembers([]);
      }
    };

    resolveMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [broadcastDetails, shareWithRaw]);

  // resolve groups ONLY when shared === groups
  useEffect(() => {
    const resolveGroups = async () => {
      try {
        const apiGroups =
          broadcastDetails?.groups ||
          broadcastDetails?.shared_groups ||
          broadcastDetails?.notice_groups ||
          broadcastDetails?.notice?.groups ||
          broadcastDetails?.notice?.notice_groups;

        if (shareWithRaw !== "groups") {
          setResolvedGroups([]);
          return;
        }

        if (Array.isArray(apiGroups) && apiGroups.length > 0) {
          setResolvedGroups(apiGroups);
          return;
        }

        const ids = getGroupIdsFromDetails(broadcastDetails);
        if (ids.length === 0) {
          setResolvedGroups([]);
          return;
        }

        const groupsRes = await getGroups();
        const allGroups = groupsRes?.data || [];

        const normalizedAll = allGroups
          .map((g) => ({
            id: g.id,
            group_name: g.group_name,
            name: g.group_name,
          }))
          .filter((g) => g.id);

        const mapped = ids
          .map((gid) => normalizedAll.find((x) => Number(x.id) === Number(gid)))
          .filter(Boolean);

        setResolvedGroups(mapped);
      } catch (e) {
        console.log("resolveGroups error:", e);
        setResolvedGroups([]);
      }
    };

    resolveGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [broadcastDetails, shareWithRaw]);

  const dateFormat = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
  };

  const isImage = (filePath) => {
    if (!filePath) return false;
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
    const extension = filePath.split(".").pop().split("?")[0].toLowerCase();
    return imageExtensions.includes(extension);
  };

  const getFileName = (filePath) => {
    if (!filePath) return "-";
    return filePath.split("/").pop().split("?")[0];
  };

  // ✅ FIX: notice_image can be object/array and can have document_url also
  const noticeImageRaw =
    broadcastDetails?.notice_image ??
    broadcastDetails?.notice_images ??
    broadcastDetails?.notice?.notice_image ??
    broadcastDetails?.notice?.notice_images ??
    [];

  const attachments = Array.isArray(noticeImageRaw)
    ? noticeImageRaw
    : noticeImageRaw
    ? [noticeImageRaw]
    : [];

  const firstAttachment = attachments?.[0] || null;

  const firstDocPath =
    firstAttachment?.document ||
    firstAttachment?.document_url ||
    firstAttachment?.file ||
    firstAttachment?.url ||
    firstAttachment?.path ||
    (typeof firstAttachment === "string" ? firstAttachment : "");

  const isAbsoluteUrl = (s) =>
    typeof s === "string" && /^https?:\/\//i.test(s);

  const firstDocUrl = firstDocPath
    ? isAbsoluteUrl(firstDocPath)
      ? firstDocPath
      : domainPrefix + firstDocPath
    : "";

  const qrValue =
    broadcastDetails?.qr_code ||
    broadcastDetails?.qrCode ||
    broadcastDetails?.notice_qr ||
    "";

  const shareWithLabel =
    shareWithRaw === "all"
      ? "All"
      : shareWithRaw === "individual"
      ? "Individuals"
      : shareWithRaw === "groups"
      ? "Groups"
      : shareWithRaw || "";

  const createdBy =
    broadcastDetails?.created_by_name ||
    broadcastDetails?.created_by_user?.name ||
    broadcastDetails?.created_by ||
    "";

  const statusType =
    broadcastDetails?.status_type ||
    broadcastDetails?.type ||
    broadcastDetails?.notice_type ||
    "";

  const importantText =
    "important" in (broadcastDetails || {})
      ? broadcastDetails?.important
        ? "Yes"
        : "No"
      : "";

  const sendEmailText =
    "send_email" in (broadcastDetails || {})
      ? broadcastDetails?.send_email
        ? "Yes"
        : "No"
      : "";

  const title = broadcastDetails?.notice_title || "Broadcast Details";

  const InfoRow = ({ icon, label, value, valueClassName = "" }) => (
    <div className="grid grid-cols-[22px_180px_1fr] items-center gap-2 py-1">
      <span className="text-gray-700">{icon}</span>
      <span className="font-semibold text-gray-900">{label}</span>
      <span className={`text-gray-900 ${valueClassName}`}>{value ?? "-"}</span>
    </div>
  );

  const DashedBox = ({ children }) => (
    <div className="border border-dashed border-gray-400 rounded-md p-3 bg-white">
      {children}
    </div>
  );

  const ChipText = (item) =>
    item?.name ||
    item?.user_name ||
    `${item?.firstname || ""} ${item?.lastname || ""}`.trim() ||
    item?.group_name ||
    "";

  // ✅ show placeholder when empty (so section doesn't look blank)
  const showDash = (condition, children) =>
    condition ? children : <div className="text-gray-900">—</div>;

  return (
    <section>
      <div className="m-2">
        <h2
          style={{ background: themeColor }}
          className="text-center text-xl font-semibold p-2 rounded-full text-white"
        >
          Broadcast Details
        </h2>

        <div className="my-2 mb-10 md:border-2 p-2 rounded-md border-gray-400 md:mx-20">
          <div className="border rounded-md border-gray-300 p-4 bg-white">
            <div className="flex justify-center mb-3">
              <h1 className="text-2xl font-semibold">{title}</h1>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-gray-100 rounded-md p-4">
                <InfoRow icon={<FaUser />} label="Created By:" value={createdBy} />
                <InfoRow
                  icon={<FaInfoCircle />}
                  label="Status Type:"
                  value={statusType}
                />
                <InfoRow
                  icon={<FaShareAlt />}
                  label="Share With:"
                  value={shareWithLabel}
                />
                <InfoRow
                  icon={<FaCalendarAlt />}
                  label="Created On:"
                  value={dateFormat(broadcastDetails?.created_at)}
                />
                <InfoRow
                  icon={<FaCalendarAlt />}
                  label="End Date & Time:"
                  value={dateFormat(broadcastDetails?.expiry_date)}
                />
                <InfoRow
                  icon={<FaInfoCircle />}
                  label="Important:"
                  value={importantText}
                  valueClassName={
                    importantText === "Yes" ? "text-green-600 font-semibold" : ""
                  }
                />
                <InfoRow
                  icon={<FaEnvelope />}
                  label="Send Email:"
                  value={sendEmailText}
                  valueClassName={
                    sendEmailText === "Yes" ? "text-green-600 font-semibold" : ""
                  }
                />
              </div>

              <div className="rounded-md p-4 flex flex-col items-center justify-start">
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <FaQrcode /> {qrValue ? "QR Code" : "Attachment"}
                </p>

                <div className="border border-dashed border-gray-400 rounded-md p-3 w-full flex justify-center">
                  {qrValue ? (
                    <div className="w-48 h-48 flex items-center justify-center text-gray-600">
                      QR Available
                    </div>
                  ) : firstDocPath ? (
                    isImage(firstDocUrl) ? (
                      <img
                        src={firstDocUrl}
                        alt="broadcast attachment"
                        className="rounded-md max-h-52 cursor-pointer"
                        onClick={() => window.open(firstDocUrl, "_blank")}
                      />
                    ) : (
                      <a
                        href={firstDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500 transition-all duration-300 text-center flex flex-col items-center"
                      >
                        <FaRegFileAlt size={50} />
                        <span className="mt-2">{getFileName(firstDocPath)}</span>
                      </a>
                    )
                  ) : (
                    <span></span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="font-semibold mb-2">Description:</p>
            <DashedBox>
            <div className="min-h-[40px]">
  {broadcastDetails?.notice_discription ? (
<div
  className="text-gray-900"
  dangerouslySetInnerHTML={{
    __html: (broadcastDetails.notice_discription || "").replace(
      /((https?:\/\/)?(www\.[^\s<]+))/g,
      (match) => {
        const url = match.startsWith("http")
          ? match
          : `https://${match}`;
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">${match}</a>`;
      }
    ),
  }}
/>
  ) : (
    <div className="text-gray-900">—</div>
  )}
</div>
            </DashedBox>
          </div>

            <div className="mt-6">
              <p className="font-bold mb-2 flex items-center gap-2">
                <FaUsers /> Shared With (Member)
              </p>
              <DashedBox>
                {shareWithRaw === "all" ? (
                  <div className="text-gray-900">All</div>
                ) : (
                  showDash(
                    resolvedMembers?.length > 0,
                    <div className="flex flex-wrap gap-2">
                      {resolvedMembers.map((u, i) => (
                        <span
                          key={i}
                          className="bg-green-500 text-white rounded-md px-3 py-1"
                        >
                          {ChipText(u)}
                        </span>
                      ))}
                    </div>
                  )
                )}
              </DashedBox>
            </div>

          <div className="mt-6">
            <p className="font-bold mb-2 flex items-center gap-2">
              <FaLayerGroup /> Shared With (Group)
            </p>
            <DashedBox>
              {showDash(
                shareWithRaw === "groups" && resolvedGroups?.length > 0,
                <div className="flex flex-wrap gap-2">
                  {resolvedGroups.map((g, i) => (
                    <span
                      key={i}
                      className="bg-blue-500 text-white rounded-md px-3 py-1"
                    >
                      {ChipText(g)}
                    </span>
                  ))}
                </div>
              )}
            </DashedBox>
          </div>

          <div className="mt-6">
            <p className="font-bold mb-2">Feedback</p>
            <DashedBox>
              <div className="min-h-[32px] text-gray-900">—</div>
            </DashedBox>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BroadcastDetails;
