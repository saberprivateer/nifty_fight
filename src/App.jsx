import React, { useState, useEffect } from 'react';
import NFTCard from './components/NFTCard';
import { fetchRandomNFTs } from './services/nftService';
import rarityLegendStyles from './styles/AppStyles';
import { RARITY_RANGES } from './constants/rarityConfig';

function App() {
  const [nfts, setNfts] = useState({
    lazyLions: null,
    chainRunners: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load initial NFTs on component mount
  useEffect(() => {
    loadRandomNFTs();
  }, []);

  const loadRandomNFTs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const randomNFTs = await fetchRandomNFTs();
      setNfts(randomNFTs);
    } catch (err) {
      console.error('Error loading NFTs:', err);
      setError('Failed to load NFTs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomize = () => {
    // Force a complete refresh by clearing existing NFTs first and updating refresh key
    setNfts({
      lazyLions: null,
      chainRunners: null
    });
    setRefreshKey(prev => prev + 1);
    loadRandomNFTs();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🦁 Nifty Fight 🏃‍♂️
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Random NFTs from Lazy Lions vs Chain Runners
          </p>
          
          {/* Randomize Button */}
          <button
            onClick={handleRandomize}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              '🎲 Randomize NFTs'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rarity Legend */}
        <div className="container mx-auto mt-8">
          <div className={rarityLegendStyles.container}>
            <h2 className={rarityLegendStyles.title}>Rarity Legend</h2>
            <div>
              {RARITY_RANGES.map((range, index) => (
                <div key={index} className={rarityLegendStyles.legendItem}>
                  <div className={`${rarityLegendStyles.rarityBlock} ${range.bgColor} ${range.textColor} ${range.borderColor}`}>
                    {range.emoji}
                  </div>
                  <span className={rarityLegendStyles.rarityText}>
                    {range.label} ({range.max === Infinity ? `>= ${range.min}%` : `< ${range.max}%`})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NFT Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Lazy Lions Card */}
          <div className="flex flex-col">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🦁 Lazy Lions
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
            </div>
            <NFTCard 
              key={`lazy-lions-${refreshKey}-${nfts.lazyLions?.id || 'loading'}`}
              nft={nfts.lazyLions} 
              isLoading={isLoading && !nfts.lazyLions}
            />
          </div>

          {/* Chain Runners Card */}
          <div className="flex flex-col">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🏃‍♂️ Chain Runners
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <NFTCard 
              key={`chain-runners-${refreshKey}-${nfts.chainRunners?.id || 'loading'}`}
              nft={nfts.chainRunners} 
              isLoading={isLoading && !nfts.chainRunners}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Powered by{' '}
            <a 
              href="https://reservoir.tools" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Reservoir API
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
