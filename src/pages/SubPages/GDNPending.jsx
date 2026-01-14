import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/table/Table";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { getGDN } from "../../api";

const GdnPending = () => {
  const [gdn, setGdn] = useState([]);
  const [search, setSearch] = useState("");

  const safeDate = (val) => {
    if (!val) return "-";
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
  };

  useEffect(() => {
    const fetchGDN = async () => {
      try {
        const resp = await getGDN();

        // ✅ API gives: { gdn_details: [...] }
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

  // ✅ pending = status false
  const pending = useMemo(() => {
    const onlyPending = (Array.isArray(gdn) ? gdn : []).filter(
      (row) => row?.status === false
    );

    const q = search.trim().toLowerCase();
    if (!q) return onlyPending;

    return onlyPending.filter((row) => {
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
        <Link to={`/admin/gdn-detail/${row.id}`}>
          <BsEye size={15} />
        </Link>
      ),
    },
    { name: "GDN ID", selector: (row) => row.id ?? "-", sortable: true },
    { name: "GDN Date", selector: (row) => row.gdn_date ?? "-", sortable: true },
    { name: "Description", selector: (row) => row.description ?? "-", sortable: true },
    {
      name: "Inventory Count",
      selector: (row) =>
        Array.isArray(row?.gdn_inventory_details)
          ? row.gdn_inventory_details.length
          : 0,
      sortable: true,
    },
    { name: "Created On", selector: (row) => safeDate(row.created_at), sortable: true },
    { name: "Created By", selector: (row) => row.created_by_id ?? "-", sortable: true },
    { name: "Status", selector: () => "Pending", sortable: true },
  ];

  return (
    <section>
      <div className="w-full flex flex-col overflow-hidden">
        <div className="flex justify-between my-2">
          <input
            type="text"
            placeholder="Search (id/date/description)"
            className="border-2 p-2 border-gray-300 rounded-lg mx-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="my-5">
          <Table columns={columns} data={pending} isPagination={true} />
        </div>
      </div>
    </section>
  );
};

export default GdnPending;
