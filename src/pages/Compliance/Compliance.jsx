import React, { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Table from "../../components/table/Table";
import { useSelector } from "react-redux";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";

const Compliance = () => {
  const columns = [
    {
      name: "Compliance Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Subcategory",
      selector: (row) => row.Subcategory,
      sortable: true,
    },
    {
      name: "Sub-Subcategory",
      selector: (row) => row.SubSubcategory,
      sortable: true,
      width: "300px",
    },
    {
      name: "Due Date",
      selector: (row) => row.dueDate,
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },
    {
      name: "Risk Level",
      selector: (row) => row.riskLevel,
      sortable: true,
    },
    {
      name: "Assigned To",
      selector: (row) => row.assignedTo,
      sortable: true,
    },
    {
      name: "Checklist Status",
      selector: (row) => row.status,
      sortable: true,
    },
  ];
  const data = [
    {
      name: "Minimum Wage Compliance",
      category: "Labor Law",
      Subcategory: "Minimum Wage",
      SubSubcategory: "Minimum Wages Act",
      dueDate: "10-03-2025",
      priority: "High",
      riskLevel: "High",
      assignedTo: "Aniket Parkar",
      status: "Pending",
    },
    {
      name: "GDPR Compliance",
      category: "Data Protection",
      Subcategory: "GDPR",
      SubSubcategory: "General Data Protection Regulation",
      dueDate: "01-02-2025",
      priority: "Medium",
      riskLevel: "Medium",
      assignedTo: "Mohit Yadav",
      status: "Pending",
    },
    {
      name: "HIPAA Compliance",
      category: "Healthcare",
      Subcategory: "HIPAA",
      SubSubcategory: "Health Insurance Portability and Accountability Act",
      dueDate: "15-03-2025",
      priority: "High",
      riskLevel: "High",
      assignedTo: "Aman Raturi",
      status: "In-Progress",
    },
    {
      name: "PCI DSS Compliance",
      category: "Payment Card Industry",
      Subcategory: "PCI DSS",
      SubSubcategory: "Payment Card Industry Data Security Standard",
      dueDate: "25-1-2025",
      priority: "Low",
      riskLevel: "Medium",
      assignedTo: "Ravindar Sahani",
      status: "In-Progress",
    },
    {
      name: "ISO 27001 Compliance",
      category: "Information Security",
      Subcategory: "ISO 27001",
      SubSubcategory: "International Information Security Standard",
      dueDate: "30-11-2024",
      priority: "High",
      riskLevel: "High",
      assignedTo: "Kunal Sah",
      status: "In-Progress",
    },
    {
      name: "CCPA Compliance",
      category: "Data Privacy",
      Subcategory: "CCPA",
      SubSubcategory: "California Consumer Privacy Act",
      dueDate: "01-10-2024",
      priority: "Medium",
      riskLevel: "Medium",
      assignedTo: "Pankti Seth",
      status: "Completed",
    },
    {
      name: "FISMA Compliance",
      category: "US Government",
      Subcategory: "FISMA",
      SubSubcategory: "Federal Information Security Management Act",
      dueDate: "20-08-2024",
      priority: "High",
      riskLevel: "High",
      assignedTo: "Aman Raturi",
      status: "Completed",
    },
  ];

  const themeColor = useSelector((state) => state.theme.color);

  return (
    <section className="flex">
      <Navbar />
      <div className=" w-full flex mx-3  flex-col overflow-hidden">
        <div className="my-2 flex justify-end">
          <Link
            to={"/compliance/add-compliance"}
            className="flex items-center gap-2 bg-green-500 p-2 px-4 rounded-md font-medium text-white"
          >
            <PiPlusCircle size={20} /> Add
          </Link>
        </div>

        <Table
          columns={columns}
          data={data}
          pagination
          responsive
          highlightOnHover
          pointerOnHover
        />
      </div>
    </section>
  );
};

export default Compliance;
