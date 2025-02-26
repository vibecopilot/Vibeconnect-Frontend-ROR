import React, { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import { Link, useParams } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../../utils/localStorage";

function SelfRegistration() {
  const themeColor = useSelector((state) => state.theme.color);
  const siteId = getItemInLocalStorage("SITEID");
  const token = getItemInLocalStorage("TOKEN");
  const { id } = useParams();
  console.log(id);
  console.log(siteId);

  // useEffect(() => {
  //   const query = useQuery();
  //   const tokenFromUrl = query.get("token"); // Extract the token
  //   setToken(tokenFromUrl);
  // }, []);

  // const [token, setToken] = useState("");
  const useQuery = () => {
    return new URLSearchParams(window.location.search);
  };

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/passes/self-registration-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/passes/edit-self-registration/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },

    {
      name: "Visitor Type",
      selector: (row) => row.visit_type,
      sortable: true,
    },
    {
      name: " Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Host",
      selector: (row) => row.host,
      sortable: true,
    },
    {
      name: "Contact No.",
      selector: (row) => row.contact_no,
      sortable: true,
    },

    {
      name: "Purpose",
      selector: (row) => row.purpose,
      sortable: true,
    },
    {
      name: "Coming from",
      selector: (row) => row.coming_from,
      sortable: true,
    },
    {
      name: "Expected Date",
      selector: (row) => row.expected_date,
      sortable: true,
    },
    {
      name: "Expected Time",
      selector: (row) => row.expected_time,
      sortable: true,
    },
  ];
  const data = [
    {
      id: 1,
      visit_type: "Business",
      name: "Amit Sharma",
      host: "Mr. Verma",
      contact_no: "9876543210",
      purpose: "Client Meeting",
      coming_from: "Tata Consultancy Services",
      expected_date: "2024-02-10",
      expected_time: "10:30 AM",
    },
    {
      id: 2,
      visit_type: "Personal",
      name: "Priya Mehta",
      host: "Mrs. Kapoor",
      contact_no: "9876543220",
      purpose: "Family Visit",
      coming_from: "Mumbai",
      expected_date: "2024-02-11",
      expected_time: "11:00 AM",
    },
    {
      id: 3,
      visit_type: "Delivery",
      name: "Rajesh Kumar",
      host: "Reception",
      contact_no: "9876543230",
      purpose: "Courier Delivery",
      coming_from: "Blue Dart",
      expected_date: "2024-02-12",
      expected_time: "02:00 PM",
    },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="grid md:grid-cols-2 gap-2 items-center">
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-md placeholder:text-sm"
          placeholder="Search using Visitor name, Host, vehicle number"
        />
        {/* <div className="border md:flex-row flex-col flex p-2 rounded-md text-center border-black">
                <span
                  className={` md:border-r px-2 border-gray-300 cursor-pointer hover:underline ${
                    selectedVisitor === "expected"
                      ? "text-blue-600 underline"
                      : ""
                  } text-center`}
                  onClick={() => handleClick("expected")}
                >
                  <span>Expected visitor</span>
                </span>
                <span
                  className={`cursor-pointer hover:underline ${
                    selectedVisitor === "unexpected"
                      ? "text-blue-600 underline"
                      : ""
                  } text-center`}
                  onClick={() => handleClick("unexpected")}
                >
                  &nbsp; <span>Unexpected visitor</span>
                </span>
              </div> */}
        <div className="flex justify-end">
          <Link
            to={`/admin/passes/add-self-registration/${siteId}?token=${token}`}
            style={{ background: themeColor }}
            className=" font-semibold  hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Add Self-Registration
          </Link>
        </div>
      </div>
      <div className="my-3">
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
}

export default SelfRegistration;
