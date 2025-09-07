import React from 'react';

const ChainDropdown = ({ options, selectedChain, onChainChange }) => {
  return (
    <div className="relative inline-block text-left mb-4 z-10">
      <select
        id="chain-select"
        value={selectedChain}
        onChange={(e) => onChainChange(e.target.value)}
        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 leading-tight"
      >
        {options.map((option) => (
          <option key={option.label} value={option.label}>
            {option.label} - {option.chain.charAt(0).toUpperCase() + option.chain.slice(1)}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
};

export default ChainDropdown;
