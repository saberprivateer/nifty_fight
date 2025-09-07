// NFT Service for fetching NFTs from Reservoir API
const RESERVOIR_BASE_URL = 'https://api.reservoir.tools';

// Collection contract addresses
const COLLECTIONS = {
  LAZY_LIONS: '0x8943C7bAC1914C9A7ABa750Bf2B6B09Fd21037E0',
  CHAIN_RUNNERS: '0x97597002980134bea46250aa0510c9b90d87a587'
};

// Collection names for display
const COLLECTION_NAMES = {
  [COLLECTIONS.LAZY_LIONS]: 'Lazy Lions',
  [COLLECTIONS.CHAIN_RUNNERS]: 'Chain Runners'
};

/**
 * Fetch trait statistics for a collection
 * @param {string} contractAddress - The contract address of the collection
 * @returns {Promise<Object>} - Trait statistics object
 */
export const fetchTraitStats = async (contractAddress) => {
  try {
    const response = await fetch(
      `${RESERVOIR_BASE_URL}/collections/${contractAddress}/attributes/v1`
    );
    
    if (!response.ok) {
      console.warn(`Failed to fetch trait stats: ${response.status}`);
      return {};
    }
    
    const data = await response.json();
    const traitStats = {};
    
    // Process the trait statistics
    if (data.attributes) {
      data.attributes.forEach(attribute => {
        if (attribute.key && attribute.values) {
          traitStats[attribute.key] = {};
          attribute.values.forEach(value => {
            traitStats[attribute.key][value.value] = {
              count: value.count,
              floorAskPrice: value.floorAskPrice
            };
          });
        }
      });
    }
    
    return traitStats;
  } catch (error) {
    console.warn('Error fetching trait stats:', error);
    return {};
  }
};

/**
 * Fetch a random NFT from a specific collection
 * @param {string} contractAddress - The contract address of the collection
 * @returns {Promise<Object>} - NFT data object
 */
export const fetchRandomNFT = async (contractAddress) => {
  try {
    // First, get the collection info to understand the total supply
    const collectionResponse = await fetch(
      `${RESERVOIR_BASE_URL}/collections/v7?id=${contractAddress}`
    );
    
    if (!collectionResponse.ok) {
      throw new Error(`Failed to fetch collection data: ${collectionResponse.status}`);
    }
    
    const collectionData = await collectionResponse.json();
    const collection = collectionData.collections?.[0];
    
    if (!collection) {
      throw new Error('Collection not found');
    }
    
    // Get the total supply from the collection data
    const totalSupply = collection.tokenCount || collection.tokenSet?.tokenCount;
    
    if (!totalSupply || totalSupply === 0) {
      throw new Error('Collection has no tokens or total supply unknown');
    }
    
    console.log(`Collection ${COLLECTION_NAMES[contractAddress]} has ${totalSupply} tokens`);
    
    // Fetch trait statistics in parallel
    const [traitStats] = await Promise.all([
      fetchTraitStats(contractAddress)
    ]);
    
    // Generate a random token ID within the collection range
    // Note: Some collections start from 0, others from 1, so we'll try both approaches
    let randomTokenId;
    let token;
    
    // Try to get a random token by generating a random ID and fetching it
    // We'll try a few random IDs to increase chances of success
    for (let attempt = 0; attempt < 5; attempt++) {
      randomTokenId = Math.floor(Math.random() * totalSupply) + 1; // Start from 1
      
      try {
        const tokenResponse = await fetch(
          `${RESERVOIR_BASE_URL}/tokens/v7?collection=${contractAddress}&token=${contractAddress}:${randomTokenId}&includeAttributes=true`
        );
        
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          if (tokenData.tokens && tokenData.tokens.length > 0) {
            token = tokenData.tokens[0];
            break;
          }
        }
      } catch (err) {
        console.log(`Attempt ${attempt + 1}: Token ID ${randomTokenId} not found, trying another...`);
        continue;
      }
    }
    
    // If direct token fetch failed, fall back to getting a random token from a sample
    if (!token) {
      console.log('Direct token fetch failed, falling back to random sampling...');
      const tokensResponse = await fetch(
        `${RESERVOIR_BASE_URL}/tokens/v7?collection=${contractAddress}&limit=100&includeAttributes=true&sortBy=tokenId&sortDirection=asc`
      );
      
      if (!tokensResponse.ok) {
        throw new Error(`Failed to fetch tokens: ${tokensResponse.status}`);
      }
      
      const tokensData = await tokensResponse.json();
      const tokens = tokensData.tokens || [];
      
      if (tokens.length === 0) {
        throw new Error('No tokens found in collection');
      }
      
      // Pick a random token from the fetched tokens
      const randomIndex = Math.floor(Math.random() * tokens.length);
      token = tokens[randomIndex];
    }
    
    // Enhance traits with rarity information
    const enhancedTraits = (token.token?.attributes || []).map(trait => {
      const rarityInfo = traitStats[trait.key]?.[trait.value];
      return {
        ...trait,
        rarity: rarityInfo ? {
          count: rarityInfo.count,
          percentage: totalSupply ? ((rarityInfo.count / totalSupply) * 100).toFixed(2) : '0.00',
          floorPrice: rarityInfo.floorAskPrice
        } : null
      };
    });
    
    // Format the NFT data
    const nftData = {
      id: token.token?.tokenId,
      name: token.token?.name || `${COLLECTION_NAMES[contractAddress]} #${token.token?.tokenId}`,
      image: token.token?.image,
      collection: COLLECTION_NAMES[contractAddress],
      contractAddress: contractAddress,
      traits: enhancedTraits,
      description: token.token?.description || '',
      tokenStandard: token.token?.kind || 'ERC-721',
      totalSupply: totalSupply
    };
    
    return nftData;
  } catch (error) {
    console.error('Error fetching NFT:', error);
    throw error;
  }
};

/**
 * Fetch random NFTs from both Lazy Lions and Chain Runners collections
 * @returns {Promise<Object>} - Object containing both NFTs
 */
export const fetchRandomNFTs = async () => {
  try {
    const [lazyLionsNFT, chainRunnersNFT] = await Promise.all([
      fetchRandomNFT(COLLECTIONS.LAZY_LIONS),
      fetchRandomNFT(COLLECTIONS.CHAIN_RUNNERS)
    ]);
    
    return {
      lazyLions: lazyLionsNFT,
      chainRunners: chainRunnersNFT
    };
  } catch (error) {
    console.error('Error fetching random NFTs:', error);
    throw error;
  }
};

export { COLLECTIONS, COLLECTION_NAMES };
