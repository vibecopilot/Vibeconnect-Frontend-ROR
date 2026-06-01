import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { FaRegFileAlt } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { MdOpenInNew } from "react-icons/md";

import Navbar from "../../components/Navbar";
import { domainPrefix, getFitoutRequest } from "../../api";

const RequestDetails = () => {
  const { id } = useParams();

  const [requestDetails, setRequestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);

  const themeColor = useSelector((state) => state.theme.color);
  const openPreview = (docUrl) => {
    const fullUrl = docUrl.startsWith("http")
      ? docUrl
      : `${domainPrefix}${docUrl}`;

    setPreviewUrl(fullUrl);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      setLoading(true);

      const response = await getFitoutRequest(1, 100);

      const requests = response?.data?.fitout_requests || [];

      const selectedRequest = requests.find(
        (item) => item.id === parseInt(id)
      );

      setRequestDetails(selectedRequest);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const isImage = (filePath) => {
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "svg",
      "webp",
    ];

    const extension = filePath
      .split(".")
      .pop()
      .split("?")[0]
      .toLowerCase();

    return imageExtensions.includes(extension);
  };

  const getFileName = (filePath) => {
    return filePath.split("/").pop().split("?")[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "NA";

    const date = new Date(dateString);

    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-5 text-center text-lg">
        Loading Details...
      </div>
    );
  }

  if (!requestDetails) {
    return (
      <div className="p-5 text-center text-red-500 text-lg">
        Request Details Not Found
      </div>
    );
  }

  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <h1
          style={{ background: themeColor }}
          className="text-center p-2 my-2 text-white rounded-md font-medium"
        >
          Fitout Request Details
        </h1>

        <div className="m-2 flex justify-end">
          <Link
            className="border-2 border-black rounded-md font-medium p-1 flex gap-2 items-center px-4"
            to={`/fitout/request/edit/${id}`}
          >
            <BiEdit />
            Edit
          </Link>
        </div>

        <div className="grid md:m-2 md:p-4 p-2 bg-gray-50 rounded-md gap-5">
          <div className="grid lg:grid-cols-3 rounded-md gap-5">
            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Request ID :</p>
              <p>{requestDetails?.id || "NA"}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Status :</p>
              <p className="capitalize">
                {requestDetails?.status || "NA"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Building :</p>
              <p>{requestDetails?.building?.name || "NA"}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Floor :</p>
              <p>{requestDetails?.floor?.name || "NA"}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Unit :</p>
              <p>{requestDetails?.unit?.name || "NA"}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Selected Date :</p>
              <p>
                {requestDetails?.selected_date
                  ? new Date(
                    requestDetails.selected_date
                  ).toLocaleDateString()
                  : "NA"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">User Name :</p>
              <p>
                {requestDetails?.user
                  ? `${requestDetails.user.firstname} ${requestDetails.user.lastname}`
                  : "NA"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">User Email :</p>
              <p>{requestDetails?.user?.email || "NA"}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Vendor Name :</p>
              <p>
                {requestDetails?.supplier?.vendor_name || "NA"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Company Name :</p>
              <p>
                {requestDetails?.supplier?.company_name || "NA"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Vendor Mobile :</p>
              <p>{requestDetails?.supplier?.mobile || "NA"}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Vendor Email :</p>
              <p>{requestDetails?.supplier?.email || "NA"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Created On :</p>
              <p className="text-sm">
                {formatDate(requestDetails?.created_at)}
              </p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Updated On :</p>
              <p className="text-sm">
                {formatDate(requestDetails?.updated_at)}
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="font-medium">Description :</p>

            <p className="bg-gray-200 p-2 rounded-md">
              {requestDetails?.description || "NA"}
            </p>
          </div>

          {/* Documents */}

          <div className="flex flex-col">
            <p className="font-medium">Documents :</p>

            <div className="flex gap-4 flex-wrap my-4 items-center text-center">
              {requestDetails?.fitout_request_categories &&
                requestDetails.fitout_request_categories.length > 0 ? (
                requestDetails.fitout_request_categories.map(
                  (item, index) => {
                    const fileUrl = `${domainPrefix}${item?.attachfile?.document_url}`;

                    return (
                      <div key={index}>
                        {item?.attachfile?.document_url ? (
                          <>
                            {isImage(fileUrl) ? (
                              <img
                                src={fileUrl}
                                alt={`Attachment ${index + 1}`}
                                className="w-40 h-28 object-cover rounded-md cursor-pointer"
                                onClick={() =>
                                  openPreview(item.attachfile.document_url)
                                }
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <div className="flex flex-col items-center gap-2">
                                  <FaRegFileAlt size={50} />

                                  <span className="text-sm">
                                    {getFileName(item.attachfile.document_url)}
                                  </span>

                                  {/* <button
                                    onClick={() =>
                                      openPreview(item.attachfile.document_url)
                                    }
                                    className="flex items-center gap-1 text-blue-600 underline"
                                  >
                                    <BsEye />
                                    View
                                  </button> */}
                                </div>

                                {/* <button
                                  onClick={() =>
                                    window.open(
                                      fileUrl,
                                      "_blank",
                                      "noopener,noreferrer"
                                    )
                                  }
                                  className="flex items-center gap-1 text-blue-600 underline"
                                >
                                  <BsEye />
                                  View
                                </button> */}
                              </div>
                            )}
                          </>
                        ) : (
                          <p>No File</p>
                        )}
                      </div>
                    );
                  }
                )
              ) : (
                <p className="text-center w-full">
                  No Documents Found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestDetails;