import React, { useState, useRef, useEffect } from 'react';
import './IntakePage.css';
import './DoctorComment.css';
import BetaVersion from './BetaVersion.jsx';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faFolderOpen, faXmark} from "@fortawesome/free-solid-svg-icons";

const IntakePage = ({ onClose, patient }) => {
  const [activeTab, setActiveTab] = useState('intake');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', duration: '' }
  ]);
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);
const [testResults, setTestResults] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
const [customTestName, setCustomTestName] = useState('');
const [showUpcomingPopup, setShowUpcomingPopup] = useState(false);
const popupRef = useRef();
const [appointmentDates, setAppointmentDates] = useState(['', '', '']);
const [appointmentStatuses, setAppointmentStatuses] = useState(['Not yet', 'Not yet', 'Not yet']);
const [focusedIndex, setFocusedIndex] = useState(null);
const [uploadedFiles, setUploadedFiles] = useState({});
const [uploadSuccess, setUploadSuccess] = useState({});
const intakeRef = useRef();
useEffect(() => {
  const handleClickOutsideIntake = (event) => {
    if (intakeRef.current && !intakeRef.current.contains(event.target)) {
      onClose(); // 👈 call the parent to close the intake page
    }
  };

  document.addEventListener("mousedown", handleClickOutsideIntake);

  return () => {
    document.removeEventListener("mousedown", handleClickOutsideIntake);
  };
}, [onClose]);


useEffect(() => {
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowUpcomingPopup(false);
    }
  };

  if (showUpcomingPopup) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showUpcomingPopup]);
  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '',  frequency: '', duration: '', notes: '' }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handlePrint = () => {
    const printContents = document.getElementById('prescription-print').innerHTML;
    const newWin = window.open('', '', 'width=800,height=600');
    newWin.document.write('<html><head><title>Print Prescription</title>');
    newWin.document.write('<style>body{font-family:Arial;} .medicine-row{display:flex;gap:2rem;margin-bottom:8px;}</style>');
    newWin.document.write('</head><body>');
    newWin.document.write(printContents);
    newWin.document.write('</body></html>');
    newWin.document.close();
    newWin.print();
  };

  const handleSaveClick = () => {
    setShowConfirm(true);
  };
const handleConfirmSave = async () => {
  setShowConfirm(false);

  try {
    const formData = new FormData();

    formData.append("medicines", JSON.stringify(medicines));
    formData.append("test", selectedTest);
    formData.append("testResults", JSON.stringify(testResults));
    formData.append("appointmentDates", JSON.stringify(appointmentDates));
    formData.append("appointmentStatuses", JSON.stringify(appointmentStatuses));

    // Append each uploaded file
    uploadedFiles.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    const response = await fetch("https://dummy-server.com/api/save", {
      method: "POST",
      body: formData, // no need for headers like Content-Type; it’s handled automatically
    });

    alert(response.ok ? "Prescription saved successfully!" : "Error saving prescription.");
  } catch {
    alert("Server error.");
  }
};

  
  const handleCancelSave = () => {
    setShowConfirm(false);
  };
  const [comment, setComment] = useState('');
const handleCommentSubmit = async () => {
  if (!comment.trim()) {
    alert("Comment cannot be empty.");
    return;
  }


  try {
    const response = await fetch("https://dummy-server.com/api/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: patient?.id || null,
        doctor: patient?.doctor || "Unknown",
        comment: comment
      })
    });

    if (response.ok) {
      alert("Comment submitted successfully.");
      setComment('');
    } else {
      alert("Failed to submit comment.");
    }
  } catch (error) {
    alert("Error submitting comment.");
  }
};

const handleClearComment = () => {
  setComment('');
};
const handleDateChange = (index, value) => {
  const updated = [...appointmentDates];
  updated[index] = value;
  setAppointmentDates(updated);
};

  return (
    <div className="overlay">
     <div className="intake-box" ref={intakeRef}>
      <div className="modal">
        <div className="modal-scroll">
          <div className="modal-header">
            <h2>Appointment Intake</h2>
            <span className="close-btn" onClick={onClose}> <FontAwesomeIcon icon={faXmark} /></span>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <span
              className={`tab ${activeTab === 'intake' ? 'active' : ''}`}
              onClick={() => setActiveTab('intake')}
            >
              Intake Info
            </span>
            <span
              className={`tab ${activeTab === 'beta' ? 'active' : ''}`}
              onClick={() => setActiveTab('beta')}
            >
              Beta Version
            </span>
            <span
              className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Doctor’s Comment
            </span>
          </div>

          {/* Intake Info Section */}
          {activeTab === 'intake' && (
            <>
              <div className="info-grid">
                <div className="card card1">
                  <h4>Appointment Summary</h4>
                  <p className="name11">
                    <span className="pnamelabel1">Patient Name&nbsp;</span>
                    <span className="pnamevalue1">{patient?.name || 'Unknown'}</span>
                  </p>
                  <p>APTNO{patient?.id || 'N/A'}</p>
                  <p>{patient?.date || 'N/A'}</p>
                  <button className="status-btn" onClick={() => setShowUpcomingPopup(true)}>Upcoming</button>

                </div>
                <div className="card card3">
  <h4>Doctor Info</h4>
  <p>{patient?.doctor || "not assigned"}</p>
  <p>{patient?.specialization || "not available"}</p>
</div>

                <div className="card card2">
                  <h4>Reason for visit</h4>
                 
                  <hr className="card-divider" />
                  <p>{patient?.reason || 'No reason provided'}</p>
                </div>
                <div className="card card4">
                  <h4>Vital signs</h4>
                   
                  <hr className="card-divider" />
                  <p className="row">
                    <span className="pnamelabel2">Blood Pressure&nbsp;</span>
                    <span className="pnamevalue2">{patient?.bloodPressure || 'N/A'}</span>
                  </p>
                  <p className="row">
                    <span className="pnamelabel2">Temperature&nbsp;</span>
                    <span className="pnamevalue2">{patient?.temperature || 'N/A'}</span>
                  </p>
                  <p className="row">
                    <span className="pnamelabel2">Pulse&nbsp;</span>
                    <span className="pnamevalue2">{patient?.pulse || 'N/A'}</span>
                  </p></div>
                </div>
              

              {/* Prescription Section */}
              <div className="print-section" id="prescription-print">
                <h4 className="prescription-heading">Prescriptions</h4>
                <div className="prescription-box">
                  <h5 className="addmedicine">Add Medicine</h5>
                  <div className="medicine-table">
                    <div className="medicine-row header">
                      <div>Medicine Name</div>
                      <div>Dosage</div>
                       <div>Frequency</div>
                      <div>Duration</div>
                      <div>Notes</div>
                    </div>
                    {medicines.map((med, index) => (
                      <div className="medicine-row" key={index}>
                        <div>
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                            placeholder="Enter medicine"
                          />
                        </div>
                        
                        <div>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleChange(index, 'dosage', e.target.value)}
                            placeholder="Dosage"
                          />
                        </div>
                          <div>
      <input
        type="text"
        value={med.frequency || ''}
        onChange={(e) => handleChange(index, 'frequency', e.target.value)}
        placeholder=" Twice a day"
      />
    </div>
      
                        <div>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => handleChange(index, 'duration', e.target.value)}
                            placeholder="no of days"
                          />
                        </div>
                         <div>
      <input
        type="text"
        value={med.notes || ''}
        onChange={(e) => handleChange(index, 'notes', e.target.value)}
        placeholder="Before food"
      />
    </div>
                      </div>
                    ))}
                  </div>
                  <button className="add-btn no-print" onClick={handleAddMedicine}>+ Add</button>
                </div>
              </div>

            {/* Pathology Section */}
<div className="pathology-section">
  <div className="pathology-grid">

    {/* Dropdown to Select Test */}
    <div className="input-group">
      <label htmlFor="test-select">Pathology</label>
      <select
        id="test-select"
        onChange={(e) => {
          const selected = e.target.value;
          setSelectedTest(selected);

        if (selected && selected !== 'Other' && !selectedTests.includes(selected)) {
  setSelectedTests([...selectedTests, selected]);
}

        }}
        style={{
          color: '#00120c',
          fontWeight: '500',
        }}
        value={selectedTest}
      >
        <option disabled value="">Add Test</option>
        <option>Blood Test</option>
        <option>ECG</option>
        <option>X-Ray</option>
        <option>CT Scan</option>
        <option>Urine Test</option>
        <option>MRI</option>
        <option>Thyroid Test</option>
        <option>Liver Function Test (LFT)</option>
        <option>Kidney Function Test (KFT)</option>
        <option>Glucose Tolerance Test</option>
        <option>Hemoglobin Test</option>
        <option>Lipid Profile</option>
        <option>COVID-19 RT-PCR</option>
        <option>Dengue Test</option>
        <option>HIV Test</option>
        <option>Vitamin D Test</option>
        <option>Calcium Test</option>
        <option value="Other">Other</option>

      </select>
       {selectedTest === 'Other' && (
  <input
    type="text"
    placeholder="Enter custom test name"
    value={customTestName}
    onChange={(e) => setCustomTestName(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && customTestName.trim()) {
        const name = customTestName.trim();

        // Avoid duplicates
        if (!selectedTests.includes(name)) {
          setSelectedTests([...selectedTests, name]);
        }

        setSelectedTest(name);         // Use it as selectedTest
        setCustomTestName('');         // Clear and hide input
        e.preventDefault();            // Prevent form submission
      }
    }}
    className="report-input"
    style={{ marginTop: '0.5rem' }}
  />
)}


    </div>

    {/* Default input field (always visible) */}
    <div className="input-group" style={{ position: 'relative' }}>
      {/* Cross button for default input field */}
      {selectedTest && (
        <button
          onClick={() => {
            const updatedTests = selectedTests.filter((t) => t !== selectedTest);
            const updatedResults = { ...testResults };
            delete updatedResults[selectedTest];
            setSelectedTests(updatedTests);
            setSelectedTest('');
            setTestResults(updatedResults);
          }}
          className="remove-button"
          title={`Remove ${selectedTest}`}
        >
           <FontAwesomeIcon icon={faXmark} className='remove-button' />
        </button>
      )}
<label htmlFor="result-input">
  {selectedTest === 'Other'
    ? `${customTestName || 'Custom Test'} Result`
    : selectedTest
    ? `${selectedTest} Result`
    : 'Result'}
</label>

     <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
    <input
      type="text"
      id="result-input"
      placeholder={
        selectedTest ? `Enter result for ${selectedTest}` : 'Enter result'
      }
      value={
        selectedTest
          ? testResults[selectedTest === 'Other' ? customTestName : selectedTest] || ''
          : ''
      }
      onChange={(e) => {
        if (selectedTest) {
          const key = selectedTest === 'Other' ? customTestName : selectedTest;
          if (key) {
            setTestResults({ ...testResults, [key]: e.target.value });
            if (!selectedTests.includes(key)) {
              setSelectedTests([...selectedTests, key]);
            }
          }
        }
      }}
      className="report-input"
      disabled={!selectedTest}
      style={{ paddingRight: "2rem" }}
    />

    {/* Hidden File Input */}
    <input
      type="file"
      id="file-upload"
      style={{ display: "none" }}
    onChange={(e) => {
  if (selectedTest && e.target.files.length > 0) {
    const fileName = e.target.files[0].name;

    setUploadedFiles((prev) => ({
      ...prev,
      [selectedTest]: fileName,
    }));

    setUploadSuccess((prev) => ({
      ...prev,
      [selectedTest]: true,
    }));

    setTimeout(() => {
      setUploadSuccess((prev) => ({
        ...prev,
        [selectedTest]: false,
      }));
    }, 3000); // Message disappears after 3 seconds
  }
}}


    />

    {/* Icon to trigger upload */}
    <label
      htmlFor="file-upload"
      style={{
        position: "absolute",
        right: "8px",
        cursor: "pointer",
        fontSize: "1rem",
        color: "#007bff",
      }}
      title="Upload file"
    >
     <FontAwesomeIcon icon={faFolderOpen} className='file-icon' />
    </label>
  </div>
{selectedTest && uploadSuccess[selectedTest] && (
  <p style={{ fontSize: "0.8rem", color: "green", marginTop: "4px" }}>
    {uploadedFiles[selectedTest]} uploaded successfully!
  </p>
)}


</div>



     
    </div>

    {/* Additional input fields for previously selected tests (excluding current selection) */}
    {selectedTests
  .filter((test) => test !== selectedTest)
  .map((test, index) => (
    <div className="input-group" key={index} style={{ position: 'relative' }}>
      {/* ❌ Close Button */}
      <button
        onClick={() => {
          const updatedTests = selectedTests.filter((t) => t !== test);
          const updatedResults = { ...testResults };
          delete updatedResults[test];
          setSelectedTests(updatedTests);

          if (selectedTest === test) {
            setSelectedTest('');
          }

          setTestResults(updatedResults);
        }}
        className="remove-button"
        title={`Remove ${test}`}
      >
         <FontAwesomeIcon icon={faXmark} className='remove-button' />
      </button>

      {/* Label */}
      <label htmlFor={`result-${index}`}>{test} Result</label>

      {/* Input + Upload Icon in one row */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <input
            type="text"
            id={`result-${index}`}
            placeholder={`Enter result for ${test}`}
            value={testResults[test] || ''}
            onChange={(e) =>
              setTestResults({ ...testResults, [test]: e.target.value })
            }
            className="report-input"
            style={{ paddingRight: "2rem" }}
          />

          {/* Hidden File Input */}
          <input
            type="file"
            id={`file-upload-${index}`}
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files.length > 0) {
                const fileName = e.target.files[0].name;
                setUploadedFiles((prev) => ({
                  ...prev,
                  [test]: fileName,
                }));
                setUploadSuccess((prev) => ({
                  ...prev,
                  [test]: true,
                }));
                setTimeout(() => {
                  setUploadSuccess((prev) => ({
                    ...prev,
                    [test]: false,
                  }));
                }, 3000);
              }
            }}
          />

          {/* Upload Icon */}
          <label
            htmlFor={`file-upload-${index}`}
            style={{
              position: "absolute",
              right: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              color: "#007bff",
            }}
            title="Upload file"
          >
            <FontAwesomeIcon icon={faFolderOpen} className='file-icon' />
          </label>
        </div>

        {/* Success Message */}
        {uploadSuccess[test] && (
          <p style={{ fontSize: "0.8rem", color: "green", marginTop: "4px" }}>
            {uploadedFiles[test]} uploaded successfully!
          </p>
        )}
      </div>
    </div>
  ))}

  </div>
</div>

       {/* Follow-up Section */}
              <div className="followup-box-row">
                <label className="followup-title">Follow-up Appointment</label>
                <div className="toggle-group">
                  <label>Reminder</label>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="footer">
                <button className="footer-btn" onClick={handleSaveClick}>Save</button>
                <button className="footer-btn" onClick={handlePrint}>Print Prescription</button>
              </div>
            </>
          )}

          {/* Beta Version Section */}
  {activeTab === 'beta' && (
  <div className="beta-section beta-white-bg">
    <BetaVersion
      patient={patient}
         onCancel={() => console.log('Voice cancelled')}
      onSubmit={(data) =>
        console.log('Voice submitted:', data.transcript, 'Rating:', data.rating)
      }
    />
  </div>
)}

      
{activeTab === 'comments' && (
  <div className="doctor-comment-section">
  {patient?.doctorImage ? (
    <img
      src={patient.doctorImage}
      alt={patient?.doctor || "Doctor Avatar"}
      className="doctorAvatar1"
    />
  ) : (
    <FontAwesomeIcon
      icon={faUser}
      className="doctorAvatar1 default-avatar"
    />
  )}

    <h3 className="comment-heading">Comments</h3>
   <textarea
  placeholder="Write a Comment..."
  className="comment-textarea"
  value={comment}
  onChange={(e) => setComment(e.target.value)}
/>

    <div className="comment-buttons">
      <button className="cancel-btn" onClick={handleClearComment}>Cancel</button>
      <button className="submit-btn" onClick={handleCommentSubmit}>Submit</button>
    </div>
  </div>
)}

        

          {/* Confirmation Modal */}
          {showConfirm && (
            <div className="confirm-overlay">
              <div className="confirm-box">
                <p>Are you sure you want to save this prescription?</p>
                <div className="confirm-buttons">
                  <button onClick={handleConfirmSave}>Yes, Save</button>
                  <button onClick={handleCancelSave}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        
  
{showUpcomingPopup && (
  <div className="popup-overlay">
    <div className="upcoming-popup" ref={popupRef}>
      <div className="popup-header-row">
       <div className="popup-doctor-name">
          <p>{patient?.doctor || "Dr. Robert"}</p>
        </div>
        <div className="popup-left">
          <div>
            {patient?.image ? (
          <img src={patient.image} className='popup-patient-img'
            alt="Patient" />
            ):( <FontAwesomeIcon icon={faUser} classname="popup-patient-img"/>
            )}
            </div>
          
          <div className="popup-patient-details">
            <h4>{patient?.name || "Arthur"}</h4>
            <p>{patient?.age || "30"} • {patient?.gender || "Male"}</p>
          </div>
        </div>
       
      </div>

      <div className="full-width-divider-wrapper">
        <hr className="break" /></div>


<div className="popup-appointments">
  {[0, 1, 2].map((_, index) => {
    const dateTime = appointmentDates[index];
    const isFocused = focusedIndex === index;
    const formattedValue = dateTime
      ? new Date(dateTime).toLocaleDateString("en-US", {
  month: "long",  // shows full month name
  day: "numeric",
  year: "numeric",
}) +
        " at " +
        new Date(dateTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
           hour12: true,
        })
      : "";

    return (
      <div
        className="datetime-wrapper"
        key={index}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <input
          type={isFocused ? "datetime-local" : "text"}
          className="popup-input"
          value={isFocused ? dateTime : formattedValue}
          onFocus={(e) => {
            setFocusedIndex(index); // Track focus
            setTimeout(() => {
              e.target.type = "datetime-local";
              e.target.showPicker?.();
            }, 0);
          }}
          onBlur={() => setFocusedIndex(null)} // Remove focus tracking
          placeholder="Enter appointment date"
          onChange={(e) => handleDateChange(index, e.target.value)}
          style={{ flex: 1 }}
        />

        <button
          className={`status-toggle-btn ${
            appointmentStatuses[index] === "Confirmed" ? "confirmed" : "not-yet"
          }`}
          onClick={() => {
            const updated = [...appointmentStatuses];
            updated[index] =
              updated[index] === "Confirmed" ? "Not Yet" : "Confirmed";
            setAppointmentStatuses(updated);
          }}
        >
          {appointmentStatuses[index]}
        </button>
      </div>
    );
  })}
</div>




    </div>
  </div>
)}
</div>
        </div>
      </div>
    </div>
  );
};

export default IntakePage;    