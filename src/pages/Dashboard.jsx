import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { getTicketDashboard, getVibeCalendar } from "../api";
import { getItemInLocalStorage } from "../utils/localStorage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import wave from "/wave.png";
import HighchartsComponent from "../components/HighCharts";
import TicketDashboard from "./SubPages/TicketDashboard";
import CommunicationDashboard from "./SubPages/CommunicationDashboard";
import SoftServiceHighCharts from "../components/SoftServicesHighCharts";
const Dashboard = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const vibeUserId = getItemInLocalStorage("VIBEUSERID");
const [feat, setFeat] = useState("")
  console.log(vibeUserId);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const calendarResponse = await getVibeCalendar(vibeUserId);
        console.log(calendarResponse);
      } catch (error) {
        console.log(error);
      }
    };
    getAllowedFeatures();
    fetchCalendar();
  }, []);

  const getAllowedFeatures = () => {
    const storedFeatures = getItemInLocalStorage("FEATURES");
    if (storedFeatures) {
      setFeat(storedFeatures.map((feature) => feature.feature_name));
    }
  };

  const toggleFullScreen = () => {
    const element = contentRef.current;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      element.requestFullscreen().catch((err) => {
        console.log(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    }
  };
  // const currentDate = new Date();
  // const datePickerRef = useRef(null);
  // const [dueDate, setDueDate] = useState(null);
  // const handleDateChange1 = async (date) => {
  //   setDueDate(date); // Update the selected date in the state
  //   Update_Task_Duedate(user_id, taskid, date);
  // };



  return (
    <section
      className="flex"
      ref={contentRef}
      //   style={{
      //   background: `url(${wave})`,
      //   // backgroundSize: "100% 100% ",
      //   backgroundSize: "cover",
      //   backgroundRepeat: "no-repeat",
      //   backgroundPosition: "center",
      // }}
    >
      <Navbar />
      <div className=" w-full flex lg:mx-3 flex-col overflow-hidden">
        <header
          style={{ background: themeColor }}
          className="w-full h-10 rounded-md  my-1 flex justify-center items-center "
        >
          <nav>
            <h1 className="text-white text-center text-xl">Vibe Connect</h1>
          </nav>
        </header>
        <div className="m-5">
       
          <TicketDashboard/>
        </div>
        <div className="w-full flex mx-3 flex-col p-2  ">
          <HighchartsComponent />
        </div>
        {feat.includes("soft_services") && (
        <div className="w-full flex mx-3 flex-col p-2  ">
        <h2 className="border-b-2 border-black font-medium mb-10">Soft Services</h2>
         <SoftServiceHighCharts/>
        </div>
        )}
        {feat.includes("communication") && (
        <div className="w-full flex mx-3 flex-col p-2 mb-10 ">
          <h2 className="border-b-2 border-black font-medium">Communication</h2>
          <CommunicationDashboard />
        </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
