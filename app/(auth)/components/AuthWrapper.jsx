import React from 'react';

const AuthWrapper = ({ children }) => {
  return (
    <div className='min-h-[calc(100vh-20px)] bg-white my-4 px-8 rounded-[25px]  mx-auto flex flex-col items-center justify-center content-center'>
        { children }
    </div>
  );
};

export default AuthWrapper;