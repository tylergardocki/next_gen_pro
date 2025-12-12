
import React, { useState, useMemo } from 'react';
import { PlayerStats } from '../types';
import { ArrowLeft, Briefcase, RefreshCw, XCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { ALL_CLUBS } from '../constants';

interface AgentProps {
    player: PlayerStats;
    onTransfer: (newTeam: string, newWage: number) => void;
    onBack: () => void;
}

export const Agent: React.FC<AgentProps> = ({ player, onTransfer, onBack }) => {
    const [negotiatingOffer, setNegotiatingOffer] = useState<{ team: string, wage: number } | null>(null);
    const [negotiationStatus, setNegotiationStatus] = useState<'IDLE' | 'SUCCESS' | 'FAILED'>('IDLE');
    
    // Calculate derived stats
    const overallRating = Math.floor((player.attacking + player.technique + player.fitness) / 3);
    const marketValue = overallRating * 15000 * (1 + (player.clout / 100000));
    
    // Generate Random Offers
    const offers = useMemo(() => {
        const potentialTeams = ALL_CLUBS.filter(t => t !== player.team);
        const numOffers = 2;
        const generated = [];
        for(let i=0; i<numOffers; i++) {
            const team = potentialTeams[Math.floor(Math.random() * potentialTeams.length)];
            const wageOffer = Math.floor(player.wage * (1.1 + (Math.random() * 0.5)));
            generated.push({ team, wage: wageOffer });
        }
        return generated;
    }, [player.team, player.wage]);

    const handleNegotiate = (percentIncrease: number) => {
        if (!negotiatingOffer) return;
        
        // Simple success check based on Clout and Morale
        const difficulty = percentIncrease * 2; // Harder to ask for more
        const successChance = 0.5 + (player.clout / 100000) + (player.morale / 200) - (difficulty / 100);
        
        if (Math.random() < successChance) {
            setNegotiatingOffer({ ...negotiatingOffer, wage: Math.floor(negotiatingOffer.wage * (1 + percentIncrease/100)) });
            setNegotiationStatus('SUCCESS');
        } else {
            setNegotiationStatus('FAILED');
            setTimeout(() => {
                setNegotiatingOffer(null);
                setNegotiationStatus('IDLE');
            }, 1500);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-900 relative">
             <div className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900 sticky top-0 z-10">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full text-slate-300">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h2 className="font-bold text-white">Your Agent</h2>
                    <p className="text-xs text-slate-400">Manage Career & Transfers</p>
                </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
                {/* Player Value Card */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Briefcase size={100} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div>
                            <p className="text-xs text-indigo-300 uppercase font-bold mb-1">Market Value</p>
                            <h2 className="text-2xl font-black text-white">${(marketValue / 1000000).toFixed(1)}M</h2>
                        </div>
                         <div>
                            <p className="text-xs text-indigo-300 uppercase font-bold mb-1">Current Wage</p>
                            <h2 className="text-2xl font-black text-emerald-400">${player.wage}<span className="text-sm font-normal text-slate-400">/game</span></h2>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-300">Contract Status</span>
                            <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded">ACTIVE</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Signed with {player.team}</p>
                    </div>
                </div>

                {/* Transfer Market */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <RefreshCw size={14} /> Transfer Offers
                    </h3>

                    <div className="space-y-3">
                        {offers.map((offer, idx) => (
                            <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-white text-lg">{offer.team}</h4>
                                    <span className="text-emerald-400 font-bold bg-emerald-950/30 px-2 py-1 rounded text-xs border border-emerald-500/20">
                                        +{(offer.wage - player.wage) > 0 ? (offer.wage - player.wage) : 0} increase
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-sm text-slate-400">
                                        Offering Wage: <span className="text-white font-bold">${offer.wage}</span>/game
                                    </div>
                                    <button 
                                        onClick={() => setNegotiatingOffer(offer)}
                                        className="px-4 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 active:scale-95 transition-all text-sm flex items-center gap-2"
                                    >
                                        View Offer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Negotiation Modal */}
            {negotiatingOffer && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm z-50 p-6 flex items-center justify-center animate-fade-in">
                    <div className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                         {negotiationStatus === 'FAILED' ? (
                             <div className="text-center py-8">
                                 <XCircle size={48} className="text-red-500 mx-auto mb-4" />
                                 <h2 className="text-xl font-bold text-white">Offer Withdrawn!</h2>
                                 <p className="text-slate-400">The club was offended by your demands.</p>
                             </div>
                         ) : (
                             <>
                                <h2 className="text-xl font-bold text-white mb-1">Contract Negotiation</h2>
                                <p className="text-slate-400 text-sm mb-6">Negotiating with <span className="text-white">{negotiatingOffer.team}</span></p>
                                
                                <div className="bg-slate-800 p-4 rounded-xl mb-6">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Wage Offer</p>
                                    <p className="text-3xl font-black text-emerald-400">${negotiatingOffer.wage}</p>
                                    {negotiationStatus === 'SUCCESS' && <span className="text-xs text-green-500 font-bold flex items-center gap-1 mt-1"><CheckCircle2 size={12}/> Offer Improved!</span>}
                                </div>

                                <div className="space-y-3">
                                    <button 
                                        onClick={() => onTransfer(negotiatingOffer.team, negotiatingOffer.wage)}
                                        className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
                                    >
                                        Accept Offer
                                    </button>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => handleNegotiate(10)}
                                            disabled={negotiationStatus === 'SUCCESS'}
                                            className="py-3 bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-50"
                                        >
                                            Demand +10%
                                        </button>
                                        <button 
                                            onClick={() => handleNegotiate(25)}
                                            disabled={negotiationStatus === 'SUCCESS'}
                                            className="py-3 bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-700 hover:bg-slate-700 disabled:opacity-50"
                                        >
                                            Demand +25%
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => setNegotiatingOffer(null)}
                                        className="w-full py-3 text-slate-500 font-bold rounded-xl hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                </div>
                             </>
                         )}
                    </div>
                </div>
            )}
        </div>
    );
};
