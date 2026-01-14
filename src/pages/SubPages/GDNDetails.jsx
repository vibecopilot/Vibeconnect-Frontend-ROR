import React, { useEffect, useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import Table from "../../components/table/Table";
import { BsEye } from "react-icons/bs";
import { useSelector } from "react-redux";
import { getGDN } from "../../api";

const GdnDetails = () => {
  const [gdn, setGdn] = useState([]);
  const [search, setSearch] = useState("");
  const themeColor = useSelector((state) => state.theme.color);

  const safeDate = (val) => {
    if (!val) return "-";
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
  };

  useEffect(() => {
    const fetchGDN = async () => {
      try {
        const resp = await getGDN();

        const list = Array.isArray(resp?.data?.gdn_details)
          ? resp.data.gdn_details
          : Array.isArray(resp?.data)
          ? resp.data
          : [];

        setGdn(list);
      } catch (error) {
        console.log("Error fetching GDN:", error);
        setGdn([]);
      }
    };

    fetchGDN();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return gdn;

    return gdn.filter((row) => {
      const idStr = String(row?.id ?? "").toLowerCase();
      const dateStr = String(row?.gdn_date ?? "").toLowerCase();
      const descStr = String(row?.description ?? "").toLowerCase();
      return idStr.includes(q) || dateStr.includes(q) || descStr.includes(q);
    });
  }, [gdn, search]);

  const columns = [
    {
      name: "View",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/gdn-detail/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    { name: "Id", selector: (row) => row.id ?? "-", sortable: true },
    { name: "GDN Date", selector: (row) => row.gdn_date ?? "-", sortable: true },
    {
      name: "Inventory Count",
      selector: (row) =>
        Array.isArray(row?.gdn_inventory_details)
          ? row.gdn_inventory_details.length
          : 0,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.status === true ? "Active" : "Inactive"),
      sortable: true,
    },
    {
      name: "Created On",
      selector: (row) => safeDate(row.created_at),
      sortable: true,
    },
    {
      // ✅ API has created_by_id, not CreatedBy
      name: "Created By",
      selector: (row) => row.created_by_id ?? "-",
      sortable: true,
    },
    {
      name: "Handed Over To",
      selector: (row) => row.handed_over_to ?? "-",
      sortable: true,
    },
  ];

  return (
    <section>
      <div className="w-full flex flex-col">
        <div className="flex justify-between my-2">
          <div>
            <input
              type="text"
              placeholder="search"
              className="border-2 p-2 border-gray-300 rounded-lg mx-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <Link
              to="/admin/add-gdn/"
              className="font-semibold text-white px-4 p-2 flex gap-2 items-center rounded-md"
              style={{ background: themeColor }}
            >
              <IoMdAdd /> Add
            </Link>
          </div>
        </div>

        <div>
          <Table columns={columns} data={filtered} isPagination={true} />
        </div>
      </div>
    </section>
  );
};

export default GdnDetails;
