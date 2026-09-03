import React, { useEffect, useMemo, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { PiPlusCircle } from "react-icons/pi";
import Table from "../../components/table/Table";
import { useSelector } from "react-redux";
import { getKonstructUpdates, getSites, domainPrefix } from "../../api";
import toast from "react-hot-toast";
import SiteHeader from "../../components/SiteHeader";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";

const getImageCount = (row) => {
  if (row.back_images_count !== undefined && row.back_images_count !== null) {
    return row.back_images_count;
  }
  if (Array.isArray(row.back_images)) {
    return row.back_images.length;
  }
  return 0;
};

const KonstructListPage = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [sites, setSites] = useState([]);

  const siteMap = useMemo(() => {
    const map = {};
    sites.forEach((s) => { map[s.id] = s.name; });
    return map;
  }, [sites]);

  const fetchUpdates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getKonstructUpdates(page, perPage);
      const data = res.data;
      console.log("KonstructUpdates list response:", data);
      const list = Array.isArray(data?.konstruct_updates)
        ? data.konstruct_updates
        : Array.isArray(data)
          ? data
          : [];
      setUpdates(list);
      setTotalRows(data?.total_count || data?.total_entries || list.length);
    } catch (err) {
      toast.error("Failed to load updates");
      setUpdates([]);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await getSites();
        const list = Array.isArray(res.data) ? res.data : [];
        setSites(list);
      } catch (err) {
        console.error("Failed to fetch sites", err);
      }
    };
    fetchSites();
  }, []);

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return updates;
    return updates.filter((item) => {
      const projectName = siteMap[item.project_id] || "";
      return [item.title_of, projectName, item.status, item.share_with].some(
        (field) => String(field || "").toLowerCase().includes(q)
      );
    });
  }, [updates, search, siteMap]);

  const columns = useMemo(
    () => [
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex items-center gap-3">
            <Link to={`/v1/konstruct_updates/${row.id}`}>
              <BsEye size={15} />
            </Link>
            <Link to={`/v1/konstruct_updates/${row.id}/edit`}>
              <BiEdit size={15} />
            </Link>
          </div>
        ),
        width: "100px",
      },
      { name: "ID", selector: (row) => row.id, sortable: true, width: "80px" },
      { name: "Title", selector: (row) => row.title_of || "—", sortable: true },
      { name: "Project", selector: (row) => siteMap[row.project_id] || row.project_id || "—", sortable: true },
      { name: "Status", selector: (row) => row.status || "—", sortable: true },
      { name: "Share With", selector: (row) => row.share_with || "—" },
      {
        name: "Images",
        cell: (row) => getImageCount(row),
        width: "90px",
      },
      {
        name: "Created",
        selector: (row) =>
          row.created_at
            ? new Date(row.created_at).toLocaleDateString()
            : "—",
        sortable: true,
      },
    ],
    []
  );

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePerRowsChange = (newPerPage, newPage) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden mb-5">
        <SiteHeader />
        <div className="flex justify-between items-center gap-3 my-5">
          <input
            type="text"
            placeholder="Search by title, project, status..."
            className="border bg-gray-50 p-2 w-full border-gray-300 rounded-lg placeholder:text-sm"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="flex gap-3 justify-end">
            <Link
              to={"/v1/konstruct_updates/new"}
              className="rounded-lg flex items-center justify-center gap-2 text-white p-2 px-4 whitespace-nowrap"
              style={{ background: themeColor }}
            >
              <PiPlusCircle size={20} />
              Add Update
            </Link>
            <button
              type="button"
              className="border rounded-lg p-2 px-4"
              onClick={fetchUpdates}
            >
              Refresh
            </button>
          </div>
        </div>
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <Table
            columns={columns}
            data={filteredData}
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
          />
        )}
      </div>
    </section>
  );
};

export default KonstructListPage;
