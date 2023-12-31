import React, { useState } from "react";
import "./App.scss";
import Dashboard from "./components/Dashboard/Dashboard";
import UserList from "./components/UserList/UserList";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUsers,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <div className="App">
        <div className="top-bar">
          <h1>Front-end Developer Assignment</h1>
        </div>
        <div
          className={`wrapper ${isOpen ? "sidebar-open" : "sidebar-close"} `}
        >
          <aside className="sidebar">
            <button onClick={toggleSidebar} className="sidebar-toggle">
              {isOpen ? (
                <FontAwesomeIcon icon={faChevronLeft} />
              ) : (
                <FontAwesomeIcon icon={faChevronRight} />
              )}
            </button>
            <nav>
              <ul>
                <li>
                  <NavLink activeclassname="active" to="/">
                    <span>Dashboard</span> <FontAwesomeIcon icon={faHouse} />
                  </NavLink>
                </li>
                <li>
                  <NavLink activeclassname="active" to="/subscriber-list">
                    <span>Users</span> <FontAwesomeIcon icon={faUsers} />
                  </NavLink>
                </li>
              </ul>
            </nav>
          </aside>
          <main className="main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="subscriber-list" element={<UserList />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
