# Nifty Fight - Random NFT Display

A React application that displays random NFTs from the Lazy Lions and Chain Runners collections side by side.

## Features

- 🦁 **Lazy Lions Collection**: Random NFTs from the Lazy Lions collection
- 🏃‍♂️ **Chain Runners Collection**: Random NFTs from the Chain Runners collection
- 🎲 **Randomize Button**: Fetch new random NFTs from both collections
- 🎨 **Clean UI**: Beautiful Tailwind CSS styling with cards, shadows, and gradients
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Loading States**: Smooth loading animations and error handling

## Collections

- **Lazy Lions**: `0x1a92f7381b9f03921564a437210bb9396471050c`
- **Chain Runners**: `0x97597002980134bea46250aa0510c9b90d87a587`

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Reservoir API** - NFT data source

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   └── NFTCard.jsx          # Individual NFT card component
├── services/
│   └── nftService.js        # API service for fetching NFTs
├── App.jsx                  # Main application component
├── main.jsx                 # React entry point
└── index.css                # Global styles with Tailwind
```

## API Integration

The app uses the Reservoir API to fetch NFT data:
- Fetches random NFTs from both collections
- Displays NFT images, names, and traits
- Handles loading states and errors gracefully

## Features in Detail

### NFT Cards
Each NFT card displays:
- High-quality NFT image
- NFT name and collection
- Traits/characteristics
- Token ID
- Loading and error states

### Randomize Functionality
- Fetches fresh random NFTs from both collections
- Shows loading animation during fetch
- Handles API errors gracefully
- Maintains responsive design

## Customization

You can easily modify the collections by updating the contract addresses in `src/services/nftService.js`:

```javascript
const COLLECTIONS = {
  LAZY_LIONS: '0x1a92f7381b9f03921564a437210bb9396471050c',
  CHAIN_RUNNERS: '0x97597002980134bea46250aa0510c9b90d87a587'
};
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.
