
import React, { useState } from 'react';
import { User, Trophy, CheckSquare, Square, Save, Play, Trash2, Shield, ArrowRight } from 'lucide-react';
import { STARTER_CLUBS } from '../constants';

interface PlayerCreatorProps {
  onCreate: (name: string, position: string, isSandbox: boolean, teamName: string, startCash: number, startWage: number) => void;
  onLoad: () => void;
  hasSaveFile: boolean;
  onDeleteSave: () => void;
}

export const PlayerCreator: React.FC<PlayerCreatorProps> = ({ onCreate, onLoad, hasSaveFile, onDeleteSave }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('Forward');
  const [isSandbox, setIsSandbox] = useState(false);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState<number | null>(null);

  const positions = ['Forward', 'Midfielder', 'Defender'];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(2);
    }
  };

  const handleFinalSubmit = () => {
      if (selectedTeamIndex !== null) {
          const team = STARTER_CLUBS[selectedTeamIndex];
          onCreate(name, position, isSandbox, team.name, 100 + team.signingBonus, team.wage);
      }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-center animate-fade-in overflow-y-auto">
      <div className="mb-8 relative mt-10">
        <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full"></div>
        <Trophy size={64} className="text-yellow-400 relative z-10" />
      </div>
      
      <h1 className="text-3xl font-black text-white mb-2 tracking-tight">NEXT GEN PRO</h1>
      <p className="text-slate-400 mb-8">Begin your legacy.</p>

      {/* STEP 1: PLAYER DETAILS */}
      {step === 1 && (
        <>
            {hasSaveFile && (
                <div className="w-full max-w-xs mb-8 space-y-3">
                    <button 
                        onClick={onLoad}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        LOAD SAVED GAME
                    </button>
                    <button 
                        onClick={onDeleteSave}
                        className="w-full py-2 bg-transparent text-slate-500 hover:text-red-400 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                        <Trash2 size={12} /> Delete Save Data
                    </button>
                </div>
            )}

            {hasSaveFile && <div className="w-full max-w-xs border-t border-slate-800 mb-8 relative"><span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-2 text-xs text-slate-500">OR START NEW</span></div>}

            <form onSubmit={handleNext} className="w-full max-w-xs space-y-6">
                <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Player Name</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                    maxLength={20}
                    />
                </div>
                </div>

                <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Position</label>
                <div className="grid grid-cols-3 gap-2">
                    {positions.map(pos => (
                    <button
                        key={pos}
                        type="button"
                        onClick={() => setPosition(pos)}
                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${position === pos ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                    >
                        {pos}
                    </button>
                    ))}
                </div>
                </div>

                {/* Sandbox Mode Checkbox */}
                <div 
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/50 cursor-pointer hover:bg-slate-800 transition-colors"
                onClick={() => setIsSandbox(!isSandbox)}
                >
                {isSandbox ? (
                    <CheckSquare className="text-green-500" size={20} />
                ) : (
                    <Square className="text-slate-600" size={20} />
                )}
                <div className="text-left">
                    <p className="text-sm font-bold text-slate-200">Sandbox Mode</p>
                    <p className="text-xs text-slate-500">Unlimited Budget & Testing Tools</p>
                </div>
                </div>

                <button 
                type="submit"
                disabled={!name.trim()}
                className="w-full py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                >
                NEXT STEP <ArrowRight size={20} />
                </button>
            </form>
        </>
      )}

      {/* STEP 2: TEAM SELECT */}
      {step === 2 && (
          <div className="w-full max-w-xs space-y-4">
              <div className="text-left mb-4">
                  <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-white mb-2">← Back</button>
                  <h2 className="text-xl font-bold text-white">Select Starting Club</h2>
                  <p className="text-sm text-slate-400">You are a rookie. Choose a lower league team to start your career.</p>
              </div>

              <div className="space-y-3">
                  {STARTER_CLUBS.map((team, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedTeamIndex(idx)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all text-left relative overflow-hidden ${selectedTeamIndex === idx ? `bg-slate-800 border-indigo-500 ring-1 ring-indigo-500` : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}
                      >
                          <div className={`absolute top-0 right-0 p-6 opacity-5 ${team.colors}`}>
                              <Shield size={64} />
                          </div>
                          <div className="relative z-10">
                              <h3 className={`font-bold text-lg ${team.colors}`}>{team.name}</h3>
                              <p className="text-xs text-slate-400 mb-3">{team.description}</p>
                              <div className="flex gap-4">
                                  <div>
                                      <span className="text-[10px] text-slate-500 uppercase font-bold">Wage</span>
                                      <p className="text-white font-bold">${team.wage}</p>
                                  </div>
                                  <div>
                                      <span className="text-[10px] text-slate-500 uppercase font-bold">Sign Bonus</span>
                                      <p className="text-emerald-400 font-bold">${team.signingBonus}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

               <button 
                onClick={handleFinalSubmit}
                disabled={selectedTeamIndex === null}
                className="w-full py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                >
                <Play size={20} fill="currentColor" />
                SIGN CONTRACT
                </button>
          </div>
      )}
    </div>
  );
};
