import React, { useEffect, useState } from "react";
import { getSiteWiseAttendance, getSiteWiseEmployee } from "../../api";

function HrmsSiteAttendanceModal({ onClose }) {
  const [formData, setFormData] = useState([]);
  const themeColor = useSelector((state) => state.theme.color);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handlechange = (e) => {
    const file = e.target.file[0];
  };

  useEffect(() => {
    const fetchPresentEmp = async () => {

        const res = await getSiteWiseAttendance()
        const res1 = await getSiteWiseEmployee()
    }
  });
}

export default HrmsSiteAttendanceModal;
