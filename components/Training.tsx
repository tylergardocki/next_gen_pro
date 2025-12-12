
import React from 'react';
import { PlayerStats } from '../types';
import { ArrowLeft, Zap, Target, Activity, Dumbbell, AlertCircle, TrendingUp } from 'lucide-react';
import { ENERGY_COST_TRAIN } from '../constants';

interface TrainingProps {
    player: PlayerStats;
    onTrain: (attribute: 'attacking' | 'technique' | 'fitness') => void;
    onBack: () => void;
}

const AttributeCard = ({ 
    label, 
    value, 
    icon: Icon, 
    color, 
    bg,
    onTrain,
    canTrain 
}: { 
    label: string, 
    value: number, 
    icon: any, 
    color: string, 
    bg: string,
    onTrain: () => void,
    canTrain: boolean
}) => (
    <button 
        onClick={onTrain}
        disabled={!canTrain || value >= 100}
        className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all relative overflow-hidden group ${canTrain ? 'bg-slate-800 border-slate-700 hover:border-slate-500 active:scale-95' : 'bg-slate-900 border-slate-800 opacity-60 cursor-not-allowed'}`}
    >
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${bg}`}></div>
        <div className="flex items-center gap-4 z-10">
            <div className={`w-12 h-12 rounded-full ${bg} bg-opacity-20 flex items-center justify-center ${color}`}>
                <Icon size={24} />
            </div>
            <div className="text-left">
                <h3 className="font-bold text-white text-lg">{label}</h3>
                <p className="text-xs text-slate-400">Current: <span className={color}>{value}</span>/100</p>
            </div>
        </div>
        <div className="text-right z-10">
             <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Gain +1-3</span>
             {value < 100 ? (
                <div className={`px-3 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-bold ${canTrain ? 'text-white' : 'text-red-500'}`}>
                    -{ENERGY_COST_TRAIN} NRG
                </div>
             ) : (
                 <div className="text-green-500 font-bold text-sm">MAXED</div>
             )}
        </div>
        {/* Progress Bar Background */}
        <div 
            className={`absolute bottom-0 left-0 h-1 ${bg}`} 
            style={{ width: `${value}%`, opacity: 0.5 }}
        ></div>
    </button>
);

export const Training: React.FC<TrainingProps> = ({ player, onTrain, onBack }) => {
    const canTrain = player.energy >= ENERGY_COST_TRAIN;

    return (
        <div className="h-full flex flex-col bg-slate-950">
            <div className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900 sticky top-0 z-10">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full text-slate-300">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="font-bold text-white">Training Ground</h2>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                         <div className="flex items-center gap-3">
                            <div className="bg-green-500/20 p-2 rounded-full">
                                <Zap className="text-green-500" size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Energy</p>
                                <p className={`font-mono font-bold text-xl ${canTrain ? 'text-white' : 'text-red-500'}`}>{player.energy}<span className="text-sm text-slate-500">/100</span></p>
                            </div>
                         </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                         <div className="flex items-center gap-3">
                            <div className="bg-blue-500/20 p-2 rounded-full">
                                <TrendingUp className="text-blue-500" size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Form</p>
                                <p className="font-mono font-bold text-xl text-white">{player.form}<span className="text-sm text-slate-500">/100</span></p>
                            </div>
                         </div>
                    </div>
                </div>

                {!canTrain && (
                     <div className="text-xs text-red-400 font-bold flex items-center justify-center gap-1 bg-red-900/20 px-2 py-2 rounded-xl border border-red-900/50">
                         <AlertCircle size={14} /> Too tired to train effectively.
                     </div>
                 )}

                <div className="space-y-4">
                    <AttributeCard 
                        label="Attacking" 
                        value={player.attacking} 
                        icon={Target} 
                        color="text-red-400" 
                        bg="bg-red-500"
                        canTrain={canTrain}
                        onTrain={() => onTrain('attacking')}
                    />
                    <AttributeCard 
                        label="Technique" 
                        value={player.technique} 
                        icon={Activity} 
                        color="text-blue-400" 
                        bg="bg-blue-500"
                        canTrain={canTrain}
                        onTrain={() => onTrain('technique')}
                    />
                    <AttributeCard 
                        label="Fitness" 
                        value={player.fitness} 
                        icon={Dumbbell} 
                        color="text-orange-400" 
                        bg="bg-orange-500"
                        canTrain={canTrain}
                        onTrain={() => onTrain('fitness')}
                    />
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
                    <p><strong className="text-blue-400">Match Form:</strong> Training improves your Match Form. High form boosts all your stats during match day.</p>
                </div>
            </div>
        </div>
    );
};
