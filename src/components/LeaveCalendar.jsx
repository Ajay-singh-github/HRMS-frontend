import React, { useState } from 'react';
import dayjs from 'dayjs';
import '../css/LeaveCalendar.css';
import leftArrow from '../assets/left.png'; 
import rightArrow from '../assets/right.png';

const LeaveCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);

  const approvedLeaves = ['2024-09-08', '2024-09-15'];

  const startDay = currentMonth.startOf('month').day();
  const daysInMonth = currentMonth.daysInMonth();
  const year = currentMonth.year();
  const month = currentMonth.month();

  const generateCalendarDays = () => {
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = dayjs(new Date(year, month, i));
      const dateStr = dateObj.format('YYYY-MM-DD');
      const isApproved = approvedLeaves.includes(dateStr);
      const isSelected = selectedDate === dateStr;

      days.push(
        <div
          key={i}
          className={`calendar-day ${isApproved ? 'approved' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(dateStr)}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  const handleDateClick = (dateStr) => {
    setSelectedDate(prev => prev === dateStr ? null : dateStr);
  };

  const handleMonthChange = (direction) => {
    setCurrentMonth(prev =>
      direction === 'prev' ? prev.subtract(1, 'month') : prev.add(1, 'month')
    );
    setSelectedDate(null);
  };

  return (
    <div className="leave-calendar">
      <div className="calendar-header">Leave Calendar</div>

      <div className="calendar-nav">
        <img
          src={leftArrow}
          alt="Previous"
          className="nav-icon"
          onClick={() => handleMonthChange('prev')}
        />
        <span>{currentMonth.format('MMMM, YYYY')}</span>
        <img
          src={rightArrow}
          alt="Next"
          className="nav-icon"
          onClick={() => handleMonthChange('next')}
        />
      </div>

      <div className="calendar-grid calendar-weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {generateCalendarDays()}
      </div>

      <div className="calendar-footer">
        <span className="legend approved-box"></span> Approved Leaves
      </div>

      {selectedDate && (
        <div className="selected-date-display">
          Selected: {dayjs(selectedDate).format('DD MMMM, YYYY')}
        </div>
      )}
    </div>
  );
};

export default LeaveCalendar;
