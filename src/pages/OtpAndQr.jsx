import React, { useEffect, useState } from "react";
import { getUserOtp } from "../api";
import { useParams, useSearchParams } from "react-router-dom";
// import { ChevronLeft } from "lucide-react"
import { domainPrefix } from "../api/index";
// import Image from "next/image"

const OtpAndQr = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("v");
  // const {id} = useParams();
  console.log("id:", id);
  const [userData, setUserData] = useState({});
  //const [otp, setOtp] = useState("");
  //const [qrCode, setQrCode] = useState('');
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState("");
  const [otpDigits, setOtpDigits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const response = await getUserOtp(id);
        setUserData(response.data);
        setOtpDigits(response.data.otp.toString().split(""));
        setQrCodeImageUrl(response.data.qr_code);
        console.log("OTP Digits:", response.data.otp.toString().split(""));
        console.log("QR Code URL:", response.data.qr_code);
      } catch (error) {
        console.error("Error fetching OTP data:", error);
      }
    };

    fetchData();
  }, [id]);

  const ProfilePic = domainPrefix + userData.profile_picture;
  const QrCodePic = domainPrefix + userData.qr_code;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-3 pb-8">
      {/* Mobile frame */}
      <div className="relative max-w-lg w-full bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-4">
          <button className="p-1">
            {/* <ChevronLeft className="h-5 w-5" /> */}
          </button>
          <h1 className="text-xl font-bold text-center flex-1 mr-6">
            Visiting Pass
          </h1>
        </div>

        {/* Main content */}
        <div className="px-6 pb-6">
          {/* Visitor card */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center">
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
              {/* <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Profile"
                width={48}
                height={48}
                className="object-cover"
              /> */}
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                <img
                  src={
                    ProfilePic
                      ? ProfilePic
                      : "/profile.png"
                  }
                  alt="Profile Picture"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="font-bold text-lg">
                {" "}
                Name : <span>{userData.name}</span>
              </h2>
              <p className="font-medium text-xs">
                Purpose:
                <span className="font-normal text-gray-600 mx-1">
                  {userData.purpose}
                </span>
              </p>
              <p className="font-medium text-xs">
                Type:{" "}
                <span className="font-normal text-gray-600 mx-1">
                  {userData.visit_type}
                </span>
              </p>
              <p className="font-medium text-xs">
                Host:
                <span className="font-normal text-gray-600 mx-1">
                  {userData.hosts?.length ? userData.hosts[0].full_name : "N/A"}
                </span>
              </p>
            </div>
            <div className="text-xs text-gray-500">
              {userData.wing} {userData.floor}
            </div>
          </div>

          {/* Date section */}
          <div className="flex justify-between mb-6">
  {userData.pass_start_date && userData.pass_end_date ? (
    <>
      {/* Start Date */}
      <div className="bg-yellow-100 rounded-lg p-2 text-center w-[30%]">
        <p className="text-xs font-medium">Start Date</p>
        <p className="text-sm font-bold">
          {new Date(userData.pass_start_date).toLocaleDateString()}
        </p>
      </div>

      {/* End Date */}
      <div className="bg-yellow-100 rounded-lg p-2 text-center w-[30%]">
        <p className="text-xs font-medium">End Date</p>
        <p className="text-sm font-bold">
          {new Date(userData.pass_end_date).toLocaleDateString()}
        </p>
      </div>

      {/* Expected or Created At */}
      <div className="bg-yellow-100 rounded-lg p-2 text-center w-[30%]">
        <p className="text-xs font-medium">
          {userData.expected_date ? "Expected Date" : "Created At"}
        </p>
        <p className="text-sm font-bold">
          {new Date(
            userData?.expected_date || userData?.created_at
          ).toLocaleDateString()}
        </p>
      </div>
    </>
  ) : (
    // Show only Expected/Created At when no start/end dates
    <div className="bg-yellow-100 rounded-lg p-2 text-center w-full">
      <p className="text-xs font-medium">
        {userData.expected_date ? "Expected Date" : "Created At"}
      </p>
      <p className="text-sm font-bold">
        {new Date(
          userData.expected_date || userData.created_at
        ).toLocaleDateString()}
      </p>
    </div>
  )}
</div>


          {/* Company details */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">Site Details</p>
            <h2 className="text-xl font-bold">{userData?.site_name}</h2>
          </div>

          {/* QR code section */}
          <div className="text-center mb-6">
            <p className="text-sm font-medium mb-2">Scan QR For Entry</p>

            <div className="flex justify-center mb-2">
              <div className="h-40 w-40 bg-white border border-gray-300 flex items-center justify-center">
                <img
                  // src={domainPrifix+qrCodeImageUrl[0].}
                  //  src={qrCodeImageUrl}

                  src={QrCodePic}
                  alt="QR Code"
                  width={140}
                  height={140}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">Or</p>
            <p className="text-sm font-medium mb-2">OTP</p>
            <div className="flex justify-center space-x-2">
              {Array.isArray(otpDigits) &&
                otpDigits.map((digit, index) => (
                  <div
                    key={index}
                    className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shadow-sm"
                  >
                    {digit}
                  </div>
                ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400">
            Powered by VibeConnect
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpAndQr;
