import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Trophy } from 'lucide-react';

const CortisMatch3Game = () => {
  const [level, setLevel] = useState(1);
  const [tiles, setTiles] = useState([]);
  const [slotBar, setSlotBar] = useState([]);
  const [gameState, setGameState] = useState('playing');
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [animatingTile, setAnimatingTile] = useState(null);
  const [matchingTiles, setMatchingTiles] = useState([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [hasShared, setHasShared] = useState(false);
  const [maxSlots, setMaxSlots] = useState(7);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareContext, setShareContext] = useState('game');
  const [isProcessingMatch, setIsProcessingMatch] = useState(false);
  const [hasCompletedLevel1, setHasCompletedLevel1] = useState(false); // 'game' or 'fail'

  // Audio elements - initialized once
  const backgroundMusic = React.useRef(null);
  const clickSound = React.useRef(null);
  const explodeSound = React.useRef(null);

  // Initialize audio on component mount
  useEffect(() => {
    backgroundMusic.current = new Audio('/sounds/background-music.mp3');
    backgroundMusic.current.loop = true;
    backgroundMusic.current.volume = 0.3;

    clickSound.current = new Audio('/sounds/tile-click.mp3');
    clickSound.current.volume = 0.5;

    explodeSound.current = new Audio('/sounds/tile-explode.mp3');
    explodeSound.current.volume = 0.6;

    // Auto-play music on load
    const playMusic = () => {
      if (backgroundMusic.current && !isMusicPlaying) {
        backgroundMusic.current.play()
          .then(() => setIsMusicPlaying(true))
          .catch(e => console.log('Auto-play prevented:', e));
      }
    };

    // Try to play immediately, or on first user interaction
    playMusic();
    document.addEventListener('click', playMusic, { once: true });

    return () => {
      if (backgroundMusic.current) {
        backgroundMusic.current.pause();
        backgroundMusic.current = null;
      }
    };
  }, []);

  const playSound = (soundRef) => {
    if (!isMusicPlaying || !soundRef.current) return; // Sound effects only play when music is on
    soundRef.current.currentTime = 0;
    soundRef.current.play().catch(e => console.log('Audio play failed:', e));
  };

  const toggleMusic = () => {
    if (!backgroundMusic.current) return;
    
    if (isMusicPlaying) {
      backgroundMusic.current.pause();
      setIsMusicPlaying(false);
    } else {
      backgroundMusic.current.play().catch(e => console.log('Music play failed:', e));
      setIsMusicPlaying(true);
    }
  };

  const shareUrl = 'https://cortis-match.vercel.app';
  const shareText = "I can't beat Cortis Match Level 2! 😤 Can you?";

  const handleShare = async (platform) => {
    if (platform === 'native') {
      // Web Share API (mobile)
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Cortis Match',
            text: shareText,
            url: shareUrl
          });
          onShareSuccess();
        } catch (err) {
          console.log('Share cancelled or failed');
          // Don't call onShareSuccess if user cancelled
        }
      }
    } else if (platform === 'copy') {
      // Copy link
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied! 📋');
        onShareSuccess();
      } catch (err) {
        console.log('Copy failed');
      }
    } else {
      // Platform-specific share - assume success when window opens
      const urls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
      };
      
      window.open(urls[platform], '_blank', 'width=600,height=400');
      // Grant reward immediately when share window opens
      onShareSuccess();
    }
  };

  const onShareSuccess = () => {
    if (!hasShared) {
      setHasShared(true);
      setMaxSlots(8);
      setShowShareDialog(false);
      
      // If sharing from failure screen, close the failure dialog and allow retry with extra slot
      if (shareContext === 'fail') {
        setGameState('playing');
      }
    } else {
      setShowShareDialog(false);
    }
  };

  const openShareDialog = (context) => {
    setShareContext(context);
    setShowShareDialog(true);
  };

  const tileTypes = {
    1: ['member1', 'member2', 'member3', 'member4', 'member5'],
    2: ['member1', 'member2', 'member3', 'member4', 'member5', 'member6', 'member7', 'member8', 'member9', 'member10']
  };

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
      { x: 250, y: 170, layer: 1 }
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
      { x: 330, y: 205, layer: 7 }
    ]
  };

  const generateTiles = (lvl) => {
    const types = tileTypes[lvl];
    const layout = layoutTemplates[lvl];
    
    let tileTypePool = [];
    const tilesNeeded = layout.length;
    
    if (lvl === 2) {
      const topLayerTiles = layout.filter(t => t.layer >= 6);
      
      const trapType1 = types[0];
      const trapType2 = types[1];
      
      tileTypePool.push(trapType1);
      tileTypePool.push(trapType2);
      
      const baitType1 = types[2];
      const baitType2 = types[3];
      
      tileTypePool.push(baitType1, baitType1, baitType1);
      
      const topLayerAssigned = 5;
      const remainingTiles = tilesNeeded - topLayerAssigned;
      
      tileTypePool.push(trapType1, trapType1);
      tileTypePool.push(trapType2, trapType2);
      
      tileTypePool.push(baitType2, baitType2, baitType2);
      
      const stillRemaining = remainingTiles - 9;
      const otherTypes = types.slice(4);
      const tilesPerOtherType = Math.floor(stillRemaining / otherTypes.length / 3) * 3;
      
      otherTypes.forEach(type => {
        for (let i = 0; i < tilesPerOtherType; i++) {
          tileTypePool.push(type);
        }
      });
      
      while (tileTypePool.length < tilesNeeded) {
        for (let i = 0; i < 3 && tileTypePool.length < tilesNeeded; i++) {
          tileTypePool.push(otherTypes[0]);
        }
      }
      
      const topLayerTileTypes = [trapType1, trapType2, baitType1, baitType1, baitType1];
      
      const remainingTilePool = tileTypePool.slice(5).sort(() => Math.random() - 0.5);
      
      const finalTilePool = [...topLayerTileTypes, ...remainingTilePool];
      
      const sortedLayout = [...layout].sort((a, b) => b.layer - a.layer);
      
      return sortedLayout.map((pos, idx) => ({
        id: idx,
        type: finalTilePool[idx],
        x: pos.x,
        y: pos.y,
        layer: pos.layer,
        zIndex: pos.layer * 100 + idx
      }));
      
    } else {
      const tilesPerType = Math.floor(tilesNeeded / types.length);
      
      types.forEach(type => {
        for (let i = 0; i < tilesPerType; i++) {
          tileTypePool.push(type);
        }
      });
      
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
    
    const handleResize = () => {
      setTiles([...tiles]);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [level]);

  const startNewGame = () => {
    const newTiles = generateTiles(level);
    setTiles(newTiles);
    setSlotBar([]);
    setGameState('playing');
    setAnimatingTile(null);
    setMatchingTiles([]);
    setHasShared(false);
    setMaxSlots(7);
    setIsProcessingMatch(false);
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

  const sortSlotBar = (bar) => {
    if (bar.length === 0) return bar;
    
    const lastTile = bar[bar.length - 1];
    const existingMatchCount = bar.slice(0, -1).filter(t => t.type === lastTile.type).length;
    
    if (existingMatchCount > 0) {
      const barWithoutLast = bar.slice(0, -1);
      const lastIndexOfType = barWithoutLast.map(t => t.type).lastIndexOf(lastTile.type);
      
      const newBar = [
        ...barWithoutLast.slice(0, lastIndexOfType + 1),
        lastTile,
        ...barWithoutLast.slice(lastIndexOfType + 1)
      ];
      return newBar;
    }
    
    return bar;
  };

  const handleTileClick = (tile) => {
    if (gameState !== 'playing') return;
    if (isTileCovered(tile, tiles)) return;

    // Play click sound
    playSound(clickSound);

    setSlotBar(currentSlotBar => {
      if (currentSlotBar.length >= 7) {
        return currentSlotBar;
      }
      return currentSlotBar;
    });

    setAnimatingTile(tile.id);

    setTimeout(() => {
      setTiles(currentTiles => currentTiles.filter(t => t.id !== tile.id));
      
      setSlotBar(currentSlotBar => {
        if (currentSlotBar.length >= maxSlots) return currentSlotBar;
        
        const newSlotBar = sortSlotBar([...currentSlotBar, tile]);
        const matches = findMatches(newSlotBar);
        
        if (matches.length > 0) {
          const matchingTilesList = newSlotBar.filter(t => matches.includes(t.type));
          setMatchingTiles(matchingTilesList.map(t => t.id));
          
          // Play explosion sound after short delay
          setTimeout(() => {
            playSound(explodeSound);
          }, 250);
          
          setTimeout(() => {
            setSlotBar(currentBar => {
              const updatedSlotBar = currentBar.filter(t => !matches.includes(t.type));
              
              setTiles(currentTiles => {
                if (currentTiles.length === 0 && updatedSlotBar.length === 0) {
                  setGameState('won');
                  if (level === 1) {
                    setHasCompletedLevel1(true);
                  }
                }
                return currentTiles;
              });
              
              return updatedSlotBar;
            });
            setMatchingTiles([]);
          }, 700);
        } else {
          if (newSlotBar.length >= maxSlots) {
            const hasNoMatches = findMatches(newSlotBar).length === 0;
            if (hasNoMatches) {
              setTimeout(() => {
                setGameState('lost');
              }, 100);
            }
          }
        }
        
        return newSlotBar;
      });
      
      setAnimatingTile(null);
    }, 200);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-50 to-purple-100 flex items-center justify-center overflow-hidden">
      <style>{`
        @keyframes slideToSlot {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.85); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bubbleExplode {
          0% { 
            transform: scale(1); 
            opacity: 1;
            filter: brightness(1);
          }
          30% { 
            transform: scale(1.4); 
            opacity: 1;
            filter: brightness(1.6);
            box-shadow: 0 0 25px rgba(255, 182, 193, 0.9), 0 0 45px rgba(219, 112, 147, 0.7);
          }
          60% { 
            transform: scale(1.6) rotate(15deg); 
            opacity: 0.5;
            filter: brightness(2.2);
          }
          100% { 
            transform: scale(0.2) rotate(25deg); 
            opacity: 0;
            filter: brightness(0);
          }
        }
        @keyframes matchPulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1;
            filter: brightness(1);
          }
          50% { 
            transform: scale(1.15); 
            opacity: 1;
            filter: brightness(1.3);
            box-shadow: 0 0 15px rgba(147, 51, 234, 0.6);
          }
        }
      `}</style>
      <div className="w-full max-w-2xl px-2 sm:px-4 py-4">
        <div className="text-center mb-3 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-pink-500" size={20} />
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-700">Cortis Match</h1>
            <Sparkles className="text-pink-500" size={20} />
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Level {level} • Match 3 to clear!</p>
        </div>

        {/* Audio Controls */}
        <div className="flex justify-center gap-2 mb-3">
          <button
            onClick={toggleMusic}
            className="bg-white rounded-full px-4 py-2 shadow-md text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
          >
            {isMusicPlaying ? '🔊 Music On' : '🔇 Music Off'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-3 sm:mb-4 relative overflow-hidden touch-none flex items-center justify-center" 
             style={{ 
               height: level === 1 ? 'min(400px, 60vh)' : 'min(540px, 70vh)',
               maxWidth: '100%'
             }}>
          {gameState === 'won' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg z-[10000]">
              <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-lg shadow-xl p-4 sm:p-6 text-center text-white max-w-sm mx-4">
                <Trophy className="mx-auto mb-3" size={48} />
                <h2 className="text-xl sm:text-2xl font-bold mb-2">You Won! 🎉</h2>
                <p className="mb-4 text-sm sm:text-base">Amazing! You cleared all the tiles!</p>
                <button
                  onClick={() => {
                    setGameState('playing');
                    setLevel(2);
                  }}
                  className="bg-white text-purple-600 px-4 sm:px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition text-sm sm:text-base"
                >
                  Next Level →
                </button>
              </div>
            </div>
          )}

          {gameState === 'lost' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg z-[10000]">
              <div className="bg-gradient-to-r from-red-400 to-pink-400 rounded-lg shadow-xl p-4 sm:p-6 text-center text-white max-w-sm mx-4">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Game Over 😢</h2>
                <p className="mb-4 text-sm sm:text-base">Slot bar is full! Try again?</p>
                
                {!hasShared && level === 2 && (
                  <button
                    onClick={() => openShareDialog('fail')}
                    className="w-full bg-yellow-400 text-gray-900 px-4 sm:px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition text-sm sm:text-base mb-3"
                  >
                    🎁 Share for Extra Slot & Retry
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setGameState('playing');
                    restartGame();
                  }}
                  className="w-full bg-white text-red-600 px-4 sm:px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition text-sm sm:text-base"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {showRestartConfirm && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg z-[10000]">
              <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 text-center max-w-sm mx-4">
                <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">Restart Game?</h2>
                <p className="mb-4 text-sm text-gray-600">All progress will be lost</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRestartConfirm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 sm:px-4 py-2 rounded-lg font-bold transition text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={restartGame}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg font-bold transition text-sm sm:text-base"
                  >
                    Restart
                  </button>
                </div>
              </div>
            </div>
          )}

          {showShareDialog && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg z-[10000]">
              <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 text-center max-w-sm mx-4 max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">
                  {shareContext === 'fail' ? '😤 Can Your Friends Beat It?' : '🎁 Share for Extra Slot!'}
                </h2>
                <p className="mb-4 text-sm text-gray-600">
                  {hasShared 
                    ? 'Share with more friends!' 
                    : 'Get +1 extra slot after sharing!'}
                </p>

                <div className="space-y-2 mb-4">
                  {navigator.share && (
                    <button
                      onClick={() => handleShare('native')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                    >
                      Share via Mobile Apps
                    </button>
                  )}

                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                  >
                    Share on X
                  </button>

                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    Share on Facebook
                  </button>

                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
                  >
                    Share on WhatsApp
                  </button>

                  <button
                    onClick={() => handleShare('reddit')}
                    className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
                  >
                    Share on Reddit
                  </button>

                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                  >
                    Copy Link
                  </button>
                </div>

                <button
                  onClick={() => setShowShareDialog(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="relative w-full h-full flex items-center justify-center">
            <div 
              className="relative"
              style={{
                width: level === 1 ? '350px' : '600px',
                height: level === 1 ? '350px' : '500px',
                transform: level === 1 
                  ? `scale(${Math.min(1, (window.innerWidth - 32) / 350, (window.innerHeight * 0.6 - 64) / 350)})` 
                  : `scale(${Math.min(0.9, (window.innerWidth - 32) / 600, (window.innerHeight * 0.7 - 64) / 500)})`,
                transformOrigin: level === 1 
                  ? 'center center' 
                  : window.innerWidth < 640 
                    ? '40% center'
                    : 'center center'
              }}
            >
            {tiles.map(tile => {
              const isAvailable = availableTiles.some(t => t.id === tile.id);
              const isAnimating = animatingTile === tile.id;
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
                    backgroundPosition: 'center',
                    animation: isAnimating ? 'slideToSlot 0.2s ease-out' : 'none'
                  }}
                  className={`
                    absolute w-16 h-16 rounded-lg flex items-center justify-center
                    font-bold overflow-hidden
                    bg-gradient-to-br from-blue-200 to-pink-200 shadow-lg
                    transition-all duration-200
                    ${isAvailable 
                      ? 'hover:scale-110 active:scale-95 cursor-pointer border-4 border-white' 
                      : 'cursor-not-allowed border-2 border-gray-400'}
                  `}
                >
                </button>
              );
            })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-2 sm:p-4 mb-3 sm:mb-4 relative overflow-hidden"
             style={{
               backgroundImage: 'url("/slot-background.png")',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat'
             }}>
          <div className="flex justify-center gap-1 sm:gap-2 min-h-[48px] sm:min-h-[60px] relative z-10">
            {[...Array(maxSlots)].map((_, idx) => {
              const slotTile = slotBar[idx];
              const imageUrl = slotTile ? imageFiles[slotTile.type] : null;
              const isMatching = slotTile && matchingTiles.includes(slotTile.id);
              
              return (
                <div
                  key={idx}
                  style={{
                    backgroundImage: imageUrl ? `url('${imageUrl}')` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    animation: isMatching 
                      ? 'matchPulse 0.25s ease-in-out, bubbleExplode 0.4s ease-out 0.25s forwards' 
                      : slotTile 
                      ? 'popIn 0.3s ease-out' 
                      : 'none'
                  }}
                  className={`
                    w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold overflow-hidden
                    transition-all duration-300
                    ${slotTile 
                      ? 'bg-gradient-to-br from-blue-200 to-pink-200 shadow-md' 
                      : 'bg-gray-100 border-2 border-dashed border-gray-300'}
                    ${idx >= maxSlots - 1 && !slotTile ? 'border-red-300' : ''}
                    ${idx === 7 && maxSlots === 8 ? 'ring-2 ring-yellow-400' : ''}
                  `}
                >
                </div>
              );
            })}
          </div>
        </div>

        {level === 2 && !hasShared && (
          <div className="flex justify-center mb-3">
            <button
              onClick={() => openShareDialog('game')}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg transition flex items-center gap-2 text-sm sm:text-base"
            >
              🎁 Share for +1 Slot
            </button>
          </div>
        )}

        <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-6">
          <button
            onClick={handleRestartClick}
            className="flex-1 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white py-2 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition text-sm sm:text-base"
          >
            <RotateCcw size={16} />
            Restart
          </button>
          {hasCompletedLevel1 && level === 1 && (
            <button
              onClick={() => setLevel(2)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-bold transition text-sm sm:text-base"
            >
              Level 2 →
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
          <h3 className="font-bold text-purple-700 mb-2">How to Play:</h3>
          <ul className="space-y-1">
            <li>• Tap uncovered tiles to move them to the slot bar</li>
            <li>• Match 3 identical tiles to eliminate them</li>
            <li>• Clear all tiles to win!</li>
            <li>• Don't let the slot bar fill up ({maxSlots} slots max)</li>
          </ul>
        </div>

        <div className="text-center mt-4 text-xs text-gray-500">
          <p>Music by AudioCoffee</p>
        </div>
      </div>
    </div>
  );
};

export default CortisMatch3Game;