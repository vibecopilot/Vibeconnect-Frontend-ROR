import React, { useEffect, useState } from "react";

import Table from "../../components/table/Table";
import AdminHRMS from "./AdminHrms";
import { Link } from "react-router-dom";
import { PiPlusCircle } from "react-icons/pi";
import Select from "react-select";
import {
  deleteCTCTemplate,
  deleteNewCTCTemplate,
  getCTCTemplate,
  showCTCTemplates,
  getHrmsCtcTemplate,
  deleteHrmsCtcTemplate,
  getAvailableSites,
  getHrmsCtcFiltereTemplate,
  getEmployeeAssociations,
  getHrmsCtcTemplateonId,
  assignHrmsCtcTemplate,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { useSelector } from "react-redux";
import { GrHelpBook } from "react-icons/gr";
import { BiEdit } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { components } from "react-select";
import { Pagination } from "antd";

const CTCTemplate = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const listItemStyle = {
    listStyleType: "disc",
    color: "gray",
    fontSize: "14px",
    fontWeight: 500,
  };
  const [allSites, setAllSites] = useState([]);
  useEffect(() => {
    const fetchAllSites = async () => {
      try {
        const SiteDetails = await getAvailableSites(hrmsOrgId);

        setAllSites(SiteDetails);
      } catch (error) {
        console.log("error getting site data", error);
      }
    };
    fetchAllSites();
  }, [hrmsOrgId]);

  const getSiteNames = (siteIds) => {
    if (!siteIds || !Array.isArray(siteIds)) return "None";

    return siteIds
      .map((id) => {
        const numericId = typeof id === "string" ? parseInt(id) : id;
        const site = allSites.find((s) => s.id === numericId);
        return site?.site_name || `ID: ${numericId}`;
      })
      .join(", ");
  };
  const [assign, setAssign] = useState(false);
  const [tempId, setTempId] = useState("");
  const [associatedSites, setAssociatedSites] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const handleAssignModal = async (id) => {
    setAssign(true);
    setTempId(id);
    try {
      const res = await getHrmsCtcTemplateonId(id);
      const sites = res?.associated_details?.map((details) => ({
        value: details?.id,
        label: details?.name,
      }));
      console.log(sites);
      setAssociatedSites(sites);
    } catch (error) {
      console.log(error);
    }
  };
  const columns = [
    {
      name: "Id",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Template Name",
      selector: (row) => row.template_name,
      sortable: true,
    },
    {
      name: "Associated Sites",
      cell: (row) => (
        <div
          title={getSiteNames(row.associated)}
          className="whitespace-pre-wrap"
        >
          {row.associated?.length > 0 ? getSiteNames(row.associated) : "None"}
        </div>
      ),
      sortable: true,
    },
    // {
    //   name: "No. Of Employees Covered",
    //   selector: (row) => row.Label,
    //   sortable: true,
    // },
    // {
    //   name: "Fixed Allowances",
    //   selector: (row) => row.fixed_salary_allowance.length,
    //   sortable: true,
    // },
    // {
    //   name: "Other Allowances	",
    //   selector: (row) => row.Country,
    //   sortable: true,
    // },
    // {
    //   name: "Fixed Deductions",
    //   selector: (row) => row.fixed_salary_deductions.length,
    //   sortable: true,
    // },
    {
      name: "Action",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/hrms/ctc/ctc-template/edit/${row.id}`}>
            <BiEdit size={15} />
          </Link>
          <button
            className="bg-green-500  px-4 text-white rounded-full"
            onClick={() => handleAssignModal(row.id)}
          >
            Assign
          </button>
          <button
            className="text-red-400"
            onClick={() => handleDeleteTemplate(row.id)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const handleDeleteTemplate = async (id) => {
    try {
      await deleteHrmsCtcTemplate(id);
      fetchCTCTemplates();
      toast.success("CTC template deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };
  const empId = localStorage.getItem("HRMS_EMPLOYEE_ID");
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [totalPages, setTotalPage] = useState(0);
  const [selectedSite, setSelectedSite] = useState(null);
  const [site, setSite] = useState("");
  const fetchCTCTemplates = async () => {
    try {
      const res = await getHrmsCtcFiltereTemplate(
        hrmsOrgId,
        pageNumber + 1,
        searchText,
        // site
        selectedSite
      );
      const results = res?.results;
      setTemplates(results);
      setFilteredTemplates(results);
      setTotalPage(res?.total_pages);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load templates");
    }
  };

  useEffect(() => {
    if (allSites.length > 0) {
      // Only fetch templates after sites are loaded
      fetchCTCTemplates();
    }
  }, [allSites, selectedSite, searchText]);
  const [sites, setSites] = useState([]);
  const fetchAssociatedSites = async () => {
    try {
      const res = await getEmployeeAssociations(empId);
      console.log(res);

      if (Array.isArray(res) && res.length > 0) {
        const associatedSites = res[0].multiple_associated_info || [];

        const allSites = associatedSites.map((site) => ({
          value: site.id,
          label: site.site_name,
        }));

        // Add "All Sites" option at the beginning
        const sitesWithAllOption = [
          { label: "All Sites", value: null },
          ...allSites,
        ];

        setSites(sitesWithAllOption);
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
  // {
  //   "site_id": [4,6],
  //   "ctc_template_id": 56

  // }
  const handleAssign = async () => {
    if (selectedOption.length === 0) {
      return toast.error("Please select Sites");
    }
    try {
      const payload = {
        ctc_template_id: tempId,
        site_id: selectedOption.map((option) => option.value),
      };

      await assignHrmsCtcTemplate(payload);
      toast.success("Templated Assigned successfully");
      setAssign(false);
      fetchCTCTemplates();
    } catch (error) {
      console.log(error);
    }
  };
  console.log(selectedOption);
  return (
    <section className="flex ml-20">
      <AdminHRMS />
      <div className=" w-full flex m-3 flex-col overflow-hidden">
        <div className=" flex  justify-between my-2 gap-4">
          <input
            type="text"
            placeholder="Search by name "
            className="border border-gray-400 w-full placeholder:text-sm rounded-lg p-2"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            {sites.length === 0 ? (
              <p className="text-grey-500">No site associated</p>
            ) : (
              <Select
                options={sites}
                onChange={(selectedOption) => {
                  setSelectedSite(selectedOption?.value || null);
                  setPageNumber(0);
                  // setSiteWiseStatus("all");
                  setTotalPage(0);
                }}
                noOptionsMessage={() => "No sites Available"}
                placeholder="Select Site"
                maxMenuHeight={500}
                className="z-50 w-96 text-black"
              />
            )}
          </div>
          <Link
            style={{ background: themeColor }}
            to={"/admin/hrms/ctc/ctc-template/General-Settings"}
            className="border-2 font-semibold hover:bg-black hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center  gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Template
          </Link>
        </div>
        <Table
          columns={columns}
          data={filteredTemplates.map((template) => ({
            ...template,
            associated_sites_names: getSiteNames(template.associated),
          }))}
          pagination={false}
        />
        {filteredTemplates.length > 0 && (
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
      <div className="my-4 mx-2 w-fit">
        <div className="flex flex-col bg-gray-50 rounded-md text-wrap  gap-4 my-2 py-2 pl-5 pr-2 w-[18rem]">
          <div className="flex  gap-4 font-medium text-base">
            <GrHelpBook size={20} />
            <h2>Help Center</h2>
          </div>
          <div className="">
            <ul style={listItemStyle} className="flex flex-col gap-2">
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Create a New Template: Click the "+ New CTC Template" button
                    to start creating a new template.
                  </li>{" "}
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Enter Template Details: Template Label: Provide a
                    descriptive label for the new CTC template.
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Employee Selection Based on CTC Basket: Choose whether to
                    include an employee selection based on the CTC basket.
                    Select "Yes" to customize components or "No" to proceed
                    without this option.
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Component and Hierarchy Selection: If you selected 'Yes' for
                    the CTC basket, choose the relevant components such as
                    flexi-benefit components, flexi-allowances, etc., to form
                    the employee CTC.
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Define the hierarchy and components: Fixed Components:
                    Specify all fixed salary components.
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Flexi-Benefit Components: List the components under
                    flexi-benefits.
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Employee Contribution: Outline contributions made by
                    employees.
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Employee Deduction: Define deductions applicable to
                    employees.
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Flexibility Deduction: Include any flexibility deductions.
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Set Restrictions: Determine any restrictions on the CTC
                    basket and amount allocation to ensure compliance with
                    organizational policies.
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {assign && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-xl w-fit">
            <h1 className="text-lg font-semibold border-b flex items-center gap-2 justify-center">
              <PiPlusCircle /> Assign Template
            </h1>
            <div className="grid gap-2 max-h-96  py-2 hide-scrollbar">
              <Select
                options={associatedSites}
                onChange={(selectedOption) => {
                  setSelectedOption(selectedOption);
                  console.log(selectedOption);
                }}
                isMulti
                noOptionsMessage={() => "No sites Available"}
                placeholder="Select Site"
                maxMenuHeight={500}
                className="z-50 w-96 text-black"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  className="bg-red-400 text-white rounded-full p-2 px-4"
                  onClick={() => setAssign(false)}
                >
                  Cancel{" "}
                </button>
                <button
                  className="bg-green-400 text-white rounded-full p-2 px-4"
                  onClick={handleAssign}
                >
                  Submit{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CTCTemplate;