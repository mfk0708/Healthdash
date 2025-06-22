import React, { useState, useEffect } from 'react';
import './BetaVersion.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faStar } from "@fortawesome/free-solid-svg-icons";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const BetaVersion = ({ onCancel, onSubmit, patient }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [finalTranscript, setFinalTranscript] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setFinalTranscript((prev) => (prev + ' ' + transcript).trim());
    }
  }, [transcript]);

  const toggleRecording = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, interimResults: true });
    }
  };

  const handleSubmit = () => {
    if (!finalTranscript.trim()) {
      alert('Please record a message first.');
      return;
    }
    onSubmit?.({ transcript: finalTranscript, rating: selectedRating });
    SpeechRecognition.stopListening();
    setFinalTranscript('');
    setSelectedRating(0);
  };

  const handleCancel = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
    setFinalTranscript('');
    setSelectedRating(0);
    onCancel?.();
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support voice recognition.</p>;
  }

  return (
    <div className="beta-version-container">
      <div className="doctor-header">
        <img
          src={patient?.doctorImage || '/images/doctor-avatar.png'}
          alt={patient?.doctor || 'Doctor Avatar'}
          className="doctor-avatar"
        />
        <span className="doctor-name">{patient?.doctor || 'Unknown Doctor'}</span>
      </div>

      <div className="voice-card">
       <div className="mic-box" onClick={toggleRecording}>
  <div classname="micbox2">
  <FontAwesomeIcon icon={faMicrophone} className="mic-icon" />
  </div>
<textarea
  className="mic-textarea"
  value={finalTranscript}
  placeholder="Convert into text..."
  rows={1}
  onChange={(e) => setFinalTranscript(e.target.value)}
/>


        </div>

        {listening && (
          <div className="recording-text-wrapper">
            <span className="recording-text">Recording...</span>
            <FontAwesomeIcon icon={faMicrophone} className="speakericon" />
          </div>
        )}
      </div>

      <div className="btn-row">
        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>
<div className="rating-container">
  <p>How was your last consultation?</p>
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${star <= selectedRating ? 'filled' : ''}`}
        onClick={() =>
          setSelectedRating((prev) => (prev === star ? 0 : star))
        }
      >
        <FontAwesomeIcon icon={faStar} className="star-icon" />
      </span>
    ))}
  </div>
</div>

     
    </div>
  );
};

export default BetaVersion;
