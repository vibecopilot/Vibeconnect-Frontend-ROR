import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  getSoftServicesDetails,
  getSoftServiceSchedule,
  getSoftServiceLogs,
    getGenericSubInfos,
} from "../../../api";
import { FaQrcode, FaRegFileAlt } from "react-icons/fa";
import Table from "../../../components/table/Table";
import { dateTimeFormat } from "../../../utils/dateUtils";
import DatePicker from "react-datepicker";``
import "react-datepicker/dist/react-datepicker.css";
import { BsEye } from "react-icons/bs";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import SoftServiceQr from "./assetSubDetails/SoftServiceQr";


const ServiceDetails = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [serviceFor, setserviceFor] = useState("schedule");

  const themeColor = useSelector((state) => state.theme.color);
  const [details, setDetails] = useState({});
  const [qrCode, setQrCode] = useState(false);
  const { id } = useParams();
  const [logsDetails, setlogsDetails] = useState([]);
  const [ScheduleData, setScheduleData] = useState([]);
  const [filteredScheduleData, setFilteredScheduleData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [genericSubInfos, setGenericSubInfos] = useState([]);
  useEffect(() => {
    const fetchServiceDetails = async () => {
      const ServiceDetailsResponse = await getSoftServicesDetails(id);
      setDetails(ServiceDetailsResponse.data.soft_service || ServiceDetailsResponse.data);
      console.log(ServiceDetailsResponse);
      console.log("Service Details API:", ServiceDetailsResponse.data);

    };
    fetchServiceDetails();
  }, []);
 const fetchScheduleData = async () => {
  try {
    const scheduleRes = await getSoftServiceSchedule(id);

    const activities =
      scheduleRes?.data?.activities ||
      scheduleRes?.data?.data?.activities ||
      scheduleRes?.data?.data ||
      [];

    setScheduleData(activities);
    setFilteredScheduleData(activities);

    console.log("Schedule table", activities);
  } catch (error) {
    console.log(error);
  }
};
 const fetchLogsDetails = async () => {
  try {
    const logsDetailsResp = await getSoftServiceLogs(id);

    const activities =
      logsDetailsResp?.data?.activities ||
      logsDetailsResp?.data?.data?.activities ||
      logsDetailsResp?.data?.data ||
      [];

    const filteredData = activities.filter((activity) => {
      const activityDate = new Date(activity.start_time);

      const activityLocalDate =
        activityDate.getFullYear() +
        "-" +
        String(activityDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(activityDate.getDate()).padStart(2, "0");

      return (
        activityLocalDate === selectedDate &&
        activity.status !== "pending" &&
        activity.status !== "overdue"
      );
    });

    console.log("Filtered Logs:", filteredData);

    setlogsDetails(filteredData);
  } catch (error) {
    console.error("Error fetching logs:", error);
  }
};
useEffect(() => {

  const fetchGenericSubInfos = async () => {
    try {

      const res = await getGenericSubInfos();

      const data =
        res?.data?.generic_sub_infos ||
        res?.data?.data ||
        res?.data ||
        [];

      setGenericSubInfos(data);

      console.log("Generic Sub Infos:", data);

    } catch (error) {
      console.log(error);
    }
  };

  fetchGenericSubInfos();

}, []);

  useEffect(() => {
    fetchScheduleData();
    fetchLogsDetails(); // Fetch logs based on the current id and date
  }, [id]);
  // Fetch data when the selected date changes
  useEffect(() => {
    fetchLogsDetails(); // Fetch data based on the selected date and status 'complete'
  }, [selectedDate]);

  // Handle date input change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Decrease date by 1 day
  const handlePrevDate = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1); // Decrease by 1 day
    setSelectedDate(prevDate.toISOString().split("T")[0]); // Update selectedDate
  };

  // Increase date by 1 day
  const handleNextDate = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1); // Increase by 1 day
    setSelectedDate(nextDate.toISOString().split("T")[0]); // Update selectedDate
  };

  // Function to format the date from start_time
  // Function to format the date from start_time
  const formatDate = (isoString) => {
    return isoString.split("T")[0]; // Extract YYYY-MM-DD part directly from ISO string
  };

  const [searchText, setSearchText] = useState("");
 const handleSearch = (e) => {
  const value = e.target.value.toLowerCase();
  setSearchText(value);

  let filtered = [...ScheduleData];

  // Apply search
  if (value) {
    filtered = filtered.filter((item) =>
      item.assigned_name?.toLowerCase().includes(value)
    );
  }

  // Apply date filter ALSO
  filtered = filterByDateRange(filtered, startDate, endDate);

  setFilteredScheduleData(filtered);
};

  const FormatedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  const domainPrefix = "https://admin.vibecopilot.ai";
  console.log(details.qr_code_image_url);
  const isImage = (filePath) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
    const extension = filePath.split(".").pop().split("?")[0].toLowerCase();
    return imageExtensions.includes(extension);
  };
  const getFileName = (filePath) => {
    return filePath.split("/").pop().split("?")[0];
  };
  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
const filterByDateRange = (data, start, end) => {
  if (start && end) {
    const startTime = new Date(start).setHours(0, 0, 0, 0);
    const endTime = new Date(end).setHours(23, 59, 59, 999);

    return data.filter((item) => {
      const itemTime = new Date(item.start_time).getTime();
      return itemTime >= startTime && itemTime <= endTime;
    });
  }
  return data;
};
 const ScheduleColumn = [
  {
    name: "View",
    cell: (row) => (
      <div className="flex items-center gap-4">
        <Link to={`/soft-service/schedule-task-details/${id}/${row.id}`}>
          <BsEye size={15} />
        </Link>
      </div>
    ),
    maxWidth: "2rem",
  },
  {
    name: "Checklist",
    selector: (row) => row.checklist?.name,
    sortable: true,
  },
  {
    name: "Start Date",
    selector: (row) => dateFormat(row.start_time),
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
  },
  {
    name: "Assigned To",
    selector: (row) => row.assigned_name || "-",
    sortable: true,
  },
];

const attachments =
  details?.attachments ??
  details?.documents ??
  details?.files ??
  details?.service_attachments ??
  details?.soft_service_attachments ??
  [];

console.log("Attachments array:", attachments);
const selectedSubInfo = genericSubInfos.find(
  (item) => item.id === details.generic_sub_info_id
);

const handleDownload = (type = "pdf") => {
  if (!ScheduleData || ScheduleData.length === 0) {
    alert("No data available to download");
    return;
  }

  const headers = ["Checklist", "Start Date", "Status", "Assigned To"];

  const rows = ScheduleData.map((row) => [
    row.checklist?.name || "",
    dateFormat(row.start_time),
    row.status || "",
    row.assigned_name || "",
  ]);

  // CSV DOWNLOAD
  if (type === "csv") {
    const csvData = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "soft_service_schedule.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // PDF DOWNLOAD
  if (type === "pdf") {
    const doc = new jsPDF();

    doc.text("Soft Service Schedule", 14, 15);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
    });

    doc.save("soft_service_schedule.pdf");
  }
};
  return (
    <section>
      <div className="m-2">
        <h2
          style={{ background: themeColor }}
          className="text-center text-xl font-bold p-2 rounded-full text-white"
        >
          Service Details
        </h2>
        <div className="my-2 mb-10 md:border-2 p-2 px-5 rounded-md border-gray-400 md:mx-20">
          <div className="flex gap-2 justify-end">
            <button
              className="flex gap-2 items-center justify-center border-2 border-black px-4 p-1 rounded-full hover:bg-black hover:text-white transition-all duration-500"
              onClick={() => setQrCode(true)}
            >
              <FaQrcode /> QR Code
            </button>

            <button
              onClick={() => handleDownload("pdf")}
              className="flex gap-2 items-center border-2 border-black px-4 p-1 rounded-full hover:bg-black hover:text-white transition-all duration-300"
                >
              Download PDF
            </button>

            <button onClick={() => handleDownload("csv")}>
             Download CSV
            </button>
            <Link
              to={`/services/edit-service/${id}`}
              className="flex gap-2 items-center border-2 border-black px-4 p-1 rounded-full hover:bg-black transition-all duration-300 hover:text-white"
            >
              <BiEditAlt />
              Edit Details
            </Link>
          </div>
          <div className="flex justify-center m-5">
            <h1 className="p-2 border-2 border-black md:px-28 text-xl rounded-md font-semibold">
              {details.name}
            </h1>
          </div>
          <div className="my-2 flex justify-end"></div>
          <div className="p-5 grid md:grid-cols-3 gap-5 bg-gray-100 rounded-md font-medium">
            <div className="grid grid-cols-2">
              <p>Building :</p>
              <p className="text-sm">{details.building_name}</p>
            </div>
            <div className="grid grid-cols-2">
              <p>Floor :</p>
              <p className="text-sm">{details.floor_name}</p>
            </div>
            <div className="grid grid-cols-2">
              <p>Units :</p>
              <div className="text-sm">
                {details.units?.map((unit) => (
                  <p key={unit.id}>{unit.name}</p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2">
  <p>Sub Info :</p>
  <p className="text-sm">{selectedSubInfo?.name || "N/A"}</p>
</div>

            {/* <p>Wing:</p>
            <p>Area:</p> */}
            {/* <p>Created By:</p> */}
            <div className="grid grid-cols-2">
              <p>Created On :</p>
              <p className="text-sm">{FormatedDate(details.created_at)}</p>
            </div>
            <div className="grid grid-cols-2">
              <p>Updated On :</p>
              <p className="text-sm">{FormatedDate(details.updated_at)}</p>
            </div>
          </div>
          <h1 className="border-b border-black font-semibold my-5">
            Attachments
          </h1>
         <div className="flex gap-4 flex-wrap my-4 items-center text-center">
  {attachments.length > 0 ? (
    attachments.map((doc, index) => (
      <div key={doc.id || index}>
        {isImage(domainPrefix + doc.document) ? (
          <img
            src={domainPrefix + doc.document}
            alt={`Attachment ${index + 1}`}
            className="w-40 h-28 object-cover rounded-md"
            onClick={() =>
              window.open(domainPrefix + doc.document, "_blank")
            }
          />
        ) : (
          <a
            href={domainPrefix + doc.document}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-all duration-300 flex flex-col items-center"
          >
            <FaRegFileAlt size={50} />
            {getFileName(doc.document)}
          </a>
        )}
      </div>
    ))
  ) : (
    <p className="text-center w-full">No Attachments</p>
  )}
</div>

          <div className="flex justify-center items-center  md:p-0 p-2">
            <div className="w-full my-2">
              <div className="flex items-center gap-4 border-b border-gray-200">
                <button
                  className={`font-medium ${
                    serviceFor === "schedule"
                      ? "text-black border-b border-black"
                      : "text-gray-400"
                  }`}
                  onClick={() => setserviceFor("schedule")}
                >
                  Schedule
                </button>
                <button
                  className={`font-medium ${
                    serviceFor === "logs"
                      ? "border-b border-black text-black"
                      : "text-gray-400"
                  }`}
                  onClick={() => setserviceFor("logs")}
                >
                  Logs
                </button>
              </div>
            </div>
          </div>
          {serviceFor === "schedule" && (
            <div className="flex flex-col w-full">
              <div className="z-20 w-full flex gap-2 justify-between md:flex-row flex-col">
                <input
                  type="text"
                  name=""
                  value={searchText}
                  onChange={handleSearch}
                  id=""
                  placeholder="Search by assigned to"
                  className="p-2 border-gray-300 rounded-md w-full  my-2 outline-none border"
                />
               <DatePicker
  selectsRange={true}
  startDate={startDate}
  endDate={endDate}
  onChange={(update) => {
    const [start, end] = update;

    setStartDate(start);
    setEndDate(end);

    const filtered = filterByDateRange(ScheduleData, start, end);
    setFilteredScheduleData(filtered);
  }}
  isClearable={true}
  placeholderText="Search by Date range"
  className="p-2 border-gray-300 rounded-md w-64 my-2 outline-none border"
/>
              </div>
             <Table columns={ScheduleColumn} data={filteredScheduleData || []} />
            </div>
          )}
          {serviceFor === "logs" && (
            <div>
              {/* Buttons for Prev Date and Next Date */}
              <div className="flex gap-4 justify-end my-2">
                <button
                  onClick={handlePrevDate}
                  className="bg-gray-200 px-2 rounded-md py-2"
                >
                  <HiArrowLeft />
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="p-1 border-gray-300 rounded-md w-64  outline-none border"
                />

                <button
                  onClick={handleNextDate}
                  className="bg-gray-200 px-2 rounded-md py-2"
                >
                  <HiArrowRight />
                </button>
              </div>

             <div>
       {logsDetails.map((task) => {
       // Get submissions safely
        const submissions = task.activity_log?.submissions || [];
    

    return (
      <div
        key={task.id}
        className="my-4 flex flex-col bg-gray-50 shadow-custom-all-sides p-4 rounded-md gap-2"
      >
        {/* Checklist Name */}
        <div className="grid grid-cols-12">
          <div className="col-span-11 items-center">
            <p className="font-medium">Checklist Name :</p>
            <p className="w-full">
              {task.checklist?.name || "No Checklist Name"}
            </p>
          </div>
        </div>

        {/* If no submissions */}
        {submissions.length === 0 && (
          <p className="text-gray-500">No submissions available</p>
        )}

        {/* Render submissions */}
        {submissions.map((submission, subIndex) => (
          <div key={submission.id} className="my-2">
            <div className="flex gap-4 items-center bg-green-100 mb-2 p-2 rounded-md">
              <p className="font-medium">Question {subIndex + 1}:</p>
              <p>{submission.question?.name || "No Question"}</p>
            </div>

            <div className="flex gap-4 items-center bg-blue-100 mb-2 p-2 rounded-md">
              <p className="font-medium">Answer :</p>
              <p>{submission.value || "No Answer"}</p>
            </div>

            {/* Attachments */}
            <span className="font-medium text-gray-500">Attachments :</span>
            <div className="flex gap-4 flex-wrap my-4 items-center text-center">
              {submission.question_attachments?.length > 0 ? (
                submission.question_attachments.map((attachment, i) => (
                  <img
                    key={i}
                    src={domainPrefix + attachment.document}
                    alt={`Attachment ${i + 1}`}
                    className="w-40 h-28 object-cover rounded-md"
                    onClick={() =>
                      window.open(domainPrefix + attachment.document, "_blank")
                    }
                  />
                ))
              ) : (
                <p>No Attachments</p>
              )}
            </div>

            {/* Performed by & timestamp */}
            <div className="flex justify-between">
              <p>
                <span className="font-medium text-gray-500">Performed by: </span>
                {task.assigned_name || "Unknown"}
              </p>
              <p className="text-sm text-gray-500">
                {dateTimeFormat(submission.updated_at) || "No timestamp available"}
              </p>
            </div>
          </div>
        ))}

        {/* Comment */}
        <p>
          <span className="font-medium">Comment: </span>
          <span className="text-violet-500 font-medium">
            {task.comment || "No Comment"}
          </span>
        </p>
      </div>
    );
  })}
</div>

            </div>
          )}
        </div>
      </div>
      {qrCode && (
        <SoftServiceQr
          assetName={details.name}
          onClose={() => setQrCode(false)}
          QR={domainPrefix + details.qr_code_image_url}
          softId={details.id}
        />
      )}
    </section>
  );
};

export default ServiceDetails;
