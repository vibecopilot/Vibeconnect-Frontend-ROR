import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {recallStatus} from "../../api"
import { useParams } from "react-router-dom";
const RecallInvoiceModal = ({ onclose }) => {
  const themeColor = useSelector((state) => state.theme.color);
  const {id} = useParams();
  const [reason, setReason] = useState("");
  const handleSubmit = async() =>{
    const sendData = new FormData();
    sendData.append("cam_bill[recall]", reason);

    try {
      const resp = await recallStatus(id, sendData);
      console.log(resp)
      toast.success("status recall change");
    } catch (error) {
      console.error("Error: Recall did not change");
      toast.error("failed to change recall status")

    }
  }
  return (
    <ModalWrapper onclose={onclose}>
      <div className="flex flex-col w-80 justify-center">
        <h2 className="flex gap-4 items-center justify-center font-bold text-lg my-2">
          Recall Invoice
        </h2>
        <div className="border-t-2 border-black">
          <div className="md:grid grid-cols-2 gap-5 my-3">
            <div className="flex flex-col col-span-2">
              <label htmlFor="" className="font-semibold my-2">
                Reason
              </label>
              <textarea
                name="reason"
                id=""
                cols="5"
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter Reason"
                className="border p-1 px-4 border-gray-500 rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t-2 py-5 border-black">
          <button onClick={handleSubmit}
            className="p-1 px-4 border-2 rounded-md text-white font-medium"
            style={{ background: themeColor }}
          >
            Submit
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default RecallInvoiceModal;
