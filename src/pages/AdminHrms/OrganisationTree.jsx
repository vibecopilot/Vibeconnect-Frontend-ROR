import React from "react";
import AdminHRMS from "./AdminHrms";
import { Link } from "react-router-dom";
import Node from "./Components/Node";

function OrganizationTree() {
  return (
    <div className="flex h-screen">
      <AdminHRMS />
      <OrgTreeSettings />
    </div>
  );
}

const Sidebar = () => {
  return (
    <div className="bg-orange-100 w-16 flex flex-col items-center py-4">
      <div className="mb-4">Icon1</div>
      <div className="mb-4">Icon2</div>
      <div className="mb-4">Icon3</div>
      {/* Add more icons as needed */}
    </div>
  );
};

const OrgTreeSettings = () => {
  return (
    <div className="flex gap-10 p-6 ml-20">
      <div>
      <div className="bg-white w-96 rounded-lg shadow-lg p-6">
        <h2 className="w-72 font-bold mb-4">Organisation Tree Settings</h2>
        <p className="w-72 text-sm mb-6">
          Organisation splits among employees are presented under this section.
        </p>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">
            Organisation Tree Activation
          </h3>
          <p className="text-sm mb-4">
            In order to activate your org tree, please fix the following
          </p>
          <div className="">
            <div className="flex ">
            <Step stepNumber="1" title="Assign Head of Company" /> 
            <Link to={"/admin/organisation-view1"} className="bg-black mr-1 h-10 mt-4  text-white py-1 px-4 rounded-lg">
        View
      </Link></div>
            {/* <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-16 w-0.5 border-2 border-black border-dotted rounded-full"></div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center "></div>
              </div>
            </div> */}
            <div className="flex ">
            <Step stepNumber="2" title="Assign Department Heads" />
            <Link to={"/admin/organisation-view2"} className="bg-black mr-1 h-10 mt-4  text-white py-1 px-4 rounded-lg">
        View
      </Link>
            </div>
            {/* <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-16 w-0.5 border-2 border-black border-dotted rounded-full"></div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center "></div>
              </div>
            </div> */}
            <div className="flex ">
            <Step stepNumber="3" title="Assign Missing Reporting Supervisors" />
            <Link to={"/admin/organisation-view3"} className="bg-black mr-1 h-10 mt-4  text-white py-1 px-4 rounded-lg">
        View
      </Link></div>
          </div>
        </div></div> </div>

        {/* <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Step 1</h3>
          <p className="text-sm mb-2">Assign Head of Company</p>
          <a href="#" className="text-blue-500">
            + Add Head of Company
          </a>
        </div> */}
         <div className="flex flex-col items-center">
      {/* Top Node */}
      {/* <Node
        name="Vinayak Kapdoskar"
        position="MD"
        imageUrl="https://via.placeholder.com/50"
      >
        
        <Node
          name="Ankit Nima"
          position="Marketing Head"
          initials="AN"
        />
        <Node
          name="Salome Kulangara"
          position="President of India"
          initials="SK"
        />
        <Node
          name="Shivani Saran"
          position="Manager HR & Admin"
          initials="SS"
        />
      </Node> */}
    </div>
     
    </div>
  );
};

const Step = ({ stepNumber, title }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-4 w-96 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-1">
          {stepNumber}
        </div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
      </div>
      {/* <button className="bg-orange-500 mr-5 text-white py-1 px-4 rounded-lg">
        View
      </button> */}
      
    </div>
  );
};

export default OrganizationTree;
