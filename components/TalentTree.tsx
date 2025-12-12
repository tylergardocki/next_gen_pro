
import React from 'react';
import { PlayerStats } from '../types';
import { ArrowLeft, Lock, Check } from 'lucide-react';
import { TALENTS } from '../constants';

interface TalentTreeProps {
    player: PlayerStats;
    onUnlock: (talentId: string) => void;
    onBack: () => void;
}

export const TalentTree: React.FC<TalentTreeProps> = ({ player, onUnlock, onBack }) => {
    return (
        <div className="h-full flex flex-col bg-slate-900">
             <div className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900 sticky top-0 z-10">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full text-slate-300">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h2 className="font-bold text-white">Talent Tree</h2>
                    <p className="text-xs text-slate-400">Available Points: <span className="text-yellow-400 font-bold">{player.talentPoints}</span></p>
                </div>
            </div>

            <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                    {TALENTS.map((talent) => {
                        const isUnlocked = player.talents.includes(talent.id);
                        const canUnlock = !isUnlocked && player.talentPoints > 0;

                        return (
                            <button 
                                key={talent.id}
                                disabled={!canUnlock && !isUnlocked}
                                onClick={() => !isUnlocked && onUnlock(talent.id)}
                                className={`flex items-start p-4 rounded-xl border text-left transition-all ${
                                    isUnlocked 
                                        ? 'bg-slate-800 border-green-500/50 opacity-100' 
                                        : canUnlock 
                                            ? 'bg-slate-900 border-slate-700 hover:border-yellow-400 cursor-pointer' 
                                            : 'bg-slate-950 border-slate-800 opacity-60 cursor-not-allowed'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 ${isUnlocked ? talent.bg : 'bg-slate-800'}`}>
                                    <talent.icon size={24} className={isUnlocked ? 'text-white' : talent.color} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-slate-300'}`}>{talent.name}</h3>
                                        {isUnlocked ? (
                                            <Check size={16} className="text-green-500" />
                                        ) : (
                                            canUnlock ? <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded uppercase font-bold">Unlock</span> : <Lock size={14} className="text-slate-600" />
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500">{talent.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
                
                {player.talentPoints === 0 && (
                    <div className="mt-8 text-center text-xs text-slate-500">
                        Play more matches to earn Talent Points (1 Point every 5 games).
                    </div>
                )}
            </div>
        </div>
    );
};
