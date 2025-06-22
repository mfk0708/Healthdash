import React, { useState, useRef, useEffect } from 'react';
import './ProfileBox.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

const ProfileBox = ({ patient, onClose }) => {
  const [activeTab, setActiveTab] = useState('doctor');
  const boxRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        onClose(); // Close modal if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="profile-box-container">
      <div className="profile-box-card" ref={boxRef}>
        {/* HEADER THREE BOXES */}
        <div className="header-grid">
          {/* Left Box */}
          <div className="header-box">
            <img src={patient.image} alt={patient.name} className="header-avatar" />
            <div className="header-info">
              <p className="header-name">{patient.name}</p>
              <p className="header-sub">{patient.age} Yrs, {patient.gender}</p>
            </div>
          </div>

          {/* Middle Box */}
          <div className="header-box">
            <p className="label1">Appointments</p>
            <div className="appointments">
              <div className="appointment-box">
                <h2>{patient.pastAppointments}</h2>
                <span className='status1'>Past</span>
              </div>
              <div className="vertical-divider" />
              <div className="appointment-box">
                <h2>{patient.upcomingAppointments}</h2>
                <span className="status2">Upcoming</span>
              </div>
            </div>
          </div>

          {/* Right Box */}
          <div className="header-box">
            <p className="label">Phone</p>
            <p className='label-value'>{patient.phone}</p>
            <p className="label">Address</p>
            <p className='label-value'>{patient.address}</p>
            <p className="label">City</p>
            <p className='label-value'>{patient.city}</p>
          </div>
        </div>

        {/* Tabs Section */}
        <div className='tabsorg'>
          <div className="tabs">
            <button onClick={() => setActiveTab('doctor')} className={activeTab === 'doctor' ? 'active' : ''}>Doctor Checkup</button>
            <button onClick={() => setActiveTab('pathology')} className={activeTab === 'pathology' ? 'active' : ''}>Pathology</button>
            <button onClick={() => setActiveTab('prescription')} className={activeTab === 'prescription' ? 'active' : ''}>Prescriptions</button>
          </div>

          <div className="tab-content">
            {activeTab === 'doctor' && (
              <table>
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Speciality</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Report</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.visitHistory.map((visit, idx) => (
                    <tr key={idx}>
                      <td>{visit.doctor}</td>
                      <td>{visit.speciality}</td>
                      <td>{visit.reason}</td>
                      <td>{visit.date}</td>
                      <td><button className="pdf-btn">PDF</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'pathology' && (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Test Name</th>
                    <th>Status</th>
                    <th>Diagnosis</th>
                    <th>Report</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.tests.map((test, idx) => (
                    <tr key={idx}>
                      <td>{test.testDate}</td>
                      <td>{test.testName}</td>
                      <td>{test.status}</td>
                      <td>{test.result}</td>
                      <td>{test.status === 'Completed' ? <button className="pdf-btn">PDF</button> : 'Pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'prescription' && (
              <div className="prescription-section">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.medications.map((med, idx) => (
                      <tr key={idx}>
                        <td>{med.name}</td>
                        <td>{med.dosage}</td>
                        <td>{med.frequency}</td>
                        <td>{med.duration}</td>
                        <td>{med.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="print-icon-wrapper">
                  <FontAwesomeIcon icon={faPrint} className="print-logo" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
