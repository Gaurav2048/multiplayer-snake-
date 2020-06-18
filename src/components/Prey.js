import React, { useState, useEffect } from 'react';
import '../App.css';

function Prey(props) {
  const [left, setLeft] = useState('0');
  const [top, setTop] = useState('0');

  useEffect(() => {
    setLeft(props.left);
    setTop(props.top);
  });

  return (
    <div className="Prey" style={{ left: `${left}vh`, top: `${top}vh` }}></div>
  );
}

export default Prey;
