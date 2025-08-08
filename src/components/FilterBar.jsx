import React, { useState } from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import '../css/FilterBar.css';

export default function FilterBar({
  activeItem,
  setIsModalOpen,
  selectedStatus,
  setSelectedStatus,
  selectedPosition,
  setSelectedPosition,
  searchQuery,
  setSearchQuery,
}) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [positionOpen, setPositionOpen] = useState(false);

  const statuses = ['New', 'Scheduled', 'Ongoing', 'Selected', 'Rejected'];
  const positions = ['Developer', 'Designer', 'Manager', 'Tester'];

  const handleStatusSelect = (value) => {
    setSelectedStatus(value);
    setStatusOpen(false);
  };

  const handlePositionSelect = (value) => {
    setSelectedPosition(value);
    setPositionOpen(false);
  };

  const isCandidates = activeItem === 'Candidates';
  const isEmployees = activeItem === 'Employees';
  const isAttendance = activeItem === 'Attendance';
  const isLeaves = activeItem === 'Leaves';

  return (
    <div className="filter-bar">
      <div className="filter-left">
        {(isCandidates || isAttendance || isLeaves) && (
          <div className="custom-dropdown">
            <div
              className="custom-dropdown-toggle"
              onClick={() => {
                setStatusOpen(!statusOpen);
                setPositionOpen(false);
              }}
            >
              {selectedStatus}
              <FaChevronDown className="dropdown-icon" />
            </div>
            {statusOpen && (
              <ul className="custom-dropdown-menu">
                {statuses.map((status) => (
                  <li
                    key={status}
                    onClick={() => handleStatusSelect(status)}
                    className="dropdown-item"
                  >
                    {status}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {(isCandidates || isEmployees) && (
          <div className="custom-dropdown">
            <div
              className="custom-dropdown-toggle"
              onClick={() => {
                setPositionOpen(!positionOpen);
                setStatusOpen(false);
              }}
            >
              {selectedPosition}
              <FaChevronDown className="dropdown-icon" />
            </div>
            {positionOpen && (
              <ul className="custom-dropdown-menu">
                {positions.map((pos) => (
                  <li
                    key={pos}
                    onClick={() => handlePositionSelect(pos)}
                    className={`dropdown-item ${selectedPosition === pos ? 'selected' : ''}`}
                  >
                    {pos}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="filter-right">
        {(isCandidates || isEmployees || isAttendance || isLeaves) && (
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {isCandidates && (
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            Add Candidate
          </button>
        )}

        {isLeaves && (
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            Add Leave
          </button>
        )}
      </div>
    </div>
  );
}
