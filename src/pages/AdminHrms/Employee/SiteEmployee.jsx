import React, { useEffect, useState } from "react";
import AdminHRMS from "../AdminHrms";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import {
  getAssociatedSiteDetails,
  getAssociatedSites,
  getEmployeeAssociatedSites,
  getEmployeeAssociations,
  getSiteWiseEmployee,
} from "../../../api";
import Table from "../../../components/table/Table";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";

const SiteEmployee = () => {
  const empId = localStorage.getItem("HRMS_EMPLOYEE_ID");
  const associatedSiteId = getItemInLocalStorage("HRMS_SITE_ID");
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const fetchSiteWiseEmployee = async (siteId) => {
    try {
      const res = await getSiteWiseEmployee(hrmsOrgId, siteId);
      setEmployees(res);
      setFilteredEmployees(res);
    } catch (error) {
      console.log(error);
    }
  };
  const [siteName, setSiteName] = useState("");
  const fetchSiteDetails = async () => {
    try {
      const res = await getAssociatedSiteDetails(associatedSiteId);
      setSiteName(res.site_name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSiteWiseEmployee(associatedSiteId);
    fetchSiteDetails();
  }, []);
  const [newSites, setNewSites] = useState([]);
  const fetchSiteAssociation = async () => {
    try {
      const res = await getEmployeeAssociations(empId);
      console.log(res);

      if (Array.isArray(res) && res.length > 0) {
        const associatedSites = res[0].multiple_associated_info || [];
        const allSites = associatedSites.map((site) => ({
          value: site.id,
          label: site.site_name,
        }));

        setNewSites(allSites);
      } else {
        setNewSites([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchSiteAssociation();
  }, []);

  const columns = [
    {
      name: "view",
      cell: (row) => (
        <Link to={`/hrms/employee-directory-Personal/${row.employee}`}>
          <BsEye size={15} />
        </Link>
      ),
    },
    {
      name: "Employee Id",
      selector: (row) => row.employee,
      sortable: true,
    },
    {
      name: "Employee Name",
      selector: (row) => row.employee_name,
      sortable: true,
    },
    {
      name: "Site Id",
      selector: (row) => row.associated_organization,
      sortable: true,
    },
    {
      name: "Site Name",
      selector: (row) => row.associated_organization_name,
      sortable: true,
    },
  ];
  const themeColor = useSelector((state) => state.theme.color);
  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    if (searchValue.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filteredResult = employees.filter((employee) =>
        employee?.employee_name
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
      setFilteredEmployees(filteredResult);
    }
  };

  const [selectedOption, setSelectedOption] = useState({});
  const handleAssociatedSiteChange = (option) => {
    setSelectedOption(option);
    setSiteName(option.label);
    fetchSiteWiseEmployee(option.value);
  };
  return (
    <div className="flex ml-20">
      <AdminHRMS />
      <div className=" w-full m-2 flex gap-2  flex-col mb-4">
        <div
          style={{ background: themeColor }}
          className="p-2 rounded-md text-white flex justify-between items-center"
        >
          <p className="font-medium">Employees on site "{siteName}"</p>
          <Select
            options={newSites}
            onChange={handleAssociatedSiteChange}
            noOptionsMessage={() => "No sites Available"}
            placeholder="Select Site"
            maxMenuHeight={500}
            className="z-50 w-96 text-black"
          />
        </div>
        <div className="w-full h-full ">
          <input
            type="text"
            name=""
            id=""
            value={searchText}
            onChange={handleSearch}
            className="border rounded-md p-2 w-full -z-50"
            placeholder="Search by employee name"
          />
        </div>
        <Table columns={columns} data={filteredEmployees} />
      </div>
    </div>
  );
};

export default SiteEmployee;