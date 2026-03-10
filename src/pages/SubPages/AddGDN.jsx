import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import {
  getGDNConsumingSetup,
  getGDNPurposeSetup,
  getMasters,
  getSetupUsers,
  getSiteAsset,
  getSoftServices,
  postGDN,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";

const AddGdn = () => {
  const navigate = useNavigate();
  const themeColor = useSelector((state) => state.theme.color);

  const [gdnDate, setGdnDate] = useState("");
  const userid = getItemInLocalStorage("UserId");
  const [description, setDescription] = useState("");

  const [invent, setInvent] = useState([]);
  const [asset, setasset] = useState([]);
  const [services, setservices] = useState([]);
  const [purpose, setpurpose] = useState([]);
  const [consuming, setconsuming] = useState([]);
  const [assignedUser, setAssignedUser] = useState([]);

  const [inventoryDetails, setInventoryDetails] = useState([
    {
      inventoryId: "",
      quantity: "",
      purpose: "",
      consumingIn: "",
      asset: "",
      service: "",
      handedOverTo: "",
      comments: "",
    },
  ]);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getSetupUsers();
        const formatted = Array.isArray(response?.data)
          ? response.data.map((u) => ({
              id: u.id,
              firstname: u.firstname,
              lastname: u.lastname,
            }))
          : [];
        setAssignedUser(formatted);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getSoftServices();
        const formatted = Array.isArray(response?.data)
          ? response.data.map((s) => ({ id: s.id, name: s.name }))
          : [];
        setservices(formatted);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchConsuming = async () => {
      try {
        const response = await getGDNConsumingSetup();
        const formatted = Array.isArray(response?.data)
          ? response.data.map((x) => ({ id: x.id, name: x.name }))
          : [];
        setconsuming(formatted);
      } catch (error) {
        console.error("Error fetching consuming list:", error);
      }
    };
    fetchConsuming();
  }, []);

  useEffect(() => {
    const fetchPurpose = async () => {
      try {
        const response = await getGDNPurposeSetup();
        const formatted = Array.isArray(response?.data)
          ? response.data.map((x) => ({ id: x.id, name: x.name }))
          : [];
        setpurpose(formatted);
      } catch (error) {
        console.error("Error fetching purpose:", error);
      }
    };
    fetchPurpose();
  }, []);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await getSiteAsset();
        const list = Array.isArray(response?.data?.site_assets)
          ? response.data.site_assets
          : Array.isArray(response?.site_assets)
            ? response.site_assets
            : [];

        const formatted = list.map((a) => ({ id: a.id, name: a.name }));
        setasset(formatted);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAsset();
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const invResp = await getMasters();

        console.log("Inventory API Response:", invResp);

        let list = [];

        if (Array.isArray(invResp?.inventories)) {
          list = invResp.inventories;
        } else if (Array.isArray(invResp?.data?.inventories)) {
          list = invResp.data.inventories;
        }

        const formatted = list.map((item) => ({
          id: item.id,
          name: item.name,
        }));

        setInvent(formatted);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, []);
  const handleAddInventory = () => {
    setInventoryDetails((prev) => [
      ...prev,
      {
        inventoryId: "",
        quantity: "",
        purpose: "",
        consumingIn: "",
        asset: "",
        service: "",
        handedOverTo: "",
        comments: "",
      },
    ]);
  };

  const handleRemoveInventory = (index) => {
    setInventoryDetails((prev) => {
      if (prev.length === 1) return prev;
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleChange = (index, field, value) => {
    setInventoryDetails((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };

      if (field === "purpose") {
        copy[index].consumingIn = "";
        copy[index].asset = "";
        copy[index].service = "";
      }
      if (field === "consumingIn") {
        copy[index].asset = "";
        copy[index].service = "";
      }
      return copy;
    });
  };

  const resetForm = () => {
    setGdnDate("");
    setDescription("");
    setInventoryDetails([
      {
        inventoryId: "",
        quantity: "",
        purpose: "",
        consumingIn: "",
        asset: "",
        service: "",
        handedOverTo: "",
        comments: "",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMsg("");
    setErrorMsg("");

    // ✅ ONLY GDN Date mandatory
    if (!gdnDate) {
      setErrorMsg("Please select GDN Date");
      return;
    }

    const formData = new FormData();
    formData.append("gdn_detail[gdn_date]", gdnDate);
    formData.append("gdn_detail[description]", description || "");
    formData.append("gdn_detail[status]", "true");
    formData.append("gdn_detail[created_by_id]", userid || "");

    // ✅ Inventory optional: send whatever user filled (even blank rows)
    inventoryDetails.forEach((item) => {
      formData.append(
        `gdn_inventory_details[][inventory]`,
        item.inventoryId || "",
      );
      formData.append(`gdn_inventory_details[][quantity]`, item.quantity || "");
      formData.append(
        `gdn_inventory_details[][purpose_id]`,
        item.purpose || "",
      );
      formData.append(
        `gdn_inventory_details[][consuming_in_id]`,
        item.consumingIn || "",
      );
      formData.append(`gdn_inventory_details[][asset_id]`, item.asset || "");
      formData.append(
        `gdn_inventory_details[][service_id]`,
        item.service || "",
      );
      formData.append(
        `gdn_inventory_details[][handover_to_id]`,
        item.handedOverTo || "",
      );
      formData.append(`gdn_inventory_details[][comments]`, item.comments || "");
    });

    try {
      setSubmitting(true);
      const response = await postGDN(formData);

      if (response?.status === 200 || response?.status === 201) {
        setSuccessMsg("Add successfully done ✅");
        resetForm();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("Failed to submit GDN.");
      }
      navigate("/assets/stock-items");
    } catch (error) {
      console.error("Error submitting GDN:", error);
      setErrorMsg("Error submitting GDN.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <div className="flex">
        <Navbar />

        <div className="md:mx-20 my-2 mb-10 sm:border border-gray-400 p-5 px-10 rounded-lg w-full">
          <h2
            className="text-center text-xl font-bold p-2 rounded-full text-white mb-4"
            style={{ background: themeColor }}
          >
            Add GDN
          </h2>

          {successMsg && (
            <div className="mx-5 mb-4 p-3 rounded-md bg-green-100 text-green-800 border border-green-300">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mx-5 mb-4 p-3 rounded-md bg-red-100 text-red-800 border border-red-300">
              {errorMsg}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col overflow-hidden"
          >
            {/* Basic Details */}
            <div className="border-2 flex flex-col my-5 mx-5 p-4 gap-4 rounded-md border-gray-400">
              <h2 className="border-b-2 border-gray-400 font-semibold">
                Basic Details
              </h2>

              <div className="flex sm:flex-row flex-col justify-around items-center">
                <div className="grid md:grid-cols-3 item-start gap-x-4 gap-y-8 w-full">
                  <div className="flex flex-col">
                    <label className="font-semibold my-1">GDN Date</label>
                    <input
                      type="date"
                      value={gdnDate}
                      onChange={(e) => setGdnDate(e.target.value)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold my-1">Description</label>
                    <textarea
                      placeholder="GDN Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      rows="1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Details */}
            <div className="border-2 flex flex-col my-5 mx-5 p-4 gap-4 rounded-md border-gray-400">
              <h2 className="border-b-2 border-gray-400 font-semibold">
                Inventory Details (Optional)
              </h2>

              {inventoryDetails.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-around gap-4 mb-4"
                >
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col w-full">
                      <label className="font-semibold my-1">Inventory</label>
                      <select
                        value={item.inventoryId}
                        onChange={(e) =>
                          handleChange(index, "inventoryId", e.target.value)
                        }
                        className="border p-1 px-4 border-gray-500 rounded-md"
                      >
                        <option value="">Select Inventory</option>

                        {invent.length > 0 ? (
                          invent.map((inv) => (
                            <option key={inv.id} value={inv.id}>
                              {inv.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Inventory Found</option>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col w-full">
                      <label className="font-semibold my-1">Quantity</label>
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) =>
                          handleChange(index, "quantity", e.target.value)
                        }
                        placeholder="Quantity"
                        className="border p-1 px-4 border-gray-500 rounded-md"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-semibold my-1">Purpose</label>
                      <select
                        value={item.purpose}
                        onChange={(e) =>
                          handleChange(index, "purpose", e.target.value)
                        }
                        className="border p-1 px-4 border-gray-500 rounded-md"
                      >
                        <option value="">Select Purpose</option>
                        {purpose.map((p) => (
                          <option value={String(p.id)} key={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {item.purpose === "42" && (
                      <div className="flex flex-col">
                        <label className="font-semibold my-1">
                          Select Consuming in
                        </label>
                        <select
                          value={item.consumingIn}
                          onChange={(e) =>
                            handleChange(index, "consumingIn", e.target.value)
                          }
                          className="border p-1 px-4 border-gray-500 rounded-md"
                        >
                          <option value="">Select Consuming in</option>
                          {consuming.map((c) => (
                            <option value={String(c.id)} key={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {item.purpose === "42" && item.consumingIn === "47" && (
                      <div className="flex flex-col">
                        <label className="font-semibold my-1">
                          Select Asset
                        </label>
                        <select
                          value={item.asset}
                          onChange={(e) =>
                            handleChange(index, "asset", e.target.value)
                          }
                          className="border p-1 px-4 border-gray-500 rounded-md"
                        >
                          <option value="">Select Asset</option>
                          {asset.map((a) => (
                            <option value={String(a.id)} key={a.id}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {item.purpose === "42" && item.consumingIn === "48" && (
                      <div className="flex flex-col">
                        <label className="font-semibold my-1">
                          Select Service
                        </label>
                        <select
                          value={item.service}
                          onChange={(e) =>
                            handleChange(index, "service", e.target.value)
                          }
                          className="border p-1 px-4 border-gray-500 rounded-md"
                        >
                          <option value="">Select Service</option>
                          {services.map((s) => (
                            <option value={String(s.id)} key={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {(item.purpose === "42" || item.purpose === "43") && (
                      <div className="flex flex-col w-full">
                        <label className="font-semibold my-1">
                          Handed Over to
                        </label>
                        <select
                          value={item.handedOverTo}
                          onChange={(e) =>
                            handleChange(index, "handedOverTo", e.target.value)
                          }
                          className="border p-1 px-4 border-gray-500 rounded-md"
                        >
                          <option value="">Handed Over to</option>
                          {assignedUser.map((u) => (
                            <option key={u.id} value={String(u.id)}>
                              {u.firstname} {u.lastname}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex flex-col">
                      <label className="font-semibold my-1">Comments</label>
                      <textarea
                        value={item.comments}
                        onChange={(e) =>
                          handleChange(index, "comments", e.target.value)
                        }
                        cols="5"
                        rows="1"
                        placeholder="Comments"
                        className="border p-1 px-4 border-gray-500 rounded-md"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-8 text-white p-2 rounded-md"
                    onClick={() => handleRemoveInventory(index)}
                    style={{ background: themeColor }}
                    title="Remove row"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddInventory}
                className="w-48 text-white px-4 py-2 rounded-md flex items-center gap-2"
                style={{ background: themeColor }}
              >
                <IoMdAdd /> Add Inventory
              </button>
            </div>

            <div className="my-10 mx-5 flex justify-end gap-3">
              <button
                className="text-white px-8 py-2 rounded-md disabled:opacity-60 bg-black"
                onClick={() => navigate("/assets/stock-items")}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="text-white px-8 py-2 rounded-md disabled:opacity-60"
                style={{ background: themeColor }}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddGdn;
