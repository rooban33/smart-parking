
import React, { useState } from 'react';
import './ParkingLayout.css';

const ParkingLayout = ({ userRfid, parkingData }) => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

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
  
  // Permanently booked slots
  if (slot === 5 || slot === 13) {
    return classes + ' booked';
  }

  // First three slots based on distance data
  if (slot <= 2) {
    const slotNumber = slot + 1; // Convert to 1-based index for Firebase
    const distance = parkingData?.[`slot${slotNumber}`]?.distance;
    
    // Check if distance exists and apply appropriate class
    if (distance !== undefined) {
      // Based on the Firebase data shown:
      // slot1: distance: 790 (free)
      // slot2: distance: 0 (occupied)
      // slot3: distance: 281 (free)
      return classes + (distance < 20 ? ' occupied' : ' free');
    }
  }

  // All other slots
  return classes + ' available';
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
            <div className="entrance-indicator">Entrance</div>
            <div className="exit-indicator">Exit</div>
          </>
        )}
      </div>
      
      <div className="stepz-bottom">ENTER</div>
      <div className="stepz-bottom2">EXIT</div>
    </div>
  );
};

export default ParkingLayout;