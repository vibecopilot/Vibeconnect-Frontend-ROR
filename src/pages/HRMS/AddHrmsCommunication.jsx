import React from 'react'
import AdminHRMS from '../AdminHrms/AdminHrms'
import EmployeeCommunication from '../Employees/EmployeeCommunication/EmployeeCommunication'
import EmployeeHrmsCommunication from '../Employees/EmployeeCommunication/EmployeeHrmsCommunication'
const AddHrmsCommunication = () => {
  return (
    <div className="flex ">
      <AdminHRMS/>
      <div className="p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
        < EmployeeHrmsCommunication/>

        <div className="flex justify-between gap-2 items-center my-2 sm:flex-row flex-col w-full">
          <input
            type="text"
            placeholder="Search by title"
            className="border p-2 w-full border-gray-300 rounded-lg"
            // value={searchText}
            // onChange={handleSearch}
          />
        </div>
        {/* <Table columns={column} data={filteredData} /> */}
      </div>
    </div>
  )
}

export default AddHrmsCommunication
