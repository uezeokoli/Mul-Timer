
import { useState, useEffect } from 'react';
import TimePicker from 'rc-time-picker';
import ReactDOM from 'react-dom';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

import Button from './Components/Button.jsx';
import CurrentTime from './Components/CurrentTime.jsx';
import EndInput from './Components/EndInput.jsx';
import Table from './Components/Table.jsx';
import Timer from './Components/Timer.jsx';
//import InputTime from './Components/InputTime.jsx';

// Main App Component
const App = () => {
  // State Variables
  const [items, setItems] = useState([]); // List of items with their timers
  const [item, setItem] = useState(""); // Current item name being added
  const [endTime, setEndTime] = useState(""); // Calculated or confirmed end time
  const [paused, setPaused] = useState(false); // Pause state for timers

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  
  const handleTimeChange = (time) => {
    setHours(time.hour());
    setMinutes(time.minute());
  };
  
  const handleEndTimeChange = (time) => {
    const now = new Date();
    const endTimeObject = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      time.hour(),
      time.minute(),
      0,
      0
    );
    setEndTime(endTimeObject);
  };  
  // Effect: Compute the longest time and update the default end time
  useEffect(() => {
    if (items.length === 0) return; // Skip if no items

    // Find the longest time in items (in minutes)
    const longestTime = items.reduce((max, item) => {
      const totalMinutes = item.hours * 60 + item.minutes;
      return totalMinutes > max ? totalMinutes : max;
    }, 0);

    // Calculate default end time based on the longest duration
    const now = new Date();
    const defaultEndTime = new Date(now.getTime() + longestTime * 60 * 1000);

    // Update endTime if it is not already set
    if (!endTime) {
      setEndTime(defaultEndTime);
    }
  }, [items, endTime]);

  // Function: Add a new item to the list
  const addItem = () => {
    //if no time or item name set alert
    if (!item.trim()) {
      alert("Please enter a valid item name.");
      return;
    }
    if (hours === 0 && minutes === 0) {
      alert("Please select a valid time duration.");
      return;
    }
    const itemObj = { name: item, hours, minutes }; // Create item object
    setItems([...items, itemObj]); // Append to items list
    setItem(""); // Clear input field
  };

  // Function: Add item on Enter key press
  const keyDownAddItem = (event) => {
    if (event.nativeEvent.key === "Enter") {
      addItem();
    }
  };

  // Function: Handle changes to the item input field
  const changeItemInput = (event) => setItem(event.target.value);

  // Toggle pause state
  const onClickPause = () => setPaused(!paused);

  // Adjust end time if paused
  useEffect(() => {
    // Only do this if paused is true and endTime is set
    if (!paused || !endTime) return;
  
    const timerId = setTimeout(() => {
      const newEndTime = new Date(
        endTime.getFullYear(),
        endTime.getMonth(),
        endTime.getDate(),
        endTime.getHours(),
        endTime.getMinutes(),
        endTime.getSeconds() + 1
      );
      setEndTime(newEndTime);
    }, 1000);
  
    // Clean up the timeout when paused/endTime changes or component unmounts
    return () => clearTimeout(timerId);
  }, [paused, endTime]);

  // Rendering
  return (
    <div>
      {/* Pause/Play Button */}
      <Button text={paused ? "Play" : "Pause"} onClick={onClickPause} />

      {/* Current Time Display */}
      <CurrentTime />

      {/* End Time Display */}
      <p>
        End Time: {endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "End time not entered!"}
      </p>

      {/* Table of Items */}
      <Table items={items} endTime={endTime} paused={paused} />

      {/* Input for Adding Items */}
      <div>
        Item: <input value={item} onChange={changeItemInput} onKeyDown={keyDownAddItem} />
      </div>
      <InputTime onTimeChange={handleTimeChange} />

      {/* Button to Add Item */}
      <Button onClick={addItem} text={"Add Item"} />
      
      {/* End Time Input */}
      <EndInput onTimeChange={handleEndTimeChange} />

    </div>
  );
};


// Input Time Component: Time Picker for selecting time
const InputTime = ({ onTimeChange }) => (
  <div>
    Select Time: <TimePicker onChange={onTimeChange} defaultValue={moment()} showSecond={false} />
  </div>
);

export default App;