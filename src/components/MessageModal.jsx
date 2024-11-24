import React from 'react';

const MessageModal = ({ message, type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className={`text-lg font-bold ${type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {type === 'success' ? 'Success!' : 'Error!'}
        </h2>
        <p className="mt-2 text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
