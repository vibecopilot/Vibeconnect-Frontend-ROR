import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { postTravellingAllowanceRequest, getSetupUsers } from "../../../api";
import FileInputBox from "../../../containers/Inputs/FileInputBox";
import { useSelector } from "react-redux";
import Select from "react-select";
const AddTravellingAllowanceRequest = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const themeColor = useSelector((state) => state.theme.color);
  const [formData, setFormData] = useState({
    employee_name: "",
    employee_id: "",
    expense_category: "",
    date_of_expense: "",
    description_of_expense: "",
    amount_spent: "",
    approval_status: "",
    reimbursement_amount: "",
    reimbursement_method: "",
    manager_approval: false,
    reimbursement_confirmation_email: "",
    mobileNo: "",
    attachments: [],
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleTravelAllowanceRequest = async () => {
    if (!selectedUser || !selectedUser.label) {
      toast("Employee Name is required.");
      return;
    }
    if (!formData.mobileNo || !/^\d{10}$/.test(formData.mobileNo)) {
      toast("Valid Mobile Number is required.");
      return;
    }
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.reimbursement_confirmation_email
      )
    ) {
      toast("Please enter a valid email address");
      return;
    }
    if (!formData.expense_category) {
      toast("Expense Category is required.");
      return;
    }
    if (!formData.date_of_expense) {
      toast("Date Of Expense is required.");
      return;
    }
    if (!formData.amount_spent) {
      toast("Amount Spent is required.");
      return;
    }
    if (!formData.reimbursement_amount) {
      toast("Reimbursement Amount is required.");
      return;
    }
    if (!formData.reimbursement_method) {
      toast("Reimbursement Method is required.");
      return;
    }
    const sendData = new FormData();
    // sendData.append("transportation_allowance_request[employee_id]", formData.employee_id);
    // sendData.append("transportation_allowance_request[employee_name]", formData.employee_name);
    sendData.append(
      "transportation_allowance_request[employee_name]",
      selectedUser.label
    );
    sendData.append(
      "transportation_allowance_request[expense_category]",
      formData.expense_category
    );
    sendData.append(
      "transportation_allowance_request[date_of_expense]",
      formData.date_of_expense
    );
    sendData.append(
      "transportation_allowance_request[description_of_expense]",
      formData.description_of_expense
    );
    sendData.append(
      "transportation_allowance_request[amount_spent]",
      formData.amount_spent
    );
    sendData.append(
      "transportation_allowance_request[approval_status]",
      "pending"
    );
    sendData.append(
      "transportation_allowance_request[reimbursement_amount]",
      formData.reimbursement_amount
    );
    sendData.append(
      "transportation_allowance_request[reimbursement_method]",
      formData.reimbursement_method
    );
    sendData.append(
      "transportation_allowance_request[manager_approval]",
      formData.manager_approval
    );
    sendData.append(
      "transportation_allowance_request[reimbursement_confirmation_email]",
      formData.reimbursement_confirmation_email
    );
    sendData.append(
      "transportation_allowance_request[mobile_no]",
      formData.mobileNo
    );
    formData.attachments.forEach((file, index) => {
      sendData.append(`attachments[]`, file);
    });

    try {
      const TravelAllowancereqResp = await postTravellingAllowanceRequest(
        sendData
      );
      toast.success("Travelling Allowance Request Added");
      navigate("/admin/booking-request/traveling-allowance-request");
      console.log(
        "Travelling Allowance request Response",
        TravelAllowancereqResp
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption); // Update selected user state
    console.log("Selected user:", selectedOption);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const setupUsers = await getSetupUsers(); // API call to fetch users
        const formattedOptions = setupUsers.data.map((user) => ({
          value: user.id,
          label: user.firstname,
        }));
        setUsers(formattedOptions);
        console.log(formattedOptions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  const handleFileChange = (files, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: files,
    });
    console.log(fieldName);
  };

  return (
    <div className="flex justify-center items-center my-5 w-full p-4">
      <div className="border border-gray-300 rounded-lg p-4 w-full mx-4  ">
        <h2
          className="text-center md:text-xl font-bold p-2  rounded-full text-white"
          style={{ background: themeColor }}
        >
          Travel Allowance Request
        </h2>
        <div className="grid md:grid-cols-3 gap-5 mt-5">
          {/* <div className="grid gap-2 items-center w-full">
          <label htmlFor="employeeId" className="font-semibold">
            Employee ID:
          </label>
          <input
            type="number"
            id="employeeId"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
             className="border p-1 px-4 border-gray-500 rounded-md"
            placeholder="Enter Employee ID"
          />
        </div>

        <div className="grid gap-2 items-center w-full">
          <label htmlFor="employeeName" className="font-semibold">
            Employee Name:
          </label>
          <input
            type="text"
            name="employee_name"
            value={formData.employee_name}
            onChange={handleChange}
            id="employeeName"
             className="border p-1 px-4 border-gray-500 rounded-md"
            placeholder="Enter Employee Name"
          />
        </div> */}
          <div className="grid gap-2 items-center w-full">
            <label className="font-medium">Employee Name:</label>
            <Select
              name="user"
              options={users}
              className="basic-single-select pr-5 text-black"
              classNamePrefix="select"
              placeholder="Select a Employee..."
              value={selectedUser} // Set the value from state
              onChange={handleUserChange} // Update selected value on change
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label
              htmlFor="reimbursementConfirmationEmail"
              className="font-semibold"
            >
              Mobile Number:
            </label>
            <input
              type="number"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              id="reimbursementConfirmationEmail"
              className="border p-1 px-4 border-gray-500 rounded-md"
              placeholder="Enter Mobile Number"
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label
              htmlFor="reimbursementConfirmationEmail"
              className="font-semibold"
            >
              Email:
            </label>
            <input
              type="email"
              name="reimbursement_confirmation_email"
              value={formData.reimbursement_confirmation_email}
              onChange={handleChange}
              id="reimbursementConfirmationEmail"
              className="border p-1 px-4 border-gray-500 rounded-md"
              placeholder="Enter Email"
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="expenseCategory" className="font-semibold">
              Expense Category:
            </label>
            <select
              id="expenseCategory"
              name="expense_category"
              value={formData.expense_category}
              onChange={handleChange}
              className="border p-1 px-4 border-gray-500 rounded-md"
            >
              <option value="">Select Expense Category:</option>
              <option value="meals">Meals</option>
              <option value="transportation">Transportation</option>
              <option value="accommodation">Accommodation</option>
              <option value="miscellaneous">Miscellaneous</option>
            </select>
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="dateOfExpense" className="font-semibold">
              Date of Expense:
            </label>
            <input
              type="date"
              name="date_of_expense"
              value={formData.date_of_expense}
              onChange={handleChange}
              id="dateOfExpense"
              className="border p-1 px-4 border-gray-500 rounded-md"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="amountSpent" className="font-semibold">
              Amount Spent:
            </label>
            <input
              type="number"
              id="amountSpent"
              name="amount_spent"
              value={formData.amount_spent}
              onChange={handleChange}
              className="border p-1 px-4 border-gray-500 rounded-md"
              placeholder="Enter Amount Spent"
            />
          </div>

          {/* <div className="grid gap-2 items-center w-full">
          <label htmlFor="approvalStatus" className="font-semibold">
            Approval Status:
          </label>
          <select id="approvalStatus" 
          name="approval_status"
          value={formData.approval_status}
          onChange={handleChange}
          className="border p-1 px-4 border-gray-500 rounded-md">
            <option value="">Select Approval Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>
        </div> */}

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="reimbursementAmount" className="font-semibold">
              Reimbursement Amount:
            </label>
            <input
              type="number"
              name="reimbursement_amount"
              value={formData.reimbursement_amount}
              onChange={handleChange}
              id="reimbursementAmount"
              className="border p-1 px-4 border-gray-500 rounded-md"
              placeholder="Enter Reimbursement Amount"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="reimbursementMethod" className="font-semibold">
              Reimbursement Method:
            </label>
            <select
              id="reimbursementMethod"
              name="reimbursement_method"
              value={formData.reimbursement_method}
              onChange={handleChange}
              className="border p-1 px-4 border-gray-500 rounded-md"
            >
              <option value="">Select Reimbursement Method</option>
              <option value="Direct Deposit">Direct Deposit</option>
              <option value="Check">Check</option>
            </select>
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="managerApproval" className="font-semibold">
              Manager Approval (If Required):
            </label>
            <select
              id="managerApproval"
              name="manager_approval"
              value={formData.manager_approval}
              onChange={handleChange}
              className="border p-1 px-4 border-gray-500 rounded-md"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <div className="grid gap-2 items-center w-full my-4">
          <label htmlFor="descriptionOfExpense" className="font-semibold">
            Description of Expense:
          </label>
          <textarea
            id="descriptionOfExpense"
            name="description_of_expense"
            value={formData.description_of_expense}
            onChange={handleChange}
            cols="25"
            rows="3"
            className="border p-1 px-4 border-gray-500 rounded-md"
            placeholder="Enter Description of Expense"
          ></textarea>
        </div>
        <div className="grid gap-2 items-center w-full">
          <label htmlFor="supportingDocuments" className="font-semibold">
            Supporting Documents:
          </label>
          <FileInputBox
            handleChange={(files) => handleFileChange(files, "attachments")}
            fieldName={"attachments"}
            isMulti={true}
          />
        </div>
        <div className="flex gap-5 justify-center items-center my-4">
          <button
            onClick={handleTravelAllowanceRequest}
            className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTravellingAllowanceRequest;
