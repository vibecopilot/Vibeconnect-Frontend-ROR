import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar';
import { IoMdAdd } from 'react-icons/io'
import { Link } from 'react-router-dom';
import { BsEye } from 'react-icons/bs';
import Table from '../../components/table/Table';
import SetupNavbar from '../../components/navbars/SetupNavbar';
import { getHSNSetup } from '../../api';
import { PiPlusCircle } from 'react-icons/pi';

function SACHSNSetup() {
  const [hsndetails, sethsnDetails] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const siteDetailsResp = await getHSNSetup();
        
        sethsnDetails(siteDetailsResp.data);
       
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, []);
    const column = [
        {
          name: "Actions",

          cell: (row) => (
            <div className="flex items-center gap-4">
              <Link to={`/admin/sac-hsn-setup-details/${row.id}`}>
                <BsEye size={15} />
              </Link>
            </div>
          ),
        },
        { name: "Type", selector: (row) => row.hsn_type, sortable: true },
        { name: "Category", selector: (row) => row.category, sortable: true },
        { name: "SAC/HSN Code", selector: (row) => row.code, sortable: true },
        { name: "CGST Rate", selector: (row) => row.cgst_rate, sortable: true },
        { name: "SGST Rate", selector: (row) => row.sgst_rate, sortable: true },
        { name: "IGST Rate", selector: (row) => row.igst_rate, sortable: true },
        { name: "Created By", selector: (row) => row.created_by_name.firstname +" " + row.created_by_name.lastname, sortable: true },
        {
          name: "Created On",
          selector: (row) => new Date(row.created_at).toLocaleDateString(),
          sortable: true
        },
        {
          name: "Updated On",
          selector: (row) => new Date(row.updated_at).toLocaleDateString(),
          sortable: true
        }
        
    ];

    const data = [
        {
          id: 1,
          type: "Services",
          category:"Serv1.1",
          sacHsnCode: "	wertg",
          cgstRate: "9.0%",
          sgstRate: "9.0%",
          igstRate: "18.0%",
          createdBy: "Lockated Demo",
          createdOn: "22/09/2020",
          updatedOn: "22/09/2020",
        },
    ];
  return (
    <section className='flex'>
        <SetupNavbar/>
        <div className='w-full flex mx-3 flex-col overflow-hidden my-8'>
            <div className="flex flex-col sm:flex-row md:justify-between gap-3 my-3">
                <input
                  type="text"
                  placeholder="search"
                  className="border-2 p-2 w-70 border-gray-300 rounded-lg"
                />
                <div className='flex gap-3 sm:flex-row flex-col'>
                    <Link to={`/admin/add-sac-hsn-setup`} className='font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md'>
                     <PiPlusCircle size={20}/> Add
                    </Link>
                </div>
            </div>
            <div className='my-3'>
                <Table 
                  columns={column}
                  data={hsndetails}
                  isPagination={true}
                />
            </div>
        </div>
    </section>
  )
}

export default SACHSNSetup