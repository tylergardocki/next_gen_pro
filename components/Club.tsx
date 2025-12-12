
import React, { useState } from 'react';
import { PlayerStats, LeagueData } from '../types';
import { SQUAD_NAMES, LEAGUE_NAMES } from '../constants';
import { ArrowLeft, Shield, Users, Trophy } from 'lucide-react';

interface ClubProps {
    player: PlayerStats;
    leagues: LeagueData[];
    onBack: () => void;
}

export const Club: React.FC<ClubProps> = ({ player, leagues, onBack }) => {
    const [tab, setTab] = useState<'TABLE' | 'SQUAD'>('TABLE');

    // Find current league standings
    const currentLeague = leagues.find(l => l.id === player.leagueId);
    const sortedStandings = currentLeague ? [...currentLeague.teams].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.gd - a.gd;
    }) : [];

    const leagueName = currentLeague ? currentLeague.name : "Unknown League";

    return (
        <div className="h-full flex flex-col bg-slate-900">
             <div className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900 sticky top-0 z-10">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full text-slate-300">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h2 className="font-bold text-white">{player.team}</h2>
                    <p className="text-xs text-slate-400">{leagueName}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-2 gap-2 bg-slate-950/50">
                <button 
                    onClick={() => setTab('TABLE')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${tab === 'TABLE' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Trophy size={16} /> League Table
                </button>
                <button 
                     onClick={() => setTab('SQUAD')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${tab === 'SQUAD' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Users size={16} /> Squad
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {tab === 'TABLE' ? (
                    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-center w-8">#</th>
                                    <th className="px-2 py-3">Team</th>
                                    <th className="px-2 py-3 text-center">PL</th>
                                    <th className="px-2 py-3 text-center">GD</th>
                                    <th className="px-4 py-3 text-center font-bold text-white">PTS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedStandings.map((team, index) => {
                                    // Promotion / Relegation indicators
                                    let rowClass = "border-b border-slate-700/50 last:border-0";
                                    let statusIndicator = null;
                                    
                                    if (index < 2) { // Promotion zone
                                        statusIndicator = <div className="w-1 h-full absolute left-0 top-0 bg-green-500"></div>;
                                        rowClass += " bg-green-500/5";
                                    } else if (index >= 8) { // Relegation zone (bottom 2 of 10)
                                        statusIndicator = <div className="w-1 h-full absolute left-0 top-0 bg-red-500"></div>;
                                        rowClass += " bg-red-500/5";
                                    }

                                    return (
                                        <tr 
                                            key={team.name} 
                                            className={`${rowClass} relative ${team.name === player.team ? 'bg-indigo-500/20' : ''}`}
                                        >
                                            {statusIndicator}
                                            <td className="px-4 py-3 text-center font-mono text-slate-500">{index + 1}</td>
                                            <td className={`px-2 py-3 font-bold ${team.name === player.team ? 'text-indigo-300' : 'text-slate-300'}`}>
                                                {team.name} {team.name === player.team && '(You)'}
                                            </td>
                                            <td className="px-2 py-3 text-center text-slate-400">{team.played}</td>
                                            <td className="px-2 py-3 text-center text-slate-400">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                                            <td className="px-4 py-3 text-center font-black text-white">{team.points}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="p-2 text-xs text-center text-slate-500 bg-slate-900/50">
                            <span className="text-green-500">● Promotion</span> <span className="text-red-500 ml-2">● Relegation</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Player Card */}
                        <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30 flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white border-2 border-indigo-300">
                                {player.name.charAt(0)}
                             </div>
                             <div>
                                 <h4 className="font-bold text-white">{player.name}</h4>
                                 <p className="text-xs text-indigo-300">{player.position} (Star Player)</p>
                             </div>
                        </div>

                        {/* Teammates */}
                        {SQUAD_NAMES.map((name, idx) => (
                            <div key={idx} className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center gap-4 opacity-80">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                                    <Shield size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-300">{name}</h4>
                                    <p className="text-xs text-slate-500">First Team</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
