import React, { useState } from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import '../css/FilterBar.css';

export default function FilterBar({ activeItem, setIsModalOpen }) {
    const [statusOpen, setStatusOpen] = useState(false);
    const [positionOpen, setPositionOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [selectedPosition, setSelectedPosition] = useState('Position');

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

    return (
        <div className="filter-bar">
            <div className="filter-left">
                {/* Status Dropdown */}
                <div className="custom-dropdown">
                    <div
                        className="custom-dropdown-toggle"
                        onClick={() => {
                            setStatusOpen(!statusOpen);
                            setPositionOpen(false); // close other
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

                {/* Position Dropdown */}
                {activeItem === 'Candidates' && (
                    <div className="custom-dropdown">
                        <div
                            className="custom-dropdown-toggle"
                            onClick={() => {
                                setPositionOpen(!positionOpen);
                                setStatusOpen(false); // close the other dropdown
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
            {activeItem === 'Candidates' && (
                <div className="filter-right">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Search" />
                    </div>
                    <button className="add-btn" onClick={()=>setIsModalOpen(true)}>Add Candidate</button>
                </div>
            )}

        </div>
    );
}
