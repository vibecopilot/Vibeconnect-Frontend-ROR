import React, { useEffect, useState } from "react";
import { BiEdit, BiPlus } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { editChecklist, getChecklistDetails, getChecklistGroupReading, getHostList, getVendors } from "../../../api";
import { CloseCircle, CloseOutline } from "react-ionicons";
import Select from 'react-select';
import Cron from "react-js-cron";
import "react-js-cron/dist/styles.css";

const PPMChecklistDetails = () => {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [update, setUpdate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [supplierid, setsupplierid] = useState("");
  const [lockOverdueTask, setLockOverdueTask] = useState("");
  const [allowedmin, setallowedmin] = useState("");
  const [extensionmin, setextensionmin] = useState("");
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [supervisorOptions, setSupervisorOptions] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [submitDays, setSubmitDays] = useState(0);
const [submitHours, setSubmitHours] = useState(0);
const [submitMinutes, setSubmitMinutes] = useState(0);
const [extensionDays, setExtensionDays] = useState(0);
const [extensionHours, setExtensionHours] = useState(0);
const [extensionMinutes, setExtensionMinutes] = useState(0);

  const [cronExpression, setCronExpression] = useState("0 0 * * *");
  const [site, setSites] = useState([]);

  const handleCronChange = (newCron) => {
    setCronExpression(newCron);
  };
  useEffect(() => {
    const fetchSiteOwners = async () => {
      try {
        const resp = await getChecklistGroupReading();
        
        setSites(resp.data);
      } catch (error) {
        console.log("Error fetching site owners:", error);
      }
    };
    fetchSiteOwners();
  }, []);
  const [addNewQuestion, setAddNewQuestion] = useState([
    { id: "", name: "", type: "", options: ["", "", "", ""],value_types: ["", "", "", ""],
      question_mandatory: false, reading: false, showHelpText: false,help_text:"",rating:false,group:"",groupId:"",
       _destroy: "0" },
  ]);

  const handleAddQuestionFields = () => {
  
    setAddNewQuestion([
      ...addNewQuestion,
      { name: "", type: "", options: ["", "", "", ""],value_types: ["", "", "", ""],question_mandatory: false, reading: false, showHelpText: false,help_text:"",rating:false ,group:"",groupId:""},
    ]);
  };
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const supplierResp = await getVendors(); // Call API to get suppliers
        console.log(supplierResp);
        setSuppliers(supplierResp.data); // Set the fetched suppliers in state
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast.error("Failed to load suppliers");
      }
    };

    fetchSuppliers(); // Execute the function to fetch suppliers
  }, []);
  const handleRemoveQuestionFields = (index) => {
    // const newFields = [...addNewQuestion];
    // newFields.splice(index, 1);
    // setAddNewQuestion(newFields);
    setAddNewQuestion((prevQuest) => {
      const updatedQuest = [...prevQuest];
      if (updatedQuest.id) {
        updatedQuest._destroy = "1";
      } else {
      updatedQuest.splice(index, 1);
      }
      return updatedQuest;
    });
  };
  const handleLockOverdueTaskChange = (e) => {
    setLockOverdueTask(e.target.value);
  };
  // const handleQuestionChange = (index, field, value) => {
  //   const newQuestions = [...addNewQuestion];
  //   if (field === "name" || field === "type") {
  //     newQuestions[index][field] = value;
  //   } else {
  //     newQuestions[index].options[field] = value;
  //   }
  //   setAddNewQuestion(newQuestions);
  // };
  const handleQuestionChange = (index, field, value, optionIndex = null) => {
    const newQuestions = [...addNewQuestion];

    if (field === "name" || field === "type") {
      newQuestions[index][field] = value;
    } else if (field === "option") {
      newQuestions[index].options[optionIndex] = value;
    } else if (field === "value_type") {
      newQuestions[index].value_types[optionIndex] = value;
    }
    else if(field === "group" || field === "groupId"){
      newQuestions[index][field] = value;
    }

    setAddNewQuestion(newQuestions);
  };
  const siteId = getItemInLocalStorage("SITEID");
  const userId = getItemInLocalStorage("UserId");
  const { id } = useParams();
  const handleSupervisorChange = (selected) => {
    setSelectedSupervisors(selected);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResp = await getHostList(siteId);
        const supervisors = usersResp.data.hosts.map((host) => ({
          value: host.id,
          label: host.name,
        }));
        
        setHosts(usersResp.data.hosts);
        setSupervisorOptions(supervisors);
      } catch (error) {
        console.error('Error fetching hosts:', error);
      }
    };

    if (siteId) {
      fetchUsers();
    }
  }, [siteId]);

  useEffect(() => {
    const fetchServicesChecklistDetails = async () => {
      const checklistDetailsResponse = await getChecklistDetails(id);
      const data = checklistDetailsResponse.data;
      console.log(data);
      setName(data.name);
      setFrequency(data.frequency);
      setStartDate(data.start_date);
      setEndDate(data.end_date);
      setsupplierid(data.supplier_id)
      setLockOverdueTask(data.lock_overdue)
      setallowedmin(data.grace_period)
      setextensionmin(data.grace_period_unit)
      // setCronExpression(data.checklist_cron.expression)
      setSelectedSupervisors(
        data.supervisors?.map((sup) => ({
          value: sup,
          label: sup,
        })) || []
      );
      setAddNewQuestion(
        data.groups.map((q) => ({
          id: q.id,
          group:q.group_id,
          name: q.name,
          type: q.qtype,
          options: [q.option1, q.option2, q.option3, q.option4],
          value_types:[q.value_type1,q.value_type2,q.value_type3,q.value_type4],
          question_mandatory:q.question_mandatory,
          reading:q.reading,
          showHelpText:q.help_text_enbled,
          help_text:q.help_text,
          rating:q.rating
        }))
      );
      const totalMinutes = data.grace_period;
      const days = Math.floor(totalMinutes / (24 * 60));
      const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
      const minutes = totalMinutes % 60;
  
      setSubmitDays(days);
      setSubmitHours(hours);
      setSubmitMinutes(minutes);
      const totalExtensionMinutes = data.grace_period_unit;
    const extDays = Math.floor(totalExtensionMinutes / (24 * 60));
    const extHours = Math.floor((totalExtensionMinutes % (24 * 60)) / 60);
    const extMinutes = totalExtensionMinutes % 60;

    setExtensionDays(extDays);
    setExtensionHours(extHours);
    setExtensionMinutes(extMinutes);
    };
    

    fetchServicesChecklistDetails();
  }, [id, update]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const totalAllowedMinutes = submitDays * 24 * 60 + submitHours * 60 + submitMinutes;
    const totalExtensionMinutes = extensionDays * 24 * 60 + extensionHours * 60 + extensionMinutes;
    const formData = new FormData();
    formData.append("checklist[site_id]", siteId);
    formData.append("checklist[occurs]", "");
    formData.append("checklist[name]", name);
    formData.append("checklist[start_date]", startDate);
    formData.append("checklist[end_date]", endDate);
    formData.append("checklist[user_id]", userId);
    formData.append("checklist[grace_period]", totalAllowedMinutes);
    formData.append("checklist[grace_period_unit]", totalExtensionMinutes);

    formData.append("checklist[checklist_cron][expression]", cronExpression);
    formData.append("frequency", frequency);
    formData.append("ctype", "routine");
    formData.append("checklist[lock_overdue]", lockOverdueTask === "true");
    selectedSupervisors.forEach((option) => {
      formData.append(`checklist[supervisiors][]`, option.value);
    });
    addNewQuestion.forEach((quest, index) => {
      if (quest.id) {
        formData.append(`question[][id]`, quest.id);
      }
      formData.append(`question[][group]`, quest.group);
      formData.append(`question[][name]`, quest.name);
      formData.append(`question[][type]`, quest.type);
      // quest.options.forEach((option, optIndex) => {
      //   formData.append(`question[options][${optIndex}]`, option);
      // });
      formData.append(`question[][option1]`, quest.options[0] || "");
      formData.append(`question[][option2]`, quest.options[1] || "");
      formData.append(`question[][option3]`, quest.options[2] || "");
      formData.append(`question[][option4]`, quest.options[3] || "");
      formData.append(`question[][value_type1]`, quest.value_types[0] || "");
      formData.append(`question[][value_type2]`, quest.value_types[1] || "");
      formData.append(`question[][value_type3]`, quest.value_types[2] || "");
      formData.append(`question[][value_type4]`, quest.value_types[3] || "");
      formData.append(`question[][question_mandatory]`, quest.mandatory || "");
      formData.append(`question[][reading]`, quest.reading || "");
      formData.append(`question[][help_text_enbled]`, quest.showHelpText || "");
      formData.append(`question[][help_text]`, quest.help_text || "");
      formData.append(`question[][weightage]`, quest.weightage || "");
      formData.append(`question[][rating]`, quest.rating || "");
      if (quest._destroy) {
        formData.append(
          `question[][_destroy]`,
          quest._destroy
        );
      }
    });

    try {
      toast.loading("Updating Checklist please wait!");
      const response = await editChecklist(formData, id);
      console.log(response);
      setUpdate(true);
      setIsEditing(!isEditing);
      toast.dismiss();
      toast.success("Checklist Updated Successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss();
    }
  };
  const themeColor = useSelector((state) => state.theme.color);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };
  const [createNew, setCreateNew] = useState(false);
  const [createTicket, setCreateTicket] = useState(false);
  const [weightage, setWeightage] = useState(false);

  const handleToggle = (type) => {
    switch (type) {
      case 'createNew':
        setCreateNew(!createNew);
        break;
      case 'createTicket':
        setCreateTicket(!createTicket);
        break;
      case 'weightage':
        setWeightage(!weightage);
        break;
      default:
        break;
    }
  };
  return (
    <section>
      <div className="m-2">
        <h2
          style={{ background: themeColor }}
          className="text-center text-xl font-bold p-2  rounded-full text-white"
        >
          {isEditing ? "Edit Checklist Details" : "PPM Checklist Details"}
        </h2>
        <div className="lg:mx-20 my-5 mb-10 sm:border border-gray-400 md:p-5 md:px-10 rounded-lg sm:shadow-xl">
          <div className="flex justify-end">
            {!isEditing ? (
              <button
                className="flex items-center gap-2 font-medium p-1 px-4 rounded-full border-2 border-black"
                onClick={toggleEdit}
              >
                <BiEdit /> Edit
              </button>
            ) : (
              <button
                className="flex items-center gap-2 font-medium p-1 px-4 rounded-full bg-red-400 text-white"
                onClick={toggleEdit}
              >
                <CloseOutline /> Cancel
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit}>
          <div className="py-4">
      {/* Main Grid for all Toggles */}
      <div className="grid grid-cols-2 gap-4 items-start">
        {/* Create New Toggle */}
        {/* <div className="flex items-center">
          <span className="mr-2">Create New</span>
          <div
            onClick={() => handleToggle('createNew')}
            className={`w-10 h-4 flex items-center bg-gray-300 rounded-full  cursor-pointer ${
              createNew ? 'bg-green-500' : ''
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                createNew ? 'translate-x-6' : ''
              }`}
            />
          </div>
        </div> */}

       

        {/* Create Ticket Toggle */}
        <div className="flex items-center">
          <span className="mr-2">Create Ticket</span>
          <div
            onClick={() => handleToggle('createTicket')}
            className={`w-10 h-4 flex items-center bg-gray-300 rounded-full  cursor-pointer ${
              createTicket ? 'bg-green-500' : ''
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                createTicket ? 'translate-x-6' : ''
              }`}
            />
          </div>
        </div>

        

        {/* Weightage Toggle */}
        <div className="flex items-center">
          <span className="mr-2">Weightage</span>
          <div
            onClick={() => handleToggle('weightage')}
            className={`w-10 h-4 flex items-center bg-gray-300 rounded-full  cursor-pointer ${
              weightage ? 'bg-red-500' : ''
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                weightage ? 'translate-x-6' : ''
              }`}
            />
          </div>
        </div>

        {/* Show Weightage and Rating Fields if Weightage is on */}
         {/* Show Select Template if Create New is on */}
         {createNew && (
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Select Template</label>
            <select 
             value={masterid}
             onChange={(e) => setmasterid(e.target.value)}
            className="border p-1 px-4 border-gray-500 rounded-md">
              <option value="">Select from the existing Template</option>
              {masters.map((m) => (
              <option value={m.value} key={m.value}>
                {m.label}
              </option>
            ))}
            </select>
          </div>
        )}
{/* Show Checklist Level, Question Level, and Select Fields if Create Ticket is on */}
{createTicket && (
          <div className="flex flex-col justify-center gap-1 mb-2">
            {/* Radio Buttons */}
            <div className="flex  gap-4 ">
              
              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  id="checklistLevel"
                  name="ticketType"
                  value="checklistLevel"
                  className="mr-2"
                />
                <label htmlFor="checklistLevel">Checklist Level</label>
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  id="questionLevel"
                  name="ticketType"
                  value="questionLevel"
                  className="mr-2"
                />
                <label htmlFor="questionLevel">Question Level</label>
              </div>
            </div>

            {/* Select Fields */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Select Assigned To</label>
              <select className="border p-1 px-4 border-gray-500 rounded-md">
                <option value="">Select Assigned To</option>
                <option value="user1">User 1</option>
                <option value="user2">User 2</option>
                {/* Add more options as needed */}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold">Select Category</label>
              <select className="border p-1 px-4 border-gray-500 rounded-md">
                <option value="">Select Category</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
                {/* Add more categories as needed */}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
            <div className="flex flex-col justify-around">
              <div className="grid md:grid-cols-3 item-start gap-x-4 gap-y-2 w-full">
                <div className="flex flex-col">
                  <label htmlFor="name" className="font-semibold">
                    Name:
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      placeholder="Enter Checklist Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  ) : (
                    <input
                      readOnly
                      type="text"
                      name="name"
                      id="name"
                      className=" p-1 px-4  rounded-md outline-none bg-gray-100"
                      value={name}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="frequency" className="font-semibold">
                    Frequency:
                  </label>
                  {isEditing ? (
                    <select
                      name="frequency"
                      id="frequency"
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                    >
                      <option value="">Select Frequency</option>
                      <option value="One time">One Time</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="half yearly">Half yearly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  ) : (
                    <input
                      readOnly
                      type="text"
                      name="name"
                      id="name"
                      className=" p-1 px-4  rounded-md outline-none bg-gray-100"
                      value={frequency}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="start_date" className="font-semibold">
                    Start Date:
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="start_date"
                      id="start_date"
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  ) : (
                    <input
                      readOnly
                      type="text"
                      name="start_date"
                      id="start_date"
                      className=" p-1 px-4  rounded-md outline-none bg-gray-100"
                      value={startDate}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="end_date" className="font-semibold">
                    End Date:
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="end_date"
                      id="end_date"
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  ) : (
                    <input
                      readOnly
                      type="text"
                      name="end_date"
                      id="end_date"
                      className=" p-1 px-4  rounded-md outline-none bg-gray-100"
                      value={endDate}
                    />
                  )}
                </div>
              </div>
              <div>
                <div className="grid md:grid-cols-1 gap-4 w-full">
                  {addNewQuestion
                    .filter((que) => que._destroy !== "1")
                    .map((data, i) => (
                      <div key={i}>
                        <div className="my-5 ">
                          <h2 className="border-b-2 border-black text font-medium">
                            {isEditing
                              ? `Edit Question ${i + 1} `
                              : `Question ${i + 1}`}
                          </h2>

                          <div className="my-2 grid gap-4  ">
                          <div className="flex flex-col gap-1 mb-1 w-full">
  <label className="font-semibold">Group</label>
  <select
    value={data.group} // This can store either group name or id based on your requirements.
    className="p-1 px-4 border w-full border-gray-500 rounded-md"
    onChange={(e) => {
      const selectedGroup = site.find(
        (supplier) => supplier.name === e.target.value
      );
      // Updating both group name and group id
      handleQuestionChange(i, 'group', selectedGroup ? selectedGroup.name : '');
      handleQuestionChange(i, 'groupId', selectedGroup ? selectedGroup.id : '');
    }}
  >
    <option value="">Select Group</option>
    {site.map((supplier) => (
      <option value={supplier.name} key={supplier.id}>
        {supplier.name}
      </option>
    ))}
  </select>
</div>


                            {isEditing ? (
                              <input
                                type="text"
                                name={`question_${i}`}
                                id={`question_${i}`}
                                className="border p-1 px-4 border-gray-500 rounded-md"
                                placeholder="Add New Question"
                                value={data.name}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    i,
                                    "name",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              <input
                                readOnly
                                type="text"
                                name={`question_${i}`}
                                id={`question_${i}`}
                                className=" p-1 px-4  rounded-md outline-none bg-gray-100"
                                placeholder="Add New Question"
                                value={data.name}
                                // onChange={(e) =>
                                //   handleQuestionChange(i, "name", e.target.value)
                                // }
                              />
                            )}
                          </div>
                          <div className="my-2">
                            {isEditing ? (
                              <select
                                name={`type_${i}`}
                                id={`type_${i}`}
                                value={data.type}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    i,
                                    "type",
                                    e.target.value
                                  )
                                }
                                className="border p-1 px-4 border-gray-500 rounded-md"
                              >
                                <option value="">Select Answer Type</option>
                                <option value="multiple">
                                  Multiple Choice Question
                                </option>
                                <option value="inbox">Input box</option>
                                <option value="description">
                                  Description box
                                </option>
                              </select>
                            ) : (
                              <input
                                readOnly
                                type="text"
                                name="start_date"
                                id="start_date"
                                className=" p-1 px-4  rounded-md outline-none bg-gray-100"
                                value={data.type}
                              />
                            )}
                            {data.type === "multiple" && (
                              <>
                                {isEditing ? (
                                  <div className="flex flex-col  gap-4 my-2">
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                      type="text"
                                      name={`option1_${i}`}
                                      id={`option1_${i}`}
                                      className="border p-1 px-4 border-gray-500 rounded-md"
                                      placeholder="option 1"
                                      value={data.options[0]}
                                      onChange={(e) => handleQuestionChange(i, "option", e.target.value, 0)}
                                    />
                                    <select
                                      name={`value_type1_${i}`}
                                      id={`value_type1_${i}`}
                                      className={`border p-1 border-gray-500 rounded-md ${data.value_types[0] === 'P' ? 'bg-green-400' : data.value_types[0] === 'N' ? 'bg-red-400' : ''}`}
                                      value={data.value_types[0]}
                                      onChange={(e) => handleQuestionChange(i, "value_type", e.target.value, 0)}
                                    >
                                      <option value="">Select</option>
                                      <option value="P">P</option>
                                      <option value="N">N</option>
                                    </select>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                      type="text"
                                      name={`option2_${i}`}
                                      id={`option2_${i}`}
                                      className="border p-1 px-4 border-gray-500 rounded-md"
                                      placeholder="option 2"
                                      value={data.options[1]}
                                      onChange={(e) => handleQuestionChange(i, "option", e.target.value, 1)}
                                    />
                                    <select
                                      name={`value_type2_${i}`}
                                      id={`value_type2_${i}`}
                                      className={`border p-1 border-gray-500 rounded-md ${data.value_types[1] === 'P' ? 'bg-green-400' : data.value_types[1] === 'N' ? 'bg-red-400' : ''}`}
                                      value={data.value_types[1]}
                                      onChange={(e) => handleQuestionChange(i, "value_type", e.target.value, 1)}
                                    >
                                      <option value="">Select</option>
                                      <option value="P" >P</option>
                                      <option value="N" >N</option>
                                    </select>
                                  </div>
        
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                      type="text"
                                      name={`option3_${i}`}
                                      id={`option3_${i}`}
                                      className="border p-1 px-4 border-gray-500 rounded-md"
                                      placeholder="option 3"
                                      value={data.options[2]}
                                      onChange={(e) => handleQuestionChange(i, "option", e.target.value, 2)}
                                    />
                                    <select
                                      name={`value_type3_${i}`}
                                      id={`value_type3_${i}`}
                                      className={`border p-1 border-gray-500 rounded-md ${data.value_types[2] === 'P' ? 'bg-green-400' : data.value_types[2] === 'N' ? 'bg-red-400' : ''}`}
                                      value={data.value_types[2]}
                                      onChange={(e) => handleQuestionChange(i, "value_type", e.target.value, 2)}
                                    >
                                      <option value="">Select</option>
                                      <option value="P">P</option>
                                      <option value="N">N</option>
                                    </select>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                      type="text"
                                      name={`option4_${i}`}
                                      id={`option4_${i}`}
                                      className="border p-1 px-4 border-gray-500 rounded-md"
                                      placeholder="option 4"
                                      value={data.options[3]}
                                      onChange={(e) => handleQuestionChange(i, "option", e.target.value, 3)}
                                    />
                                    <select
                                      name={`value_type4_${i}`}
                                      id={`value_type4_${i}`}
                                      className={`border p-1 border-gray-500 rounded-md ${data.value_types[3] === 'P' ? 'bg-green-400' : data.value_types[3] === 'N' ? 'bg-red-400' : ''}`}
                                      value={data.value_types[3]}
                                      onChange={(e) => handleQuestionChange(i, "value_type", e.target.value, 3)}
                                    >
                                      <option value="">Select</option>
                                      <option value="P">P</option>
                                      <option value="N">N</option>
                                    </select>
                                  </div>
                                  <div className="grid grid-cols-3 my-2">
                      <div className="flex items-center gap-2">
                      <input
              type="checkbox"
              checked={data.question_mandatory}
              onChange={(e) => handleQuestionChange(i, "question_mandatory", e.target.checked)}
            />
                        <label htmlFor="" className="font-semibold">Mandatory</label>
                      </div>
                      <div className="flex items-center gap-2">
                      <input
              type="checkbox"
              checked={data.reading}
              onChange={(e) => handleQuestionChange(i, "reading", e.target.checked)}
            />
                        <label htmlFor="" className="font-semibold">Reading</label>
                      </div>
                      <div className="flex items-center gap-2">
                      <input
              type="checkbox"
              checked={data.showHelpText}
              onChange={(e) => handleQuestionChange(i, "showHelpText", e.target.checked)}
            />
                        <label htmlFor="" className="font-semibold">Help text</label>
                      </div>
                      
                      
                      </div> 
                       {data.showHelpText && (
              <div className="flex flex-col gap-2 my-2">
                <input
                  type="text"
                  placeholder="Enter Help text"
                  value={data.help_text}
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  onChange={(e) => handleQuestionChange(i, "help_text", e.target.value)}
                /> </div>
                )}
    {weightage && (
          <div className=" grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Weightage</label>
              <input
                type="number"
                className="border p-1 px-4 border-gray-500 rounded-md"
                value={data.weightage}
                onChange={(e) => handleQuestionChange(i, "weightage", e.target.value)}
                placeholder="Enter weightage value"
              />
            </div>

           
              {/* <label className="block text-gray-700">Rating</label> */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rating"
                  checked={data.rating}
                  onChange={(e) => handleQuestionChange(i, "rating", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="rating"> Rating</label>
              </div>
           
          </div>
        )}

               
                                </div>
                                ) : (
                                  
                                  <div className="grid  gap-4 my-2 w-full">
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                      type="text"
                                      name={`option1_${i}`}
                                      id={`option1_${i}`}
                                      className=" p-1 px-4  rounded-md outline-none bg-gray-100"
                                      placeholder="option 1"
                                      value={data.options[0]}
                                      onChange={(e) => handleQuestionChange(i, "option", e.target.value, 0)}
                                    />
                                    <select
                                      name={`value_type1_${i}`}
                                      id={`value_type1_${i}`}
                                      className={` p-1 px-4 outline-none bg-gray-100 rounded-md ${data.value_types[0] === 'P' ? 'bg-green-400' : data.value_types[0] === 'N' ? 'bg-red-400' : ''}`}
                                      value={data.value_types[0]}
                                      onChange={(e) => handleQuestionChange(i, "value_type", e.target.value, 0)}
                                    >
                                      <option value="">Select</option>
                                      <option value="P">P</option>
                                      <option value="N">N</option>
                                    </select>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                      type="text"
                                      name={`option2_${i}`}
                                      id={`option2_${i}`}
                                      className=" p-1 px-4  rounded-md outline-none bg-gray-100"
                                      placeholder="option 2"
                                      value={data.options[1]}
                                      onChange={(e) => handleQuestionChange(i, "option", e.target.value, 1)}
                                    />
                                    <select
                                      name={`value_type2_${i}`}
                                      id={`value_type2_${i}`}
                                      className={`p-1 px-4 outline-none bg-gray-100 rounded-md ${data.value_types[1] === 'P' ? 'bg-green-400' : data.value_types[1] === 'N' ? 'bg-red-400' : ''}`}
                                      value={data.value_types[1]}
                                      onChange={(e) => handleQuestionChange(i, "value_type", e.target.value, 1)}
                                    >
                                      <option value="">Select</option>
                                      <option value="P" >P</option>
                                      <option value="N" >N</option>
                                    </select>
                                  </div>
        
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                      type="text"
                                      name={`option3_${i}`}
                                      id={`option3_${i}`}
                                     className=" p-1 px-4  rounded-md outline-none bg-gray-100"
                                      placeholder="option 3"
                                      value={data.options[2]}
                                      onChange={(e) => handleQuestionChange(i, "option", e.target.value, 2)}
                                    />
                                    <select
                                      name={`value_type3_${i}`}
                                      id={`value_type3_${i}`}
                                      className={`p-1 px-4 outline-none bg-gray-100 rounded-md ${data.value_types[2] === 'P' ? 'bg-green-400' : data.value_types[2] === 'N' ? 'bg-red-400' : ''}`}
                                      value={data.value_types[2]}
                                      onChange={(e) => handleQuestionChange(i, "value_type", e.target.value, 2)}
                                    >
                                      <option value="">Select</option>
                                      <option value="P">P</option>
                                      <option value="N">N</option>
                                    </select>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                      type="text"
                                      name={`option4_${i}`}
                                      id={`option4_${i}`}
                                      className=" p-1 px-4  rounded-md outline-none bg-gray-100"
                                      placeholder="option 4"
                                      value={data.options[3]}
                                      onChange={(e) => handleQuestionChange(i, "option", e.target.value, 3)}
                                    />
                                    <select
                                      name={`value_type4_${i}`}
                                      id={`value_type4_${i}`}
                                      className={` p-1 px-4 outline-none bg-gray-100 rounded-md ${data.value_types[3] === 'P' ? 'bg-green-400' : data.value_types[3] === 'N' ? 'bg-red-400' : ''}`}
                                      value={data.value_types[3]}
                                      onChange={(e) => handleQuestionChange(i, "value_type", e.target.value, 3)}
                                    >
                                      <option value="">Select</option>
                                      <option value="P">P</option>
                                      <option value="N">N</option>
                                    </select>
                                  </div>
                                  <div className="grid grid-cols-3 my-2">
                      <div className="flex items-center gap-2">
                      <input
              type="checkbox"
              checked={data.question_mandatory}
              onChange={(e) => handleQuestionChange(i, "question_mandatory", e.target.checked)}
              disabled
            />
                        <label htmlFor="" className="font-semibold">Mandatory</label>
                      </div>
                      <div className="flex items-center gap-2">
                      <input
              type="checkbox"
              checked={data.reading}
              onChange={(e) => handleQuestionChange(i, "reading", e.target.checked)}
              disabled
            />
                        <label htmlFor="" className="font-semibold">Reading</label>
                      </div>
                      <div className="flex items-center gap-2">
                      <input
              type="checkbox"
              checked={data.showHelpText}
              onChange={(e) => handleQuestionChange(i, "showHelpText", e.target.checked)}
              disabled
            />
                        <label htmlFor="" className="font-semibold">Help text</label>
                      </div>
                      
                      
                      </div>
                      {data.showHelpText && (
              <div className="flex flex-col gap-2 ">
                <input
                  type="text"
                  placeholder="Enter Help text"
                  value={data.help_text}
                  className="p-1 px-4 bg-gray-100 outline-none rounded-md"
                  onChange={(e) => handleQuestionChange(i, "help_text", e.target.value)}
                  disabled
                /> </div>)}
                {weightage && (
          <div className=" grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Weightage</label>
              <input
                type="number"
                className="border p-1 px-4 border-gray-500 rounded-md"
                value={data.weightage}
                onChange={(e) => handleQuestionChange(i, "weightage", e.target.value)}
                placeholder="Enter weightage value"
              />
            </div>

           
              {/* <label className="block text-gray-700">Rating</label> */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rating"
                  checked={data.rating}
                  onChange={(e) => handleQuestionChange(i, "rating", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="rating"> Rating</label>
              </div>
           
          </div>
        )}
              
                                </div>
                                
                                )}
                                
                              </>
                            )}
                          </div>
                          
                          {isEditing && (
                            <div className="flex justify-end gap-2">
                              <button
                                className="p-1 border-2 border-red-500 text-white hover:bg-white hover:text-red-500 bg-red-500 px-4 transition-all duration-300 rounded-md "
                                onClick={() => handleRemoveQuestionFields(i)}
                              >
                                <IoClose />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    className="p-1 border-2 border-black px-4 rounded-md my-2 flex gap-2 items-center"
                    onClick={() => handleAddQuestionFields()}
                  >
                    <BiPlus />
                    Add Question
                  </button>
                )}
                   <h2 className="border-b-2 border-black text font-medium">
                      Schedules
                    </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
       
        
       

        
        
       
       
            <div className="flex flex-col gap-4">
      {/* Allowed Time to Submit */}
      <div>
  <label className="font-semibold">Allowed time to submit</label>
  <div className="flex gap-2">
    <input
      type="number"
      className="border p-1 px-2 border-gray-500 w-32 rounded-md"
      placeholder="Days"
      value={submitDays}
      onChange={(e) => setSubmitDays(Number(e.target.value))}
    />
    <input
      type="number"
      className="border p-1 px-2 border-gray-500 w-32 rounded-md"
      placeholder="Hours"
      value={submitHours}
      onChange={(e) => setSubmitHours(Number(e.target.value))}
    />
    <input
      type="number"
      className="border p-1 px-2 border-gray-500 w-32 rounded-md"
      placeholder="Minutes"
      value={submitMinutes}
      onChange={(e) => setSubmitMinutes(Number(e.target.value))}
    />
  </div>
</div>


      {/* Extension Time */}
      <div className="flex flex-col mr-2">
  <label className="font-semibold">Extension Time</label>
  <div className="flex gap-2">
    <input
      type="number"
      className="border p-1 px-2 border-gray-500 w-32 rounded-md"
      placeholder="Days"
      value={extensionDays}
      onChange={(e) => setExtensionDays(Number(e.target.value))}
    />
    <input
      type="number"
      className="border p-1 px-2 border-gray-500 w-32 rounded-md"
      placeholder="Hours"
      value={extensionHours}
      onChange={(e) => setExtensionHours(Number(e.target.value))}
    />
    <input
      type="number"
      className="border p-1 px-2 border-gray-500 w-32 rounded-md"
      placeholder="Minutes"
      value={extensionMinutes}
      onChange={(e) => setExtensionMinutes(Number(e.target.value))}
    />
  </div>
</div>

      
      <div className="flex flex-col">
        <label htmlFor="">Lock Overdue Task</label>
        <select 
        name="lockOverdueTask"
        id="lockOverdueTask"
        className="border p-1 px-2 border-gray-500 rounded-md"
        value={lockOverdueTask}
        onChange={handleLockOverdueTaskChange}
        >
          <option value="">Select Lock Status</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
    </div>
            

             
    <div className="flex flex-col gap-4 ">
    <div>
        <label className="font-semibold">Supervisors</label>
        <Select
        value={selectedSupervisors}
        onChange={handleSupervisorChange}
        options={supervisorOptions}
        isMulti
        isSearchable
        placeholder="Select Supervisors"
      />
      </div>
    
        

        
         <div  className="flex flex-col ">
               <label className="font-semibold">Supplier</label>
               <select className="border p-1 px-4 border-gray-500 rounded-md"
               value={supplierid}
               onChange={(e) => setsupplierid(e.target.value)}
               >
                 <option value="">Select Supplier</option>
                 {suppliers.map((supplier) => (
              <option value={supplier.id} key={supplier.id}>
                {supplier.company_name}
              </option>
            ))}
                 
               </select>
             </div>
             </div>
         
       </div>
       <h2 className="border-b-2 border-black text font-medium">
                      Cron Setting
                    </h2>
                    <div className="my-2 border-2 border-dashed flex items-center p-2 rounded-md border-gray-300">
      
      <Cron value={cronExpression} setValue={handleCronChange} />
      
    </div>
              </div>
              <div className="flex justify-center">
                {isEditing && (
                  <button
                    type="submit"
                    className="bg-black text-white p-2 px-4 rounded-md font-medium"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PPMChecklistDetails;
