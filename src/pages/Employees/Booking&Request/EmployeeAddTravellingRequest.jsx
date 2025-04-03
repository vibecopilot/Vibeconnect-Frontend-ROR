import React, { useState } from "react";
import { postTravellingAllowanceRequest } from "../../../api";
import { useNavigate } from "react-router-dom";
import FileInputBox from "../../../containers/Inputs/FileInputBox";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
const EmployeeAddTravellingAllowanceRequest = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [formData, setFormData] = useState({
    expense_category: "",
    date_of_expense: "",
    description_of_expense: "",
    amount_spent: "",
    reimbursement_amount: "",
    reimbursement_method: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleTravelAllowanceRequest = async () => {
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
    sendData.append(
      "transportation_allowance_request[expense_category]",
      formData.expense_category
    );
    sendData.append(
      "transportation_allowance_request[approval_status]",
      "pending"
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
      "transportation_allowance_request[reimbursement_amount]",
      formData.reimbursement_amount
    );
    sendData.append(
      "transportation_allowance_request[reimbursement_method]",
      formData.reimbursement_method
    );

    try {
      const TravelAllowancereqResp = await postTravellingAllowanceRequest(
        sendData
      );
      toast.success("Travelling Allowance Request Added");
      navigate("/employee/booking-request/traveling-allowance-request");
      console.log(
        "Travelling Allowance request Response",
        TravelAllowancereqResp
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center items-center my-5 w-full p-4">
      <div className="border border-gray-300 rounded-lg p-4 w-full mx-4 max-h-screen overflow-y-auto">
        <h2
          className="text-center md:text-xl font-bold p-2 bg-black rounded-full text-white"
          style={{ background: themeColor }}
        >
          Travel Allowance Request
        </h2>
        <div className="grid md:grid-cols-3 gap-5 mt-5">
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="expenseCategory" className="font-semibold">
              Expense Category:
            </label>
            <select
              id="expenseCategory"
              className="border border-gray-400 p-2 rounded-md"
              name="expense_category"
              value={formData.expense_category}
              onChange={handleChange}
            >
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
              className="border border-gray-400 p-2 rounded-md"
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
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Amount Spent"
            />
          </div>

          {/* <div className="grid gap-2 items-center w-full">
            <label htmlFor="supportingDocuments" className="font-semibold">
              Supporting Documents:
            </label>
            <input
              type="file"
              id="supportingDocuments"
              className="border border-gray-400 p-2 rounded-md"
            />
          </div> */}

          {/* <div className="grid gap-2 items-center w-full">
            <label htmlFor="approvalStatus" className="font-semibold">
              Approval Status:
            </label>
            <select
              id="approvalStatus"
              className="border border-gray-400 p-2 rounded-md"
            >
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
              id="reimbursementAmount"
              name="reimbursement_amount"
              value={formData.reimbursement_amount}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded-md"
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
              className="border border-gray-400 p-2 rounded-md"
            >
              <option value="directDeposit">Direct Deposit</option>
              <option value="check">Check</option>
            </select>
          </div>

          {/* <div className="grid gap-2 items-center w-full">
            <label htmlFor="managerApproval" className="font-semibold">
              Manager Approval:
            </label>
            <select
              id="managerApproval"
              className="border border-gray-400 p-2 rounded-md"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div> */}

          {/* <div className="grid gap-2 items-center w-full">
            <label
              htmlFor="reimbursementConfirmationEmail"
              className="font-semibold"
            >
              Reimbursement Confirmation Email:
            </label>
            <input
              type="email"
              id="reimbursementConfirmationEmail"
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Reimbursement Confirmation Email"
            />
          </div> */}
        </div>
        <div className="grid gap-2 items-center w-full my-5">
          <label htmlFor="" className="font-semibold">
            Description of Expense:
          </label>
          <textarea
            id=""
            name="description_of_expense"
            value={formData.description_of_expense}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded-md"
            placeholder="Enter Description of Expense"
          ></textarea>
        </div>
        <div className="grid gap-2 items-center w-full">
          <label htmlFor="supportingDocuments" className="font-semibold">
            Supporting Documents:
          </label>
          <FileInputBox />
        </div>
        <div className="flex gap-5 justify-center items-center my-4">
          <button
            onClick={handleTravelAllowanceRequest}
            type="submit"
            className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default EmployeeAddTravellingAllowanceRequest;
