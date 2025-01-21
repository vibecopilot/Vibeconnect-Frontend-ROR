import React, { useEffect, useRef, useState } from "react";
import { FaCheck, FaPlus, FaPlusCircle, FaTrash } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import {
  getIncidentCatDetails,
  getIncidentDetails,
  getIncidentSubTags,
  getIncidentTags,
  updateIncidents
} from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { getItemInLocalStorage } from "../../utils/localStorage";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
const EditIncident = () => {
  const [incident, setIncident] = useState([{ name: "", mobile: "" }]);
  const [checkbutton, setCheckbutton] = useState();
  const [medical, setMedical] = useState();
  const { id } = useParams();
  const [investigation, setInvestigation] = useState([
    { name1: "", mobile1: "" },
  ]);

  const handleAddIncident = (event) => {
    event.preventDefault();
    setIncident([...incident, { name: "", mobile: "" }]);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newIncident = [...incident];
    newIncident[index][name] = value;
    setIncident(newIncident);
  };

  const handleRemoveIncident = (index) => {
    const newIncident = [...incident];
    newIncident.splice(index, 1);
    setIncident(newIncident);
  };

  const handleAddInvestigation = (event) => {
    event.preventDefault();
    setInvestigation([...investigation, { name1: "", mobile1: "" }]);
  };

  const handleInputChange1 = (index, event) => {
    const { name1, value } = event.target;
    const newInvestigation = [...investigation];
    newInvestigation[index][name1] = value;
    setInvestigation(newInvestigation);
  };

  const handleRemoveInvestigation = (index) => {
    const newInvestigation = [...investigation];
    newInvestigation.splice(index, 1);
    setInvestigation(newInvestigation);
  };

  const themeColor = useSelector((state) => state.theme.color);

  const [formData, setFormData] = useState({
    date_time: "",
    buildingId: "",
    primaryCategory: "",
    primarySubCategory: "",
    primarySubSubCategory: "",
    secondaryCategory: "",
    secondarySubCategory: "",
    secondarySubSubCategory: "",
    severity: "",
    level: "",
    probability: "",
    description: "",
    supportRequired: false,
    factsStated: false,
    attachment: [],
    hasPropertyDamaged: false,
    insuranceCovered: false,
    Rca : "",
    rootcausecategory:"",
    preventiveAction:"",
    correctiveAction:"",
    sentMedicalTreatment: "",

  });
  const datePickerRef = useRef(null);
  const handleIncidentDateChange = (date) => {
    setFormData({ ...formData, date_time: date });
  };
  
  useEffect(() => {
    const fetchIncidentDetails = async () => {
      try {
        const res = await getIncidentDetails(id);
        const data = res.data;
        setFormData({
          ...formData,
          date_time: data.time_and_date ? new Date(data.time_and_date) : null,
          buildingId: data.building_id,
          primaryCategory: data.primary_incident_category, 
          primarySubCategory: data.primary_incident_sub_category,
          primarySubSubCategory: data.primary_incident_sub_sub_category,
          secondaryCategory: data.secondary_incident_category,
          secondarySubCategory: data.secondary_incident_sub_category,
          secondarySubsubCategory: data.secondary_incident_sub_sub_category,
          severity: data.severity,
          level: data.level,
          probability: data.probability,
          description: data.description,
          supportRequired: data.support_required,
          factsStated: data.facts_stated,
          attachment: data.attachment,
          hasPropertyDamaged: data.has_property_damaged,
          insuranceCovered: data.insurance_covered,
          IncidentRCACategory:data.IncidentRCACategory,

         
        });
        fetchCategoryName(data.primary_incident_category)
        fetchSubCategory(data.primary_incident_category)
        fetchSubCategoryName(data.primary_incident_sub_category)
        fetchSubSubCategory(data.primary_incident_sub_category)

        // fetchCategoryName(data.secondary_incident_category)
        // fetchSubCategory(data.secondary_incident_category)

       // fetchIncidentsSecondaryCategory(data.secondary_incident_category)
       fetchSecCategoryName(data.secondary_incident_category)
    
        fetchSecondarySubCategory(data.secondary_incident_category)
        fetchSecSubCategoryName(data.secondary_incident_sub_category)

        fetchSecondarySubSubCategory(data.secondary_incident_sub_sub_category)
        
        fetchIncidentsLevel(data.level)
        fetchIncidentDamage(data.has_property_damaged)
        fetchIncidentRCA(data.Rca)

        console.log(formData.primarySubCategory)
      } catch (error) {
        console.log(error);
      }
    };
    fetchIncidentDetails();
  }, []);
console.log(formData)
  const fetchSubCategory = async (CategoryId) => {
    try {
      const res = await getIncidentSubTags("IncidentSubCategory", CategoryId);
      setSubPrimaryCat(res.data);
      console.log(primarySubCat)
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSubCategoryName = async (SubCategoryId) => {
    try {
      const res = await getIncidentCatDetails(SubCategoryId);
      setSubCatName(res.data.name);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCategoryName = async (CategoryId) => {
    try {
      const res = await getIncidentCatDetails(CategoryId);
      setCatName(res.data.name);
    } catch (error) {
      console.log(error);
    }
    
  };

  const fetchSubSubCategory = async (CategoryId) => {
    try {
      const res = await getIncidentSubTags(
        "IncidentSubSubCategory",
        CategoryId
      );
      setSubSubPrimaryCat(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const fetchSecSubCategoryName = async (CategoryId) => {
    try {
      const res = await getIncidentCatDetails(CategoryId);
      setSecSubCatName(res.data.name);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSecCategoryName = async (CategoryId) => {
    try {
      const res = await getIncidentCatDetails(CategoryId);
      setSecCatName(res.data.name);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchIncidentsLevel = async () => {
      try {
        const res = await getIncidentTags("IncidentLevel");
        setIncidentLevel(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    

    const fetchSecondarySubCategory = async (CategoryId) => {
      try {
        const res = await getIncidentSubTags(
          "IncidentSecondarySubCategory",
          CategoryId
        );
        setSecondarySubCat(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSecondarySubSubCategory = async (CategoryId) => {
      try {
        const res = await getIncidentSubTags(
          "IncidentSecondarySubSubCategory",
          CategoryId
        );
        setSecondarySubSubCat(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchIncidentRCA = async () => {
      try {
        const res = await getIncidentTags("IncidentRCACategory");
        setRCA(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchIncidentDamage = async () => {
      try {
        const res = await getIncidentTags("IncidentDamageCategory");
        setIncidentDamage(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    
   


  const [catName, setCatName] = useState("");
  const [subCatName, setSubCatName] = useState("");
  const [primarySubCat, setSubPrimaryCat] = useState([]);
  const [primarySubSubCat, setSubSubPrimaryCat] = useState([]);
  const handleChangeIncident = async (e) => {
    const fetchCategoryName = async (CategoryId) => {
      try {
        const res = await getIncidentCatDetails(CategoryId);
        setCatName(res.data.name);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSubCategoryName = async (SubCategoryId) => {
      try {
        const res = await getIncidentCatDetails(SubCategoryId);
        setSubCatName(res.data.name);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSubCategory = async (CategoryId) => {
      try {
        const res = await getIncidentSubTags("IncidentSubCategory", CategoryId);
        setSubPrimaryCat(res.data);
        console.log(primarySubCat)
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSubSubCategory = async (CategoryId) => {
      try {
        const res = await getIncidentSubTags(
          "IncidentSubSubCategory",
          CategoryId
        );
        setSubSubPrimaryCat(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (e.target.type === "select-one" && e.target.name === "primaryCategory") {
      console.log("sub cat");
      const catId = Number(e.target.value);
      await fetchCategoryName(catId);
      await fetchSubCategory(catId);
      setFormData({ ...formData, primaryCategory: catId });
    } else if (
      e.target.type === "select-one" &&
      e.target.name === "primarySubCategory"
    ) {
      const subCatId = Number(e.target.value);
      await fetchSubCategoryName(subCatId);
      await fetchSubSubCategory(subCatId);

      setFormData({ ...formData, primarySubCategory: subCatId });
    } else if (
      e.target.type === "select-one" &&
      e.target.name === "primarySubSubCategory"
    ) {
      const subSubCatId = Number(e.target.value);

      setFormData({ ...formData, primarySubSubCategory: subSubCatId });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  const buildings = getItemInLocalStorage("Building");
  const [primaryCat, setPrimaryCat] = useState([]);
  const [secondaryCat, setSecondaryCat] = useState([]);
  const [incidentLevel, setIncidentLevel] = useState([]);
  const [incidentDamage, setIncidentDamage] = useState([]);
  const [rca, setRCA] = useState([]);
  useEffect(() => {
    const fetchIncidentsCategory = async () => {
      try {
        const res = await getIncidentTags("IncidentCategory");
        setPrimaryCat(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchIncidentsSecondaryCategory = async () => {
      try {
        const res = await getIncidentTags("IncidentSecondaryCategory");
        setSecondaryCat(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchIncidentsLevel = async () => {
      try {
        const res = await getIncidentTags("IncidentLevel");
        setIncidentLevel(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchIncidentDamage = async () => {
      try {
        const res = await getIncidentTags("IncidentDamageCategory");
        setIncidentDamage(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchIncidentRCA = async () => {
      try {
        const res = await getIncidentTags("IncidentRCACategory");
        setRCA(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    

    fetchIncidentsCategory();
    fetchIncidentsSecondaryCategory();
    fetchIncidentsLevel();
    fetchIncidentDamage();
    fetchIncidentRCA();
  }, []);

  const [secondarySubCat, setSecondarySubCat] = useState([]);
  const [secondarySubSubCat, setSecondarySubSubCat] = useState([]);
  const [secCatName, setSecCatName] = useState("");
  const [secSubCatName, setSecSubCatName] = useState("");
  

  const handleSecondaryCategoryChange = async (e) => {
    const fetchSecCategoryName = async (CategoryId) => {
      try {
        const res = await getIncidentCatDetails(CategoryId);
        setSecCatName(res.data.name);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSecSubCategoryName = async (CategoryId) => {
      try {
        const res = await getIncidentCatDetails(CategoryId);
        setSecSubCatName(res.data.name);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSecondarySubCategory = async (CategoryId) => {
      try {
        const res = await getIncidentSubTags(
          "IncidentSecondarySubCategory",
          CategoryId
        );
        setSecondarySubCat(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSecondarySubSubCategory = async (CategoryId) => {
      try {
        const res = await getIncidentSubTags(
          "IncidentSecondarySubSubCategory",
          CategoryId
        );
        setSecondarySubSubCat(res.data);
      } catch (error) {
        console.log(error);
      }
    };

   
    if (
      e.target.type === "select-one" &&
      e.target.name === "secondaryCategory"
    ) {
      const secCatId = Number(e.target.value);
      await fetchSecondarySubCategory(secCatId);
      await fetchSecCategoryName(secCatId);
      setFormData({ ...formData, secondaryCategory: secCatId });
    } else if (
      e.target.type === "select-one" && 
      e.target.name === "secondarySubCategory"
    ) {
      const secSubCatId = Number(e.target.value);
      await fetchSecondarySubSubCategory(secSubCatId);
      await fetchSecSubCategoryName(secSubCatId);
      setFormData({ ...formData, secondarySubCategory: secSubCatId });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const [costs, setCosts] = useState({
    equipmentCost: "",
    productionLoss: "",
    treatmentCost: "",
    absenteeismCost: "",
    otherCost: "",
    totalCost: "0.00",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : parseFloat(value) || 0;
    const updatedCosts = {
      ...costs,
      [name]: numericValue,
    };
    const total =
      (parseFloat(updatedCosts.equipmentCost) || 0) +
      (parseFloat(updatedCosts.productionLoss) || 0) +
      (parseFloat(updatedCosts.treatmentCost) || 0) +
      (parseFloat(updatedCosts.absenteeismCost) || 0) +
      (parseFloat(updatedCosts.otherCost) || 0);

    setCosts({
      ...updatedCosts,
      totalCost: total.toFixed(2),
    });
  };
const userId = getItemInLocalStorage("UserId")
  const navigate = useNavigate()
  const handleSave = async () => {
    const sendData = new FormData(); 
    sendData.append("incident[time_and_date]", formData.date_time);
    sendData.append(
      "incident[primary_incident_category]",
      formData.primaryCategory
    );
    sendData.append(
      "incident[primary_incident_sub_category]",
      formData.primarySubCategory 
    );
    sendData.append("incident[primary_incident_sub_sub_category]", formData.primarySubSubCategory);

    sendData.append(
      "incident[secondary_incident_category]",
      formData.secondaryCategory 
    );
    
    sendData.append(
      "incident[secondary_incident_sub_category]",
      formData.secondarySubCategory
    );
    sendData.append(
      "incident[secondary_incident_sub_sub_category]",
      formData.secondarySubSubCategory 
    );
    sendData.append(
      "incident[support_required]",
      formData.supportRequired 
    );
     sendData.append(
      "incident[first_aid_provided_employee]",
      formData.first_aid_provided_employee 
     );
    sendData.append(
      "incident[read_facts_states]",
      formData.factsStated 
    );
   
    
    console.log(formData)
    console.log(costs)
    sendData.append("incident[cost_of_incident][equipment_property_cost]", costs.equipmentCost);
    sendData.append("incident[cost_of_incident][production_loss]", costs.productionLoss);
    sendData.append("incident[cost_of_incident][treatment_cost]", costs.treatmentCost);
    sendData.append("incident[cost_of_incident][absenteeism_cost]", costs.absenteeismCost);
    sendData.append("incident[cost_of_incident][other_cost]", costs.otherCost);
    sendData.append("incident[cost_of_incident][total_cost]", costs.totalCost);
    
    sendData.append("incident[incident_severity]", formData.severity);
    sendData.append("preventive_action]", formData.preventiveAction);
    sendData.append("corrective_action]", formData.correctiveAction);
    sendData.append("sent_medical_treatment]", formData.sentMedicalTreatment);
  
     sendData.append("incident[primary_root_cause_category]", costs.rootcausecategory);
    sendData.append("incident[rca]", formData.Rca);
    sendData.append("incident[incident_level]", formData.level);
    sendData.append("incident[building_id]", formData.buildingId);
    sendData.append("incident[probability]", formData.probability);
    sendData.append("incident[description]", formData.description);
    sendData.append("incident[created_by_id]", userId);
    // formData.attachment.forEach((file, index) => {
    //   sendData.append(`incident[attachments_attributes][][file]`, file);
    // });
    try {
      const res = await updateIncidents(id, sendData);
      toast.success("incident update successfully");
      navigate("/admin/incidents");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="border pb-2 flex flex-col my-2 md:mx-20 px-4  gap-4 rounded-md border-gray-400">
          <h2
            className="text-center text-lg my-2 font-semibold p-2 rounded-md text-white"
            style={{ background: themeColor }}
          >
            Edit Incidents
          </h2>
          <h2 className="text-lg border-black border-b font-semibold">
            DETAILS
          </h2>
          <div className="flex flex-col justify-around ">
            <div className="grid md:grid-cols-3 item-start gap-x-4 gap-y-5 w-full p-2">
              <div className="flex flex-col ">
                <label htmlFor="" className="font-semibold text-sm">
                  Time & Date
                </label>
                <DatePicker
                  selected={formData.date_time}
                  onChange={handleIncidentDateChange}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy h:mm aa"
                  placeholderText="Select end date & time"
                  ref={datePickerRef}
                  // minDate={currentDate}
                  className="border border-gray-400 rounded-md p-2 w-full "
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold text-sm">
                  Building
                </label>
                <select
                  name="buildingId"
                  value={formData.buildingId}
                  onChange={handleChangeIncident}
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
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
                <label htmlFor="" className="font-semibold text-sm">
                  Select The Incident Primary Category
                </label>
                <select
                  name="primaryCategory"
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                  value={formData.primaryCategory}
                  onChange={handleChangeIncident}
                >
                  <option value="">Select Primary Category</option>
                  {primaryCat.map((cat) => (
                    <option value={cat.id} key={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold text-sm">
                  Select The Category For The{" "}
                  <span className="text-blue-500">{catName}</span> Incident
                </label>
                <select
                  name="primarySubCategory"
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                  value={formData.primarySubCategory}
                  onChange={handleChangeIncident}
                >
                  <option value="">Select </option>
                  {primarySubCat.map((subCat) => (
                    <option value={subCat.id} key={subCat.id}>
                      {subCat.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* subCatName */}
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold text-sm">
                  Select The Category For The{" "}
                  <span className="text-blue-500">{subCatName}</span> Incident
                </label>
                <select
                  name="primarySubSubCategory"
                  value={formData.primarySubSubCategory}
                  onChange={handleChangeIncident}
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select </option>
                  {primarySubSubCat.map((subSubCat) => (
                    <option value={subSubCat.id} key={subSubCat.id}>
                      {subSubCat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                {/* secCatName */}
                <label htmlFor="" className="font-semibold text-sm">
                  Select The Secondary Category
                </label>
                <select
                  name="secondaryCategory"
                  onChange={handleSecondaryCategoryChange}
                  id=""
                  value={formData.secondaryCategory}
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select </option>
                  {secondaryCat.map((secCat) => (
                    <option value={secCat.id} key={secCat.id}>
                      {secCat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold text-sm">
                  Select The Secondary for the{" "}
                  <span className="text-blue-500">{secCatName}</span> Category
                </label>
                <select
                  name="secondarySubCategory"
                  onChange={handleSecondaryCategoryChange}
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                  value={formData.secondarySubCategory}
                >
                  <option value="">Select </option>
                  {secondarySubCat.map((secSubCat) => (
                    <option value={secSubCat.id} key={secSubCat.id}>
                      {secSubCat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold text-sm">
                  Select The Secondary for the{" "}
                  <span className="text-blue-500">{secSubCatName}</span>{" "}
                  Category
                </label>
                <select
                  name="secondarySubSubCategory"
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                  value={formData.secondarySubSubCategory}
                  onChange={handleSecondaryCategoryChange}
                >
                  <option value="">Select </option>
                  {secondarySubSubCat.map((secSubSubCat) => (
                    <option value={secSubSubCat.id} key={secSubSubCat.id}>
                      {secSubSubCat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold text-sm">
                  Probability
                </label>
                <select
                  name="probability"
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                  value={formData.probability}
                  onChange={handleChangeIncident}
                >
                  <option value="">Select Probability</option>
                  <option value="Rare">Rare </option>
                  <option value="Possible">Possible </option>
                  <option value="Likely">Likely </option>
                  <option value="Often">Often </option>
                  <option value="Frequent Almost/Certain">
                    Frequent Almost/Certain
                  </option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold text-sm">
                  Incident level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChangeIncident}
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select Level </option>
                  {incidentLevel.map((level) => (
                    <option value={level.name} key={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold text-sm">
                  Has Any Property Damage Happened In The Incident?
                </label>
                <select
                  name="hasPropertyDamaged"
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                  value={formData.hasPropertyDamaged}
                  onChange={handleChangeIncident}
                >
                  <option value="">Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              {formData.hasPropertyDamaged && (
                <>
                  <div className="flex flex-col">
                    <label htmlFor="" className="font-semibold text-sm">
                      Property Damage Category
                    </label>
                    <select
                      name=""
                      id=""
                      className="border p-2 border-gray-500 rounded-md"
                    >
                      <option value="">Select </option>
                      {incidentDamage.map((damage) => (
                        <option key={damage.id} value={damage.id}>
                          {damage.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="" className="font-semibold text-sm">
                      Damage covered under insurance
                    </label>
                    <select
                      name="insuranceCovered"
                      value={formData.insuranceCovered}
                      onChange={handleChangeIncident}
                      id=""
                      className="border p-2 border-gray-500 rounded-md"
                    >
                      <option value="">Select </option>
                      <option value={true}>Yes </option>
                      <option value={false}>No </option>
                    </select>
                  </div>
                </>
              )}
              {formData.insuranceCovered && (
                <div className="flex flex-col">
                  <label htmlFor="" className="font-semibold text-sm">
                    Insured by
                  </label>
                  <select
                    name=""
                    id=""
                    className="border p-2 border-gray-500 rounded-md"
                  >
                    <option value="">Select </option>
                    <option value="">Building insurance </option>
                    <option value="">Private/Individual </option>
                    <option value="">others </option>
                  </select>
                </div>
              )}

<div className="flex flex-col">
                <label htmlFor="" className="font-semibold text-sm">
                  Severity
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                  onChange={handleChangeIncident}
                >
                  <option value="">Select Severity </option>
                  <option value="Insignificant">Insignificant </option>
                  <option value="Minor">Minor </option>
                  <option value="Moderate">Moderate </option>
                  <option value="Major">Major </option>
                  <option value="catasTrophic">catasTrophic </option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold text-sm">
                  RCA
                </label>
                <input
                onChange={handleChangeIncident}
                  type="text"
                  name="Rca"
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                  placeholder="Root cause analysis"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold text-sm">
                  Primary root cause category
                </label>
                <select
                  name=""
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select </option>
                  {rca.map((rca) => (
                    <option value={rca.name} key={rca.id}>
                      {rca.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Description
                </label>
                <textarea
                  name="description"
                  id=""
                  cols="5"
                  rows="2"
                  placeholder="Accident near Main Gate"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  value={formData.description}
                  onChange={handleChangeIncident}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold text-sm">
                  Corrective action
                </label>
                <textarea
                onChange={handleChangeIncident}
                value={formData.correctiveAction}
                  name="correctiveAction"
                  id=""
                  cols="5"
                  rows="2"
                  placeholder="Accident near Main Gate"
                  className="border p-2 border-gray-500 rounded-md"
                />
              </div>

              <div className="flex flex-col ">
                <label htmlFor="" className="font-semibold text-sm">
                  Preventive action
                </label>
                <textarea
                onChange={handleChangeIncident}
                value={formData.preventiveAction}
                  name="preventiveAction"
                  id=""
                  cols="5"
                  rows="p"
                  placeholder="Accident near Main Gate"
                  className="border p-2 border-gray-500 rounded-md"
                />
              </div>
            </div>
          </div>

          <h2 className="text-lg border-black border-b font-semibold ">
            ADD WITNESSES DETAILS
          </h2>
          <div>
            {incident.map((incident1, index) => (
              <div key={index}>
                <div className="grid md:grid-cols-3 item-start gap-x-4 gap-y-4 mb-3 w-full">
                  <div className="flex flex-col">
                    <label htmlFor="" className="font-semibold text-sm">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      value={incident.mobile}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="" className="font-semibold text-sm">
                      Mobile
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Mobile"
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      value={incident.mobile}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => handleRemoveIncident(index)}
                      className="text-red-400"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              className="font-semibold border-2 border-black  p-1 flex items-center gap-2 rounded-md"
              onClick={handleAddIncident}
            >
              <FaPlusCircle /> Add More
            </button>
          </div>
        </div>
        <div className="border flex flex-col my-2 md:mx-20 p-4 gap-4 rounded-md border-gray-400 ">
          <h2 className="text-lg border-black border-b font-semibold ">
            COST OF INCIDENT
          </h2>
          <div className="flex flex-col justify-around ">
            <div className="grid md:grid-cols-3 item-start gap-x-4 gap-y-3 w-full">
              <div className="flex flex-col">
                <label
                  htmlFor="equipmentCost"
                  className="font-semibold text-sm"
                >
                  Equipment/Property Damaged Cost
                </label>
                <input
                  type="text"
                  name="equipmentCost"
                  placeholder="Equipment/Property Damaged Cost"
                  value={costs.equipmentCost}
                  onChange={handleChange}
                  className="border p-2 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="productionLoss"
                  className="font-semibold text-sm"
                >
                  Production Loss
                </label>
                <input
                  type="text"
                  name="productionLoss"
                  placeholder="Production Loss"
                  value={costs.productionLoss}
                  onChange={handleChange}
                  className="border p-2 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="treatmentCost"
                  className="font-semibold text-sm"
                >
                  Treatment Cost
                </label>
                <input
                  type="text"
                  name="treatmentCost"
                  placeholder="Treatment Cost"
                  value={costs.treatmentCost}
                  onChange={handleChange}
                  className="border p-2 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="absenteeismCost"
                  className="font-semibold text-sm"
                >
                  Absenteeism Cost
                </label>
                <input
                  type="text"
                  name="absenteeismCost"
                  placeholder="Absenteeism Cost"
                  value={costs.absenteeismCost}
                  onChange={handleChange}
                  className="border p-2 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="otherCost" className="font-semibold text-sm">
                  Other Cost
                </label>
                <input
                  type="text"
                  name="otherCost"
                  placeholder="Other Cost"
                  value={costs.otherCost}
                  onChange={handleChange}
                  className="border p-2 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="totalCost" className="font-semibold text-sm">
                  Total Cost
                </label>
                <input
                  type="text"
                  name="totalCost"
                  value={costs.totalCost}
                  readOnly
                  className=" p-2 border-gray-500 rounded-md outline-none bg-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border flex flex-col my-2 md:mx-20 p-4 gap-4 rounded-md border-gray-400 ">
          <h2 className=" text-lg border-black border-b font-semibold ">
            FIRST AID PROVIDED
          </h2>
          <div className="grid  items-center gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="meterApplicable">
                Was First Aid provided by Employees ?{" "}
              </label>
              <input
                type="checkbox"
                name=""
                id="meterApplicable"
                onClick={() => setCheckbutton(!checkbutton)}
              />
            </div>
            {checkbutton && (
              <>
                <div className="flex flex-col">
                  <label htmlFor="" className="font-medium text-sm">
                    Name of First Aid Attendants
                  </label>
                  <input
                    type="text"
                    placeholder="Name of First Aid Attendants"
                    className="border p-2 border-gray-500 rounded-md w-full"
                    value={incident.mobile}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="border flex flex-col my-2 md:mx-20 p-4 gap-4 rounded-md border-gray-400 ">
          <h2 className=" text-lg border-black border-b font-semibold ">
            MEDICAL TREATMENT
          </h2>
          <div className="grid  w-full  gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="meterApplicable">
                Sent for Medical Treatment{" "}
              </label>
              <input
                type="checkbox"
                name=""
                id="meterApplicable"
                onClick={() => setMedical(!medical)}
              />
            </div>
            {medical && (
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col ">
                  <label htmlFor="" className="text-sm font-medium">
                    Treatment Facility
                  </label>
                  <input
                    type="text"
                    placeholder=" Treatment Facility"
                    className="border p-2 border-gray-500 rounded-md w-full"
                  />
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="" className="text-sm font-medium">
                    Attending Physician
                  </label>
                  <input
                    type="text"
                    placeholder=" Attending Physician"
                    className="border p-2 border-gray-500 rounded-md w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border flex flex-col my-2 md:mx-20 p-4 gap-4 rounded-md border-gray-400 ">
          <h2 className=" text-lg border-black border-b font-semibold ">
            ADD INVESTIGATION TEAM DETAILS
          </h2>
          <div>
            {investigation.map((investigation1, index) => (
              <div key={index}>
                <div className="grid md:grid-cols-4 item-start gap-x-4 gap-y-4 mb-3 w-full">
                  <div className="flex flex-col">
                    <label htmlFor="" className="font-semibold text-sm">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      value={investigation.mobile1}
                      onChange={(event) => handleInputChange1(index, event)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="" className="font-semibold text-sm">
                      Mobile
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Mobile"
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      value={investigation.mobile1}
                      onChange={(event) => handleInputChange1(index, event)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="" className="font-semibold text-sm">
                      Designation
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Designation"
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      value={investigation.mobile1}
                      onChange={(event) => handleInputChange1(index, event)}
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveInvestigation(index)}
                    className="text-red-400"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            <button
              className="font-semibold border-2 border-black  p-1 flex items-center gap-2 rounded-md"
              onClick={handleAddInvestigation}
            >
              <FaPlusCircle /> Add More
            </button>
          </div>
        </div>
        <div className="border flex flex-col my-2 md:mx-20 p-4 gap-4 rounded-md border-gray-400">
          <div className=" ">
            <div className="flex items-center gap-2">
              {/* <label htmlFor="meterApplicable">Support</label> */}
              <input type="checkbox" name="" id="meterApplicable" />
              <label htmlFor="meterApplicable">Support required</label>
            </div>
            <div className="flex md:flex-row flex-col gap-2">
              {/* <label htmlFor="meterApplicable">Disclaimer </label>
               */}
              <div className="flex items-center gap-2">
                <input type="checkbox" name="" id="meterApplicable" />
                <label htmlFor="meterApplicable">
                  I have correctly stated all the facts related to the incident
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="border flex flex-col my-2 md:mx-20 p-4 gap-4 rounded-md border-gray-400 ">
          <h2 className=" text-lg border-black border-b font-semibold ">
            ATTACHMENTS
          </h2>
          <FileInputBox />
        </div>
        <div className="flex justify-center gap-2 mb-20 my-3 border-t p-1">
          <button className="font-semibold bg-red-400 text-white  p-2 px-4 flex gap-2 rounded-md items-center" onClick={()=> navigate("/admin/incidents")}>
            <MdClose /> Cancel
          </button>
          <button onClick={handleSave} className="font-semibold bg-green-500 text-white p-2 px-4 flex items-center gap-2 rounded-md">
            <FaCheck /> Save
          </button>
        </div>
      </div>
    </section>
  );
};

export default EditIncident;
