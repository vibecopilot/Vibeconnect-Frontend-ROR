import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaRegFileAlt } from "react-icons/fa";
import AdminHRMS from "../AdminHrms/AdminHrms";

const BroadcastHrmsDetails = () => {
    const [broadcastDetails, setBroadcastDetails] = useState({
        notice_title: "Office Holiday Announcement",
        notice_discription: "The office will remain closed on Monday for the annual maintenance work. All employees are requested to plan their work accordingly.",
        created_at: "2023-05-15T10:30:00Z",
        expiry_date: "2023-05-17T18:00:00Z",
        important: true,
        notice_image: [
            {
                document: "https://example.com/path/to/document.pdf",   
                original_filename: "holiday_schedule.pdf"
            }
        ],
        created_by: "HR Department",
        status: "Active",
        share_with: "All Employees"
    });

    const dateFormat = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const themeColor = useSelector((state) => state.theme.color) || "#000000";

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
            {/* Sidebar */}
            <div className="hidden md:block">
                <AdminHRMS />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="m-2">
                    <h2
                        style={{ background: themeColor }}
                        className="text-center text-xl font-semibold p-2 rounded-full text-white px-10 py-4 mx-20"
                    >
                        Broadcast Details
                    </h2>
                    <div className="my-2 mb-10 md:border-2 p-2 rounded-md border-gray-400 md:mx-20">
                        <div className="flex justify-center m-5">
                            <h1
                                style={{ background: themeColor }}
                                className="p-2 px-4 text-xl text-white rounded-md font-semibold"
                            >
                                {broadcastDetails.notice_title}
                            </h1>
                        </div>
                        <div className="flex flex-col bg-gray-100 p-2 rounded-md">
                            <p className="font-medium">Description:</p>
                            <p className="p-2">{broadcastDetails.notice_discription}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 my-4">
                            <div className="grid grid-cols-2">
                                <p className="font-medium">Created By:</p>
                                <p className="p-2">{broadcastDetails.created_by}</p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p className="font-medium">Status Type:</p>
                                <p className="p-2">{broadcastDetails.status}</p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p className="font-medium">Share With:</p>
                                <p className="p-2">{broadcastDetails.share_with}</p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p className="font-medium">Created On:</p>
                                <p className="p-2">{dateFormat(broadcastDetails.created_at)}</p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p className="font-medium">End Date & Time:</p>
                                <p className="p-2">{dateFormat(broadcastDetails.expiry_date)}</p>
                            </div>
                            <div className="grid grid-cols-2">
                                <p className="font-medium">Important:</p>
                                <p className="p-2">
                                    {broadcastDetails.important ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>
                        <div className="my-2">
                            <p className="font-bold border-b-2 border-black my-2">Attachments</p>
                            {broadcastDetails.notice_image && broadcastDetails.notice_image.length > 0 && (
                                <div className="rounded-md">
                                    {isImage(broadcastDetails.notice_image[0].document) ? (
                                        <img
                                            src={broadcastDetails.notice_image[0].document}
                                            alt="Broadcast attachment"
                                            className="rounded-md max-h-52"
                                            onClick={() => window.open(broadcastDetails.notice_image[0].document, "_blank")}
                                        />
                                    ) : (
                                        <a
                                            href={broadcastDetails.notice_image[0].document}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-400 transition-all duration-300 text-center flex flex-col items-center"
                                        >
                                            <FaRegFileAlt size={50} />
                                            {broadcastDetails.notice_image[0].original_filename || 
                                            getFileName(broadcastDetails.notice_image[0].document)}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="my-5">
                            <p className="font-bold">Shared Members List</p>
                            <div className="border-dashed border border-gray-400 p-2">
                                <ul className="list-disc pl-5">
                                    <li>John Doe (john@example.com)</li>
                                    <li>Jane Smith (jane@example.com)</li>
                                    <li>Robert Johnson (robert@example.com)</li>
                                    <li>All Marketing Team members</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BroadcastHrmsDetails;