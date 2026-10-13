import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { domainPrefix, getPantryDetails } from "../api";

const PantryDetails = () => {
    const { id } = useParams();
    const [pantryData, setPantryData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPantry = async () => {
            try {
                const invResp = await getPantryDetails(id);

                if (invResp?.data) {
                    setPantryData(invResp.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPantry();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-80">
                <p className="text-lg font-medium">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <div className="border rounded-lg border-gray-300 shadow-md w-full mx-10 my-6 p-6 bg-white">

                {/* Top Button */}
                <div className="flex justify-end mb-5">
                    <button className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-md text-white font-medium">
                        Order
                    </button>
                </div>

                {/* Header */}
                <div className="border-b pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Pantry Item Details
                    </h2>
                </div>

                {/* Basic Details */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">

                    <div>
                        <p className="font-semibold text-gray-700">Item Name</p>
                        <p className="mt-1">{pantryData.item_name || "-"}</p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-700">Available Stock</p>
                        <p className="mt-1">{pantryData.stock || 0}</p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-700">Status</p>

                        <span
                            className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium
      ${pantryData.status === true
                                    ? "bg-green-100 text-green-700"
                                    : pantryData.status === false
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {pantryData.status === true
                                ? "Approved"
                                : pantryData.status === false
                                    ? "Rejected"
                                    : "Pending"}
                        </span>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-700">Created By</p>
                        <p className="mt-1">
                            {pantryData.ordered_by_name
                                ? `${pantryData.ordered_by_name.firstname} ${pantryData.ordered_by_name.lastname}`
                                : "-"}
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-700">Created At</p>
                        <p className="mt-1">
                            {pantryData.created_at
                                ? new Date(pantryData.created_at).toLocaleString()
                                : "-"}
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-700">Updated At</p>
                        <p className="mt-1">
                            {pantryData.updated_at
                                ? new Date(pantryData.updated_at).toLocaleString()
                                : "-"}
                        </p>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <p className="font-semibold text-gray-700 mb-2">Description</p>
                    <div className="bg-gray-100 rounded-md p-4">
                        {pantryData.description || "No description available"}
                    </div>
                </div>

                {/* Attachments */}
                <div>
                    <p className="font-semibold text-gray-700 mb-3">Attachments</p>

                    <div className="flex flex-wrap gap-5">
                        {pantryData?.pantries_attachments?.length > 0 ? (
                            pantryData.pantries_attachments.map((attachment, index) => {
                                const imageUrl = attachment?.document?.startsWith("http")
                                    ? attachment.document
                                    : `${domainPrefix}${attachment.document}`;

                                return (
                                    <div
                                        key={attachment.id || index}
                                        className="border rounded-md p-2 shadow-sm cursor-pointer hover:shadow-md"
                                        onClick={() => window.open(imageUrl, "_blank")}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`Attachment ${index + 1}`}
                                            className="w-52 h-36 object-cover rounded-md"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://via.placeholder.com/250x150?text=Image+Not+Found";
                                            }}
                                        />

                                        <p className="mt-2 text-sm text-center font-medium">
                                            Attachment {index + 1}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No Attachments Available</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PantryDetails;