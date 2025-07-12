import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import './BetaVersion.css';

const BetaVersion = ({ patient }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [recordedText, setRecordedText] = useState('');

  const recognitionRef = useRef(null); // store SpeechRecognition instance

  const handleToggleRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (!isRecording) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log("Recording started...");
        setRecordedText(''); // Clear previous
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log("Transcript:", transcript);
        setRecordedText(prev => prev + ' ' + transcript);
      };

      recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
      };

      recognition.onend = () => {
        if (isRecording) {
          console.log("Restarting recognition...");
          recognition.start(); // Auto restart if still recording
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      recognitionRef.current?.stop();
      setIsRecording(false);
      console.log("Recording stopped.");
    }
  };

  const handleVoiceToText = () => {
    setTranscribedText(recordedText.trim());
  };
const handleSaveToServer = async () => {
  if (!transcribedText.trim()) {
    alert("No symptoms to save!");
    return;
  }

  console.log("Sending patient_id:", patient?.patient_id);
  console.log("Sending symptoms:", transcribedText);

  try {
    const response = await fetch(`https://senator-rich-moreover-hurricane.trycloudflare.com/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patient_id: patient?.patient_id || "",   
        doctor_comment: "",                      
        symptoms: transcribedText.trim()
      })
    });

    const text = await response.text();
    console.log("Raw server response:", text);

    if (response.ok) {
      alert("Symptoms saved successfully.");
    } else {
      alert("Server error: " + text);
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Fetch error. Check console.");
  }
};
 

  return (
    <div className="beta-container">
      <h2 className="beta-heading">Beta Version</h2>

      <div className="beta-cards-wrapper">
        {/* LEFT SIDE */}
        <div className="left-column">
          {/* SYMPTOMS RECORDING CARD */}
          <div className="beta-card left-card2">
            <h3 className="card-subheading">SYMPTOMS RECORDING</h3>
            <div className='border-top'>
              <div className="recording-box">
                <div className="icon-with-label">
                  <FontAwesomeIcon icon={faFile} className="file-icon1" />
                  <p className="upload-text">
                    {isFileUploaded ? "File uploaded successfully!" : "Upload file"}
                  </p>
                </div>
              </div>

              <div className="button-right-group">
                <button className="canc-btn" onClick={() => {
                  setIsFileUploaded(false);
                  setRecordedText('');
                  setTranscribedText('');
                }}>Cancel</button>

                <button className="analyse-btn" onClick={handleVoiceToText}>
                  Analyse
                </button>
              </div>
            </div>
          </div>

          {/* ANALYZED SYMPTOMS CARD */}
          <div className="beta-card analysed">
            <h3 className="card-subheading">ANALYZED SYMPTOMS</h3>
           
{transcribedText ? (
    <p className="transcribed-text">{transcribedText}</p>
  ) : (
    <p className="transcribed-text" style={{ color: '#6b7280' }}>
      No symptoms analyzed yet.
    </p>
  )}
            

            <div className="btn-right">
             <button className="blue-btn" onClick={handleSaveToServer}>Save</button>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="record-card">
          <h3 className="card-subheading1">RECORD SYMPTOMS</h3>

          <div className="chart-box">
            <div className="blurred-circle">
              <div className={`pie-parts ${isRecording ? 'spinning' : ''}`}></div>
            </div>
          </div>

          <div className="button-group">
            <button className="blue-btn" onClick={handleToggleRecording}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>

            <button
              className="blue-btn"
              onClick={() => setIsFileUploaded(true)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetaVersion;
