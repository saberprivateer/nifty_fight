import { getRarity } from "../constants/rarityConfig";
import { CHAIN_OPTIONS } from "../constants/chains";

const API_BASE_URL = 'https://api.reservoir.tools';
const API_KEY = import.meta.env.VITE_RESERVOIR_API_KEY;

// Function to fetch a random NFT from a specific collection
const fetchRandomNFT = async (collectionName) => {
  // Find the collection in CHAIN_OPTIONS
  const collection = CHAIN_OPTIONS.find(opt => opt.label === collectionName);
  if (!collection) {
    throw new Error(`Collection ${collectionName} not found`);
  }
  
  // Check if collection has a valid contract address
  if (!collection.contractAddress || collection.contractAddress === "N/A") {
    throw new Error(`No contract address available for ${collectionName}. This collection may not be supported yet.`);
  }
  
  const contractAddress = collection.contractAddress;
  
  try {
    // Get collection info to find total supply
    const collectionResponse = await fetch(
      `${API_BASE_URL}/collections/v5?contract=${contractAddress}`, {
        headers: {
          'x-api-key': API_KEY,
        },
      }
    );
    
    if (!collectionResponse.ok) {
      throw new Error(`Failed to get collection info: ${collectionResponse.status}`);
    }
    
    const collectionData = await collectionResponse.json();
    const collection = collectionData.collections?.[0];
    
    if (!collection) {
      throw new Error(`Collection not found for ${collectionName}`);
    }
    
    // Get total supply and generate random token ID
    const totalSupply = collection.tokenCount || 10000;
    const randomTokenId = Math.floor(Math.random() * totalSupply);
    
    // Fetch the random token by ID
    const tokensResponse = await fetch(
      `${API_BASE_URL}/tokens/v6?collection=${contractAddress}&token=${contractAddress}:${randomTokenId}`, {
        headers: {
          'x-api-key': API_KEY,
        },
      }
    );
    
    if (!tokensResponse.ok) {
      throw new Error(`Failed to get token: ${tokensResponse.status}`);
    }
    
    const tokensData = await tokensResponse.json();
    const token = tokensData.tokens?.[0];

    if (!token) {
      throw new Error(`No token found for ID ${randomTokenId}`);
    }

    return {
      id: token.token.tokenId,
      name: token.token.name || `#${token.token.tokenId}`,
      collection: token.token.collection.name,
      image: token.token.image,
      totalSupply: token.token.collection.tokenCount,
      traits: token.token.attributes?.map(attr => ({
        key: attr.key,
        value: attr.value,
        rarity: attr.floorAskPrice ? {
          percentage: (attr.floorAskPrice / token.market.floorAsk.price) * 100
        } : null,
      })) || [],
    };
  } catch (error) {
    console.error(`Error fetching random NFT for ${collectionName}:`, error);
    throw error;
  }
};

// Function to fetch a random NFT from selected collections
export const fetchRandomNFTs = async (lazyLionsCollection, chainRunnersCollection) => {
  try {
    const [lazyLionsNFT, chainRunnersNFT] = await Promise.all([
      fetchRandomNFT(lazyLionsCollection),
      fetchRandomNFT(chainRunnersCollection)
    ]);

    return {
      lazyLions: lazyLionsNFT,
      chainRunners: chainRunnersNFT,
    };
  } catch (error) {
    console.error('Error fetching random NFTs:', error);
    throw error;
  }
};
