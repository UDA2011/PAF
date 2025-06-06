// LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = '40px' }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Ensures the spinner is centered in the viewport
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: '5px solid #f3f3f3',
          borderTop: `5px solid #5B4AEB`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
