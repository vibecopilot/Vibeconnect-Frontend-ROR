import React, { useEffect, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { getFloors, getUnits, getFilterData, getAssignedTo } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
const TicketFilterModal = ({ onclose, setFilteredData, fetchData, currentPage, perPage}) => {
  const buildings = getItemInLocalStorage("Building");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [unitName, setUnitName] = useState([]);
  const categories = getItemInLocalStorage("categories");
  const statuses = getItemInLocalStorage("STATUS");
  const [assignedUser, setAssignedUser] = useState([]);
  const [formData, setFormData] = useState({
    category_id: "",
    issueStatusId: "",
    priorityLevel: "",
    assign: "",
  });
  const handleBuildingChange = async (e) => {
    const buildingId = e.target.value;
    setSelectedBuilding(buildingId);
    const response = await getFloors(buildingId);
    setFloors(response.data.map((item) => ({ name: item.name, id: item.id })));
    setSelectedFloor(""); // Reset floor and unit when building changes
    setUnitName([]);
    setSelectedUnit("");
  };


  const handleFloorChange = async (e) => {
    const floorId = e.target.value;
    setSelectedFloor(floorId);
    const response = await getUnits(floorId);
    setUnitName(
      response.data.map((item) => ({ name: item.name, id: item.id }))
    );
    setSelectedUnit(""); // Reset unit when floor changes
  };


  const handleUnitChange = (e) => {
    const unitId = e.target.value;
    setSelectedUnit(unitId);
  };


  const handleFilterData = async () => {
    try {
      const response = await getFilterData(
        formData.category_id,
        formData.issueStatusId,
        formData.priorityLevel,
        formData.assign
      );
      console.log(response);
      setFilteredData(response.data.complaints);
      onclose();
    } catch (error) {
      console.error("Error filter Data:", error);
    }
  };


  const handleReset = () => {
    fetchData(currentPage, perPage);
    onclose();
  };
  console.log(formData);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  useEffect(() => {
    const fetchAssignedTo = async () => {
      try {
        const response = await getAssignedTo();
        setAssignedUser(response.data);
        // setEditTicketInfo(response.data);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };


    fetchAssignedTo();
  }, []);


  return (
    <ModalWrapper onclose={onclose}>
      <div className="w-full max-w-4xl mx-auto overflow-hidden flex flex-col space-y-5">
        <div className="border-b border-gray-300 pb-3">
          <h2 className="text-xl font-bold text-gray-700">Filter By</h2>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 overflow-y-auto px-5 w-full hide-scrollbar">
          <div className="flex flex-col">
            <label
              htmlFor="building_name"
              className="font-semibold text-gray-600"
            >
              Building Name
            </label>
            <select
              name="building_name"
              value={selectedBuilding}
              id="building_name"
              onChange={handleBuildingChange}
              className="border p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Select Building</option>
              {buildings?.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="floor_name" className="font-semibold text-gray-600">
              Floor Name
            </label>
            <select
              onChange={handleFloorChange}
              value={selectedFloor}
              name="floor_name"
              className="border p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Select Floor</option>
              {floors?.map((floor) => (
                <option value={floor.id} key={floor.id}>
                  {floor.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="unit_name" className="font-semibold text-gray-600">
              Unit Name
            </label>
            <select
              value={selectedUnit}
              onChange={handleUnitChange}
              name="unit_name"
              className="border p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Select Unit</option>
              {unitName?.map((unit) => (
                <option value={unit.id} key={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="create_date"
              className="font-semibold text-gray-600"
            >
              Date Start
            </label>
            <input
              type="date"
              id="create_date"
              name="createDate"
              className="border p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="create_date"
              className="font-semibold text-gray-600"
            >
              Date End
            </label>
            <input
              type="date"
              id="create_date"
              name="createDate"
              className="border p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="create_by" className="font-semibold text-gray-600">
              Created By
            </label>
            <input
              type="text"
              id="create_by"
              name="createBy"
              placeholder="Created By"
              className="border p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="category" className="font-semibold text-gray-600">
              Category
            </label>
            <select
              id="category"
              value={formData.category_id}
              name="category_id"
              onChange={handleChange}
              className="border p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Select Category</option>
              {categories?.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="sub_category"
              className="font-semibold text-gray-600"
            >
              Sub Category
            </label>
            <select
              id="sub_category"
              name="sub_category"
              className="border p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Select Sub Category</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="status" className="font-semibold text-gray-600">
              Status
            </label>
            <select
              value={formData.issueStatusId}
              name="issueStatusId"
              onChange={handleChange}
              className="border p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Select Status</option>
              {statuses?.map((status) => (
                <option value={status.id} key={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="priority_level"
              className="font-semibold text-gray-600"
            >
              Priority Level
            </label>
            <select
              id="priority_level"
              value={formData.priorityLevel}
              name="priorityLevel"
              onChange={handleChange}
              className="border p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Select Priority Level</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="assigned_to"
              className="font-semibold text-gray-600"
            >
              Assigned To
            </label>
            <select
              id="assigned_to"
              value={formData.assign}
              name="assign"
              onChange={handleChange}
              className="border p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Select Assign To</option>
              {assignedUser?.map((assign) => (
                <option key={assign.id} value={assign.id}>
                  {assign.firstname} {assign.lastname}
                </option>
              ))}
            </select>
          </div>
        </div>


        <div className="flex justify-center gap-4 pt-5 border-t border-gray-300 mt-5">
          <button
            className="bg-gray-600 text-white rounded-md px-6 py-2 hover:bg-gray-700"
            onClick={handleFilterData}
          >
            Filter
          </button>
          <button
            className="border border-gray-400 rounded-md px-6 py-2 hover:bg-gray-100"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};


export default TicketFilterModal;



