import Collapsible from "react-collapsible";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import FileInput from "../../Buttons/FileInput";
import {
  getItemInLocalStorage,
  setItemInLocalStorage,
} from "../../utils/localStorage";
import {
  fetchSubCategories,
  getAssignedTo,
  getComplaints,
  getFloors,
  getUnits,
  postComplaintsDetails,
} from "../../api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const CreateTicket = () => {
  const navigate = useNavigate();

  const [behalf, setBehalf] = useState("self");
  const [ticketType, setTicketType] = useState("");
  //   const [selectedOption, setSelectedOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedCustomerPriority, setSelectedCustomerPriority] = useState("");
  const [units, setUnits] = useState([]);
  const [user, setUser] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [assignedUser, setAssignedUser] = useState([]);
  const [assined, setAssigned] = useState([]);
  const [reqName, setReqName] = useState("");
  const [floor, setFloor] = useState([]);
  const [unitName, setUnitName] = useState([]);

  const [formData, setFormData] = useState({
    category_type_id: "",
    sub_category_id: "",
    priority: "",
    of_phase: "pms",
    // site_id: selectedSiteId,
    heading: "",
    documents: [],
    building_name: "",
    unit_id: "",
    floor_name: "",
    assigned_to: "",
    issue_type_id: "",
    complaint_type: "",
  });

  console.log(formData);
  // console.log(attachments);

  const categories = getItemInLocalStorage("categories");
  // console.log("Categories", categories)

  const userName = localStorage.getItem("Name");

  const siteID = getItemInLocalStorage("SITEID");
  // setSelectedSiteId(siteID)

  const building = getItemInLocalStorage("Building");
  // console.log("BB", building);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchSubCategories(14);
      // console.log("subCategories:", response);
      const responce = await getComplaints();
      // console.log("complaints", responce)
    };

    const fetchAssignedTo = async () => {
      try {
        const response = await getAssignedTo();
        setAssignedUser(response.data);
        // setEditTicketInfo(response.data);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };

    const fetchFloor = async () => {
      try {
        const fetchFloor = await getFloors();
        // console.log("Floors", fetchFloor)
      } catch (error) {
        error;
      }
    };

    fetchData();
    fetchAssignedTo();
    fetchFloor();
    // fetchUnits();
  }, []);

  const handleOptionChange = (event, setState) => {
    setState(event.target.value);
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    const base64Array = [];

    for (const file of files) {
      const base64 = await convertFileToBase64(file);
      base64Array.push(base64);
    }
    // console.log("Array base64-", base64Array);
    const formattedBase64Array = base64Array.map((base64) => {
      return base64.split(",")[1];
    });

    console.log("Format", formattedBase64Array);

    setFormData({
      ...formData,
      documents: formattedBase64Array,
    });
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // file append test
  // const handleFileChange = (event, fieldName) => {
  //   const files = Array.from(event.target.files);
  //   setFormData({
  //     ...formData,
  //     [fieldName]: files,
  //   });
  // };

  const handleChange = async (e) => {
    async function fetchSubCategory(categoryId) {
      try {
        const cat = await fetchSubCategories(categoryId);
        setUnits(
          cat.data.sub_categories.map((item) => ({
            name: item.name,
            id: item.id,
          }))
        );
        // console.log(cat);
      } catch (e) {
        console.log(e);
      }
    }

    if (e.target.type === "select-one" && e.target.name === "categories") {
      const categoryId = Number(e.target.value);
      await fetchSubCategory(categoryId);
      setFormData({
        ...formData,
        category_type_id: categoryId,
        sub_category_id: "",
        documents: [],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleAssChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const buildingChange = async (e) => {
    async function fetchFloor(floorID) {
      try {
        const build = await getFloors(floorID);
        // console.log("units n", build.data);
        setFloor(build.data.map((item) => ({ name: item.name, id: item.id })));
      } catch (e) {
        console.log(e);
      }
    }

    async function getUnit(UnitID) {
      try {
        const unit = await getUnits(UnitID);
        setUnitName(
          unit.data.map((item) => ({ name: item.name, id: item.id }))
        );
      } catch (error) {
        console.log(error);
      }
    }

    if (e.target.type === "select-one" && e.target.name === "building_name") {
      const BuildID = Number(e.target.value);
      await fetchFloor(BuildID);

      setFormData({
        ...formData,
        building_name: BuildID,
      });
    } else if (
      e.target.type === "select-one" &&
      e.target.name === "floor_name"
    ) {
      const UnitID = Number(e.target.value);
      await getUnit(UnitID);
      setFormData({
        ...formData,
        floor_name: UnitID,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

if(!formData.building_name || !formData.floor_name){
  return toast.error("Please Select Building & Floor!")
}
if(!formData.category_type_id){
  return toast.error("Please select category")
}
if(!formData.heading){
  return toast.error("Please provide title")
}

    try {
      toast.loading("Please wait generating ticket!");
     
      const response = await postComplaintsDetails(formData);
      // const response = await postComplaintsDetails(formData);
      console.log("Complaint submitted successfully:", response);
      setFormData({
        category_type_id: "",
        sub_category_id: "",
        text: "",
        heading: "",
        of_phase: "pms",
        site_id: selectedSiteId,
        assigned_to: "",
        priority: "",
        documents: [],
        building_name: "",
        unit_id: "",
        floor_name: "",
        issue_type_id: "",
        complaint_type: "",
      });
      toast.dismiss();
      toast.success("Ticket generated by Admin");
      navigate("/tickets");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.dismiss();
    }
  };

  const handleReset = () => {
    setAttachments([]);
    setSelectedSubCategory("");
    setSelectedCategory("");
    setSelectedCustomerPriority("");
    setSelectedCategory("");
  };

  useEffect(() => {
    const footer = document.querySelector(".hideIt");

    const hideFooter = () => {
      if (window.innerWidth <= 786) {
        footer.classList.add("hide-on-small-screen");
      }
    };

    const handleMouseEnter = () => {
      if (window.innerWidth <= 786) {
        footer.classList.remove("hide-on-small-screen");
      }
    };

    const handleMouseLeave = () => {
      if (window.innerWidth <= 786) {
        footer.classList.add("hide-on-small-screen");
      }
    };
    setTimeout(hideFooter, 5000);
    footer.addEventListener("mouseenter", handleMouseEnter);
    footer.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      footer.removeEventListener("mouseenter", handleMouseEnter);
      footer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  const themeColor = useSelector((state) => state.theme.color);
  
  return (
    <section className="min-h-screen p-4 sm:p-0 flex flex-col md:flex-row">
      <div className="fixed hidden md:block left-0 top-0 h-full md:static md:h-auto md:flex-shrink-0">
        <Navbar />
      </div>
      <div className="flex justify-center items-center overflow-x-auto w-full  sm:w-full">
        <form
          className="border border-gray-300 rounded-lg sm:w-[60rem] p-8 flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <h2
            style={{ background: themeColor }}
            className="text-center text-xl font-bold p-2 bg-black rounded-full text-white"
          >
            Create Ticket
          </h2>

          {/* Related To :*/}
          <div className="grid md:grid-cols-2  gap-4 ">
            {/* <div className="flex flex-col gap-3 md:flex-row justify-between items-center"> */}
            {siteID === 25 && (
              <div className="grid grid-cols-2  items-center w-full">
                <label htmlFor="" className="font-semibold">
                  Related To 
                </label>
                <select
                  id="issueType"
                  value={formData.issue_type_id}
                  name="issue_type_id"
                  onChange={(e) =>
                    setFormData({ ...formData, issue_type_id: e.target.value })
                  }
                  className="border p-1 px-4 max-w-44 w-44 border-gray-500 rounded-md"
                >
                  <option value="">Select Area</option>
                  <option value="Apartment">Apartment</option>
                  {/* <option value="Suggestion">Shop</option> */}
                  <option value="common Area">Common Area</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2  items-center w-full">
              <label htmlFor="" className="font-semibold ">
                Type of 
              </label>
              <select
                id="complaintType"
                value={formData.complaint_type}
                name="complaint_type"
                onChange={(e) =>
                  setFormData({ ...formData, complaint_type: e.target.value })
                }
                className="border p-1 px-4 max-w-44 w-44 border-gray-500 rounded-md "
              >
                <option value="">Select Issue Type</option>
                <option value="Complaint">Complaint</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Request">Request</option>
              </select>
            </div>
            {/* </div> */}
            
              {/* Building details */}
              {/* <div className="flex sm:flex-row flex-col gap-3 sm:gap-0 justify-between items-center"> */}
              <div className="grid grid-cols-2  items-center w-full">
                <label htmlFor="" className="font-semibold ">
                  Tower Name <span className="text-red-500">*</span>
                </label>
                <select
                  id="builiding_name"
                  value={formData.building_name}
                  name="building_name"
                  onChange={buildingChange}
                  className="border p-1 px-4 max-w-44 w-44 border-gray-500 rounded-md"
                >
                  <option value="">Select Tower</option>
                  {building?.map((build) => (
                    <option key={build.id} value={build.id}>
                      {build.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Floor Name */}
              <div className="grid grid-cols-2 items-center w-full">
                <label htmlFor="" className="font-semibold">
                  Floor Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.floor_name}
                  name="floor_name"
                  onChange={buildingChange}
                  className="border p-1 px-4 max-w-44 w-44 border-gray-500 rounded-md"
                >
                  <option value="">Select Floor</option>
                  {floor?.map((floorId) => (
                    <option
                      key={floorId.id}
                      // onClick={() => console.log("checking-category")}
                      value={floorId.id}
                    >
                      {floorId.name}
                    </option>
                  ))}
                </select>
              </div>
            
            {/* </div> */}

            {/* <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 justify-between "> */}
            <div className="grid grid-cols-2 items-center w-full">
              <label htmlFor="" className="font-semibold ">
                Unit Name 
              </label>

              <select
                id="six"
                value={formData.unit_id}
                name="unit_id"
                onChange={buildingChange}
                className="border p-1 px-4 max-w-44 w-44 border-gray-500 rounded-md"
              >
                <option value="">Unit Name</option>
                {unitName?.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2  items-center w-full">
              <label htmlFor="" className="font-semibold ">
                Priority 
              </label>
              <select
                value={formData.priority}
                onChange={handleChange}
                id="priority"
                name="priority"
                className=" p-1 max-w-44 w-44  border-gray-500 border rounded-md px-4"
              >
                <option value="">Select Priority</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="P4">P4</option>
                <option value="P5">P5</option>
              </select>
            </div>
            {/* </div> */}

            {/* <div className="flex sm:grid sm:grid-cols-2 flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0"> */}
            <div className="grid grid-cols-2  items-center w-full">
              <label htmlFor="" className="font-semibold ">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="two"
                value={formData.catogories}
                name="categories"
                onChange={handleChange}
                className="border p-1 px-4 max-w-44 w-44 grid border-gray-500 rounded-md"
              >
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option
                    onClick={() => console.log("checking-category")}
                    value={category.id}
                    key={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2  items-center w-full">
              <label htmlFor="" className="font-semibold ">
                Sub Category 
              </label>
              <select
                id="five"
                value={formData.subCategories}
                name="sub_category_id"
                onChange={handleChange}
                className="border p-1 px-4 max-w-44 w-44 grid border-gray-500 rounded-md"
              >
                <option value="">Sub Category</option>
                {units?.map((floor) => (
                  <option value={floor.id} key={floor.id}>
                    {floor.name}
                  </option>
                ))}
              </select>
            </div>
              <div className="grid grid-cols-2 ">
                <label htmlFor="" className=" font-semibold ">
                  Assigned To 
                </label>
                <select
                  value={formData.assigned_to || ""}
                  name="assigned_to"
                  onChange={(e) =>
                    setFormData({ ...formData, assigned_to: e.target.value })
                  }
                  className="border p-1 px-4 max-w-44 w-44 border-gray-500 rounded-md"
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
          <div>
            {/* Category, Sub Category, Assigned To, Priority */}
            {/* <div className="flex flex-col sm:flex-row items-center justify-between"> */}
            {/* </div> */}
            {/* <div className="flex sm:block my-5 sm:flex-row items-center justify-center"> */}
            <div className="flex flex-col justify-around">
              <label
                htmlFor=""
                className="font-semibold my-2 flex justify-start"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <textarea
                name="heading"
                placeholder="Enter Title"
                rows=""
                cols={25}
                value={formData.heading}
                onChange={handleChange}
                className="border px-2 rounded-md flex flex-auto border-black w-full"
              ></textarea>
            </div>
            {/* </div> */}
          </div>

          {/* Description */}
          {/* <div className="flex sm:block sm:flex-row items-center justify-center"> */}
          <div className="flex flex-col justify-around ">
            <label htmlFor="" className="font-semibold">
              Description 
            </label>
            <textarea
              name="text"
              placeholder=" Describe your concern!"
              id=""
              cols="25"
              rows="3"
              className="border border-black rounded-md px-2"
              value={formData.text}
              onChange={handleChange}
            />
          </div>
          {/* </div> */}

          {/* File Input */}
          <FileInput
            handleFileChange={(event) => handleFileChange(event)}
            multiple
          />
          {/* <input
                type="file"
                onChange={(event) => handleFileChange(event, "documents")}
                className="file:bg-black file:text-white file:rounded-full file:p-2 file:px-4 file:font-semibold bg-gray-300 p-2 rounded-full"
                multiple
              /> */}
          <div>
            {attachments.map((file, index) => (
              <div key={index}>
                {/* <p className="text-green">File Name: {file.name}</p> */}
              </div>
            ))}
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex gap-5 justify-center items-center my-4">
            <button
              type="submit"
              className="bg-black text-white hover:bg-gray-700 font-semibold text-xl py-2 px-4 rounded"
            >
              Submit
            </button>
            <button
              type="reset"
              className="bg-gray-400 text-black hover:bg-black hover:text-white font-semibold text-xl py-2 px-4 rounded"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateTicket;
