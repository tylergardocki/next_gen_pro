
import React from 'react';
import { PlayerStats } from '../types';
import { ArrowLeft, DollarSign, TrendingUp, Heart, Wallet } from 'lucide-react';

interface BankProps {
    player: PlayerStats;
    onTransaction: (amount: number, moraleImpact: number) => void;
    onBack: () => void;
}

export const Bank: React.FC<BankProps> = ({ player, onTransaction, onBack }) => {
    
    return (
        <div className="h-full flex flex-col bg-slate-900">
             <div className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900 sticky top-0 z-10">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full text-slate-300">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h2 className="font-bold text-white">First National Bank</h2>
                    <p className="text-xs text-slate-400">Secure Personal Finance</p>
                </div>
            </div>

            <div className="p-6 space-y-8 overflow-y-auto">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Wallet size={120} />
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Total Balance</p>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        ${player.cash.toLocaleString()}
                    </h1>
                    <div className="mt-4 flex items-center gap-2 text-xs text-green-400 bg-green-900/20 w-fit px-2 py-1 rounded-md border border-green-900/50">
                        <TrendingUp size={14} />
                        <span>High Interest Savings Active</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Financial Services</h3>
                    
                    {/* Cheat Button */}
                    <button 
                        onClick={() => {
                             if(confirm("Apply for 'Future Star' Grant? (+$1,000,000)")) {
                                 onTransaction(1000000, 0);
                             }
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 flex items-center gap-4 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <DollarSign size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <h4 className="font-bold text-white">Sponsorship Advance</h4>
                            <p className="text-xs text-slate-400">Receive an immediate cash injection.</p>
                        </div>
                    </button>

                    <button 
                         onClick={() => {
                            if (player.cash >= 1000) {
                                onTransaction(-1000, 10);
                            } else {
                                alert("Insufficient funds!");
                            }
                         }}
                        className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 flex items-center gap-4 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                            <Heart size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <h4 className="font-bold text-white">Donate to Charity</h4>
                            <p className="text-xs text-slate-400">Give $1,000 to local youth football. (+Morale)</p>
                        </div>
                    </button>
                </div>

                <div className="p-4 rounded-xl bg-blue-900/10 border border-blue-500/20 text-xs text-blue-300">
                    <p><strong>Tip:</strong> Keep your morale high by giving back to the community, or invest in better lifestyle items to improve your performance recovery.</p>
                </div>
            </div>
        </div>
    );
};
