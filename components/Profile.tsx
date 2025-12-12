
import React from 'react';
import { PlayerStats } from '../types';
import { ArrowLeft, User, Trophy, TrendingUp, Activity, Briefcase, Zap, Heart, Target, Dumbbell, Globe, Flag } from 'lucide-react';
import { LIFESTYLE_ITEMS } from '../constants';

interface ProfileProps {
    player: PlayerStats;
    onBack: () => void;
}

const StatBar = ({ label, value, color, icon: Icon }: { label: string, value: number, color: string, icon: any }) => (
    <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2 text-slate-300">
                <Icon size={14} className={color} />
                <span className="text-xs font-bold uppercase">{label}</span>
            </div>
            <span className="text-sm font-bold text-white">{value}</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color.replace('text-', 'bg-').replace('-400', '-500') }} 
            ></div>
        </div>
    </div>
);

export const Profile: React.FC<ProfileProps> = ({ player, onBack }) => {
    const overallRating = Math.floor((player.attacking + player.technique + player.fitness) / 3);
    const marketValue = overallRating * 15000 * (1 + (player.clout / 100000));

    // Get owned gear items for display
    const ownedGear = LIFESTYLE_ITEMS.filter(item => item.type === 'GEAR' && player.inventory.includes(item.id));

    return (
        <div className="h-full flex flex-col bg-slate-900">
            {/* Header */}
             <div className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900 sticky top-0 z-10">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full text-slate-300">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h2 className="font-bold text-white">Player Profile</h2>
                    <p className="text-xs text-slate-400">Stats & Biography</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-20">
                {/* Player Identity Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl p-6 shadow-xl relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                        <User size={120} />
                    </div>
                    
                    <div className="relative z-10 flex gap-4 items-start">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 text-2xl font-black">
                            {overallRating}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold leading-none mb-1">{player.name}</h1>
                            <p className="text-indigo-200 font-medium">{player.position}</p>
                            <div className="flex flex-col gap-1 mt-2">
                                <p className="text-xs text-indigo-300 flex items-center gap-1">
                                    <Briefcase size={12} /> {player.team}
                                </p>
                                <p className="text-xs text-indigo-300 flex items-center gap-1">
                                    <Flag size={12} /> {player.nationality}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-indigo-300 opacity-80">Market Value</p>
                            <p className="text-lg font-black">${(marketValue / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-indigo-300 opacity-80">Fans</p>
                            <p className="text-lg font-black">{player.clout.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* International Stats */}
                <div className="bg-slate-800 rounded-xl border border-yellow-500/20 p-4 flex justify-between items-center relative overflow-hidden">
                     <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-yellow-500/10 to-transparent"></div>
                     <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center border border-yellow-500/40">
                             <Globe size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">International Duty</h4>
                            <p className="text-xs text-slate-400">{player.nationality}</p>
                        </div>
                     </div>
                     <div className="text-right relative z-10">
                         <div className="text-xl font-bold text-white">{player.caps} <span className="text-xs text-slate-500 font-normal">Caps</span></div>
                         <div className="text-sm font-bold text-green-400">{player.internationalGoals} <span className="text-xs text-slate-500 font-normal">Goals</span></div>
                     </div>
                </div>

                {/* Career Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Matches</p>
                        <p className="text-xl font-black text-white">{player.matchesPlayed}</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Goals</p>
                        <p className="text-xl font-black text-emerald-400">{player.goalsScored}</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Assists</p>
                        <p className="text-xl font-black text-blue-400">{player.assists}</p>
                    </div>
                </div>

                {/* Attributes Section */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Activity size={16} /> Attributes
                    </h3>
                    
                    <StatBar label="Attacking" value={player.attacking} color="text-red-400" icon={Target} />
                    <StatBar label="Technique" value={player.technique} color="text-blue-400" icon={Zap} />
                    <StatBar label="Fitness" value={player.fitness} color="text-orange-400" icon={Dumbbell} />
                    
                    <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 gap-6">
                        <div className="text-center">
                             <div className="text-xs text-slate-500 font-bold uppercase mb-2 flex items-center justify-center gap-1">
                                <TrendingUp size={12} /> Morale
                             </div>
                             <div className="relative h-2 bg-slate-800 rounded-full w-full max-w-[100px] mx-auto overflow-hidden">
                                 <div className="absolute top-0 left-0 bottom-0 bg-blue-500" style={{ width: `${player.morale}%`}}></div>
                             </div>
                             <p className="text-xs text-blue-400 font-bold mt-1">{player.morale}%</p>
                        </div>
                         <div className="text-center">
                             <div className="text-xs text-slate-500 font-bold uppercase mb-2 flex items-center justify-center gap-1">
                                <Heart size={12} /> Energy
                             </div>
                             <div className="relative h-2 bg-slate-800 rounded-full w-full max-w-[100px] mx-auto overflow-hidden">
                                 <div className="absolute top-0 left-0 bottom-0 bg-green-500" style={{ width: `${player.energy}%`}}></div>
                             </div>
                             <p className="text-xs text-green-400 font-bold mt-1">{player.energy}%</p>
                        </div>
                    </div>
                </div>

                {/* Gear / Perks */}
                {ownedGear.length > 0 && (
                     <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Trophy size={16} /> Active Perks
                        </h3>
                        <div className="space-y-3">
                            {ownedGear.map(gear => (
                                <div key={gear.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700/50">
                                    <div className={`w-8 h-8 rounded bg-slate-900 flex items-center justify-center ${gear.color}`}>
                                        <gear.icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{gear.name}</p>
                                        <p className="text-xs text-slate-500">{gear.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
