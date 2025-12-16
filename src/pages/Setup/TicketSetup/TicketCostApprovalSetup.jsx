// import React, { useState,useEffect } from "react";
// import ToggleSwitch from "../../../Buttons/ToggleSwitch";
// import { BiEdit } from "react-icons/bi";
// import { FaTrash } from "react-icons/fa";
// import { useSelector } from "react-redux";

// import Table from "../../../components/table/Table";

// const TicketCostApprovalSetup = () => {
//   const [page, setPage] = useState("FM");
//   const themeColor = useSelector((state) => state.theme.color);
//   const [selectedOption, setSelectedOption] = useState('');
//   const [select setSelction] = useState('')

//   const handleChange = (event) => {
//     setSelectedOption(event.target.value);
//   };

//   useEffect(() => {
//   getUsers()
//     .then(res => setUsers(res.data))
//     .catch(console.error);
// }, []);


// useEffect(() => {
//   getCostApprovals(page)
//     .then(res => setRules(res.data))
//     .catch(console.error);
// }, [page]);

// const handleSubmit = async () => {
//   const payload = {
//     type: page,
//     condition,
//     minCost,
//     maxCost: condition === "between" ? maxCost : null,
//     levels: Object.keys(approvers).map(level => ({
//       level,
//       approver: approvers[level],
//     })),
//   };

//   await createCostApproval(payload);
//   getCostApprovals(page).then(res => setRules(res.data));
// };

// const handleDelete = async (id) => {
//   await deleteCostApproval(id);
//   getCostApprovals(page).then(res => setRules(res.data));
// };




//   const columns = [
  
//     {
//       name: "Cost Range",
//       selector: (row) => row.cost,
//       sortable: true,
//     },
//     {
//       name: "Levels",
//       selector: (row) => row.Levels,
//       sortable: true,
//     },
//     {
//       name: "Approvers",
//       selector: (row) => row.Approvers,
//       sortable: true,
//     },
//   ]
//   const data = [
//     {
//       cost:"500-600",
//       Levels:"L1",
//       Approvers:"Deepak Gupta",
//     },
//     {
//       cost:"500-600",
//       Levels:"L2",
//       Approvers:"Deepak Gupta",
//     },
//     {
//       cost:"500-600",
//       Levels:"L3",
//       Approvers:"Deepak Gupta",
//     },
//     {
//       cost:"500-600",
//       Levels:"L4",
//       Approvers:"Deepak Gupta",
//     },
//     {
//       cost:"500-600",
//       Levels:"L5",
//       Approvers:"Deepak Gupta",
//     }

//   ]
//   return (
//     <div className=" w-full my-2 flex  overflow-hidden flex-col">
//       <div className="flex gap-5 justify-center">
//         <label htmlFor="" className="font-medium">Approval Level :</label>
//         <div className="flex gap-4">
//         <label htmlFor="">Access Level </label>&nbsp;
//         <ToggleSwitch />
//         <label htmlFor="">User Level</label>
//         </div>
//       </div>
//       <div className="flex w-full">
//         <div className=" flex gap-2 p-2 pb-0 border-b-2 border-gray-200 w-full">
//           <h2
//             className={`p-1 ${
//               page === "FM" &&
//               `bg-white font-medium text-blue-500 shadow-custom-all-sides`
//             } rounded-t-md px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
//             onClick={() => setPage("FM")}
//           >
//             FM
//           </h2>
//           <h2
//             className={`p-1 ${
//               page === "Project" &&
//               "bg-white font-medium text-blue-500 shadow-custom-all-sides"
//             } rounded-t-md px-4 cursor-pointer transition-all duration-300 ease-linear`}
//             onClick={() => setPage("Project")}
//           >
//             Project
//           </h2>
//         </div>
//       </div>
//       <div>
//         {page === "FM" && (
//           <div className="ml-2 mt-2 mx-2">
//              <div className="flex mt-5">
//              <select
//         name="condition"
//         id="condition"
//         className="border p-2 rounded-md border-black w-64 h-10"
//         value={selectedOption}
//         onChange={handleChange}
//       >
//         <option value="">Select Unit</option>
//         <option value="between">Between</option>
//         <option value="greaterThan">Greater than</option>
//         <option value="greaterThanEqual">Greater than Equal</option>
//       </select>

//       {selectedOption === 'between' && (
//         <div className="flex gap-2">
//           <input
//             type="text"
//             className="border p-2 rounded-md border-black w-64 ml-4 h-10 "
//             placeholder="Enter cost"
//           />
//           <input
//             type="text"
//             className="border p-2 rounded-md border-black w-64 ml-4 h-10 "
//             placeholder="Enter cost"
//           />
//         </div>
//       )}

//       {(selectedOption === 'greaterThan' || selectedOption === 'greaterThanEqual') && (
//         <div>
//           <input
//             type="text"
//             className="border p-2 rounded-md border-black w-64 ml-4 h-10 "
//             placeholder="Enter cost"
//           />
//         </div>
//       )}

           
//               <div className=" gap-50 w-2/3  ml-10 mb-5">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr>
//                       <th className="border border-gray-300 bg-gray-100 px-4 py-2">
//                         Levels
//                       </th>
//                       <th className="border border-gray-300 bg-gray-100 px-4 py-2">
//                         Approvers
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td className="border border-gray-300 px-4 py-2 text-center">L1</td>
//                       <td className="border border-gray-300 px-4 py-2 text-center">
//                         <select
//                           className="border p-2 rounded-md border-black w-full"
//                           onChange={(e) => handleApproverChange("L1", e.target.value)}
//                         >
//                           <option value="">Select Users</option>
//                           {users.map(user => (
//                             <option key={user._id} value={user.name}>
//                               {user.name}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="border border-gray-300 px-4 py-2 text-center">L2</td>
//                       <td className="border border-gray-300 px-4 py-2 text-center">
//                       <select
//                           name=""
//                           id=""
//                           className="border p-2 rounded-md border-black w-full"
//                         ><option value="">Select Users</option>
//                         <option value="">Mittu</option>
//                         <option value="">Panda</option></select>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="border border-gray-300 px-4 py-2 text-center">L3</td>
//                       <td className="border border-gray-300 px-4 py-2 text-center">
//                       <select
//                           name=""
//                           id=""
//                           className="border p-2 rounded-md border-black w-full"
//                         ><option value="">Select Users</option>
//                         <option value="">Mittu</option>
//                         <option value="">Panda</option></select>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="border border-gray-300 px-4 py-2 text-center">L4</td>
//                       <td className="border border-gray-300 px-4 py-2 text-center">
//                       <select
//                           name=""
//                           id=""
//                           className="border p-2 rounded-md border-black w-full"
//                         ><option value="">Select Users</option>
//                         <option value="">Mittu</option>
//                         <option value="">Panda</option></select>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="border border-gray-300 px-4 py-2 text-center">L5</td>
//                       <td className="border border-gray-300 px-4 py-2 text-center">
//                       <select
//                           name=""
//                           id=""
//                           className="border p-2 rounded-md border-black w-full"
//                         ><option value="">Select Users</option>
//                         <option value="">Mittu</option>
//                         <option value="">Panda</option></select>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//                 <hr />
//                 &nbsp;
//                 <div className="flex justify-center">
//                 <button
//                   className="border-2 font-semibold hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
//                   style={{ background:themeColor }}
//                 >
//                   Submit
//                 </button></div>
//               </div>
//             </div>
           
//             <div className="ml-10 mt-3 mb-8 mr-12">
//               <p className="font-semibold">Rule 1</p>
//               <div className="flex justify-end gap-x-60 mb-2">
//                 <FaTrash/>
//               </div>

//               <Table
//           responsive
//           //   selectableRows
//           columns={columns}
//           data={data}
//           isPagination={true}
//         />
//             </div>
//           </div>
//         )}
//         {page === "Project" && (
//           <div className="ml-2 mt-2">
//             <div className="flex mt-5">
//             <select
//         name="condition"
//         id="condition"
//         className="border p-2 rounded-md border-black w-64 h-10"
//         value={selectedOption}
//         onChange={handleChange}
//       >
//         <option value="">Select Unit</option>
//         <option value="between">Between</option>
//         <option value="greaterThan">Greater than</option>
//         <option value="greaterThanEqual">Greater than Equal</option>
//       </select>

//       {selectedOption === 'between' && (
//         <div className="flex gap-2">
//           <input
//             type="text"
//             className="border p-2 rounded-md border-black w-64 ml-4 h-10 "
//             placeholder="Enter cost"
//           />
//           <input
//             type="text"
//             className="border p-2 rounded-md border-black w-64 ml-4 h-10 "
//             placeholder="Enter cost"
//           />
//         </div>
//       )}

//       {(selectedOption === 'greaterThan' || selectedOption === 'greaterThanEqual') && (
//         <div>
//           <input
//             type="text"
//             className="border p-2 rounded-md border-black w-64 ml-4 h-10 "
//             placeholder="Enter cost"
//           />
//         </div>
//       )}

           
//               <div className=" gap-50 w-2/3  ml-10 mb-5">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr>
//                       <th className="border border-gray-300 bg-gray-100 px-4 py-2">
//                         Levels
//                       </th>
//                       <th className="border border-gray-300 bg-gray-100 px-4 py-2">
//                         Approvers
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td className="border border-gray-300 px-4 py-2 text-center">L1</td>
//                       <td className="border border-gray-300 px-4 py-2 text-center">
//                         <select
//                           name=""
//                           id=""
//                           className="border p-2 rounded-md border-black w-full"
//                         ><option value="">Select Users</option>
//                         <option value="">Mittu</option>
//                         <option value="">Panda</option></select>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="border border-gray-300 px-4 py-2 text-center">L2</td>
//                       <td className="border border-gray-300 px-4 py-2 text-center">
//                       <select
//                           name=""
//                           id=""
//                           className="border p-2 rounded-md border-black w-full"
//                         ><option value="">Select Users</option>
//                         <option value="">Mittu</option>
//                         <option value="">Panda</option></select>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="border border-gray-300 px-4 py-2 text-center">L3</td>
//                       <td className="border border-gray-300 px-4 py-2 text-center">
//                       <select
//                           name=""
//                           id=""
//                           className="border p-2 rounded-md border-black w-full"
//                         ><option value="">Select Users</option>
//                         <option value="">Mittu</option>
//                         <option value="">Panda</option></select>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="border border-gray-300 px-4 py-2 text-center">L4</td>
//                       <td className="border border-gray-300 px-4 py-2 text-center">
//                       <select
//                           name=""
//                           id=""
//                           className="border p-2 rounded-md border-black w-full"
//                         ><option value="">Select Users</option>
//                         <option value="">Mittu</option>
//                         <option value="">Panda</option></select>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="border border-gray-300 px-4 py-2 text-center">L5</td>
//                       <td className="border border-gray-300 px-4 py-2 text-center">
//                       <select
//                           name=""
//                           id=""
//                           className="border p-2 rounded-md border-black w-full"
//                         ><option value="">Select Users</option>
//                         <option value="">Mittu</option>
//                         <option value="">Panda</option></select>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//                 <hr />
//                 &nbsp;
//                 <div className="flex justify-center">
//                 <button
//                   className="border-2 font-semibold hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
//                   style={{ background:themeColor}}
//                 >
//                   Submit
//                 </button></div>
//               </div>
//             </div>
//             {/* <div className="flex gap-7 ml-10">
//           <label htmlFor="" className="font-semibold">Filter</label>
//           <select name="" id="" className="border p-2 rounded-md border-black w-48"></select>
//           <button
//  className="border-2 font-semibold hover:bg-green-500 hover:text-white transition-all border-green-500 p-2 rounded-md text-green-500 cursor-pointer text-center flex items-center gap-2 justify-center"
//  style={{ height: "1cm" }}
//       >
//         Apply
//       </button>
//       <button
//  className="border-2 font-semibold hover:bg-blue-500 hover:text-white transition-all border-blue-500 p-2 rounded-md text-blue-500 cursor-pointer text-center flex items-center gap-2 justify-center"
//  style={{ height: "1cm" }}
//       >
//         Reset
//       </button>
//       </div> */}
//             <div className="ml-10 mt-3 mb-8 mr-12">
//               {/* <p className="font-semibold">Rule 1</p> */}
//               {/* <div className="flex justify-end gap-x-60 mb-1">
//    <BiEdit />
//  </div> */}

//               {/* <table class="w-full border-collapse table-center">
         
//      <thead>
//        <tr>
//          <th class="border border-gray-300 bg-gray-100 px-4 py-2">Cost Ranges</th>
//          <th class="border border-gray-300 bg-gray-100 px-4 py-2">Levels</th>
//          <th class="border border-gray-300 bg-gray-100 px-4 py-2">Approvers</th>
//        </tr>
//      </thead>
//      <tbody>
//        <tr>
//          <td class="border border-gray-300 px-4 py-2 text-center" rowspan="5">500-600</td>
//          <td class="border border-gray-300 px-4 py-2">E1</td>
//          <td class="border border-gray-300 px-4 py-2">Deepak Gupta</td>
//        </tr>
//        <tr>
//          <td class="border border-gray-300 px-4 py-2">E2</td>
//          <td class="border border-gray-300 px-4 py-2"></td>
//        </tr>
//        <tr>
//          <td class="border border-gray-300 px-4 py-2">E3</td>
//          <td class="border border-gray-300 px-4 py-2"></td>
//        </tr>
//        <tr>
//          <td class="border border-gray-300 px-4 py-2">E4</td>
//          <td class="border border-gray-300 px-4 py-2"></td>
//        </tr>
//        <tr>
//          <td class="border border-gray-300 px-4 py-2">E5</td>
//          <td class="border border-gray-300 px-4 py-2"></td>
//        </tr>
//      </tbody>
//    </table> */}
//             </div>
//           </div>
//         )}
//         {/* {page === "Setup" &&  <TicketSetupPage/>}
//     {page === "Escalation Setup" &&  <TicketEscalationSetup/>}
//     {page === "Cost Approval" &&  <TicketCostApprovalSetup/>} */}
//         {/* {page === "Permit Activity" &&  <PermitActivityTable/>}
//       {page === "Permit Sub Activity" &&  <PermitSubActivityTable/>}
//       {page === "Permit Hazard Category" &&  <PermitHazardCategoryTable/>}
//       {page === "Permit Risk" &&  <PermitRiskTable/>} */}
//       </div>
//     </div>
//   );
// };

// export default TicketCostApprovalSetup;


import  { useEffect, useState } from "react";
import ToggleSwitch from "../../../Buttons/ToggleSwitch";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Table from "../../../components/table/Table";
// import Navbar from "../../components/Navbar";
import { getItemInLocalStorage } from "../../../utils/localStorage";

import {
  getCostApprovalUsers,
  getCostApprovalRules,
  createCostApprovalRule,
  deleteCostApprovalRule,
} from "../../../api";


const levelsList = ["L1", "L2", "L3", "L4", "L5"];

const TicketCostApprovalSetup = () => {

  const siteId = getItemInLocalStorage("SITEID");
  const userId = getItemInLocalStorage("USERID"); // or EMPID if needed


  const themeColor = useSelector((state) => state.theme.color);

  const [page, setPage] = useState("FM");
  const [users, setUsers] = useState([]);
  const [rules, setRules] = useState([]);

  const [condition, setCondition] = useState("");
  const [minCost, setMinCost] = useState("");
  const [maxCost, setMaxCost] = useState("");

  const [approvers, setApprovers] = useState({
    L1: "",
    L2: "",
    L3: "",
    L4: "",
    L5: "",
  });

  /* ================= FETCH USERS ================= */
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await getCostApprovalUsers(siteId);
      setUsers(res);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };
  fetchUsers();
}, [siteId]);

   
  /* ================= FETCH RULES ================= */
  const fetchRules = async () => {
  try {
    const res = await getCostApprovalRules(page,siteId);
    setRules(res);
  } catch (error) {
    console.error("Error fetching rules", error);
  }
};


  useEffect(() => {
    fetchRules();
  }, [page]);

  /* ================= HANDLERS ================= */
  const handleApproverChange = (level, value) => {
    setApprovers((prev) => ({ ...prev, [level]: value }));
  };

 const handleSubmit = async () => {
  const payload = {
    site_id: siteId,
    created_by: userId,
    type: page,
    condition,
    minCost,
    maxCost: condition === "between" ? maxCost : null,
    levels: levelsList.map((lvl) => ({
      level: lvl,
      approver: approvers[lvl],
    })),
  };

  try {
    await createCostApprovalRule(payload);
    fetchRules();

    setCondition("");
    setMinCost("");
    setMaxCost("");
    setApprovers({ L1: "", L2: "", L3: "", L4: "", L5: "" });
  } catch (error) {
    console.error("Error creating rule", error);
  }
};


 const handleDelete = async (id) => {
  try {
    await deleteCostApprovalRule(id);
    fetchRules();
  } catch (error) {
    console.error("Error deleting rule", error);
  }
};


  /* ================= TABLE DATA ================= */
  const columns = [
    {
      name: "Cost Range",
      selector: (row) => row.cost,
    },
    {
      name: "Level",
      selector: (row) => row.level,
    },
    {
      name: "Approver",
      selector: (row) => row.approver,
    },
    {
      name: "Action",
      cell: (row) => (
        <FaTrash
          className="cursor-pointer text-red-500"
          onClick={() => handleDelete(row.ruleId)}
        />
      ),
    },
  ];

  const tableData = rules.flatMap((rule) =>
    rule.levels.map((l) => ({
      ruleId: rule._id,
      cost:
        rule.condition === "between"
          ? `${rule.minCost} - ${rule.maxCost}`
          : `> ${rule.minCost}`,
      level: l.level,
      approver: l.approver,
    }))
  );

  return (
    <div className="w-full my-2 flex flex-col">
      {/* ===== Approval Level ===== */}
      <div className="flex gap-5 justify-center">
        <label className="font-medium">Approval Level :</label>
        <div className="flex gap-4">
          <label>Access Level</label>
          <ToggleSwitch />
          <label>User Level</label>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div className="flex gap-2 p-2 border-b-2">
        {["FM", "Project"].map((t) => (
          <h2
            key={t}
            className={`p-1 px-4 cursor-pointer rounded-t-md ${
              page === t && "bg-white text-blue-500 font-medium shadow"
            }`}
            onClick={() => setPage(t)}
          >
            {t}
          </h2>
        ))}
      </div>

      {/* ===== FORM ===== */}
      <div className="flex mt-5 ml-2">
        <select
          className="border p-2 rounded-md w-64"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option value="">Select Condition</option>
          <option value="between">Between</option>
          <option value="greaterThan">Greater Than</option>
          <option value="greaterThanEqual">Greater Than Equal</option>
        </select>

        <input
          type="number"
          className="border p-2 rounded-md w-64 ml-4"
          placeholder="Min Cost"
          value={minCost}
          onChange={(e) => setMinCost(e.target.value)}
        />

        {condition === "between" && (
          <input
            type="number"
            className="border p-2 rounded-md w-64 ml-4"
            placeholder="Max Cost"
            value={maxCost}
            onChange={(e) => setMaxCost(e.target.value)}
          />
        )}
      </div>

      {/* ===== LEVEL APPROVERS ===== */}
      <div className="w-2/3 ml-10 mt-5">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Level</th>
              <th className="border px-4 py-2">Approver</th>
            </tr>
          </thead>
          <tbody>
            {levelsList.map((lvl) => (
              <tr key={lvl}>
                <td className="border px-4 py-2 text-center">{lvl}</td>
                <td className="border px-4 py-2">
                  <select
                    className="border p-2 rounded-md w-full"
                    value={approvers[lvl]}
                    onChange={(e) =>
                      handleApproverChange(lvl, e.target.value)
                    }
                  >
                    <option value="">Select User</option>
                    {users.map((u) => (
                      <option key={u._id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmit}
            className="border-2 p-2 rounded-md text-white font-semibold"
            style={{ background: themeColor }}
          >
            Submit
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="ml-10 mt-8 mr-12">
        <Table columns={columns} data={tableData} isPagination />
      </div>
    </div>
  );
};

export default TicketCostApprovalSetup;
