import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  domainPrefix,
  getTravellingAllowanceRequestDetails,
} from "../../../api";

const EmployeeTravelingAllowanceDetails = () => {
  const { id } = useParams();
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
    mobile: "",
    reimbursement_confirmation_email: "",
    attachments: [],
  });
  useEffect(() => {
    const fetchTravelAllowanceDetails = async () => {
      try {
        const HotelreqDetailsResponse =
          await getTravellingAllowanceRequestDetails(id);
        const data = HotelreqDetailsResponse.data;
        console.log(data);
        setFormData({
          ...formData,

          employee_id: data.employee_id,
          employee_name: data.employee_name,
          expense_category: data.expense_category,
          date_of_expense: data.date_of_expense,
          description_of_expense: data.description_of_expense,
          amount_spent: data.amount_spent,
          approval_status: data.approval_status,
          reimbursement_amount: data.reimbursement_amount,
          reimbursement_method: data.reimbursement_method,
          manager_approval: data.manager_approval,
          reimbursement_confirmation_email:
            data.reimbursement_confirmation_email,
          mobile: data.mobile_no,
          attachments: data.attachments || [],
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchTravelAllowanceDetails();
  }, []);
  console.log(formData.attachments.image_url);
  return (
    <div className="flex justify-center items-center my-5 w-full p-4">
      <div className="border border-gray-300 rounded-lg p-4 w-full mx-4 max-h-screen overflow-y-auto">
        <h2
          className="text-center md:text-xl font-bold p-2 bg-black rounded-md text-white"
          style={{ background: themeColor }}
        >
          Traveling Allowance Details
        </h2>
        <div className="grid md:grid-cols-3 gap-5 mt-5">
          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Expense Category:</label>
            <p>{formData.expense_category}</p>
          </div>

          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Date of Expense:</label>
            <p>{formData.date_of_expense}</p>
          </div>
          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Amount Spent:</label>
            <p>{formData.amount_spent}</p>
          </div>
          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Reimbursement Amount:</label>
            <p>{formData.reimbursement_amount}</p>
          </div>
          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Reimbursement Method:</label>
            <p>{formData.reimbursement_method}</p>
          </div>
          <div className="flex gap-2 flex-col w-full col-span-3">
            <label className="font-semibold whitespace-nowrap">
              Description of Expense:
            </label>
            <p className="">{formData.description_of_expense}</p>
          </div>
          <div className="flex flex-col gap-2 items-start w-full">
            <label className="font-semibold ">Supporting Documents:</label>
            {formData.attachments?.length > 0 ? (
              formData.attachments.map((attachment, index) => (
                <img
                  key={index}
                  src={domainPrefix + attachment.image_url || ""}
                  alt={`Supporting Document ${index + 1}`}
                  className="w-60 h-42 object-cover rounded-lg border border-gray-300"
                />
              ))
            ) : (
              <p>No Documents Available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTravelingAllowanceDetails;
