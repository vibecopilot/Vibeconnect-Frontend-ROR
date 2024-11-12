import React, { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { getChecklistDetails, getGenericGroupAssetChecklist, getGenericSubGroupAssetChecklist, getHostList, getMasterChecklist, getSiteAsset, getVendors, postChecklist } from "../../api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import Select from 'react-select';
import Cron from "react-js-cron";
import "react-js-cron/dist/styles.css";

const AddChecklist = () => {
  const today = new Date().toISOString().split("T")[0];
  const toDay = new Date();
  const year = toDay.getFullYear();
  const [hosts, setHosts] = useState([]);
  const [masters, setMasters] =useState([]);
  const [selectedOptionssupervisior, setSelectedOptionssupervisior] = useState([]);
  const [optionssupervisior, setOptionssupervisior] = useState([]);
  const month = String(toDay.getMonth() + 1).padStart(2, "0");
  const day = String(toDay.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const [supplierid, setsupplierid] = useState("");
  const [masterid, setmasterid] = useState("");

  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(formattedDate);
  const [lockOverdueTask, setLockOverdueTask] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  const handleLockOverdueTaskChange = (e) => {
    setLockOverdueTask(e.target.value);
  };

  const [addNewQuestion, setAddNewQuestion] = useState([
    {
      name: "", type: "", options: ["", "", "", ""], value_types: ["", "", "", ""],
      question_mandatory: false, reading: false, help_text: "", showHelpText: false,image_for_question:[],weightage:"",rating:false
    },
  ]);
  
  const handleAddQuestionFields = () => {
    setAddNewQuestion([
      ...addNewQuestion,
      {
        name: "", type: "", options: ["", "", "", ""], value_types: ["", "", "", ""],
        question_mandatory: false, reading: false, help_text: "", showHelpText: false,image_for_question:[],weightage:"",rating:false
      },
    ]);
  };
  useEffect(() => {
    const fetchServicesChecklistDetails = async () => {
      const checklistDetailsResponse = await getChecklistDetails(masterid);
      const data = checklistDetailsResponse.data;
      console.log(data);
      setName(data.name);
      setFrequency(data.frequency);
      setStartDate(data.start_date);
      setEndDate(data.end_date);
      setAddNewQuestion(
        data.questions.map((q) => ({
          id: q.id,
          name: q.name,
          type: q.qtype,
          options: [q.option1, q.option2, q.option3, q.option4],
          value_types:[q.value_type1,q.value_type2,q.value_type3,q.value_type4],
          question_mandatory:q.question_mandatory,
          reading:q.reading,
          showHelpText:q.help_text_enbled,
          help_text:q.help_text
        }))
      );
    };
    fetchServicesChecklistDetails();
  }, [masterid]);
  const handleQuestionChange = (index, field, value, optionIndex = null) => {
    const newQuestions = [...addNewQuestion];
  
    if (field === "name" || field === "type") {
      newQuestions[index][field] = value;
    } else if (field === "option") {
      newQuestions[index].options[optionIndex] = value;
    } else if (field === "value_type") {
      newQuestions[index].value_types[optionIndex] = value;
    } else if (field === "question_mandatory" || field === "reading" || field === "showHelpText"|| field === "rating") {
      newQuestions[index][field] = value;
    } else if (field === "help_text") {
      newQuestions[index].help_text = value;
    }else if (field === "image_for_question") {
      newQuestions[index].image_for_question = value;
    }
    else if (field === "weightage") {
      newQuestions[index].weightage = value;
    }
  
    setAddNewQuestion(newQuestions);
  };
  const [cronExpression, setCronExpression] = useState("0 0 * * *");

  const handleCronChange = (newCron) => {
    setCronExpression(newCron);
  };
  const handleRemoveQuestionFields = (index) => {
    const newFields = [...addNewQuestion];
    newFields.splice(index, 1);
    setAddNewQuestion(newFields);
  };
  // const handleQuestionChange = (index, field, value, optionIndex = null) => {
  //   const newQuestions = [...addNewQuestion];

  //   if (field === "name" || field === "type") {
  //     newQuestions[index][field] = value;
  //   } else if (field === "option") {
  //     newQuestions[index].options[optionIndex] = value;
  //   } else if (field === "value_type") {
  //     newQuestions[index].value_types[optionIndex] = value;
  //   }

  //   setAddNewQuestion(newQuestions);
  // };

  const siteId = getItemInLocalStorage("SITEID");
  const userId = getItemInLocalStorage("UserId");
  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate required fields
    if (!name || !frequency) {
      return toast.error("Name and Frequency are required");
    }
  
    if (startDate >= endDate) {
      return toast.error("Start date must be before End date");
    }
  
    // Prepare FormData for file uploads
    const formData = new FormData();
  
    // Add checklist data
    formData.append("checklist[site_id]", siteId);
    formData.append("checklist[weightage_enabled]", weightage);
    formData.append("checklist[occurs]", "");
    formData.append("checklist[name]", name);
    formData.append("checklist[start_date]", startDate);
    formData.append("checklist[end_date]", endDate);
    formData.append("checklist[user_id]", userId);
    formData.append("checklist[cron_expression]", cronExpression);
    formData.append("checklist[grace_period]", convertedSubmitMinutes);
    formData.append("checklist[grace_period_unit]", convertedExtensionMinutes);
    formData.append("checklist[supplier_id]", supplierid);
    formData.append("checklist[lock_overdue]", lockOverdueTask === "true");
    formData.append("checklist[ctype]", "routine");
  
    // Add supervisor IDs
    selectedOptionssupervisior.forEach((option, index) => {
      formData.append(`checklist[supervisior_id][]`, option.value);
    });
  
    // Add frequency
    formData.append("frequency", frequency);
  
    // Add questions with files
    addNewQuestion.forEach((q, index) => {
      formData.append(`question[][name]`, q.name);
      formData.append(`question[][type]`, q.type);
      formData.append(`question[][option1]`, q.options[0] || "");
      formData.append(`question[][value_type1]`, q.value_types[0] || "");
      formData.append(`question[][option2]`, q.options[1] || "");
      formData.append(`question[][value_type2]`, q.value_types[1] || "");
      formData.append(`question[][option3]`, q.options[2] || "");
      formData.append(`question[][value_type3]`, q.value_types[2] || "");
      formData.append(`question[][option4]`, q.options[3] || "");
      formData.append(`question[][value_type4]`, q.value_types[3] || "");
      formData.append(`question[][question_mandatory]`, q.question_mandatory);
      formData.append(`question[][reading]`, q.reading);
      formData.append(`question[][help_text_enbled]`, q.showHelpText);
      formData.append(`question[][help_text]`, q.showHelpText ? q.help_text : "");
      formData.append(`question[][weightage]`, q.weightage);
      formData.append(`question[][rating]`, q.rating);
  
      // Handle file uploads for each question
      if (q.image_for_question && q.image_for_question.length > 0) {
        q.image_for_question.forEach((file, fileIndex) => {
          formData.append(`question[][image_for_question_${index+1}]`, file);
        });
      }
    });
  
    try {
      const response = await postChecklist(formData);
      console.log(response);
      toast.success("New Checklist Created");
      navigate("/assets/checklist");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create checklist");
    }
  };
  
  const handleChangesupervisior = (selected) => {
    setSelectedOptionssupervisior(selected);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResp = await getHostList(siteId); 
        const supervisors = usersResp.data.hosts.map((host) => ({
          value: host.id, 
          label: host.name, 
        }));
        console.log(usersResp)
        setHosts(usersResp.data.hosts); 
        setOptionssupervisior(supervisors); 
        console.log(usersResp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [siteId]);
  const themeColor = useSelector((state) => state.theme.color)
  
  
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
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const masterResp = await getMasterChecklist(); // Call API to get suppliers
        const mastershow = masterResp.data.checklists.map((check) => ({
          value: check.id, 
          label: check.name, 
        }));
        console.log("Masters checklist",masterResp);
       console.log("mastershow",mastershow)
       setMasters(mastershow);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast.error("Failed to load suppliers");
      }
    };

    fetchMasters(); // Execute the function to fetch suppliers
  }, []);
 
  
 
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
 
  
 
  
  const [submitDays, setSubmitDays] = useState();
  const [submitHours, setSubmitHours] = useState();
  const [submitMinutes, setSubmitMinutes] = useState();
  const [extensionDays, setExtensionDays] = useState();
  const [extensionHours, setExtensionHours] = useState();
  const [extensionMinutes, setExtensionMinutes] = useState();
  
 
    const convertedSubmitMinutes =
      parseInt(submitDays) * 1440 + parseInt(submitHours) * 60 + parseInt(submitMinutes);
    // setTotalSubmitMinutes(convertedSubmitMinutes);
 

 
    const convertedExtensionMinutes =
      parseInt(extensionDays) * 1440 + parseInt(extensionHours) * 60 + parseInt(extensionMinutes);
    // setTotalExtensionMinutes(convertedExtensionMinutes);
    
    
  return (
    <section>
      <div className="m-2">
        <h2 style={{ background: themeColor }} className="text-center text-xl font-bold p-2  rounded-full text-white">
          Add Checklist
        </h2>
        <div className="md:mx-20 my-5 mb-10 sm:border border-gray-400 p-5 px-10 rounded-lg sm:shadow-xl">
        <div className="py-4">
      {/* Main Grid for all Toggles */}
      <div className="grid grid-cols-3 gap-4 items-start">
        {/* Create New Toggle */}
        <div className="flex items-center">
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
        </div>

       

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
          <div className="flex  flex-col justify-around">
            <div className="grid md:grid-cols-3 item-start gap-x-4 gap-y-2 w-full">
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Name :
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  placeholder="Enter Checklist Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Frequency :
                </label>
                <select
                  name="frequency"
                  id="frequency"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="">Select Frequency</option>

                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half yearly">Half yearly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Start Date :
                </label>
                <input
                  type="date"
                  name="start_date"
                  id="start_date"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={today}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  End Date :
                </label>
                <input
                  type="date"
                  name="end_date"
                  id="end_date"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={today}
                />
              </div>
            </div>
            <div>
              {addNewQuestion.map((data, i) => (
                <div key={i}>
                  <div className="my-5">
                    <h2 className="border-b-2 border-black text font-medium">
                      Add New Question
                    </h2>
                    <div className="my-2 grid gap-4">
                      {/* <select name="" id="" className="border p-1 px-4 border-gray-500 rounded-md"
                      >
                        <option value="">Select Group</option>
                      </select> */}
                      <input
                        type="text"
                        name={`question_${i}`}
                        id={`question_${i}`}
                        className="border p-1 px-4 border-gray-500 rounded-md"
                        placeholder="Add New Question"
                        value={data.name}
                        onChange={(e) =>
                          handleQuestionChange(i, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="my-2">
                      <select
                        name={`type_${i}`}
                        id={`type_${i}`}
                        value={data.reading ? "Numeric" : data.type}
                        onChange={(e) =>
                          handleQuestionChange(i, "type", e.target.value)
                        }
                        className="border p-1 px-4 border-gray-500 rounded-md"
                        disabled={data.reading}
                      >
                        <option value="">Select Answer Type</option>
                        <option value="multiple">
                          Multiple Choice Question
                        </option>
                        <option value="inbox">Input box</option>
                        <option value="description">Description box</option>
                        <option value="Numeric">Numeric</option>
                      </select>
                      {data.type === "multiple" && !data.reading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-2">
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
                        </div>
                      )}
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
                    </div>
                    {data.showHelpText && (
              <div className="flex flex-col gap-2 my-2">
                <input
                  type="text"
                  placeholder="Enter Help text"
                  value={data.help_text}
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  onChange={(e) => handleQuestionChange(i, "help_text", e.target.value)}
                />
                
                <FileInputBox
      handleChange={(files) => handleQuestionChange(i, "image_for_question", files)}
      fieldName={`image_for_question_${i + 1}`}
      isMulti={true}
    />
              </div>
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

       
      
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-1 border-2 border-red-500 text-white hover:bg-white hover:text-red-500 bg-red-500 px-4 transition-all duration-300 rounded-md "
                        onClick={() => handleRemoveQuestionFields(i)}
                      >
                        <IoClose />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="p-1 border-2 border-black px-4 rounded-md my-2 flex gap-2 items-center"
                onClick={() => handleAddQuestionFields()}
              >
                <BiPlus />
                Add Question
              </button>
              {/* <button
                type="button"
                className="p-1 border-2 border-black px-4 rounded-md my-2 flex gap-2 items-center"
                
              >
                <BiPlus />
                Add Group
              </button> */}
            </div>
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
            className="border p-1 px-2 border-gray-500 w-44 rounded-md"
            placeholder="Enter Days"
            value={submitDays}
            onChange={(e) => setSubmitDays(e.target.value)}
          />
          <input
            type="number"
            className="border p-1 px-2 border-gray-500 w-44 rounded-md"
            placeholder="Enter Hours"
            value={submitHours}
            onChange={(e) => setSubmitHours(e.target.value)}
          />
          <input
            type="number"
            className="border p-1 px-2 border-gray-500 w-44 rounded-md"
            placeholder="Enter Minutes"
            value={submitMinutes}
            onChange={(e) => setSubmitMinutes(e.target.value)}
          />
        </div>
        
      </div>

      {/* Extension Time */}
      <div className="flex flex-col mr-2">
        <label className="font-semibold">Extension Time</label>
        <div className="flex gap-2">
          <input
            type="number"
            className="border p-1 px-2 border-gray-500 w-44 rounded-md"
            placeholder="Enter Days"
            value={extensionDays}
            onChange={(e) => setExtensionDays(e.target.value)}
          />
          <input
            type="number"
            className="border p-1 px-2 border-gray-500 w-44 rounded-md"
            placeholder="Enter Hours"
            value={extensionHours}
            onChange={(e) => setExtensionHours(e.target.value)}
          />
          <input
            type="number"
            className="border p-1 px-2 border-gray-500 w-44 rounded-md"
            placeholder="Enter Minutes"
            value={extensionMinutes}
            onChange={(e) => setExtensionMinutes(e.target.value)}
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
          value={selectedOptionssupervisior}
          onChange={handleChangesupervisior}
          options={optionssupervisior}
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
             </div></div>
         
       </div>
       <h2 className="border-b-2 border-black text font-medium">
                      Cron Setting
                    </h2>
                    <div className="my-2 border-2 border-dashed flex items-center p-2 rounded-md border-gray-300">
      
      <Cron value={cronExpression} setValue={handleCronChange} />
      
    </div>
            <div className="flex justify-center">
              <button onClick={handleSubmit} className="bg-black text-white p-2 px-4 rounded-md font-medium">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddChecklist;
