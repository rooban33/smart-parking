import React, { useState, useEffect } from 'react';
import './App.css';
// Import Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "pirate-alpha.firebaseapp.com",
  databaseURL: "https://pirate-alpha-default-rtdb.firebaseio.com",
  projectId: "pirate-alpha",
  storageBucket: "pirate-alpha.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const slots = Array.from({ length: 16 }, (_, i) => i);

function App() {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [parkingData, setParkingData] = useState({
    slot1: { distance: 0 },
    slot2: { distance: 0 },
    slot3: { distance: 0 },
    flame_detected: false
  });


  useEffect(() => {
    const parkingRef = ref(database, 'parking');
    onValue(parkingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setParkingData(data);
      }
    });
  }, []);

  const handleSlotClick = (index) => {
    if (bookedSlots.includes(index)) return;
    setSelectedSlot(index); // Set the selected route
    const confirmBooking = window.confirm(`Do you want to book slot ${index}?`);
    if (confirmBooking) {
      setBookedSlots([...bookedSlots, index]);
    }
  };

  const getSlotClass = (slot) => {
    let classes = 'slot';
    
    // First 3 slots logic
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

  const getHighlightPercentage = (slotNumber) => {
    // For slots in second column (4-7)
    const row = slotNumber % 4; // 0-3
    return `${(row + 1) * 25}%`; // Adjusts highlight based on slot position
  };

  const getRoadClass = (type, position) => {
    let classes = type === 'horizontal' ? 'road-horizontal' : 'road-vertical';
    
    if (selectedSlot !== null) {
      const selectedColumn = Math.floor(selectedSlot / 4);
      
      if (type === 'vertical') {
        // For first vertical road (between columns 0 and 1)
        if (position === 0) {
          if (selectedColumn === 0) {
            classes += ' active arrow-left';  // Slots 0-3 (left side)
          } else if (selectedColumn === 1) {
            classes += ' active arrow-right'; // Slots 4-7 (right side)
          }
        }
        // For second vertical road (between columns 2 and 3)
        else if (position === 1) {
          if (selectedColumn === 2) {
            classes += ' active arrow-left';  // Slots 8-11 (left side)
          } else if (selectedColumn === 3) {
            classes += ' active arrow-right'; // Slots 12-15 (right side)
          }
        }
      }
    }
    
    return classes;
  };

  return (
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

        <div className={getRoadClass('vertical', 2)} />

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
  );
}

export default App;