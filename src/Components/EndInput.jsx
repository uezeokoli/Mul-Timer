import React from 'react';
import TimePicker from 'rc-time-picker';

const EndInput = ({ onTimeChange }) => (
  <div>
    Select End Time: <TimePicker onChange={onTimeChange} showSecond={false} />
  </div>
);

export default EndInput;