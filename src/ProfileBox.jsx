import React, { useState, useRef, useEffect } from 'react';
import './ProfileBox.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

const ProfileBox = ({ patient, onClose }) => {
  const [activeTab, setActiveTab] = useState('doctor');
  const boxRef = useRef();
  const prescriptionRef = useRef();

const printPrescription = () => {
  const content = prescriptionRef.current.innerHTML;
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write(`
    <html>
      <head>
        <title>Prescription</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};


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
  {patient?.image ? (
    <img
      src={patient.image}
      alt={patient.name || "Patient"}
      className="header-avatar"
    />
  ) : (
    <FontAwesomeIcon
      icon={faUser}
      className="header-avatar default-avatar"
    />
  )}

  <div className="header-info">
    <p className="header-name">{patient?.name || "Unknown Patient"}</p>
    <p className="header-sub">
      {patient?.age !== undefined ? `${patient.age} Yrs` : "—"}{", "}
      {patient?.gender || "—"}
    </p>
  </div>


          </div>

          {/* Middle Box */}
          <div className="header-box">
            <p className="label1">Appointments</p>
            <div className="appointments">
              <div className="appointment-box">
                <h2>{patient.pastAppointments || "0"}</h2>
                <span className='status1'>Past</span>
              </div>
              <div className="vertical-divider" />
              <div className="appointment-box">
                <h2>{patient.upcomingAppointments || "0"}</h2>
                <span className="status2">Upcoming</span>
              </div>
            </div>
          </div>

          {/* Right Box */}
          <div className="header-box">
            <p className="label">Phone</p>
            <p className='label-value'>{patient.phone ||"000000000"}</p>
            <p className="label">Address</p>
            <p className='label-value'>{patient.address || "none"}</p>
            <p className="label">City</p>
            <p className='label-value'>{patient.city || "none"}</p>
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
                 {(patient?.visitHistory ?? []).length > 0 ? (
  patient.visitHistory.map((visit, idx) => (
    <tr key={idx}>
      <td>{visit?.doctor      || "—"}</td>
      <td>{visit?.speciality  || "—"}</td>
      <td>{visit?.reason      || "—"}</td>
      <td>{visit?.date        || "—"}</td>
      <td><button className="pdf-btn">PDF</button></td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan={5} style={{ textAlign: "center" }}>
      No visit history
    </td>
  </tr>
)}

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
  {(patient?.tests ?? []).length > 0 ? (
    patient.tests.map((test, idx) => (
      <tr key={idx}>
        <td>{test?.testDate || "—"}</td>
        <td>{test?.testName || "—"}</td>
        <td>{test?.status || "—"}</td>
        <td>{test?.result || "—"}</td>
        <td>
          {test?.status === 'Completed' ? (
            <button className="pdf-btn">PDF</button>
          ) : (
            "Pending"
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} style={{ textAlign: "center" }}>
        No test records available
      </td>
    </tr>
  )}
</tbody>

              </table>
            )}

            {activeTab === 'prescription' && (
              <div className="prescription-section" >
                <div ref={prescriptionRef} className="print-area">
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
  {(patient?.medications ?? []).length > 0 ? (
    patient.medications.map((med, idx) => (
      <tr key={idx}>
        <td>{med?.name || "—"}</td>
        <td>{med?.dosage || "—"}</td>
        <td>{med?.frequency || "—"}</td>
        <td>{med?.duration || "—"}</td>
        <td>{med?.notes || "—"}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} style={{ textAlign: "center" }}>
        No medications prescribed
      </td>
    </tr>
  )}
</tbody>

                </table>
                </div>
 <div className="print-icon-wrapper"  onClick={printPrescription}>
      <FontAwesomeIcon icon={faPrint} className="print-logo no-print" />
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
