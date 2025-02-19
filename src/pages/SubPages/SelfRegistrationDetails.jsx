import React, { useEffect, useState } from "react";
import image from "/profile.png";
import { domainPrefix, getVisitorDetails } from "../../api";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiQr } from "react-icons/bi";
import Navbar from "../../components/Navbar";
import VisitorQRCode from "../../containers/modals/VisitorQRCode";
import axios from "axios";

const SelfRegistrationDetails = () => {
  const [details, setDetails] = useState({});
  const { id } = useParams();
  console.log(id);
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  useEffect(() => {
    const fetchVisitorDetails = async () => {
      try {
        const detailsResp = await axios.get(
          `https://admin.vibecopilot.ai/visitors/${id}.json`,
          {
            params: { token: token },
          }
        );
        setDetails(detailsResp.data);
        console.log(detailsResp.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVisitorDetails();
  }, [id]);

  const themeColor = useSelector((state) => state.theme.color);
  const [qrModal, setQrmodal] = useState(false);
  return (
    <section className="flex">
      <div className=" w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex flex-col gap-2">
          <h2
            style={{
              background: themeColor,
            }}
            className="text-center rounded-full w-full text-white font-semibold text-lg p-2 px-4 mt-2 "
          >
            Visitor Details
          </h2>
          <div className="flex justify-end gap-2 mx-2 mt-1">
            <button
              onClick={() => setQrmodal(true)}
              className="border-2 border-black rounded-full px-2 p-1 flex items-center gap-2"
            >
              <BiQr /> QR code
            </button>
          </div>
          <div className="flex justify-center">
            {details.profile_picture && details.profile_picture !== null ? (
              // details.visitor_files.map((doc, index) => (
              <img
                src={domainPrefix + details.profile_picture}
                alt=""
                className="w-48 h-48 rounded-full cursor-pointer"
                onClick={() =>
                  window.open(
                    domainPrefix + details.profile_picture,
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
            <div className="grid grid-cols-2 ">
              <p className="font-semibold text-sm">Visitor Type : </p>
              <p className="">{details.visit_type}</p>
            </div>
            <div className="grid grid-cols-2 ">
              <p className="font-semibold text-sm">Visitor's Name : </p>
              <p className="">{details?.name}</p>
            </div>
            <div className="grid grid-cols-2 ">
              <p className="font-semibold text-sm">Mobile No. : </p>
              <p className="">{details?.contact_no}</p>
            </div>
            <div className="grid grid-cols-2 ">
              <p className="font-semibold text-sm">Purpose : </p>
              <p className="">{details?.purpose}</p>
            </div>
            <div className="grid grid-cols-2 ">
              <p className="font-semibold text-sm">Coming From : </p>
              <p className="">{details?.coming_from}</p>
            </div>
            <div className="grid grid-cols-2 ">
              <p className="font-semibold text-sm">Host : </p>
              {details?.hosts?.map((host) => (
                <p>{host?.full_name}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      {qrModal && (
        <VisitorQRCode
          QR={domainPrefix + details.qr_code_image_url}
          onClose={() => setQrmodal(false)}
        />
      )}
    </section>
  );
};

export default SelfRegistrationDetails;
