// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import Navbar from "../../components/Navbar";
// import Communication from "../Communication";
// import { getPolls } from "../../api";
// import { PiPlusCircleBold } from "react-icons/pi";

// function Polls() {
//   const themeColor = useSelector((state) => state.theme.color);
//   const [pollsData, setPollsData] = useState([]);

//   useEffect(() => {
//     const fetchPolls = async () => {
//       try {
//         const response = await getPolls();
//         const poll = response.data.sort((a, b) => {
//           return new Date(b.created_at) - new Date(a.created_at);
//         });
//         console.log("response from api", response);

//         setPollsData(poll);
//       } catch (err) {
//         console.error("Failed to fetch polls data:", err);
//       }
//     };

//     fetchPolls(); // Call the API
//   }, []);

//   return (
//     <div className="flex">
//       <Navbar />
//       <div className="p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
//         <Communication />
//         <div className="flex justify-between md:flex-row flex-col my-2 gap-2">
//           <input
//             type="text"
//             placeholder="Search by title"
//             className="border p-2 w-full border-gray-300 rounded-lg"
//           />
//           <Link
//             to={`/admin/create-polls`}
//             style={{ background: themeColor }}
//             className="font-semibold text-white px-4 py-1 flex gap-2 items-center rounded-md"
//           >
//             <PiPlusCircleBold size={20} /> Create
//           </Link>
//         </div>
//         <div className="md:grid grid-cols-2">
//           {pollsData.length > 0 ? (
//             pollsData.map((poll) => {
//               // Calculate total votes for the current poll
//               const totalVotes = poll.poll_options.reduce(
//                 (sum, option) => sum + option.votes,
//                 0
//               );

//               // Calculate remaining days (end_date - start_date)
//               const startDate = new Date(poll.start_date);
//               const endDate = new Date(poll.end_date);
//               const currentDate = new Date();
//               const timeDiff = endDate - currentDate; // Time difference in milliseconds
//               const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days

//               return (
//                 <div className="flex w-full p-2 ">
//                   <div className="max-w-2xl w-full ">
//                     <div className="bg-white shadow-custom-all-sides rounded-lg p-6 h-full">
//                       <div key={poll.id}>
//                         <h2 className="text-xl font-semibold mb-4">
//                           {poll.title}
//                         </h2>
//                         <div className="flex justify-between my-3">
//                           <span className="text-gray-500 text-sm">
//                             1/20 responded
//                           </span>
//                           <span className="text-gray-500 text-sm">
//                             {poll.visibility}
//                           </span>
//                         </div>

//                         {/* Loop through poll options */}
//                         <div className="space-y-4 border-t border-b border-gray-200 py-4">
//                           {poll.poll_options.map((option) => (
//                             <div
//                               key={option.id}
//                               className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
//                             >
//                               <span>{option.content}</span>
//                               <span className="text-blue-600 font-semibold">
//                                 {option.votes} votes
//                               </span>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Display total votes and days left */}
//                         <div className="mt-6 text-gray-500 text-sm">
//                           <p>
//                             {totalVotes} votes •{" "}
//                             {daysLeft > 0 ? `${daysLeft}d left` : "Poll closed"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <p>No polls available</p>
//           )}
//         </div>

//         {/* <div>
//       <h1>Polls Data</h1>
//       <ul>
//         {pollsData.length > 0 ? (
//           pollsData.map((poll) => (
//             <li key={poll.id}>
//               <h2>{poll.title}</h2>
//               <p>{poll.description}</p>
//               <p>Start Date: {poll.start_date}</p>
//               <p>End Date: {poll.end_date}</p>
             
//             </li>
//           ))
//         ) : (
//           <p>No polls available</p>
//         )}
//       </ul>
//     </div> */}
//       </div>
//     </div>
//   );
// }

// export default Polls;




// import React, { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link, useLocation } from "react-router-dom";
// import Navbar from "../../components/Navbar";
// import Communication from "../Communication";
// import { PiPlusCircleBold } from "react-icons/pi";
// import toast from "react-hot-toast";
// import axios from "axios";

// /* ✅ Axios instance OUTSIDE component */
// const api = axios.create({
//   baseURL: "https://admin.vibecopilot.ai",
// });

// function Polls() {
//   const themeColor = useSelector((state) => state.theme.color);
//   const location = useLocation();

//   const [pollsData, setPollsData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const didMountRef = useRef(false); // 🔥 prevents first debounce call

//   // 🔥 FETCH FUNCTION
//   const fetchPolls = async (query = "") => {
//     try {
//       let token = localStorage.getItem("TOKEN");
//       if (!token) {
//         toast.error("Please login again.");
//         return;
//       }

//       if (token.startsWith('"')) {
//         token = JSON.parse(token);
//       }

//       const response = await api.get("/polls.json", {
//         params: query
//           ? { token, "q[title_cont]": query }
//           : { token },
//       });

//       const data = response.data;

//       const pollsArray = Array.isArray(data)
//         ? data
//         : data?.polls || [];

//       const sortedPolls = pollsArray.sort(
//         (a, b) =>
//           new Date(b.created_at || 0) -
//           new Date(a.created_at || 0)
//       );

//       setPollsData(sortedPolls);

//     } catch (error) {
//       console.error("Axios Error:", error);

//       if (error.response?.status === 401) {
//         toast.error("Session expired. Please login again.");
//       } else {
//         toast.error("Failed to fetch polls ❌");
//       }
//     }
//   };

//   /* ✅ 1. Load once on mount */
//   useEffect(() => {
//     fetchPolls();
//   }, []);

//   /* ✅ 2. Refresh after creating poll */
//   useEffect(() => {
//     if (location.state?.refresh) {
//       fetchPolls();
//     }
//   }, [location.state]);

//   /* ✅ 3. Debounced search (skip first render) */
//   useEffect(() => {
//     if (!didMountRef.current) {
//       didMountRef.current = true;
//       return;
//     }

//     const timer = setTimeout(() => {
//       fetchPolls(searchText);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchText]);

//   return (
//     <div className="flex">
//       <Navbar />
//       <div className="p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
//         <Communication />

//         {/* SEARCH + CREATE */}
//         <div className="flex justify-between md:flex-row flex-col my-2 gap-2">
//           <input
//             type="text"
//             placeholder="Search by title"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             className="border p-2 w-full border-gray-300 rounded-lg"
//           />

//           <Link
//             to={`/admin/create-polls`}
//             style={{ background: themeColor }}
//             className="font-semibold text-white px-4 py-1 flex gap-2 items-center rounded-md"
//           >
//             <PiPlusCircleBold size={20} /> Create
//           </Link>
//         </div>

//         {/* POLL LIST */}
//         <div className="md:grid grid-cols-2 gap-4">
//           {pollsData.length > 0 ? (
//             pollsData.map((poll) => {
//               const totalVotes = (poll.poll_options || []).reduce(
//                 (sum, option) => sum + (option.votes || 0),
//                 0
//               );

//               const endDate = poll.end_date
//                 ? new Date(poll.end_date)
//                 : null;

//               const daysLeft = endDate
//                 ? Math.ceil(
//                     (endDate - new Date()) /
//                       (1000 * 60 * 60 * 24)
//                   )
//                 : 0;

//               return (
//                 <div key={poll.id} className="flex w-full p-2">
//                   <div className="max-w-2xl w-full">
//                     <div className="bg-white shadow-custom-all-sides rounded-lg p-6 h-full">
//                       <h2 className="text-xl font-semibold mb-4">
//                         {poll.title}
//                       </h2>

//                       <div className="flex justify-between my-3">
//                         <span className="text-gray-500 text-sm">
//                           {poll.visibility || "Public"}
//                         </span>
//                       </div>

//                       <div className="space-y-4 border-t border-b border-gray-200 py-4">
//                         {(poll.poll_options || []).map((option) => (
//                           <div
//                             key={option.id}
//                             className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
//                           >
//                             <span>{option.content}</span>
//                             <span className="text-blue-600 font-semibold">
//                               {option.votes || 0} votes
//                             </span>
//                           </div>
//                         ))}
//                       </div>

//                       <div className="mt-6 text-gray-500 text-sm">
//                         <p>
//                           {totalVotes} votes •{" "}
//                           {daysLeft > 0
//                             ? `${daysLeft}d left`
//                             : "Poll closed"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <p>No polls available</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Polls;


import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Communication from "../Communication";
import { PiPlusCircleBold } from "react-icons/pi";
import toast from "react-hot-toast";
import axios from "axios";

const api = axios.create({
  baseURL: "https://admin.vibecopilot.ai",
});

function Polls() {
  const themeColor = useSelector((state) => state.theme.color);
  const location = useLocation();

  const [pollsData, setPollsData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const fetchPolls = async (query = "") => {
    try {
      let token = localStorage.getItem("TOKEN");

      if (!token) {
        toast.error("Session expired. Please login again.");
        return;
      }

      if (token.startsWith('"')) {
        token = JSON.parse(token);
      }

      const response = await api.get("/polls.json", {
        params: {
          token: token,
          "q[title_cont]": query || "",
        },
      });

      const data = response.data;

      const pollsArray = Array.isArray(data)
        ? data
        : data?.polls || [];

      const sortedPolls = pollsArray.sort(
        (a, b) =>
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
      );

      setPollsData(sortedPolls);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch polls ❌");
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchPolls();
    }
  }, [location.state]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPolls(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  return (
    <div className="flex">
      <Navbar />
      <div className="p-4 w-full flex flex-col">
        <Communication />

        <div className="flex justify-between my-2 gap-2">
          <input
            type="text"
            placeholder="Search by title"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border p-2 w-full rounded-lg"
          />

          <Link
            to={`/admin/create-polls`}
            style={{ background: themeColor }}
            className="text-white px-4 py-1 flex gap-2 items-center rounded-md"
          >
            <PiPlusCircleBold size={20} /> Create
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {pollsData.length > 0 ? (
            pollsData.map((poll) => (
              <div key={poll.id} className="bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold">
                  {poll.title}
                </h2>

                <div className="mt-2 space-y-2">
                  {(poll.poll_options || []).map((option) => (
                    <div
                      key={option.id}
                      className="flex justify-between bg-gray-50 p-2 rounded"
                    >
                      <span>{option.content}</span>
                      <span>{option.votes || 0} votes</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No polls available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Polls;