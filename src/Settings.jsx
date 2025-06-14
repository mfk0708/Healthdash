// pages/Settings.jsx
import React from "react";


export default function Settings() {
  return (
    <div className="settings-page">
      <h2 className="section-header">Settings</h2>

      <div className="content-box">
        <div className="settings-section">
          <h3>Account Settings</h3>
          <div className="setting-item">
            <label>Name</label>
            <input type="text" className="input" value="Dr. Sarah Johnson" readOnly />
          </div>
          <div className="setting-item">
            <label>Email</label>
            <input type="email" className="input" value="dr.sarah@example.com" readOnly />
          </div>
        </div>

        <div className="settings-section">
          <h3>Notification Preferences</h3>
          <div className="setting-item">
            <label>
              <input type="checkbox" checked /> Enable Email Notifications
            </label>
          </div>
</div>
      </div>
    </div>
  );
}
