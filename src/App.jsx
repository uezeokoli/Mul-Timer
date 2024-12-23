import { useState, useEffect } from 'react';
import TimePicker from 'rc-time-picker';
import ReactDOM from 'react-dom';
import 'rc-time-picker/assets/index.css';

// Main App Component
const App = () => {
  // State Variables
  const [items, setItems] = useState([]); // List of items with their timers
  const [item, setItem] = useState(""); // Current item name being added
  const [hours, setHours] = useState(0); // Hours for the current item
  const [minutes, setMinutes] = useState(0); // Minutes for the current item
  const [endTimeInput, setEndTimeInput] = useState(""); // User input for end time
  const [endTime, setEndTime] = useState(""); // Calculated or confirmed end time
  const [paused, setPaused] = useState(false); // Pause state for timers

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

  // Function: Handle changes to the end time input field
  const changeEndInput = (event) => setEndTimeInput(event.target.value);

  // Function: Validate and set the end time based on user input
  const confirmEndTime = () => {
    const timeString = endTimeInput.trim(); // Get and trim input
    const now = new Date();

    // Split the input into time and AM/PM parts
    const parts = timeString.split(' ');
    if (parts.length !== 2) {
      window.alert("Invalid Input"); // Validate input format
      return;
    }

    const [timePart, ampm] = parts;
    const [hourStr, minuteStr] = timePart.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Validate parsed values
    if (
      isNaN(hour) ||
      isNaN(minute) ||
      (ampm.toUpperCase() !== "AM" && ampm.toUpperCase() !== "PM")
    ) {
      window.alert("Invalid Input");
      return;
    }

    // Convert 12-hour format to 24-hour format
    if (ampm.toUpperCase() === "PM" && hour < 12) {
      hour += 12;
    } else if (ampm.toUpperCase() === "AM" && hour === 12) {
      hour = 0;
    }

    // Create a Date object for the end time
    const endTimeObject = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0,
      0
    );

    if (isNaN(endTimeObject.getTime())) {
      window.alert("Invalid Input"); // Check for invalid date
      return;
    }

    setEndTime(endTimeObject); // Set the end time
    setEndTimeInput(""); // Clear the input field
  };

  // Timer Adjustment Handlers
  const addHour = () => setHours(hours + 1); // Increment hours
  const subHour = () => setHours(hours - 1); // Decrement hours

  const addMinute = () => {
    if (minutes === 59) {
      setMinutes(0); // Reset minutes to 0
      addHour(); // Increment hour
    } else {
      setMinutes(minutes + 1); // Increment minutes
    }
  };

  const subMinute = () => {
    if (minutes === 0) {
      setMinutes(59); // Set minutes to 59
      subHour(); // Decrement hour
    } else {
      setMinutes(minutes - 1); // Decrement minutes
    }
  };

  // Toggle pause state
  const onClickPause = () => setPaused(!paused);

  // Adjust end time if paused
  if (paused && endTime) {
    const newEndTime = new Date(
      endTime.getFullYear(),
      endTime.getMonth(),
      endTime.getDate(),
      endTime.getHours(),
      endTime.getMinutes(),
      endTime.getSeconds() + 1
    );

    setTimeout(() => setEndTime(newEndTime), 1000); // Increment seconds
  }

  // Rendering
  return (
    <div>
      {/* Pause/Play Button */}
      <Button text={paused ? "play timer" : "pause timer"} onClick={onClickPause} />

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
        item: <input value={item} onChange={changeItemInput} onKeyDown={keyDownAddItem} />
      </div>

      {/* Time Input Controls */}
      <InputTime
        text={"time required: "}
        hours={hours}
        minutes={minutes}
        addHour={addHour}
        addMinute={addMinute}
        subHour={subHour}
        subMinute={subMinute}
      />

      {/* Button to Add Item */}
      <Button onClick={addItem} text={"add item"} />

      {/* Input for End Time */}
      <EndInput EndTime={endTimeInput} onChange={changeEndInput} />

      {/* Button to Confirm End Time */}
      <Button onClick={confirmEndTime} text={"confirm end time"} />
    </div>
  );
};

// EndInput Component: Input field for end time
const EndInput = ({ EndTime, onChange }) => (
  <div>
    Enter end time: <input value={EndTime} onChange={onChange} placeholder="ex: 10:30 PM" />
  </div>
);

// CurrentTime Component: Displays the current time
const CurrentTime = () => {
  const now = new Date();
  const [hours, setHours] = useState(now.getHours());
  const [minutes, setMinutes] = useState(now.getMinutes());

  const formattedTime = `${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? "PM" : "AM"}`;

  useEffect(() => {
    const interval = setInterval(() => {
      const newNow = new Date();
      setHours(newNow.getHours());
      setMinutes(newNow.getMinutes());
    }, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return <p>Current Time: {formattedTime}</p>;
};

// InputTime Component: Controls for adjusting hours and minutes
const InputTime = ({ text, hours, minutes, addHour, subHour, addMinute, subMinute }) => (
  <div>
    {text}
    <Button text={"+"} onClick={addHour} />
    <b>{hours}</b>
    <Button text={"-"} onClick={subHour} />:
    <Button text={"+"} onClick={addMinute} />
    <b>{minutes.toString().padStart(2, '0')}</b>
    <Button text={"-"} onClick={subMinute} />
  </div>
);

// Button Component: Reusable button with text and onClick handler
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

// Table Component: Displays the list of items with timers
const Table = ({ items, endTime, paused }) => (
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Timer</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item) => (
        <tr key={item.name}>
          <td>{item.name}</td>
          <td>
            <Timer hours={item.hours} minutes={item.minutes} endTime={endTime} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Timer Component: Displays a countdown timer for each item
const Timer = ({ hours, minutes, endTime }) => {
  const [display, setDisplay] = useState(""); // Current display state
  const totalNeededSeconds = (hours * 60 + minutes) * 60; // Total required time in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const msUntilEnd = endTime - now; // Milliseconds until the end
      const secondsUntilEnd = Math.floor(msUntilEnd / 1000); // Convert to seconds

      if (secondsUntilEnd > totalNeededSeconds) {
        const nsSeconds = secondsUntilEnd - totalNeededSeconds;
        const nsMinutes = Math.floor(nsSeconds / 60);
        setDisplay(`Not started (starts in ${nsMinutes}:${(nsSeconds % 60).toString().padStart(2, '0')})`);
      } else if (secondsUntilEnd <= 0) {
        setDisplay("Finished!");
      } else {
        const countdownMinutes = Math.floor(secondsUntilEnd / 60);
        const countdownSeconds = secondsUntilEnd % 60;
        setDisplay(`${countdownMinutes}:${countdownSeconds.toString().padStart(2, '0')}`);
      }
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [endTime, totalNeededSeconds]);

  return <p>{display}</p>;
};

export default App;