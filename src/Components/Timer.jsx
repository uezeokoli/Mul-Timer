import React, { useState, useEffect } from 'react';

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

  export default Timer;