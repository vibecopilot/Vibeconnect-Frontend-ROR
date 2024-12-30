import React from "react";
import { useSelector } from "react-redux";

const EmployeeOutstationDetails = () => {
  const themeColor = useSelector((state) => state.theme.color);
  return (
    <section>
      <div>
        <h2
          style={{ background: themeColor }}
          className="text-center w-screen bg-black text-white my-1 font-semibold  text-lg p-2 px-4 "
        >
          Outstation Details
        </h2>
        <div className="grid grid-cols-3 gap-5 m-2 border bg-blue-50 rounded-md p-2">
          <div className="grid grid-cols-2">
            <p className="font-medium">Booking ID :</p>
            <p>1234</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Employee :</p>
            <p>emp</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Department :</p>
            <p>IT</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Destination :</p>
            <p>Mumbai</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Departure Date :</p>
            <p>10/05/2024</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Return Date :</p>
            <p>23/05/2024</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">No. of passengers :</p>
            <p>1</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Passengers :</p>
            <p>1</p>
          </div>
        </div>
        <h2
          style={{ background: themeColor }}
          className="text-center w-screen bg-black text-white my-1 font-semibold  text-lg p-2 px-4 "
        >
          Additional Info
        </h2>
        <div className="m-2">
          <p className="font-medium my-1">Purpose :</p>
          <p className="bg-gray-50 p-2 rounded-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            vitae ullamcorper odio. Quisque ac scelerisque erat. Cras sed enim
            sit amet urna luctus maximus at non erat. Pellentesque interdum leo
            vestibulum volutpat pellentesque. Curabitur nec tortor ac nulla
            aliquam mattis. Etiam malesuada ligula ac nibh efficitur, non ornare
            orci porttitor. Praesent imperdiet sapien nec quam imperdiet, ac
            rutrum mi porttitor. Etiam in odio lectus. Nam at vestibulum neque.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EmployeeOutstationDetails;
