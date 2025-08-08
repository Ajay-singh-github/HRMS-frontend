import React, { useState, useRef, useEffect } from 'react';
import '../css/CandidatesTable.css';
import { apiClient } from '../utils/FetchNodeService';
import { toast } from 'react-toastify';
import { Icon } from 'lucide-react';
import { FaUser } from 'react-icons/fa';

export default function CandidatesTable({ activeItem, isModalOpen, setIsModalOpen, setSelectedEmployeeData }) {
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const menuRef = useRef(null);

    const handleMenuToggle = (index) => {
        setOpenMenuIndex(prev => (prev === index ? null : index));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuIndex(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSelectedCandidates = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient('GET', '/candidate/status/Selected');
            if (res.status === 200 && Array.isArray(res.candidates)) {
                setSelectedCandidates(res.candidates);
            } else {
                console.error('Failed to fetch selected candidates');
            }
        } catch (error) {
            console.error('Error fetching selected candidates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeItem === 'Candidates') {
            fetchCandidates();
        } else if (activeItem === 'Employees') {
            fetchSelectedCandidates();
        } else if (activeItem === 'Attendance') {
            fetchSelectedCandidates();
        }
    }, [activeItem, isModalOpen]);

    const fetchCandidates = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient('GET', '/candidate');
            if (res.status === 200 && Array.isArray(res.candidates)) {
                setCandidates(res.candidates);
            } else {
                console.error('Failed to fetch candidates');
            }
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const staticData = [
        {
            name: 'Jacob William',
            email: 'jacob.william@example.com',
            phone: '(252) 555-0111',
            position: 'Senior Developer',
            status: 'New',
            experience: '1+',
            department: 'Engineering',
            doj: '2024-01-15',
            profile: '👤',
            task: 'Onboarding',
            attendanceStatus: 'Present',
            leaveDate: '2025-08-05',
            leaveReason: 'Medical Leave',
            leaveStatus: 'Pending',
            docs: '📄',
        },
        {
            name: 'Guy Hawkins',
            email: 'kenzi.lawson@example.com',
            phone: '(907) 555-0101',
            position: 'HR Intern',
            status: 'Selected',
            experience: '0',
            department: 'HR',
            doj: '2024-03-10',
            profile: '👤',
            task: 'Documentation',
            attendanceStatus: 'Absent',
            leaveDate: '2025-08-03',
            leaveReason: 'Personal Work',
            leaveStatus: 'Approved',
            docs: '📄',
        },
    ];

    const handleCandidateDelete = async (id) => {
        try {
            const res = await apiClient('DELETE', `/candidate/${id}`);
            if (res.status === 200) {
                setCandidates(prev => prev.filter(candidate => candidate._id !== id));
                if (activeItem === 'Employees') {
                    toast.success('Employee deleted successfully');
                    fetchSelectedCandidates()
                } else {
                    toast.success('Candidate deleted successfully');
                }
            } else {
                toast.error('Failed to delete candidate');
            }
        } catch (err) {
            toast.error('Error deleting candidate');
        }
    };

    const handleDownloadResume = (url, filename = 'Resume.pdf') => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEmployeEdit = (c) => {
        setSelectedEmployeeData(c)
        console.log("Edit employee:", c);
        setIsModalOpen(true);
        alert("Edit employee functionality is not implemented yet.");

    }

    const renderPopupMenu = (c, _id) => {
        if (activeItem === 'Candidates') {
            return (
                <>
                    <div
                        className="popup-item"
                        onClick={() => handleDownloadResume(c.resume, `${c.name?.replace(/\s+/g, '_')}_Resume.pdf`)}
                    >
                        Download Resume
                    </div>
                    <div className="popup-item" onClick={() => handleCandidateDelete(_id)}>Delete Candidate</div>
                </>
            );
        }
        if (activeItem === 'Employees') {
            return (
                <>
                    <div className="popup-item" onClick={() => handleEmployeEdit(c)}>Edit</div>
                    <div className="popup-item" onClick={() => handleCandidateDelete(c._id)}>Delete</div>
                </>
            );
        }
        return null;
    };

    const handleChangeCandidateStatus = async (id, newStatus, isAttendance = false, value = "") => {
        try {
            const updateData = isAttendance
                ? { attendanceStatus: value }
                : { status: newStatus };

            const res = await apiClient('PUT', `/candidate/${id}`, updateData);

            if (res.status === 200) {
                if (isAttendance) {
                    setSelectedCandidates(prev =>
                        prev.map(c => c._id === id ? { ...c, attendanceStatus: value } : c)
                    );
                    toast.success('Attendance status updated');
                } else {
                    setCandidates(prev =>
                        prev.map(c => c._id === id ? { ...c, status: newStatus } : c)
                    );
                    toast.success('Candidate status updated');
                }
            } else {
                toast.error('Failed to update status');
            }
        } catch (err) {
            toast.error('Error updating status');
        }
    };


    const dataToRender = (() => {
        if (activeItem === 'Candidates') return candidates;
        if (activeItem === 'Employees' || activeItem === 'Attendance') return selectedCandidates;
        return staticData;
    })();

    return (
        <div className="table-container">
            {activeItem === 'Candidates' && isLoading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <table className="candidates-table">
                    <thead>
                        <tr>
                            {activeItem === 'Employees' && (
                                <>
                                    <th>Profile</th>
                                    <th>Employee Name</th>
                                    <th>Email Address</th>
                                    <th>Phone Number</th>
                                    <th>Position</th>
                                    <th>Department</th>
                                    <th>Date of Joining</th>
                                    <th>Action</th>
                                </>
                            )}
                            {activeItem === 'Candidates' && (
                                <>
                                    <th>Sr no.</th>
                                    <th>Candidates Name</th>
                                    <th>Email Address</th>
                                    <th>Phone Number</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                    <th>Experience</th>
                                    <th>Action</th>
                                </>
                            )}
                            {activeItem === 'Attendance' && (
                                <>
                                    <th>Profile</th>
                                    <th>Employee Name</th>
                                    <th>Position</th>
                                    <th>Department</th>
                                    <th>Task</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </>
                            )}
                            {activeItem === 'Leaves' && (
                                <>
                                    <th>Profile</th>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Docs</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {dataToRender.length === 0 ? (
                            <tr>
                                <td colSpan="100%" className="no-data">No data found.</td>
                            </tr>
                        ) : (
                            dataToRender.map((c, i) => (
                                <tr key={i}>
                                    {activeItem === 'Employees' && (
                                        <>
                                            <td><FaUser size={15} /></td>
                                            <td>{c.fullName}</td>
                                            <td>{c.email}</td>
                                            <td>{c.phone}</td>
                                            <td>{c.position}</td>
                                            <td>{c.department || 'Designer'}</td>
                                            <td>{new Date(c.createdAt).toISOString().slice(0, 10)}</td>
                                            <td className="action-cell">
                                                <button className="action-btn" onClick={() => handleMenuToggle(i)}>⋮</button>
                                                {openMenuIndex === i && (
                                                    <div className="popup-menu" ref={menuRef}>
                                                        {renderPopupMenu(c, c._id)}
                                                    </div>
                                                )}
                                            </td>
                                        </>
                                    )}
                                    {activeItem === 'Candidates' && (
                                        <>
                                            <td>{String(i + 1).padStart(2, '0')}</td>
                                            <td>{c.fullName || c.name}</td>
                                            <td>{c.email}</td>
                                            <td>{c.phone}</td>
                                            <td>{c.position}</td>
                                            <td>
                                                <select
                                                    defaultValue={c.status || 'New'}
                                                    className={`status-select ${c.status?.toLowerCase() || 'new'}`}
                                                    onChange={(e) => handleChangeCandidateStatus(c._id, e.target.value)}
                                                >
                                                    <option value="New">New</option>
                                                    <option value="Selected">Selected</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td>{c.experience}</td>
                                            <td className="action-cell">
                                                <button className="action-btn" onClick={() => handleMenuToggle(i)}>⋮</button>
                                                {openMenuIndex === i && (
                                                    <div className="popup-menu" ref={menuRef}>
                                                        {renderPopupMenu(c.resume, c._id)}
                                                    </div>
                                                )}
                                            </td>
                                        </>
                                    )}
                                    {activeItem === 'Attendance' && (
                                        <>
                                            <td><FaUser size={15} /></td>
                                            <td>{c.fullName}</td>
                                            <td>{c.position}</td>
                                            <td>{c.department || 'Designer'}</td>
                                            <td>{c?.task || 'Dashboard Home Page Alignment'}</td>
                                            <td>
                                                <select defaultValue={c.attendanceStatus} className={`status-select ${c.attendanceStatus?.toLowerCase().replace(" ", "-")}`} onChange={(e) => handleChangeCandidateStatus(c._id, "", "true", e.target.value)}>
                                                    <option value="Present">Present</option>
                                                    <option value="Absent">Absent</option>
                                                    <option value="Half Day">Half Day</option>
                                                </select>
                                            </td>
                                            <td className="action-cell">
                                                <button className="action-btn" onClick={() => handleMenuToggle(i)}>⋮</button>
                                                {openMenuIndex === i && (
                                                    <div className="popup-menu" ref={menuRef}>
                                                        <div className="popup-item">Mark Leave</div>
                                                        <div className="popup-item">Contact</div>
                                                    </div>
                                                )}
                                            </td>
                                        </>
                                    )}
                                    {activeItem === 'Leaves' && (
                                        <>
                                            <td>{c.profile}</td>
                                            <td>{c.name}</td>
                                            <td>{c.leaveDate}</td>
                                            <td>{c.leaveReason}</td>
                                            <td>
                                                <select defaultValue={c.leaveStatus} className={`status-select ${c.leaveStatus?.toLowerCase()}`}>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button className="doc-btn">{c.docs}</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
