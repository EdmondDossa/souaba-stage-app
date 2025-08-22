import React from 'react';

const AuthWrapper = ({ children }) => {
  return (
    <div className='min-h-screen  mx-auto flex flex-col items-center justify-center content-center'>
        { children }
    </div>
  );
};

export default AuthWrapper;