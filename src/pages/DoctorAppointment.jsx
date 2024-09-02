import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { BsEye } from "react-icons/bs";
import Navbar from "../components/Navbar";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import Table from "../components/table/Table";
import { useSelector } from "react-redux";
import { getDocAppointmentList } from "../api";
import { getItemInLocalStorage } from "../utils/localStorage";

const DoctorAppointment = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [page, setPage] = useState("upcoming");
  const [cancelModal,setCancelModal] = useState(false)
  const columns = [
    {
      name: "Patient Name",
      selector: (row) => row.consultation_for.full_name,
      sortable: true,
    },
    {
      name: "Doctor",
      selector: (row) =>
        ` ${row.doctor_id.firstname} ${row.doctor_id.lastname}`,
      sortable: true,
    },

    {
      name: "Appointment Date",
      selector: (row) => row.appointment_date,
      sortable: true,
    },
    {
      name: "Appointment Time",
      selector: (row) => row.doctor_slot.slots,
      sortable: true,
    },
    {
      name: "Reason",
      selector: (row) => row.reason_for_consultation,
      sortable: true,
    },

    // {
    //   name: "Approval",
    //   selector: (row) => (row.status === "Upcoming" &&
    //   <div className="flex justify-center gap-2">
    //       <button className="text-green-400 font-medium hover:bg-green-400 hover:text-white transition-all duration-200 p-1 rounded-full"><TiTick size={20} /></button>
    //
    //   </div>
    // ),
    //   sortable: true,
    // },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/doc-appointment-details/${row.id}`}>
            <BsEye title="View details" size={15} />
          </Link>
          <button
            className="text-red-400 font-medium hover:bg-red-400 hover:text-white transition-all duration-200 p-1 rounded-full"
            title="Cancel"
          >
            <IoClose size={20} />
          </button>
        </div>
      ),
    },
  ];
  const cancelledColumns = [
    {
      name: "Patient Name",
      selector: (row) => row.consultation_for.full_name,
      sortable: true,
    },
    {
      name: "Doctor",
      selector: (row) =>
        ` ${row.doctor_id.firstname} ${row.doctor_id.lastname}`,
      sortable: true,
    },

    {
      name: "Appointment Date",
      selector: (row) => row.appointment_date,
      sortable: true,
    },
    {
      name: "Appointment Time",
      selector: (row) => row.doctor_slot?.slots,
      sortable: true,
    },
    {
      name: "Reason",
      selector: (row) => row.reason_for_consultation,
      sortable: true,
    },
    {
      name: "Cancellation Reason",
      selector: (row) => row.cancellation_reason,
      sortable: true,
    },

    // {
    //   name: "Approval",
    //   selector: (row) => (row.status === "Upcoming" &&
    //   <div className="flex justify-center gap-2">
    //       <button className="text-green-400 font-medium hover:bg-green-400 hover:text-white transition-all duration-200 p-1 rounded-full"><TiTick size={20} /></button>
    //
    //   </div>
    // ),
    //   sortable: true,
    // },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/doc-appointment-details/${row.id}`}>
            <BsEye title="View details" size={15} />
          </Link>
          {/* <button
            className="text-red-400 font-medium hover:bg-red-400 hover:text-white transition-all duration-200 p-1 rounded-full"
            title="Cancel"
          >
            <IoClose size={20} />
          </button> */}
        </div>
      ),
    },
  ];

  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [appointmentUpcoming, setAppointmentUpcoming] = useState([]);

  const [appointmentDoctor, setAppointmentDoctor] = useState("Upcoming");
  const user_id = getItemInLocalStorage("VIBEUSERID");
  const fetchConsultationLists = async () => {
    try {
      const response = await getDocAppointmentList(user_id);
      if (response.success === true) {
        console.log(response.data);
        setAppointmentDetails(response.data);
        setAppointmentUpcoming(response.data.upcoming);
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchConsultationLists();
  }, []);

  return (
    <section className="flex">
      <Navbar />
      <div className=" w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex md:flex-row flex-col gap-5  justify-between mt-10 my-2 border-b border-gray-300">
          <div className="flex gap-4  ">
            <h2
              className={`cursor-pointer transition-all duration-200 ${
                page === "upcoming" ? "border-black border-b-2 font-medium" : ""
              }`}
              onClick={() => setPage("upcoming")}
            >
              Upcoming
            </h2>
            <h2
              className={`cursor-pointer transition-all duration-200 ${
                page === "completed"
                  ? "border-black border-b-2 font-medium"
                  : ""
              }`}
              onClick={() => setPage("completed")}
            >
              Completed
            </h2>
            <h2
              className={`cursor-pointer transition-all duration-200 ${
                page === "cancelled"
                  ? "border-black border-b-2 font-medium"
                  : ""
              }`}
              onClick={() => setPage("cancelled")}
            >
              Cancelled
            </h2>
          </div>
          <Link
            style={{ background: themeColor }}
            to={"/doctor-appointments/book-doc-appointment"}
            className=" font-semibold hover:bg-black text-white duration-150 transition-all k p-2 rounded-sm cursor-pointer text-center flex items-center  gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Book an Appointment
          </Link>
        </div>
        {page === "upcoming" && (
          <Table responsive columns={columns} data={appointmentUpcoming} />
        )}
        {page === "completed" && (
          <Table responsive columns={columns} data={appointmentUpcoming} />
        )}
        {page === "cancelled" && (
          <Table
            responsive
            columns={cancelledColumns}
            data={appointmentDetails.cancelled}
          />
        )}
      </div>
   
    {cancelModal &&  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
        <div className="bg-white overflow-auto max-h-[70%] w-[30rem] p-4 px-8 flex flex-col rounded-md gap-5">
          <div className="col-md-12">
            <div
              class=""
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "white",
              }}
            >
              <h2 className="text-xl font-medium text-black my-2">
                Cancel Consultation
              </h2>
              {/* <img onClick={closeModal} class=" col-md-1 " src={ClosePopUp} alt="" /> */}
              {/* <span className="btn_clo close" onClick={closeModal}>
              &times;
            </span> */}
            </div>

            <div className="flex flex-col gap-2 ">
              <span className="font-medium">
                Reason for Cancelling Consultation
              </span>

              <textarea
                className="border border-gray-400 rounded-md p-2"
                spellCheck={true}
                rows={6}
                // value={cancellationReason}
                // onChange={(e) => setCancellationReason(e.target.value)}
              ></textarea>
            </div>
            {/* <button
            className="pr-3 pl-3 p-1 mr-2 ml-2"
            // onClick={() => Reschedule(single.id, cancellationReason)}
          >
            <span style={{ color: "white" }}>Reschedule</span>
          </button> */}

            <div
              className="mt-2 gap-2"
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="bg-green-400 text-white  p-1 px-2 rounded-md"
                // onClick={() => Cancel_Consultation()}
              >
                <span>Done</span>
              </button>
              <button
                className="bg-red-400 text-white p-1 px-2 rounded-md"
                // onClick={closeModal}
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>}
    
    </section>
  );
};

export default DoctorAppointment;
