import React, { useEffect, useState } from "react";

import { PiPlusCircle } from "react-icons/pi";
import { FaDownload, FaFile, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API_URL, getPolicies } from "../api";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";

const Insurance = () => {
  document.title = "Insurance - vibe connect";
  const [page, setPage] = useState("Current Policies");
  const [isLoadingPolicy, setIsLoadingPolicy] = useState(true);
  const Get_Policy = async (policyCategory) => {
    const user_id = localStorage.getItem("VIBEUSERID");
    setIsLoadingPolicy(true);
    try {
      const data = await getPolicies(user_id);
      if (data.success) {
        setIsLoadingPolicy(false);
        return data.data.filter(
          (policy) => policy.policy_category === policyCategory
        );
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoadingPolicy(false);
    }
  };

  useEffect(() => {
    onBtnTogglePolicies("Current Policies");
    Get_Policy();
  }, []);
  const [policies, setPolicies] = useState([]);
  const onBtnTogglePolicies = async (type) => {
    setPage(type);
    let policyCategory = type === "Current Policies" ? "Existing" : "New";
    const policiesData = await Get_Policy(policyCategory);
    setPolicies(policiesData);
  };
  const handleDownload = (filename) => {
    if (!filename) {
      console.log("Filename is null or undefined, aborting download.");
      return;
    }

    const downloadLink = API_URL + filename;
    window.open(downloadLink, "_blank");
  };
  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="my-5 flex md:flex-row flex-col justify-between items-center md:mx-5">
          <h2 className="font-semibold text-2xl">My Insurance Policy</h2>
          <div className="flex items-center gap-2">
            <Link
              to={"/insurance/add-policy"}
              className="border-2 font-semibold hover:bg-black hover:text-white duration-300 transition-all border-black p-1 px-4 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
            >
              <PiPlusCircle size={20} />
              Add New Policy
            </Link>
            <Link
              to={"/insurance/add-existing-policy"}
              className="border-2 font-semibold hover:bg-black hover:text-white duration-300 transition-all border-black p-1 px-4 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
            >
              <PiPlusCircle size={20} />
              Add Existing Policy
            </Link>
          </div>
        </div>

        <div className="border-2 md:mx-5 border-gray-400 rounded-md h-full">
          <div className="flex items-center gap-2 border-b p-2 py-0">
            <p
              className={`p-2 cursor-pointer transition-all duration-300  ${
                page === "Current Policies"
                  ? "font-medium border-b border-black"
                  : ""
              }`}
              onClick={() => onBtnTogglePolicies("Current Policies")}
            >
              Current Policies
            </p>
            <p
              className={`p-2 cursor-pointer  transition-all duration-300 ${
                page === "Requested Policies"
                  ? "font-medium border-b border-black"
                  : ""
              }`}
              onClick={() => onBtnTogglePolicies("Requested Policies")}
            >
              Requested Policies
            </p>
          </div>
          {page === "Current Policies" && (
            <div>
              {isLoadingPolicy ? (
                <div className=" m-4" style={{ textAlign: "center" }}>
                  <center className="m-4">
                    <div
                      className="spinner-border"
                      style={{ opacity: 0.3 }}
                      role="status"
                    >
                      <span className="sr-only"></span>
                    </div>
                    <br />
                    <span style={{ opacity: 0.6 }}>Please wait...</span>
                  </center>
                </div>
              ) : policies.length === 0 ? (
                <div className="col-md-12" style={{ textAlign: "center" }}>
                  <div className="m-4">
                    <center>
                      No Policies
                      <br />
                    </center>
                  </div>
                </div>
              ) : (
                policies.map((policy) => (
                  <div
                    key={policy.id}
                    className="shadow-custom-all-sides rounded-xl p-4 border-2 border-gray-600 items-center m-2  grid grid-cols-3"
                  >
                    <div className="col-md-6">
                      <p
                        className="text-xl font-medium"
                        title={policy && policy.policy_name}
                      >
                        {policy &&
                        policy.policy_name &&
                        policy.policy_name.length > 20
                          ? policy.policy_name.slice(0, 20) + ".."
                          : policy && policy.policy_name}
                      </p>
                      <p
                        style={{
                          color: "#9d9fa1",
                          fontSize: "12px",
                          marginBottom: "0px",
                          margin: "0px",
                        }}
                      >
                        Policy Holder Name
                      </p>
                      <p
                        style={{
                          color: "black",
                          marginBottom: "10px",
                          margin: "0px",
                        }}
                      >
                        {policy.policyholder_name}
                      </p>
                    </div>
                    <div className="col-md-6 mt-2">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      ></div>
                      <div className="grid grid-cols-2">
                        <p className="w-fit text-gray-500">Covered by :</p>
                        <p>{policy.insurance_provider_name}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="text-gray-500">Policy No :</p>
                        <p>{policy.policy_number}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="text-gray-500">Policy Period :</p>
                        <p>
                          {policy.start_date} - {policy.end_date}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between  flex-col items-end gap-4">
                      {policy.policy_document && (
                        <FaDownload
                          style={{ color: "#10df95" }}
                          onClick={() => handleDownload(policy.policy_document)}
                        />
                      )}
                      <button
                        className="text-blue-600"
                        onClick={() =>
                          onOpenPolicyDetail(
                            policy.policy_name,
                            policy.policyholder_name,
                            policy.policyholder_gender,
                            policy.policyholder_email_address,
                            policy.policyholder_dob,
                            policy.policyholder_contact_number,
                            policy.policyholder_address,
                            policy.policy_type,
                            policy.policy_name,
                            policy.beneficiary_names,
                            policy.beneficiary_dob,
                            policy.beneficiary_contact_info,
                            policy.beneficiary_gender,
                            policy.beneficiary_relationships,
                            policy.insurance_provider_name,
                            policy.identification_proof,
                            policy.medical_report,
                            policy.coverage_amount,
                            policy.premium_amount,
                            policy.payment_frequency,
                            policy.next_payment_due_date
                          )
                        }
                      >
                        <BsEye size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {page === "Requested Policies" && (
            <div className="shadow-custom-all-sides m-3 p-2 py-4 rounded-md">
              <p className="font-bold text-lg text-center md:text-left my-2">
                Policy Name
              </p>
              <div className="md:grid md:grid-cols-8 flex flex-col gap-2 md:gap-0">
                <div className="grid md:grid-cols-2 md:col-span-6">
                  <div className="grid grid-cols-2">
                    <p className="font-medium">Holder Name :</p>
                    <p>Holder</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="font-medium">Covered by :</p>
                    <p>Holder</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="font-medium">Policy Number :</p>
                    <p>Holder</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="font-medium">Policy period :</p>
                    <p>Holder</p>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 col-span-2">
                  <button className="bg-review text-white p-1 rounded-md">
                    Review Policy
                  </button>
                  <button className="bg-review text-white p-1 rounded-md flex gap-2 justify-center items-center">
                    <FaFile /> Download Policy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Insurance;
