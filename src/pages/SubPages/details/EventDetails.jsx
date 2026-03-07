import React, { useEffect, useState } from "react";
import { BiCalendarExclamation, BiLike } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import {
  domainPrefix,
  getEventsDetails,
  getSetupUsers,
  getGroups,
} from "../../../api";
import { useParams, useLocation } from "react-router-dom";
import { FaRegFileAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

const EventDetails = () => {
  const [eventDetails, setEventDetails] = useState({});
  const [resolvedMembers, setResolvedMembers] = useState([]);
  const [resolvedGroups, setResolvedGroups] = useState([]);
  const { id } = useParams();
  const location = useLocation();

  const themeColor = useSelector((state) => state.theme.color);

  const formattedDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString();
  };

  const fetchEventDetails = async () => {
    try {
      const resp = await getEventsDetails(id);
      setEventDetails(resp?.data || {});
    } catch (error) {
      console.log(error);
      setEventDetails({});
    }
  };

  useEffect(() => {
    fetchEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location?.state?.refresh]);

  useEffect(() => {
    const onFocus = () => fetchEventDetails();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const shareWithRaw =
    eventDetails?.shared ||
    eventDetails?.share_with ||
    eventDetails?.event?.shared ||
    "";

  // ✅ normalize attachments from API (event_image / event_images / single object / string)
  const attachmentsRaw =
    eventDetails?.event_images ??
    eventDetails?.event_image ??
    eventDetails?.event?.event_images ??
    eventDetails?.event?.event_image ??
    [];

  const attachments = Array.isArray(attachmentsRaw)
    ? attachmentsRaw
    : attachmentsRaw
    ? [attachmentsRaw]
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

  // resolve members
  useEffect(() => {
    const resolveMembers = async () => {
      try {
        if (shareWithRaw && shareWithRaw !== "individual") {
          setResolvedMembers([]);
          return;
        }

        const apiUsers =
          eventDetails?.users ||
          eventDetails?.shared_users ||
          eventDetails?.members ||
          eventDetails?.event_users;

        if (Array.isArray(apiUsers) && apiUsers.length > 0) {
          setResolvedMembers(apiUsers);
          return;
        }

        const ids = parseIds(
          eventDetails?.user_ids ||
            eventDetails?.event_user_ids ||
            eventDetails?.shared_user_ids ||
            eventDetails?.event?.user_ids ||
            []
        );

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
  }, [eventDetails, shareWithRaw]);

  // resolve groups
  useEffect(() => {
    const resolveGroups = async () => {
      try {
        if (shareWithRaw && shareWithRaw !== "groups") {
          setResolvedGroups([]);
          return;
        }

        const apiGroups =
          eventDetails?.groups ||
          eventDetails?.shared_groups ||
          eventDetails?.event_groups;

        if (Array.isArray(apiGroups) && apiGroups.length > 0) {
          setResolvedGroups(apiGroups);
          return;
        }

        const ids = parseIds(
          eventDetails?.group_ids ||
            eventDetails?.event_group_ids ||
            eventDetails?.shared_group_ids ||
            eventDetails?.group_id ||
            eventDetails?.event?.group_ids ||
            eventDetails?.event?.group_id ||
            []
        );

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
  }, [eventDetails, shareWithRaw]);

  const isImage = (filePath) => {
    if (!filePath) return false;
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
    const extension = filePath.split(".").pop().split("?")[0].toLowerCase();
    return imageExtensions.includes(extension);
  };

  const getFileName = (filePath) => {
    if (!filePath) return "";
    return filePath.split("/").pop().split("?")[0];
  };

  const ChipText = (item) =>
    item?.name ||
    item?.user_name ||
    `${item?.firstname || ""} ${item?.lastname || ""}`.trim() ||
    item?.group_name ||
    item?.name ||
    "";

  // ✅ helper to show missing data in black (as requested)
  const showValue = (value) => {
    if (value === 0) return 0;
    if (value === false) return "No";
    if (value === true) return "Yes";
    if (value === null || value === undefined) return "—";
    if (typeof value === "string" && value.trim() === "") return "—";
    return value;
  };

  return (
    <section>
      <div className="m-2">
        <h2
          style={{ background: themeColor }}
          className="text-center text-xl font-bold p-2 rounded-full text-white"
        >
          Event Details
        </h2>

        <div className="my-2 mb-10 border-2 p-2 rounded-md border-gray-400">
          <div className="my-5 flex flex-col sm:grid gap-2 grid-cols-12 border-2 sm:mx-5 p-2 rounded-md border-gray-400">
            <div
              className={`py-2 px-4 rounded-md bg-blue-50 ${
                firstDocPath ? "col-span-6" : "col-span-10"
              }`}
            >
              <h1 className="text-2xl font-semibold text-center">
                {showValue(eventDetails?.event_name)}
              </h1>

              <div className="flex flex-col gap-5 w-full justify-around my-2">
                <p className="text-lg font-medium">
                  Created By: {showValue(eventDetails?.created_by)}
                </p>

                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2">
                    <p className="flex gap-1 items-center font-medium">
                      <HiLocationMarker /> Location:
                    </p>
                    <p className="text-black">{showValue(eventDetails?.venue)}</p>
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="flex gap-1 items-center font-medium">
                      <BiCalendarExclamation /> Start Date & Time:
                    </p>
                    <p className="text-black">
                      {showValue(formattedDate(eventDetails?.start_date_time))}
                    </p>
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="flex gap-1 items-center font-medium">
                      <BiCalendarExclamation /> End Date & Time:
                    </p>
                    <p className="text-black">
                      {showValue(formattedDate(eventDetails?.end_date_time))}
                    </p>
                  </div>

                  <>
                    <p className="flex gap-1 items-center font-medium">
                      <BiLike /> Coming :
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <p className="font-bold">RSVP :</p>
                      <p className="text-black">
                        {showValue(eventDetails?.rsvp_enabled)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <p className="font-bold">Important :</p>
                      <p className="text-black">
                        {showValue(eventDetails?.important)}
                      </p>
                    </div>
                  </>
                </div>
              </div>
            </div>

            {eventDetails?.qr_code ? (
              <div className="col-span-2 flex ml-4 flex-col items-center justify-center">
                <h2 className="text-lg font-semibold mb-2">QR Code</h2>
                <div className="border-dotted border-2 rounded-md border-gray-400 p-2">
                  <img
                    src={domainPrefix + eventDetails.qr_code}
                    alt="Event QR Code"
                    className="w-42 h-42 cursor-pointer"
                    onClick={() =>
                      window.open(domainPrefix + eventDetails.qr_code, "_blank")
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="col-span-2 flex ml-4 flex-col items-center justify-center">
                <h2 className="text-lg font-semibold mb-2">QR Code</h2>
                <div className="border-dotted border-2 rounded-md border-gray-400 p-2 w-42 h-42 flex items-center justify-center text-black">
                  No QR
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 mx-10 m-5">
            <div className="flex flex-col gap-2">
              <p className="font-medium">Description:</p>
              <p className="border-dotted border-2 rounded-md border-gray-400 p-2 text-black">
                {showValue(eventDetails?.discription)}
              </p>
            </div>

            <div>
              {resolvedMembers?.length > 0 ? (
                <div className="mb-4">
                  <h1 className="text-xl font-semibold">Shared With (Member)</h1>
                  <div className="border-dotted border-2 rounded-md border-gray-400 p-2 flex flex-wrap gap-2">
                    {resolvedMembers.map((user, index) => (
                      <div
                        key={index}
                        className="bg-green-500 text-white rounded-md px-4 p-1"
                      >
                        <p>{ChipText(user)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <h1 className="text-xl font-semibold">Shared With (Member)</h1>
                  <div className="border-dotted border-2 rounded-md border-gray-400 p-2 text-black">
                    —
                  </div>
                </div>
              )}

              {resolvedGroups?.length > 0 ? (
                <div>
                  <h1 className="text-xl font-semibold">Shared With (Group)</h1>
                  <div className="border-dotted border-2 rounded-md border-gray-400 p-2 flex flex-wrap gap-2">
                    {resolvedGroups.map((g, index) => (
                      <div
                        key={index}
                        className="bg-blue-500 text-white rounded-md px-4 p-1"
                      >
                        <p>{g?.group_name || g?.name || ChipText(g)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-xl font-semibold">Shared With (Group)</h1>
                  <div className="border-dotted border-2 rounded-md border-gray-400 p-2 text-black">
                    —
                  </div>
                </div>
              )}
            </div>

           <div>
  <h1 className="text-xl font-semibold">Feedback</h1>

  
  <div className="border-dotted border-2 rounded-md border-gray-400 p-2 text-black">
    {showValue(
      eventDetails?.feedback ||
      eventDetails?.event_feedback ||
      eventDetails?.event?.feedback ||
      eventDetails?.event?.event_feedback ||
      (eventDetails?.event_feedbacks?.length > 0
        ? eventDetails.event_feedbacks
            .map((f) => f.comment || f.feedback)
            .join(", ")
        : null) ||
      (eventDetails?.event?.event_feedbacks?.length > 0
        ? eventDetails.event.event_feedbacks
            .map((f) => f.comment || f.feedback)
            .join(", ")
        : null)
    )}
  </div>
  <div>
  <h1 className="text-xl font-semibold">Attachment</h1>

  <div className="border-dotted border-2 rounded-md border-gray-400 p-3">
    {firstDocUrl ? (
      isImage(firstDocUrl) ? (
        <img
          src={firstDocUrl}
          alt="Event Attachment"
          className="w-60 h-40 object-cover rounded-md cursor-pointer"
          onClick={() => window.open(firstDocUrl, "_blank")}
        />
      ) : (
        <a
          href={firstDocUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 underline"
        >
          <FaRegFileAlt />
          {getFileName(firstDocUrl)}
        </a>
      )
    ) : (
      <p className="text-black">—</p>
    )}
  </div>
</div>
</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
