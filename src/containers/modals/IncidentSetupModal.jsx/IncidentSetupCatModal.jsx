import React, { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { BiEditAlt } from "react-icons/bi";
import { editIncidentCatDetails, getIncidentCatDetails } from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import toast from "react-hot-toast";

const IncidentSetCategoryModal = ({ onclose, catId, fetchIncidentCategory }) => {
  const [cat, setCat] = useState("");
  const companyId = getItemInLocalStorage("COMPANYID");
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const res = await getIncidentCatDetails(catId);
        // setDetails(res);
        setCat(res.data.name);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryDetails();
  }, []);
  const handleEditCategory = async () => {
    const payload = {
      name: cat,
      active: true,
      // "parent_id": null,
      tag_type: "incidentCategory",
      resource_id: companyId,
      resource_type: "Pms::CompanySetup",
      // "comment": "Covers all types of plumbing problems."
    };
    try {
      const res = await editIncidentCatDetails(catId, payload);
      toast.success("Incident Category Updated successfully!");
      onclose()
      fetchIncidentCategory();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
      <div className="bg-white overflow-auto max-h-[70%] md:w-auto w-96 p-4 px-8 flex flex-col rounded-xl gap-5">
        <div className="flex flex-col w-64 justify-center">
          <h2 className="flex gap-2 items-center justify-center font-bold text-lg ">
            <BiEditAlt /> Edit Incident Category
          </h2>
          <div className="border-t-2 border-black">
            <div className="flex flex-col my-2 gap-2">
              <label htmlFor="" className="font-medium">
                Category
              </label>
              <input
                type="text"
                name=""
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                id=""
                placeholder="Category"
                className="border p-2 border-gray-500 rounded-md w-full"
              ></input>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-2">
            <button
              className="bg-red-500 flex items-center gap-2 text-white rounded-md p-2 px-4 "
              onClick={onclose}
            >
              <MdClose /> Cancel
            </button>
            <button className="bg-green-500 flex items-center gap-2 text-white rounded-md px-4 p-2 " onClick={handleEditCategory}>
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentSetCategoryModal;
