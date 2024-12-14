import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import FBCuisinesSetup from './FBCuisinesSetup'
import SetupNavbar from '../../components/navbars/SetupNavbar'
import FBFixedStatus from './FBFixedStatus'


const FBMainPage = () => {
  const [page, setPage] = useState("cuisine")
  return (
    <section className="flex">
   <SetupNavbar/>
    <div className=" w-full flex mx-3 flex-col overflow-hidden">
    <div className="flex md:justify-center  my-2">
          <div className="md:flex md:flex-row flex-col gap-5 text-lg font-semibold p-1 md:rounded-full md:w-auto w-full rounded-sm bg-gray-200">
            <h2
              className={`p-1 ${
                page === "cuisine" && "bg-white text-blue-500"
              } md:rounded-full rounded-sm px-4 cursor-pointer text-center text-sm`}
              onClick={() => setPage("cuisine")}
            >
             Cuisines
            </h2>
            <h2
              className={`p-1 ${
                page === "status" && "bg-white text-blue-500"
              } md:rounded-full rounded-sm px-4 cursor-pointer text-center text-sm`}
              onClick={() => setPage("status")}
            >
              Fixed Status
            </h2>
           
          </div>
        </div>
        {page === "cuisine" && (
          <div>
          <FBCuisinesSetup/>
          </div>
        )}
        {page === "status" && (
          <div>
          <FBFixedStatus/>
          </div>
        )}
       
      </div>
    </section>
  )
}




export default FBMainPage
