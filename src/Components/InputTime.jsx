import React from 'react';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

const InputTime = ({ onTimeChange }) => {
  return (
    <div>
      Select Time: 
      <TimePicker
        onChange={onTimeChange}
        showSecond={false}
      />
    </div>
  );
};

export default InputTime;