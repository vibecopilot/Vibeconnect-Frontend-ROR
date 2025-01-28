import React, { useState } from "react";
import Detail from "../../../containers/Detail";
import CommentModal from "../Addcomment";
import { useSelector } from "react-redux";
import { FaWpforms } from "react-icons/fa";

const PermitPendingApprovalDetails = () => {
   const themeColor = useSelector((state) => state.theme.color);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddComment =(comment)=>{
    console.log("comment submitted",comment)
  }
  return (
    <div className="w-screen">
     <div className="flex flex-col gap-2">
      <h2
        style={{
          background: themeColor,
        }}
        className="text-center w-full text-white font-semibold text-lg p-2 px-4 "
      >
        
        Pending Approvals Detail
      </h2>
      {/* <h2 className="text-center font-medium rounded-md border-2 mx-2 border-gray-400">
        {title}
      </h2> */}

      <div className="">
        <div className="flex-row grid grid-cols-4 ">
          <div className="py-4 font- pl-3 font-bold text-lg  text-center">
            Safety Officer Approval :
            <button className="bg-green-700 p-1 px-2 rounded-md text-white">
              
              Approved
            </button>
          </div>

          <div className="py-4  text-lg   font-bold">
            Issuer Approved :{" "}
            <button className=" px-4 rounded-md bg-yellow-500 text-white  p-1">
              Pending
            </button>
          </div>
        </div>

        {/* name */}
        <div className="cols-6 pl-10 pt-12 text-md font-bold ">
          Rajnish Patil : 25/12/2024
        </div>

        <div className="flex justify-end items-center mx-4 ">
          <div>
            <button   type="print" className="bg-purple-950  text-white px-4 p-2 font-medium rounded-md ">
              Print Form
            </button>
          </div>
          <div>
            <button type="print" className="ml-6 bg-purple-950 text-white px-4 p-2 font-medium rounded-md">
              Print JSA
            </button>
          </div>
        </div>

        {/* data form start */}

        <div className="mt-6  shadow-lg bg-gray-100">
          <h1 className="flex items-center mx-6 text-xl   font-bold">
            <FaWpforms size={22} className=" m-4  gap-2" />{" "}
            PERMIT DETAILS
          </h1>

          <div className="mx-10">
            <div className="grid grid-cols-3 m-6 ">
              <div className="grid grid-cols-2">
                <div>Permit ID :</div>
                <div>206</div>
              </div>

              <div className="grid grid-cols-2">
                <div>Permit type:</div>
                <div>Cold work</div>
              </div>

              <div className="grid grid-cols-2">
                <div>Request Date & Time  :</div>
                <div>25/12/2024 04:32pm</div>
              </div>
            </div>

            <div className="grid grid-cols-3 m-6">
              <div className="grid grid-cols-2">
                <div>Issue Date and Time :</div>
                <div></div>
              </div>

              <div className="grid grid-cols-2">
                <div>Vendor:</div>
                <div>1St Printing & Design</div>
              </div>

              <div className="grid grid-cols-2">
                <div>Extention Status:</div>
                <div>No</div>
              </div>
            </div>
            <div className="grid grid-cols-3 m-6">
              <div className="grid grid-cols-2">
                <div>Permit For:</div>
                <div>High Work</div>
              </div>

              <div className="grid grid-cols-2">
                <div>Permit Status:</div>
                <div>open</div>
              </div>

              <div className="grid grid-cols-2">
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="grid grid-cols-3 m-6">


              <div className="grid grid-cols-2">
                <div>Location :</div>
                <div>Site - Panchshil Test / Building - TOWER A / Wing - Wing A / Floor - NA / Area - Area A / Room - NA</div>
              </div>

              
            </div>
            
          </div>
        </div>
        <div className="border h-1 bg-gray-300 my-5 "></div>
           

        <div className=" my-6 mb-10 pb-4 shadow-custom-all-sides ">

        <h1 className="flex items-center mx-6 text-xl  font-bold">
            <FaWpforms size={22} className=" m-4  gap-2" />
            REQUSRER'S INFORMATION
          </h1>
          
            <div className="grid bg-gray-100  mx-12 grid-cols-3 gap-4">

              <div className="grid pt-2 pb-4 px-8 grid-cols-2">
                <div>Created by :</div>
                <div>Tech Support</div>
              </div>

              <div className="grid pt-2 pb-4 grid-cols-2">
                <div>Department :</div>
                <div></div>
              </div>

              <div className="grid pt-2 pb-4 grid-cols-2">
                <div>Contact Number :</div>
                <div>89220xxxxx</div>
              </div>
            </div>
            </div>

            <div className="border h-1 bg-gray-300 my-5 "></div> 

            <div className=" my-6 mb-10 pb-4 shadow-custom-all-sides ">

        <h1 className="flex items-center mx-6 text-xl  font-bold">
            <FaWpforms size={22} className=" m-4  gap-2" />
             ACTIVITY DETAILS 
          </h1>
          
            <div className="grid bg-gray-100  mx-12 grid-cols-3 gap-4">

              <div className="grid pt-2 pb-4 px-8 grid-cols-2">
                <div>Activity:</div>
                <div>
                Elevator Load & PMT Test Work</div>
              </div>

              <div className="grid pt-2 pb-4 grid-cols-2">
                <div>Sub Activity:</div>
                <div>PMT Testing</div>
              </div>

              <div className="grid pt-2 pb-4 grid-cols-2">
                <div> Category of Hazard:</div>
                <div>
                Slip/trip</div>
              </div>
            </div>

            <div className="grid grid-cols-2 mx-12 my-6 ">
              <div className="bg-gray-100 py-4">
              <p className="text-center ">Physical injury</p>
                  <p className="pl-16">Safety Equipment Required</p>
                  <ul className="pl-16 list-disc">
                    <li>Use Safety Shoes (EN-345/ IS-15298)</li>
                    <li>Safety Helmet (IS-2925:1984)</li>
                    <li>Reflective Jacket (EN-20471:2013)</li>
                  </ul>
              </div>
            
            </div>
            </div>

            <div className="border h-1 bg-gray-300 my-5 "></div> 
            {/* pdf section start  */}

            <div className="my-6 mb-10 pb-4 shadow-custom-all-sides ">

            <h1 className="flex items-center mx-6 text-xl   font-bold">
            <FaWpforms size={22} className=" m-4  gap-2" />
             Attachment
          </h1>
          <p className="pl-18 ">2 Attactments</p>
              <div className="grid gap-2 grid-cols-3">
                  <div className="p-16 border-spacing-1">pdf1</div>
                  <div className="p-16  border-spacing-1">pdf2</div>
              </div>
            </div>

            <div className="border h-1 bg-gray-300 my-5 "></div> 
            <div className=" my-6 mb-10 pb-4 shadow-custom-all-sides ">

        <h1 className="flex items-center mx-6 text-xl   font-bold">
            <FaWpforms size={22} className=" m-4  gap-2" />
            MANPOWER DETAILS
          </h1>
          
            <div className="grid bg-gray-100  mx-12 grid-cols-3 gap-4">

              <div className="grid pt-2 pb-4 px-8 grid-cols-2">
                <div>Name :</div>
                <div>Vipin</div>
              </div>

              <div className="grid pt-2 pb-4 grid-cols-2">
                <div>Designation:</div>
                <div>ABC</div>
              </div>

              <div className="grid pt-2 pb-4 grid-cols-2">
                <div>Contact Number :</div>
                <div>89220xxxxx</div>
              </div>
            </div>
            </div>

            <div className="border h-1 bg-gray-300 my-5 "></div> 
            <div className=" my-6 mb-10 pb-4 shadow-custom-all-sides ">

            <div className="grid grid-cols-2">
  <h1 className="flex items-center mx-6 text-xl  font-bold">
    <FaWpforms size={22} className="m-4  gap-2" />
    COMMENT LOG
  </h1>
  <div className="flex justify-end items-center mx-6 pt-6">
    <button
      className="bg-purple-800 text-sm text-white p-2 rounded-md"
      onClick={() => setIsModalOpen(true)}
    >
      Add Comment
    </button>
  </div>
</div>
        
          <div className="flex justify-center gap-4 pt-9 ">

            <button className="bg-green-600 text-white px-3 rounded-sm  text-sm p-2">Approve</button>
            <button className="bg-red-400 text-white px-3 rounded-sm text-sm p-2" >Reject</button>
          </div>
           
            </div>

        </div>
        <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddComment}
      />
      </div>
  
  

    </div>
  );
};

export default PermitPendingApprovalDetails;