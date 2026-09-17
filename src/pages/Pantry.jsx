import React, { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import { PiPlusCircle } from "react-icons/pi";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import Table from "../components/table/Table";
import { getPantry } from "../api";

const Pantry = () => {
  const [pantryData, setPantryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const invResp = await getPantry();

        const sortedInvData = invResp.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setPantryData(sortedInvData);
        setFilteredData(sortedInvData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPantry();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    if (!value.trim()) {
      setFilteredData(pantryData);
      return;
    }

    const filtered = pantryData.filter((item) => {
      const itemName = item.item_name?.toLowerCase() || "";
      const firstName = item.ordered_by_name?.firstname?.toLowerCase() || "";
      const lastName = item.ordered_by_name?.lastname?.toLowerCase() || "";
      const fullName = `${firstName} ${lastName}`;

      return (
        itemName.includes(value) ||
        firstName.includes(value) ||
        lastName.includes(value) ||
        fullName.includes(value)
      );
    });

    setFilteredData(filtered);
  };

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/pantry-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "Item Name",
      selector: (row) => row.item_name,
      sortable: true,
    },
    {
      name: "Ordered by",
      selector: (row) =>
        `${row.ordered_by_name?.firstname || ""} ${row.ordered_by_name?.lastname || ""
        }`,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      sortable: true,
    },
    {
      name: "Status",
      sortable: true,
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold
      ${row.status === true
              ? "bg-green-100 text-green-700"
              : row.status === false
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {row.status === true
            ? "Approved"
            : row.status === false
              ? "Rejected"
              : "Pending"}
        </span>
      ),
    },
    {
      name: "Action",
      cell: (row) =>
        row.stock !== 0 && (
          <div className="flex justify-center gap-2">
            <button className="text-green-400 font-medium hover:bg-green-400 hover:text-white transition-all duration-200 p-1 rounded-full">
              <TiTick size={20} />
            </button>

            <button className="text-red-400 font-medium hover:bg-red-400 hover:text-white transition-all duration-200 p-1 rounded-full">
              <IoClose size={20} />
            </button>
          </div>
        ),
    },
  ];

  return (
    <section className="flex">
      <div className="w-full flex m-3 flex-col overflow-hidden">
        <div className="flex justify-between my-5">
          <input
            type="text"
            placeholder="Search by Item Name, Employee Name"
            className="border border-gray-400 w-96 placeholder:text-sm rounded-lg p-2"
            value={searchText}
            onChange={handleSearch}
          />

          <Link
            to="/admin/add-pantry"
            className="border-2 font-semibold hover:bg-black hover:text-white duration-150 transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Add new Items
          </Link>
        </div>

        <Table
          responsive
          columns={columns}
          data={filteredData}
        />
      </div>
    </section>
  );
};

export default Pantry;