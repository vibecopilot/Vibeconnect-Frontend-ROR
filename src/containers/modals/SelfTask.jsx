import {
  postTodoList,
  getTodoLists,
  getSetupUsers,
} from "../../api";
import { useState, useRef, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactSwitch from "react-switch";
import { SendDueDateFormat } from "../../utils/dateUtils";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";

function TaskSelf({ onClose }) {
  const themeColor = useSelector((state) => state.theme.color);

  // State Variables
  const [isSelfTaskActive, setSelfTaskActive] = useState(true);
  const [isAssignToOthersActive, setAssignToOthersActive] = useState(false);
  const [assignToOthers, setAssignToOthers] = useState(false);
  
  const [checked, setChecked] = useState(0); // Urgent
  const [checkedRepeat, setCheckedRepeat] = useState(0); // Repeat
  const [repeatMeet, setRepeatMeet] = useState(false);

  // Task Fields
  const [task_topic, setTaskTopic] = useState("");
  const [due_date, setDueDate] = useState(null);
  const [from_due_date, setFromDueDate] = useState(new Date());
  const [to_due_date, setToDueDate] = useState(new Date());
  const [taskTime, setTaskTime] = useState("");
  const [task_description, setTaskDescription] = useState("");
  const [attachments, setAttachment] = useState([]);
  const [selectedOption, setSelectedOption] = useState(""); // For Assign To (Users)
  const [selectedTasks, setSelectedTasks] = useState([]); // For Dependencies

  const [loading, setLoading] = useState(false);
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);

  // Weekdays Map for API ["mon", "tue"...]
  const [weekdaysMap, setWeekdaysMap] = useState([
    { day: "Mon", index: 0, isActive: false },
    { day: "Tue", index: 1, isActive: false },
    { day: "Wed", index: 2, isActive: false },
    { day: "Thu", index: 3, isActive: false },
    { day: "Fri", index: 4, isActive: false },
    { day: "Sat", index: 5, isActive: false },
    { day: "Sun", index: 6, isActive: false },
  ]);

  // Dropdown Options
  const [dependencyTaskTitle, setDependencyTaskTitle] = useState([]); 
  const [emails, setEmails] = useState([]);

  const fileInputRef = useRef(null);

  // --- Handlers ---
  const handleSelfTask = () => {
    setAssignToOthers(false);
    setAssignToOthersActive(false);
    setSelfTaskActive(true);
  };

  const handleAssignToOthers = () => {
    setAssignToOthers(true);
    setAssignToOthersActive(true);
    setSelfTaskActive(false);
  };

  const handleWeekdaySelection = (weekday) => {
    const index = weekdaysMap.find((dayObj) => dayObj.day === weekday)?.index;
    if (index !== undefined) {
      const updatedWeekdaysMap = weekdaysMap.map((dayObj) =>
        dayObj.index === index
          ? { ...dayObj, isActive: !dayObj.isActive }
          : dayObj
      );
      setWeekdaysMap(updatedWeekdaysMap);
      setSelectedWeekdays((prev) =>
        prev.includes(index) ? prev.filter((day) => day !== index) : [...prev, index]
      );
    }
  };

  const handleFileAttachment = (event) => {
    const selectedFile = event.target.files;
    const newAttachments = Array.from(selectedFile);
    setAttachment(newAttachments);
  };

  const handleChangeSelect = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const handleChangeSelectTitle = (selectedOptions) => {
    setSelectedTasks(selectedOptions);
  };

  // --- API Calls ---

  const get_dependencies = async () => {
    try {
      const response = await getTodoLists();

      if (response.data) {
        const dependencyData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        setDependencyTaskTitle(dependencyData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getTaskAssign = async () => {
    try {
      const response = await getSetupUsers();

      if (response.data) {
        const users = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        const assignEmails = users.map((user) => ({
          value: user.id,
          label: `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim() || user.email,
        }));
        setEmails(assignEmails);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    get_dependencies();
    getTaskAssign();
  }, []);

  // --- Create Task Logic ---
  const createTask = async () => {
    const user_id = localStorage.getItem("UserId");
    const siteId = localStorage.getItem("SITEID");
    // const userid=localStorage.getItem("USERID");
    
    // Dependencies
    const valuesString = selectedTasks.map(task => task.value).join(',');

    // Validation
    if (!task_topic) {
      toast.error("Please fill Task Topic.");
      return;
    }
    
    // Assign to others validation
    if (assignToOthers && (!selectedOption || selectedOption.length === 0)) {
      toast.error("Please select someone to assign the task to.");
      return;
    }

    // Date validation
    if (!repeatMeet && !due_date) {
      toast.error("Please select Due Date.");
      return;
    }
    
    if (repeatMeet && (!from_due_date || !to_due_date || !taskTime)) {
       toast.error("Please complete Repeat details (From, To, Time).");
       return;
    }

    setLoading(true);
    toast.loading("Creating Task...");
    
    try {
      let payload;
      
      if (!assignToOthers) {
        // Self Task: Match the first curl structure
        payload = {
          todo_list: {
            title: task_topic,
            status: "Pending",
            relation_id: parseInt(user_id, 10),
            relation: "User",
          }
        };
        
        if (siteId) {
          payload.todo_list.site_id = parseInt(siteId, 10);
        }
        
        if (valuesString) {
          payload.todo_list.depend_on = valuesString;
        }
        
        if (task_description) {
          payload.todo_list.task_description = task_description;
        }
        
        if (due_date) {
          payload.todo_list.due_date = SendDueDateFormat(due_date);
        }
        
      } else {
        // Assign to Others: Match the second curl structure
        const idList = selectedOption.map((email) => parseInt(email.value, 10));
        
        payload = {
          todo_list: {
            title: task_topic,
            status: "pending",
            assigned_to: idList[0], // First user in the list
            urgent: checked === 1,
          }
        };
        
        if (siteId) {
          payload.todo_list.site_id = parseInt(siteId, 10);
        }
        
        if (valuesString) {
          payload.todo_list.depend_on = valuesString;
        }
        
        if (task_description) {
          payload.todo_list.task_description = task_description;
        }
        
        if (repeatMeet) {
          // Repeat task
          payload.todo_list.repeat = true;
          payload.todo_list.to_from = from_due_date;
          payload.todo_list.to_date = to_due_date;
          payload.todo_list.time = taskTime;
          
          // Map weekdays from indices to day names
          const dayNames = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
          const working_days = selectedWeekdays.map(index => dayNames[index]);
          payload.todo_list.working_days = working_days;
          
        } else if (due_date) {
          // Single task with due date
          payload.todo_list.due_date = SendDueDateFormat(due_date);
        }
        
        // Multiple assignees
        if (idList.length > 1) {
          payload.todo_list.assigned_to = idList.slice(1);
        }
      }
      
      // Always use FormData format as backend expects form-data
      const formData = new FormData();
      
      // Append each field individually (not as JSON string)
      formData.append("todo_list[title]", payload.todo_list.title);
      formData.append("todo_list[status]", payload.todo_list.status);
      
      if (!assignToOthers) {
        // Self Task fields
        formData.append("todo_list[relation_id]", payload.todo_list.relation_id);
        formData.append("todo_list[relation]", payload.todo_list.relation);
      } else {
        // Assign to Others fields
        formData.append("todo_list[assigned_to]", payload.todo_list.assigned_to);
        formData.append("todo_list[urgent]", payload.todo_list.urgent);
        
        if (repeatMeet) {
          formData.append("todo_list[repeat]", true);
          formData.append("todo_list[to_from]", payload.todo_list.to_from);
          formData.append("todo_list[to_date]", payload.todo_list.to_date);
          formData.append("todo_list[time]", payload.todo_list.time);
          
          // Append working days as array
          payload.todo_list.working_days.forEach(day => {
            formData.append("todo_list[working_days][]", day);
          });
        }
        
        // Multiple assignees
        if (payload.todo_list.additional_assigned) {
          payload.todo_list.additional_assigned.forEach(userId => {
            formData.append("todo_list[assigned_to][]", userId);
          });
        }
      }
      
      // Common optional fields
      if (payload.todo_list.site_id) {
        formData.append("todo_list[site_id]", payload.todo_list.site_id);
      }
      
      if (payload.todo_list.depend_on) {
        formData.append("todo_list[depend_on]", payload.todo_list.depend_on);
      }
      
      if (payload.todo_list.task_description) {
        formData.append("todo_list[task_description]", payload.todo_list.task_description);
      }
      
      if (payload.todo_list.due_date) {
        formData.append("todo_list[due_date]", payload.todo_list.due_date);
      }
      
      // Attachments: send both common keys for backend compatibility
      if (attachments.length > 0) {
        attachments.forEach((file) => {
          // some endpoints expect documents[]
          formData.append("documents[]", file);
          // keep the existing todo_list[attachments][] for compatibility
          formData.append("todo_list[attachments][]", file);
        });
      }

      // API Call
      const response = await postTodoList(formData);
      
      toast.dismiss();
      console.log("Response:", response);
      
      // Check if request was successful (status 200-299)
      if (response.status >= 200 && response.status < 300) {
        toast.success("Task Created Successfully");
        onClose();
      } else {
        toast.error(response.data?.message || "Failed to create task");
      }

    } catch (error) {
      toast.dismiss();
      console.error("Error creating task:", error);
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "Error Creating Task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-50 p-10">
      <div
        style={{ background: themeColor }}
        className="md:w-auto w-full p-4 md:px-10 flex flex-col rounded-md max-h-[100%] hide-scrollbar"
      >
        <button
          className="place-self-end fixed p-1 rounded-full z-30 bg-white"
          onClick={onClose}
        >
          <AiOutlineClose size={20} />
        </button>
        
        <div className="overflow-auto hide-scrollbar mt-5">
          <div className="px-2 hide-scrollbar">
            <div className="hide-scrollbar">
              <div className="hide-scrollbar">
                <div className="my-2" style={{ display: "flex" }}>
                  <h2 className="font-medium text-xl text-white border-b border-white w-full">
                    Create Task
                  </h2>
                </div>
                
                {/* Toggle Buttons */}
                <div className="flex justify-center w-full">
                  <div className="bg-gray-200 mx-5 rounded-full w-fit">
                    <a onClick={handleSelfTask}>
                      <button
                        className={`p-1 ${
                          isSelfTaskActive &&
                          "bg-white text-blue-500 shadow-custom-all-sides"
                        } rounded-full px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
                      >
                        Self Task
                      </button>
                    </a>
                    <a onClick={handleAssignToOthers}>
                      <button
                        className={`p-1 ${
                          isAssignToOthersActive &&
                          "bg-white text-blue-500 shadow-custom-all-sides"
                        } rounded-full px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
                      >
                        Assign to others
                      </button>
                    </a>
                  </div>
                </div>

                <div style={{ color: "black" }} className="my-2">
                  <div className="flex justify-around gap-2">
                    <div className="flex flex-col w-full">
                      <div>
                        <label className="text-white font-medium">Task Topic</label>
                        <label className="text-red-500" style={{ marginBottom: "0rem" }}>
                          *{" "}
                        </label>
                      </div>
                      <input
                        placeholder="Enter Task Topic"
                        style={{
                          border: "#747272 solid 1px",
                          fontSize: 14,
                          paddingLeft: 10,
                          color: "#000",
                          width: "100%",
                        }}
                        className="p-2 rounded-md outline-none"
                        type="text"
                        spellCheck={true}
                        value={task_topic}
                        onChange={(e) => setTaskTopic(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col w-full">
                      <div>
                        <label className="font-medium text-white">Due Date</label>
                        <label className="text-red-500" style={{ marginBottom: "0rem" }}>
                          *{" "}
                        </label>
                      </div>

                      <DatePicker
                        selected={due_date}
                        onChange={(date) => setDueDate(date)}
                        showTimeSelect
                        timeIntervals={5}
                        dateFormat="dd/MM/yyyy h:mm aa"
                        minDate={new Date()}
                        className="p-2 rounded-md outline-none w-full"
                        placeholderText="Select Date & Time"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 items-center">
                    <div className="my-2 flex flex-col">
                      <label className="font-medium text-white">Task Description</label>
                      <textarea
                        style={{ resize: "none" }}
                        className="rounded-md px-2 outline-none"
                        placeholder="Describe Task"
                        rows={3}
                        type="text"
                        spellCheck={true}
                        value={task_description}
                        maxLength={250}
                        onChange={(e) => setTaskDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-medium text-white">Attachment</label>
                      <input
                        style={{
                          border: "white dotted 2px",
                          height: "75px",
                          color: "white",
                        }}
                        className="rounded-md p-5 px-10"
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileAttachment}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 items-center gap-2">
                    <div>
                      <label className="text-white font-medium">Select Dependent Tasks :</label>
                      <Select
                        isMulti
                        value={selectedTasks}
                        onChange={handleChangeSelectTitle}
                        options={dependencyTaskTitle.map((task) => ({
                          value: task.task_id ?? task.id,
                          label: task.task_topic ?? task.title,
                        }))}
                        placeholder="Select tasks..."
                        noOptionsMessage={() => "Tasks not available..."}
                        styles={{
                          placeholder: (base) => ({ ...base, color: "black" }),
                          clearIndicator: (base) => ({ ...base, color: "red" }),
                          dropdownIndicator: (base) => ({ ...base, color: "black" }),
                          control: (base) => ({ ...base, borderColor: "darkblue" }),
                          multiValueRemove: (base, { isFocused }) => ({
                            ...base,
                            color: isFocused ? "red" : "gray",
                            backgroundColor: isFocused ? "black" : "lightgreen",
                          }),
                        }}
                      />
                    </div>

                    {assignToOthers && (
                      <div className="">
                        <label className="font-medium text-white">Assign :</label>
                        <Select
                          isMulti
                          onChange={handleChangeSelect}
                          options={emails}
                          noOptionsMessage={() => "Email not available..."}
                          maxMenuHeight={100}
                          styles={{
                            placeholder: (baseStyles) => ({
                              ...baseStyles,
                              color: "black",
                            }),
                            clearIndicator: (baseStyles) => ({
                              ...baseStyles,
                              color: "red",
                            }),
                            dropdownIndicator: (baseStyles) => ({
                              ...baseStyles,
                              color: "black",
                            }),
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: "darkblue",
                            }),
                            multiValueRemove: (baseStyles, state) => ({
                              ...baseStyles,
                              color: state.isFocused ? "red" : "gray",
                              backgroundColor: state.isFocused
                                ? "black"
                                : "lightgreen",
                            }),
                          }}
                          menuPosition={"fixed"}
                        />
                      </div>
                    )}
                  </div>

                  {assignToOthers && (
                    <>
                      <div className="flex gap-4">
                        <div className="col-md-3">
                          <span className="font-medium text-white">Urgent</span>
                          <div className="app">
                            <ReactSwitch
                              checked={checked === 1}
                              onChange={(val) => setChecked(val ? 1 : 0)}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 p-0">
                          <label className="font-medium text-white">Repeat</label>
                          <div className="">
                            <ReactSwitch
                              checked={checkedRepeat === 1}
                              onChange={(val) => {
                                setCheckedRepeat(val ? 1 : 0);
                                setRepeatMeet(!!val);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {repeatMeet ? (
                        <div
                          className="col-md-12 mt-2"
                          style={{
                            backgroundColor: "rgb(76 98 113 / 9%)",
                            borderRadius: 4,
                          }}
                        >
                          <label className="text-white font-medium">Repeat</label>
                          <hr className="mb-0 mt-0" />

                          <div className="">
                            <div className="grid grid-cols-2 w-full gap-4 my-2">
                              <div className="w-full flex flex-col">
                                <label className="font-medium text-white">
                                  <span>FROM DATE</span>
                                </label>
                                <input
                                  value={from_due_date}
                                  spellCheck={true}
                                  onChange={(e) => setFromDueDate(e.target.value)}
                                  className="w-full outline-none"
                                  style={{
                                    borderRadius: 4,
                                    border: "#747272 solid 1px",
                                    height: 40,
                                    fontSize: 14,
                                    paddingLeft: 10,
                                    color: "#000",
                                  }}
                                  type="date"
                                />
                              </div>

                              <div className="flex w-full flex-col">
                                <label className="font-medium text-white">
                                  <span>TO DATE</span>
                                </label>
                                <input
                                  value={to_due_date}
                                  spellcheck={true}
                                  onChange={(e) => setToDueDate(e.target.value)}
                                  className="outline-none"
                                  style={{
                                    borderRadius: 4,
                                    border: "#747272 solid 1px",
                                    height: 40,
                                    fontSize: 14,
                                    paddingLeft: 10,
                                    color: "#000",
                                  }}
                                  type="date"
                                />
                              </div>

                              <div className="flex flex-col">
                                <label className="font-medium text-white">
                                  <span>TIME</span>
                                </label>
                                <input
                                  type="time"
                                  value={taskTime}
                                  onChange={(event) => setTaskTime(event.target.value)}
                                  className="p-2 rounded-md outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="">
                            <div className="flex">
                              <span className="text-white font-medium">
                                SELECT WORKING DAYS
                              </span>
                              <div className="text-white mx-2 flex">
                                <span
                                  style={{
                                    display: "flex",
                                    marginRight: 14,
                                    fontFamily:
                                      "SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono,Courier New, monospace",
                                  }}
                                >
                                  [
                                  <i
                                    className="fas fa-info-circle"
                                    title="Detail"
                                    style={{ fontSize: 14, marginTop: 5 }}
                                  ></i>
                                  &nbsp;
                                  <p
                                    className="mr-2 mb-2"
                                    style={{
                                      width: 10,
                                      height: 10,
                                      paddingBottom: 4,
                                      marginTop: 7,
                                      backgroundColor: "#0A9F6A",
                                    }}
                                  ></p>
                                  Selected
                                </span>
                                <span
                                  style={{
                                    display: "flex",
                                    fontFamily:
                                      "SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono,Courier New, monospace",
                                  }}
                                >
                                  <p
                                    className="mr-2 mb-2"
                                    style={{
                                      width: 10,
                                      height: 10,
                                      paddingBottom: 4,
                                      marginTop: 7,
                                      backgroundColor: "#fff",
                                      border: "1px solid #cdcdcd",
                                    }}
                                  ></p>
                                  Deselected]
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-4 flex-wrap">
                              {weekdaysMap.map((weekdayObj) => (
                                <div
                                  className={`rounded-md p-2 px-4 shadow-custom-all-sides font-medium cursor-pointer ${
                                    selectedWeekdays?.includes(weekdayObj.index)
                                      ? "bg-green-400 text-white"
                                      : "bg-white"
                                  }`}
                                  key={weekdayObj.day}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleWeekdaySelection(weekdayObj.day);
                                  }}
                                >
                                  <a>{weekdayObj.day}</a>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  )}

                  <div className="col-md-6 mb-3">
                    <div className="flex justify-center w-full">
                      <button
                        className="my-2 w-full border border-white shadow-custom-all-sides p-2 rounded-md text-white font-medium"
                        id="confirmEmployeeDetails"
                        type="button"
                        onClick={createTask}
                        style={{
                          background: themeColor,
                        }}
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create Task"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskSelf;