
import React, { useState } from 'react';
import { PlayerStats } from '../types';
import { LIFESTYLE_ITEMS } from '../constants';
import { ArrowLeft, Check, Lock } from 'lucide-react';

interface LifestyleProps {
    player: PlayerStats;
    onBuy: (item: typeof LIFESTYLE_ITEMS[0]) => void;
    onBack: () => void;
}

const formatCash = (amount: number) => {
    if (amount >= 1000000000) {
        return (amount / 1000000000).toFixed(1) + 'B';
    }
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M';
    }
    return amount.toLocaleString();
};

export const Lifestyle: React.FC<LifestyleProps> = ({ player, onBuy, onBack }) => {
    const [filter, setFilter] = useState<'ALL' | 'CONSUMABLE' | 'GEAR' | 'ASSET'>('ALL');

    const filteredItems = LIFESTYLE_ITEMS.filter(item => filter === 'ALL' || item.type === filter);

    return (
        <div className="h-full flex flex-col bg-slate-900">
             <div className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900 sticky top-0 z-10">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full text-slate-300 flex-shrink-0">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1 flex justify-between items-center overflow-hidden">
                    <div className="min-w-0 pr-2">
                        <h2 className="font-bold text-white truncate">Lifestyle Shop</h2>
                        <p className="text-xs text-slate-400 truncate">Spend your hard earned cash</p>
                    </div>
                    <div className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 flex-shrink-0">
                         <span className="text-yellow-400 font-bold text-sm">${formatCash(player.cash)}</span>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex p-2 gap-2 overflow-x-auto no-scrollbar">
                {['ALL', 'CONSUMABLE', 'GEAR', 'ASSET'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-white text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="p-4 grid gap-4 overflow-y-auto pb-20">
                {filteredItems.map((item) => {
                    const isOwned = player.inventory.includes(item.id);
                    const canAfford = player.cash >= item.cost;
                    const isDisabled = (item.type !== 'CONSUMABLE' && isOwned) || (!isOwned && !canAfford);

                    return (
                        <button 
                            key={item.id}
                            disabled={isDisabled}
                            onClick={() => onBuy(item)}
                            className={`flex flex-col p-4 rounded-xl border transition-all text-left relative overflow-hidden ${
                                isOwned && item.type !== 'CONSUMABLE' 
                                ? 'bg-slate-800/30 border-slate-800 opacity-60' 
                                : isDisabled 
                                    ? 'bg-slate-900 border-slate-800 opacity-50' 
                                    : 'bg-slate-800 border-slate-700 hover:border-slate-500 active:scale-95'
                            }`}
                        >
                            <div className="flex items-start w-full">
                                <div className={`w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center ${item.color} mr-4 flex-shrink-0 border border-slate-800`}>
                                    <item.icon size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-white truncate pr-2">{item.name}</h3>
                                        {isOwned && item.type !== 'CONSUMABLE' ? (
                                            <span className="text-green-500 flex items-center text-xs font-bold bg-green-900/20 px-2 py-0.5 rounded"><Check size={12} className="mr-1"/> OWNED</span>
                                        ) : (
                                            <span className={`font-bold ${canAfford ? 'text-white' : 'text-red-400'}`}>${item.cost.toLocaleString()}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                                    
                                    {/* Stat Badges */}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {item.effects.energy !== 0 && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.effects.energy > 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{item.effects.energy > 0 ? '+' : ''}{item.effects.energy} NRG</span>}
                                        {item.effects.morale !== 0 && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.effects.morale > 0 ? 'bg-blue-900/30 text-blue-400' : 'bg-red-900/30 text-red-400'}`}>{item.effects.morale > 0 ? '+' : ''}{item.effects.morale} MOR</span>}
                                        {item.effects.attacking !== 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-900/30 text-red-400">+{item.effects.attacking} ATK</span>}
                                        {item.effects.technique !== 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-900/30 text-indigo-400">+{item.effects.technique} TEC</span>}
                                        {item.effects.fitness !== 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-900/30 text-orange-400">+{item.effects.fitness} FIT</span>}
                                        {item.effects.clout !== 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-900/30 text-purple-400">+{item.effects.clout.toLocaleString()} FANS</span>}
                                    </div>
                                </div>
                            </div>
                            {!isOwned && !canAfford && (
                                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center backdrop-blur-[1px]">
                                    <Lock className="text-slate-500" />
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};
