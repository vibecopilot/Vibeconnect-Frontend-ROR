import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import Navbar from "../../components/Navbar";

const FitOutChecklistView = () => {
  const { id } = useParams();

  const themeColor = useSelector((state) => state.theme.color);

  const [checklistDetails, setChecklistDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChecklistDetails();
  }, []);

  const fetchChecklistDetails = async () => {
    try {
      setLoading(true);

      // Replace this with your API call
      const response = {
        id: 9,
        name: "Furniture layout",
        snag_audit_category_id: 7,
        snag_audit_sub_category_id: null,
        active: 0,
        site_id: 47,
        company_id: null,
        check_type: "",
        user_id: null,
        resource_id: null,
        resource_type: "",
        created_at: "2026-05-26T07:13:28.000Z",
        updated_at: "2026-05-26T07:13:28.000Z",
        url: "https://admin.vibecopilot.ai/snag_checklists/9.json",
        category_name: "Drawings",
        site_name: "Sample Asset 1",
        total_questions: 2,
        questions: [
          {
            id: 3,
            qtype: "Yes/No",
            descr:
              "Fit-Out Checklist is a list of tasks, safety checks, and requirements that must be verified before, during, or after fit-out work.",
            checklist_id: null,
            user_id: null,
            img_mandatory: false,
            quest_mandatory: true,
            active: 0,
            company_id: null,
            qnumber: 1,
            created_at: "2026-05-26T07:13:28.000Z",
            updated_at: "2026-05-26T07:13:28.000Z",
            url: "https://admin.vibecopilot.ai/snag_questions/3.json",
            options: [],
          },
          {
            id: 5,
            qtype: "Multiple Choice",
            descr: "Are all furniture items installed properly?",
            checklist_id: null,
            user_id: null,
            img_mandatory: false,
            quest_mandatory: true,
            active: 0,
            company_id: null,
            qnumber: 2,
            created_at: "2026-05-26T07:13:28.000Z",
            updated_at: "2026-05-26T07:13:28.000Z",
            url: "https://admin.vibecopilot.ai/snag_questions/5.json",
            options: [],
          },
        ],
      };

      setChecklistDetails(response);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "NA";

    const date = new Date(dateString);

    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-5 text-center text-lg">
        Loading Checklist Details...
      </div>
    );
  }

  if (!checklistDetails) {
    return (
      <div className="p-5 text-center text-red-500 text-lg">
        Checklist Details Not Found
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
          className="text-center p-2 my-2 text-white rounded-md font-medium text-lg"
        >
          Fitout Checklist Details
        </h1>

        {/* <div className="m-2 flex justify-end">
          <Link
            className="border-2 border-black rounded-md font-medium p-1 flex gap-2 items-center px-4 hover:bg-black hover:text-white transition-all duration-300"
            to={`/fitout/checklist/edit/${id}`}
          >
            <BiEdit />
            Edit
          </Link>
        </div> */}

        <div className="grid md:m-2 md:p-4 p-2 bg-gray-50 rounded-md gap-5">
          {/* Basic Details */}
          <div className="bg-white rounded-md shadow-sm p-4">
            <h2
              style={{ color: themeColor }}
              className="font-semibold text-lg mb-4 border-b pb-2"
            >
              Checklist Information
            </h2>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Checklist ID :</p>
                <p>{checklistDetails?.id || "NA"}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Checklist Name :</p>
                <p>{checklistDetails?.name || "NA"}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Category :</p>
                <p>{checklistDetails?.category_name || "NA"}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Site Name :</p>
                <p>{checklistDetails?.site_name || "NA"}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Total Questions :</p>
                <p>{checklistDetails?.total_questions || 0}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Status :</p>

                <div>
                  {checklistDetails?.active === 1 ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <FaCheckCircle />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500 font-medium">
                      <FaTimesCircle />
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Check Type :</p>
                <p>{checklistDetails?.check_type || "NA"}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Created On :</p>
                <p className="text-sm">
                  {formatDate(checklistDetails?.created_at)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Updated On :</p>
                <p className="text-sm">
                  {formatDate(checklistDetails?.updated_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-md shadow-sm p-4">
            <h2
              style={{ color: themeColor }}
              className="font-semibold text-lg mb-4 border-b pb-2"
            >
              Checklist Questions
            </h2>

            {checklistDetails?.questions &&
            checklistDetails.questions.length > 0 ? (
              <div className="flex flex-col gap-4">
                {checklistDetails.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border rounded-md p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-center flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          style={{ background: themeColor }}
                          className="text-white w-8 h-8 rounded-full flex items-center justify-center font-medium"
                        >
                          {question?.qnumber || index + 1}
                        </span>

                        <h3 className="font-semibold text-lg">
                          Question {question?.qnumber || index + 1}
                        </h3>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {question?.qtype || "NA"}
                        </span>

                        {question?.quest_mandatory && (
                          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                            Mandatory
                          </span>
                        )}

                        {question?.img_mandatory && (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                            Image Required
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="font-medium mb-2">
                        Question Description :
                      </p>

                      <div className="bg-white border rounded-md p-3 text-gray-700">
                        {question?.descr || "NA"}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <p className="font-medium">Question ID :</p>
                        <p>{question?.id || "NA"}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <p className="font-medium">Question Type :</p>
                        <p>{question?.qtype || "NA"}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <p className="font-medium">Created On :</p>
                        <p className="text-sm">
                          {formatDate(question?.created_at)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <p className="font-medium">Updated On :</p>
                        <p className="text-sm">
                          {formatDate(question?.updated_at)}
                        </p>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="mt-4">
                      <p className="font-medium mb-2">Options :</p>

                      {question?.options &&
                      question.options.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {question.options.map((option, optionIndex) => (
                            <span
                              key={optionIndex}
                              className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          No Options Available
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-5">
                No Questions Found
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FitOutChecklistView;