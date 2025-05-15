import React, { useEffect, useRef, useState } from 'react';
import AdminHRMS from './AdminHrms';
import Table from '../../components/table/Table';
import { useSelector } from 'react-redux';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';
import { IoIosArrowDown } from 'react-icons/io';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { GetHrmsHolidayDetails, handleDeletHoliday, AddHolidaysDetails, GetHrmsHolidayDetailsId, UpdateHolidaysDetails } from '../../api';
import toast from 'react-hot-toast';
import { getItemInLocalStorage } from "../../utils/localStorage";

const AddHrmsHolidays = () => {
    const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
    const themeColor = useSelector((state) => state.theme.color);
    const [holidaysDetails, setHolidaysDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newHoliday, setNewHoliday] = useState({
        name: "",
        date: "",
        types_of_holiday: "Mandatory",
        applies_to: "All"
    });

    // State for hide columns functionality
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // State for edit functionality
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentHolidayId, setCurrentHolidayId] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const getHolidays = async () => {
        try {
            setLoading(true);
            const response = await GetHrmsHolidayDetails(hrmsOrgId);
            setHolidaysDetails(response);
        } catch (error) {
            console.log("Error getting holidays", error);
            toast.error("Something went wrong getting Holidays");
        } finally {
            setLoading(false);
        }
    }

    const deletHolidays = async (id) => {

            try {
                await handleDeletHoliday(id);
                getHolidays();
                toast.success("Holiday deleted successfully");
            } catch (error) {
                console.log("Error Deleting The Holidays", error);
                toast.error("Failed to delete holiday");
            }
        
    }

    const handleAddHoliday = async () => {
        if (!validateForm()) return;
        
        try {
            await AddHolidaysDetails({
                ...newHoliday,
                organization: hrmsOrgId
            });
            toast.success("Holiday added successfully");
            resetForm();
            getHolidays();
        } catch (error) {
            console.log("Error adding holiday", error);
            toast.error("Failed to add holiday");
        }
    }

    const handleUpdateHoliday = async () => {
        if (!validateForm()) return;
        
        try {
            setModalLoading(true);
            await UpdateHolidaysDetails(currentHolidayId, {
                ...newHoliday,
                organization: hrmsOrgId
            });
            toast.success("Holiday updated successfully");
            resetForm();
            getHolidays();
        } catch (error) {
            console.log("Error updating holiday", error);
            toast.error("Failed to update holiday");
        } finally {
            setModalLoading(false);
        }
    };

    const fetchHolidayDetails = async (id) => {
        try {
            setModalLoading(true);
            const response = await GetHrmsHolidayDetailsId(id);
            setNewHoliday({
                name: response.name,
                date: response.date.split('T')[0],
                types_of_holiday: response.types_of_holiday,
                applies_to: response.applies_to
            });
            setCurrentHolidayId(id);
            setIsEditMode(true);
            setIsModalOpen(true);
        } catch (error) {
            console.log("Error fetching holiday details", error);
            toast.error("Failed to load holiday details");
        } finally {
            setModalLoading(false);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewHoliday(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const resetForm = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentHolidayId(null);
        setNewHoliday({
            name: "",
            date: "",
            types_of_holiday: "Mandatory",
            applies_to: "All"
        });
    }

    const validateForm = () => {
        if (!newHoliday.name.trim()) {
            toast.error("Holiday name is required");
            return false;
        }
        if (!newHoliday.date) {
            toast.error("Date is required");
            return false;
        }
        return true;
    }

    useEffect(() => {
        getHolidays();
    }, []);

    const holidayColumns = [
        "Sr.No",
        "Holiday Name",
        "Date",
        "Type",
        "Applicable To",
        "Created On",
        "Updated On",
        "Action"
    ];

    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        setSelectedOptions((prevSelectedOptions) =>
            prevSelectedOptions.includes(value)
                ? prevSelectedOptions.filter((option) => option !== value)
                : [...prevSelectedOptions, value]
        );
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    const filteredHolidays = holidaysDetails.filter(holiday => 
        holiday.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString();
    };
// advance feature 
const isPastHoliday = (holidayDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(holidayDate);
    return date < today;
};


const columns = [
    {
        name: "Sr.No",
        selector: (row, index) => index + 1,
        sortable: true
    },
    {
        name: "Holiday Name",
        selector: (row) => row?.name,
        sortable: true,
        cell: row => (
            <span className={isPastHoliday(row.date) ? "text-gray-400" : ""}>
                {row.name}
            </span>
        )
    },
    {
        name: "Date",
        selector: (row) => new Date(row.date).toLocaleDateString(),
        sortable: true,
        cell: row => (
            <span className={isPastHoliday(row.date) ? "text-gray-400" : ""}>
                {new Date(row.date).toLocaleDateString()}
            </span>
        )
    },
    {
        name: "Type",
        selector: (row) => row.types_of_holiday,
        sortable: true,
        cell: row => (
            <span className={isPastHoliday(row.date) ? "text-gray-400" : ""}>
                {row.types_of_holiday}
            </span>
        )
    },
    {
        name: "Applicable To",
        selector: (row) => row.applies_to,
        sortable: true,
        cell: row => (
            <span className={isPastHoliday(row.date) ? "text-gray-400" : ""}>
                {row.applies_to}
            </span>
        )
    },
    {
        name: "Created On",
        selector: (row) => formatDateTime(row.created_date),
        sortable: true,
        cell: row => (
            <span className={isPastHoliday(row.date) ? "text-gray-400" : ""}>
                {formatDateTime(row.created_date)}
            </span>
        )
    },
    {
        name: "Updated On",
        selector: (row) => formatDateTime(row.updated_date),
        sortable: true,
        cell: row => (
            <span className={isPastHoliday(row.date) ? "text-gray-400" : ""}>
                {formatDateTime(row.updated_date)}
            </span>
        )
    },
    {
        name: "Action",
        cell: (row) => {
            const isPast = isPastHoliday(row.date);
            return (
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => !isPast && fetchHolidayDetails(row.id)}
                        className={`${isPast ? "text-gray-400 cursor-not-allowed" : "text-blue-500 hover:text-blue-700"}`}
                        disabled={isPast}
                        title={isPast ? "Cannot edit past holidays" : "Edit holiday"}
                    >
                        <BiEdit size={15} />
                    </button>
                    <button
                        className={`${isPast ? "text-gray-400 cursor-not-allowed" : "text-red-500 hover:text-red-700"}`}
                        onClick={() => !isPast && deletHolidays(row.id)}
                        disabled={isPast}
                        title={isPast ? "Cannot delete past holidays" : "Delete holiday"}
                    >
                        <FaTrash />
                    </button>
                </div>
            );
        },
        width: "100px"
    },
];

    return (
        <div className='flex ml-20'>
            <AdminHRMS />
            <div className='p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col'>
                <div className='flex gap-2 my-4 items-center'>
                    <input
                        type="text"
                        placeholder="Search by holiday name..."
                        className="border px-4 py-2 border-gray-300 rounded-lg w-[80%]"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button
                        className='py-2 px-3 rounded text-white font-bold'
                        style={{ background: themeColor }}
                        onClick={() => {
                            setIsModalOpen(true);
                            setIsEditMode(false);
                        }}
                    >
                        Add Holiday
                    </button>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            style={{ background: themeColor }}
                            className="px-4 py-2 text-white font-bold rounded-md flex items-center gap-2"
                        >
                            Hide Columns
                            {dropdownOpen ? <IoIosArrowDown /> : <MdKeyboardArrowRight />}
                        </button>
                        
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-64 max-h-64 overflow-y-auto z-10">
                                {holidayColumns.map((column) => (
                                    <label
                                        key={column}
                                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            value={column}
                                            checked={selectedOptions.includes(column)}
                                            onChange={handleCheckboxChange}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2">{column}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <Table
                    columns={columns.filter(
                        (col) => !selectedOptions.includes(col.name)
                    )}
                    data={filteredHolidays}
                    pagination
                    highlightOnHover
                    progressPending={loading}
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            {searchTerm ? 'No matching holidays found' : 'No holidays found'}
                        </div>
                    }
                />

                {/* Holiday Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">
                                    {isEditMode ? "Edit Holiday" : "Add New Holiday"}
                                </h2>
                                <button 
                                    onClick={resetForm}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Holiday Name*</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newHoliday.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        placeholder="e.g., New Year"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date*</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={newHoliday.date}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type*</label>
                                    <select
                                        name="types_of_holiday"
                                        value={newHoliday.types_of_holiday}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    >
                                        <option value="Mandatory">Mandatory</option>
                                        <option value="Optional">Optional</option>
                                        <option value="Regional">Regional</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Applies To*</label>
                                    <select
                                        name="applies_to"
                                        value={newHoliday.applies_to}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    >
                                        <option value="All">All</option>
                                        <option value="Department">Department</option>
                                        <option value="Location">Location</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={resetForm}
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={isEditMode ? handleUpdateHoliday : handleAddHoliday}
                                    className="px-4 py-2 text-white rounded hover:opacity-90"
                                    style={{ background: themeColor }}
                                    disabled={modalLoading}
                                >
                                    {modalLoading ? (
                                        "Processing..."
                                    ) : isEditMode ? (
                                        "Update Holiday"
                                    ) : (
                                        "Save Holiday"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddHrmsHolidays;