
import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-card-bg backdrop-blur-xl border border-border-dim rounded-2xl shadow-glow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
