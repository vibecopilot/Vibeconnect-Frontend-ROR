import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaQrcode } from "react-icons/fa";
import { BiEditAlt } from "react-icons/bi";
import { getRegisteredVehicle } from "../../api";

const RVehiclesView = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState({});

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await getRegisteredVehicle({ id });

        const data =
          res?.data?.registered_vehicle ||
          res?.data ||
          {};

        setVehicle(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVehicle();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <section>
      <div className="m-2">

        {/* Header */}
        <h2
          className="text-center text-xl font-bold p-2 rounded-full text-white"
          style={{
            background:
              "linear-gradient(to right, #4f46e5, #9333ea, #f59e0b)",
          }}
        >
          Registered Vehicle Details
        </h2>

        <div className="my-2 md:border-2 p-4 rounded-md border-gray-300 md:mx-20">

          {/* Buttons */}
          <div className="flex gap-3 justify-end mb-4">

            <button
              className="flex gap-2 items-center border-2 border-black px-4 py-1 rounded-full hover:bg-black hover:text-white transition"
            >
              <FaQrcode />
              QR Code
            </button>

            <Link
              to={`/admin/edit-rvehicle/${vehicle.id}`}
              className="flex gap-2 items-center border-2 border-black px-4 py-1 rounded-full hover:bg-black hover:text-white transition"
            >
              <BiEditAlt />
              Edit Details
            </Link>

          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-3 gap-6 bg-gray-100 p-5 rounded-md text-sm font-medium">

            <div className="grid grid-cols-2">
              <p>Slot Name :</p>
              <p>{vehicle.slot_number || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p>Vehicle Category :</p>
              <p>{vehicle.vehicle_category || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p>Vehicle Type :</p>
              <p>{vehicle.vehicle_type || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p>Sticker Number :</p>
              <p>{vehicle.sticker_number || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p>Category :</p>
              <p>{vehicle.category || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p>Registration No :</p>
              <p>{vehicle.vehicle_number || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p>Active/Inactive :</p>
              <p>{vehicle.active ? "Active" : "Inactive"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p>Insurance Number :</p>
              <p>{vehicle.insurance_number || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p>Insurance Valid Till :</p>
              <p>{vehicle.insurance_valid_till || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p>Person Name :</p>
              <p>{vehicle.person_name || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p>Created by :</p>
              <p>{vehicle.created_by || "-"}</p>
            </div>

            <div className="grid grid-cols-2">
              <p>Created on :</p>
              <p>{formatDate(vehicle.created_at)}</p>
            </div>

            <div className="grid grid-cols-2">
              <p>Updated on :</p>
              <p>{formatDate(vehicle.updated_at)}</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default RVehiclesView;