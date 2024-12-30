import React from 'react';
import Timer from './Timer.jsx';

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

export default Table;