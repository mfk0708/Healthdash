import React, { useState, useEffect } from 'react';
import './Patient.css';
import { Search } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProfileBox from './ProfileBox.jsx';

const Patient = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Alphabetical');
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterType, setFilterType] = useState('date'); // 'date' or 'month'
const [selectedPatient, setSelectedPatient] = useState(null);
  useEffect(() => {
    fetch('/appointments.json')
      .then((response) => response.json())
      .then((data) => setPatients(data))
      .catch((error) => console.error('Error fetching patients:', error));
  }, []);

  const sortedPatients = [...patients].sort((a, b) => {
    if (sortBy === 'Alphabetical') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'Newest') {
      return new Date(b.lastVisit) - new Date(a.lastVisit);
    }
    return 0;
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const filteredPatients = sortedPatients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    if (selectedDate) {
      const patientDateObj = new Date(patient.lastVisit);
      const formattedPatientDate = formatDate(patientDateObj);
      const formattedSelectedDate = formatDate(selectedDate);

      if (filterType === 'date') {
        matchesDate = formattedPatientDate === formattedSelectedDate;
      } else if (filterType === 'month') {
        matchesDate = formattedPatientDate.startsWith(formattedSelectedDate.slice(0, 7));
      }
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div className="patients-container">
      {/* Title + Search */}
      <div className="patients-title-bar">
        <h1 className="page-heading">Patients</h1>
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>
        <div className="profile-box1">
          <img src="images/doctor.png" className="profile-avatar-patient" alt="Profile" />
          <div className="profile-info">
            <div className="profile-name">Dr. Sarah</div>
            <FontAwesomeIcon icon={faAngleDown} className="vectorlogo" />
          </div>
        </div>
      </div>

      {/* Filters and Add Button */}
      <div className="patients-header">
        <div className="filters">
          <div className="filter-group-row">
            <label className="filter-label">Sort by:</label>
            <div className="sortby">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Alphabetical">Alphabetical</option>
                <option value="Newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="filter-group-row">
            <label className="filter-label">Filter by Date:</label>
            <div className="date-filter">
              <DatePicker
  selected={selectedDate}
  onChange={handleDateChange}
  placeholderText="Select a date"
  dateFormat={filterType === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM'}
  showMonthYearPicker={filterType === 'month'}
  className="date-input"
  calendarClassName="custom-calendar"
  calendarContainer={({ className, children }) => (
    <div className={`${className} custom-calendar-wrapper`}>
      {children}
      <button
        className="clear-button"
        onClick={(e) => {
          e.preventDefault();
          setSelectedDate(null);
        }}
      >
        Clear
      </button>
    </div>
  )}
  renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
    <div className="custom-header">
      <button className="month-arrow" onClick={decreaseMonth}>{'<'}</button>
      <span>
        {date.toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        })}
      </span>
      <button className="month-arrow" onClick={increaseMonth}>{'>'}</button>
      <button
        className="toggle-button"
        onClick={(e) => {
          e.stopPropagation();
          setFilterType((prev) => (prev === 'date' ? 'month' : 'date'));
        }}
      >
        {filterType === 'date' ? 'Month' : 'Date'}
      </button>
    </div>
  )}


              />
            </div>
            <button className="add-button">+Add</button>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="patients-grid">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient, index) => (
            <div className="patient-card" key={index}>
              <div className="patient-info-row">
               {patient?.image ? (
    <img src={patient.image} alt={patient.name || "Patient"} className="profile-img" />
  ) : (
    <FontAwesomeIcon icon={faUser} className="profile-img default-avatar" />
  )}
                <div className="patient-text">
                  <h3>{patient.name || "Unknown Patient"}</h3>
                  <p>{patient.age|| "unknown" } • {patient.gender|| "—"}</p>
                </div>
              </div> 
              <p className="visit">Last visit: {patient.lastVisit}</p>
              <div className="full-width-divider-wrapper">
                <hr className="card-divider" />
              </div>
             <button className="view-btn" onClick={() => setSelectedPatient(patient)}>
  View Profile
</button>

            </div>
          ))
        ) : (
          <p>No patients found for the selected date or month.</p>
        )}
      </div>
      {selectedPatient && (
         <div className="profile-modal">
  <ProfileBox patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
  </div>
)}

    </div>
  );
};

export default Patient;