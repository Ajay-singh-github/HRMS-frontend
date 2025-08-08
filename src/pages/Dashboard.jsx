import { useState } from 'react';
import "../css/Dashboard.css";
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import FilterBar from '../components/FilterBar';
import CandidatesTable from '../components/Table';
import LeaveCalendar from '../components/LeaveCalendar';
import AddCandidateModal from '../components/DialogBox';
import Signout from '../components/SignOut';
import { apiClient } from '../utils/FetchNodeService';
import { useNavigate } from 'react-router-dom';
export default function CandidatesPage() {
  var navigate = useNavigate()
  const [activeItem, setActiveItem] = useState('Candidates');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Status');
  const [selectedPosition, setSelectedPosition] = useState('Position');
  console.log(searchQuery)
  console.log(selectedStatus)
  console.log(selectedPosition)
  const handleLogout = async () => {
    try {
      const res = await apiClient('GET', '/admin/admin/logout');
      if (res.ok) {
        navigate('/');
      }
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="dashboard-main">
        <Topbar />
        <div className="dashboard-content">
          <FilterBar activeItem={activeItem} setIsModalOpen={setIsModalOpen} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} selectedPosition={selectedPosition} setSelectedPosition={setSelectedPosition} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {activeItem === 'Leaves' ? (
            <div className="leaves-container">
              <CandidatesTable activeItem={activeItem} isModalOpen={isModalOpen} setSelectedEmployeeData={setSelectedEmployeeData} />
              <LeaveCalendar />
            </div>
          ) : (
            <CandidatesTable
              activeItem={activeItem} isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen} setSelectedEmployeeData={setSelectedEmployeeData}
              selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
              selectedPosition={selectedPosition} setSelectedPosition={setSelectedPosition}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            />
          )}
          {isModalOpen && <AddCandidateModal setIsModalOpen={setIsModalOpen} selectedEmployeeData={selectedEmployeeData} activeItem={activeItem} />}
          {activeItem == "Logout" && (
            <Signout
              onConfirm={handleLogout}
              onCancel={() => setShowLogoutModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
