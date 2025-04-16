// App.js
import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Login';
import StatusPage from './StatusPage';
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyDHWwbXX_kdhCEVoZjrcmYlCauskzGPnps",
  authDomain: "pirate-alpha.firebaseapp.com",
  databaseURL: "https://pirate-alpha-default-rtdb.firebaseio.com",
  projectId: "pirate-alpha",
  storageBucket: "pirate-alpha.firebasestorage.app",
  messagingSenderId: "791519432071",
  appId: "1:791519432071:web:e5915af896a42c984fd722",
  measurementId: "G-SJQ30E2PVG"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

function ParkingLayout({ user, userRfid, parkingData, handleLogout, ...props }) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastPrice, setLastPrice] = useState(null);

  const handleSlotClick = (index) => {
    // Prevent clicking on already booked or occupied slots
    if (bookedSlots.includes(index) || parkingData[`slot${index + 1}`]?.distance < 20) {
      return; // Slot is not available for booking
    }
  
    setSelectedSlot(index);
    const confirmBooking = window.confirm(`Do you want to book slot ${index}?`);
    if (confirmBooking) {
      setBookedSlots([...bookedSlots, index]);
      setShowConfetti(true); // Optional: Show confetti for booking confirmation
    }
  };
  
  const getSlotClass = (slot) => {
    let classes = 'slot'; // Default slot class
  
    // Define the available slots (1, 3, and 13)
    const availableSlots = [1, 3, 13];
  
    // If the slot is not in the available slots, mark it as booked and not available
    if (!availableSlots.includes(slot)) {
      classes += ' booked not-available'; // Red background for unavailable slots
      return classes; // Return early for slots that cannot be booked
    }
  
    // Check if slot is occupied using sensor data (for slots 1, 3, and 13)
    const sensorSlotMap = {
      1: 'slot1',
      3: 'slot3',
      13: 'slot13'
    };
  
    let isOccupied = false;
  
    // Check sensor data for specific slots
    if (sensorSlotMap.hasOwnProperty(slot)) {
      const distance = parkingData[sensorSlotMap[slot]]?.distance;
      if (distance < 20) {
        isOccupied = true;
        classes += ' occupied'; // Slot is occupied
      } else {
        classes += ' free'; // Slot is free
      }
    }
  
    // Check if slot is already booked
    if (bookedSlots.includes(slot)) {
      classes += ' booked'; // Slot is booked
      isOccupied = true; // Prevent further booking for this slot
    }
  
    // Mark selected slot
    if (slot === selectedSlot) {
      classes += ' selected'; // Slot is selected
    }
  
    // If the slot is occupied or already booked, prevent booking
    if (isOccupied) {
      classes += ' not-available'; // Red background for unavailable slots
    }
  
    return classes;
  };
  
  // const getSlotClass = (slot) => {
  //   let classes = 'slot';
    
  //   if (slot < 3) {
  //     const distance = parkingData[`slot${slot + 1}`]?.distance;
  //     if (distance < 20) {
  //       classes += ' occupied';
  //     } else {
  //       classes += ' free';
  //     }
  //   }
    
  //   if (bookedSlots.includes(slot)) classes += ' booked';
  //   if (slot === selectedSlot) classes += ' selected';
  //   return classes;
  // };

  const getRoadClass = (type, position) => {
    let classes = type === 'horizontal' ? 'road-horizontal' : 'road-vertical';
    
    if (selectedSlot !== null) {
      const column = Math.floor(selectedSlot / 4);
      const row = selectedSlot % 4;
      
      if (type === 'horizontal' && column >= 2) {
        classes += ' active width-100';
      }
      
      if (type === 'vertical') {
        if (position === 0) {
          if (column <= 1) {
            classes += ' active';
            if (column === 0) {
              classes += ` height-${(row + 1) * 25}`;
            } else {
              classes += ` bottom-up`;
              classes += row === 0 ? ' height-100' : ` height-${(4 - row) * 25}`;
            }
          } else {
            classes += ' active height-100';
          }
        }
        if (position === 1 && column >= 2) {
          classes += ' active';
          classes += ` height-${(row + 1) * 25}`;
        }
      }
    }
    
    return classes;
  };

  return (
    <div className="app">
      {showConfetti && <ReactConfetti />}
      
      <div className="user-header">
        <span>Welcome, {user.email}</span>
        <span>RFID: {userRfid}</span>
        <Link to="/status" className="status-button">View Status</Link>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="parking-container">
        <h1 className="title">PARKING SYSTEM</h1>
        <div className={getRoadClass('horizontal', 0)}></div>

        <div className="parking-layout">
          {/* Column 1 */}
          <div className="column">
            {[0, 1, 2, 3].map((slot) => (
              <div
                key={slot}
                className={getSlotClass(slot)}
                onClick={() => handleSlotClick(slot)}
              >
                {slot}
              </div>
            ))}
          </div>

          <div className={getRoadClass('vertical', 0)} />

          {/* Column 2 */}
          <div className="column">
            {[4, 5, 6, 7].map((slot) => (
              <div
                key={slot}
                className={getSlotClass(slot)}
                onClick={() => handleSlotClick(slot)}
              >
                {slot}
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="column">
            {[8, 9, 10, 11].map((slot) => (
              <div
                key={slot}
                className={getSlotClass(slot)}
                onClick={() => handleSlotClick(slot)}
              >
                {slot}
              </div>
            ))}
          </div>

          <div className={getRoadClass('vertical', 1)} />

          {/* Column 4 */}
          <div className="column">
            {[12, 13, 14, 15].map((slot) => (
              <div
                key={slot}
                className={getSlotClass(slot)}
                onClick={() => handleSlotClick(slot)}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>
        
        <div className="stepz-bottom">ENTER</div>
        <div className="stepz-bottom2">EXIT</div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [userRfid, setUserRfid] = useState(null);
  const [parkingData, setParkingData] = useState({
    slot1: { distance: 0 },
    slot2: { distance: 0 },
    slot3: { distance: 0 },
    flame_detected: false
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRfidMap = {
          'shajith@gmail.com': '73328392',
          'gokul@gmail.com': 'c1e2ca83'
        };
        setUserRfid(userRfidMap[currentUser.email]);
      } else {
        setUser(null);
        setUserRfid(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const parkingRef = ref(database, 'parking');
    const unsubscribe = onValue(parkingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setParkingData(data);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route 
          path="/" 
          element={
            <ParkingLayout 
              user={user}
              userRfid={userRfid}
              parkingData={parkingData}
              handleLogout={handleLogout}
            />
          } 
        />
        <Route 
          path="/status" 
          element={
            <StatusPage 
              user={user}
              userRfid={userRfid} // Make sure this is being set correctly
              handleLogout={handleLogout}
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
