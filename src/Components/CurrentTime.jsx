import React, { useState, useEffect } from 'react';

const CurrentTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
  
    useEffect(() => {
      const interval = setInterval(() => setCurrentTime(new Date()), 60000);
      return () => clearInterval(interval);
    }, []);
  
    return <p>Current Time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>;
  };

export default CurrentTime;