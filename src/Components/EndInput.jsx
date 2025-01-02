import React from 'react';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

const EndInput = ({ onTimeChange }) => (
  <div>
    Select End Time: <TimePicker onChange={onTimeChange} defaultValue={moment()} showSecond={false} />
  </div>
);

export default EndInput;