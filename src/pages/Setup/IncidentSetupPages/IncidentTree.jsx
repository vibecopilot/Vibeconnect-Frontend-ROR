// import React, { useState, useEffect } from "react";
// import { getIncidentSubTag, gettIncidentTags } from "../../../api";

// const TreeNode = ({ node }) => {
//   const [children, setChildren] = useState([]);
//   const [isExpanded, setIsExpanded] = useState(false);

//   const fetchChildren = async (parentId) => {
//     try {
//       const response = await getIncidentSubTag(parentId);
//       const data =  response.data
//       setChildren(data); // Assuming the API returns an array of child nodes
//     } catch (error) {
//       console.error("Error fetching child nodes:", error);
//     }
//   };

//   const toggleExpand = () => {
//     if (!isExpanded && children.length === 0) {
//       fetchChildren(node.id);
//     }
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <div className="pl-4 border-l-2 border-gray-300">
//       <div
//         className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
//         onClick={toggleExpand}
//       >
//         {isExpanded ? "▼" : "▶"} {/* Expand/Collapse Icon */}
//         <span className="ml-2">{node.name}</span>
//       </div>
//       {isExpanded && children.length > 0 && (
//         <div className="pl-4">
//           {children.map((child) => (
//             <TreeNode key={child.id} node={child} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const Tree = () => {
//   const [rootNodes, setRootNodes] = useState([]);

//   useEffect(() => {
//     const fetchRootNodes = async () => {
//       try {
//         const response = await gettIncidentTags();
//         const data =  response.data;
//         setRootNodes(data);
//       } catch (error) {
//         console.error("Error fetching root nodes:", error);
//       }
//     };

//     fetchRootNodes();
//   }, []);

//   return (
//     <div className="p-4">
//       {rootNodes.map((node) => (
//         <TreeNode key={node.id} node={node} />
//       ))}
//     </div>
//   );
// };

// export default Tree;

import React, { useState, useEffect } from "react";
import { getIncidentSubTags, getIncidentTags } from "../../../api";

const TreeNode = ({ node, childrenFetcher }) => {
  const [children, setChildren] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = async () => {
    if (!isExpanded && children.length === 0) {
      const childNodes = await childrenFetcher(node.id, node.tag_type);
      setChildren(childNodes);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="pl-4 border-l-2 border-gray-300">
      <div
        className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
        onClick={toggleExpand}
      >
        {isExpanded ? "▼" : "▶"} {/* Expand/Collapse Icon */}
        <span className="ml-2">{node.name}</span>
      </div>
      {isExpanded && children.length > 0 && (
        <div className="pl-4">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              childrenFetcher={childrenFetcher}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Tree = () => {
  const [rootNodes, setRootNodes] = useState([]);

  const fetchData = async (tagType, parentId = null) => {
    try {
      const query = `q[tag_type_cont]=${tagType}`;
      const url = parentId
        ? await getIncidentSubTags(tagType, parentId)
        : await getIncidentTags(tagType);
    //   const response = await fetch(url);
    console.log(url)
      const data = url.data
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchChildren = async (parentId, tagType) => {
    if (tagType === "IncidentCategory") {
      return fetchData("IncidentSubCategory", parentId);
    } else if (tagType === "IncidentSubCategory") {
      return fetchData("IncidentSubSubCategory", parentId);
    }
    return [];
  };

  useEffect(() => {
    const fetchRootNodes = async () => {
      const data = await fetchData("IncidentCategory");
      setRootNodes(data);
      console.log(data)
    };
    fetchRootNodes();
  }, []);

  return (
    <div className="p-4">
      {rootNodes.map((node) => (
        <TreeNode key={node.id} node={node} childrenFetcher={fetchChildren} />
      ))}
    </div>
  );
};

export default Tree;
