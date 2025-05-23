import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../../../components/Navbar";
import { Link } from "react-router-dom";
import { CgNotes } from "react-icons/cg";
import { CiLock } from "react-icons/ci";
function CreateTemplateSurvey() {
  const themeColor = useSelector((state) => state.theme.color);

  const categories = [
    { id: "team", label: "Team templates", count: 0 },
    { id: "popular", label: "Most Popular", count: 13 },
    { id: "forms", label: "Forms", count: 127 },
    { id: "events", label: "Events", count: 33 },
    { id: "humanResources", label: "Human Resources", count: 66 },
    { id: "customerFeedback", label: "Customer Feedback", count: 44 },
    { id: "generalBusiness", label: "General Business", count: 22 },
    { id: "satisfaction", label: "Satisfaction", count: 2 },
    { id: "marketing", label: "Marketing", count: 25 },
    { id: "education", label: "Education", count: 40 },
    { id: "benchmarkable", label: "Benchmarkable", count: 26 },
    { id: "justForFun", label: "Just for Fun", count: 21 },
    { id: "academicResearch", label: "Academic/Research", count: 1 },
    { id: "quizzes", label: "Quizzes", count: 9 },
    { id: "services", label: "Services", count: 2 },
    { id: "community", label: "Community", count: 5 },
    { id: "marketResearch", label: "Market Research", count: 28 },
    { id: "healthcare", label: "Healthcare", count: 24 },
    { id: "industrySpecific", label: "Industry Specific", count: 32 },
    { id: "political", label: "Political", count: 5 },
    { id: "socialAndPolitical", label: "Social and Political", count: 2 },
    { id: "demographics", label: "Demographics", count: 6 },
    { id: "nonprofit", label: "Nonprofit", count: 15 },
  ];

  const templates = [
    {
      id: 1,
      name: "Customer Satisfaction Template",
      usage: "Used 200+ times",
      description: "Keep your customers happy and turn them into advocates",
      icon: <CgNotes className="h-16 w-16 text-gray-400" />,
      image: null,
    },
    {
      id: 2,
      name: "Market Research - Product Testing Template",
      usage: "Used 2900+ times",
      description:
        "Launching a new product isn't easy, verify you have the right",
      image: "/digitalMarketing.jpg",
    },
    {
      id: 3,
      name: "Employee Feedback Survey",
      usage: "Used 1500+ times",
      description: "Gather insights from employees to improve the workplace",
      image: "/projectHolder.jpg",
    },
    {
      id: 4,
      name: "Event Registration Form",
      usage: "Used 1200+ times",
      description: "Streamline event registrations with a structured form",
      image: "/building.jpg",
    },
    {
      id: 5,
      name: "Net Promoter Score Survey",
      usage: "Used 3200+ times",
      description: "Measure customer loyalty and satisfaction effectively",
      image: "/pro.jpg",
    },
    {
      id: 6,
      name: "General Event Feedback Template",
      usage: "Used 1400+ times",
      description:
        "Find out how people felt about your event to improve the next",
      image: "/bridge.jpg",
    },
    {
      id: 7,
      name: "Website Usability Survey Form",
      usage: "Used 900+ times",
      description: "Get feedback on website usability and user experience",
      icon: <CgNotes className="h-16 w-16 text-gray-400" />,
    },
    {
      id: 8,
      name: "Product Feedback Form",
      usage: "Used 1800+ times",
      description: "Understand what customers love and what needs improvement",
      image: "/owners.jpg",
    },
  ];

  return (
    <div className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="flex flex-col overflow-hidden w-full">
        <h2
          className="text-center text-lg font-bold my-5 p-2 rounded-md text-white mx-10"
          style={{ background: themeColor }}
        >
          Create Template Survey
        </h2>
        <div className="grid grid-cols-12 gap-5 mx-10 mb-10">
          <div className="col-span-3 p-5 space-y-5">
            <h2 className="text-2xl text-gray-600 font-medium mb-5">
              Explore templates
            </h2>
            <input
              type="text"
              placeholder="Search templates"
              className=" p-2 w-full border-gray-300 rounded-md placeholder:text-sm outline-none border "
            />
            <h2 className="text-gray-950 font-medium text-xl">Filters</h2>
            <div className="space-y-4">
              <h2 className="font-medium">Plan type</h2>
              <div className="flex gap-3 items-center">
                <input type="checkbox" className="h-5 w-5" id="planType" />
                <label for="planType" className="text-sm text-gray-800">
                  Show free templates
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="font-medium">Categories</h2>
              <div className="space-y-6">
                {categories.map(({ id, label, count }) => (
                  <div key={id} className="flex gap-3 items-center">
                    <input type="checkbox" className="h-5 w-5" id={id} />
                    <label
                      className="text-sm text-gray-800"
                      htmlFor={id}
                    >{`${label} (${count})`}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-9">
            <div className="grid grid-cols-12 gap-5 items-stretch">
              {templates.map((template) => (
                <div key={template.id} className="col-span-3">
                  <Link
                    to={`/admin/template-detail-survey`}
                    className="border-2 bg-white rounded-xl h-full flex flex-col hover:shadow-md"
                  >
                    <div className="flex flex-col space-y-3 h-full">
                      <div className="relative">
                        {template.image ? (
                          <img
                            src={template.image}
                            alt={template.name}
                            className="w-full h-24 object-cover rounded-t-xl"
                          />
                        ) : (
                          <div className="flex justify-center p-4">
                            {template.icon}
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-white p-1 rounded-md shadow">
                          <CiLock className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="p-3 flex flex-col flex-grow">
                        <div className="mb-5">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {template.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {template.usage}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 flex-grow">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTemplateSurvey;
