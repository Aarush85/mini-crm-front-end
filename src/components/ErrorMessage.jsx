import React from 'react';

function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 p-4 rounded-md">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {message || 'An error occurred. Please try again.'}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage; 