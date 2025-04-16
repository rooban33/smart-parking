// App.js
import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import Login from './Login';
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
const auth = getAuth(app);
const database = getDatabase(app);

function App() {
  const [user, setUser] = useState(null);
  const [userRfid, setUserRfid] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [parkingData, setParkingData] = useState({
    slot1: { distance: 0 },
    slot2: { distance: 0 },
    slot3: { distance: 0 },
    flame_detected: false
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastPrice, setLastPrice] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRfidMap = {
          'gokul@gmail.com': 'c1e2ca83',
          'shajith@gmail.com': '73328392'
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
    const parkingRef = ref(database, 'parking'); // lowercase 'parking'
    const unsubscribe = onValue(parkingRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Firebase Data:', data); // For debugging
      if (data) {
        setParkingData(data);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSelectedSlot(null);
      setBookedSlots([]);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSlotClick = (index) => {
    if (bookedSlots.includes(index)) return;
    setSelectedSlot(index);
    const confirmBooking = window.confirm(`Do you want to book slot ${index}?`);
    if (confirmBooking) {
      setBookedSlots([...bookedSlots, index]);
    }
  };

  const getSlotClass = (slot) => {
    let classes = 'slot';
    
    if (slot < 3) {
      const distance = parkingData[`slot${slot + 1}`]?.distance;
      if (distance < 20) {
        classes += ' occupied';
      } else {
        classes += ' free';
      }
    }
    
    if (bookedSlots.includes(slot)) classes += ' booked';
    if (slot === selectedSlot) classes += ' selected';
    return classes;
  };

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

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      {showConfetti && <ReactConfetti />}
      
      <div className="user-header">
        <span>Welcome, {user.email}</span>
        <span>RFID: {userRfid}</span>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {lastPrice && (
        <div className="last-transaction">
          <div className="price-card">
            <h3>Last Parking Fee</h3>
            <div className="price-amount">₹{lastPrice}</div>
            <button className="close-price" onClick={() => setLastPrice(null)}>
              Close
            </button>
          </div>
        </div>
      )}

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

          {selectedSlot !== null && (
            <>
            </>
          )}
        </div>
        
        <div className="stepz-bottom">ENTER</div>
        <div className="stepz-bottom2">EXIT</div>
      </div>
    </div>
  );
}

export default App;