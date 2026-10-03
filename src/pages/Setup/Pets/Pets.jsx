import { useEffect, useMemo, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { DNA } from "react-loader-spinner";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import Navbar from "../../../components/Navbar";
import Table from "../../../components/table/Table";
import SiteHeader from "../../../components/SiteHeader";

import {
  getPets,
  domainPrefix,
} from "../../../api";
import SetupNavbar from "../../../components/navbars/SetupNavbar";

const Pets = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Site State
  const [activeSiteId, setActiveSiteId] = useState("");

  // ✅ Search States
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ✅ Fetch Pets
  useEffect(() => {
    fetchPets();
  }, [activeSiteId]);

  const fetchPets = async (page = 1, perPage = 10) => {
    try {
      setLoading(true);

      const response = await getPets(
        page,
        perPage,
        activeSiteId
      );

      const data = response?.data || [];

      const sortedData = data.sort(
        (a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
      );

      setPets(sortedData);
    } catch (error) {
      console.error("Error fetching pets:", error);
      toast.error("Failed to fetch pets");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // ✅ Search Filter
  const filteredPets = useMemo(() => {
    if (!debouncedSearch.trim()) return pets;

    return pets.filter((item) => {
      const searchable = [
        item.pet_name,
        item.pet_breed,
        item.owner_mobile_no,
        item.gender,
        item.colour,
        item.site_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(
        debouncedSearch.toLowerCase()
      );
    });
  }, [debouncedSearch, pets]);

  // ✅ Table Columns
  const petsColumn = [
    {
      name: "Action",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/setup/pets/view/${row.id}`}>
            <BsEye size={15} />
          </Link>

          <Link to={`/setup/pets/edit/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),

      width: "120px",
    },

    {
      name: "Profile Image",

      cell: (row) => {
        const profileDoc = row.documents?.find(
          (doc) => doc.relation === "PetProfile"
        );

        const imageUrl = profileDoc
          ? `${domainPrefix}${profileDoc.document}`
          : null;

        return imageUrl ? (
          <img
            src={imageUrl}
            alt={row.pet_name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <span className="text-gray-400">
            No Image
          </span>
        );
      },

      width: "130px",
    },

    {
      name: "Site",
      selector: (row) => row.site_name || "-",
      sortable: true,
      wrap: true,
    },

    {
      name: "Pet Name",
      selector: (row) => row.pet_name || "N/A",
      sortable: true,
      wrap: true,
    },

    {
      name: "Breed",
      selector: (row) => row.pet_breed || "N/A",
      sortable: true,
      wrap: true,
    },

    {
      name: "Gender",
      selector: (row) => row.gender || "N/A",
      sortable: true,
    },

    {
      name: "Colour",
      selector: (row) => row.colour || "N/A",
      sortable: true,
    },

    {
      name: "Owner Mobile",
      selector: (row) =>
        row.owner_mobile_no || "N/A",
      sortable: true,
    },
  ];

  return (
    <section className="flex">
      <SetupNavbar />

      <div className="w-full flex mx-3 flex-col gap-4 overflow-hidden mb-5">
        {/* ✅ Site Header */}
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);

            // reset search on site change
            setSearchText("");
            setDebouncedSearch("");
          }}
        />

        {/* ✅ Heading */}
        <h1 className="text-2xl font-bold mt-2">
          Pets Management
        </h1>

        {/* ✅ Search + Add */}
        <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
          <input
            type="text"
            placeholder="Search by Pet Name, Breed, Mobile, Gender, Colour..."
            className="p-2 w-full border border-gray-300 rounded-md placeholder:text-sm outline-none"
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
          />

          <Link
            to="/setup/pets/add"
            style={{ background: themeColor }}
            className="font-semibold p-2 px-4 rounded-md text-white flex items-center gap-2 whitespace-nowrap"
          >
            <PiPlusCircle size={20} />
            Add Pet
          </Link>
        </div>

        {/* ✅ Table / Loader */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <DNA
              visible={true}
              height="120"
              width="120"
              ariaLabel="dna-loading"
            />
          </div>
        ) : (
          <Table
            columns={petsColumn}
            data={filteredPets}
            isPagination={true}
          />
        )}
      </div>
    </section>
  );
};

export default Pets;