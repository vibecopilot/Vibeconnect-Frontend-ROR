import React, { useEffect, useMemo, useState } from "react";
import {
  getTicketDashboard,
  getStatusDownload,
  getTicketStatusDownload,
  getComplaintsDrill,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import DetailPopup from "../../components/DetailPopup";

const PRIMARY_BLUE = "#1D4ED8";
const LIGHT_BLUE = "#93C5FD";


const StatCard = ({ title, value, onDownload, onClick, tone = "blue" }) => {
  const toneMap = {
    blue: {
      card: "bg-[#93C5FD]/25",
      btn: "bg-[#93C5FD]/70 text-[#1D4ED8] hover:bg-[#93C5FD]/90",
      value: "text-[#1D4ED8]",
    },
    green: {
      card: "bg-emerald-50/50",
      btn: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
      value: "text-emerald-900",
    },
    yellow: {
      card: "bg-amber-50/50",
      btn: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      value: "text-amber-900",
    },
    red: {
      card: "bg-rose-50/50",
      btn: "bg-rose-100 text-rose-700 hover:bg-rose-200",
      value: "text-rose-900",
    },
    gray: {
      card: "bg-gray-50",
      btn: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      value: "text-gray-900",
    },
  };

  const t = toneMap[tone] || toneMap.gray;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick ? (e) => { if (!e.target.closest("button")) onClick(); } : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={[
        "h-[132px] rounded-2xl p-4 flex flex-col",
        "shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
        t.card,
        onClick ? "cursor-pointer hover:shadow-md transition" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {title}
        </h3>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDownload(); }}
          title="Download"
          className={[
            "h-9 w-9 rounded-xl grid place-items-center transition",
            t.btn,
          ].join(" ")}
        >
          <FaDownload className="text-sm" />
        </button>
      </div>

      <div className="mt-auto">
        <div className={["text-3xl font-semibold", t.value].join(" ")}>
          {value ?? 0}
        </div>
      </div>
    </div>
  );
};

const statusTone = (key = "") => {
  const s = String(key).toLowerCase();
  if (s.includes("overdue") || s.includes("rejected") || s.includes("cancel"))
    return "red";
  if (s.includes("complete") || s.includes("closed") || s.includes("done"))
    return "green";
  if (s.includes("pending") || s.includes("open") || s.includes("new"))
    return "yellow";
  if (s.includes("progress") || s.includes("ongoing"))
    return "blue";
  return "gray";
};

const TicketDashboard = () => {
  const [totalTickets, setTotalTickets] = useState(0);
  const [statusData, setStatusData] = useState({});
  const [detailPopup, setDetailPopup] = useState({
    open: false,
    title: "",
    records: [],
    loading: false,
  });

  const siteId = getItemInLocalStorage("SITEID");

  useEffect(() => {
    const fetchTicketInfo = async () => {
      try {
        const res = await getTicketDashboard(siteId);
        setTotalTickets(res?.data?.total ?? 0);
        setStatusData(res?.data?.by_status ?? {});
      } catch (error) {
        console.error(error);
      }
    };
    fetchTicketInfo();
  }, [siteId]);

  const handleTicketCardClick = async (filterType, filterValue, title) => {
    setDetailPopup({ open: true, title, records: [], loading: true });
    try {
      const res = await getComplaintsDrill(filterType, filterValue, siteId, 100);
      setDetailPopup({
        open: true,
        title,
        records: res?.data?.records ?? [],
        loading: false,
      });
    } catch (err) {
      console.error("Ticket drill error:", err);
      toast.error("Failed to load ticket details");
      setDetailPopup((p) => ({ ...p, loading: false }));
    }
  };

  const handleStatusDownload = async (key) => {
    const toastId = toast.loading("Downloading, please wait...");
    try {
      const response = await getStatusDownload(key);
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers["content-type"] })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "Ticket_Status_file.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("Status downloaded successfully");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const handleTicketStatusDownload = async () => {
    const toastId = toast.loading("Downloading, please wait...");
    try {
      const response = await getTicketStatusDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers["content-type"] })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "ticket_file.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("Ticket downloaded successfully");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const cards = useMemo(
    () =>
      Object.entries(statusData || {}).map(([key, value]) => ({
        key,
        title: key,
        value,
        tone: statusTone(key),
        onDownload: () => handleStatusDownload(key),
        onClick: () => handleTicketCardClick("status", key, key),
      })),
    [statusData]
  );

  return (
    <div className="w-full px-3">
      <div className="grid grid-cols-6 sm:grid-cols-6 gap-4">
        <StatCard
          title="Tickets Created"
          value={totalTickets}
          tone="blue"
          onDownload={handleTicketStatusDownload}
          onClick={() => handleTicketCardClick("all", "", "Tickets Created")}
        />

        {cards.map((card) => (
          <StatCard
            key={card.key}
            title={card.title}
            value={card.value}
            tone={card.tone}
            onDownload={card.onDownload}
            onClick={card.onClick}
          />
        ))}
      </div>

      <DetailPopup
        isOpen={detailPopup.open}
        onClose={() => setDetailPopup((p) => ({ ...p, open: false }))}
        title={detailPopup.title}
        subtitle={`${detailPopup.records.length} record(s)`}
        records={detailPopup.records}
        loading={detailPopup.loading}
        columns={[
          { key: "ticket_number", label: "Ticket #", accessor: (r) => r.ticket_number },
          { key: "heading", label: "Heading", accessor: (r) => r.heading },
          { key: "priority", label: "Priority", accessor: (r) => r.priority },
          { key: "status", label: "Status", accessor: (r) => r.status },
          { key: "category", label: "Category", accessor: (r) => r.category },
          { key: "unit_name", label: "Unit", accessor: (r) => r.unit_name },
          { key: "created_at", label: "Created", accessor: (r) => r.created_at },
        ]}
      />
    </div>
  );
};

export default TicketDashboard;
