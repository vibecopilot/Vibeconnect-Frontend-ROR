import React, { useEffect, useState } from 'react'
import { EmployeeHrmsLogs } from '../../api'
import { useParams } from 'react-router-dom'
import EmployeeSections from './EmployeeSections'
import EditEmployeeDirectory from './EditEmployeeDirectory'
import { getItemInLocalStorage } from '../../utils/localStorage'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const EmployeeLogs = () => {
    const hrmsOrgId = getItemInLocalStorage("HRMSORGID")
    const {id} = useParams()
    const [logs, setLogs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchLogs = async () => {
        try {
            const logsData = await EmployeeHrmsLogs(hrmsOrgId, id)
            console.log(logsData)
            setLogs(logsData)
            setIsLoading(false)
            
        } catch (error) {
            console.log("Error Displaying employee Logs", error)
            setError(error.message)
            setIsLoading(false)
            toast.error("No logs found")
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [hrmsOrgId, id])

    return (
        <div className='flex flex-col ml-20'>
            <EditEmployeeDirectory/>
            <div className='flex'>
                <EmployeeSections empId={id}/>
                <div className='w-full mt-5 p-5 rounded-md'> 
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className='font-bold text-xl mb-6'>Employee Logs</h2>
                        
                        {/* Loading state inside the logs container */}
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center h-64 text-red-500">
                               No logs available for this employee
                            </div>
                        ) : !logs || logs.length === 0 ? (
                            <div className="flex justify-center items-center h-64">
                                No logs available for this employee
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {logs.map((log) => (
                                    <div key={log.id} className='p-4 border-2 border-gray-300 rounded-lg shadow-md'>
                                        <div className='flex flex-col'>
                                            <h3 className='font-bold text-2xl mb-1'>
                                                Password Reset
                                            </h3>
                                            <span className="text-md text-gray-500">
                                                {format(new Date(log.reset_time), 'PPpp')}
                                            </span>
                                        </div>
                                        <div>
                                            <p className='mt-2'>
                                                <span className="font-medium">Employee:- </span> {log.employee_name}
                                            </p>
                                            <p>
                                                <span className="font-medium">Reset by:- </span> 
                                                {log.reset_by_name ? log.reset_by_name : 'System'}
                                            </p>
                                            
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeLogs