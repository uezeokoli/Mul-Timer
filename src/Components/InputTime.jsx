import React from 'react';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

const InputTime = ({ onTimeChange }) => {
    <div>
      Select Time: <TimePicker onChange={onTimeChange} defaultValue={moment()} showSecond={false} />
    </div>
};

export default InputTime;