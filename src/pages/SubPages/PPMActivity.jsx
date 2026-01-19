import React, { useEffect, useState } from "react";
import { API_URL, getAssetPPMList, getVibeBackground } from "../../api";
import { FaCopy, FaDownload } from "react-icons/fa";
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

const PPMActivity = () => {
  const [ppms, setPPms] = useState([]);
  const [searchPPMText, setSearchPPMCheck] = useState("");
  const [filteredPPMData, setFilteredPPMData] = useState([]);
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

  useEffect(() => {
    toast.loading("Please wait");
    const fetchServicePPM = async () => {
      try {
        toast.dismiss();
        const ServicePPMResponse = await getAssetPPMList();
        
        // FIXED: Filter only ctype: "ppm"
        const ppmOnly = ServicePPMResponse.data.checklists.filter(
          (checklist) => checklist.ctype === "ppm"
        );
        
        const sortedPPMData = ppmOnly.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setFilteredPPMData(sortedPPMData);
        setPPms(sortedPPMData);
        toast.success("PPM Checklist data fetched successfully");
      } catch (error) {
        toast.dismiss();
        console.log(error);
      }
    };
    fetchServicePPM();
  }, []);

  const PPMColumn = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/asset/edit-ppm/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/copy-checklist/ppm/${row.id}`}>
            <FaCopy size={15}/>
          </Link>
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
        <Table columns={PPMColumn} data={filteredPPMData} />
      </div>
    </section>
  );
};


export default PPMActivity;
