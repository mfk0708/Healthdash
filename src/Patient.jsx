import React, { useState, useEffect } from 'react';
import './Patient.css';
import { Search } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faUser } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProfileBox from './ProfileBox.jsx';


const Patient = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Alphabetical');
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterType, setFilterType] = useState('date');
  const [selectedPatient, setSelectedPatient] = useState(null);
const [doctorName, setDoctorName] = useState("");
const [doctorImage, setDoctorImage] = useState("");
const [selectedDoctorId, setSelectedDoctorId] = useState("doc1");

  useEffect(() => {
    fetch(`https://july-visual-compaq-sticky.trycloudflare.com/dashboard`)
      .then((response) => response.json())
      .then((data) => setPatients(data))
      .catch((error) => console.error('Error fetching patients:', error));
  }, []);

  const fetchPatientById = async (patientId) => {
    try {
      const response = await fetch(`https://july-visual-compaq-sticky.trycloudflare.com/profile/${patientId}`);
      if (!response.ok) throw new Error('Failed to fetch patient');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setSelectedPatient(data[0]); // set first object
      }
    } catch (error) {
      console.error('Error fetching patient by ID:', error);
    }
  };

  const sortedPatients = [...patients].sort((a, b) => {
    if (sortBy === 'Alphabetical') {
      return (a.patient_name || '').localeCompare(b.patient_name || '');
    } else if (sortBy === 'Newest') {
      return new Date(b.date) - new Date(a.date);
    }
    return 0;
  });
useEffect(() => {
  fetch(`https://july-visual-compaq-sticky.trycloudflare.com/doctor`)
    .then((res) => res.json())
    .then((doctors) => {
      if (!Array.isArray(doctors)) return;

      const selectedDoctor = doctors.find((doc) => doc.doctor_id === selectedDoctorId);
      if (!selectedDoctor) return;

      setDoctorName(selectedDoctor.name || "");
      setDoctorImage(`https://drive.google.com/uc?export=view&id=${selectedDoctor.image_file_id}`);
    })
    .catch((err) => console.error("Failed to fetch doctor data:", err));
}, [selectedDoctorId]);

  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const filteredPatients = sortedPatients.filter((patient) => {
    const matchesSearch = (patient.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    if (selectedDate) {
      const patientDateObj = new Date(patient.date);
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
      {/* Header Section */}
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
                 <img
  src={doctorImage || "./images/doctor.png"}
  className="profile-avatar-patient"
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
        </div>
      </div>

      {/* Filters */}
      <div className="patients-header">
        <div className="filters">
          <div className="filter-group-row">
            <label className="filter-label">Sort by:</label>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="Alphabetical">Alphabetical</option>
              <option value="Newest">Newest</option>
            </select>
          </div>

          <div className="filter-group-row">
            <label className="filter-label">Filter by Date:</label>
            <div className="date-filter">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
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
                    <span>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button className="month-arrow" onClick={increaseMonth}>{'>'}</button>
                    <button
                      className="toggle-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterType(prev => prev === 'date' ? 'month' : 'date');
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

      {/* Patient Grid */}
      <div className="patients-grid">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient, index) => (
            <div className="patient-card" key={index}>
              <div className="patient-info-row">
                {patient?.image ? (
                  <img src={patient.image} alt={patient.patient_name || "Patient"} className="profile-img" />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="profile-img default-avatar" />
                )}
                <div className="patient-text">
                  <h3>{patient.patient_name || "Unknown Patient"}</h3>
                  <p>{patient.patient_age || "unknown"} • {patient.gender || "—"}</p>
                </div>
              </div>
              <p className="visit">Last visit: {patient.date}</p>
              <div className="full-width-divider-wrapper">
                <hr className="card-divider" />
              </div>
              <button
                className="view-btn"
                onClick={() => fetchPatientById(patient.patient_id)}
              >
                View Profile
              </button>
            </div>
          ))
        ) : (
          <p>No patients found for the selected date or month.</p>
        )}
      </div>

      {/* Profile Modal */}
      {selectedPatient && (
        <div className="profile-modal">
          <ProfileBox patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
        </div>
      )}
    </div>
  );
};

export default Patient;
