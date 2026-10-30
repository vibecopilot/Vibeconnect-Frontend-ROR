import React, { useEffect, useState } from "react";
import { getExpectedVisitor, getStaff, postGoods } from "../../api";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import Select from "react-select";
import toast from "react-hot-toast";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";
const AddGoods = () => {
  const [visitors, setVisitors] = useState([]);
  const [staff, setStaff] = useState([]);
  const themeColor = useSelector((state) => state.theme.color);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [type, setType] = useState("visitor");
  const [ward, setWard] = useState("in");
  const [formData, setFormData] = useState({
    visitorId: "",
    noOfGoods: "",
    wardType: "",
    vehicleNumber: "",
    personName: "",
    staffId: "",
    description: "",
    documents: [],
    itemType: "",
    itemCategory: "",
    modeOfTransport: "",
    companyName: "",
    goodsItems: [
      {
        item_name: "",
        quantity: "",
        unit: "",
        description: "",
      },
    ],
    department: "",
    reportingTime: "",
    goodsOutTime: "",
    returnableType: "",
  });

  const handleItemChange = (index, e) => {
    const updatedItems = [...formData.goodsItems];
    updatedItems[index][e.target.name] = e.target.value;

    setFormData({
      ...formData,
      goodsItems: updatedItems,
    });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      goodsItems: [
        ...formData.goodsItems,
        { item_name: "", quantity: "", unit: "", description: "" },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.goodsItems.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      goodsItems: updatedItems,
    });
  };

  useEffect(() => {
    const fetchVisitor = async () => {
      try {
        const visitorRes = await getExpectedVisitor();

        const visitorList =
          visitorRes?.data?.visitors ||
          visitorRes?.data?.data ||
          visitorRes?.data ||
          [];

        const visitorData = visitorList.map((visitor) => ({
          value: visitor.id,
          label: visitor.name,
        }));

        setVisitors(visitorData);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchStaff = async () => {
      try {
        const staffRes = await getStaff();

        const staffList =
          staffRes?.data?.staffs ||
          staffRes?.data?.data ||
          staffRes?.data ||
          [];

        const staffData = staffList.map((staff) => ({
          value: staff.id,
          label: `${staff.firstname || ""} ${staff.lastname || ""}`.trim(),
        }));

        setStaff(staffData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStaff();
    fetchVisitor();
  }, []);
  const handleFileChange = (files, fieldName) => {
    // Changed to receive 'files' directly
    setFormData({
      ...formData,
      [fieldName]: files,
    });
    console.log(fieldName);
  };

  const handleVisitorSelection = (selectedOption) => {
    console.log(selectedOption);
    setSelectedVisitor(selectedOption);
  };
  const handleStaffSelection = (selectedOption) => {
    setSelectedStaff(selectedOption);
  };
  const userId = getItemInLocalStorage("UserId");
  const navigate = useNavigate();
  const handleAddGoodsInOut = async () => {
    const isItemValid = formData.goodsItems.every(
      (item) => item.item_name && item.quantity && item.unit
    );

    if (
      (type === "visitor" && !selectedVisitor?.value) ||
      (type === "staff" && !selectedStaff?.value) ||
      !formData.noOfGoods ||
      !formData.itemType ||
      !formData.itemCategory ||
      !formData.modeOfTransport ||
      !formData.mobile_no ||
      formData.mobile_no.length !== 10 ||
      !isItemValid ||
        (ward === "out" && !formData.returnableType)
    ) {
      return toast.error("Please provide all required fields!");
    }

    const postData = new FormData();

    if (type === "visitor") {
      postData.append("goods_in_out[visitor_id]", selectedVisitor.value);
    }

    if (type === "staff") {
      postData.append("goods_in_out[staff_id]", selectedStaff.value);
    }

    postData.append("goods_in_out[no_of_goods]", formData.noOfGoods);
    postData.append("goods_in_out[description]", formData.description);
    postData.append("goods_in_out[ward_type]", ward);
    postData.append("goods_in_out[vehicle_no]", formData.vehicleNumber);
    postData.append("goods_in_out[person_name]", formData.personName);
    postData.append("goods_in_out[created_by_id]", userId);
    postData.append("goods_in_out[item_type]", formData.itemType);
    postData.append("goods_in_out[item_category]", formData.itemCategory);
    postData.append("goods_in_out[mode_of_transport]", formData.modeOfTransport);
    postData.append("goods_in_out[company_name]", formData.companyName);
    postData.append("goods_in_out[department]", formData.department);
    postData.append("goods_in_out[reporting_time]", formData.reportingTime);
    if (formData.reportingTime) {
      const formattedTime = new Date(
        `1970-01-01T${formData.reportingTime}:00`
      ).toISOString();

      if (ward === "in") {
        postData.append("goods_in_out[goods_in_time]", formattedTime);
      }

      if (ward === "out") {
        postData.append("goods_in_out[goods_out_time]", formattedTime);
      }
    }
    if (ward === "out") {
      postData.append(
        "goods_in_out[returnable_type]",
        formData.returnableType
      );
    }

    formData.goodsItems.forEach((item, index) => {
      postData.append(
        `goods_in_out[goods_items_attributes][${index}][item_name]`,
        item.item_name
      );
      postData.append(
        `goods_in_out[goods_items_attributes][${index}][quantity]`,
        item.quantity
      );
      postData.append(
        `goods_in_out[goods_items_attributes][${index}][unit]`,
        item.unit
      );
      postData.append(
        `goods_in_out[goods_items_attributes][${index}][description]`,
        item.description
      );
    });

    formData.documents.forEach((docs) => {
      postData.append("goods_files[]", docs);
    });

    try {
      const postRes = await postGoods(postData);
      console.log(postRes);

      toast.success("Goods added successfully");

      navigate("/admin/passes/goods-in-out");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add goods");
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className=" w-full flex md:mx-3 flex-col overflow-hidden">
        <div className="flex justify-center items-center my-2 w-full md:p-2">
          <div className="md:border border-gray-300 rounded-lg md:p-4 p-2 w-full md:mx-4">
            <h2
              className="text-center md:text-xl font-bold p-2 bg-black rounded-lg mb-4 text-white"
              style={{ background: themeColor }}
            >
              Add Goods
            </h2>
            <div className="grid lg:grid-cols-3">
              <div className="lg:flex grid grid-cols-2 items-center gap-5 my-2">
                <p className="font-medium">Type :</p>
                <div className="flex gap-5">
                  <h2
                    onClick={() => setType("visitor")}
                    className={`rounded-full cursor-pointer p-1 px-5 border-gray-400 border ${type === "visitor" && "bg-black text-white font-medium"
                      }`}
                  >
                    Visitor
                  </h2>
                  <h2
                    onClick={() => setType("staff")}
                    className={`rounded-full p-1 cursor-pointer px-5 border-gray-400 border ${type === "staff" && "bg-black text-white font-medium"
                      }`}
                  >
                    Staff
                  </h2>
                </div>
              </div>
              <div className="lg:flex grid grid-cols-2 items-center gap-5 my-2">
                <p className="font-medium">Inward/Outward :</p>
                <div className="flex gap-5">
                  <h2
                    onClick={() => setWard("in")}
                    className={`rounded-full cursor-pointer p-1 px-5 border-gray-400 border ${ward === "in" && "bg-black text-white font-medium"
                      }`}
                  >
                    Inward
                  </h2>
                  <h2
                    onClick={() => setWard("out")}
                    className={`rounded-full p-1 cursor-pointer px-5 border-gray-400 border ${ward === "out" && "bg-black text-white font-medium"
                      }`}
                  >
                    Outward
                  </h2>
                </div>
              </div>
            </div>
            {ward === "out" && (
              <div className="grid md:grid-cols-3 gap-5 my-2">
                <div className="flex flex-col w-full">
                  <label className="font-semibold mb-1">Return Type</label>
                  <select
                    name="returnableType"
                    value={formData.returnableType}
                    onChange={handleChange}
                    className="border p-2 rounded-md border-gray-300"
                  >
                    <option value="">Select Type</option>
                    <option value="returnable">Returnable</option>
                    <option value="non_returnable">Non Returnable</option>
                  </select>
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-5 my-2">
              {type === "visitor" ? (
                <div className="grid gap-2 items-center w-full">
                  <label htmlFor="firstName" className="font-semibold">
                    Select Visitor
                  </label>
                  <Select
                    options={visitors}
                    value={selectedVisitor}
                    onChange={handleVisitorSelection}
                    noOptionsMessage={() => "Visitors not available..."}
                  />
                </div>
              ) : (
                <div className="grid gap-2 items-center w-full">
                  <label htmlFor="firstName" className="font-semibold">
                    Select Staff
                  </label>
                  <Select
                    options={staff}
                    value={selectedStaff}
                    onChange={handleStaffSelection}
                    noOptionsMessage={() => "Staff not available..."}
                  />
                </div>
              )}
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="goodsQty" className="font-semibold">
                  No. of goods
                </label>
                <input
                  type="text"
                  id="goodsQty"
                  name="noOfGoods"
                  value={formData.noOfGoods}
                  onChange={handleChange}
                  placeholder="Enter number"
                  className="border p-2 rounded-md border-gray-300"
                  pattern="[0-9]*"
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "ArrowLeft" &&
                      e.key !== "ArrowRight"
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="vehicleNumber" className="font-semibold">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="Enter vehicle number"
                  className="border p-2 rounded-md border-gray-300"
                />
              </div>
            </div>

            {/* <h1 className="text-[15px]"><b>Item Details :</b></h1> */}

            <div className="grid md:grid-cols-3 gap-5 my-2">
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="itemType" className="font-semibold">
                  Item Type
                </label>
                <input
                  type="text"
                  id="itemType"
                  name="itemType"
                  value={formData.itemType}
                  onChange={handleChange}
                  placeholder="Enter item type"
                  className="border p-2 rounded-md border-gray-300"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="itemCategory" className="font-semibold">
                  Item Category
                </label>
                <input
                  type="text"
                  id="itemCategory"
                  name="itemCategory"
                  value={formData.itemCategory}
                  onChange={handleChange}
                  placeholder="Enter item category"
                  className="border p-2 rounded-md border-gray-300"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="reportingTime" className="font-semibold">
                  Reporting Time
                </label>
                <input
                  type="time"
                  id="reportingTime"
                  name="reportingTime"
                  value={formData.reportingTime}
                  onChange={handleChange}
                  className="border p-2 rounded-md border-gray-300"
                />
              </div>
            </div>
            {formData.goodsItems.map((item, index) => (
              <div key={index} className="border p-3 rounded-md mb-3">

                <div className="grid md:grid-cols-3 gap-5">

                  {/* Item Name */}
                  <div className="flex flex-col">
                    <label className="font-semibold mb-1">Item Name</label>
                    <input
                      type="text"
                      name="item_name"
                      value={item.item_name}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="Item Name"
                      className="border p-2 rounded-md"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col">
                    <label className="font-semibold mb-1">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="Qty"
                      className="border p-2 rounded-md"
                    />
                  </div>

                  {/* Unit */}
                  <div className="flex flex-col">
                    <label className="font-semibold mb-1">Unit</label>
                    <input
                      type="text"
                      name="unit"
                      value={item.unit}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="Unit (e.g. kg, pcs)"
                      className="border p-2 rounded-md"
                    />
                  </div>

                </div>

                {/* Description */}
                <div className="flex flex-col mt-3">
                  <label className="font-semibold mb-1">Description</label>
                  <textarea
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="Item Description"
                    className="border p-2 rounded-md w-full"
                  />
                </div>

                {/* Remove Button */}
                {formData.goodsItems.length > 1 && (
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 mt-2"
                  >
                    Remove
                  </button>
                )}

              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              + Add Item
            </button>
            <div className="grid md:grid-cols-3 gap-5 my-2">

              {/* Mode of Transport */}
              <div className="flex flex-col w-full">
                <label htmlFor="modeOfTransport" className="font-semibold mb-1">
                  Mode of Transport
                </label>
                <select
                  id="modeOfTransport"
                  name="modeOfTransport"
                  value={formData.modeOfTransport}
                  onChange={handleChange}
                  className="border p-2 rounded-md border-gray-300"
                >
                  <option value="">Select Mode of Transport</option>
                  <option value="truck">By Truck</option>
                  <option value="bike">By Bike</option>
                  <option value="car">By Car</option>
                  <option value="hand">By Hand</option>
                </select>
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col w-full">
                <label className="font-semibold mb-1">Mobile Number</label>
                <input
                  type="text"
                  name="mobile_no"
                  value={formData.mobile_no || ""}
                  onChange={(e) => {
                    // Allow only numbers & max 10 digits
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData({ ...formData, mobile_no: value });
                  }}
                  placeholder="Enter Mobile Number"
                  className="border p-2 rounded-md border-gray-300"
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="personName" className="font-semibold">
                  Visitor/Employee Name
                </label>
                <input
                  type="text"
                  id="personName"
                  name="personName"
                  value={formData.personName}
                  onChange={handleChange}
                  placeholder="Enter visitor/employee name"
                  className="border p-2 rounded-md border-gray-300"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-5 my-2">
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="companyName" className="font-semibold">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="border p-2 rounded-md border-gray-300"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="department" className="font-semibold">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                  className="border p-2 rounded-md border-gray-300"
                />
              </div>
            </div>
            {/* <div className="grid md:grid-cols-2 gap-5 my-2">
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="goodsOutTime" className="font-semibold">
                  Goods Out Time
                </label>
                <input
                  type="datetime-local"
                  id="goodsOutTime"
                  name="goodsOutTime"
                  value={formData.goodsOutTime}
                  onChange={handleChange}
                  className="border p-2 rounded-md border-gray-300"
                />
              </div>
            </div> */}
            {/* <div className="flex flex-col">
              <label htmlFor="description" className="font-medium">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                cols="30"
                rows="3"
                className="border p-2 rounded-md border-gray-300"
              ></textarea>
            </div> */}

            <div className="grid gap-2 items-center w-full mt-2">
              <label htmlFor="" className="font-semibold">
                Documents
              </label>
              <FileInputBox
                handleChange={(files) => handleFileChange(files, "documents")}
                fieldName={"documents"}
                isMulti={true}
              />
            </div>

            <div className="flex gap-5 justify-center items-center my-4">
              <button
                type="submit"
                onClick={handleAddGoodsInOut}
                className="text-white bg-black hover:bg-white hover:text-black border-2 border-black font-semibold py-2 px-4 rounded transition-all duration-300"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddGoods;
