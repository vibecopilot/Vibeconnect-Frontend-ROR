import React from 'react'
import { Link } from 'react-router-dom'
import {BsFillChatRightTextFill} from 'react-icons/bs'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import AdminHRMS from '../../AdminHrms/AdminHrms'


const EmployeeHrmsCommunication = () => {
    const themeColor = useSelector((state) => state.theme.color)
  return (
    <section className='flex'>
      <AdminHRMS/>
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex justify-center my-2">
          <div className="sm:flex grid grid-cols-2 sm:flex-row gap-5 font-medium p-2 sm:rounded-full rounded-md opacity-90 bg-gray-200 ">
            
            {/* Broadcast - Active */}
            <NavLink
              to={"/admin/hrms/broadcast"}
              className={({ isActive }) =>
                `md:rounded-full px-4 cursor-pointer text-center transition-all duration-300 ease-linear ${
                  isActive && "bg-white text-blue-500 shadow-custom-all-sides"
                }`
              }
            >
              Announcement
            </NavLink>
            
            
            
            {/* Forum - Active */}
            {/* <NavLink
              to={"/admin/hrms/formus"}
              className={({ isActive }) =>
                `md:rounded-full px-4 cursor-pointer text-center transition-all duration-300 ease-linear ${
                  isActive && "bg-white text-blue-500 shadow-custom-all-sides"
                }`
              }
            >
              Forum
            </NavLink> */}
             {/* <div className="md:rounded-full px-4 cursor-not-allowed text-center text-gray-400">
              Forum
            </div> */}
            
           
          </div>
          
          <Link to={`/employee/employee-communication-chatbot`}>
            <div className="fixed bottom-10 right-5">
              <BsFillChatRightTextFill size={36} color={themeColor}/>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default EmployeeHrmsCommunication

