import React, { useState, useRef, useEffect } from 'react';
import './ProfileBox.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faAngleDown } from "@fortawesome/free-solid-svg-icons";

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
      {/* HEADER CARDS SECTION */}
      <div className="top-cards">
        {/* Left Card */}
        <div className="left-card">
          <div className="hospital-name"><img src="./images/cudu.png" className='cudu-icon'></img> KEM</div>
          <div className="patient-details">
          <div class="patient-container">
            <img src={patient.image} alt="Patient" className="patient-img" />
            <p className='pid'><strong>PID: {patient.pid}</strong></p>
            </div><div>
             <p><strong>Name:</strong> <span className="value">{patient.name}</span></p>
<p><strong>Age:</strong> <span className="value">{patient.age} years</span></p>
<p><strong>Gender:</strong> <span className="value">{patient.gender}</span></p>
<p><strong>Blood Group:</strong> <span className="value">{patient.bloodGroup}</span></p>
<p><strong>Weight:</strong> <span className="value">{patient.weight}</span></p>
<p><strong>Height:</strong> <span className="value">{patient.height}</span></p>
            </div>
            <p className="emer"><strong>Emergency Contact:</strong> <br></br><span className="value">{patient.emergency}<br></br>{patient.emergencyContact}</span></p>

          </div>
        </div>

        {/* Right Card */}
        <div className="right-card">
          <div className="right-content-row">
       <div className='right'>
          <p>Phone:<br /><span className="value">{patient.phone}</span></p>
      <p>City:<br /><span className="value">{patient.city}</span></p>
      <p>Address:<br /><span className="value">{patient.address}, {patient.city}</span></p>
      <p>Pin Code:<br /><span className="value">490002</span></p></div>
          <div className="insurance-card">
           <div className="house-pentagon"><span>H</span></div>
            <p className="assurance-heading"> Assurance number</p>
            <h3>{patient.assuranceNumber}</h3>
            <p className='expiry'>EXPIRY DATE</p>
            <p>{patient.expiryDate}</p>
      
        </div></div>
      </div></div>

      {/* TABS */}
      <div className="tabsorg">
        <div className="tabs">
          <button
            onClick={() => setActiveTab('doctor')}
            className={activeTab === 'doctor' ? 'active' : ''}
          >
            DOCTOR CHECK UP
          </button>
          <button
            onClick={() => setActiveTab('pathology')}
            className={activeTab === 'pathology' ? 'active' : ''}
          >
            PATHOLOGY
          </button>
          <button
            onClick={() => setActiveTab('prescription')}
            className={activeTab === 'prescription' ? 'active' : ''}
          >
            PRESCRIPTION
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={activeTab === 'analytics' ? 'active' : ''}
          >
            ANALYTICS
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={activeTab === 'billing' ? 'active' : ''}
          >
            BILLING
            </button>
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
                {patient?.visitHistory?.length > 0 ? (
                  patient.visitHistory.map((visit, idx) => (
                    <tr key={idx}>
                      <td>{visit.doctor}</td>
                      <td>{visit.speciality}</td>
                      <td>{visit.reason}</td>
                      <td>{visit.date}</td>
                      <td><button className="pdf-btn">PDF</button></td>
                      <td> <FontAwesomeIcon icon={faAngleDown} title="Done" className="icon done-icon" /></td>
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
                {patient?.tests?.length > 0 ? (
                  patient.tests.map((test, idx) => (
                    <tr key={idx}>
                      <td>{test.testDate}</td>
                      <td>{test.testName}</td>
                      <td>{test.status}</td>
                      <td>{test.result}</td>
                      <td>
                        {test.status === "Completed" ? (
                          <button className="pdf-btn">PDF</button>
                        ) : (
                          "Pending"
                        )}
                      </td>
                       <td> <FontAwesomeIcon icon={faAngleDown} title="Done" className="icon done-icon" /></td>
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
            <div className="prescription-section">
              <div ref={prescriptionRef} className="print-area">
                <table>
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Duration</th>
                      <th>Frequency</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient?.medications?.length > 0 ? (
                      patient.medications.map((med, idx) => (
                        <tr key={idx}>
                          <td>{med.name}</td>
                          <td>{med.dosage}</td>
                          <td>{med.duration}</td>
                          <td>{med.frequency}</td>
                          <td>{med.notes}</td>
                           <td> <FontAwesomeIcon icon={faAngleDown} title="Done" className="icon done-icon" /></td>
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

              <div className="print-icon-wrapper" onClick={printPrescription}>
                <FontAwesomeIcon icon={faPrint} className="print-logo" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
export default ProfileBox;
