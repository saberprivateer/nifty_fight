// NFT Service for fetching NFTs from Reservoir API
const RESERVOIR_BASE_URL = 'https://api.reservoir.tools';

// Collection contract addresses
const COLLECTIONS = {
//DON'T CHANGE THESE ADDRESSES!
  LAZY_LIONS: '0x8943C7bAC1914C9A7ABa750Bf2B6B09Fd21037E0',
  CHAIN_RUNNERS: '0x97597002980134bea46250aa0510c9b90d87a587'
};

// Collection names for display
const COLLECTION_NAMES = {
  [COLLECTIONS.LAZY_LIONS]: 'Lazy Lions',
  [COLLECTIONS.CHAIN_RUNNERS]: 'Chain Runners'
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
    
    // Fetch trait statistics in parallel
    const [traitStats] = await Promise.all([
      // fetchTraitStats(contractAddress) // This line is removed
    ]);
    
    // Simple approach: generate random token ID and fetch that specific token
    const randomTokenId = Math.floor(Math.random() * totalSupply) + 1; // Token IDs are usually 1-based
    
    // Add cache busting parameter to ensure fresh results
    const cacheBuster = Date.now();
    
    // Fetch the specific token by ID
    const tokensResponse = await fetch(
      `${RESERVOIR_BASE_URL}/tokens/v7?tokens=${contractAddress}:${randomTokenId}&includeAttributes=true&_t=${cacheBuster}`
    );
    
    if (!tokensResponse.ok) {
      throw new Error(`Failed to fetch token: ${tokensResponse.status}`);
    }
    
    const tokensData = await tokensResponse.json();
    const tokens = tokensData.tokens || [];
    
    if (tokens.length === 0) {
      throw new Error('No token found with that ID');
    }
    
    const token = tokens[0];
    
    // Debug logging
    console.log(`Random token ID: ${randomTokenId}, fetched token: ${token.token?.tokenId}`);
    
    // Enhance traits with rarity information
    const enhancedTraits = (token.token?.attributes || []).map(trait => {
      const count = trait.tokenCount;
      const percentage = count && totalSupply ? ((count / totalSupply) * 100).toFixed(2) : '0.00';
      const floorPrice = trait.topBidValue;
      return {
        ...trait,
        rarity: {
          count,
          percentage,
          floorPrice
        }
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
