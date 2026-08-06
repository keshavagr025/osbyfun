import React, { useState } from 'react';

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const calculate = (a, b, op) => {
    a = parseFloat(a); b = parseFloat(b);
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') return a / b;
    return b;
  };

  const handlePress = (val) => {
    if (val === 'C') {
      setDisplay('0');
      setPrevVal(null);
      setOperator(null);
      setWaitingForNewValue(false);
      return;
    }
    
    if (['+', '-', '*', '/'].includes(val)) {
      if (operator && !waitingForNewValue) {
        const result = calculate(prevVal, display, operator);
        setDisplay(String(result));
        setPrevVal(String(result));
      } else {
        setPrevVal(display);
      }
      setOperator(val);
      setWaitingForNewValue(true);
      return;
    }

    if (val === '=') {
      if (operator && prevVal) {
        const result = calculate(prevVal, display, operator);
        setDisplay(String(result));
        setPrevVal(null);
        setOperator(null);
        setWaitingForNewValue(true);
      }
      return;
    }

    // Number or dot
    if (waitingForNewValue) {
      setDisplay(val);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? val : display + val);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      <div style={{ background: '#fff', border: '2px solid #000', padding: '8px', textAlign: 'right', fontSize: '28px', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: '"VT323", monospace' }}>
        {display}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', flex: 1 }}>
        {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(btn => (
          <button 
            key={btn} 
            onClick={() => handlePress(btn)}
            style={{ 
              background: ['=','+','-','*','/','C'].includes(btn) ? '#ffbd2e' : '#e0e0e0', 
              border: '2px solid #000', 
              fontFamily: 'Pixelify Sans', 
              fontSize: '22px', 
              fontWeight: 'bold',
              cursor: 'pointer', 
              boxShadow: '2px 2px 0px #000',
              transition: 'transform 0.1s, box-shadow 0.1s'
            }}
            onMouseDown={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translate(2px, 2px)'; }}
            onMouseUp={(e) => { e.currentTarget.style.boxShadow = '2px 2px 0px #000'; e.currentTarget.style.transform = 'none'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '2px 2px 0px #000'; e.currentTarget.style.transform = 'none'; }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalculatorApp;
