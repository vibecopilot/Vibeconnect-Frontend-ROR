import React, { useState ,useEffect } from 'react'
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom'
import Table from '../../components/table/Table'
import { BsEye } from "react-icons/bs";
import { FaEdit } from 'react-icons/fa';
import AdminHRMS from '../AdminHrms/AdminHrms'
import EmployeeHrmsCommunication from '../Employees/EmployeeCommunication/EmployeeHrmsCommunication'
import { useNavigate } from 'react-router-dom';




const AddhrmsBroadcast = () => {
    const [searchText, setSearchText] = useState("");
    const [user, setUser] = useState("employee"); // Default to employee, can be changed
    const [filteredData, setFilteredData] = useState([]);
  
    // Mock data instead of API call
    const mockBroadcasts = [
      {
        id: 1,
        notice_title: "Office Closure",
        notice_discription: "The office will be closed on Monday for maintenance",
        CreatedBy: "Admin User",
        created_at: "2023-05-15T10:30:00Z",
        status: "Active",
        expiry_date: "2023-06-15T10:30:00Z"
      },
      {
        id: 2,
        notice_title: "Team Meeting",
        notice_discription: "Monthly team meeting scheduled for Friday at 2PM",
        CreatedBy: "Manager",
        created_at: "2023-05-10T09:15:00Z",
        status: "Active",
        expiry_date: "2023-05-20T09:15:00Z"
      },
      {
        id: 3,
        notice_title: "Policy Update",
        notice_discription: "New HR policies have been updated on the portal",
        CreatedBy: "HR Department",
        created_at: "2023-05-01T14:00:00Z",
        status: "Expired",
        expiry_date: "2023-05-10T14:00:00Z"
      },
      
      
    ];
  
    useEffect(() => {
        setFilteredData(mockBroadcasts);
        setUser("employee");
    }, []);
  
    const dateFormat = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };
  
    const column = [
      {
        name: "Action",
        cell: (row) => (
          <div className='flex gap-4'>
           
           <Link to={'/admin/hrms/broadcast/details/:id'}>
             <BsEye size={15} className='hover:text-green-500 hover:size-5'/>
           </Link>
           <Link to={'/admin/hrms/broadcast/edit-event/:id'}>
             <FaEdit size={15} className='hover:text-green-500 hover:size-5'/>
           </Link>
          </div>
        ),
        
        sortable: true,
      },
      { name: "Title", selector: (row) => row.notice_title, sortable: true },
      {
        name: "Description",
        selector: (row) => row.notice_discription,
        sortable: true,
      },
      { name: "Created By", selector: (row) => row.CreatedBy, sortable: true },
      {
        name: "Created On",
        selector: (row) => dateFormat(row.created_at),
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
      },
      {
        name: "Expiry Date",
        selector: (row) => dateFormat(row.expiry_date),
        sortable: true,
      },
    ];
  
    const handleSearch = (event) => {
        const searchValue = event.target.value;
        setSearchText(searchValue);
        
        if (searchValue === "") {
          setFilteredData(mockBroadcasts);
        } else {
          const filteredResults = mockBroadcasts.filter((item) =>
            item.notice_title.toLowerCase().includes(searchValue.toLowerCase())
          );
          setFilteredData(filteredResults);
        }
      };
      const navigate = useNavigate()
      const toCreate =()=>{
          setTimeout(()=>{
           navigate('/admin/hrms/broadcast/create-broadcast')
          },1500)
      }
  
  return (
    <div className="flex  ml-20">
      {/* <AdminHRMS /> */}
      <div className="p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col ">
        <EmployeeHrmsCommunication />

        <div className="flex justify-between items-center sm:flex-row flex-col my-2 w-full ">
          <input
            type="text"
            placeholder="Search by title"
            className="border p-2 w-full border-gray-300 rounded-lg mr-2"
            value={searchText}
            onChange={handleSearch}
          />
          {user === "employee" && (
            <Link
              to={"create-broadcast"}
              className="bg-black rounded-lg flex font-semibold items-center gap-2 text-white p-3 my-5   "
            >
              <IoAddCircleOutline size={20} />
              Announcement 
            </Link>
          )}
        </div>
        <Table columns={column} data={filteredData} />
      </div>
    </div>
  )
}

export default AddhrmsBroadcast
