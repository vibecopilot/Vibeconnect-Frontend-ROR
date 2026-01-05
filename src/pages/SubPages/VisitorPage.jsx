import React, { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '../../components/Navbar';
import { PiPlusCircle } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import Passes from '../Passes';
import { useSelector } from 'react-redux';
import Table from '../../components/table/Table';
import {
  getAllVisitorLogs,
  getExpectedVisitor,
  getVisitorApprovals,
  getVisitorHistory,
  postVisitorLogFromDevice,
  postVisitorLogToBackend,
  visitorApproval,
} from '../../api';
import { BsEye } from 'react-icons/bs';
import { BiEdit, BiFilterAlt } from 'react-icons/bi';
import Webcam from 'react-webcam';
import { formatTime } from '../../utils/dateUtils';
import { IoClose } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import SelfRegistration from './SelfRegistration';

const VisitorPage = () => {
  const [page, setPage] = useState('all');
  const themeColor = useSelector((state) => state.theme.color);
  const [selectedVisitor, setSelectedVisitor] = useState('expected');
  const [visitor, setVisitor] = useState([]);
  const [all, setAll] = useState([]);
  const [visitorIn, setVisitorIn] = useState([]);
  const [visitorOut, setVisitorOut] = useState([]);
  const [unexpectedVisitor, setUnexpectedVisitor] = useState([]);
  const [FilteredUnexpectedVisitor, setFilteredUnexpectedVisitor] = useState([]);
  const [expectedVisitor, setExpectedVisitor] = useState([]);
  const [FilteredExpectedVisitor, setFilteredExpectedVisitor] = useState([]);
  const [FilteredApproval, setFilteredApproval] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [histories, setHistories] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  // Refetch trigger for approvals...
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // General Pagination states used for All, Visitor In, Visitor Out
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  // Pagination states for Approvals
  const [approvalPage, setApprovalPage] = useState(1);
  const [approvalRowsPerPage, setApprovalRowsPerPage] = useState(10);
  const [approvalTotalPages, setApprovalTotalPages] = useState(1);
  const [approvalTotalRecords, setApprovalTotalRecords] = useState(0);

  // Pagination states for History FIXED FOR PAGINATION
  const [historyPage, setHistoryPage] = useState(1);
  const [historyRowsPerPage, setHistoryRowsPerPage] = useState(10);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotalRecords, setHistoryTotalRecords] = useState(0);

  // Filter states for All visitors
  const [showFilters, setShowFilters] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterMobile, setFilterMobile] = useState('');
  const [filterHost, setFilterHost] = useState('');

  const webcamRef = useRef(null);

  // Helper function for CSV Export Fixed missing function
  const exportHistoryToCSV = () => {
    if (filteredHistory.length === 0) {
      toast.error('No data to export');
      return;
    }
    const headers = ['Name','Purpose','Mobile','Approval Date','Status'];
    const rows = filteredHistory.map((item) => [
      item.name,
      item.purpose,
      item.contactno,
      dateTimeFormat(item.approvaldate),
      item.approved ? 'Approved' : 'Denied',
    ]).join('\n');
    const blob = new Blob([headers.join(','), '\n', rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'visitorhistory.csv');
    a.click();
  };

  const handleClick = (visitorType) => {
    setSelectedVisitor(visitorType);
    setSearchText('');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setCurrentPage(1);
    setApprovalPage(1);
    setHistoryPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterMobile('');
    setFilterHost('');
    setCurrentPage(1);
  };

  useEffect(() => {
    if (page === 'Visitor In') {
      if (selectedVisitor === 'expected') {
        const expectedIn = visitorIn.filter((visit) => visit.usertype !== 'security_guard');
        setFilteredData(expectedIn);
      } else {
        const unexpectedIn = visitorIn.filter((visit) => visit.usertype === 'security_guard');
        setFilteredUnexpectedVisitor(unexpectedIn);
      }
    } else if (page === 'all') {
      setFilteredExpectedVisitor(expectedVisitor);
      setFilteredUnexpectedVisitor(unexpectedVisitor);
    }
  }, [page, selectedVisitor, visitorIn, expectedVisitor, unexpectedVisitor]);

  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  const dateTimeFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchExpectedVisitor = async () => {
      try {
        setLoading(true);
        let filters = {};
        if (page === 'Visitor In') {
          filters.visitorInOut = 'IN';
          if (selectedVisitor === 'expected') {
            filters.userTypeNotEq = 'security_guard';
          } else {
            filters.userType = 'security_guard';
          }
        } else if (page === 'Visitor Out') {
          filters.visitorInOut = 'OUT';
          if (selectedVisitor === 'expected') {
            filters.userTypeNotEq = 'security_guard';
          } else {
            filters.userType = 'security_guard';
          }
        } else if (page === 'all') {
          if (selectedVisitor === 'expected') {
            filters.userTypeNotEq = 'security_guard';
          } else {
            filters.userType = 'security_guard';
          }
        }

        if (filterDateFrom) filters.dateFrom = filterDateFrom;
        if (filterDateTo) filters.dateTo = filterDateTo;
        if (filterMobile) filters.mobile = filterMobile;
        if (filterHost) filters.host = filterHost;

        const visitorResp = await getExpectedVisitor(currentPage, rowsPerPage, filters);
        console.log('Raw API Response:', visitorResp);
        console.log('Response data:', visitorResp.data);

        let visitorData = [];
        let paginationInfo = {};

        if (visitorResp?.data) {
          if (Array.isArray(visitorResp.data)) {
            visitorData = visitorResp.data;
          } else if (visitorResp.data.visitors && Array.isArray(visitorResp.data.visitors)) {
            visitorData = visitorResp.data.visitors;
            paginationInfo = {
              currentPage: visitorResp.data.current_page || visitorResp.data.page || currentPage,
              totalPages: visitorResp.data.total_pages || Math.ceil((visitorResp.data.total_count || visitorResp.data.total || 0) / rowsPerPage),
              totalRecords: visitorResp.data.total_count || visitorResp.data.total || 0,
              perPage: visitorResp.data.per_page || rowsPerPage,
            };
          } else if (visitorResp.data.data && Array.isArray(visitorResp.data.data)) {
            visitorData = visitorResp.data.data;
            paginationInfo = {
              currentPage: visitorResp.data.current_page || visitorResp.data.page || currentPage,
              totalPages: visitorResp.data.total_pages || Math.ceil((visitorResp.data.total_count || visitorResp.data.total || 0) / rowsPerPage),
              totalRecords: visitorResp.data.total_count || visitorResp.data.total || 0,
              perPage: visitorResp.data.per_page || rowsPerPage,
            };
          } else {
            console.error('Unexpected data structure:', visitorResp.data);
            console.log('Available keys:', Object.keys(visitorResp.data));
            setLoading(false);
            return;
          }
        }

        console.log('Extracted pagination info:', paginationInfo);

        if (paginationInfo.totalRecords) {
          setTotalPages(paginationInfo.totalPages);
          setTotalRecords(paginationInfo.totalRecords);
        } else {
          setTotalPages(1);
          setTotalRecords(visitorData.length);
        }

        if (visitorData.length === 0) {
          console.warn('No visitor data found');
          setVisitor([]);
          setAll([]);
          setVisitorIn([]);
          setVisitorOut([]);
          setFilteredData([]);
          setUnexpectedVisitor([]);
          setFilteredUnexpectedVisitor([]);
          setExpectedVisitor([]);
          setFilteredExpectedVisitor([]);
          setLoading(false);
          return;
        }

        console.log('Visitor Data Array:', visitorData);
        const sortedVisitor = visitorData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        console.log('Sorted Visitors:', sortedVisitor);

        // Fix hosts data structure for all visitors - ONLY DATA FIX, NO UI CHANGE
        const processedVisitors = sortedVisitor.map((visitor) => ({
          ...visitor,
          hosts_display: visitor.hosts && visitor.hosts.length > 0 
            ? visitor.hosts.map(host => host.full_name || 'Unknown').filter(Boolean).join(', ')
            : 'No Host'
        }));

        if (page === 'Visitor In') {
          setVisitorIn(processedVisitors);
          if (selectedVisitor === 'expected') {
            setFilteredData(processedVisitors);
            setFilteredExpectedVisitor(processedVisitors);
          } else {
            setFilteredUnexpectedVisitor(processedVisitors);
          }
        } else if (page === 'Visitor Out') {
          setVisitorOut(processedVisitors);
        } else if (page === 'all') {
          setAll(processedVisitors);
          if (selectedVisitor === 'expected') {
            setFilteredExpectedVisitor(processedVisitors);
            setExpectedVisitor(processedVisitors);
          } else {
            setFilteredUnexpectedVisitor(processedVisitors);
            setUnexpectedVisitor(processedVisitors);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching visitor data:', error);
        setLoading(false);
      }
    };
const fetchVisitorHistory = async () => {
  try {
    const res = await getVisitorHistory(historyPage, historyRowsPerPage);
    const data = res.data;

    const historyData = data.approval_history || [];

    setHistories(historyData);
    setFilteredHistory(historyData);

    setHistoryTotalPages(data.total_pages || 1);
    setHistoryTotalRecords(data.total_count || historyData.length || 0);

    console.log("History Data:", historyData);
    console.log("History Pagination:", data.total_pages, data.total_count);
  } catch (error) {
    console.log("History API Error:", error);
    setFilteredHistory([]);
    setHistoryTotalRecords(0);
  }
};


    const fetchApprovals = async () => {
      try {
        const approvalResp = await getVisitorApprovals(approvalPage, approvalRowsPerPage);
        let approvalData = [];
        let approvalPaginationInfo = {};

        if (approvalResp?.data) {
          if (Array.isArray(approvalResp.data)) {
            approvalData = approvalResp.data;
            approvalPaginationInfo = { totalPages: 1, totalRecords: approvalResp.data.length || 0 };
          } else if (approvalResp.data.visitors && Array.isArray(approvalResp.data.visitors)) {
            approvalData = approvalResp.data.visitors;
            approvalPaginationInfo = {
              totalPages: approvalResp.data.total_pages || Math.ceil((approvalResp.data.total_count || approvalResp.data.total || 0) / approvalRowsPerPage),
              totalRecords: approvalResp.data.total_count || approvalResp.data.total || 0,
            };
          } else if (approvalResp.data.data && Array.isArray(approvalResp.data.data)) {
            approvalData = approvalResp.data.data;
            approvalPaginationInfo = {
              totalPages: approvalResp.data.total_pages || Math.ceil((approvalResp.data.total_count || approvalResp.data.total || 0) / approvalRowsPerPage),
              totalRecords: approvalResp.data.total_count || approvalResp.data.total || 0,
            };
          }
        }

        if (approvalPaginationInfo.totalRecords) {
          setApprovalTotalPages(approvalPaginationInfo.totalPages);
          setApprovalTotalRecords(approvalPaginationInfo.totalRecords);
        } else {
          setApprovalTotalPages(1);
          setApprovalTotalRecords(approvalData.length);
        }

        const sortedApproval = approvalData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setApprovals(sortedApproval);
        setFilteredApproval(sortedApproval);
        console.log('Approval data:', sortedApproval);
        console.log('Approval pagination:', approvalPaginationInfo);
      } catch (error) {
        console.log('Error fetching approvals:', error);
        setApprovalTotalRecords(0);
        setFilteredApproval([]);
      }
    };

    fetchApprovals();
    fetchExpectedVisitor();
    fetchVisitorHistory();
  }, [
    currentPage,
    rowsPerPage,
    approvalPage,
    approvalRowsPerPage,
    historyPage,
    historyRowsPerPage,
    page,
    selectedVisitor,
    refetchTrigger,
    filterDateFrom,
    filterDateTo,
    filterMobile,
    filterHost,
  ]);

  const VisitorColumns = [
    {
      name: 'Action',
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/passes/visitors/visitor-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/passes/visitors/edit-visitor/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: 'Visitor Type',
      selector: (row) => row.visit_type,
      sortable: true,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Contact No.',
      selector: (row) => row.contact_no,
      sortable: true,
    },
    {
      name: 'Purpose',
      selector: (row) => row.purpose,
      sortable: true,
    },
    {
      name: 'Coming from',
      selector: (row) => row.coming_from,
      sortable: true,
    },
    {
      name: 'Expected Date',
      selector: (row) => row.expected_date,
      sortable: true,
    },
    {
      name: 'Expected Time',
      selector: (row) => row.expected_time,
      sortable: true,
    },
    {
      name: 'Vehicle No.',
      selector: (row) => row.vehicle_number,
      sortable: true,
    },
    {
      name: 'Host Approval',
      selector: (row) => row.skip_host_approval ? 'Not Required' : 'Required',
      sortable: true,
    },
    {
      name: 'Pass Start',
      selector: (row) => row.start_pass ? dateFormat(row.start_pass) : '',
      sortable: true,
    },
    {
      name: 'Pass End',
      selector: (row) => row.end_pass ? dateFormat(row.end_pass) : '',
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => (
        <div className="">
          {row.visitor_in_out === 'IN' ? (
            <span className="text-red-400">IN</span>
          ) : (
            <span className="text-green-400">{row.visitor_in_out}</span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Created By',
      selector: (row) =>
        `${row?.created_by_name?.firstname || ''} ${row?.created_by_name?.lastname || ''}`.trim(),
      sortable: true,
    },
    {
      name: 'Host',
      selector: (row) => row.hosts_display || row?.created_by_name?.firstname + ' ' + row?.created_by_name?.lastname || 'No Host',
      sortable: true,
    },
  ];

  const [searchText, setSearchText] = useState('');

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    if (searchValue.trim()) {
      if (page === 'Visitor In') {
        if (selectedVisitor === 'expected') {
          const expectedIn = visitorIn.filter((visit) => visit.usertype !== 'security_guard');
          const filteredResults = expectedIn.filter(
            (item) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              (item.vehicle_number &&
                item.vehicle_number.toLowerCase().includes(searchValue.toLowerCase())) ||
              (item.hosts_display &&
                item.hosts_display.toLowerCase().includes(searchValue.toLowerCase()))
          );
          setFilteredData(filteredResults);
        } else {
          const unexpectedIn = visitorIn.filter((visit) => visit.usertype === 'security_guard');
          const filteredResults = unexpectedIn.filter(
            (item) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              (item.vehicle_number &&
                item.vehicle_number.toLowerCase().includes(searchValue.toLowerCase())) ||
              (item.hosts_display &&
                item.hosts_display.toLowerCase().includes(searchValue.toLowerCase()))
          );
          setFilteredUnexpectedVisitor(filteredResults);
        }
      } else if (page === 'all') {
        if (selectedVisitor === 'expected') {
          const filteredResults = expectedVisitor.filter(
            (item) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              (item.vehicle_number &&
                item.vehicle_number.toLowerCase().includes(searchValue.toLowerCase())) ||
              (item.hosts_display &&
                item.hosts_display.toLowerCase().includes(searchValue.toLowerCase()))
          );
          setFilteredExpectedVisitor(filteredResults);
        } else {
          const filteredResults = unexpectedVisitor.filter(
            (item) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              (item.vehicle_number &&
                item.vehicle_number.toLowerCase().includes(searchValue.toLowerCase())) ||
              (item.hosts_display &&
                item.hosts_display.toLowerCase().includes(searchValue.toLowerCase()))
          );
          setFilteredUnexpectedVisitor(filteredResults);
        }
      }
    }
  };

  const [searchAll, setSearchAll] = useState('');
  const handleSearchAll = (e) => {
    const searchValue = e.target.value;
    setSearchAll(searchValue);
    if (searchValue.trim()) {
      setAll(visitor);
    } else {
      const filteredResults = visitor.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          (item.vehicle_number &&
            item.vehicle_number.toLowerCase().includes(searchValue.toLowerCase()))
      );
      setAll(filteredResults);
    }
  };

  const [searchHIstoryText, setSearchHistoryText] = useState('');
  const handleSearchHistory = (e) => {
    const searchValue = e.target.value;
    setSearchHistoryText(searchValue);
    if (searchValue.trim()) {
      setFilteredHistory(histories);
    } else {
      const filteredResults = histories.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          (item.contactno && item.contactno.toLowerCase().includes(searchValue.toLowerCase()))
      );
      setFilteredHistory(filteredResults);
    }
  };

  const [searchApprovalText, setSearchApprovalText] = useState('');
  const handleSearchApproval = (e) => {
    const searchValue = e.target.value;
    setSearchApprovalText(searchValue);
    if (searchValue.trim()) {
      setFilteredApproval(approvals);
    } else {
      const filteredResults = approvals.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredApproval(filteredResults);
    }
  };

  const historyColumn = [
    {
      name: 'Action',
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/passes/visitors/visitor-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Purpose',
      selector: (row) => row.purpose,
      sortable: true,
    },
      {
        name: "Mobile no.",
        selector: (row) => row.contact_no || "--",
        sortable: true,
      },

      {
        name: "Check In",
        selector: (row) =>
          row.visitor_logs?.check_in
            ? new Date(row.visitor_logs.check_in).toLocaleString()
            : "--",
        sortable: true,
      },

      {
        name: "Check Out",
        selector: (row) =>
          row.visitor_logs?.check_out
            ? new Date(row.visitor_logs.check_out).toLocaleString()
            : "--",
        sortable: true,
      },

    {
      name: 'Approval Date',
      selector: (row) => dateTimeFormat(row.approvaldate),
      sortable: true,
    },
    {
      name: 'Approval',
      selector: (row) =>
        row.approved ? (
          <p className="text-green-400">Approved</p>
        ) : (
          <p className="text-red-400">Denied</p>
        ),
      sortable: true,
    },
  ];

  const handleApproval = async (id, decision) => {
    const approveData = new FormData();
    approveData.append('approve', decision);
    try {
      const res = await visitorApproval(id, approveData);
      console.log(res);
      setRefetchTrigger((prev) => prev + 1);
      if (decision === true) {
        toast.success('Visitor approved successfully');
      } else {
        toast.success('Approval denied');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const approvalColumn = [
    {
      name: 'Action',
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/passes/visitors/visitor-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Purpose',
      selector: (row) => row.purpose,
      sortable: true,
    },
    {
      name: 'Expected Date',
      selector: (row) => dateFormat(row.expected_date),
      sortable: true,
    },
    {
      name: 'Expected Time',
      selector: (row) => formatTime(row.expected_time),
      sortable: true,
    },
    {
      name: 'Approval',
      selector: (row) => (
        <div className="flex gap-2">
          <button
            className="text-white bg-green-400 rounded-full p-1"
            onClick={() => handleApproval(row.id, true)}
          >
            <FaCheck size={20} />
          </button>
          <button
            className="text-white bg-red-400 rounded-full p-1"
            onClick={() => handleApproval(row.id, false)}
          >
            <IoClose size={20} />
          </button>
        </div>
      ),
      sortable: true,
    },
  ];

  document.title = 'Passes - Vibe Connect';

  const getVisitorLogData = () => {
    const now = new Date();
    const offsetMinutes = now.getTimezoneOffset();
    const localNow = new Date(now.getTime() - offsetMinutes * 60 * 1000);
    const startTime = new Date(localNow.getTime() - 15 * 60 * 1000);
    const endTime = localNow;
    const formatLogTime = (date) => date.toISOString().slice(0, 19);
    return {
      AcsEventCond: {
        searchID: '3166590d-cdb3-43f3-fvdvfdvdb25e-f6e98a05d359',
        searchResultPosition: 0,
        maxResults: 50,
        major: 0,
        minor: 0,
        startTime: formatLogTime(startTime),
        endTime: formatLogTime(endTime),
      },
    };
  };

  useEffect(() => {
    const postLogs = async () => {
      const visitorLogData = getVisitorLogData();
      const data = await postVisitorLogFromDevice(visitorLogData);
      await postVisitorLogToBackend(data);
    };
    const intervalId = setInterval(postLogs, 15 * 60 * 1000);
    postLogs();
    return () => clearInterval(intervalId);
  }, []);

  const visitorDeviceLogColumn = [
    {
      name: 'Action',
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/passes/visitors/visitor-details/${row.employeeno}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: 'Sr. no.',
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Check in',
      selector: (row) => (row.intime ? dateTimeFormat(row.intime) : ''),
      sortable: true,
    },
    {
      name: 'Check out',
      selector: (row) => (row.outtime ? dateTimeFormat(row.outtime) : null),
      sortable: true,
    },
  ];

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    const fetchAllVisitorLogs = async () => {
      try {
        const res = await getAllVisitorLogs();
        setFilteredLogs(res.data.data);
        setLogs(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllVisitorLogs();
  }, []);

  const [logSearchText, setLogSearchText] = useState('');
  const handleLogSearch = (e) => {
    const searchValue = e.target.value;
    setLogSearchText(searchValue);
    if (searchValue.trim()) {
      setFilteredLogs(logs);
    } else {
      const filteredResults = logs.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredLogs(filteredResults);
    }
  };

  return (
    <div className="visitors-page">
      <section className="flex">
        <Navbar />
        <div className=" w-full flex mx-3  flex-col overflow-hidden">
          <Passes />
          <div className="flex w-full  m-2">
            <div className="flex w-full md:flex-row flex-col space-x-4 border-b border-gray-400">
              <h2
                className={`p-2 px-4 ${
                  page === "all"
                    ? "text-blue-500 font-medium  shadow-custom-all-sides"
                    : "text-black"
                } rounded-t-md  cursor-pointer text-center text-sm flex items-center justify-center transition-all duration-300`}
                onClick={() => handlePageChange("all")}
              >
                All
              </h2>
              <h2
                className={`p-2 ${
                  page === "Visitor In"
                    ? "text-blue-500 font-medium  shadow-custom-all-sides"
                    : "text-black"
                } rounded-t-md  cursor-pointer text-center text-sm flex items-center justify-center transition-all duration-300`}
                onClick={() => handlePageChange("Visitor In")}
              >
                Visitor In
              </h2>
              <h2
                className={`p-2 ${
                  page === "Visitor Out"
                    ? "text-blue-500 font-medium  shadow-custom-all-sides"
                    : "text-black"
                }  rounded-t-md  rounded-sm cursor-pointer text-center text-sm flex items-center justify-center transition-all duration-300`}
                onClick={() => handlePageChange("Visitor Out")}
              >
                Visitor Out
              </h2>
              <h2
                className={`p-2 ${
                  page === "approval"
                    ? "text-blue-500 font-medium  shadow-custom-all-sides"
                    : "text-black"
                }  rounded-t-md  rounded-sm cursor-pointer text-center text-sm flex items-center justify-center transition-all duration-300`}
                onClick={() => handlePageChange("approval")}
              >
                Approvals
              </h2>
              <h2
                className={`p-2 ${
                  page === "History"
                    ? "text-blue-500 font-medium  shadow-custom-all-sides"
                    : "text-black"
                }  rounded-t-md rounded-sm cursor-pointer text-center text-sm flex items-center justify-center transition-all duration-300`}
                onClick={() => handlePageChange("History")}
              >
                History
              </h2>
              <h2
                className={`p-2 ${
                  page === "logs"
                    ? "text-blue-500 font-medium  shadow-custom-all-sides"
                    : "text-black"
                }  rounded-t-md rounded-sm cursor-pointer text-center text-sm flex items-center justify-center transition-all duration-300`}
                onClick={() => handlePageChange("logs")}
              >
                Logs
              </h2>
              <h2
                className={`p-2 ${
                  page === "self-registration"
                    ? "text-blue-500 font-medium  shadow-custom-all-sides"
                    : "text-black"
                }  rounded-t-md rounded-sm cursor-pointer text-center text-sm flex items-center justify-center transition-all duration-300`}
                onClick={() => handlePageChange("self-registration")}
              >
                Self-Registration
              </h2>
            </div>
          </div>

          {page === "all" && (
            <div className="flex flex-col gap-3">
              <div className="grid md:grid-cols-3 gap-2 items-center">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-md placeholder:text-sm"
                  value={searchAll}
                  onChange={handleSearchAll}
                  placeholder="Search using Visitor name, Host, vehicle number"
                />
                <div className="border md:flex-row flex-col flex p-2 rounded-md text-center border-black">
                  <span
                    className={` md:border-r px-2 border-gray-300 cursor-pointer hover:underline ${
                      selectedVisitor === "expected"
                        ? "text-blue-600 underline"
                        : ""
                    } text-center`}
                    onClick={() => handleClick("expected")}
                  >
                    <span>Expected visitor</span>
                  </span>
                  <span
                    className={`cursor-pointer hover:underline ${
                      selectedVisitor === "unexpected"
                        ? "text-blue-600 underline"
                        : ""
                    } text-center`}
                    onClick={() => handleClick("unexpected")}
                  >
                    &nbsp; <span>Unexpected visitor</span>
                  </span>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="font-semibold border-2 border-black hover:bg-gray-100 duration-150 transition-all p-2 rounded-md cursor-pointer text-center flex items-center gap-2 justify-center"
                  >
                    <BiFilterAlt size={20} />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>
                  <Link
                    to={"/admin/add-new-visitor"}
                    style={{ background: themeColor }}
                    className=" font-semibold  hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
                  >
                    <PiPlusCircle size={20} />
                    Add New Visitor
                  </Link>
                </div>
              </div>

              {showFilters && (
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3 text-gray-700">Advanced Filters</h3>
                  <div className="grid md:grid-cols-4 gap-3">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">Date From</label>
                      <input
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md text-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">Date To</label>
                      <input
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md text-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={filterMobile}
                        onChange={(e) => setFilterMobile(e.target.value)}
                        placeholder="Enter mobile number"
                        className="border border-gray-300 p-2 rounded-md text-sm placeholder:text-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">Host Name</label>
                      <input
                        type="text"
                        value={filterHost}
                        onChange={(e) => setFilterHost(e.target.value)}
                        placeholder="Enter host name"
                        className="border border-gray-300 p-2 rounded-md text-sm placeholder:text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleApplyFilters}
                      style={{ background: themeColor }}
                      className="px-4 py-2 text-white rounded-md font-medium hover:opacity-90 transition-all"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 border-2 border-gray-300 rounded-md font-medium hover:bg-gray-100 transition-all"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {page === "Visitor In" && (
            <div className="grid md:grid-cols-3 gap-2 items-center">
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-md placeholder:text-sm"
                value={searchText}
                onChange={handleSearch}
                placeholder="Search using Visitor name, Host, vehicle number"
              />
              <div className="border md:flex-row flex-col flex p-2 rounded-md text-center border-black">
                <span
                  className={` md:border-r px-2 border-gray-300 cursor-pointer hover:underline ${
                    selectedVisitor === "expected"
                      ? "text-blue-600 underline"
                      : ""
                  } text-center`}
                  onClick={() => handleClick("expected")}
                >
                  <span>Expected visitor</span>
                </span>
                <span
                  className={`cursor-pointer hover:underline ${
                    selectedVisitor === "unexpected"
                      ? "text-blue-600 underline"
                      : ""
                  } text-center`}
                  onClick={() => handleClick("unexpected")}
                >
                  &nbsp; <span>Unexpected visitor</span>
                </span>
              </div>
              <div className="flex justify-end">
                <Link
                  to={"/admin/add-new-visitor"}
                  style={{ background: themeColor }}
                  className=" font-semibold  hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
                >
                  <PiPlusCircle size={20} />
                  Add New Visitor
                </Link>
              </div>
            </div>
          )}
          
          {page === "Visitor Out" && (
            <div className="flex flex-col gap-2">
              <div className="grid md:grid-cols-3 gap-2 items-center">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-md placeholder:text-sm"
                  value={searchText}
                  onChange={handleSearch}
                  placeholder="Search using Visitor name, Host, vehicle number"
                />
                <div className="border md:flex-row flex-col flex p-2 rounded-md text-center border-black">
                  <span
                    className={` md:border-r px-2 border-black cursor-pointer hover:underline ${
                      selectedVisitor === "expected"
                        ? "text-blue-600 underline"
                        : ""
                    } text-center`}
                    onClick={() => handleClick("expected")}
                  >
                    <span>Expected visitor</span>
                  </span>
                  <span
                    className={`cursor-pointer hover:underline ${
                      selectedVisitor === "unexpected"
                        ? "text-blue-600 underline"
                        : ""
                    } text-center`}
                    onClick={() => handleClick("unexpected")}
                  >
                    &nbsp; <span>Unexpected visitor</span>
                  </span>
                </div>
              </div>
              <Table 
                columns={VisitorColumns} 
                data={visitorOut}
                paginationServer
                paginationTotalRows={totalRecords}
                onChangePage={setCurrentPage}
                paginationPerPage={rowsPerPage} 
                paginationRowsPerPageOptions={[rowsPerPage]} 
              />
            </div>
          )}

          {page === "History" && (
            <div className="">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Search using Name or Mobile Number"
                  className="border p-2 rounded-md border-gray-300 w-full placeholder:text-sm"
                  value={searchHIstoryText}
                  onChange={handleSearchHistory}
                />
                <button
                  onClick={exportHistoryToCSV}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                >
                  Export
                </button>
              </div>
              <Table
                columns={historyColumn}
                data={filteredHistory}
                paginationServer
                paginationTotalRows={historyTotalRecords}
                onChangePage={setHistoryPage}
                paginationPerPage={historyRowsPerPage}
                paginationRowsPerPageOptions={[historyRowsPerPage]}
              />
            </div>
          )}

          {page === "logs" && (
            <div className="">
              <input
                type="text"
                placeholder="Search using Name "
                className="border p-2 rounded-md border-gray-300 w-full mb-2 placeholder:text-sm"
                value={logSearchText}
                onChange={handleLogSearch}
              />
              <Table columns={visitorDeviceLogColumn} data={filteredLogs} />
            </div>
          )}

          {page === "approval" && (
            <div className="">
              <input
                type="text"
                placeholder="Search using Name or Mobile Number"
                className="border p-2 rounded-md border-gray-300 w-full mb-2 placeholder:text-sm"
                value={searchApprovalText}
                onChange={handleSearchApproval}
              />
              <Table 
                columns={approvalColumn} 
                data={FilteredApproval}
                paginationServer
                paginationTotalRows={approvalTotalRecords}
                onChangePage={setApprovalPage}
                paginationPerPage={approvalRowsPerPage} 
                paginationRowsPerPageOptions={[approvalRowsPerPage]} 
              />
            </div>
          )}

          {page === "self-registration" && (
            <div>
              <SelfRegistration />
            </div>
          )}

          <div className="my-4">
            {selectedVisitor === "expected" && page === "Visitor In" && (
              <Table 
                columns={VisitorColumns} 
                data={filteredData}
                paginationServer
                paginationTotalRows={totalRecords}
                onChangePage={setCurrentPage}
                paginationPerPage={rowsPerPage} 
                paginationRowsPerPageOptions={[rowsPerPage]} 
              />
            )}
            {selectedVisitor === "unexpected" && page === "Visitor In" && (
              <Table
                columns={VisitorColumns}
                data={FilteredUnexpectedVisitor}
                paginationServer
                paginationTotalRows={totalRecords}
                onChangePage={setCurrentPage}
                paginationPerPage={rowsPerPage} 
                paginationRowsPerPageOptions={[rowsPerPage]} 
              />
            )}
            
            <div className="">
              {selectedVisitor === "expected" && page === "all" && (
                <Table
                  columns={VisitorColumns}
                  data={FilteredExpectedVisitor}
                  paginationServer
                  paginationTotalRows={totalRecords}
                  onChangePage={setCurrentPage}
                  paginationPerPage={rowsPerPage} 
                  paginationRowsPerPageOptions={[rowsPerPage]} 
                />
              )}
              {selectedVisitor === "unexpected" && page === "all" && (
                <Table
                  columns={VisitorColumns}
                  data={FilteredUnexpectedVisitor}
                  paginationServer
                  paginationTotalRows={totalRecords}
                  onChangePage={setCurrentPage}
                  paginationPerPage={rowsPerPage} 
                  paginationRowsPerPageOptions={[rowsPerPage]} 
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisitorPage;