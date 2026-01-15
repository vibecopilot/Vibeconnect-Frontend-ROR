import React, { useEffect, useMemo, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { IoAddCircleOutline } from "react-icons/io5";
import { BsEye } from "react-icons/bs";
import Switch from "../Buttons/Switch";
import Table from "../components/table/Table";
import { useSelector } from "react-redux";
import { domainPrefix, editContactBook, getContactBook } from "../api";
import toast from "react-hot-toast";

const Business = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchContactBook = useCallback(async () => {
    try {
      setLoading(true);

      const contactRes = await getContactBook();

      // ✅ API returns object: { total_count, ..., contact_books: [] }
      const list = Array.isArray(contactRes?.data?.contact_books)
        ? contactRes.data.contact_books
        : [];

      const sorted = [...list].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setContacts(sorted);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load contact books");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContactBook();
  }, [fetchContactBook]);

  const handleStatus = async (id, newStatus) => {
    const formData = new FormData();

    // ✅ backend expects string "true"/"false"
    formData.append("contact_book[status]", newStatus ? "true" : "false");

    await editContactBook(id, formData);
  };

  const handleSwitchChange = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    // ✅ optimistic update
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );

    const tid = toast.loading("Updating...");
    try {
      await handleStatus(id, newStatus);
      toast.success("Updated", { id: tid });
      await fetchContactBook();
    } catch (error) {
      console.log("Error updating status:", error);
      toast.error("Update failed", { id: tid });

      // revert
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: currentStatus } : c))
      );
    }
  };

  // ✅ filter from contacts (single source of truth)
  const filteredData = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return contacts;

    return contacts.filter((item) => {
      const company = String(item?.company_name || "").toLowerCase();
      const person = String(item?.contact_person_name || "").toLowerCase();
      const category = String(item?.generic_info_name || "").toLowerCase();
      const sub = String(item?.generic_sub_info_name || "").toLowerCase();

      return (
        company.includes(q) ||
        person.includes(q) ||
        category.includes(q) ||
        sub.includes(q)
      );
    });
  }, [contacts, searchText]);

  const columns = useMemo(
    () => [
      {
        name: "Actions",
        cell: (row) => (
          <Link to={`/business/details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        ),
        sortable: false,
        width: "90px",
      },
      {
        name: "Logo",
        cell: (row) =>
          Array.isArray(row?.logo) && row.logo.length > 0 ? (
            <img
              src={domainPrefix + row.logo[0].document}
              alt="logo"
              width={40}
              height={40}
              className="rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="text-xs text-gray-500">No logo</span>
          ),
        width: "90px",
      },
      {
        name: "Company Name",
        selector: (row) => row.company_name || "—",
        sortable: true,
      },
      {
        name: "Category",
        selector: (row) => row.generic_info_name || "—",
        sortable: true,
      },
      {
        name: "Sub Category",
        selector: (row) => row.generic_sub_info_name || "—",
        sortable: true,
      },
      {
        name: "Contact Person",
        selector: (row) => row.contact_person_name || "—",
        sortable: true,
      },
      { name: "Mobile", selector: (row) => row.mobile ?? "—", sortable: true },
      {
        name: "Landline",
        selector: (row) => row.landline_no || "—",
        sortable: true,
      },
      {
        name: "Primary Email",
        selector: (row) => row.primary_email || "—",
        sortable: true,
      },
      {
        name: "Key Offerings",
        selector: (row) => row.key_offering || "—",
        sortable: true,
      },
      {
        name: "Status",
        cell: (row) => (
          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={!!row.status}
              onChange={() => handleSwitchChange(row.id, !!row.status)}
            />
          </div>
        ),
        sortable: false,
        width: "120px",
      },
    ],
    [handleSwitchChange]
  );

  return (
    <section className="flex">
      <Navbar />

      <div className="w-full flex mx-3 flex-col overflow-hidden mb-5">
        <div className="flex justify-between items-center gap-3">
          <input
            type="text"
            placeholder="Search (Company / Person / Category)"
            className="border bg-gray-50 p-2 w-full border-gray-300 rounded-lg placeholder:text-sm"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />

          <div className="flex gap-3 justify-end">
            <Link
              to={"/business/add-business"}
              className="w-24 rounded-lg flex items-center justify-center gap-2 text-white p-2 my-5 whitespace-nowrap"
              style={{ background: themeColor }}
            >
              <IoAddCircleOutline />
              Add
            </Link>

            <button
              type="button"
              className="border rounded-lg p-2 px-4 my-5"
              onClick={fetchContactBook}
              title="Refresh"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <Table columns={columns} data={filteredData} />
        )}
      </div>
    </section>
  );
};

export default Business;
