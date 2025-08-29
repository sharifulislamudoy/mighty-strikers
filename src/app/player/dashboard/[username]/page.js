'use client';

import { useState, useEffect, use } from 'react';
import PlayerDashboard from '@/components/PlayerDashboard';

export default function PlayerDashboardPage({ params }) {
  const [player, setPlayer] = useState(null);
  const [playerDetails, setPlayerDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unwrap the params promise with React.use()
  const unwrappedParams = use(params);
  const { username } = unwrappedParams;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch player data
        const playerResponse = await fetch(`/api/players/${username}`);
        if (!playerResponse.ok) {
          throw new Error('Player not found');
        }
        const playerData = await playerResponse.json();
        
        // Fetch player details
        const detailsResponse = await fetch(`/api/player-details/${username}`);
        const detailsData = await detailsResponse.json();
        
        setPlayer(playerData);
        setPlayerDetails(detailsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const handleSaveDetails = async (updatedDetails) => {
    try {
      const response = await fetch(`/api/player-details/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDetails),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save details');
      }
      
      return true;
    } catch (err) {
      console.error('Error saving details:', err);
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <PlayerDashboard 
      player={player} 
      playerDetails={playerDetails} 
      onSaveDetails={handleSaveDetails}
    />
  );
}