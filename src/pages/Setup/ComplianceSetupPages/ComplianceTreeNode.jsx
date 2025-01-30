import React, { useState } from "react";
import { BiEdit, BiPlus, BiPlusCircle } from "react-icons/bi";
import {
  IoMdArrowDropdownCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import { getIncidentCatDetails } from "../../../api";
import ComplianceSubCatModal from "./ComplianceSubCatModal";
import ComplianceTask from "./ComplianceTask";

const ComplianceTreeNode = ({ node, fetchComplianceTree }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modal, showModal] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const [catId, setCatId] = useState("");
  const [addCat, setAddSub] = useState(false);
  const [task, setTask] = useState(false);
  const [tagType, setTagType] = useState("");
  const handleEdit = async (id) => {
    try {
      const res = await getIncidentCatDetails(id);
      setCatId(res.data.id);
      setTagType(res.data.tag_type);
      showModal(true);
    } catch (error) {
      console.log(error);
    }
  };
  const [nodeId, setNodeId] = useState("");
  const handleAddTask = (node_id) => {
    setTask(true);
    setNodeId(node_id);
  };
  const [parentId, setParentId] = useState("");
  const handleAddSubCat = ( parent_id) => {
    setAddSub(true);
   
    setParentId(parent_id);
  };

  console.log(node);
  return (
    <div className="pl-2 border-gray-300">
      <div className="grid grid-cols-2 items-center space-x-2 border-b p-2">
        <div className="flex items-center">
          {node.children && node.children && (
            <button
              onClick={toggleExpand}
              className="text-sm text-green-600 focus:outline-none"
            >
              {isExpanded ? (
                <IoMdArrowDropdownCircle size={20} className="text-red-400" />
              ) : (
                <IoMdArrowDroprightCircle size={20} />
              )}
            </button>
          )}
          <span className="font-medium mx-1">{node.name}</span>
          {/* Display tag type */}
          {node.tag_type && (
            <span className="text-gray-400 text-xs">
              ({node.tag_type.replace(/([a-z])([A-Z])/g, "$1 $2")})
            </span>
          )}
        </div>
        {/* <div className="flex justify-end">
          <button
            onClick={() => handleEdit(node.id)}
            className="ml-auto text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            <BiEdit size={15} />
          </button>
        </div> */}
      </div>

      {isExpanded && node.children && (
        <div className="my-1">
          <div className="flex justify-end">
            <button
              onClick={() => handleAddTask(node.id)}
              className="ml-4 text-green-600 hover:text-green-800 border-green-500 focus:outline-none border p-1 rounded-md font-medium flex items-center gap-2"
            >
              <BiPlusCircle size={15} className="inline" /> Add Task
            </button>
            <button
              onClick={() => handleAddSubCat( node.id)}
              className="ml-4 text-green-600 hover:text-green-800 border-green-500 focus:outline-none border p-1 rounded-md font-medium flex items-center gap-2"
            >
              <BiPlusCircle size={15} className="inline" /> Add Sub Category
            </button>
          </div>
          {node.children.map((child) => (
            <ComplianceTreeNode
              key={child.id}
              node={child}
              fetchComplianceTree={fetchComplianceTree}
            />
          ))}
        </div>
      )}
      {addCat && (
        <ComplianceSubCatModal
          onclose={() => setAddSub(false)}
          parentId={parentId}
          fetchComplianceTree={fetchComplianceTree}
        
        />
      )}
      {task && (
        <ComplianceTask
          onClose={() => setTask(false)}
          nodeId={nodeId}
          fetchComplianceTree={fetchComplianceTree}
        />
      )}
    </div>
  );
};

export default ComplianceTreeNode;
