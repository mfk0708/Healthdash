import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faGear } from "@fortawesome/free-solid-svg-icons";
import { CalendarDays, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink, Outlet } from "react-router-dom";
import "./Sidebar.css";
export default function Sidebar() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div>
          <h1 className="logo">DocConnect</h1>
          <nav className="nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-active" : "nav-link"
              }
            >
              <FontAwesomeIcon icon={faHouse} className="text-xl" />
              <span> Dashboard</span>
            </NavLink>
            <NavLink
              to="/patients"
              className={({ isActive }) =>
                isActive ? "nav-active" : "nav-link"
              }
            >
              <CalendarDays className="icon" />
              <span> Patients</span>
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? "nav-active" : "nav-link"
              }
            >
              <FontAwesomeIcon icon={faGear} className="text-xl" />
              <span> Settings</span>
            </NavLink>
          </nav>
        </div>
        <Button className="logout-btn">
          <LogOut className="icon" />
          <span>Logout</span>
        </Button>
      </aside>

      {/* Outlet for routed pages */}
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}