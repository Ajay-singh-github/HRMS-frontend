import React, { useState } from 'react';
import {
  FaUsers,
  FaChartBar,
  FaCalendarAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

import '../css/Sidebar.css';

export default function Sidebar({activeItem, setActiveItem}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    setIsOpen(false);
  };

  const navItems = [
    {
      section: 'Recruitment',
      items: [{ label: 'Candidates', icon: <FaUserPlus /> }],
    },
    {
      section: 'Organization',
      items: [
        { label: 'Employees', icon: <FaUsers /> },
        { label: 'Attendance', icon: <FaChartBar /> },
        { label: 'Leaves', icon: <FaCalendarAlt /> },
      ],
    },
    {
      section: 'Others',
      items: [{ label: 'Logout', icon: <FaSignOutAlt /> }],
    },
  ];

  return (
    <>
      <div className="hamburger" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon" />
          <span className="logo-text">LOGO</span>
        </div>

        <div className="sidebar-search">
          <input type="text" placeholder="Search" />
        </div>

        {navItems.map((section, i) => (
          <div className="sidebar-section" key={i}>
            <p className="section-heading">{section.section}</p>
            {section.items.map(({ label, icon }) => (
              <div
                key={label}
                className={`sidebar-item ${
                  activeItem === label ? 'active' : ''
                }`}
                onClick={() => handleItemClick(label)}
              >
                {activeItem === label && <div className="active-bar" />}
                <div className="icon">{icon}</div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        ))}
      </aside>

      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
}
