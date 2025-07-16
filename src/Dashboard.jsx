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
const [selectedDoctorId, setSelectedDoctorId] = useState("doc1");
 
const API='https://healthapi-zol8.onrender.com'
const apiKey = import.meta.env.VITE_API_KEY;

const pieColors = ["#EF4444","#FFD43B"]; // ✅ Green and Yellow


const barColors = ["#2563EB", "#FFD43B", "#22C55E", "#9CA3AF", "#EF4444"];
// Blue, Yellow, Green, Gray, Red

useEffect(() => {
  fetch(`${API}/doctor`,
    {
      headers:{
        "x-api-key":apiKey
      }
    }
  )
    .then((res) => res.json())
    .then((doctors) => {
      if (!Array.isArray(doctors)) return;

      const selectedDoctor = doctors.find((doc) => doc.doctor_id === selectedDoctorId);
      if (!selectedDoctor) return;

      setDoctorName(selectedDoctor.name || "");
      setDoctorImage(`https://drive.google.com/uc?export=view&id=${selectedDoctor.image_file_id}`);

      const percentage = selectedDoctor.pie?.completedPercentage || 0;
      setCompletedPercentage(percentage);
      setPieData([
        { name: "Completed", value: percentage },
        { name: "Pending", value: 100 - percentage },
      ]);

      setBarData(selectedDoctor.bar || []);
    })
    .catch((err) => console.error("Failed to fetch doctor data:", err));
}, [selectedDoctorId]);
const handleDeleteAppointment = async (appointment_id) => {
  setAppointmentsData((prevData) =>
    prevData.filter((item) => item.appointment_id !== appointment_id)
  );

  try {
    const response = await fetch(
      `${API}/appointments/${appointment_id}`,
      {
        method: "DELETE",
        headers:{
          'x-api-key':apiKey
        }
      },
      
    );

    if (!response.ok) {
      throw new Error("Failed to delete appointment from server");
    }

    // Optionally: success toast or console log
    console.log("Appointment deleted successfully.");
  } catch (error) {
    console.error("Error deleting appointment:", error);
    alert("Failed to delete appointment. Please refresh the page.");

    
  }
};

  useEffect(() => {
    fetch(`${API}/dashboard`,
      {
        headers:{
          "x-api-key":apiKey
        }
      }
    )
      .then((res) => res.json())
      .then((data) =>{ 
        setAppointmentsData(data);
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
          if (status?.toLowerCase() === "Completed") return 1;
          if (status?.toLowerCase() === "Scheduled") return 2;
          return 3
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
const saveEditedData = async (appointment_id) => {
  const appointment = appointmentsData.find(
    (appt) => appt.appointment_id === appointment_id
  );
  const patient_id = appointment?.patient_id;

  if (!patient_id) {
    alert("❌ Failed to update appointment.");
    return;
  }

  const updatedData = { ...editedData };

  if (!("status" in updatedData)) updatedData.status = appointment.status;
  if (!("gender" in updatedData)) updatedData.gender = appointment.gender;
  if (!("blood_group" in updatedData)) updatedData.blood_group = appointment.blood_group;

  // Optimistically update UI
  setAppointmentsData((prevData) =>
    prevData.map((appt) =>
      appt.appointment_id === appointment_id
        ? { ...appt, ...updatedData }
        : appt
    )
  );

  setEditingId(null);
  setEditedData({});

  try {
  const response = await fetch(
    `${API}/dashboard/${appointment_id}/${patient_id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json",
        "x-api-key":apiKey
       },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) throw new Error("Failed to update appointment");


  await response.json();


  const dashRes = await fetch(`${API}/dashboard`);
  if (!dashRes.ok) throw new Error("Failed to fetch dashboard");

  const dashData = await dashRes.json();
  setAppointmentsData(dashData);

} catch (err) {
  console.error("Update error:", err);
}
}

  const handleQuickDate = (option) => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);

    let targetDate = null;
    if (option === "today ") targetDate = new Date(base);
    else if (option === "tomorrow") targetDate = new Date(base.setDate(base.getDate() + 1));
    else if (option === "yesterday") targetDate = new Date(base.setDate(base.getDate() - 1));

    setSelectedDate(option === "all" ? null : targetDate);
    setCurrentPage(1);
    setShowDateDropdown(false);
    setPlaceholderText(option.charAt(0).toUpperCase() + option.slice(1));
    setSearch("");
  };


const toggleStatusWithDelay = async (appointment_id, currentStatus) => {
  const newStatus = currentStatus === "Scheduled" ? "Completed" : "Scheduled";

  const appointment = appointmentsData.find(
    (appt) => appt.appointment_id === appointment_id
  );
  if (!appointment) return;

  const updatedAppointment = { ...appointment, status: newStatus };

  setAppointmentsData((prevData) =>
    prevData.map((appt) =>
      appt.appointment_id === appointment_id ? updatedAppointment : appt
    )
  );

  try {
    const response = await fetch(
      `${API}/appointments/${appointment_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'x-api-key':apiKey
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!response.ok) throw new Error("Failed to update status");

    const updatedFromServer = await response.json();

    setAppointmentsData((prevData) =>
      prevData.map((appt) =>
        appt.appointment_id === appointment_id
          ? { ...appt, ...updatedFromServer }
          : appt
      )
    );
  } catch (error) {
    console.error("Error updating status:", error);
  }
};


const handleRowClick = (e, itemId) => {
  const isInsideButton = e.target.closest(".intake-btn, .status-text, .edit-input, .icon");

  // Prevent profile opening if we're in edit mode
  if (!isInsideButton && !editingId) {
    const patientData = appointmentsData.find((item) => item.patient_id === itemId);
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
      return matchesSearch && isSameDay;

    }
    return matchesSearch;
  });

  const paginatedAppointments = filteredAppointments;


  return (
   
      <div className="dashboard-layout">
       <div className="main-content">
        {!showIntake ? (
        <>
    <div className="top">
    <h1 className="dash-head"> Dashboard</h1>  
     <div className="notification-bell">
                  <FontAwesomeIcon icon={faBell} style={{ color: "#2563EB", fontSize: "30px" }} />
                </div>
     <div className="profile-box">
          <img
  src={doctorImage || "./images/doctor.png"}
  className="drprofile-avatar"
  alt="Profile"
  onError={(e) => {
    e.target.onerror = null; // Prevents infinite loop in case default also fails
    e.target.src = "./images/doctor.png";
  }}
/>

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
    <img
  src={doctorImage || "/images/doctor.png"}
  alt="Doctor"
  className="greeting-img"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/images/doctor.png";
  }}
/>

    </div>

    {/* Pie Chart Card */}
    <div className="chart-card pie">
 

 
  <div className="chart-wrapper">
   <div className="chart-wrapper1">
  <ResponsiveContainer width={140} height={140}>
  <PieChart>
    <Pie
      data={pieData}
      cx="50%"
      cy="50%"
      innerRadius={40}
      outerRadius={60}
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
  
</div>


 <div className="chart-title">Weekly appointments completed</div>
</div>
  


    {/* Bar Chart Card */}
    <div className="chart-card bar">
  
  
  <div className="chart-wrapper">
    <ResponsiveContainer width={180} height={130}>
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
  <div className="chart-title1">Weekly hours completed</div>
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
          <Button className="calendar-input w-[180px] justify-start text-left text-sm font-normal bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500">
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
       
        <div onClick={() => handleQuickDate("today")}>Today's Appointments</div>
        <div onClick={() => handleQuickDate("tomorrow")}>Tomorrow's Appointments</div>
        <div onClick={() => handleQuickDate("yesterday")}>Yesterday's Appointments</div>
         <div onClick={() => handleQuickDate("all")}> See All</div>
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
    key={item.appointment_id}
    className={`appointment-row ${activeKey === item.appointment_id ? "active" : ""}`}
    onClick={(e) => handleRowClick(e, item.patient_id)}
  >
    {/* Patient Name */}
    <div className="cell patient">
      {editingId === item.appointment_id ? (
        <input
          value={editedData.patient_name || ""}
          onChange={(e) => handleInputChange("patient_name", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveEditedData(item.appointment_id)}
          onBlur={() => saveEditedData(item.appointment_id)}
          className="edit-input"
        />
      ) : (
        <>
          {item.patient_image ? (
            <img src={item.patient_image} alt={item.patient_name} className="avatar" />
          ) : (
            <FontAwesomeIcon icon={faUser} className="avatar default-avatar" />
          )}
          <span>{item.patient_name || "—"}</span>
        </>
      )}
    </div>

    {/* Age */}
    <div className="cell age">
      {editingId === item.appointment_id ? (
        <input
          type="number"
          value={editedData.patient_age || ""}
          onChange={(e) => handleInputChange("patient_age", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveEditedData(item.appointment_id)}
          onBlur={() => saveEditedData(item.appointment_id)}
          className="edit-input"
        />
      ) : (
        item.patient_age || "—"
      )}
    </div>

    {/* Date */}
    <div className="cell date">
      {editingId === item.appointment_id ? (
        <input
          type="date"
          value={editedData.date || ""}
          onChange={(e) => handleInputChange("date", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveEditedData(item.appointment_id)}
          onBlur={() => saveEditedData(item.appointment_id)}
          className="edit-input"
        />
      ) : (
        item.date || "—"
      )}
    </div>

    {/* Time */}
    <div className="cell time">
      {editingId === item.appointment_id ? (
        <input
          type="time"
          value={editedData.time || ""}
          onChange={(e) => handleInputChange("time", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveEditedData(item.appointment_id)}
          onBlur={() => saveEditedData(item.appointment_id)}
          className="edit-input"
        />
      ) : (
        item.time || "—"
      )}
    </div>

    {/* Reason (Disease) */}
    <div className="cell reason">
      {editingId === item.appointment_id ? (
        <input
          value={editedData.disease || ""}
          onChange={(e) => handleInputChange("disease", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveEditedData(item.appointment_id)}
          onBlur={() => saveEditedData(item.appointment_id)}
          className="edit-input"
        />
      ) : (
        item.disease || "—"
      )}
    </div>

    {/* Doctor */}
    <div className="cell doctor">
      {editingId === item.appointment_id ? (
        <input
          value={editedData.doctor_name || ""}
          onChange={(e) => handleInputChange("doctor_name", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveEditedData(item.appointment_id)}
          onBlur={() => saveEditedData(item.appointment_id)}
          className="edit-input"
        />
      ) : (
        item.doctor_name || "—"
      )}
    </div>

    {/* Status */}
    <div
      className="cell status status-text"
      onClick={(e) => {
        e.stopPropagation();
        toggleStatusWithDelay(item.appointment_id, item.status);
      }}
      style={{
        cursor: "pointer",
        color: item.status === "Completed" ? "black" : "green",
        fontWeight: 500,
      }}
    >
      {item.status || "—"}
    </div>

    {/* Intake Button */}
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

    {/* Edit/Delete Icons */}
    <div className="cell options">
      <FontAwesomeIcon
        icon={faPen}
        title="Edit"
        className="icon edit-icon"
        onClick={(e) => {
          e.stopPropagation();
          setEditingId(item.appointment_id);
          setEditedData({
            patient_name: item.patient_name,
            patient_age: item.patient_age,
            date: item.date,
            time: item.time,
            disease: item.disease,
            doctor_name: item.doctor_name,
          });
        }}
      />
      <FontAwesomeIcon
        icon={faTrash}
        title="Delete"
        className="icon delete-icon"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteAppointment(item.appointment_id);
        }}
      />
      <FontAwesomeIcon icon={faAngleDown} title="Done" className="icon done-icon" />
    </div>
  </div>
))}
 
 </div>
      </div>

     </div>
</>
  ) : (
        <IntakePage onClose={() => setShowIntake(false)} patient={selectedPatient} />
      )}
    
      {showProfileBox && selectedPatient && (
        <ProfileBox
          patient={selectedPatient}
          onClose={() => {
            setShowProfileBox(false);
            setSelectedPatient(null);
          }}
        />
      )}
    
    </div></div>
  );
}
