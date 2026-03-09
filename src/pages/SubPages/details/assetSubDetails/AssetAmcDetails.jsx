import React, { useEffect, useState } from "react";
import { domainPrefix, getEditAMCDetails } from "../../../../api";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaRegFileAlt } from "react-icons/fa";
import Navbar from "../../../../components/Navbar";

const AssetAmcDetails = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const { id } = useParams();

  const [amc, setAmc] = useState({});

  useEffect(() => {
    const fetchAssetAmcDetails = async () => {
      try {
        const assetAmcResp = await getEditAMCDetails(id);
        setAmc(assetAmcResp?.data || {});
      } catch (error) {
        console.log("AMC Details Error:", error);
      }
    };

    fetchAssetAmcDetails();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  const isImage = (filePath) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
    const extension = filePath.split(".").pop().split("?")[0].toLowerCase();
    return imageExtensions.includes(extension);
  };

  const getFileName = (filePath) => {
    return decodeURIComponent(filePath.split("/").pop().split("?")[0]);
  };

  return (
    <section className="flex bg-gray-50 min-h-screen">

      {/* Sidebar */}
      <Navbar />

      {/* Page Content */}
      <div className="flex-1 p-6">

        {/* Header */}
        <div
          style={{ background: themeColor }}
          className="text-center text-xl font-bold p-3 rounded-full text-white mb-6"
        >
          AMC Details
        </div>

        {/* Main Card */}
        <div className="max-w mx-auto bg-white shadow-md rounded-lg p-6">

          {/* Asset Title */}
          <div className="flex justify-center mb-6">
            <h1 className="px-10 py-2 border border-gray-300 text-xl rounded-md font-semibold">
              {amc.asset_name || "Asset Name"}
            </h1>
          </div>

          {/* AMC Information */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 bg-gray-100 p-5 rounded-md">

            <div>
              <p className="text-gray-500 text-sm">Vendor</p>
              <p className="font-medium">{amc.vendor_name || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Start Date</p>
              <p className="font-medium">{amc.start_date || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">End Date</p>
              <p className="font-medium">{amc.end_date || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Frequency</p>
              <p className="font-medium">{amc.frequency || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Created On</p>
              <p className="font-medium">{formatDate(amc.created_at)}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Updated On</p>
              <p className="font-medium">{formatDate(amc.updated_at)}</p>
            </div>

          </div>

          {/* Attachments Section */}
          <div className="mt-8">

            <h2 className="text-lg font-semibold border-b pb-2 mb-4">
              Attachments
            </h2>

            <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">

              {amc.attachments && amc.attachments.length > 0 ? (
                amc.attachments.map((doc, index) => {
                  const fileUrl = domainPrefix + doc.document;

                  return (
                    <div
                      key={doc.id}
                      className="border rounded-md p-2 flex flex-col items-center hover:shadow-lg transition"
                    >
                      {isImage(fileUrl) ? (
                        <img
                          src={fileUrl}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-75 object-cover rounded cursor-pointer"
                          onClick={() => window.open(fileUrl, "_blank")}
                        />
                      ) : (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center text-center"
                        >
                          <FaRegFileAlt size={40} className="text-gray-600 mb-2" />
                          <p className="text-xs break-all">
                            {getFileName(doc.document)}
                          </p>
                        </a>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No Attachments Available</p>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AssetAmcDetails;