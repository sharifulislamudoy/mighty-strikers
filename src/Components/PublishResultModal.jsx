'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const PublishResultModal = ({ isOpen, onClose, onPublishResult, match }) => {
  const [team1Runs, setTeam1Runs] = useState('');
  const [team1Wickets, setTeam1Wickets] = useState('');
  const [team1Overs, setTeam1Overs] = useState('');
  const [team2Runs, setTeam2Runs] = useState('');
  const [team2Wickets, setTeam2Wickets] = useState('');
  const [team2Overs, setTeam2Overs] = useState('');
  const [firstBattingTeam, setFirstBattingTeam] = useState('team1');
  const [winner, setWinner] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !match) return null;

  const team1Name = match.team1?.name || 'Our Team';
  const team2Name = match.team2?.name || 'Opponent';

  const handleSave = async () => {
    setIsSaving(true);

    // Validate inputs
    if (!winner) {
      toast.error('Please select a winner or tie');
      setIsSaving(false);
      return;
    }
    if (
      team1Runs === '' ||
      team1Wickets === '' ||
      team1Overs === '' ||
      team2Runs === '' ||
      team2Wickets === '' ||
      team2Overs === ''
    ) {
      toast.error('Please fill in all score fields');
      setIsSaving(false);
      return;
    }

    try {
      let resultMessage = '';

      // Calculate result based on batting order and winner
      if (firstBattingTeam === 'team1') {
        if (winner === 'team1') {
          // Team1 batted first, set target, and won
          const runDifference = parseInt(team1Runs) - parseInt(team2Runs);
          resultMessage = `${team1Name} won by ${runDifference} runs`;
        } else if (winner === 'team2') {
          // Team1 batted first, set target, but Team2 chased and won
          const wicketsRemaining = 10 - parseInt(team2Wickets);
          resultMessage = `${team2Name} won by ${wicketsRemaining} wickets`;
        } else if (winner === 'tie') {
          resultMessage = 'Match tied';
        }
      } else if (firstBattingTeam === 'team2') {
        if (winner === 'team1') {
          // Team2 batted first, set target, but Team1 chased and won
          const wicketsRemaining = 10 - parseInt(team1Wickets);
          resultMessage = `${team1Name} won by ${wicketsRemaining} wickets`;
        } else if (winner === 'team2') {
          // Team2 batted first, set target, and won
          const runDifference = parseInt(team2Runs) - parseInt(team1Runs);
          resultMessage = `${team2Name} won by ${runDifference} runs`;
        } else if (winner === 'tie') {
          resultMessage = 'Match tied';
        }
      }

      // Prepare data to send to backend
      const resultData = {
        matchId: match._id,
        team1: {
          name: team1Name,
          runs: parseInt(team1Runs),
          wickets: parseInt(team1Wickets),
          overs: parseFloat(team1Overs),
          score: `${team1Runs}/${team1Wickets}`, // Format score as runs/wickets
          result: winner === 'team1' ? 'won' : winner === 'team2' ? 'lost' : 'tie',
        },
        team2: {
          name: team2Name,
          runs: parseInt(team2Runs),
          wickets: parseInt(team2Wickets),
          overs: parseFloat(team2Overs),
          score: `${team2Runs}/${team2Wickets}`, // Format score as runs/wickets
          result: winner === 'team2' ? 'won' : winner === 'team1' ? 'lost' : 'tie',
        },
        firstBattingTeam,
        result: resultMessage,
        status: 'completed',
      };

      // Call parent handler to save
      await onPublishResult(resultData);
      toast.success('Result published successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to publish result');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Publish Match Result</h3>

        {/* Batting/Bowling Order */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Who batted first?</label>
          <select
            value={firstBattingTeam}
            onChange={(e) => setFirstBattingTeam(e.target.value)}
            className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a]"
          >
            <option value="team1">{team1Name}</option>
            <option value="team2">{team2Name}</option>
          </select>
        </div>

        {/* Winner Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Match Result</label>
          <select
            value={winner}
            onChange={(e) => setWinner(e.target.value)}
            className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a]"
          >
            <option value="" disabled>
              Select result
            </option>
            <option value="team1">{team1Name} won</option>
            <option value="team2">{team2Name} won</option>
            <option value="tie">Match tied</option>
          </select>
        </div>

        {/* Team 1 Inputs */}
        <div className="mb-4">
          <h4 className="font-medium">{team1Name}</h4>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              placeholder="Runs (e.g., 150)"
              value={team1Runs}
              onChange={(e) => setTeam1Runs(e.target.value)}
              className="bg-[#2a2a2a] p-2 rounded border border-[#3a3a3a] text-white"
              min="0"
            />
            <input
              type="number"
              placeholder="Wickets (0-10)"
              value={team1Wickets}
              onChange={(e) => setTeam1Wickets(e.target.value)}
              className="bg-[#2a2a2a] p-2 rounded border border-[#3a3a3a] text-white"
              min="0"
              max="10"
            />
            <input
              type="number"
              placeholder="Overs (e.g., 20.0)"
              value={team1Overs}
              onChange={(e) => setTeam1Overs(e.target.value)}
              className="bg-[#2a2a2a] p-2 rounded border border-[#3a3a3a] text-white"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        {/* Team 2 Inputs */}
        <div className="mb-4">
          <h4 className="font-medium">{team2Name}</h4>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              placeholder="Runs (e.g., 150)"
              value={team2Runs}
              onChange={(e) => setTeam2Runs(e.target.value)}
              className="bg-[#2a2a2a] p-2 rounded border border-[#3a3a3a] text-white"
              min="0"
            />
            <input
              type="number"
              placeholder="Wickets (0-10)"
              value={team2Wickets}
              onChange={(e) => setTeam2Wickets(e.target.value)}
              className="bg-[#2a2a2a] p-2 rounded border border-[#3a3a3a] text-white"
              min="0"
              max="10"
            />
            <input
              type="number"
              placeholder="Overs (e.g., 20.0)"
              value={team2Overs}
              onChange={(e) => setTeam2Overs(e.target.value)}
              className="bg-[#2a2a2a] p-2 rounded border border-[#3a3a3a] text-white"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="flex space-x-4 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-600"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Result'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PublishResultModal;