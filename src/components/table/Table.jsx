import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import axios from "axios";
import { getAdminPerPageComplaints } from "../../api";

const Table = ({
  columns,
  title,
  height,
  pagination = true,
  data,
  apiEndpoint,
  customStyles,
  onChangePage,
  selectableRow,
  onSelectedRows,
  paginationServer = false,
  paginationTotalRows = 0,
  onChangeRowsPerPage,
  // Server-side pagination metadata
  totalEntries,
  totalPages,
  currentPage,
  rowsPerPage = 10,
}) => {
  // Support both total_entries and total_count from API
  const totalRows = paginationTotalRows || totalEntries || 0;
  
  console.log("Table Props - totalRows:", totalRows, "currentPage:", currentPage, "rowsPerPage:", rowsPerPage, "paginationServer:", paginationServer);
  
  const themeColor = useSelector((state) => state.theme.color);

  
  const customStyle = {
    headRow: {
      style: {
        background: themeColor,
        color: "white",
        fontSize: "10px",
      },
    },
    headCells: {
      style: {
        textTransform: "uppercase",
        paddingLeft: "16px",
        paddingRight: "16px",
        width: "150px",
        
      },
    },
    // cells: {
    //   style: {
    //
    //   },
    // },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        whiteSpace: "nowrap",
        fontSize: "14px",
        lineHeight: "24px",
        width: "150px",
        // color: "#6b7280",
        color: "#4b5260",
        fontWeight: 450
      },
    },
  };

  const handleSelectedRowsChange = ({ selectedRows }) => {
    // Call the parent's callback with the selected rows
    if (onSelectedRows) {
      onSelectedRows(selectedRows);
    }
  };

  return (
    <div className="rounded">
      <DataTable
        title={title}
        responsive
        columns={columns}
        data={Array.isArray(data) ? data.filter(item => item && typeof item === 'object') : []}
        customStyles={customStyles || customStyle}
        pagination={pagination}
        paginationServer={pagination && paginationServer}
        paginationTotalRows={pagination ? totalRows : 0}
        paginationDefaultPage={pagination ? currentPage : 1}
        paginationPerPage={pagination ? rowsPerPage : 10}
        paginationRowsPerPageOptions={pagination ? [10, 25, 50, 100] : []}
        fixedHeader
        selectableRowsHighlight
        selectableRows={selectableRow}
        highlightOnHover
        onChangePage={pagination ? onChangePage : undefined}
        onChangeRowsPerPage={pagination ? onChangeRowsPerPage : undefined}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
    </div>
  );
};

export default Table;
