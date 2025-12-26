import React from "react";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { FaCheck, FaTimes } from "react-icons/fa";
import Table from "../../components/table/Table";

const RVehiclesTable = ({
  data = [],
  loading,
  error,
  currentPageNum,
  pageType,
  onApprove,
  onReject,
}) => {
  const isApproval = pageType === "Approvals";
  const isHistory =
    pageType === "History" ||
    pageType === "Vehicle In" ||
    pageType === "Vehicle Out";

  const columns = isApproval
    ? [
        {
          name: "Vehicle Number",
          selector: (row) => row.vehicle_number || "-",
        },
        {
          name: "Vehicle Type",
          selector: (row) => row.name || "-",
        },
        {
          name: "Requested By",
          selector: (row) => row.created_by || "-",
        },
        {
          name: "Requested At",
          selector: (row) =>
            row.created_at
              ? new Date(row.created_at).toLocaleString()
              : "-",
        },
        {
          name: "Approval",
          center: true,
          cell: (row) => (
            <div className="flex justify-center gap-3">
              <button
                onClick={() =>
                  onApprove(row.registered_vehicle_id || row.id)
                }
                className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center"
              >
                <FaCheck size={14} />
              </button>

              <button
                onClick={() => onReject(row.id)}
                className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ),
        },
      ]
    : isHistory
    ? [
        {
          name: "Sr. No",
          cell: (_, index) => (currentPageNum - 1) * 10 + index + 1,
          width: "80px",
        },
        {
          name: "Vehicle Number",
          selector: (row) =>
            row.registered_vehicle?.vehicle_number || "-",
        },
        {
          name: "Vehicle Type",
          selector: (row) =>
            row.registered_vehicle?.vehicle_type || "-",
        },
        {
          name: "Category",
          selector: (row) =>
            row.registered_vehicle?.vehicle_category || "-",
        },
        {
          name: "Check-In",
          selector: (row) =>
            row.check_in
              ? new Date(row.check_in).toLocaleString()
              : "-",
        },
        {
          name: "Check-Out",
          selector: (row) =>
            row.check_out
              ? new Date(row.check_out).toLocaleString()
              : "-",
        },
      ]
    : [
        {
          name: "Action",
          cell: (row) => (
            <div className="flex items-center gap-4">
              <Link to={`/admin/rvehicles-details/${row.id}`}>
                <BsEye size={15} />
              </Link>
              <Link to={`/admin/edit-rvehicles/${row.id}`}>
                <BiEdit size={15} />
              </Link>
            </div>
          ),
        },
        {
          name: "Vehicle Number",
          selector: (row) => row.vehicle_number || "-",
        },
        {
          name: "Category",
          selector: (row) => row.category || "-",
        },
        {
          name: "Slot",
          selector: (row) => row.slot_name || "-",
        },
      ];

  if (loading) return <p className="p-5 text-center">Loading...</p>;
  if (error) return <p className="p-5 text-center text-red-500">{error}</p>;

  return (
    <div className="w-full">
      <Table columns={columns} data={data} isPagination={false} />
    </div>
  );
};

export default RVehiclesTable;
