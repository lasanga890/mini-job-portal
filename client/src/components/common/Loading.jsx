
import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-purple"></div>
    </div>
  );
};

export default Loading;
