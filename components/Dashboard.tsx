
import React, { useState } from 'react';
import { PlayerStats, AppScreen } from '../types';
import { ShoppingBag, Users, Smartphone, Dumbbell, PlayCircle, PlusCircle, Landmark, Save, LogOut, Check, Briefcase, UserCircle, Brain } from 'lucide-react';

interface DashboardProps {
  player: PlayerStats;
  week: number;
  onNavigate: (screen: AppScreen) => void;
  onCheat: () => void;
  onSave: () => void;
  onQuit: () => void;
}

const StatPill = ({ label, value, color, max = 100 }: { label: string, value: number, color: string, max?: number }) => (
    <div className="flex flex-col w-full">
        <div className="flex justify-between text-xs mb-1 font-medium text-slate-400">
            <span>{label}</span>
            <span>{value}{max === 100 ? '' : ''}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-700/50">
            <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }}
            />
        </div>
    </div>
);

const AppIcon = ({ icon: Icon, label, onClick, color, badge }: { icon: any, label: string, onClick: () => void, color: string, badge?: number }) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center gap-2 group active:scale-95 transition-transform relative"
    >
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl ring-1 ring-white/10`}>
            <Icon size={28} strokeWidth={1.5} />
        </div>
        <span className="text-xs font-medium text-slate-300">{label}</span>
        {badge ? (
            <div className="absolute -top-1 right-2 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-950">
                {badge}
            </div>
        ) : null}
    </button>
);

export const Dashboard: React.FC<DashboardProps> = ({ player, week, onNavigate, onCheat, onSave, onQuit }) => {
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVED'>('IDLE');

  const handleSaveClick = () => {
      onSave();
      setSaveStatus('SAVED');
      setTimeout(() => setSaveStatus('IDLE'), 2000);
  };

  const overall = Math.floor((player.attacking + player.technique + player.fitness) / 3);

  return (
    <div className="h-full overflow-y-auto pb-20 p-6 flex flex-col">
      {/* Header */}
      <div className="mb-6 mt-2 flex justify-between items-start">
        <div>
            <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Week {week}</h1>
            <h2 className="text-3xl font-bold text-white">Good Morning,<br/><span className="text-indigo-400">{player.name}</span></h2>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleSaveClick}
                className="p-3 bg-slate-800 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors relative"
                title="Save Game"
            >
                {saveStatus === 'SAVED' ? <Check size={20} className="text-green-500" /> : <Save size={20} />}
            </button>
            <button 
                onClick={onQuit}
                className="p-3 bg-slate-800 rounded-full text-slate-300 hover:bg-slate-700 hover:text-red-400 transition-colors"
                title="Quit to Menu"
            >
                <LogOut size={20} />
            </button>
        </div>
      </div>

      {/* Main Stats Card */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50 shadow-xl mb-8">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-lg ring-2 ring-indigo-300">
                    {overall}
                </div>
                <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Overall Rating</p>
                    <p className="text-white font-bold text-sm">{player.position}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="flex items-center justify-end text-xs mb-0.5 font-medium text-slate-400 gap-1">
                    <span>Cash</span>
                    <button onClick={() => onNavigate(AppScreen.BANK)} className="text-emerald-500 hover:text-emerald-400">
                        <PlusCircle size={14} />
                    </button>
                </div>
                <div className="text-xl font-bold text-yellow-400">${player.cash.toLocaleString()}</div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {/* Vitals */}
            <div className="col-span-2 grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                <StatPill label="Energy" value={player.energy} color="#22c55e" />
                <StatPill label="Morale" value={player.morale} color="#3b82f6" />
            </div>
            
            {/* Attributes */}
            <StatPill label="Attacking" value={player.attacking} color="#f87171" />
            <StatPill label="Technique" value={player.technique} color="#60a5fa" />
            <StatPill label="Fitness" value={player.fitness} color="#fb923c" />
            
            {/* Social */}
             <div className="flex flex-col w-full">
                <div className="flex justify-between text-xs mb-1 font-medium text-slate-400">
                    <span>Clout</span>
                </div>
                <div className="text-sm font-bold text-purple-400 truncate">{player.clout.toLocaleString()}</div>
            </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-3 gap-y-8 gap-x-4">
          <AppIcon 
            icon={PlayCircle} 
            label="Match Day" 
            color="bg-gradient-to-br from-green-500 to-emerald-700"
            onClick={() => onNavigate(AppScreen.MATCH)} 
          />
          <AppIcon 
            icon={Dumbbell} 
            label="Training" 
            color="bg-gradient-to-br from-orange-400 to-red-600"
            onClick={() => onNavigate(AppScreen.TRAINING)} 
          />
          <AppIcon 
            icon={Brain} 
            label="Talents" 
            color="bg-gradient-to-br from-yellow-500 to-amber-700"
            badge={player.talentPoints > 0 ? player.talentPoints : undefined}
            onClick={() => onNavigate(AppScreen.TALENTS)} 
          />
          <AppIcon 
            icon={ShoppingBag} 
            label="Lifestyle" 
            color="bg-gradient-to-br from-pink-500 to-rose-600"
            onClick={() => onNavigate(AppScreen.LIFESTYLE)} 
          />
          <AppIcon 
            icon={Briefcase} 
            label="Agent" 
            color="bg-gradient-to-br from-zinc-500 to-zinc-700"
            onClick={() => onNavigate(AppScreen.AGENT)} 
          />
          <AppIcon 
            icon={Landmark} 
            label="Bank" 
            color="bg-gradient-to-br from-slate-600 to-slate-800"
            onClick={() => onNavigate(AppScreen.BANK)} 
          />
          <AppIcon 
            icon={Smartphone} 
            label="Social" 
            color="bg-gradient-to-br from-blue-400 to-indigo-600"
            onClick={() => onNavigate(AppScreen.SOCIAL)} 
          />
           <AppIcon 
            icon={Users} 
            label="Club" 
            color="bg-slate-700"
            onClick={() => onNavigate(AppScreen.CLUB)} 
          />
           <AppIcon 
            icon={UserCircle} 
            label="Profile" 
            color="bg-gradient-to-br from-indigo-500 to-violet-700"
            onClick={() => onNavigate(AppScreen.PROFILE)} 
          />
      </div>
    </div>
  );
};
