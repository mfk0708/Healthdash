import React, { useState, useRef, useEffect } from 'react';
import './ProfileBox.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faAngleDown, faUser } from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);


const API ='https://healthapi-zol8.onrender.com'
const apiKey = import.meta.env.VITE_API_KEY;

const ProfileBox = ({ patient, onClose }) => {
  const [activeTab, setActiveTab] = useState('doctor');
  const [hemoData, setHemoData] = useState(null);
  const [pathology, setPathology] = useState([]);
  const [visitHistory, setVisitHistory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [fullProfile, setFullProfile] = useState(null);

  const boxRef = useRef();
  const prescriptionRef = useRef();

  
const printPrescription = () => {
  const content = prescriptions.map((med) => `
    <tr>
      <td>${med.medicine}</td>
      <td>${med.dosage}</td>
      <td>${med.duration}</td>
      <td>${med.frequency}</td>
      <td>${med.notes || '-'}</td>
    </tr>
  `).join('');

  const patientName = fullProfile?.name || '---';
  const patientAge = fullProfile?.age || '--';
  const patientGender = fullProfile?.gender || '--';
  const today = new Date().toLocaleDateString();

  const printWindow = window.open('', '', 'height=1000,width=800');
  printWindow.document.write(`
    <html>
      <head>
        <title>Prescription Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            background: #fff;
            color: #000;
            padding: 0;
          }

          .header {
            background-color: #00b1cc;
            color: white;
            display: flex;
            align-items: center;
            padding: 15px 30px;
          }

          .logo-pentagon {
            width: 40px;
            height: 40px;
            background: #007f9b;
            clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-weight: bold;
            font-size: 20px;
            color: white;
            font-family: Arial, sans-serif;
          }

          .header-text {
            line-height: 1.2;
          }

          .header-text h2 {
            margin: 0;
            font-size: 22px;
          }

          .header-text span {
            font-size: 13px;
          }

          .title {
            text-align: center;
            color: #0072ce;
            font-weight: bold;
            font-size: 18px;
            margin: 20px 0 10px;
            text-transform: uppercase;
          }

          .info-section {
            display: flex;
            justify-content: space-between;
            padding: 10px 30px;
            font-size: 14px;
            background-color: #f9f9f9;
            border: 1px solid #ccc;
            margin: 0 30px 20px;
          }

          .info-section div {
            width: 48%;
            line-height: 1.6;
          }

          .prescription-table {
            width: 90%;
            margin: 0 auto 30px;
            border-collapse: collapse;
            font-size: 14px;
          }

          .prescription-table th,
          .prescription-table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }

          .prescription-table th {
            background-color: #f2f2f2;
          }

          .footer {
            background-color: #00b1cc;
            color: white;
            text-align: center;
            padding: 15px 0 5px;
            font-size: 13px;
            margin-top: 30px;
          }

          .footer .lab {
            font-weight: bold;
            margin-top: 10px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-pentagon">H</div>
          <div class="header-text">
            <h2>HMS Medical Hospital</h2>
            <span>Prescription centre</span>
          </div>
        </div>

        <div class="title"></div>

        <div class="info-section">
          <div>
            <strong>Pt. Name:</strong> ${patientName}, ${patientAge}/${patientGender}<br>
            <strong>Ref. By:</strong> Dr. Joseph Rajm, M.D<br>
            <strong>OP/IP:</strong> OP
          </div>
          <div>
            <strong>Prescription date:</strong> ${today} 8:10 AM<br>
           
          </div>
        </div>

        <div class="title">PRESCRIPTION</div>

        <table class="prescription-table">
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
            ${content}
          </tbody>
        </table>

        <div class="footer">
          www.hmsmedico.com | 9876543210
          <div class="lab">JOHN HARINGTON<br>Medical Incharge</div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

  
useEffect(() => {
  if (!patient?.patient_id) return;

  fetch(`${API}/profile/${patient.patient_id}`,
    {
      headers:{"x-api-key":apiKey}
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched profile from backend:", data); // 👈 Add this
      const profile = data[0];

      if (profile?.hemoglobin && Array.isArray(profile.hemoglobin)) {
        console.log("Hemoglobin found:", profile.hemoglobin); // 👈 Add this
        setHemoData({
          labels: profile.hemoglobin.map((item) => item.month),
          datasets: [
            {
              label: 'Hemoglobin (g/dL)',
              data: profile.hemoglobin.map((item) => item.value),
              borderColor: '#333',
              backgroundColor: '#333',
              tension: 0.3,
              fill: false,
            },
          ],
        });
      } else {
        console.warn("Hemoglobin data is missing or invalid");
      }
    })
    .catch((error) => {
      console.error('Error fetching hemoglobin chart data:', error);
    });
}, [patient?.patient_id]);


  useEffect(() => {
    if (patient?.patient_id) {
      // Fetch full profile
      fetch(`${API}/profile/${patient.patient_id}`,
        {
          headers:{"x-api-key":apiKey}
        }
      )
        .then(res => res.json())
        .then(data => setFullProfile(data[0])) // response is an array
        .catch(err => console.error("Error fetching patient profile:", err));

      // Pathology
      fetch(`${API}/pathology/${patient.patient_id}`,
        {
          headers:{"x-api-key":apiKey}
        }
      )
        .then((res) => res.json())
        .then((data) => setPathology(data))
        .catch((error) => console.error('Error fetching pathology data:', error));

      // Doctor Checkup
      fetch(`${API}/checkup/${patient.patient_id}`,
        {
          headers:{"x-api-key":apiKey}
        }
      )
        .then((res) => res.json())
        .then((data) => setVisitHistory(data || []))
        .catch((error) => console.error('Error fetching visit history:', error));

      // Prescription
      fetch(`${API}/prescription/${patient.patient_id}`,
        {
          headers:{"x-api-key":apiKey}
        }
      )
        .then((res) => res.json())
        .then((data) => setPrescriptions(data?.prescriptions || []))
        .catch((error) => console.error('Error fetching prescriptions:', error));
    }
  }, [patient?.patient_id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    
    <div className="profile-box-container">
      <div className="profile-box-card" ref={boxRef}>
        <div className="top-cards">
          <div className="left-card">
            <div className="hospital-name"><img src="./images/cudu.png" className='cudu-icon' alt="logo" /> KEM</div>
            <div className="patient-details">
              <div className="patient-container">
                {fullProfile?.profile_picture ? (
                  <img src={`./images/${fullProfile.profile_picture}`} alt="Patient" className="patient-img" />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="patient-img" style={{ color: "grey" }} />
                )}
                <p className='pid'><strong>PID: {fullProfile?.patient_id}</strong></p>
              </div>
              <div>
                <p><strong>Name:</strong> <span className="value">{fullProfile?.name}</span></p>
                <p><strong>Age:</strong> <span className="value">{fullProfile?.age} years</span></p>
                <p><strong>Gender:</strong> <span className="value">{fullProfile?.gender}</span></p>
                <p><strong>Blood Group:</strong> <span className="value">{fullProfile?.blood_group}</span></p>
                <p><strong>Weight:</strong> <span className="value">{fullProfile?.weight}</span></p>
                <p><strong>Height:</strong> <span className="value">{fullProfile?.height}</span></p>
              </div>
              <p className="emer">
                <strong>Emergency Contact:</strong><br />
                <span className="value">{fullProfile?.emergency_contact}</span>
              </p>
            </div>
          </div>

          <div className="right-card">
            <div className="right-content-row">
              <div className='right'>
                <p>Phone:<br /><span className="value">{fullProfile?.phone}</span></p>
                <p>City:<br /><span className="value">{fullProfile?.city}</span></p>
                <p>Address:<br /><span className="value">{fullProfile?.address}, {fullProfile?.city}</span></p>
                <p>Pin Code:<br /><span className="value">{fullProfile?.pincode}</span></p>
              </div>      </div> 
          </div>
{hemoData && (
  <div className="hemo-card">
    <div className="hemo-header">
      <h3>Hemoglobin</h3>
      <p>Over the past 3 months</p>
    </div>
    <div className="hemo-value">
      <span className="value">{hemoData.datasets[0].data.at(-1)}</span>
      <span className="unit">g/dL</span>
    </div>
    <div className="hemo-chart">
      <Line
  data={hemoData}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#333',
          font: {
            size: 8,
            weight: '500',
          },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        grid: {
          color: '#eee',
          drawBorder: false,
          drawTicks: false,
        },
        ticks: {
          color: '#999',
          font: { size: 8 },
          stepSize: 1,
        },
        suggestedMin: 11,
        suggestedMax: 15,
      },
    },
  }}
/>

    </div>
  </div>
)}


          </div>
   

        <div className="tabsorg">
          <div className="tabs">
            <button onClick={() => setActiveTab('doctor')} className={activeTab === 'doctor' ? 'active' : ''}>DOCTOR CHECK UP</button>
            <button onClick={() => setActiveTab('pathology')} className={activeTab === 'pathology' ? 'active' : ''}>PATHOLOGY</button>
            <button onClick={() => setActiveTab('prescription')} className={activeTab === 'prescription' ? 'active' : ''}>PRESCRIPTION</button>
            <button onClick={() => setActiveTab('analytics')} className={activeTab === 'analytics' ? 'active' : ''}>ANALYTICS</button>
            <button onClick={() => setActiveTab('billing')} className={activeTab === 'billing' ? 'active' : ''}>BILLING</button>
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
                  {visitHistory.length > 0 ? (
                    visitHistory.map((visit, idx) => (
                      <tr key={idx}>
                        <td>{visit.name}</td>
                        <td>{visit.specialization}</td>
                        <td>{visit.disease}</td>
                        <td>{visit.date}</td>
                        <td><button className="pdf-btn">PDF</button></td>
                        <td><FontAwesomeIcon icon={faAngleDown} title="Done" className="icon done-icon" /></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>No visit history</td>
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
                  {pathology.length > 0 ? (
                    pathology.map((test, idx) => (
                      <tr key={idx}>
                        <td>{test.date}</td>
                        <td>{test.test_name}</td>
                        <td>{test.status}</td>
                        <td>{test.diagnosis}</td>
                        <td>
  {test.status === "Completed" ? (
    <button
      className="pdf-btn"
      onClick={() => window.open(`/images/pathol.png`, '_blank')}
    >
      PDF
    </button>
  ) : (
    "Pending"
  )}
</td>

                        <td><FontAwesomeIcon icon={faAngleDown} title="Done" className="icon done-icon" /></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>No test records available</td>
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
                      {prescriptions.length > 0 ? (
                        prescriptions.map((med, idx) => (
                          <tr key={idx}>
                            <td>{med.medicine}</td>
                            <td>{med.dosage}</td>
                            <td>{med.duration}</td>
                            <td>{med.frequency}</td>
                            <td>{med.notes}</td>
                            <td><FontAwesomeIcon icon={faAngleDown} title="Done" className="icon done-icon" /></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: "center" }}>No medications prescribed</td>
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
};

export default ProfileBox;
