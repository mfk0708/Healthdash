import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faUserDoctor,
  faCalendarCheck,
  faUsers,
  faFileInvoice,
  faBuilding,
  faGear,
  faBars,
  faCircleQuestion,
  faFileLines,
  
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        {/* Top Section */}
        <div className="top-section1">
        <div className="top1">
         <FontAwesomeIcon icon={faBars} className="bar-icon" />
          <h1 className="logo">HMS</h1></div>
          <nav className="nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-active" : "nav-link"}>
              <FontAwesomeIcon icon={faGaugeHigh} className="text-xl" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/staff" className={({ isActive }) => isActive ? "nav-active" : "nav-link"}>
              <FontAwesomeIcon icon={faUsers} className="text-xl" />
              <span>Staff</span>
            </NavLink>
            <NavLink to="/appointments" className={({ isActive }) => isActive ? "nav-active" : "nav-link"}>
              <FontAwesomeIcon icon={faFileLines} className="text-xl" />
              <span>Appointments</span>
            </NavLink>
            <NavLink to="/patients" className={({ isActive }) => isActive ? "nav-active" : "nav-link"}>
              <FontAwesomeIcon icon={faUserDoctor} className="text-xl" />
              <span>Patients</span>
            </NavLink>
            <NavLink to="/invoice" className={({ isActive }) => isActive ? "nav-active" : "nav-link"}>
              <FontAwesomeIcon icon={faFileInvoice} className="text-xl" />
              <span>Invoice</span>
            </NavLink>
            <NavLink to="/pathology" className={({ isActive }) => isActive ? "nav-active" : "nav-link"}>
              <FontAwesomeIcon icon={faBuilding} className="text-xl" />
              <span>Pathology</span>
            </NavLink>
            <NavLink to="/pharmacy" className={({ isActive }) => isActive ? "nav-active" : "nav-link"}>
              <FontAwesomeIcon icon={faCalendarCheck} className="text-xl" />
              <span>Pharmacy</span>
            </NavLink>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-active" : "nav-link"}>
            <FontAwesomeIcon icon={faGear} className="text-xl" />
            <span>Settings</span>
          </NavLink>
          <NavLink to="/help" className={({ isActive }) => isActive ? "nav-active" : "nav-link"}>
            <FontAwesomeIcon icon={faCircleQuestion} className="text-xl" />
            <span>Help & Feedback</span>
          </NavLink>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
