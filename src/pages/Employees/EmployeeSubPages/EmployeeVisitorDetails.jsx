import React, { useEffect, useState } from "react";
// import Detail from "../../../containers/Detail";
import image from "/profile.png";
import { domainPrefix, getVisitorDetails, postVisitorCheckInCheckOut } from "../../../api";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Table from "../../../components/table/Table";
import { BiEdit, BiQr } from "react-icons/bi";
import VisitorQRCode from "../../../containers/modals/VisitorQRCode";
import {
  FaPersonWalkingArrowLoopLeft,
  FaPersonWalkingArrowRight,
} from "react-icons/fa6";
import { getItemInLocalStorage } from "../../../utils/localStorage";
const EmployeeVisitorDetails = () => {
  const [details, setDetails] = useState({});
  const { id } = useParams();
  useEffect(() => {
    const fetchVisitorDetails = async () => {
      try {
        const detailsResp = await getVisitorDetails(id);
        setDetails(detailsResp.data);
        console.log(detailsResp.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVisitorDetails();
  }, [id]);

  const themeColor = useSelector((state) => state.theme.color);
  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };
  const dateTimeFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const VisitorColumns = [
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <div className="flex items-center gap-4">
    //       <Link to={`/admin/passes/visitors/visitor-details/${row.id}`}>
    //         <BsEye size={15} />
    //       </Link>
    //       <Link to={`/edit/${row.id}`}>
    //         <BiEdit size={15} />
    //       </Link>
    //     </div>
    //   ),
    // },
    {
      name: " Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: " Mobile No.",
      selector: (row) => row.contact_no,
      sortable: true,
    },
  ];

  const [qrModal, setQrmodal] = useState(false);
  const handleCheckIn = async () => {
    const currentDateTime = getLocalDateTime()
    // const postData = new FormData();
    // postData.append("visitor_visit[check_in]", currentDateTime);
    // postData.append("visitor_visit[visitor_id]", id);
    const payload = {
      visitor_id: id,
      // visitor_visit: {
        check_in: currentDateTime,
      // },
    };
    try {
      const res = await postVisitorCheckInCheckOut(id, payload);
    } catch (error) {
      console.log(error);
    }
  };
  const getLocalDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };
  const handleCheckOut = async () => {
    const currentDateTime = getLocalDateTime()
    // const postData = new FormData();
    // postData.append("visitor_visit[check_out]", currentDateTime);
    // postData.append("visitor_visit[visitor_id]", id);
    const payload = {
      visitor_id: id,
      // visitor_visit: {
        check_out: currentDateTime,
      // },
    };
    try {
      const res = await postVisitorCheckInCheckOut(id, payload);
    } catch (error) {
      console.log(error);
    }
  };
  const userType = getItemInLocalStorage("USERTYPE");
  return (
    <div className="w-screen">
      <div className="flex flex-col gap-2">
        <div className="flex justify-end mx-4 gap-2 mt-1">
         {userType === "security_guard" && <>
          {details?.verified && (
            <button
            className="bg-green-400 text-white p-2 px-4 rounded-full font-medium flex items-center gap-2"
            onClick={handleCheckIn}
            >
              <FaPersonWalkingArrowRight size={20} /> IN
            </button>
          )}
          {details?.verified && (
            <button
              className="bg-red-400 text-white p-2 px-4 rounded-full font-medium flex items-center gap-2"
              onClick={handleCheckOut}
              >
              <FaPersonWalkingArrowLoopLeft size={20} /> Out
            </button>
          )}
          </>}
          <button
            onClick={() => setQrmodal(true)}
            className="border-2 border-black rounded-full px-2 p-1 flex items-center gap-2"
          >
            <BiQr /> QR code
          </button>
        </div>
        <h2
          style={{
            background: themeColor,
          }}
          className="text-center w-full text-white font-semibold text-lg p-2 px-4 "
        >
          Visitor Details
        </h2>
        <div className="flex justify-center">
          {details.profile_picture && details.profile_picture !== null ? (
            // details.visitor_files.map((doc, index) => (
            <img
              src={domainPrefix + details.profile_picture.url}
              alt=""
              className="w-48 h-48 rounded-full cursor-pointer"
              onClick={() =>
                window.open(
                  domainPrefix + details.profile_picture.url,
                  "_blank"
                )
              }
            />
          ) : (
            // ))
            <img src={image} alt="" className="w-48 h-48" />
          )}
        </div>
        <div className="md:grid  px-4 flex flex-col grid-cols-3 gap-5 gap-x-4">
          {/* <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Site Name : </p>
            <p className="">{details.site_name}</p>
          </div> */}
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Visitor Type : </p>
            <p className="">{details.visit_type}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Visitor's Name : </p>
            <p className="">{details.name}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Mobile No. : </p>
            <p className="">{details.contact_no}</p>
          </div>
          {/* <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">OTP : </p>
            <p className="">{details.otp}</p>
          </div> */}
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Purpose : </p>
            <p className="">{details.purpose}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Coming From : </p>
            <p className="">{details.coming_from}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Vehicle No. : </p>
            <p className="">{details.vehicle_number}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Expected Date : </p>
            <p className="">{details.expected_date}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Expected Time : </p>
            <p className="">{details.expected_time}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Goods Inward : </p>
            <p className="">{details.goods_inwards ? "Yes" : "No"}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Host Approval Needed ? : </p>
            <p className="">{details.skip_host_approval ? "No" : "Yes"}</p>
          </div>

          {details.frequency === "Frequently" && (
            <div className="grid grid-cols-2 ">
              <p className="font-semibold text-sm">Pass Start Date : </p>
              <p className="">
                {details.start_pass ? dateFormat(details.start_pass) : "-"}
              </p>
            </div>
          )}
          {details.frequency === "Frequently" && (
            <div className="grid grid-cols-2 ">
              <p className="font-semibold text-sm">Pass End Date : </p>
              <p className="">
                {details.end_pass ? dateFormat(details.end_pass) : "-"}
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Check In : </p>
            <p className="">
              {details.check_in ? dateTimeFormat(details.check_in) : "-"}
            </p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Check Out : </p>
            <p className="">
              {details.check_out ? dateFormat(details.check_out) : "-"}
            </p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Host : </p>
            {details?.hosts?.map((host) => (
              <p>{host?.full_name}</p>
            ))}
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Created By : </p>
            {details.created_by_name && (
              <p className="">
                {details.created_by_name.firstname}{" "}
                {details.created_by_name.lastname}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Created On : </p>
            <p className="">{dateFormat(details.created_at)}</p>
          </div>
          {details.frequency === "Frequently" && (
            <div className="grid grid-cols-2 ">
              <p className="font-semibold text-sm">Permitted Days : </p>
              <p className="">{details.working_days.join(", ")}</p>
            </div>
          )}
        </div>
        {details?.goods_inwards && (
          <div className="w-full">
            <h2 className="font-medium border-b-2 text-lg border-black px-4 ">
              Goods Info
            </h2>
            <div className="border rounded-xl border-gray-300 m-2 p-2">
              <div className=" grid grid-cols-2">
                <div className="grid grid-cols-2 items-center">
                  <p className="font-medium">No. of goods :</p>
                  <p>{details?.goods_in_out?.no_of_goods}</p>
                </div>
                <div className="grid grid-cols-2 items-center">
                  <p className="font-medium">Description :</p>
                  <p>{details?.goods_in_out.description}</p>
                </div>
              </div>
              {details?.goods_in_out?.goods_files.length !== 0 && (
                <div className="my-2">
                  <h2 className="font-medium border-b">Goods Attachments</h2>
                  {details?.goods_in_out?.goods_files?.map((files) => (
                    <div key={files.id} className="flex items-center m-2">
                      <img
                        src={domainPrefix + files?.original_url}
                        alt="attachments"
                        className="h-32 w-40 rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {details?.extra_visitors?.length !== 0 && (
          <div className="my-4 ">
            <h2 className="font-medium border-b-2 text-lg border-black px-4 ">
              Additional Visitors Info
            </h2>
            <div className="m-4 lg:mx-20 ">
              {details.extra_visitors && details.extra_visitors.length !== 0 ? (
                <Table columns={VisitorColumns} data={details.extra_visitors} />
              ) : (
                <p className="text-center">No Additional Visitor Added</p>
              )}
            </div>
          </div>
        )}
      </div>
      {qrModal && (
        <VisitorQRCode
          QR={domainPrefix + details.qr_code_image_url}
          onClose={() => setQrmodal(false)}
        />
      )}
    </div>
  );
};

export default EmployeeVisitorDetails;
