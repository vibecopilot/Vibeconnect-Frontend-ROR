

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
  onChangeRowsPerPage
}) => {
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
        data={data}
        customStyles={customStyles || customStyle}
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        fixedHeader
        selectableRowsHighlight
        selectableRows={selectableRow}
        highlightOnHover
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
    </div>
  );
};

export default Table;
