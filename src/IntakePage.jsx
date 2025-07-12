import React, { useState, useRef, useEffect } from 'react';
import './IntakePage.css';

import BetaVersion from './BetaVersion.jsx';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faFolderOpen,faBell,faAngleDown, faPhoneVolume, faXmark, faMessage} from "@fortawesome/free-solid-svg-icons";
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
const IntakePage = ({ onClose, patient }) => {
 
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', duration: '', frequency: '', notes: '' }
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
  const [doctorId] = useState('doc1');
const [doctorName, setDoctorName] = useState("");
const [doctorImage, setDoctorImage] = useState("");
const [selectedDoctorId, setSelectedDoctorId] = useState("doc1");
const [fullProfile, setFullProfile] = useState(null);
 const [comment, setComment] = useState('');
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
    // Fetch full profile data
    if (patient?.patient_id) {
      fetch(`https://senator-rich-moreover-hurricane.trycloudflare.com/profile/${patient.patient_id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setFullProfile(data[0]);
          }
        })
        .catch(err => console.error("Error fetching profile:", err));
    }
  }, [patient?.patient_id]);
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

 
const handleCommentSubmit = async () => {
  if (!comment.trim()) {
    alert("Comment cannot be empty.");
    return;
  }

  try {
    const response = await fetch(`https://senator-rich-moreover-hurricane.trycloudflare.com/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: patient?.patient_id || null,
        symptoms: "",
        doctor_comment:comment,
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
  const patientId = patient?.patient_id || null;

  const validMedicines = medicines.filter(
    (med) => med.name && med.dosage && med.frequency && med.duration
  );

  if (validMedicines.length === 0) {
    alert("Please fill in at least one valid medicine.");
    return;
  }

  try {
    // Send one medicine at a time
    for (const med of validMedicines) {
      const singlePrescription = {
        patient_id: patientId,
        medicine: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        notes: med.notes,
      };

      const response = await fetch(
        `https://senator-rich-moreover-hurricane.trycloudflare.com/prescription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(singlePrescription),
        }
      );

      const resultText = await response.text();

      if (!response.ok) {
        console.error("Failed for:", singlePrescription);
        alert("Error saving prescription:\n" + resultText);
        return; // Stop on first error
      }
    }

    alert("All prescriptions saved successfully!");
  } catch (error) {
    console.error("Network error:", error);
    alert("Error saving prescription.");
  }
};


const handlePathologySave = async () => {
  const patientId = patient?.patient_id || null;

  const validTests = selectedTests.filter((test) => testResults[test]?.trim());

  if (validTests.length === 0) {
    alert("Please enter at least one valid test result.");
    return;
  }

  try {
    for (const testName of validTests) {
      const result = testResults[testName];
      const file = uploadedFiles[testName]; // 👈 get the uploaded file

      const formData = new FormData();
      formData.append("pat_id", patientId);
      formData.append("test_name", testName);
      formData.append("result", result);
      if (file) {
        formData.append("file", file); // 👈 attach file
      }

      const response = await fetch(`https://senator-rich-moreover-hurricane.trycloudflare.com/pathology/`, {
        method: "POST",
        body: formData, // 👈 no need for headers here
      });

      const resultText = await response.text();

      if (!response.ok) {
        console.error("Failed to save:", testName);
        alert("Failed to save pathology:\n" + resultText);
        return;
      }
    }

    alert("All pathology data saved successfully!");
  } catch (error) {
    console.error("Network error:", error);
    alert("Error saving pathology data.");
  }
};
  useEffect(() => {
    if (!doctorId) return;

    fetch(`https://senator-rich-moreover-hurricane.trycloudflare.com/doctor`)
      .then((res) => res.json())
      .then((doctors) => {
        if (!Array.isArray(doctors)) return;

        const selectedDoctor = doctors.find((doc) => doc.doctor_id === doctorId);
        if (!selectedDoctor) return;

        setDoctorName(selectedDoctor.name || '');
        setDoctorImage(`https://drive.google.com/uc?export=view&id=${selectedDoctor.image_file_id}`);
      })
      .catch((err) => console.error("Failed to fetch doctor data:", err));
  }, [doctorId]);




  return (
    
<div className="intake-page-wrapper">

  <div className='top'>
    <h2 className='intake-title'>Intake Form</h2>
   
  <div className="notification-bell">
                    <FontAwesomeIcon icon={faBell} style={{ color: "#2563EB", fontSize: "30px" }} />
                  </div> <div className="profile-box">
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

 
 <div className="top-cards1">
        {/* Left Card: basic info */}
        <div className="left-card1">
          {fullProfile ? (
            <>
              <div className="patient-container1">
                {fullProfile.profile_picture ? (
                  <img src={`./images/${fullProfile.profile_picture}`} alt="Patient" className="patient-img1" />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="patient-img1" style={{ color: "grey" }} />
                )}
              </div>
              <div className="patient-details1">
                <p className="value-name">{fullProfile.name}</p>
                <p className="value-email">{fullProfile.email}</p>
                <div className="icon-row">
                  <a href={fullProfile.phone ? `tel:${fullProfile.phone}` : "#"} style={{ pointerEvents: fullProfile.phone ? 'auto' : 'none', opacity: fullProfile.phone ? 1 : 0.3 }}>
                    <FontAwesomeIcon icon={faPhoneVolume} className="phone-icon" />
                  </a>
                  <a href={fullProfile.phone ? `https://wa.me/${fullProfile.phone.replace(/\D/g, '').padStart(10, '91')}` : "#"} target="_blank" rel="noopener noreferrer" style={{ pointerEvents: fullProfile.phone ? 'auto' : 'none', opacity: fullProfile.phone ? 1 : 0.3 }}>
                    <FontAwesomeIcon icon={faMessage} className="message-icon" />
                  </a>
                </div>
              </div>
            </>
          ) : <div>Loading patient...</div>}
        </div>

        {/* Right Card: detailed info */}
        <div className="right-card1">
          <div className="right-content-row1">
            {fullProfile ? (
              <>
                <div className="right1">
                  <p>Date of Birth:<br /><span className="value1">{fullProfile.dob}</span></p>
                  <p>Marital Status:<br /><span className="value1">{fullProfile.marital_status || fullProfile.martial}</span></p>
                  <p>Phone:<br /><span className="value1">{fullProfile.phone}</span></p>
                  <p>Address:<br /><span className="value1">{fullProfile.address}, {fullProfile.city}</span></p>
                  <p>Registered Date:<br /><span className="value1">{fullProfile.registration_date || fullProfile.registered}</span></p>
                </div>
                <div className="insurance-card1">
                  <div className="house-pentagon1"><span>H</span></div>
                  <p className="assurance-heading1">Assurance number</p>
                  <h3>{fullProfile.assurance_number || fullProfile.assuranceNumber}</h3>
                  <p className='expiry1'>EXPIRY DATE</p>
                  <p>{fullProfile.expiry_date || fullProfile.expiryDate}</p>
                </div>
              </>
            ) : (
              <div>Loading profile details...</div>
            )}
          </div>
        </div>
      </div>

         
  

 


  <div className="intake-content-scrollable" ref={intakeRef}>
  <div className="intake-inner-content">
    {/* Put everything else inside here - tabs, intake info, etc */}
 <BetaVersion   patient={patient}/>


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
    {uploadedFiles[selectedTest]?.name} uploaded successfully!
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
        <div style={{  position: "relative", display: "flex", alignItems: "center" }}>
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
    try {
      console.log("File change triggered");
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        console.log("Selected file:", file);

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
    } catch (error) {
      console.error("Error in file upload onChange:", error);
      alert("Something went wrong in file selection!");
    }
  }}
/>

          {/* Upload Icon */}
          <label
            htmlFor={`file-upload-${index}`}
            style={{
              position: "relative",
              right: "25px",
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
 <button
  type="button"  // ✅ Required to prevent reload
  className="pathology-btn"
  onClick={handlePathologySave}
>
  Save Pathology
</button>

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