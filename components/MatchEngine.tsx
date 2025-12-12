
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerStats, MatchState, MatchPhase, MatchResult, Playstyle, LeagueData, MatchEvent } from '../types';
import { Clock, Activity, FastForward, Sword, Shield, Scale, Globe, DollarSign, Zap, Flag, Target, AlertCircle, PlayCircle, PauseCircle, Mic2, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { INTERNATIONAL_TEAMS, ENERGY_COST_MATCH } from '../constants';

interface MatchEngineProps {
  player: PlayerStats;
  leagueData: LeagueData[];
  isInternational: boolean;
  onMatchEnd: (result: MatchResult) => void;
}

export const MatchEngine: React.FC<MatchEngineProps> = ({ player, leagueData, isInternational, onMatchEnd }) => {
  const [opponentName, setOpponentName] = useState("Opponent FC");
  const [opponentStrength, setOpponentStrength] = useState(50); 
  const [selectedPlaystyle, setSelectedPlaystyle] = useState<Playstyle>(Playstyle.BALANCED);
  const [gameSpeed, setGameSpeed] = useState(1); // 1 = Normal, 0 = Paused, 2 = Fast
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  const [matchState, setMatchState] = useState<MatchState>({
    minute: 0,
    homeScore: 0,
    awayScore: 0,
    possession: 50,
    momentum: 0,
    logs: [{ minute: 0, text: "The referee blows the whistle to start the match!", type: 'WHISTLE', team: 'NEUTRAL' }],
    rating: 6.0,
    goalsScored: 0,
    assists: 0,
    shots: 0,
    opponentShots: 0,
    saves: 0,
    isInternational: isInternational
  });

  const [phase, setPhase] = useState<MatchPhase>(MatchPhase.PRE_MATCH);
  const timerRef = useRef<number | null>(null);

  // Initialize Opponent
  useEffect(() => {
    if (isInternational) {
        const nation = INTERNATIONAL_TEAMS[Math.floor(Math.random() * INTERNATIONAL_TEAMS.length)];
        setOpponentName(nation);
        setOpponentStrength(75 + Math.floor(Math.random() * 20)); 
    } else {
        const currentLeague = leagueData.find(l => l.id === player.leagueId);
        if (currentLeague) {
            const possibleOpponents = currentLeague.teams.filter(t => t.name !== player.team);
            const randomOpponent = possibleOpponents[Math.floor(Math.random() * possibleOpponents.length)];
            setOpponentName(randomOpponent ? randomOpponent.name : "Unknown FC");
            const tierBase = (3 - currentLeague.tier) * 20; 
            setOpponentStrength(30 + tierBase + Math.floor(Math.random() * 40));
        }
    }
  }, [player.leagueId, player.team, leagueData, isInternational]);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
        logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [matchState.logs]);

  const finishMatch = useCallback((finalState: MatchState) => {
    const baseExpense = 50;
    const cloutExpense = Math.floor(player.clout / 1000) * 25;
    const invExpense = player.inventory.length * 10;
    const totalExpenses = baseExpense + cloutExpense + invExpense;

    setMatchState({ ...finalState, expensesDeducted: totalExpenses });
    setPhase(MatchPhase.FULL_TIME);
  }, [player.clout, player.inventory]);

  const addLog = (text: string, type: MatchEvent['type'], team: MatchEvent['team']) => {
      setMatchState(prev => ({
          ...prev,
          logs: [...prev.logs, { minute: prev.minute, text, type, team }]
      }));
  };

  const startMatch = () => {
    setPhase(MatchPhase.SIMULATING);
  };

  // --- INTERACTIVE: HERO MOMENT ---
  const callForBall = () => {
      if (player.energy < 5) return; // Too tired

      let successChance = (player.attacking + player.technique + (matchState.momentum)) / 250; 
      
      // TALENT MODIFIER: Poacher
      if (player.talents.includes('poacher')) successChance += 0.1;

      const roll = Math.random();

      if (roll < successChance) {
          const goalRoll = Math.random();
          // TALENT MODIFIER: Clutch Gene (Late game buff)
          const isClutch = player.talents.includes('clutch') && matchState.minute > 80;
          const clutchBuff = isClutch ? 0.2 : 0;

          if (goalRoll < 0.4 + clutchBuff) {
              setMatchState(prev => ({
                  ...prev,
                  homeScore: prev.homeScore + 1,
                  goalsScored: prev.goalsScored + 1,
                  rating: Math.min(10, prev.rating + 1.5),
                  momentum: 50,
                  shots: prev.shots + 1,
                  logs: [...prev.logs, { minute: prev.minute, text: `BRILLIANT! ${player.name} demands the ball, beats a man, and fires it home!`, type: 'GOAL', team: 'HOME' }]
              }));
          } else if (goalRoll < 0.8) {
              setMatchState(prev => ({
                  ...prev,
                  rating: Math.min(10, prev.rating + 0.2),
                  momentum: prev.momentum + 10,
                  shots: prev.shots + 1,
                  logs: [...prev.logs, { minute: prev.minute, text: `${player.name} creates space and shoots, but the keeper pushes it wide!`, type: 'CHANCE', team: 'HOME' }]
              }));
          } else {
               setMatchState(prev => ({
                  ...prev,
                  rating: Math.max(1, prev.rating - 0.1),
                  momentum: prev.momentum - 5,
                  shots: prev.shots + 1,
                  logs: [...prev.logs, { minute: prev.minute, text: `${player.name} gets the ball but blasts it over the bar.`, type: 'NORMAL', team: 'HOME' }]
              }));
          }
      } else {
          setMatchState(prev => ({
              ...prev,
              rating: Math.max(1, prev.rating - 0.2),
              momentum: prev.momentum - 10,
              logs: [...prev.logs, { minute: prev.minute, text: `${player.name} calls for the pass but is easily dispossessed.`, type: 'NORMAL', team: 'AWAY' }]
          }));
      }
  };

  // --- SIMULATION LOOP ---
  useEffect(() => {
    if (phase === MatchPhase.SIMULATING && gameSpeed > 0) {
      const tickRate = gameSpeed === 2 ? 100 : 800; // Fast or Normal speed

      timerRef.current = window.setInterval(() => {
        setMatchState(prev => {
          const newMinute = prev.minute + 1;
          
          if (newMinute > 90) {
            if (timerRef.current) clearInterval(timerRef.current);
            return prev; 
          }

          let offenseMod = 0;
          let defenseMod = 0;
          
          if (selectedPlaystyle === Playstyle.AGGRESSIVE) { offenseMod = 20; defenseMod = -20; }
          if (selectedPlaystyle === Playstyle.DEFENSIVE) { offenseMod = -15; defenseMod = 20; }

          // TALENT MODIFIER: Engine (Reduced fatigue penalty logic simulated by higher base)
          const engineBonus = player.talents.includes('engine') ? 5 : 0;
          const playerContribution = (player.attacking + player.technique + player.fitness + engineBonus) / 6; 
          const teamPower = 40 + playerContribution + offenseMod + (prev.momentum / 2);
          const oppPower = opponentStrength + defenseMod;

          // TALENT MODIFIER: Maestro (Possession bonus)
          const maestroBonus = player.talents.includes('maestro') ? 2 : 0;
          const possessionBias = ((teamPower - oppPower) / 5) + maestroBonus; 
          const newPossession = Math.max(20, Math.min(80, prev.possession + possessionBias + (Math.random() * 4 - 2)));
          let newMomentum = prev.momentum * 0.9; 

          const eventRoll = Math.random() * 100;
          const actionThreshold = 15;

          let newLogs = [...prev.logs];
          let newHomeScore = prev.homeScore;
          let newAwayScore = prev.awayScore;
          let newShots = prev.shots;
          let newOppShots = prev.opponentShots;
          let newRating = prev.rating;

          if (eventRoll < actionThreshold) {
              if (Math.random() * 100 < newPossession) {
                  newShots++;
                  const goalProb = 0.15 + (offenseMod / 200) + (newMomentum / 200);
                  
                  if (Math.random() < goalProb) {
                      newHomeScore++;
                      newMomentum = 30;
                      if (Math.random() < 0.3) {
                          newRating += 1.0;
                          setMatchState(s => ({...s, goalsScored: s.goalsScored + 1})); 
                          newLogs.push({ minute: newMinute, text: `GOAL! ${player.name} is in the right spot to tap it in!`, type: 'GOAL', team: 'HOME' });
                      } else {
                           newLogs.push({ minute: newMinute, text: `GOAL! The home team takes the lead with a stunning strike!`, type: 'GOAL', team: 'HOME' });
                      }
                  } else {
                      newMomentum += 5;
                      newLogs.push({ minute: newMinute, text: `Close! The home team rattles the woodwork.`, type: 'CHANCE', team: 'HOME' });
                  }
              } else {
                  newOppShots++;
                   const goalProb = 0.15 - (defenseMod / 200); 
                   
                   if (Math.random() < goalProb) {
                       newAwayScore++;
                       newMomentum = -30;
                       newRating -= 0.1;
                       newLogs.push({ minute: newMinute, text: `GOAL! ${opponentName} silence the crowd.`, type: 'GOAL', team: 'AWAY' });
                   } else {
                       newMomentum -= 5;
                       newRating += 0.1; 
                       newLogs.push({ minute: newMinute, text: `Great save! The defense holds firm.`, type: 'CHANCE', team: 'AWAY' });
                   }
              }
          } else {
              if (newMinute % 10 === 0 && Math.random() > 0.5) {
                   const flavors = [
                       "Midfield battle tightening up.",
                       "The manager is screaming instructions.",
                       "Possession is being traded cheaply.",
                       "Crowd chanting for a goal.",
                       "Tactical foul stops the play."
                   ];
                   newLogs.push({ minute: newMinute, text: flavors[Math.floor(Math.random() * flavors.length)], type: 'NORMAL', team: 'NEUTRAL' });
              }
          }

          if (newMinute === 90) {
              setTimeout(() => finishMatch({ ...prev, minute: 90, homeScore: newHomeScore, awayScore: newAwayScore, logs: newLogs }), 1000);
          }

          return {
              ...prev,
              minute: newMinute,
              possession: newPossession,
              momentum: Math.max(-50, Math.min(50, newMomentum)),
              homeScore: newHomeScore,
              awayScore: newAwayScore,
              shots: newShots,
              opponentShots: newOppShots,
              rating: Math.min(10, Math.max(1, newRating)),
              logs: newLogs
          };
        });
      }, tickRate);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, gameSpeed, selectedPlaystyle, finishMatch, player, opponentStrength, opponentName]);


  // --- INTERVIEW LOGIC ---
  const handleInterviewResponse = (impact: { manager: number, team: number, fans: number }) => {
     onMatchEnd({
        homeScore: matchState.homeScore,
        awayScore: matchState.awayScore,
        opponent: opponentName,
        goals: matchState.goalsScored,
        rating: matchState.rating,
        expenses: matchState.expensesDeducted || 0,
        isInternational: isInternational,
        interviewEffect: impact
     });
  };

  // --- RENDER ---

  if (phase === MatchPhase.PRE_MATCH) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6 animate-fade-in relative overflow-hidden bg-slate-900">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-slate-800 to-transparent -z-10"></div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{isInternational ? 'International Duty' : 'Match Day'}</h1>
        <div className="flex items-center justify-center gap-4 w-full max-w-sm">
            <div className={`bg-slate-800 p-4 rounded-2xl border border-slate-700 w-1/2 shadow-lg ${isInternational ? 'border-yellow-500/50' : ''}`}>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">HOME</p>
                <p className="text-lg font-bold text-white truncate">{isInternational ? player.nationality : player.team}</p>
                {isInternational && <Globe size={16} className="text-yellow-500 mx-auto mt-2" />}
            </div>
            <div className="font-black text-slate-600">VS</div>
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 w-1/2 shadow-lg">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">AWAY</p>
                <p className="text-lg font-bold text-indigo-400 truncate">{opponentName}</p>
                <p className="text-[10px] text-slate-500 mt-1">Str: {opponentStrength}</p>
            </div>
        </div>
        <div className="w-full max-w-sm space-y-3 mt-8">
            <button 
                onClick={startMatch}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-white shadow-lg shadow-green-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
                KICK OFF
            </button>
            <div className="bg-slate-800/50 p-4 rounded-xl text-xs text-slate-400">
                Tip: Use "Aggressive" tactics to score more, but watch your defense!
            </div>
        </div>
      </div>
    );
  }

  if (phase === MatchPhase.INTERVIEW) {
      const isWin = matchState.homeScore > matchState.awayScore;
      const question = isWin 
        ? "Great result today. How do you assess your own performance?" 
        : "Disappointing result. What went wrong out there?";
      
      return (
        <div className="flex flex-col h-full p-6 bg-slate-950 text-center animate-fade-in relative overflow-hidden">
             <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
             <div className="mt-10 mb-6">
                <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto flex items-center justify-center border-4 border-slate-700 mb-4">
                    <Mic2 size={32} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Post-Match Press</h2>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 max-w-xs mx-auto relative">
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 border-b border-r border-slate-700 rotate-45"></div>
                    <p className="text-slate-300 italic">"{question}"</p>
                </div>
             </div>

             <div className="space-y-3 max-w-sm mx-auto w-full">
                <button 
                    onClick={() => handleInterviewResponse({ manager: -5, team: -5, fans: 15 })}
                    className="w-full p-4 bg-slate-900 border border-slate-800 hover:border-purple-500 rounded-xl text-left group transition-all"
                >
                    <p className="font-bold text-white text-sm mb-1 group-hover:text-purple-400">"I was the best player on the pitch."</p>
                    <div className="flex gap-2 text-[10px] uppercase font-bold text-slate-500">
                        <span className="text-green-500">++ FANS</span> <span className="text-red-500">-- TEAM</span>
                    </div>
                </button>

                <button 
                    onClick={() => handleInterviewResponse({ manager: 10, team: 0, fans: -5 })}
                    className="w-full p-4 bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-xl text-left group transition-all"
                >
                    <p className="font-bold text-white text-sm mb-1 group-hover:text-blue-400">"We stuck to the manager's plan."</p>
                    <div className="flex gap-2 text-[10px] uppercase font-bold text-slate-500">
                        <span className="text-green-500">++ BOSS</span> <span className="text-slate-500">= TEAM</span>
                    </div>
                </button>

                <button 
                    onClick={() => handleInterviewResponse({ manager: 0, team: 10, fans: 0 })}
                    className="w-full p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500 rounded-xl text-left group transition-all"
                >
                    <p className="font-bold text-white text-sm mb-1 group-hover:text-emerald-400">"It was a complete team effort."</p>
                    <div className="flex gap-2 text-[10px] uppercase font-bold text-slate-500">
                        <span className="text-green-500">++ TEAM</span> <span className="text-slate-500">= FANS</span>
                    </div>
                </button>
             </div>
        </div>
      )
  }

  if (phase === MatchPhase.FULL_TIME) {
    const cashEarned = player.wage + (matchState.goalsScored * 50); 
    const isWin = matchState.homeScore > matchState.awayScore;
    const isDraw = matchState.homeScore === matchState.awayScore;
    const expense = matchState.expensesDeducted || 0;

    return (
        <div className="h-full flex flex-col bg-slate-950 overflow-y-auto">
            <div className="relative p-6 pt-10 text-center border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
                <h1 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4">Final Score</h1>
                
                <div className="flex justify-between items-center max-w-xs mx-auto mb-6">
                    <div className="text-center w-1/3">
                        <div className="text-3xl font-black text-white">{matchState.homeScore}</div>
                        <div className="text-xs font-bold text-slate-500 mt-1">{isInternational ? player.nationality.substring(0,3).toUpperCase() : player.team.substring(0,3).toUpperCase()}</div>
                    </div>
                    <div className="text-slate-700 font-light text-4xl">-</div>
                    <div className="text-center w-1/3">
                        <div className="text-3xl font-black text-white">{matchState.awayScore}</div>
                        <div className="text-xs font-bold text-slate-500 mt-1">{opponentName.substring(0,3).toUpperCase()}</div>
                    </div>
                </div>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${isWin ? 'bg-green-500/10 text-green-400 border-green-500/20' : isDraw ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {isWin ? 'VICTORY' : isDraw ? 'DRAW' : 'DEFEAT'}
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-xl">
                     <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                        <DollarSign size={16} /> FINANCIAL REPORT
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Match Wage</span>
                            <span className="text-white font-mono">+${player.wage}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Goal Bonuses</span>
                            <span className="text-white font-mono">+${matchState.goalsScored * 50}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-800 pt-2">
                            <span className="text-red-400">Living Expenses</span>
                            <span className="text-red-400 font-mono">-${expense}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
                            <span className="font-bold text-white">Net Profit</span>
                            <span className={`font-mono font-bold ${cashEarned - expense >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ${cashEarned - expense}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
                     <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                        <Activity size={16} /> MATCH PERFORMANCE
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-black text-white">{matchState.rating.toFixed(1)}</div>
                            <div className="text-xs text-slate-500">Rating</div>
                        </div>
                        <div>
                             <div className="text-2xl font-black text-white">{matchState.goalsScored}</div>
                             <div className="text-xs text-slate-500">Goals</div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setPhase(MatchPhase.INTERVIEW)}
                    className="w-full py-4 bg-white text-slate-950 hover:bg-slate-200 rounded-xl font-bold shadow-lg shadow-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Mic2 size={18} />
                    Face the Press
                </button>
            </div>
        </div>
    )
  }

  // --- MAIN MATCH SCREEN ---
  return (
    <div className="h-full flex flex-col bg-slate-900 relative">
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center shadow-lg z-20">
          <div className="flex flex-col items-start w-20">
              <span className="text-xs font-bold text-slate-400 uppercase truncate max-w-full">{isInternational ? player.nationality : player.team}</span>
              <span className="text-3xl font-black text-white">{matchState.homeScore}</span>
          </div>
          
          <div className="flex flex-col items-center">
              <div className="bg-slate-800 px-3 py-1 rounded border border-slate-700 text-lg font-mono font-bold text-green-400 flex items-center gap-2 shadow-inner">
                  {matchState.minute}'
              </div>
          </div>

          <div className="flex flex-col items-end w-20">
              <span className="text-xs font-bold text-slate-400 uppercase truncate max-w-full text-right">{opponentName}</span>
              <span className="text-3xl font-black text-white">{matchState.awayScore}</span>
          </div>
      </div>

      <div className="bg-slate-900 border-b border-slate-800 p-2 flex justify-between items-center text-xs px-4">
          <div className="flex gap-4 text-slate-400">
              <span>Shots: <b className="text-white">{matchState.shots}</b> - <b className="text-white">{matchState.opponentShots}</b></span>
              <span>Poss: <b className="text-blue-400">{Math.round(matchState.possession)}%</b></span>
          </div>
          <div className="flex items-center gap-1">
             <Zap size={12} className={matchState.momentum > 10 ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} />
             <span className={matchState.momentum > 0 ? "text-green-400 font-bold" : "text-slate-500"}>
                 {matchState.momentum > 20 ? "DOMINATING" : matchState.momentum > 0 ? "ADVANTAGE" : "NEUTRAL"}
             </span>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900 relative">
          {matchState.logs.length === 0 && <div className="text-center text-slate-600 mt-10">Match Starting...</div>}
          
          {matchState.logs.map((log, i) => (
              <div key={i} className={`flex gap-3 animate-fade-in ${log.type === 'GOAL' ? 'bg-green-900/10 p-2 rounded-lg border border-green-500/20' : ''}`}>
                  <div className="flex-shrink-0 w-8 pt-1 text-xs font-mono text-slate-500 text-right">
                      {log.minute}'
                  </div>
                  <div className="flex-1">
                      {log.type === 'GOAL' && <div className="text-xs font-bold text-green-400 mb-0.5 flex items-center gap-1"><Target size={12}/> GOAL</div>}
                      {log.type === 'CHANCE' && <div className="text-xs font-bold text-yellow-500 mb-0.5 flex items-center gap-1"><AlertCircle size={12}/> CHANCE</div>}
                      {log.type === 'HERO' && <div className="text-xs font-bold text-indigo-400 mb-0.5 flex items-center gap-1"><Zap size={12}/> SKILL</div>}
                      <p className={`text-sm ${log.type === 'GOAL' ? 'text-white font-medium' : 'text-slate-300'}`}>
                          {log.text}
                      </p>
                  </div>
              </div>
          ))}
          <div ref={logsEndRef} />
      </div>

      <div className="bg-slate-950 border-t border-slate-800 p-3 pb-6 safe-area-bottom">
          <div className="flex justify-between bg-slate-900 p-1 rounded-lg mb-3 border border-slate-800">
              {[Playstyle.DEFENSIVE, Playstyle.BALANCED, Playstyle.AGGRESSIVE].map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedPlaystyle(style)}
                    className={`flex-1 py-2 rounded-md text-xs font-bold flex flex-col items-center gap-1 transition-all ${selectedPlaystyle === style 
                        ? style === Playstyle.AGGRESSIVE ? 'bg-red-500 text-white shadow-lg' : style === Playstyle.DEFENSIVE ? 'bg-emerald-500 text-white shadow-lg' : 'bg-blue-500 text-white shadow-lg'
                        : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      {style === Playstyle.DEFENSIVE && <Shield size={16} />}
                      {style === Playstyle.BALANCED && <Scale size={16} />}
                      {style === Playstyle.AGGRESSIVE && <Sword size={16} />}
                      {style}
                  </button>
              ))}
          </div>

          <div className="flex gap-3">
              <button 
                onClick={() => setGameSpeed(prev => prev === 2 ? 0 : prev + 1)}
                className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 active:scale-95 transition-all"
              >
                  {gameSpeed === 0 ? <PlayCircle size={24} /> : gameSpeed === 1 ? <FastForward size={24} /> : <PauseCircle size={24} />}
              </button>

              <button 
                onClick={callForBall}
                disabled={gameSpeed === 0}
                className="flex-1 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all border-t border-white/10 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                  <div className="bg-white/20 p-1.5 rounded-full">
                      <Target size={20} className="text-white group-active:scale-110 transition-transform" />
                  </div>
                  <div className="text-left leading-none">
                      <div className="text-white font-bold text-sm">DEMAND BALL</div>
                      <div className="text-[10px] text-indigo-200 font-bold">Chance Creation (-Energy)</div>
                  </div>
              </button>
          </div>
      </div>
    </div>
  );
};
