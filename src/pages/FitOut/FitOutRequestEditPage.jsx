import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  domainPrefix,
  getAllFloors,
  getAllUnits,
  getAllVendors,
  getBuildings,
  getFitOutCategoriesSetup,
  getFitoutRequest,
  getSetupUsers,
  postFitoutRequest,
  putFitoutRequest,
} from "../../api";

import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FaRegFileAlt } from "react-icons/fa";

const FitOutRequestEditPage = () => {
  const { id } = useParams();

  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [categories, setCategories] = useState([]);
  const [categoryFiles, setCategoryFiles] = useState({});

  const [fitOutSetup, setFitOutCat] = useState([]);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    building_id: "",
    floor_id: "",
    unit_id: "",
    user_id: "",
    description: "",
    selected_date: "",
    supplier_id: "",
  });

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const buildingsRes = await getBuildings();
      setBuildings(buildingsRes.data);

      const floorsRes = await getAllFloors();
      setFloors(floorsRes.data);

      const unitsRes = await getAllUnits();
      setUnits(unitsRes.data);

      const usersRes = await getSetupUsers();
      setUsers(usersRes.data);

      const vendorsRes = await getAllVendors();
      setVendors(vendorsRes.data);

      const setupCategorie = await getFitOutCategoriesSetup();

      setFitOutCat(
        Array.isArray(setupCategorie.data)
          ? setupCategorie.data
          : []
      );

      // Fetch Request Details

      const response = await getFitoutRequest(1, 100);

      const requests = response?.data?.fitout_requests || [];

      const selectedRequest = requests.find(
        (item) => item.id === parseInt(id)
      );

      if (selectedRequest) {
        setFormData({
          building_id: selectedRequest.building_id || "",
          floor_id: selectedRequest.floor_id || "",
          unit_id: selectedRequest.unit_id || "",
          user_id: selectedRequest.user_id || "",
          description: selectedRequest.description || "",
          selected_date: selectedRequest.selected_date
            ? selectedRequest.selected_date.split("T")[0]
            : "",
          supplier_id: selectedRequest.supplier_id || "",
        });

        // Set Categories

        const formattedCategories =
          selectedRequest.fitout_request_categories.map(
            (item, index) => ({
              id: index + 1,
              category_type: item.category_type_id,
              existingFile:
                item.attachfile?.document_url || "",
            })
          );

        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (
    event,
    categoryId
  ) => {
    const { value } = event.target;

    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, category_type: value }
          : cat
      )
    );
  };

  const handleFileUpload = (
    event,
    categoryId
  ) => {
    const file = event.target.files[0];

    if (file) {
      setCategoryFiles((prev) => ({
        ...prev,
        [categoryId]: file,
      }));
    }
  };

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        id: categories.length + 1,
        category_type: "",
      },
    ]);
  };

  const removeCategory = (id) => {
    setCategories(
      categories.filter((cat) => cat.id !== id)
    );
  };

  const isImage = (filePath) => {
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "svg",
      "webp",
    ];

    const extension = filePath
      .split(".")
      .pop()
      .split("?")[0]
      .toLowerCase();

    return imageExtensions.includes(extension);
  };

  const getFileName = (filePath) => {
    return filePath.split("/").pop().split("?")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const [key, value] of Object.entries(
      formData
    )) {
      if (!value) {
        toast.error(
          "Please fill all required fields."
        );
        return;
      }
    }

    const requestData = new FormData();

    Object.entries(formData).forEach(
      ([key, value]) => {
        requestData.append(
          `fitout_request[${key}]`,
          value
        );
      }
    );

    categories.forEach((category) => {
      requestData.append(
        `fitout_request[category_types][]`,
        category.category_type
      );

      if (categoryFiles[category.id]) {
        requestData.append(
          `fitout_request[category_images][]`,
          categoryFiles[category.id]
        );
      }
    });

    try {
      await putFitoutRequest(id, requestData);

      toast.success(
        "Fitout Request Updated Successfully!"
      );

      navigate("/fitout/request/list");
    } catch (error) {
      console.error(
        "Error updating request:",
        error
      );

      toast.error(
        "Failed to update fitout request."
      );
    }
  };

  return (
    <div className="flex">
      <Navbar />

      <div className="flex-1 p-4 bg-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-w-4xl mx-auto">
            {/* Basic Details */}

            <div className="border rounded-lg p-6 w-full shadow-md bg-white">
              <h2 className="text-xl font-semibold text-orange-600 flex items-center mb-4">
                🏢 BASIC DETAILS
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="building_id"
                  value={formData.building_id}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">
                    Select Building *
                  </option>

                  {buildings.map((building) => (
                    <option
                      key={building.id}
                      value={building.id}
                    >
                      {building.name}
                    </option>
                  ))}
                </select>

                <select
                  name="floor_id"
                  value={formData.floor_id}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">
                    Select Floor *
                  </option>

                  {floors.map((floor) => (
                    <option
                      key={floor.id}
                      value={floor.id}
                    >
                      {floor.name}
                    </option>
                  ))}
                </select>

                <select
                  name="unit_id"
                  value={formData.unit_id}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">
                    Select Unit *
                  </option>

                  {units.map((unit) => (
                    <option
                      key={unit.id}
                      value={unit.id}
                    >
                      {unit.name}
                    </option>
                  ))}
                </select>

                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">
                    Select User *
                  </option>

                  {users.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.firstname}{" "}
                      {user.lastname}
                    </option>
                  ))}
                </select>

                <textarea
                  name="description"
                  value={formData.description}
                  placeholder="Description"
                  onChange={handleChange}
                  className="border p-2 rounded w-full md:col-span-2"
                />

                <input
                  type="date"
                  value={formData.selected_date}
                  name="selected_date"
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />

                <select
                  name="supplier_id"
                  value={formData.supplier_id}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">
                    Select Vendor
                  </option>

                  {vendors.map((vendor) => (
                    <option
                      key={vendor.id}
                      value={vendor.id}
                    >
                      {vendor.vendor_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category & Attachment */}

            <div className="border rounded-lg p-6 shadow-md bg-white mt-6">
              <h2 className="text-xl font-semibold text-orange-600 flex items-center mb-4">
                📎 CATEGORY AND ATTACHMENT
              </h2>

              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-wrap items-center gap-4 mt-4 p-4 bg-gray-100 rounded-md"
                >
                  <select
                    className="border p-2 rounded w-full md:w-auto flex-1"
                    value={category.category_type}
                    onChange={(e) =>
                      handleCategoryChange(
                        e,
                        category.id
                      )
                    }
                  >
                    <option value="">
                      Select Category
                    </option>

                    {fitOutSetup.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileUpload(
                        e,
                        category.id
                      )
                    }
                    className="border p-2 rounded w-full md:w-auto flex-1"
                  />

                  {/* Existing File */}

                  {category.existingFile && (
                    <div className="flex flex-col items-center gap-2">
                      {isImage(
                        domainPrefix +
                          category.existingFile
                      ) ? (
                        <img
                          src={
                            domainPrefix +
                            category.existingFile
                          }
                          alt="attachment"
                          className="w-24 h-24 object-cover rounded-md cursor-pointer"
                          onClick={() =>
                            window.open(
                              domainPrefix +
                                category.existingFile,
                              "_blank"
                            )
                          }
                        />
                      ) : (
                        <a
                          href={
                            domainPrefix +
                            category.existingFile
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center hover:text-blue-500"
                        >
                          <FaRegFileAlt size={40} />

                          <span className="text-xs">
                            {getFileName(
                              category.existingFile
                            )}
                          </span>
                        </a>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() =>
                      removeCategory(category.id)
                    }
                    type="button"
                    className="bg-red-600 text-white p-2 rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={addCategory}
                type="button"
                className="mt-4 bg-gray-700 text-white py-2 px-4 rounded"
              >
                + Add Category
              </button>
            </div>

            {/* Submit */}

            <button
              type="submit"
              className="mt-6 bg-gray-700 text-white py-3 px-6 rounded w-full"
            >
              Update Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FitOutRequestEditPage;