// app/player/[username]/page.js
'use client';

import { useState, useEffect } from 'react';
import PlayerDashboard from '@/Components/PlayerDashboard';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function PlayerDashboardPage() {
  const [player, setPlayer] = useState(null);
  const [playerDetails, setPlayerDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const username = params.username;

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth-form");
      return;
    }
    if (session.user.username !== username) {
      router.push("/unauthorized");
    }
  }, [status, session, username, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const playerResponse = await fetch(`/api/players/${username}`);
        if (!playerResponse.ok) throw new Error('Player not found');
        const playerData = await playerResponse.json();

        const detailsResponse = await fetch(`/api/player-details/${username}`);
        if (!detailsResponse.ok) throw new Error('Failed to fetch player details');
        const detailsData = await detailsResponse.json();

        setPlayer(playerData);
        setPlayerDetails(detailsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) fetchData();
  }, [username]);

  const handleSaveDetails = async (updatedDetails) => {
    try {
      console.log('Saving details:', updatedDetails);

      const response = await fetch(`/api/player-details/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDetails),
      });

      console.log('Response status:', response.status);

      const result = await response.json();
      console.log('Response result:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to save details');
      }

      return true;
    } catch (err) {
      console.error('Error saving details:', err);
      alert('Error: ' + err.message);
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
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-yellow-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Player Not Found</h1>
          <p className="text-gray-400">The player "{username}" could not be found.</p>
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