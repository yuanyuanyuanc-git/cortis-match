import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Trophy } from 'lucide-react';

const CortisMatch3Game = () => {
  const [level, setLevel] = useState(1);
  const [tiles, setTiles] = useState([]);
  const [slotBar, setSlotBar] = useState([]);
  const [gameState, setGameState] = useState('playing');
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  const tileTypes = {
    1: ['member1', 'member2', 'member3', 'member4', 'member5'],
    2: ['member1', 'member2', 'member3', 'member4', 'member5', 'member6', 'member7', 'member8', 'member9', 'member10']
  };

  // Updated: Use direct image paths for production
  const imageFiles = {
    member1: '/image-1.png',
    member2: '/image-2.png',
    member3: '/image-3.png',
    member4: '/image-4.png',
    member5: '/image-5.png',
    member6: '/image-6.png',
    member7: '/image-7.png',
    member8: '/image-8.png',
    member9: '/image-9.png',
    member10: '/image-10.png'
  };

  const layoutTemplates = {
    1: [
      { x: 50, y: 50, layer: 0 },
      { x: 130, y: 50, layer: 0 },
      { x: 210, y: 50, layer: 0 },
      { x: 50, y: 130, layer: 0 },
      { x: 130, y: 130, layer: 0 },
      { x: 210, y: 130, layer: 0 },
      { x: 50, y: 210, layer: 0 },
      { x: 130, y: 210, layer: 0 },
      { x: 210, y: 210, layer: 0 },
      { x: 90, y: 90, layer: 1 },
      { x: 170, y: 90, layer: 1 },
      { x: 250, y: 90, layer: 1 },
      { x: 90, y: 170, layer: 1 },
      { x: 170, y: 170, layer: 1 },
      { x: 250, y: 170, layer: 1 },
      { x: 130, y: 130, layer: 2 },
      { x: 210, y: 130, layer: 2 },
      { x: 170, y: 170, layer: 2 }
    ],
    2: [
      { x: 180, y: 30, layer: 0 },
      { x: 230, y: 30, layer: 0 },
      { x: 280, y: 30, layer: 0 },
      { x: 330, y: 30, layer: 0 },
      { x: 380, y: 30, layer: 0 },
      { x: 430, y: 30, layer: 0 },
      { x: 130, y: 80, layer: 0 },
      { x: 180, y: 80, layer: 0 },
      { x: 230, y: 80, layer: 0 },
      { x: 280, y: 80, layer: 0 },
      { x: 330, y: 80, layer: 0 },
      { x: 380, y: 80, layer: 0 },
      { x: 430, y: 80, layer: 0 },
      { x: 480, y: 80, layer: 0 },
      { x: 130, y: 130, layer: 0 },
      { x: 180, y: 130, layer: 0 },
      { x: 230, y: 130, layer: 0 },
      { x: 280, y: 130, layer: 0 },
      { x: 330, y: 130, layer: 0 },
      { x: 380, y: 130, layer: 0 },
      { x: 430, y: 130, layer: 0 },
      { x: 480, y: 130, layer: 0 },
      { x: 180, y: 180, layer: 0 },
      { x: 230, y: 180, layer: 0 },
      { x: 280, y: 180, layer: 0 },
      { x: 330, y: 180, layer: 0 },
      { x: 380, y: 180, layer: 0 },
      { x: 430, y: 180, layer: 0 },
      { x: 20, y: 400, layer: 0 },
      { x: 26, y: 400, layer: 0 },
      { x: 32, y: 400, layer: 0 },
      { x: 38, y: 400, layer: 0 },
      { x: 44, y: 400, layer: 0 },
      { x: 50, y: 400, layer: 0 },
      { x: 56, y: 400, layer: 0 },
      { x: 62, y: 400, layer: 0 },
      { x: 68, y: 400, layer: 0 },
      { x: 74, y: 400, layer: 0 },
      { x: 466, y: 400, layer: 0 },
      { x: 472, y: 400, layer: 0 },
      { x: 478, y: 400, layer: 0 },
      { x: 484, y: 400, layer: 0 },
      { x: 490, y: 400, layer: 0 },
      { x: 496, y: 400, layer: 0 },
      { x: 502, y: 400, layer: 0 },
      { x: 508, y: 400, layer: 0 },
      { x: 514, y: 400, layer: 0 },
      { x: 520, y: 400, layer: 0 },
      { x: 155, y: 55, layer: 1 },
      { x: 205, y: 55, layer: 1 },
      { x: 255, y: 55, layer: 1 },
      { x: 305, y: 55, layer: 1 },
      { x: 355, y: 55, layer: 1 },
      { x: 405, y: 55, layer: 1 },
      { x: 455, y: 55, layer: 1 },
      { x: 155, y: 105, layer: 1 },
      { x: 205, y: 105, layer: 1 },
      { x: 255, y: 105, layer: 1 },
      { x: 305, y: 105, layer: 1 },
      { x: 355, y: 105, layer: 1 },
      { x: 405, y: 105, layer: 1 },
      { x: 455, y: 105, layer: 1 },
      { x: 155, y: 155, layer: 1 },
      { x: 205, y: 155, layer: 1 },
      { x: 255, y: 155, layer: 1 },
      { x: 305, y: 155, layer: 1 },
      { x: 355, y: 155, layer: 1 },
      { x: 405, y: 155, layer: 1 },
      { x: 455, y: 155, layer: 1 },
      { x: 205, y: 205, layer: 1 },
      { x: 255, y: 205, layer: 1 },
      { x: 305, y: 205, layer: 1 },
      { x: 355, y: 205, layer: 1 },
      { x: 405, y: 205, layer: 1 },
      { x: 80, y: 400, layer: 1 },
      { x: 86, y: 400, layer: 1 },
      { x: 92, y: 400, layer: 1 },
      { x: 526, y: 400, layer: 1 },
      { x: 532, y: 400, layer: 1 },
      { x: 538, y: 400, layer: 1 },
      { x: 180, y: 80, layer: 2 },
      { x: 230, y: 80, layer: 2 },
      { x: 280, y: 80, layer: 2 },
      { x: 330, y: 80, layer: 2 },
      { x: 380, y: 80, layer: 2 },
      { x: 430, y: 80, layer: 2 },
      { x: 180, y: 130, layer: 2 },
      { x: 230, y: 130, layer: 2 },
      { x: 280, y: 130, layer: 2 },
      { x: 330, y: 130, layer: 2 },
      { x: 380, y: 130, layer: 2 },
      { x: 430, y: 130, layer: 2 },
      { x: 180, y: 180, layer: 2 },
      { x: 230, y: 180, layer: 2 },
      { x: 280, y: 180, layer: 2 },
      { x: 330, y: 180, layer: 2 },
      { x: 380, y: 180, layer: 2 },
      { x: 430, y: 180, layer: 2 },
      { x: 230, y: 230, layer: 2 },
      { x: 280, y: 230, layer: 2 },
      { x: 330, y: 230, layer: 2 },
      { x: 380, y: 230, layer: 2 },
      { x: 98, y: 400, layer: 2 },
      { x: 104, y: 400, layer: 2 },
      { x: 544, y: 400, layer: 2 },
      { x: 550, y: 400, layer: 2 },
      { x: 280, y: 280, layer: 2 },
      { x: 330, y: 280, layer: 2 },
      { x: 205, y: 105, layer: 3 },
      { x: 255, y: 105, layer: 3 },
      { x: 305, y: 105, layer: 3 },
      { x: 355, y: 105, layer: 3 },
      { x: 405, y: 105, layer: 3 },
      { x: 205, y: 155, layer: 3 },
      { x: 255, y: 155, layer: 3 },
      { x: 305, y: 155, layer: 3 },
      { x: 355, y: 155, layer: 3 },
      { x: 405, y: 155, layer: 3 },
      { x: 230, y: 205, layer: 3 },
      { x: 280, y: 205, layer: 3 },
      { x: 330, y: 205, layer: 3 },
      { x: 380, y: 205, layer: 3 },
      { x: 255, y: 255, layer: 3 },
      { x: 305, y: 255, layer: 3 },
      { x: 355, y: 255, layer: 3 },
      { x: 110, y: 400, layer: 3 },
      { x: 116, y: 400, layer: 3 },
      { x: 556, y: 400, layer: 3 },
      { x: 562, y: 400, layer: 3 },
      { x: 230, y: 130, layer: 4 },
      { x: 280, y: 130, layer: 4 },
      { x: 330, y: 130, layer: 4 },
      { x: 380, y: 130, layer: 4 },
      { x: 230, y: 180, layer: 4 },
      { x: 280, y: 180, layer: 4 },
      { x: 330, y: 180, layer: 4 },
      { x: 380, y: 180, layer: 4 },
      { x: 255, y: 230, layer: 4 },
      { x: 305, y: 230, layer: 4 },
      { x: 355, y: 230, layer: 4 },
      { x: 122, y: 400, layer: 4 },
      { x: 255, y: 155, layer: 5 },
      { x: 305, y: 155, layer: 5 },
      { x: 355, y: 155, layer: 5 },
      { x: 255, y: 205, layer: 5 },
      { x: 305, y: 205, layer: 5 },
      { x: 355, y: 205, layer: 5 },
      { x: 280, y: 255, layer: 5 },
      { x: 330, y: 255, layer: 5 },
      { x: 128, y: 400, layer: 5 },
      { x: 280, y: 180, layer: 6 },
      { x: 305, y: 230, layer: 6 },
      { x: 305, y: 280, layer: 6 },
      { x: 280, y: 205, layer: 7 },
      { x: 330, y: 205, layer: 7 },
      { x: 134, y: 400, layer: 7 }
    ]
  };

  const generateTiles = (lvl) => {
    const types = tileTypes[lvl];
    const layout = layoutTemplates[lvl];
    
    let tileTypePool = [];
    const tilesNeeded = layout.length;
    
    if (lvl === 2) {
      const topLayerTiles = layout.filter(t => t.layer >= 6);
      const baitType1 = types[0];
      const baitType2 = types[1];
      
      topLayerTiles.slice(0, 3).forEach(() => tileTypePool.push(baitType1));
      topLayerTiles.slice(3, 6).forEach(() => tileTypePool.push(baitType2));
      
      const remainingCount = tilesNeeded - 6;
      const baseSetsOfThree = Math.floor(remainingCount / (types.length * 3));
      
      types.forEach(type => {
        for (let i = 0; i < baseSetsOfThree * 3; i++) {
          tileTypePool.push(type);
        }
      });
      
      let remaining = tilesNeeded - tileTypePool.length;
      let typeIndex = 0;
      while (remaining >= 3) {
        for (let i = 0; i < 3; i++) {
          tileTypePool.push(types[typeIndex % types.length]);
        }
        typeIndex++;
        remaining -= 3;
      }
      
      while (tileTypePool.length < tilesNeeded) {
        for (let i = 0; i < 3 && tileTypePool.length < tilesNeeded; i++) {
          tileTypePool.push(types[0]);
        }
      }
      
      const nonBaitTiles = tileTypePool.slice(6).sort(() => Math.random() - 0.5);
      tileTypePool = [...tileTypePool.slice(0, 6), ...nonBaitTiles];
      
      const sortedLayout = [...layout].sort((a, b) => b.layer - a.layer);
      return sortedLayout.map((pos, idx) => ({
        id: idx,
        type: tileTypePool[idx],
        x: pos.x,
        y: pos.y,
        layer: pos.layer,
        zIndex: pos.layer * 100 + idx
      }));
    } else {
      const baseSetsOfThree = Math.floor(tilesNeeded / (types.length * 3));
      
      types.forEach(type => {
        for (let i = 0; i < baseSetsOfThree * 3; i++) {
          tileTypePool.push(type);
        }
      });
      
      let remaining = tilesNeeded - tileTypePool.length;
      let typeIndex = 0;
      while (remaining >= 3) {
        for (let i = 0; i < 3; i++) {
          tileTypePool.push(types[typeIndex % types.length]);
        }
        typeIndex++;
        remaining -= 3;
      }
      
      while (tileTypePool.length < tilesNeeded) {
        for (let i = 0; i < 3 && tileTypePool.length < tilesNeeded; i++) {
          tileTypePool.push(types[0]);
        }
      }
      
      tileTypePool = tileTypePool.sort(() => Math.random() - 0.5);
      
      return layout.map((pos, idx) => ({
        id: idx,
        type: tileTypePool[idx],
        x: pos.x,
        y: pos.y,
        layer: pos.layer,
        zIndex: pos.layer * 100 + idx
      }));
    }
  };

  useEffect(() => {
    startNewGame();
  }, [level]);

  const startNewGame = () => {
    const newTiles = generateTiles(level);
    setTiles(newTiles);
    setSlotBar([]);
    setGameState('playing');
  };

  const isTileCovered = (tile, allTiles) => {
    const tileSize = 64;
    
    return allTiles.some(other => {
      if (other.id === tile.id) return false;
      if (other.layer <= tile.layer) return false;
      
      const tile1Left = tile.x;
      const tile1Right = tile.x + tileSize;
      const tile1Top = tile.y;
      const tile1Bottom = tile.y + tileSize;
      
      const tile2Left = other.x;
      const tile2Right = other.x + tileSize;
      const tile2Top = other.y;
      const tile2Bottom = other.y + tileSize;
      
      const overlapsHorizontally = tile1Right > tile2Left && tile1Left < tile2Right;
      const overlapsVertically = tile1Bottom > tile2Top && tile1Top < tile2Bottom;
      
      return overlapsHorizontally && overlapsVertically;
    });
  };

  const handleTileClick = (tile) => {
    if (gameState !== 'playing') return;
    if (slotBar.length >= 7) return;
    if (isTileCovered(tile, tiles)) return;

    const newSlotBar = [...slotBar, tile];
    const newTiles = tiles.filter(t => t.id !== tile.id);
    setTiles(newTiles);

    const matches = findMatches(newSlotBar);
    
    if (matches.length > 0) {
      const updatedSlotBar = newSlotBar.filter(t => !matches.includes(t.type));
      setSlotBar(updatedSlotBar);
      
      if (newTiles.length === 0 && updatedSlotBar.length === 0) {
        setGameState('won');
      }
    } else {
      setSlotBar(newSlotBar);
      
      if (newSlotBar.length >= 7) {
        setGameState('lost');
      }
    }
  };

  const findMatches = (bar) => {
    const typeCounts = {};
    bar.forEach(tile => {
      typeCounts[tile.type] = (typeCounts[tile.type] || 0) + 1;
    });
    
    return Object.keys(typeCounts).filter(type => typeCounts[type] >= 3);
  };

  const restartGame = () => {
    setShowRestartConfirm(false);
    startNewGame();
  };
  
  const handleRestartClick = () => {
    setShowRestartConfirm(true);
  };

  const availableTiles = tiles.filter(tile => !isTileCovered(tile, tiles));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-50 to-purple-100 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-pink-500" size={24} />
            <h1 className="text-3xl font-bold text-purple-700">Cortis Match</h1>
            <Sparkles className="text-pink-500" size={24} />
          </div>
          <p className="text-sm text-gray-600">Level {level} • Match 3 to clear!</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-4 relative overflow-hidden" style={{ height: level === 1 ? '400px' : '540px' }}>
          {gameState === 'won' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg" style={{ zIndex: 10000 }}>
              <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-lg shadow-xl p-6 text-center text-white max-w-sm mx-4">
                <Trophy className="mx-auto mb-3" size={48} />
                <h2 className="text-2xl font-bold mb-2">You Won! 🎉</h2>
                <p className="mb-4">Amazing! You cleared all the tiles!</p>
                <button
                  onClick={() => {
                    setGameState('playing');
                    setLevel(2);
                  }}
                  className="bg-white text-purple-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition"
                >
                  Next Level →
                </button>
              </div>
            </div>
          )}

          {gameState === 'lost' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg" style={{ zIndex: 10000 }}>
              <div className="bg-gradient-to-r from-red-400 to-pink-400 rounded-lg shadow-xl p-6 text-center text-white max-w-sm mx-4">
                <h2 className="text-2xl font-bold mb-2">Game Over 😢</h2>
                <p className="mb-4">Slot bar is full! Try again?</p>
                <button
                  onClick={() => {
                    setGameState('playing');
                    restartGame();
                  }}
                  className="bg-white text-red-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {showRestartConfirm && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg" style={{ zIndex: 10000 }}>
              <div className="bg-white rounded-lg shadow-xl p-6 text-center max-w-sm mx-4">
                <h2 className="text-xl font-bold mb-2 text-gray-800">Restart Game?</h2>
                <p className="mb-4 text-gray-600">All progress will be lost</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRestartConfirm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={restartGame}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-bold transition"
                  >
                    Restart
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="relative w-full h-full">
            {tiles.map(tile => {
              const isAvailable = availableTiles.some(t => t.id === tile.id);
              const imageUrl = imageFiles[tile.type];
              
              return (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile)}
                  disabled={!isAvailable || gameState !== 'playing'}
                  style={{
                    left: `${tile.x}px`,
                    top: `${tile.y}px`,
                    zIndex: isAvailable ? tile.zIndex + 1000 : tile.zIndex,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)',
                    backgroundImage: `url('${imageUrl}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  className={`
                    absolute w-16 h-16 rounded-lg flex items-center justify-center
                    transition-all duration-200 font-bold overflow-hidden
                    bg-gradient-to-br from-blue-200 to-pink-200 shadow-lg
                    ${isAvailable 
                      ? 'hover:scale-110 cursor-pointer border-4 border-white' 
                      : 'cursor-not-allowed border-2 border-gray-400'}
                  `}
                >
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex justify-center gap-2 min-h-[60px]">
            {[...Array(7)].map((_, idx) => {
              const slotTile = slotBar[idx];
              const imageUrl = slotTile ? imageFiles[slotTile.type] : null;
              
              return (
                <div
                  key={idx}
                  className={`
                    w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold overflow-hidden
                    ${slotTile 
                      ? 'bg-gradient-to-br from-blue-200 to-pink-200 shadow-md' 
                      : 'bg-gray-100 border-2 border-dashed border-gray-300'}
                    ${idx >= 6 && !slotTile ? 'border-red-300' : ''}
                  `}
                  style={imageUrl ? {
                    backgroundImage: `url('${imageUrl}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : {}}
                >
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRestartClick}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
          >
            <RotateCcw size={20} />
            Restart
          </button>
          <button
            onClick={() => setLevel(level === 1 ? 2 : 1)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition"
          >
            Level {level === 1 ? 2 : 1}
          </button>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-4 text-sm text-gray-600">
          <h3 className="font-bold text-purple-700 mb-2">How to Play:</h3>
          <ul className="space-y-1">
            <li>• Tap uncovered tiles to move them to the slot bar</li>
            <li>• Match 3 identical tiles to eliminate them</li>
            <li>• Clear all tiles to win!</li>
            <li>• Don't let the slot bar fill up (7 slots max)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CortisMatch3Game;