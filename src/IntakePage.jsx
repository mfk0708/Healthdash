import React, { useState, useRef, useEffect } from 'react';
import './IntakePage.css';

import BetaVersion from './BetaVersion.jsx';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faFolderOpen,faBell,faAngleDown, faPhoneVolume, faXmark, faMessage} from "@fortawesome/free-solid-svg-icons";

const IntakePage = ({ onClose, patient }) => {
 
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
const [doctor, setDoctor] = useState({ name: '', image: '' });
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


  useEffect(() => {
    fetch('/chartData.json')
      .then((res) => res.json())
      .then((data) => {
        if (data?.doctor) {
          setDoctor(data.doctor);
        }
      })
      .catch((error) => {
        console.error('Error fetching doctor data:', error);
      });
  }, []);

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
const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, ''); // Remove all non-digits
  if (!cleaned.startsWith('91')) {
    return '91' + cleaned; // Add country code if missing
  }
  return cleaned;
};
 
const handlePrescriptionSave = async () => {
  try {
    const response = await fetch("https://your-server.com/api/prescription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId: patient?.id || null,
        medicines: medicines,
      }),
    });

    if (response.ok) {
      alert("Prescription saved successfully!");
    } else {
      alert("Failed to save prescription.");
    }
  } catch (error) {
    alert("Error saving prescription.");
  }
};
const handlePathologySave = async () => {
  try {
    const formData = new FormData();

    formData.append("patientId", patient?.id || null);
    formData.append("testResults", JSON.stringify(testResults));

    Object.entries(uploadedFiles).forEach(([testName, file]) => {
      formData.append(testName, file); // ensure `file` is a File object
    });

    const response = await fetch("https://your-server.com/api/pathology", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Pathology data saved successfully!");
    } else {
      alert("Failed to save pathology.");
    }
  } catch (error) {
    alert("Error saving pathology data.");
  }
};



  return (
    
<div className="intake-page-wrapper">

  <div className='top'>
    <h2 className='intake-title'>Intake Form</h2>
   
  <div className="notification-bell">
                    <FontAwesomeIcon icon={faBell} style={{ color: "#2563EB", fontSize: "30px" }} />
                  </div> <div className="profile-box">
      <img
        src={doctor.image}
        className="drprofile-avatar"
        alt="Profile"
      />
      <div className="profile-info">
        <div className="profile-name">{doctor.name}</div>
        <FontAwesomeIcon icon={faAngleDown} className="vectorlogo" />
      </div>
    </div></div>
                   
                               <div className="top-cards1">
        {/* Left Card */}
        <div className="left-card1">
         <div class="patient-container1">
        <img src={patient.image} alt="Patient" className="patient-img1" />
           
            </div>
           
          <div className="patient-details1">
         <div>
             <p> <span className="value-name">{patient.name}</span></p>
<p><span className="value-email">{patient.email} </span></p>
<div className="icon-row">
  <a href={`tel:${patient.phone}`}>
    <FontAwesomeIcon icon={faPhoneVolume} className="phone-icon" />
  </a>
  <a
    href={`https://wa.me/${formatPhone(patient.phone)}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <FontAwesomeIcon icon={faMessage} className="message-icon" />
  </a>
</div>

 </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="right-card1">
          <div className="right-content-row1">
       <div className='right1'>
        <p>Date of birth:<br /><span className="value1">{patient.birth}</span></p>
              <p>Martial Status:<br /><span className="value">{patient.martial}</span></p>
          <p>Phone:<br /><span className="value1">{patient.phone}</span></p>

      <p>Address:<br /><span className="value1">{patient.address}, {patient.city}</span></p>
    <p>Registered Date<br /><span className="value1">{patient.registered}</span></p>
</div>
          <div className="insurance-card1">
           <div className="house-pentagon1"><span>H</span></div>
            <p className="assurance-heading1"> Assurance number</p>
            <h3>{patient.assuranceNumber}</h3>
            <p className='expiry1'>EXPIRY DATE</p>
            <p>{patient.expiryDate}</p>
      
        </div></div>
      </div></div>


  <div className="intake-content-scrollable" ref={intakeRef}>
  <div className="intake-inner-content">
    {/* Put everything else inside here - tabs, intake info, etc */}
 <BetaVersion />


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
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button className="add-btn no-print" onClick={handleAddMedicine}>+ Add</button>
                 <button className="save1-btn" onClick={handlePrescriptionSave}>Save Prescription</button>
</div>
                </div>
              </div>

            {/* Pathology Section */}
 <h4 className="pathology-heading">Pathology</h4>
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
   
const file = e.target.files[0];
setUploadedFiles((prev) => ({
  ...prev,
  [selectedTest]: file, // ✅ Save actual File object
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
        position: "relative",
        right: "25px",
        cursor: "pointer",
        transform: "translateY(-50%)",
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
   {uploadedFiles[test]?.name} uploaded successfully!

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
                const file = e.target.files[0];
setUploadedFiles((prev) => ({
  ...prev,
  [test]: file, 
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
           {uploadedFiles[test]?.name} uploaded successfully!

          </p>
        )}
      </div>
     

    </div>
  ))}
  <div className="pathology-btn-wrapper">
 <button className="pathology-btn" onClick={handlePathologySave}>Save Pathology</button>
  </div></div>
</div>
 <h3 className="comment-heading"> Doctor's Comments</h3>
 <div className="comment-textarea-container">
   <textarea
  placeholder="Write a Comment..."
  className="comment-textarea"
  value={comment}
  onChange={(e) => setComment(e.target.value)}
/></div>

    <div className="comment-buttons">
      <button className="cancel-btn" onClick={handleClearComment}>Cancel</button>
      <button className="submit-btn1" onClick={handleCommentSubmit}>Submit</button>
    </div>
       {/* Follow-up Section */}
         

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
        
  

</div></div>
        </div>
      
  );
};

export default IntakePage;    