import { useState } from "react";
import { Switch } from "antd";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Table from "../../../components/table/Table";
import { BiEdit } from "react-icons/bi";
import AddLocationModal from "./AddLocationModal";

function AttendanceRegularization() {
  const [ipRestriction, setIpRestriction] = useState(false);
  const [mobileRestriction, setMobileRestriction] = useState(true);
  const [locationType, setLocationType] = useState("template");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const themeColor = useSelector((state) => state.theme.color);
  const columns = [
    {
      name: "Location Name",
      selector: (row) => row.Location,
      sortable: true,
    },
    {
      name: "Latitude",
      selector: (row) => row.Label,
      sortable: true,
    },
    {
      name: "Longitude",
      selector: (row) => row.City,
      sortable: true,
    },
    {
      name: "Radius",
      selector: (row) => row.State,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button>
            <BiEdit size={15} />
          </button>
          <button className="text-red-400">
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  const data = [
    {
      Label: 72.837005,
      Location: "BPCGoregaon",
      City: 19.159133,
      State: 75,
    },
  ];

  const [ipAddresses, setIpAddresses] = useState([""]);

  const handleAddIP = () => {
    setIpAddresses([...ipAddresses, ""]);
  };

  const handleIPChange = (index, value) => {
    const updatedIPs = ipAddresses.map((ip, i) => (i === index ? value : ip));
    setIpAddresses(updatedIPs);
  };

  const handleDeleteIP = (index) => {
    const updatedIPs = ipAddresses.filter((_, i) => i !== index);
    setIpAddresses(updatedIPs);
  };

  return (
    <div className="w-full p-2  ">
      <div className="space-y-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="ip-restriction" className="text-sm font-medium">
              Would you like to restrict the IP address that the employee can
              check-in/check-out?
            </label>
            <Switch
              id="ip-restriction"
              checked={ipRestriction}
              onChange={() => setIpRestriction(!ipRestriction)}
            />
          </div>

          {ipRestriction && (
            <div className="bg-white p-4 rounded-md flex flex-col gap-2 border space-y-4">
              <h2 className="text-lg font-semibold">IP Configurations</h2>
              <p className="text-sm text-gray-600">
                Please enter the all IP addresses that the employee can log in
                from to check-in/check-out
              </p>
              {ipAddresses.map((ip, index) => (
                <div key={index} className="flex items-center w-full space-x-2">
                  <input
                    type="text"
                    placeholder="Allowed IP Address"
                    value={ip}
                    onChange={(e) => handleIPChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded-md"
                  />
                  <button
                    onClick={() => handleDeleteIP(index)}
                    className="bg-red-500 text-white p-2 rounded-md"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <div>
                <button
                  variant="secondary"
                  onClick={handleAddIP}
                  style={{ background: themeColor }}
                  className="bg-orange-400 text-white hover:bg-orange-500 p-2 rounded-md"
                >
                  Add another IP Address
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="mobile-restriction" className="text-sm font-medium">
              Would you like to restrict locations from which employee can mark
              check in/check out using Mobile?
            </label>
            <Switch
              id="mobile-restriction"
              checked={mobileRestriction}
              // onCheckedChange={}
              onChange={() => setMobileRestriction(!mobileRestriction)}
            />
          </div>

          {mobileRestriction && (
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium mb-2">
                  How would you like to assign Locations for each employee?
                </p>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="template"
                      name="locationType"
                      value="template"
                      checked={locationType === "template"}
                      onChange={(e) => setLocationType(e.target.value)}
                    />
                    <label htmlFor="template">Template Wise</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="employee"
                      name="locationType"
                      value="employee"
                      checked={locationType === "employee"}
                      onChange={(e) => setLocationType(e.target.value)}
                    />
                    <label htmlFor="employee">Employee Wise</label>
                  </div>
                </div>
              </div>

              <div className="bg-white p-2 border border-gray-300 rounded-md ">
                <div className="flex justify-between my-2">
                  <h2 className="text-lg font-semibold ">
                    Location Restrictions
                  </h2>
                  <button
                    variant="secondary"
                    style={{ background: themeColor }}
                    className=" bg-orange-400 text-white hover:bg-orange-500 p-1 px-2 rounded-md"
                    onClick={() => setShowLocationModal(true)}
                  >
                    Add Location
                  </button>
                </div>
                <Table columns={columns} data={data} />
              </div>
            </div>
          )}
        </div>
      </div>
      {showLocationModal && <AddLocationModal onClose={()=> setShowLocationModal(false)} />}
    </div>
  );
}

export default AttendanceRegularization;
