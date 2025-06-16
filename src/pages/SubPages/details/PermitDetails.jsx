import React, { useEffect, useState } from "react";
import { IoMdPrint } from "react-icons/io";
import { MdFeed } from "react-icons/md";
import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import FileInputBox from "../../../containers/Inputs/FileInputBox";
import {
  getPermitDetails,
  getSetupUsers,
  postExtensionPermit,
  getFloors,
  getUnits,
} from "../../../api";
import { useParams } from "react-router-dom";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";

const PermitListDetails = () => {
  const { id } = useParams(); //
  const [vendors, setVendors] = useState([]);
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);
  const userId = getItemInLocalStorage("UserId");
  const [assignedUser, setAssignedUser] = useState([]);

  const [formDataExtension, setFormDataExtension] = useState({
    permit_id: "",
    ext_date: "",
    ext_time: "",
    created_by_id: "",
    assign_to_names: [],
    assign_to_ids: [],
    reason: "",
  });
  const handleChangeExtension = (e) => {
    setFormDataExtension({
      ...formDataExtension,
      [e.target.name]: e.target.value,
    });
  };
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    contact_number: "",
    site_id: "",
    unit_id: "",
    permit_for: "",
    building_id: "",
    floor_id: "",
    room_id: "",
    client_specific: "internal",
    entity: "",
    copy_to_string: "",
    permit_type: "",
    vendor_id: "",
    issue_date_and_time: "",
    expiry_date_and_time: "",
    comment: "",
    permit_status: "",
    extention_status: true,
    created_by_id: "",
    permit_activities: [],
  });
  const fetchPermitsDetails = async () => {
    try {
      const res = await getPermitDetails(id);
      setFormData({
        ...formData,
        id: res?.data?.id,
        name: res?.data?.name,
        contact_number: res?.data?.contact_number,
        permit_for: res?.data?.permit_for,
        building_id: res?.data?.building_id,
        floor_id: res?.data?.floor_id,
        unit_id: res?.data?.unit_id,
        client_specific: res?.data?.client_specific,

        permit_type: res?.data?.permit_type,
        issue_date_and_time: res?.data?.issue_date_and_time,
        expiry_date_and_time: res?.data?.expiry_date_and_time,
        extention_status: res?.data?.extention_status,
        permit_status: res?.data?.permit_status,
        comment: res?.data?.comment,
      });
      fetchFloors(res?.data?.building_id);
      fetchUnits(res?.data?.floor_id);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchFloors = async (buildingId) => {
    try {
      const res = await getFloors(buildingId);
      setFloors(res.data.map((item) => ({ name: item.name, id: item.id })));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUnits = async (floorId) => {
    try {
      const res = await getUnits(floorId);
      setUnits(res.data.map((item) => ({ name: item.name, id: item.id })));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPermitsDetails();
  }, []);

  const column = [
    { name: "Inventory", selector: (row) => row.Inventory, sortable: true },
    {
      name: "Expected Quantity",
      selector: (row) => row.ExpectedQuantity,
      sortable: true,
    },
    {
      name: "Received Quantity	",
      selector: (row) => row.ReceivedQuantity,
      sortable: true,
    },
    { name: "Unit", selector: (row) => row.Unit, sortable: true },
    { name: "Rate", selector: (row) => row.Rate, sortable: true },
    {
      name: "Approved Qty",
      selector: (row) => row.ApprovedQty,
      sortable: true,
    },
    {
      name: "Rejected Qty",
      selector: (row) => row.RejectedQty,
      sortable: true,
    },
    { name: "CGST Rate", selector: (row) => row.CGSTRate, sortable: true },
    { name: "CGST Amount", selector: (row) => row.CGSTAmount, sortable: true },
    { name: "SGST Rate", selector: (row) => row.SGSTRate, sortable: true },
    { name: "SGST Amount", selector: (row) => row.SGSTAmount, sortable: true },
    { name: "IGST Rate", selector: (row) => row.IGSTRate, sortable: true },
    { name: "IGST Amount", selector: (row) => row.IGSTAmount, sortable: true },
    { name: "TCS Rate", selector: (row) => row.TCSRate, sortable: true },
    { name: "TCS Amount", selector: (row) => row.TCSAmount, sortable: true },
    { name: "Total Taxes", selector: (row) => row.TotalTaxes, sortable: true },
    {
      name: "Total Amount",
      selector: (row) => row.TotalAmount,
      sortable: true,
    },
  ];
  const data = [
    {
      id: 1,
      Inventory: "EXHAUST FANS",
      ExpectedQuantity: "2.0",
      ReceivedQuantity: "2",
      Unit: "31/05/24",
      Rate: "4344.29	",
      ApprovedQty: "2.0",
      RejectedQty: "0.0",
      CGSTRate: "9.0",
      CGSTAmount: "781.97",
      SGSTRate: "9.0",
      SGSTAmount: "781.97",
      IGSTRate: "NA",
      IGSTAmount: "0.0",
      TCSRate: "0.0",
      TCSAmount: "0.0",
      TotalTaxes: "1563.94",
      TotalAmount: "8688.58",
    },
  ];
  const columnDebitNote = [
    { name: "ID", selector: (row) => row.ID, sortable: true },
    { name: "Amount", selector: (row) => row.Amount, sortable: true },
    { name: "Description", selector: (row) => row.Description, sortable: true },
    { name: "Approved", selector: (row) => row.Approved, sortable: true },
    { name: "Approved On", selector: (row) => row.ApprovedOn, sortable: true },
    { name: "Approved By", selector: (row) => row.ApprovedBy, sortable: true },
    { name: "Created On", selector: (row) => row.CreatedOn, sortable: true },
    { name: "Created By", selector: (row) => row.CreatedBy, sortable: true },
    { name: "Attachment", selector: (row) => row.QCAmount, sortable: true },
  ];
  const dataDebitNote = [
    {
      id: 1,
      ID: "",
      Amount: "",
      Description: "",
      Approved: "",
      ApprovedOn: "",
      ApprovedBy: "",
      CreatedOn: "",
      CreatedBy: "",
      Attachment: "",
    },
  ];
  const columnPayment = [
    { name: "Action", selector: (row) => row.Action, sortable: true },
    { name: "Amount", selector: (row) => row.Amount, sortable: true },
    {
      name: "Payment Mode",
      selector: (row) => row.PaymentMode,
      sortable: true,
    },
    {
      name: "Transaction Number",
      selector: (row) => row.TransactionNumber,
      sortable: true,
    },
    { name: "Status	", selector: (row) => row.Status, sortable: true },
    {
      name: "Payment Date",
      selector: (row) => row.PaymentDate,
      sortable: true,
    },
    { name: "Note", selector: (row) => row.Note, sortable: true },
    {
      name: "Date of Entry",
      selector: (row) => row.DateofEntry,
      sortable: true,
    },
    { name: "Actions", selector: (row) => row.Actions, sortable: true },
  ];
  const dataPayment = [
    {
      id: 1,
      Action: "",
      Amount: "",
      PaymentMode: "",
      TransactionNumber: "",
      Status: "",
      PaymentDate: "",
      Note: "",
      DateofEntry: "",
      Actions: "",
    },
  ];
  const columnRetentionPayment = [
    { name: "Action", selector: (row) => row.Action, sortable: true },
    { name: "Amount", selector: (row) => row.Amount, sortable: true },
    {
      name: "Payment Mode",
      selector: (row) => row.PaymentMode,
      sortable: true,
    },
    {
      name: "Transaction Number",
      selector: (row) => row.TransactionNumber,
      sortable: true,
    },
    { name: "Status	", selector: (row) => row.Status, sortable: true },
    {
      name: "Payment Date",
      selector: (row) => row.PaymentDate,
      sortable: true,
    },
    { name: "Note", selector: (row) => row.Note, sortable: true },
    {
      name: "Date of Entry",
      selector: (row) => row.DateofEntry,
      sortable: true,
    },
    { name: "Actions", selector: (row) => row.Actions, sortable: true },
  ];
  const dataRetentionPayment = [
    {
      id: 1,
      Action: "",
      Amount: "",
      PaymentMode: "",
      TransactionNumber: "",
      Status: "",
      PaymentDate: "",
      Note: "",
      DateofEntry: "",
      Actions: "",
    },
  ];
  const columnQCPayment = [
    { name: "Amount", selector: (row) => row.Amount, sortable: true },
    {
      name: "Payment Mode",
      selector: (row) => row.PaymentMode,
      sortable: true,
    },
    {
      name: "Transaction Number",
      selector: (row) => row.TransactionNumber,
      sortable: true,
    },
    { name: "Status	", selector: (row) => row.Status, sortable: true },
    {
      name: "Payment Date",
      selector: (row) => row.PaymentDate,
      sortable: true,
    },
    { name: "Note", selector: (row) => row.Note, sortable: true },
    {
      name: "Date of Entry",
      selector: (row) => row.DateofEntry,
      sortable: true,
    },
    { name: "Actions", selector: (row) => row.Actions, sortable: true },
  ];
  const dataQCPayment = [
    {
      id: 1,
      Amount: "",
      PaymentMode: "",
      TransactionNumber: "",
      Status: "",
      PaymentDate: "",
      Note: "",
      DateofEntry: "",
      Actions: "",
    },
  ];
  const themeColor = useSelector((state) => state.theme.color);
  // Utility function to format date and time

  useEffect(() => {
    const fetchAssignedTo = async () => {
      try {
        const response = await getSetupUsers();

        // Assuming response.data is an array of user objects
        const formattedUsers = response.data.map((user) => ({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
        }));
        console.log(formattedUsers);
        setAssignedUser(formattedUsers);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };

    fetchAssignedTo();
  }, []);

  const formatDateTime = (isoDate) => {
    if (!isoDate) return ""; // Return empty string if null or undefined
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(isoDate));
  };
  const navigate = useNavigate();
  const handleSubmitextension = async () => {
    const sendData = new FormData();
    sendData.append("extension[permit_id]", id);
    sendData.append("extension[created_by_id]", userId);
    sendData.append("extension[ext_date]", formDataExtension.ext_date);
    sendData.append("extension[ext_time]", formDataExtension.ext_time);
    sendData.append(
      "extension[assign_to_names][]",
      formDataExtension.assign_to_names
    );
    sendData.append(
      "extension[assign_to_ids][]",
      formDataExtension.assign_to_ids
    );
    sendData.append("extension[reason]", formDataExtension.reason);
    // sendData.append("extension[reason]",formDataExtension.reason);

    // formData.attachfiles.forEach((file)=>{
    //   sendData.append("attachfiles[]", file)
    // })

    try {
      const resp = await postExtensionPermit(id, sendData);
      navigate("/admin/permit");
      toast.success("Permit Extended Successfully");
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 my-2 mb-4 flex-col overflow-hidden">
        <div className=" p-2 text-white " style={{ background: themeColor }}>
          <h2 className="text-xl font-semibold mx-5 text-center">
            PermitList DETAILS
          </h2>
        </div>
        <div className="flex gap-3 item-center my-2 mx-5 flex-wrap">
          <p className="text-sm font-bold">Safety Officer Approval:</p>
          <button className="bg-orange-400 px-2 py-1 rounded-md text-white text-sm">
            Pending
          </button>
          <p className="text-sm font-bold">
            Site Technical-in-Charge Approval:
          </p>
          <button className="bg-green-400 px-2 py-1 rounded-md text-white text-sm">
            Approved
          </button>
        </div>
        <div className="border flex flex-col my-5 mx-3 p-2 gap-4 rounded-md border-gray-300">
          <h2 className=" text-lg border-black font-semibold border-b">
            Permit Details
          </h2>
          <div className="my-5 md:px-10 text-sm items-center font-medium grid gap-4 md:grid-cols-2">
            <div className="grid grid-cols-2 items-center">
              <p>Permit ID</p>
              <p className="text-sm font-normal ">: {formData.id}</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Permit Type</p>
              <p className="text-sm font-normal ">: {formData.permit_type}</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Requested Date & Time</p>
              <p className="text-sm font-normal ">
                : {formatDateTime(formData.issue_date_and_time)}
              </p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Issued Date & Time</p>
              <p className="text-sm font-normal">
                : {formatDateTime(formData.issue_date_and_time)}
              </p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Vendor</p>
              <p className="text-sm font-normal ">
                : Soledify Systems Private Limited
              </p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Extension Status</p>
              <p className="text-sm font-normal ">
                : {formData.extention_status ? "Yes" : "No"}
              </p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Permit Expiry Date</p>
              <p className="text-sm font-normal ">
                : {formatDateTime(formData.expiry_date_and_time)}
              </p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Permit Status</p>
              <p className="text-sm font-normal ">: {formData.permit_status}</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Permit For</p>
              <p className="text-sm font-normal ">: {formData.permit_for}</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Location</p>
              <p className="text-sm font-normal ">
                : Site - PBP Viman Nagar / Building - COMMON / Wing - NA / Floor
                - NA / Area - NA / Room - NA
              </p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Comment</p>
              <p className="text-sm font-normal ">: {formData.comment}</p>
            </div>
          </div>
          <h2 className="border-b text-lg border-black font-semibold">
            REQUESTOR’S INFORMATION
          </h2>
          <div className="my-5 md:px-10 text-sm items-center font-medium grid gap-4 md:grid-cols-2">
            <div className="grid grid-cols-2 items-center">
              <p>Created By</p>
              <p className="text-sm font-normal ">: {formData.name}</p>
            </div>
            {/* <div className="grid grid-cols-2 items-center">
            <p>Department</p>
            <p className="text-sm font-normal ">: TECHNICAL</p>
          </div> */}
            <div className="grid grid-cols-2 items-center">
              <p>Contact Number</p>
              <p className="text-sm font-normal ">: 7620619199</p>
            </div>
          </div>

          <h2 className="border-b text-lg  border-black font-semibold ">
            ACTIVITY DETAILS
          </h2>
          <div className="my-2 md:px-10 text-sm items-center font-medium grid gap-2 md:grid-cols-3 bg-red-50 rounded-md p-2">
            <div className="grid grid-cols-2 items-center">
              <p>Activity</p>
              <p className="text-sm font-normal ">: Cable Laying Work</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Sub Activity</p>
              <p className="text-sm font-normal ">
                : Carrying All materials such as Ladder & tools etc.
              </p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Category of Hazard</p>
              <p className="text-sm font-normal ">
                : Slips & Trips (while carrying material)
              </p>
            </div>
          </div>
          {/* <h2 className="border-b text-lg  border-black font-semibold ">
            MANPOWER DETAILS
          </h2> */}
          {/* <div className="my-2 md:px-10 text-sm items-center font-medium grid gap-2 md:grid-cols-3 bg-red-50 rounded-md p-2">
            <div className="grid grid-cols-2 items-center">
              <p>Name</p>
              <p className="text-sm font-normal ">: Ravindar Sahani</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Designation</p>
              <p className="text-sm font-normal ">: SUPERVISOR</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Contact No.</p>
              <p className="text-sm font-normal ">: 7709079207</p>
            </div>
          </div> */}
          <div className="border p-2 rounded-md">
            <h2 className="border-b text-lg  border-black font-semibold ">
              PERMIT EXTENSION
            </h2>
            <div className="my-2  text-sm items-center font-medium grid gap-2 md:grid-cols-3  rounded-md p-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="">
                  Reason for Extension <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  className="border rounded-md p-2 border-gray-300"
                  placeholder="Enter Reason"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="">
                  Assignees{" "}
                  <span className="text-red-400" htmlFor="assignees">
                    *
                  </span>
                </label>
                <select
                  name="assign_to_ids"
                  value={formDataExtension.assign_to_ids}
                  id="assignees"
                  className="border rounded-md p-2 border-gray-300"
                >
                  <option value="">Select</option>
                  {assignedUser.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstname} {user.lastname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="">
                  Extension Date<span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="ext_date"
                  value={formDataExtension.ext_date}
                  onChange={handleChangeExtension}
                  id=""
                  className="border rounded-md p-2 border-gray-300"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="">
                  Extension Time<span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  name="ext_time"
                  value={formDataExtension.ext_time}
                  onChange={handleChangeExtension}
                  id=""
                  className="border rounded-md p-2 border-gray-300"
                />
              </div>
            </div>

            <FileInputBox />
            <div className="flex items-center gap-2">
              <input type="checkbox" name="" id="policy" />
              <label htmlFor="" className="text-sm">
                I have understood all the hazard and risk associated in the
                activity I pledge to implement on the control measure identified
                in the activity through risk analyses JSA and SOP. I Hereby
                declare that the details given above are correct and also I have
                been trained by our company for the above mentioned work & I am
                mentally and physically fit, Alcohol/drugs free to perform it,
                will be performed with appropriate safety and supervision as per
                Vibecopilot & Norms.
              </label>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSubmitextension}
                className="bg-green-500 text-white p-2 rounded-md"
              >
                Extend Permit
              </button>
            </div>
          </div>
        </div>
        <div className=" ">
          <h2 className="text-md font-semibold my-3 mx-5 border-b border-black">
            Attachments
          </h2>
          <p className="text-sm text-center">No attachments</p>
        </div>
        <div className=" ">
          <h2 className="text-md font-semibold my-3 mx-5 border-b border-black">
            Vendor Attachments
          </h2>
          <p className="text-sm text-center">No attachments</p>
        </div>
        {/* <div className="border-b flex items-center justify-between mx-5 pb-5">
          <h2 className="text-md font-semibold   ">Comment log</h2>
          <button className="bg-green-600 p-2 rounded-md text-white">
            Comment
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default PermitListDetails;
