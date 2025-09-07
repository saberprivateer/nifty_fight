import React, { useState } from 'react';

const NFTCard = ({ nft, isLoading = false }) => {
  const [showAllTraits, setShowAllTraits] = useState(false);
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-auto">
        <div className="animate-pulse">
          <div className="bg-gray-300 rounded-lg h-64 mb-4"></div>
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-auto">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">❌</div>
          <p>Failed to load NFT</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300">
      {/* NFT Image */}
      <div className="mb-4">
        {nft.image ? (
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full rounded-lg"
            style={{ objectFit: 'contain', maxHeight: '400px' }}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
            }}
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      {/* NFT Name */}
      <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" title={nft.name}>
        {nft.name}
      </h3>

      {/* Collection Name */}
      <p className="text-sm text-gray-600 mb-4 font-medium">
        {nft.collection}
      </p>

      {/* Traits */}
      {nft.traits && nft.traits.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">Traits:</h4>
            {nft.traits.length > 6 && (
              <button
                onClick={() => setShowAllTraits(!showAllTraits)}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                {showAllTraits ? 'Show Less' : `Show All (${nft.traits.length})`}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {(showAllTraits ? nft.traits : nft.traits.slice(0, 6)).map((trait, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg px-3 py-2 text-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">{trait.key}:</span>
                    <span className="ml-2 text-gray-600">{trait.value}</span>
                  </div>
                  {trait.rarity && (
                    <div className="text-right text-xs ml-2">
                      <div className={`font-medium ${
                        parseFloat(trait.rarity.percentage) < 1 ? 'text-red-600' :
                        parseFloat(trait.rarity.percentage) < 5 ? 'text-orange-600' :
                        parseFloat(trait.rarity.percentage) < 10 ? 'text-yellow-600' :
                        'text-gray-500'
                      }`}>
                        {trait.rarity.count} ({trait.rarity.percentage}%)
                        {parseFloat(trait.rarity.percentage) < 1 && ' 🔥'}
                        {parseFloat(trait.rarity.percentage) >= 1 && parseFloat(trait.rarity.percentage) < 5 && ' ⭐'}
                      </div>
                      {trait.rarity.floorPrice && (
                        <div className="text-green-600">
                          {trait.rarity.floorPrice} ETH
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">
          No traits available
        </div>
      )}

      {/* Token ID */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Token ID: {nft.id}
        </p>
      </div>
    </div>
  );
};

export default NFTCard;
