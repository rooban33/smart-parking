// StatusPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import './StatusPage.css';

const StatusPage = ({ user, userRfid, handleLogout }) => {
  const navigate = useNavigate();
  const [parkingData, setParkingData] = useState(null);
  const database = getDatabase();

  useEffect(() => {
    let isMounted = true; // Flag to track component mount state

    if (userRfid) {
      const parkingRef = ref(database, `Parking/${userRfid}`);
      
      // Store the unsubscribe function
      const unsubscribe = onValue(parkingRef, (snapshot) => {
        if (isMounted) { // Only update state if component is mounted
          const data = snapshot.val();
          console.log('Fetched data:', data);
          if (data) {
            setParkingData(data);
          }
        }
      }, (error) => {
        console.error('Firebase onValue error:', error);
      });

      // Cleanup function
      return () => {
        isMounted = false;
        unsubscribe();
      };
    }
  }, [userRfid]); // Only depend on userRfid

  // Check if only entry time exists (current parking)
  const isCurrentlyParked = parkingData && parkingData.entry && !parkingData.exit;

  return (
    <div className="status-page">
      <div className="header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Parking
        </button>
        <div className="user-info">
          {user.email} RFID: {userRfid}
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="status-card">
        <div className="card-header">
          <h2>{isCurrentlyParked ? 'Current Parking' : 'Last Parking'}</h2>
          <span className={`status-badge ${isCurrentlyParked ? 'active' : 'completed'}`}>
            {isCurrentlyParked ? 'Active' : 'Completed'}
          </span>
        </div>

        {parkingData?.entry ? (
          <div className="parking-details">
            <div className="detail-item">
              <span className="label">Entry Time:</span>
              <span className="value">{parkingData.entry}</span>
            </div>
            
            {isCurrentlyParked ? (
              <>
                <div className="detail-item">
                  <span className="label">Exit Time:</span>
                  <span className="value pending">Not left yet</span>
                </div>
                <div className="detail-item">
                  <span className="label">Price:</span>
                  <span className="value pending">Pending checkout</span>
                </div>
              </>
            ) : (
              <>
                <div className="detail-item">
                  <span className="label">Exit Time:</span>
                  <span className="value">{parkingData.exit}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Price:</span>
                  <span className="value">₹{parkingData.price}</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="no-data">
            <span className="no-data-text">No parking data available</span>
          </div>
        )}
      </div>

      {/* <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        padding: '10px', 
        background: '#333', 
        color: '#fff', 
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <p>Debug Info:</p>
        <p>UserRFID: {userRfid}</p>
        <p>Path: Parking/{userRfid}</p>
        <p>Data: {JSON.stringify(parkingData, null, 2)}</p>
      </div> */}
    </div>
  );
};

export default StatusPage;