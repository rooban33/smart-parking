// components/ParkingStatus/ParkingStatus.js
import React from 'react';
import './ParkingStatus.css';

const ParkingStatus = ({ parkingData, exitPrice, showConfetti }) => {
  if (!parkingData) return null;

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString();
  };

  return (
    <div className="parking-status-container">
      <div className="status-card">
        <div className="status-header">
          <h2>Parking Status</h2>
          <div className={`status-badge ${parkingData.exit ? 'exited' : 'parked'}`}>
            {parkingData.exit ? 'Exited' : 'Parked'}
          </div>
        </div>

        <div className="time-info">
          <div className="time-block entry">
            <i className="fas fa-car-side"></i>
            <div className="time-details">
              <h3>Entry Time</h3>
              <p>{parkingData.entry}</p>
            </div>
          </div>

          {parkingData.exit && (
            <div className="time-block exit">
              <i className="fas fa-flag-checkered"></i>
              <div className="time-details">
                <h3>Exit Time</h3>
                <p>{parkingData.exit}</p>
              </div>
            </div>
          )}
        </div>

        {exitPrice && showConfetti && (
          <div className="price-display">
            <div className="price-card">
              <h3>Parking Fee</h3>
              <div className="price-amount">
                <span className="currency">₹</span>
                <span className="amount">{exitPrice}</span>
              </div>
              <p className="thank-you">Thank you for using our parking service!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingStatus;