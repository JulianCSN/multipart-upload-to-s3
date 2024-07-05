import React, { useState } from 'react';

interface UploadModalProps {
  onClose: () => void;
  onAccept: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onAccept }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-zinc-900 rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-green-500 text-xl font-bold">Éxito!</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-gray-300 text-lg mb-6">Se ha cargado el archivo a S3 con éxito!</p>
        <div className="flex justify-end">
          <button
            onClick={onAccept}
            className="bg-green-600 text-white px-4 py-2 rounded-xl duration-300 hover:bg-green-500 focus:outline-none"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
