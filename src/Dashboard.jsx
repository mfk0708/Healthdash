import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetch("/appointments.json")
      .then((res) => res.json())
      .then((data) => setAppointmentsData(data))
      .catch((error) => console.error("Failed to fetch appointments:", error));
  }, []);

  const filteredAppointments = appointmentsData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());

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

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <div className="top-section">
        <div className="greeting-box">
          <div className="greeting-text">
            <div className="goodmorning">Good Morning</div>
            <div className="doctor-name">Dr. Sarah Johnson</div>
            <div className="subtitle">
              Good day! Here’s your dashboard to manage consultations with ease.
            </div>
          </div>
          <img src="images/doctor.png" className="greeting-img" alt="Doctor" />
        </div>

        <div className="top-right">
          <div className="profile-box">
            <img src="images/doctor.png" className="profile-avatar" alt="Profile" />
            <div className="profile-info">
              <div className="profile-name">Dr. Sarah</div>
              <div className="profile-role">Cardiologist</div>
            </div>
          </div>

          {paginatedAppointments.length > 0 && (
            <div className="reminder-box">
              <div className="reminder-header">
                <img
                  src={paginatedAppointments[0].image}
                  alt={paginatedAppointments[0].name}
                  className="reminder-avatar"
                />
                <div className="reminder-info">
                  <div className="reminder-name">
                    {paginatedAppointments[0].name}
                  </div>
                  <div className="reminder-meta">
                    {paginatedAppointments[0].age} Yrs&nbsp; Male
                  </div>
                </div>
                <div className="reminder-icon">
                  <FontAwesomeIcon icon={faBell} style={{ color: "#FFD43B", fontSize: "30px" }} />
                </div>
              </div>

              <div className="reminder-datetime-box">
                <CalendarDays className="reminder-calendar-icon" />
                <span>
                  {format(
                    new Date(paginatedAppointments[0].date),
                    "dd MMMM yyyy"
                  )}
                  , {paginatedAppointments[0].time}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

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
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                {selectedDate instanceof Date ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span className="text-gray-400">Pick by date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="popover-content w-auto p-3 space-y-2" align="start">
              <Calendar
                className="calendar1"
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

        <Button className="new-appointment">+ New Appointment</Button>
      </div>

      <div className="appointments-card">
        <div className="appointment-headings">
          <div className="cell time">Time</div>
          <div className="cell date">Date</div>
          <div className="cell patient">Patient</div>
          <div className="cell age">Age</div>
          <div className="cell blood">Blood Group</div>
          <div className="cell disease">Disease</div>
          <div className="cell action">Action</div>
        </div>

        {paginatedAppointments.map((item) => (
          <div
            key={item.name}
            className={`appointment-row ${activeKey === item.name ? "active" : ""}`}
            onClick={() => setActiveKey(item.name)}
          >
            <div className="cell time">{item.time}</div>
            <div className="cell date">{item.date}</div>
            <div className="cell patient">
              <img src={item.image} alt={item.name} className="avatar" />
              <span>{item.name}</span>
            </div>
            <div className="cell age">{item.age}</div>
            <div className="cell blood">{item.blood}</div>
            <div className="cell disease">{item.disease}</div>
            <div className="cell action">
              <Button className="intake-btn">Intake</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          className="page-btn"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="pages">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-number ${currentPage === i + 1 ? "active-page" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          className="page-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
}
