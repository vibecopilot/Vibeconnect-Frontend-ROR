import React from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { useSelector } from "react-redux";
import Table from "../../components/table/Table";

const RVehiclesTable = ({
  data = [],
  loading,
  error,
  currentPageNum,
  pageType,
}) => {
  const themeColor = useSelector((state) => state.theme.color);

  const isApproval = pageType === "Approvals";
  const isHistory = pageType === "History" || pageType === "Vehicle In" || pageType === "Vehicle Out";

  const columns = isApproval
    ? [
        { name: "Vehicle Number", selector: (row) => row.vehicle_number },
        { name: "Vehicle Type", selector: (row) => row.name },
        { name: "Status", selector: (row) => row.approved },
        { name: "Requested By", selector: (row) => row.created_by },
        {
          name: "Requested At",
          selector: (row) => new Date(row.created_at).toLocaleString(),
        },
      ]
    : isHistory
    ? [
        {
          name: "Sr. No",
          cell: (row, index) => (currentPageNum - 1) * 10 + (index + 1),
          width: "80px",
        },
        { name: "Vehicle Number", selector: (row) => row.registered_vehicle?.vehicle_number },
        { name: "Vehicle Type", selector: (row) => row.registered_vehicle?.vehicle_type },
        { name: "Category", selector: (row) => row.registered_vehicle?.vehicle_category },
        {
          name: "Check-In",
          selector: (row) => new Date(row.check_in).toLocaleString(),
        },
        {
          name: "Check-Out",
          selector: (row) => (row.check_out ? new Date(row.check_out).toLocaleString() : "-"),
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
        { name: "Vehicle Number", selector: (row) => row.vehicle_number },
        { name: "Category", selector: (row) => row.category },
        { name: "Slot", selector: (row) => row.slot_name },
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
