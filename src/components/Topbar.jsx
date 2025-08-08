import '../css/Topbar.css';
import { FaEnvelope, FaBell, FaChevronDown } from 'react-icons/fa';

export default function Topbar() {
  return (
    <div className="topbar">
      <h2 className="page-title">Candidates</h2>
      <div className="topbar-actions">
        <FaEnvelope className="icon" />
        <FaBell className="icon" />
        <div className="profile">
          <img
            src="https://i.pravatar.cc/36"
            alt="Profile"
            className="avatar"
          />
          <FaChevronDown className="dropdown-icon" />
        </div>
      </div>
    </div>
  );
}
