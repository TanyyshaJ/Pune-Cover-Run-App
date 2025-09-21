
import React from 'react';
import { InfoIcon } from './Icons';

interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-gray-800 text-white rounded-2xl shadow-2xl max-w-md w-full m-4 border border-gray-700">
        <div className="p-8 space-y-6">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-500/10 rounded-full">
                <InfoIcon className="w-10 h-10 text-blue-400"/>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Welcome to PuneCover!</h2>
            <p className="text-gray-400">Map your runs and visualize your coverage of Pune.</p>
          </div>
          <div className="space-y-4 text-gray-300">
             <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 font-bold text-blue-400">1.</div>
                <p>Click <span className="font-semibold text-white">Start Run</span> to enter drawing mode.</p>
             </div>
             <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 font-bold text-blue-400">2.</div>
                <p>Click on the map to draw the path of your run.</p>
             </div>
             <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 font-bold text-blue-400">3.</div>
                <p>Click <span className="font-semibold text-white">Save Run</span> to calculate your new coverage and add it to your history.</p>
             </div>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Let's Go!
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
