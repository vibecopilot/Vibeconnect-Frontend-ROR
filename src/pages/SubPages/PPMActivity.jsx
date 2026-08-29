import React, { useEffect, useState } from "react";
import {
  API_URL,
  disableChecklistSchedule,
  enableChecklistSchedule,
  getAssetPPMList,
  getVibeBackground,
} from "../../api";
import { FaCheckCircle, FaCopy, FaDownload, FaTimesCircle } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import Table from "../../components/table/Table";
import { Link } from "react-router-dom";
import { IoAddCircleOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { BsEye } from "react-icons/bs";
import AssetNav from "../../components/navbars/AssetNav";
import Navbar from "../../components/Navbar";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import SiteHeader from "../../components/SiteHeader";
import DisableEnableScheduleModal from "../../components/DisableEnableScheduleModal";

const PPMActivity = () => {
  const [ppms, setPPms] = useState([]);
  const [searchPPMText, setSearchPPMCheck] = useState("");
  const [filteredPPMData, setFilteredPPMData] = useState([]);
  const [paginationData, setPaginationData] = useState({
    totalEntries: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [scheduleModal, setScheduleModal] = useState(null); // { mode: "disable"|"enable", checklist }
  // ── reactive site ID — updated by SiteHeader on site switch ──
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  const themeColor = useSelector((state) => state.theme.color);

  const handlePPMSearch = (event) => {
    const searchValue = event.target.value;
    setSearchPPMCheck(searchValue);
    if (searchValue.trim() === "") {
      setFilteredPPMData(ppms);
    } else {
      // Fixed: Filter from ppms instead of filteredPPMData
      const filteredResults = ppms.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredPPMData(filteredResults);
    }
  };

  const fetchServicePPM = async (page = 1, perPage = 10) => {
    try {
      toast.loading("Please wait");
      const ServicePPMResponse = await getAssetPPMList(page, perPage);
      
      console.log("API Response:", ServicePPMResponse.data);

      // API already filters by ctype=ppm, no need to filter again
      const checklists = ServicePPMResponse.data.checklists || [];

      const sortedPPMData = checklists.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      // Calculate total entries - use total_entries/total_count if available, otherwise calculate from total_pages
      const totalPages = ServicePPMResponse.data?.total_pages || 0;
      const totalEntries = ServicePPMResponse.data?.total_entries || 0;
      setFilteredPPMData(sortedPPMData);
      setPPms(sortedPPMData);
      setPaginationData({
        totalEntries: totalEntries,
        totalPages: totalPages,
        currentPage: ServicePPMResponse.data?.current_page || page,
      });
      toast.dismiss();
      toast.success("PPM Checklist data fetched successfully");
    } catch (error) {
      toast.dismiss();
      console.log(error);
    }
  };

  const handleScheduleConfirm = async (payload) => {
    const { mode, checklist } = scheduleModal;
    const action = mode === "disable" ? disableChecklistSchedule : enableChecklistSchedule;
    const res = await action(checklist.id, payload);
    await fetchServicePPM(paginationData.currentPage, rowsPerPage);
    setScheduleModal(null);
    toast.success(res?.data?.message || `Checklist schedule ${mode}d successfully`);
  };

  const handlePageChange = (page) => {
    fetchServicePPM(page, rowsPerPage);
  };

  const handleRowsPerPageChange = (newPerPage, page) => {
    setRowsPerPage(newPerPage);
    fetchServicePPM(page, newPerPage);
  };

  useEffect(() => {
    fetchServicePPM();
  }, [activeSiteId]); // ✅ re-fetch when site changes

  const PPMColumn = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/asset/edit-ppm/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/copy-checklist/ppm/${row.id}`}>
            <FaCopy size={15} />
          </Link>
          {row.active === false ? (
            <button
              type="button"
              title="Enable Schedule"
              onClick={() => setScheduleModal({ mode: "enable", checklist: row })}
            >
              <FaCheckCircle size={15} className="text-green-600" />
            </button>
          ) : (
            <button
              type="button"
              title="Disable Schedule"
              onClick={() => setScheduleModal({ mode: "disable", checklist: row })}
            >
              <FaTimesCircle size={15} className="text-red-500" />
            </button>
          )}
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "350px",
    },
    {
      name: "Status",
      selector: (row) =>
        row.active === false ? (
          <span className="text-red-500 font-medium">Disabled</span>
        ) : (
          <span className="text-green-600 font-medium">Active</span>
        ),
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.start_date,
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.end_date,
      sortable: true,
    },
    {
      name: "Frequency",
      selector: (row) => row.frequency,
      sortable: true,
    },
    {
      name: "No. Of Groups",
      selector: (row) => row?.groups?.length,
      sortable: true,
    },
     {
      name: "Created At",
      selector: (row) => row?.created_at,
      sortable: true,
    },
    {
      name: "Associations",
      selector: (row) => (
        <div>
          <Link
            to={`/assets/associate-checklist/${row.id}`}
            className=" px-4 bg-green-400 text-white rounded-full"
          >
            Associate
          </Link>
        </div>
      ),
      sortable: true,
    },
  ];

  let selectedImageSrc = "";
  let selectedImageIndex = 0;
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const Get_Background = async () => {
    try {
      const user_id = getItemInLocalStorage("VIBEUSERID");
      const data = await getVibeBackground(user_id);

      if (data.success) {
        selectedImageSrc = API_URL + data.data.image;
        selectedImageIndex = data.data.index;
        setSelectedImage(selectedImageSrc);
        setSelectedIndex(selectedImageIndex);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    Get_Background();
  }, []);

  return (
    <section
      className="flex"
      style={{
        background: `url(${selectedImage})no-repeat center center / cover`,
      }}
    >
      <Navbar />
      <div className="p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id); // triggers data useEffect
            setPPms([]);
            setFilteredPPMData([]);
          }}
        />
        <AssetNav />
        <div className="flex flex-wrap justify-between items-center my-2 ">
          <input
            type="text"
            placeholder="Search By name"
            className="border-2 p-2 w-96 border-gray-300 rounded-lg"
            value={searchPPMText}
            onChange={handlePPMSearch}
          />
          <div className="flex flex-wrap gap-2">
            <Link
              to={"/asset/add-asset-ppm"}
              style={{ background: themeColor }}
              className="  rounded-lg flex font-semibold  items-center gap-2 text-white p-2 "
            >
              <IoAddCircleOutline size={20} />
              Add
            </Link>
          </div>
        </div>
        <Table
          columns={PPMColumn}
          data={filteredPPMData}
          paginationServer={true}
          totalEntries={paginationData.totalEntries}
          currentPage={paginationData.currentPage}
          rowsPerPage={rowsPerPage}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
        />
      </div>
      {scheduleModal && (
        <DisableEnableScheduleModal
          mode={scheduleModal.mode}
          checklistName={scheduleModal.checklist.name}
          onConfirm={handleScheduleConfirm}
          onCancel={() => setScheduleModal(null)}
        />
      )}
    </section>
  );
};


export default PPMActivity;