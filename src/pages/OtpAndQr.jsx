import React, { useEffect, useState } from "react";
import { getUserOtp } from "../api";
import { useParams } from "react-router-dom";
// import { ChevronLeft } from "lucide-react"
import {domainPrefix} from "../api/index";
// import Image from "next/image"

const OtpAndQr = () => {
  const {id} = useParams();
  console.log("id:", id);
  const [userData, setUserData] = useState({});
  //const [otp, setOtp] = useState("");
  //const [qrCode, setQrCode] = useState('');
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState("");
  const [otpDigits, setOtpDigits] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await getUserOtp(id);
  //     setUserData(response.data);
  //     //setOtp(response.data.otp || ""); // Add a default value if otp is undefined
  //     // setQrCode(response.data.qrCode);
  //     setQrCodeImageUrl(response.data.qr_code_image_url);
  //     setOtpDigits(response.data);
  //     console.log("otp:",otpDigits)
  //   };
  //   fetchData();
  // }, [id]);
  // console.log("Otp:",otpDigits)

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserOtp(id);
      setUserData(response.data);
      setOtpDigits(response.data.otp.toString().split('')); // assuming otp is the list in response.data
      setQrCodeImageUrl(response.data.qr_code_image_url);
      console.log("otp:",otpDigits)
      console.log("qrCodeImageUrl:",qrCodeImageUrl)
// 
    };
    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
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
                  src={userData.profile_picture}
                  alt="Profile Picture"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg"> Name :{userData.name}</h2>
              <p className="text-gray-600 text-sm">{userData.purpose}</p>
              <p className="text-gray-500 text-xs">Type: {userData.visit_type}</p>
            </div>
            <div className="text-xs text-gray-500">
              {userData.wing} {userData.floor}
            </div>
          </div>

          {/* Date section */}
          <div className="flex justify-between mb-6">
            <div className="bg-yellow-100 rounded-lg p-2 text-center w-[45%]">
              <p className="text-xs font-medium">Start Date</p>
              <p className="text-sm font-bold">{userData.pass_start_date}</p>
            </div>

            {/* Company logo */}
            {/* <div className="flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <span className="font-serif text-xl">V</span>
              </div>
            </div> */}

            <div className="bg-yellow-100 rounded-lg p-2 text-center w-[45%]">
              <p className="text-xs font-medium">End Date</p>
              <p className="text-sm font-bold">{userData.pass_end_date}</p>
            </div>
          </div>

          {/* Company details */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">Company Details</p>
            <h2 className="text-xl font-bold">The Capital</h2>
            <p className="text-xs text-gray-500">+1 Companies</p>
          </div>

          {/* QR code section */}
          <div className="text-center mb-6">
            <p className="text-sm font-medium mb-2">Scan QR For Entry</p>
            
            <div className="flex justify-center mb-2">
              <div className="h-40 w-40 bg-white border border-gray-300 flex items-center justify-center">
                <img
                  // src={domainPrifix+qrCodeImageUrl[0].}
                  //  src={qrCodeImageUrl}
                  
                  src={domainPrefix + qrCodeImageUrl}
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
