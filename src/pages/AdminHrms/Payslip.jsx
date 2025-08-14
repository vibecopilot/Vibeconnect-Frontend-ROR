import React, { useEffect, useState } from "react";

import Table from "../../components/table/Table";

import { useSelector } from "react-redux";
import Select from "react-select";
import AdminHRMS from "./AdminHrms";
import { PiPlusCircle } from "react-icons/pi";
import {
  generateSiteWiseSlip,
  getEmployeeAssociations,
  getSiteWiseSalarySlip,
  updateBulkPaymentStatus,
  updatePaymentStatus,
} from "../../api";
import toast from "react-hot-toast";
import { Pagination } from "antd";
const Payslip = () => {
  const today = new Date();
  const defaultMonth = today.toISOString().slice(0, 7);
  const themeColor = useSelector((state) => state.theme.color);
  const [generateModal, setGenerateModal] = useState(false);
  const [currentSlipMonth, setCurrentSlipMonth] = useState(defaultMonth);
  const [slipMonth, setSlipMonth] = useState("");
  const [selectedOption, setSelectedOption] = useState([]);
  const empId = localStorage.getItem("HRMS_EMPLOYEE_ID");
  const [sites, setSites] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [bulkPay, setBulkPay] = useState(false);
  const fetchAssociatedSites = async () => {
    try {
      const res = await getEmployeeAssociations(empId);

      if (Array.isArray(res) && res.length > 0) {
        const associatedSites = res[0].multiple_associated_info || [];

        const allSites = associatedSites.map((site) => ({
          value: site.id,
          label: site.site_name,
        }));

        setSites(allSites);
      } else {
        // Only "All Sites" when no sites from API
        setSites([{ label: "All Sites", value: null }]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssociatedSites();
  }, []);

  const handleSalaryStatus = async (id) => {
    try {
      const payload = {
        payment_status: "paid",
      };
      const res = await updatePaymentStatus(id, payload);
      toast.success("Payroll marked paid");
      fetchSalarySlips();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "employee ID",
      selector: (row) => row.employee_id,
      sortable: true,
    },
    {
      name: "Employee Name",
      selector: (row) => row.employee_name,
      sortable: true,
    },
    {
      name: "status",
      selector: (row) => row.payment_status,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          {row.payment_status === "pending" ? (
            <button
              className="bg-green-400 rounded-full p-1 px-6 font-medium text-white "
              onClick={() => handleSalaryStatus(row.id)}
            >
              Mark paid
            </button>
          ) : row.payment_status === "pending" ? (
            <p className="text-green-500 font-medium">Paid</p>
          ) : (
            ""
          )}
        </div>
      ),
      sortable: true,
    },
  ];

  const handleGenerateSlip = async () => {
    if (selectedOption.length === 0) {
      return toast.error("Please select site");
    }
    if (slipMonth === "") {
      return toast.error("Please select month and year");
    }
    try {
      const payload = {
        site_id: selectedOption.map((option) => option.value),
        month: selectedMonth,
        year: selectedYear,
      };
      const res = await generateSiteWiseSlip(payload);
      setGenerateModal(false);
      setSelectedOption([]);
      fetchSalarySlips();
    } catch (error) {
      console.log(error);
    }
  };
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [slipData, setSlipData] = useState([]);
  const fetchSalarySlips = async () => {
    try {
      const res = await getSiteWiseSalarySlip(
        selectedSite.value,
        currentMonth,
        currentYear,
        status,
        searchText,
        pageNumber + 1
      );
      setSlipData(res?.results);
      setTotalPages(res?.total_pages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (sites.length > 0 && !selectedSite) {
      setSelectedSite(sites[0]);
    }
  }, [sites]);
  useEffect(() => {
    if (selectedSite && currentMonth && currentYear) {
      fetchSalarySlips();
    }
  }, [selectedSite, currentMonth, currentYear, status, searchText, pageNumber]);

  const [bulkMonth, setBulkMonth] = useState("");
  const [bulkSelectedMonth, setBulkSelectedMonth] = useState(null);
  const [bulkSelectedYear, setBulkSelectedYear] = useState(null);

  const handleBulkStatus = async () => {
    try {
      const payload = {
        site_ids: selectedOption.map((option) => option.value),
        month: bulkSelectedMonth,
        year: bulkSelectedYear,
        payment_status: "paid",
      };
      const res = await updateBulkPaymentStatus(payload);
      toast.success("Status updated success fully");
      setBulkPay(false);
      setSelectedOption([]);
      fetchSalarySlips();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="flex ml-20">
      <AdminHRMS />
      <div className=" w-full flex m-3 flex-col overflow-hidden">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            name=""
            id=""
            placeholder="Search by employee name"
            className="border rounded-md p-2 min-w-96"
          />
          <input
            type="month"
            value={currentSlipMonth}
            onChange={(e) => {
              const [year, month] = e.target.value.split("-").map(Number);
              setCurrentSlipMonth(e.target.value);
              setCurrentMonth(month);
              setCurrentYear(year);
            }}
            className="border rounded-md p-2 w-60"
          />
          <select
            name=""
            id=""
            className="border rounded-md p-2 w-60"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select Status</option>

            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
          <Select
            options={sites}
            value={selectedSite} // ✅ full object
            onChange={(selectedOption) => {
              setSelectedSite(selectedOption || null); // ✅ store full object
            }}
            noOptionsMessage={() => "No sites Available"}
            placeholder="Select Site"
            maxMenuHeight={500}
            className="z-20 w-80 text-black"
          />
          <div className=" flex justify-end my-2">
            <button
              onClick={() => setGenerateModal(true)}
              style={{ background: themeColor }}
              className="border-2 font-semibold  hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center  gap-2 justify-center"
            >
              Generate
            </button>
          </div>
          <div className=" flex justify-end my-2">
            <button
              onClick={() => setBulkPay(true)}
              style={{ background: themeColor }}
              className="border-2 font-semibold bg-green-400 hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center  gap-2 justify-center"
            >
              Bulk Pay
            </button>
          </div>
        </div>
        <Table columns={columns} data={slipData} pagination={false} />
        {slipData?.length > 0 && (
          <div className={"w-full mt- flex justify-end border rounded-md p-2"}>
            <Pagination
              current={pageNumber + 1}
              total={totalPages * 10}
              pageSize={10}
              onChange={(page) => {
                setPageNumber(page - 1);
              }}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
      {generateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 pb-2 rounded-xl shadow-lg ">
            <h2 className="font-semibold text-lg border-b mb-1">
              Generate Site wise payslip
            </h2>

            <div className="grid gap-2 max-h-96  py-2 hide-scrollbar">
              <div>
                <label htmlFor="" className="font-medium">
                  Select site
                </label>
                <Select
                  options={sites}
                  onChange={(selectedOption) => {
                    setSelectedOption(selectedOption);
                    console.log(selectedOption);
                  }}
                  isMulti
                  noOptionsMessage={() => "No sites Available"}
                  placeholder="Select Sites"
                  maxMenuHeight={500}
                  className="z-50 w-96 text-black"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Select Month & Year
                </label>
                <input
                  type="month"
                  value={slipMonth}
                  onChange={(e) => {
                    const [year, month] = e.target.value.split("-").map(Number);
                    setSlipMonth(e.target.value);
                    setSelectedMonth(month);
                    setSelectedYear(year);
                  }}
                  className="border rounded-md p-2"
                />
              </div>

              <div className="flex items-center gap-2 justify-center border-t p-1">
                <button
                  className="rounded-full px-4 p-1  bg-red-400 text-white"
                  onClick={() => setGenerateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-full px-4 p-1 bg-green-400 text-white"
                  onClick={handleGenerateSlip}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {bulkPay && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 pb-2 rounded-xl shadow-lg ">
            <h2 className="font-semibold text-lg border-b mb-1">
              Mark Paid Site wise
            </h2>

            <div className="grid gap-2 max-h-96  py-2 hide-scrollbar">
              <div>
                <label htmlFor="" className="font-medium">
                  Select site
                </label>
                <Select
                  options={sites}
                  onChange={(selectedOption) => {
                    setSelectedOption(selectedOption);
                    console.log(selectedOption);
                  }}
                  isMulti
                  noOptionsMessage={() => "No sites Available"}
                  placeholder="Select Sites"
                  maxMenuHeight={500}
                  className="z-50 w-96 text-black"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Select Month & Year
                </label>
                <input
                  type="month"
                  value={bulkMonth}
                  onChange={(e) => {
                    const [year, month] = e.target.value.split("-").map(Number);
                    setBulkMonth(e.target.value);
                    setBulkSelectedMonth(month);
                    setBulkSelectedYear(year);
                  }}
                  className="border rounded-md p-2"
                />
              </div>

              <div className="flex items-center gap-2 justify-center border-t p-1">
                <button
                  className="rounded-full px-4 p-1  bg-red-400 text-white"
                  onClick={() => setBulkPay(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-full px-4 p-1 bg-green-400 text-white"
                  onClick={handleBulkStatus}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Payslip;