import { useState, useRef, useEffect, useCallback } from "react"
import image from "/profile.png"
import { FaTrash } from "react-icons/fa"
import { useSelector } from "react-redux"
import { getItemInLocalStorage } from "../utils/localStorage"
import toast from "react-hot-toast"
import { getHostList, getParkingConfig, getVisitorStaffCategory, postNewGoods, postNewVisitor } from "../api"
import { useNavigate } from "react-router-dom"
import Webcam from "react-webcam"
import FileInputBox from "../containers/Inputs/FileInputBox" 


const AddNewVisitor = () => {
  const siteId = getItemInLocalStorage("SITEID")
  const userId = getItemInLocalStorage("UserId")
  const navigate = useNavigate()
  const themeColor = "#222"
  
  const currentDate = new Date().toISOString().split("T")[0] 
  const todayDate = currentDate 
  
  const [behalf] = useState("Visitor") 
  const [visitors, setVisitors] = useState([{ name: "", mobile: "" }]) 
  const [selectedFrequency, setSelectedFrequency] = useState("Once")
  const [selectedVisitorType, setSelectedVisitorType] = useState("Guest")
  const [hosts, setHosts] = useState([])
  const [staffCategories, setStaffCategories] = useState([])
  const [slots, setSlots] = useState([])
  const [passStartDate, setPassStartDate] = useState("")
  const [passEndDate, setPassEndDate] = useState("")

  const [showWebcam, setShowWebcam] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const webcamRef = useRef(null)

  const [selectedWeekdays, setSelectedWeekdays] = useState([])
  const [weekdaysMap, setWeekdaysMap] = useState([
    { day: "Mon", index: 0, isActive: false },
    { day: "Tue", index: 1, isActive: false },
    { day: "Wed", index: 2, isActive: false },
    { day: "Thu", index: 3, isActive: false },
    { day: "Fri", index: 4, isActive: false },
    { day: "Sat", index: 5, isActive: false },
    { day: "Sun", index: 6, isActive: false },
  ])

  const [formData, setFormData] = useState({
    visitorName: "",
    mobile: "",
    purpose: "",
    comingFrom: "",
    vehicleNumber: "",
    expectedDate: currentDate,
    expectedTime: "",
    hostApproval: false,
    goodsInward: false,
    license: false, 
    consignment: false, 
    host: "",
    passNumber: "",
    noOfGoods: "",
    goodsDescription: "",
    goodsAttachments: [], 
    licenseAttachments: [], 
    consignmentAttachments: [], 
    supportCategory: "",
    slotNumber: "",
  })


  const getHeadingText = () => {
    return "NEW VISITOR"
  }

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersResp, visitorCat, parkingRes] = await Promise.all([
          getHostList(siteId),
          getVisitorStaffCategory(),
          getParkingConfig(),
        ])
        setHosts(usersResp.data.hosts)
        setStaffCategories(visitorCat.data.categories)
        setSlots(parkingRes.data)
      } catch (error) {
        console.error("Error fetching initial data:", error)
        toast.error("Failed to load hosts, categories, or parking slots.")
      }
    }
    fetchInitialData()
  }, [siteId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setFormData({ ...formData, [name]: checked })
  }

  const handleFrequencyChange = (e) => {
    setSelectedFrequency(e.target.value)
  }

  const handleVisitorTypeChange = (e) => {
    setSelectedVisitorType(e.target.value)
    if (e.target.value !== "Support Staff") {
        setFormData(prev => ({ ...prev, supportCategory: "" }))
    }
  }
  
  const handleFileChange = (files, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: files,
    })
  }

  const handlePassStartDateChange = (event) => {
    const selectedDateTime = event.target.value ? event.target.value + ":00" : ""
    setPassStartDate(selectedDateTime)

    if (passEndDate && selectedDateTime && selectedDateTime > passEndDate) {
      setPassEndDate("")
      toast.error("End date cannot be earlier than the start date.")
    }
  }

  const handlePassEndDateChange = (event) => {
    const selectedDateTime = event.target.value ? event.target.value + ":00" : ""

    if (passStartDate && selectedDateTime && selectedDateTime < passStartDate) {
      toast.error("End date cannot be earlier than the start date.")
      return
    }

    setPassEndDate(selectedDateTime)
  }

  const handleAddVisitor = (event) => {
    event.preventDefault()
    const lastVisitor = visitors[visitors.length - 1];
    if (lastVisitor && (lastVisitor.name === "" && lastVisitor.mobile === "")) {
        return toast.error("Please fill the current additional visitor's details first.")
    }
    setVisitors([...visitors, { name: "", mobile: "" }])
  }

  const handleInputChange = (index, event) => {
    const { name, value } = event.target
    const newVisitors = [...visitors]
    newVisitors[index][name] = value
    setVisitors(newVisitors)
  }

  const handleRemoveVisitor = (index) => {
    const newVisitors = [...visitors]
    newVisitors.splice(index, 1)
    setVisitors(newVisitors)
  }
  
  const handleOpenCamera = () => {
    setShowWebcam(true)
  }

  const handleCloseCamera = () => {
    setShowWebcam(false)
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setShowWebcam(false)
    setCapturedImage(imageSrc)
  }, [webcamRef])

  const handleWeekdaySelection = (weekday) => {
    const index = weekdaysMap.find((dayObj) => dayObj.day === weekday)?.index

    if (index !== undefined) {
      setWeekdaysMap((prevMap) =>
        prevMap.map((dayObj) =>
          dayObj.index === index ? { ...dayObj, isActive: !dayObj.isActive } : dayObj,
        ),
      )

      setSelectedWeekdays((prevSelectedWeekdays) =>
        prevSelectedWeekdays.includes(weekday)
          ? prevSelectedWeekdays.filter((day) => day !== weekday)
          : [...prevSelectedWeekdays, weekday],
      )
    }
  }


  const createNewVisitor = async (e) => {
    e.preventDefault()

    if (formData.visitorName === "" || formData.purpose === "" || formData.mobile === "") {
      return toast.error("Visitor Name, Mobile, and Purpose are Required")
    }

    const mobilePattern = /^\d{10}$/
    if (!mobilePattern.test(formData.mobile)) {
      return toast.error("Mobile number must be 10 digits.")
    }

    const postData = new FormData()
    
    postData.append("visitor[site_id]", siteId)
    postData.append("visitor[created_by_id]", userId)
    postData.append("visitor[vhost_id]", formData.host)
    postData.append("visitor[name]", formData.visitorName)
    postData.append("visitor[visitor_staff_category_id]", formData.supportCategory)
    postData.append("visitor[contact_no]", formData.mobile)
    postData.append("visitor[purpose]", formData.purpose)
    postData.append("visitor[start_pass]", passStartDate)
    postData.append("visitor[end_pass]", passEndDate)
    postData.append("visitor[coming_from]", formData.comingFrom)
    postData.append("visitor[vehicle_number]", formData.vehicleNumber)
    postData.append("visitor[expected_date]", formData.expectedDate)
    postData.append("visitor[expected_time]", formData.expectedTime)
    postData.append("visitor[skip_host_approval]", formData.hostApproval)
    postData.append("visitor[goods_inwards]", formData.goodsInward)
    postData.append("visitor[visit_type]", selectedVisitorType)
    postData.append("visitor[pass_number]", formData.passNumber)
    postData.append("visitor[frequency]", selectedFrequency)
    postData.append("visitor[parking_slot]", formData.slotNumber)
    postData.append("visitor[license_doc]", formData.license) // New
    postData.append("visitor[consignment_doc]", formData.consignment) // New


    if (capturedImage) {
      const response = await fetch(capturedImage)
      const blob = await response.blob()
      postData.append("visitor[profile_pic]", blob, "visitor_image.jpg")
    }

    // Send license attachments with category_type
    formData.licenseAttachments.forEach((file, index) => {
      postData.append(`visitor[visitor_files][${index}][file]`, file, file.name)
      postData.append(`visitor[visitor_files][${index}][category_type]`, "license")
    })
    
    // Send consignment attachments with category_type
    const consignmentStartIndex = formData.licenseAttachments.length
    formData.consignmentAttachments.forEach((file, index) => {
      const fileIndex = consignmentStartIndex + index
      postData.append(`visitor[visitor_files][${fileIndex}][file]`, file, file.name)
      postData.append(`visitor[visitor_files][${fileIndex}][category_type]`, "consignment")
    })

    selectedWeekdays.forEach((day) => {
      postData.append("visitor[working_days][]", day)
    })

    visitors.forEach((extraVisitor, index) => {
      if (extraVisitor.name || extraVisitor.mobile) {
          postData.append(`visitor[extra_visitors_attributes][${index}][name]`, extraVisitor.name)
          postData.append(`visitor[extra_visitors_attributes][${index}][contact_no]`, extraVisitor.mobile)
      }
    })

    let visitResp = null
    try {
      toast.loading("Creating new visitor, please wait...", { id: 'createVisitor' })
      visitResp = await postNewVisitor(postData)
      
      const dataToSave = {
        UserInfo: {
          employeeNo: visitResp.data.id.toString(),
          name: formData.visitorName,
          userType: "visitor",
          Valid: {
            enable: true,
            beginTime: passStartDate,
            endTime: passEndDate,
          },
        },
      }
      const blob = new Blob([JSON.stringify(dataToSave, null, 2)], {
        type: "application/json",
      })
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `visitor_data_${visitResp.data.id}.json`
      a.click()
      URL.revokeObjectURL(a.href) 

      if (formData.goodsInward && formData.noOfGoods && visitResp.data.id) {
          const postGoods = new FormData()
          formData.goodsAttachments.forEach((file) => {
            postGoods.append("goods_files[]", file, file.name)
          })
          postGoods.append("goods_in_out[visitor_id]", visitResp.data.id)
          postGoods.append("goods_in_out[no_of_goods]", formData.noOfGoods)
          postGoods.append("goods_in_out[description]", formData.goodsDescription)
          postGoods.append("goods_in_out[ward_type]", "in")
          postGoods.append("goods_in_out[vehicle_no]", formData.vehicleNumber)
          postGoods.append("goods_in_out[person_name]", formData.visitorName)
          postGoods.append("goods_in_out[created_by_id]", userId)

          try {
            await postNewGoods(postGoods)
          } catch (error) {
            console.error("Error posting goods:", error)
          }
      }

      toast.dismiss('createVisitor')
      toast.success("Visitor Added Successfully")
      navigate("/admin/passes/visitors")

    } catch (error) {
      console.error("Error creating visitor:", error)
      toast.dismiss('createVisitor')
      toast.error("Failed to add visitor. Please check form data.")
    }
  }


  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-50"> 
      <div className="bg-white shadow-xl w-full"> 
<div
  className="text-center md:text-xl font-bold p-2 bg-black rounded-full text-white mb-6 mx-4 mt-4"
  style={{
    background:
      "radial-gradient(897px at 9% 80.3%, rgb(55, 60, 245) 0%, rgba(234, 161, 15, 0.9) 100.2%)",
        }}
    >
            <h2 className="text-center text-xl sm:text-2xl font-bold text-white tracking-widest">
                {getHeadingText()}
            </h2>
        </div>
        
        <div className="flex justify-center -mt-45 mb-4 "> 
          <button 
            type="button" 
            onClick={handleOpenCamera} 
            className="group block relative p-1 rounded-full bg-white shadow-lg transition-transform hover:scale-[1.02]"
          >
            <img 
                src={capturedImage || image} 
                alt="Visitor Profile" 
                className="rounded-full w-32 h-32 sm:w-40 sm:h-40 object-cover border-4 border-white transition-opacity group-hover:opacity-90"
            />
             <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white bg-black bg-opacity-50 p-2 rounded-lg text-xs font-semibold">
                    {capturedImage ? "Retake Photo" : "Take Photo"}
                </span>
            </div>
          </button>
        </div>

        <form onSubmit={createNewVisitor} className="pt-4 p-4 sm:p-8 md:p-12 space-y-8">
          
          {showWebcam && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Capture Profile Picture</h3>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full rounded-md shadow-md"
                        videoConstraints={{ facingMode: "user" }}
                    />
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={handleCloseCamera}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={capture}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Capture Photo
                        </button>
                    </div>
                </div>
            </div>
          )}


          <div className="flex flex-col gap-6 p-4 pt-0">
            <div className="flex flex-wrap gap-8 items-center">
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-gray-700">Visitor Type:</h3>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="visitorType"
                                value="Guest"
                                checked={selectedVisitorType === "Guest"}
                                onChange={handleVisitorTypeChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="font-medium text-gray-800">Guest</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="visitorType"
                                value="Support Staff"
                                checked={selectedVisitorType === "Support Staff"}
                                onChange={handleVisitorTypeChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="font-medium text-gray-800">Support Staff</span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-gray-700">Visiting Frequency:</h3>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="frequency"
                                value="Once"
                                checked={selectedFrequency === "Once"}
                                onChange={handleFrequencyChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="font-medium text-gray-800">Once</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="frequency"
                                value="Frequently"
                                checked={selectedFrequency === "Frequently"}
                                onChange={handleFrequencyChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="font-medium text-gray-800">Frequently</span>
                        </label>
                    </div>
                </div>
            </div>
            {selectedVisitorType === "Support Staff" && (
                <div className="max-w-xs pt-4">
                    <label htmlFor="supportCategory" className="font-semibold text-gray-700 sr-only">
                        Support Staff Category:
                    </label>
                    <select
                        id="supportCategory"
                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm"
                        value={formData.supportCategory}
                        onChange={handleChange}
                        name="supportCategory"
                        required={selectedVisitorType === "Support Staff"}
                    >
                        <option value="">Select Category</option>
                        {staffCategories.map((staffCat) => (
                            <option value={staffCat.id} key={staffCat.id}>
                                {staffCat.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
          </div>

          <hr className="border-t border-gray-200" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="visitorName" className="font-semibold text-gray-700 text-sm">
                Visitor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.visitorName}
                onChange={handleChange}
                name="visitorName"
                id="visitorName"
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400 text-sm"
                placeholder="Enter Visitor Name"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="mobileNumber" className="font-semibold text-gray-700 text-sm">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.mobile}
                onChange={handleChange}
                name="mobile"
                id="mobileNumber"
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400 text-sm"
                placeholder="Enter Mobile Number"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="host" className="font-semibold text-gray-700 text-sm">
                Host
              </label>
              <select
                id="host"
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm"
                value={formData.host}
                onChange={handleChange}
                name="host"
                required
              >
                <option value="">Select Person to meet</option>
                {hosts.map((host) => (
                  <option value={host.id} key={host.id}>
                    {host.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="passNumber" className="font-semibold text-gray-700 text-sm">
                Pass Number
              </label>
              <input
                type="text"
                value={formData.passNumber}
                onChange={handleChange}
                name="passNumber"
                id="passNumber"
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400 text-sm"
                placeholder="Enter Pass Number"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="comingFrom" className="font-semibold text-gray-700 text-sm">
                Coming From
              </label>
              <input
                type="text"
                id="comingFrom"
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400 text-sm"
                placeholder="Enter Origin"
                value={formData.comingFrom}
                name="comingFrom"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="vehicleNumber" className="font-semibold text-gray-700 text-sm">
                Vehicle Number
              </label>
              <input
                type="text"
                id="vehicleNumber"
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400 text-sm"
                placeholder="Enter Vehicle Number"
                value={formData.vehicleNumber}
                name="vehicleNumber"
                onChange={handleChange}
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="slotNumber" className="font-semibold text-gray-700 text-sm">
                Select Parking Slot
              </label>
              <select
                id="slotNumber"
                name="slotNumber"
                value={formData.slotNumber}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm"
              >
                <option value="">Select Slot</option>
                {slots.map((slot) => (
                  <option value={slot.id} key={slot.id}>
                    {slot.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="expectedDate" className="font-semibold text-gray-700 text-sm">
                Expected Date
              </label>
              <div className="relative">
                <input
                    type="date"
                    id="expectedDate"
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm"
                    value={formData.expectedDate}
                    onChange={handleChange}
                    name="expectedDate"
                    min={todayDate}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="expectedTime" className="font-semibold text-gray-700 text-sm">
                Expected Time
              </label>
              <input
                type="time"
                id="expectedTime"
                value={formData.expectedTime}
                onChange={handleChange}
                name="expectedTime"
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="purpose" className="font-semibold text-gray-700 text-sm">
                Visit Purpose <span className="text-red-500">*</span>
              </label>
              <select
                id="purpose"
                value={formData.purpose}
                onChange={handleChange}
                name="purpose"
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm"
                required
              >
                <option value="">Select Purpose</option>
                <option value="Meeting">Meeting</option>
                <option value="Delivery">Delivery</option>
                <option value="Personal">Personal</option>
                <option value="Fitout Staff">Fitout Staff</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="lg:col-span-3 flex flex-wrap items-center gap-x-6 gap-y-3 pt-2"> 
                
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                    <input
                        type="checkbox"
                        id="hostApproval"
                        name="hostApproval"
                        checked={formData.hostApproval}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-400"
                    />
                    Skip Host Approval
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                    <input
                        type="checkbox"
                        id="goodsInward"
                        name="goodsInward"
                        checked={formData.goodsInward}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-400"
                    />
                    Goods Inwards
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                    <input
                        type="checkbox"
                        id="license"
                        name="license"
                        checked={formData.license}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-400"
                    />
                    License
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                    <input
                        type="checkbox"
                        id="consignment"
                        name="consignment"
                        checked={formData.consignment}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-400"
                    />
                    Consignment
                </label>
            </div>
          </div>
          
          {formData.goodsInward && (
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4">
              <h3 className="font-bold text-lg text-blue-800 border-b pb-2 mb-4">Goods Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* No. of Goods */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="noOfGoods" className="font-semibold text-gray-700 text-sm">No. of Goods:</label>
                  <input
                    type="number"
                    name="noOfGoods"
                    id="noOfGoods"
                    className="border border-gray-300 p-2.5 rounded-lg text-sm"
                    placeholder="Enter Number"
                    value={formData.noOfGoods}
                    onChange={handleChange}
                  />
                </div>
                {/* Description */}
                <div className="col-span-1 sm:col-span-2 flex flex-col gap-1.5">
                  <label htmlFor="goodsDescription" className="font-semibold text-gray-700 text-sm">Description:</label>
                  <textarea
                    name="goodsDescription"
                    id="goodsDescription"
                    value={formData.goodsDescription}
                    onChange={handleChange}
                    className="border border-gray-300 p-2.5 rounded-lg text-sm"
                    rows={1}
                    placeholder="Enter Description of Goods"
                  ></textarea>
                </div>
              </div>
              {/* Goods Attachments */}
              <div className="pt-2">
                  <label className="font-semibold text-gray-700 mb-1 block text-sm">Goods Attachments (Optional)</label>
                  <FileInputBox
                      handleChange={(files) => handleFileChange(files, "goodsAttachments")}
                      fieldName={"goodsAttachments"}
                      isMulti={true}
                  />
              </div>
            </div>
          )}

          {/* License & Consignment Documents Section */}
          {(formData.license || formData.consignment) && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
              <h3 className="font-bold text-lg text-gray-700 border-b pb-2 mb-4">Supporting Documents</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* License Attachments */}
                {formData.license && (
                    <div>
                        <label className="font-semibold text-gray-700 mb-1 block text-sm">License Attachments (e.g., Driving License)</label>
                        <FileInputBox
                        handleChange={(files) => handleFileChange(files, "licenseAttachments")}
                        fieldName={"licenseAttachments"}
                        isMulti={true}
                        />
                    </div>
                )}

                {/* Consignment Attachments */}
                {formData.consignment && (
                    <div>
                        <label className="font-semibold text-gray-700 mb-1 block text-sm">Consignment Attachments (e.g., Invoices)</label>
                        <FileInputBox
                        handleChange={(files) => handleFileChange(files, "consignmentAttachments")}
                        fieldName={"consignmentAttachments"}
                        isMulti={true}
                        />
                    </div>
                )}
              </div>
            </div>
          )}
          
          {/* Additional Visitors */}
            <div className="flex justify-between items-center pb-2">
                <h3 className="font-bold text-lg text-gray-700">Additional Visitor(s)</h3>
                <button
                    type="button"
                    onClick={handleAddVisitor}
                    className="bg-black text-white font-semibold py-1.5 px-4 rounded-lg transition-colors text-sm shadow-md"
                >
                    + Add Visitor
                </button>
            </div>
            
            {/* Additional Visitors List */}
            <div className="space-y-4">
                {visitors.map((visitor, index) => (
                    <div 
                        key={index} 
                        className="p-4 border border-gray-300 rounded-lg relative bg-white shadow-sm"
                    >
                        {/* ROW: Name + Mobile side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Visitor Name */}
                            <div className="flex flex-col gap-1">
                                <label 
                                    htmlFor={`visitor-name-${index}`} 
                                    className="font-semibold text-gray-700 text-xs"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id={`visitor-name-${index}`}
                                    name="name"
                                    value={visitor.name}
                                    onChange={(e) => handleInputChange(index, e)}
                                    className="border border-gray-300 p-2 rounded-lg text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                    placeholder="Enter Visitor Name"
                                />
                            </div>

                            {/* Visitor Mobile */}
                            <div className="flex flex-col gap-1">
                                <label 
                                    htmlFor={`visitor-mobile-${index}`} 
                                    className="font-semibold text-gray-700 text-xs"
                                >
                                    Mobile
                                </label>
                                <input
                                    type="number"
                                    id={`visitor-mobile-${index}`}
                                    name="mobile"
                                    value={visitor.mobile}
                                    onChange={(e) => handleInputChange(index, e)}
                                    className="border border-gray-300 p-2 rounded-lg text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                    placeholder="Enter Mobile Number"
                                />
                            </div>
                        </div>

                        {/* Delete Button */}
                        {visitors.length > 1 && (
                            <button 
                                type="button"
                                onClick={() => handleRemoveVisitor(index)}
                                className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 transition-colors rounded-full bg-gray-100 hover:bg-gray-200"
                                aria-label={`Remove visitor ${index + 1}`}
                            >
                                <FaTrash className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

          <hr className="border-t border-gray-200" />
          
          {/* Pass Validity Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            {/* Pass Valid From */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="passStartDate" className="font-semibold text-gray-700 text-sm">
                    Pass Valid From
                </label>
                <input
                    type="datetime-local"
                    id="passStartDate"
                    value={passStartDate ? passStartDate.slice(0, 16) : ''} 
                    onChange={handlePassStartDateChange}
                    className="border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm"
                    min={todayDate}
                />
            </div>

            {/* Pass Valid To */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="passEndDate" className="font-semibold text-gray-700 text-sm">
                    Pass Valid To
                </label>
                <input
                    type="datetime-local"
                    id="passEndDate"
                    value={passEndDate ? passEndDate.slice(0, 16) : ''}
                    onChange={handlePassEndDateChange}
                    className="border border-gray-300 p-2.5 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm"
                    min={passStartDate ? passStartDate.slice(0, 16) : todayDate}
                />
            </div>
            
            {/* Conditional Weekdays Selector for 'Frequently' */}
            {selectedFrequency === "Frequently" && (
                <div className="sm:col-span-2">
                    <h4 className="font-semibold text-gray-700 text-sm mb-2">Select Working Days:</h4>
                    <div className="flex flex-wrap gap-4">
                        {weekdaysMap.map((dayObj) => (
                            <button
                                key={dayObj.day}
                                type="button"
                                onClick={() => handleWeekdaySelection(dayObj.day)}
                                className={`py-1 px-3 border rounded-lg text-xs font-medium transition-colors ${
                                    dayObj.isActive
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                }`}
                            >
                                {dayObj.day}
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              style={{ backgroundColor: themeColor }}
              className="px-10 py-3 text-lg font-bold text-white rounded-lg shadow-xl hover:opacity-90 transition-opacity"
            >
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddNewVisitor