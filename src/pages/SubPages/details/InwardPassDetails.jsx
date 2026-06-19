import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { useSelector } from "react-redux";
import { domainPrefix, getGoodsDetails } from "../../../api";
import { useParams } from "react-router-dom";
import {
  dateFormat,
  FormattedDateToShowProperly,
  formatTime,
} from "../../../utils/dateUtils";
import { FaRegFileAlt } from "react-icons/fa";

const InwardPassDetails = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [details, setDetails] = useState({});
  const { id } = useParams();
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const detailsRes = await getGoodsDetails(id);
        setDetails(detailsRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, []);
  const isImage = (filePath) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
    const extension = filePath.split(".").pop().split("?")[0].toLowerCase();
    return imageExtensions.includes(extension);
  };
  const getFileName = (filePath) => {
    return filePath.split("/").pop().split("?")[0];
  };
  return (
    <section className="flex">
      <Navbar />
      <div className=" w-full flex mx-3 flex-col overflow-hidden">
        <div
          style={{ background: themeColor }}
          className="flex justify-center bg-black m-2 p-2 rounded-md"
        >
          <h2 className="text-xl font-semibold text-center text-white ">
            Goods Details
          </h2>
        </div>
        <div className="flex flex-col mx-2">
          <div className="grid md:grid-cols-3 w-full bg-gray-50 p-3 rounded-md border border-gray-200 gap-4 my-5">

            <div className="grid grid-cols-2">
              <p className="font-medium">Inward/Outward :</p>
              <p>{details.ward_type}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Person Name :</p>
              <p>{details.person_name || details.visitor_name || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">No. of Goods :</p>
              <p>{details.no_of_goods}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Vehicle No :</p>
              <p>{details.vehicle_no || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Description :</p>
              <p>{details.description || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Mode of Transport :</p>
              <p>{details.mode_of_transport || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Item Type :</p>
              <p>{details.item_type || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Item Category :</p>
              <p>{details.item_category || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Company :</p>
              <p>{details.company_name || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Department :</p>
              <p>{details.department || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Reporting Time :</p>
              <p>{formatTime(details.reporting_time)}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Goods In Time :</p>
              <p>{formatTime(details.goods_in_time)}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Goods Out Time :</p>
              <p>{formatTime(details.goods_out_time)}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Returnable Type :</p>
              <p>{details.returnable_type || "-"}</p>
            </div>

            {details.created_by_name && (
              <div className="grid grid-cols-2">
                <p className="font-medium">Created by :</p>
                <p>{details.created_by_name}</p>
              </div>
            )}

            <div className="grid grid-cols-2">
              <p className="font-medium">Created on :</p>
              <p>{FormattedDateToShowProperly(details.created_at)}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Updated on :</p>
              <p>{FormattedDateToShowProperly(details.updated_at)}</p>
            </div>

          </div>
          {/* <div>
            <p className="font-medium">Description</p>
            <p className="bg-gray-50 p-2 rounded-md">{details.description}</p>
          </div> */}
          <div>
            <div className="mt-5">
              <p className="font-semibold mb-2">Items Details</p>

              {details.goods_items && details.goods_items.length > 0 ? (
                details.goods_items.map((item, index) => (
                  <div key={item.id} className="border p-3 rounded-md mb-3 bg-gray-50">
                    <p><strong>Item Name:</strong> {item.item_name}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Unit:</strong> {item.unit}</p>
                    <p><strong>Description:</strong> {item.description}</p>
                  </div>
                ))
              ) : (
                <p>No Items Available</p>
              )}
            </div>
            <p className="border-b border-black font-semibold my-5">Attachments</p>
            {details.goods_files && details.goods_files.length > 0 ? (
              details.goods_files.map((doc, index) => (
                <div key={doc.id} className="">
                  {isImage(doc.document) ? (
                    <img
                      src={doc.document}
                      alt={`Attachment ${index + 1}`}
                      className="w-40 h-28 object-cover rounded-md"
                      onClick={() => window.open(domainPrefix + doc.document, "_blank")}
                    />
                  ) : (
                    <a
                      href={doc.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" hover:text-blue-400 transition-all duration-300  text-center flex flex-col items-center"
                    >
                      <FaRegFileAlt size={50} />
                      {getFileName(doc.document)}
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center w-full">No Attachments</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InwardPassDetails;
