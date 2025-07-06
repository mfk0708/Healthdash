// Keep all your imports as-is (unchanged)
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import ProfileBox from "./ProfileBox.jsx";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  CalendarDays,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faAngleDown,
  faPen,
  faTrash,
  faSort,
  faSortUp, faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import IntakePage from "./IntakePage.jsx";

export default function Dashboard() {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showIntake, setShowIntake] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showProfileBox, setShowProfileBox] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("Search");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
const [completedPercentage, setCompletedPercentage] = useState(0);
const [pieData, setPieData] = useState([]);
const [barData, setBarData] = useState([]);
const [doctorName, setDoctorName] = useState("");
const [doctorImage, setDoctorImage] = useState("");

const pieColors = ["#EF4444","#FFD43B"]; // ✅ Green and Yellow


const barColors = ["#2563EB", "#FFD43B", "#22C55E", "#9CA3AF", "#EF4444"];
// Blue, Yellow, Green, Gray, Red
useEffect(() => {
  fetch("/chartData.json")
    .then((res) => res.json())
    .then((data) => {
      // Pie & Bar Chart
      const percentage = data.pie.completedPercentage || 0;
      setCompletedPercentage(percentage);
      setPieData([
        { name: "Completed", value: percentage },
        { name: "Pending", value: 100 - percentage }
      ]);
      setBarData(data.bar || []);

      // Doctor Info
      const doctor = data.doctor || {};
      setDoctorName(doctor.name || "");
  
      setDoctorImage(doctor.image || "images/doctor.png");
    })
    .catch((err) => console.error("Failed to fetch chart data:", err));
}, []);


  useEffect(() => {
    fetch("/appointments.json")
      .then((res) => res.json())
      .then((data) => {
        const withStatus = data.map((item) => ({
          ...item,
          status: "incomplete",
        }));
        setAppointmentsData(withStatus);
      })
      .catch((error) => console.error("Failed to fetch appointments:", error));
  }, []);

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSort = (field) => {
    const isSameField = sortField === field;
    const newOrder = isSameField && sortOrder === "asc" ? "desc" : "asc";

    const sorted = [...appointmentsData].sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (field === "status") {
        const getOrderValue = (status) => {
          if (status?.toLowerCase() === "completed") return 1;
          if (status?.toLowerCase() === "incomplete") return 2;
          return 3;
        };
        valA = getOrderValue(a.status);
        valB = getOrderValue(b.status);
      } else {
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
      }

      if (valA < valB) return newOrder === "asc" ? -1 : 1;
      if (valA > valB) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setAppointmentsData(sorted);
    setSortField(field);
    setSortOrder(newOrder);
  };

  const getSortIcon = (field) => {
    const isActive = sortField === field;
    return (
      <span className="sort-wrapper-stack">
        <FontAwesomeIcon
          icon={faSortUp}
          className={`sort-icon ${isActive && sortOrder === "asc" ? "sort-up-active" : ""}`}
        />
        <FontAwesomeIcon
          icon={faSortDown}
          className={`sort-icon ${isActive && sortOrder === "desc" ? "sort-down-active" : ""}`}
        />
      </span>
    );
  };

  const saveEditedData = (id) => {
    setAppointmentsData((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, ...editedData } : appt))
    );
    setEditingId(null);
  };

  const handleQuickDate = (option) => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);

    let targetDate = null;
    if (option === "today") targetDate = new Date(base);
    else if (option === "tomorrow") targetDate = new Date(base.setDate(base.getDate() + 1));
    else if (option === "yesterday") targetDate = new Date(base.setDate(base.getDate() - 1));

    setSelectedDate(option === "all" ? null : targetDate);
    setCurrentPage(1);
    setShowDateDropdown(false);
    setPlaceholderText(option.charAt(0).toUpperCase() + option.slice(1));
    setSearch("");
  };

  const handleDeleteAppointment = (id) => {
    setAppointmentsData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const toggleStatusWithDelay = (itemName, currentStatus) => {
    const newStatus = currentStatus === "incomplete" ? "Completed" : "incomplete";
    setAppointmentsData((prevData) =>
      prevData.map((appt) =>
        appt.name === itemName ? { ...appt, status: newStatus } : appt
      )
    );
  };
const handleRowClick = (e, itemId) => {
  const isInsideButton = e.target.closest(".intake-btn, .status-text");
  if (!isInsideButton) {
    const patientData = appointmentsData.find((item) => item.id === itemId); // ✅ FIXED HERE
    setSelectedPatient(patientData);
    setShowProfileBox(true);
  }
};


  const filteredAppointments = appointmentsData.filter((item) => {
    const matchesSearch = (item.name || "").toLowerCase().includes(search.toLowerCase());
    if (selectedDate) {
      const itemDate = new Date(item.date);
      const isSameDay = itemDate.toDateString() === selectedDate.toDateString();
      const isSameMonth =
        itemDate.getMonth() === selectedDate.getMonth() &&
        itemDate.getFullYear() === selectedDate.getFullYear();
      return matchesSearch && (isSameDay || isSameMonth);
    }
    return matchesSearch;
  });

  const paginatedAppointments = filteredAppointments;


  return (
    <>
    <div className="top">
    <h1 className="dash-head"> Dashboard</h1>  
     <div className="notification-bell">
                  <FontAwesomeIcon icon={faBell} style={{ color: "#2563EB", fontSize: "30px" }} />
                </div>
     <div className="profile-box">
           <img src={doctorImage} className="drprofile-avatar" alt="Profile" />
            <div className="profile-info">
            <div className="profile-name">{doctorName}</div>
              
              <FontAwesomeIcon icon={faAngleDown} className="vectorlogo" />
            </div>
          </div></div>

    <div className="dashboard-top-card">
  <div className="top-section">
    {/* Greeting Card */}
    <div className="greeting-box">
      <div className="greeting-text">
        <div className="greeting">Good Morning</div>
      <div className="doctor-name">{doctorName}</div>
        <div className="subtitle">
          Here is your dashboard to manage consultations with ease.
        </div>
      </div>
     <img src={doctorImage} alt="Doctor" className="greeting-img" />
    </div>

    {/* Pie Chart Card */}
    <div className="chart-card pie">
 

 
  <div className="chart-wrapper">
  <ResponsiveContainer width={160} height={160}>
  <PieChart>
    <Pie
      data={pieData}
      cx="50%"
      cy="50%"
      innerRadius={50}
      outerRadius={70}
      dataKey="value"
      startAngle={90}
      endAngle={-270}
    >
      {pieData.map((entry, index) => (
        <Cell key={index} fill={pieColors[index]} />
      ))}
    </Pie>
  </PieChart>
</ResponsiveContainer>

<div className="pie-center-label">{completedPercentage}%</div>


  
</div>


 <div className="chart-title">Weekly appointments completed</div>
</div>
  


    {/* Bar Chart Card */}
    <div className="chart-card bar">
  
  
  <div className="chart-wrapper">
    <ResponsiveContainer width={200} height={160}>
  <BarChart data={barData}>
    <XAxis dataKey="day" hide={true} />
    <YAxis hide={true} />
    <Tooltip />
    <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
      {barData.map((entry, index) => (
        <Cell key={index} fill={barColors[index % barColors.length]} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>

  </div>
  <div className="chart-title">Weekly hours completed</div>
</div>

</div>

</div>


<div className="dashboard-bottom-card">
      <div className="section-header">
        <h2>Appointments</h2>
      </div>

      <div className="filters">
        <div className="search-container">
          <Search className="search-icon" />
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>

        <div className="calendar-container">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="calendar-input w-[180px] justify-start text-left font-normal text-sm bg-white border border-gray-300 rounded-lg py-2 px-3">
                <CalendarIcon className="calender-icon" />
                {selectedDate instanceof Date ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span className="text-gray-400">Pick by date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="popover-content w-auto p-3 space-y-2" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setCurrentPage(1);
                }}
                onMonthChange={(date) => {
                  setSelectedDate(date);
                  setCurrentPage(1);
                }}
                initialFocus
                className="border rounded-md shadow-lg p-4"
              />
              <div>
                <Button
                  className="clear-btn"
                  onClick={() => {
                    setSelectedDate(null);
                    setCurrentPage(1);
                  }}
                >
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

<div className="search-date-container">
  <div className="search-with-dropdown">
    <Input
      type="text"
      placeholder={placeholderText}
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      className="search-input1"
    />

    <div
      className="dropdown-toggle"
      onClick={() => setShowDateDropdown(!showDateDropdown)}
    >
      <FontAwesomeIcon icon={faAngleDown} className="search-drop-icon" />
    </div>

    {showDateDropdown && (
      <div className="dropdown-menu">
        <div onClick={() => handleQuickDate("all")}>All</div>
        <div onClick={() => handleQuickDate("today")}>Today</div>
        <div onClick={() => handleQuickDate("tomorrow")}>Tomorrow</div>
        <div onClick={() => handleQuickDate("yesterday")}>Yesterday</div>
      </div>
    )}
  </div>
</div>

        <Button className="new-appointment">+ New Appointment</Button>
      </div>

      <div className="appointments-card">
    <div className="appointment-headings">
  <div className="cell patient cursor-pointer" onClick={() => handleSort("name")}>

    <span className="heading-with-icon">Patient {getSortIcon("patient")}</span>
  </div>
  <div className="cell age cursor-pointer" onClick={() => handleSort("age")}>
    <span className="heading-with-icon">Age {getSortIcon("age")}</span>
  </div>
  <div className="cell date cursor-pointer" onClick={() => handleSort("date")}>
    <span className="heading-with-icon">Date {getSortIcon("date")}</span>
  </div>
  <div className="cell time cursor-pointer" onClick={() => handleSort("time")}>
    <span className="heading-with-icon">Time {getSortIcon("time")}</span>
  </div>
  <div className="cell reason cursor-pointer" onClick={() => handleSort("reason")}>
    <span className="heading-with-icon">Reason {getSortIcon("reason")}</span>
  </div>
  <div className="cell doctor cursor-pointer" onClick={() => handleSort("doctor")}>
    <span className="heading-with-icon">Doctor {getSortIcon("doctor")}</span>
  </div>
  
<div className="cell status cursor-pointer" onClick={() => handleSort("status")}>
  <span className="heading-with-icon">Status {getSortIcon("status")}</span>
</div>


  <div className="cell action"></div>
  <div className="cell options"></div>
</div>

<div className="appointments-card-scroll">
        {paginatedAppointments.map((item) => (
          <div
            key={item._id || item.name}
            className={`appointment-row ${activeKey === item.id ? "active" : ""}`}
            onClick={(e) => handleRowClick(e, item.id)}
          >
           <div className="cell patient">
  {editingId === item.id ? (
    <input
      value={editedData.name}
      onChange={(e) => handleInputChange("name", e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && saveEditedData(item.id)}
      onBlur={() => saveEditedData(item.id)}
      className="edit-input"
    />
  ) : (
    <>
      {item.image ? (
        <img src={item.image} alt={item.name} className="avatar" />
      ) : (
        <FontAwesomeIcon icon={faUser} className="avatar default-avatar" />
      )}
      <span>{item.name || "—"}</span>
    </>
  )}
</div>

            <div className="cell age">
  {editingId === item.id ? (
    <input
      type="number"
      value={editedData.age}
      onChange={(e) => handleInputChange("age", e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && saveEditedData(item.id)}
      onBlur={() => saveEditedData(item.id)}
      className="edit-input"
    />
  ) : (
    item.age || "—"
  )}
</div>
<div className="cell date">
  {editingId === item.id ? (
    <input
      type="date"
      value={editedData.date}
      onChange={(e) => handleInputChange("date", e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && saveEditedData(item.id)}
      onBlur={() => saveEditedData(item.id)}
      className="edit-input"
    />
  ) : (
    item.date || "—"
  )}
</div>
<div className="cell time">
  {editingId === item.id ? (
    <input
      type="time"
      value={editedData.time}
      onChange={(e) => handleInputChange("time", e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && saveEditedData(item.id)}
      onBlur={() => saveEditedData(item.id)}
      className="edit-input"
    />
  ) : (
    item.time || "—"
  )}
</div>

   <div className="cell reason">
  {editingId === item.id ? (
    <input
      value={editedData.reason}
      onChange={(e) =>
        setEditedData((prev) => ({ ...prev, reason: e.target.value }))
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setAppointmentsData((prev) =>
            prev.map((appt) =>
              appt.id === item.id ? { ...appt, reason: editedData.reason } : appt
            )
          );
          setEditingId(null); // Exit edit mode
        }
      }}
      onBlur={() => {
        setAppointmentsData((prev) =>
          prev.map((appt) =>
            appt.id === item.id ? { ...appt, reason: editedData.reason } : appt
          )
        );
        setEditingId(null); // Exit edit mode
      }}
      className="edit-input"
    />
  ) : (
    item.reason || "—"
  )}
</div>
       
           
          
<div className="cell doctor">
  {editingId === item.id ? (
    <input
      value={editedData.doctor}
      onChange={(e) => handleInputChange("doctor", e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && saveEditedData(item.id)}
      onBlur={() => saveEditedData(item.id)}
      className="edit-input"
    />
  ) : (
    item.doctor || "—"
  )}
</div>

           
            <div
              className="cell status status-text"
              onClick={(e) => {
                e.stopPropagation();
                toggleStatusWithDelay(item.name, item.status);
              }}
              style={{
                cursor: "pointer",
                color: item.status === "Completed" ? "black" :"red",
                fontWeight: 500,
              }}
            >
              {item.status || "—"}
            </div>
            <div className="cell action">
              <button
                className="intake-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPatient(item);
                  setShowIntake(true);
                }}
              >
                Intake
              </button>
            </div>
            <div className="cell options">
              <FontAwesomeIcon
    icon={faPen}
    title="Edit"
    className="icon edit-icon"
    onClick={(e) => {
      e.stopPropagation();
      setEditingId(item.id);
      setEditedData({ ...item }); // populate data into editable state
    }}
  />
  <FontAwesomeIcon
    icon={faTrash}
    title="Delete"
    className="icon delete-icon"
    onClick={(e) => {
      e.stopPropagation();
      handleDeleteAppointment(item.id);
    }}
  />
              <FontAwesomeIcon icon={faAngleDown} title="Done" className="icon done-icon" />
            </div>
          </div>
          
        ))}</div>
      </div>

     </div>

      {showIntake && <IntakePage onClose={() => setShowIntake(false)} patient={selectedPatient} />}
      {showProfileBox && selectedPatient && (
        <ProfileBox
          patient={selectedPatient}
          onClose={() => {
            setShowProfileBox(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </>
  );
}
