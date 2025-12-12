
import React, { useState, useEffect, useCallback } from 'react';
import { PlayerStats, AppScreen, MatchResult, LeagueData, SaveData } from './types';
import { INITIAL_STATS, ENERGY_COST_MATCH, ENERGY_COST_TRAIN, NARRATIVE_EVENTS, LEAGUE_NAMES, TIER_1_TEAMS, TIER_2_TEAMS, TIER_3_TEAMS, GAMES_PER_SEASON } from './constants';
import { Dashboard } from './components/Dashboard';
import { MatchEngine } from './components/MatchEngine';
import { SocialFeed } from './components/SocialFeed';
import { Training } from './components/Training';
import { Lifestyle } from './components/Lifestyle';
import { PlayerCreator } from './components/PlayerCreator';
import { Bank } from './components/Bank';
import { Club } from './components/Club';
import { Agent } from './components/Agent';
import { Profile } from './components/Profile';
import { TalentTree } from './components/TalentTree';

const SAVE_KEY = 'NEXT_GEN_PRO_SAVE_V2';

// Helper to prevent NaN
const ensureNumber = (val: any, fallback: number) => {
  const num = Number(val);
  return Number.isNaN(num) ? fallback : num;
};

export default function App() {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.CREATE_PLAYER);
  const [week, setWeek] = useState(1);
  const [player, setPlayer] = useState<PlayerStats>({ ...INITIAL_STATS, position: 'Forward' });
  const [leagues, setLeagues] = useState<LeagueData[]>([]);
  const [hasSaveFile, setHasSaveFile] = useState(false);
  const [isInternationalMatch, setIsInternationalMatch] = useState(false);
  
  // Narrative Event State
  const [currentEvent, setCurrentEvent] = useState<any>(null);

  // Check for save file on mount
  useEffect(() => {
    const checkSave = () => {
      const saved = localStorage.getItem(SAVE_KEY);
      setHasSaveFile(!!saved);
    };
    checkSave();
  }, []);

  // Initialize League Tables
  const initAllLeagues = (playerTeam: string, playerLeagueId: number) => {
    const generateTable = (id: number, teams: string[], playerTeamName?: string) => {
       const teamList = [...teams];
       // Ensure player team is in the list if applicable
       if (playerTeamName && !teamList.includes(playerTeamName)) {
           teamList.pop(); // Remove last team to make space
           teamList.unshift(playerTeamName); // Add player team
       }

       return {
           id,
           tier: id + 1,
           name: LEAGUE_NAMES[id],
           teams: teamList.map(t => ({
               name: t,
               played: 0,
               won: 0,
               drawn: 0,
               lost: 0,
               points: 0,
               gd: 0
           }))
       };
    };

    setLeagues([
        generateTable(0, TIER_1_TEAMS, playerLeagueId === 0 ? playerTeam : undefined),
        generateTable(1, TIER_2_TEAMS, playerLeagueId === 1 ? playerTeam : undefined),
        generateTable(2, TIER_3_TEAMS, playerLeagueId === 2 ? playerTeam : undefined),
    ]);
  };


  // --- SAVE / LOAD SYSTEM ---

  const sanitizePlayerStats = (rawPlayer: any): PlayerStats => {
      return {
          ...rawPlayer,
          energy: ensureNumber(rawPlayer.energy, 100),
          morale: ensureNumber(rawPlayer.morale, 80),
          cash: ensureNumber(rawPlayer.cash, 100),
          wage: ensureNumber(rawPlayer.wage, 100),
          attacking: ensureNumber(rawPlayer.attacking, 40),
          technique: ensureNumber(rawPlayer.technique, 40),
          fitness: ensureNumber(rawPlayer.fitness, 40),
          form: ensureNumber(rawPlayer.form, 50),
          clout: ensureNumber(rawPlayer.clout, 0),
          leagueId: ensureNumber(rawPlayer.leagueId, 2),
          caps: ensureNumber(rawPlayer.caps, 0),
          internationalGoals: ensureNumber(rawPlayer.internationalGoals, 0),
          seasonMatchCount: ensureNumber(rawPlayer.seasonMatchCount, 0),
          inventory: Array.isArray(rawPlayer.inventory) ? rawPlayer.inventory : [],
          goalsScored: ensureNumber(rawPlayer.goalsScored, 0),
          assists: ensureNumber(rawPlayer.assists, 0),
          matchesPlayed: ensureNumber(rawPlayer.matchesPlayed, 0),
          passiveIncome: ensureNumber(rawPlayer.passiveIncome, 0),
          talentPoints: ensureNumber(rawPlayer.talentPoints, 0),
          talents: Array.isArray(rawPlayer.talents) ? rawPlayer.talents : [],
          relationships: rawPlayer.relationships || { manager: 50, team: 50, fans: 10 }
      };
  };

  const saveGame = useCallback(() => {
    if (player.name === INITIAL_STATS.name && week === 1) return;

    const data: SaveData = {
        player,
        week,
        leagues,
        lastSaved: new Date().toISOString()
    };
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        setHasSaveFile(true);
        console.log("Game Saved");
    } catch (e) {
        console.error("Failed to save game", e);
    }
  }, [player, week, leagues]);

  const loadGame = () => {
      try {
          const raw = localStorage.getItem(SAVE_KEY);
          if (!raw) return;
          const data: SaveData = JSON.parse(raw);
          
          if (data.player && data.leagues) {
              const cleanPlayer = sanitizePlayerStats(data.player);
              setPlayer(cleanPlayer);
              setWeek(ensureNumber(data.week, 1));
              setLeagues(data.leagues);
              setScreen(AppScreen.HOME);
          }
      } catch (e) {
          console.error("Failed to load save", e);
          alert("Save file corrupted. Please start a new game.");
      }
  };

  const deleteSave = () => {
      if(confirm("Are you sure you want to delete your save file? This cannot be undone.")) {
          localStorage.removeItem(SAVE_KEY);
          setHasSaveFile(false);
      }
  };

  useEffect(() => {
      if (screen !== AppScreen.CREATE_PLAYER) {
          const timer = setTimeout(() => {
              saveGame();
          }, 1000); 
          return () => clearTimeout(timer);
      }
  }, [player, week, screen, saveGame]);


  // --- GAME LOGIC ---

  const handleCreatePlayer = (name: string, position: string, isSandbox: boolean, teamName: string, startCash: number, startWage: number) => {
    const baseStats = 40 + (Math.floor(Math.random() * 10));
    const newPlayer = {
      ...INITIAL_STATS,
      name,
      position,
      team: teamName,
      attacking: baseStats,
      technique: baseStats,
      fitness: baseStats,
      cash: isSandbox ? 999999999 : startCash,
      wage: startWage,
      leagueId: 2 // Start in Tier 3
    };
    setPlayer(newPlayer);
    initAllLeagues(teamName, 2);
    setScreen(AppScreen.HOME);
  };

  const handleCheat = () => {
    setPlayer(prev => ({ ...prev, cash: prev.cash + 1000000 }));
  };

  const handleTransaction = (amount: number, moraleImpact: number) => {
    setPlayer(prev => ({
        ...prev,
        cash: prev.cash + amount,
        morale: Math.min(100, Math.max(0, prev.morale + moraleImpact))
    }));
  };

  // Promotion / Relegation Logic
  const handleSeasonEnd = () => {
      alert("Season Finished! Check the league table for results.");
      
      setLeagues(prevLeagues => {
          const newLeagues = [...prevLeagues];
          
          // Logic for League 1 (Tier 2) to Premier (Tier 1)
          // Logic for League 2 (Tier 3) to League 1 (Tier 2)
          
          // Helper to sort standings
          const sortTable = (teams: any[]) => teams.sort((a,b) => b.points - a.points || b.gd - a.gd);

          // Get sorted tables
          const tier1 = sortTable([...newLeagues[0].teams]);
          const tier2 = sortTable([...newLeagues[1].teams]);
          const tier3 = sortTable([...newLeagues[2].teams]);

          // Swap logic
          // Tier 1 Bottom 2 <-> Tier 2 Top 2
          const t1_relegated = tier1.splice(8, 2);
          const t2_promoted = tier2.splice(0, 2);
          
          // Tier 2 Bottom 2 <-> Tier 3 Top 2
          const t2_relegated = tier2.splice(8, 2);
          const t3_promoted = tier3.splice(0, 2);

          // Reassemble
          newLeagues[0].teams = [...tier1, ...t2_promoted];
          newLeagues[1].teams = [...tier2, ...t1_relegated, ...t3_promoted];
          newLeagues[2].teams = [...tier3, ...t2_relegated];

          // Reset stats for next season
          newLeagues.forEach(l => {
              l.teams.forEach(t => {
                  t.played = 0; t.won = 0; t.drawn = 0; t.lost = 0; t.points = 0; t.gd = 0;
              });
          });

          // Check if player moved
          let newLeagueId = player.leagueId;
          if (player.leagueId === 2 && t3_promoted.find(t => t.name === player.team)) newLeagueId = 1;
          else if (player.leagueId === 1 && t2_promoted.find(t => t.name === player.team)) newLeagueId = 0;
          else if (player.leagueId === 1 && t2_relegated.find(t => t.name === player.team)) newLeagueId = 2;
          else if (player.leagueId === 0 && t1_relegated.find(t => t.name === player.team)) newLeagueId = 1;

          if (newLeagueId !== player.leagueId) {
             setPlayer(p => ({ ...p, leagueId: newLeagueId }));
             setTimeout(() => alert(newLeagueId < player.leagueId ? "PROMOTION! Your club has moved up a division!" : "RELEGATION. Your club has dropped down a division."), 500);
          }

          return newLeagues;
      });

      setPlayer(p => ({ ...p, seasonMatchCount: 0 }));
  };

  const handleMatchEnd = (result: MatchResult) => {
    // Wage + Win Bonus
    const bonus = result.goals * 50 + (result.rating > 7 ? 100 : 0);
    const expenses = result.expenses || 0;
    const xpGain = result.rating > 6.0 ? 1 : 0;
    
    // Fitness Drain
    const currentFitness = ensureNumber(player.fitness, 40);
    const fitnessMitigation = Math.floor(currentFitness / 20);
    let energyLoss = Math.max(5, ENERGY_COST_MATCH - fitnessMitigation);
    if (player.talents.includes('engine')) energyLoss = Math.max(1, energyLoss - 5);

    // Form Change based on rating
    const formChange = result.rating > 6.5 ? 2 : (result.rating < 5 ? -2 : 0);
    
    // Passive Income
    const income = player.passiveIncome || 0;

    // Talent Points Logic (Every 5 games played = 1 point)
    const gamesPlayed = player.matchesPlayed + 1;
    const earnedTalentPoint = gamesPlayed % 5 === 0;

    // Relationship Updates from Interview
    const relationshipUpdate = result.interviewEffect || { manager: 0, team: 0, fans: 0 };
    const newRelationships = {
        manager: Math.max(0, Math.min(100, player.relationships.manager + relationshipUpdate.manager)),
        team: Math.max(0, Math.min(100, player.relationships.team + relationshipUpdate.team)),
        fans: Math.max(0, Math.min(100, player.relationships.fans + relationshipUpdate.fans))
    };

    if (result.isInternational) {
        setPlayer(prev => ({
            ...prev,
            cash: prev.cash + income,
            energy: Math.max(0, prev.energy - energyLoss),
            clout: prev.clout + 1000 + (result.goals * 500), // Big clout for intl
            morale: Math.min(100, Math.max(0, prev.morale + (result.rating > 6 ? 10 : -5))),
            caps: prev.caps + 1,
            internationalGoals: prev.internationalGoals + result.goals,
            attacking: Math.min(100, ensureNumber(prev.attacking, 40) + xpGain),
            technique: Math.min(100, ensureNumber(prev.technique, 40) + xpGain),
            fitness: Math.min(100, ensureNumber(prev.fitness, 40) + xpGain),
            form: Math.min(100, Math.max(0, prev.form + formChange)),
            talentPoints: prev.talentPoints + (earnedTalentPoint ? 1 : 0)
        }));
        setScreen(AppScreen.HOME);
        return;
    }

    // Media Darling Talent Boost
    let cloutGain = (result.rating > 7 ? 100 : -20) + (result.goals * 300);
    if (player.talents.includes('darling')) cloutGain = Math.floor(cloutGain * 1.2);

    setPlayer(prev => ({
        ...prev,
        cash: prev.cash + prev.wage + bonus + income - expenses,
        clout: prev.clout + cloutGain,
        morale: Math.min(100, Math.max(0, prev.morale + (result.rating > 6 ? 5 : -5))),
        energy: Math.max(0, prev.energy - energyLoss), 
        attacking: Math.min(100, ensureNumber(prev.attacking, 40) + xpGain),
        technique: Math.min(100, ensureNumber(prev.technique, 40) + xpGain),
        fitness: Math.min(100, ensureNumber(prev.fitness, 40) + xpGain),
        form: Math.min(100, Math.max(0, prev.form + formChange - 2)), // Decay form slightly weekly
        goalsScored: prev.goalsScored + result.goals,
        matchesPlayed: prev.matchesPlayed + 1,
        seasonMatchCount: prev.seasonMatchCount + 1,
        talentPoints: prev.talentPoints + (earnedTalentPoint ? 1 : 0),
        relationships: newRelationships
    }));
    
    updateLeagueTables(result);
    setWeek(w => w + 1);

    if (earnedTalentPoint) {
        setTimeout(() => alert("You've earned a Talent Point! Check the Talent Tree."), 500);
    }

    // Season End Check
    if (player.seasonMatchCount + 1 >= GAMES_PER_SEASON) {
        handleSeasonEnd();
    } 
    // Random International Call-up Check (Every 5 weeks roughly)
    else if (week % 5 === 0 && (player.attacking + player.technique) / 2 > 65) {
        setCurrentEvent({
            title: "International Duty",
            text: `You have been selected to play for ${player.nationality}!`,
            choices: [
                { text: "Accept Call-up", effect: { morale: 10, energy: 0, clout: 0, cash: 0, form: 5 }, resultText: "You join the national squad." }
            ],
            isCallUp: true
        });
    } else {
        // Normal Random Events
        if (Math.random() < 0.2) {
            const event = NARRATIVE_EVENTS[Math.floor(Math.random() * NARRATIVE_EVENTS.length)];
            setCurrentEvent(event);
        } else {
            setScreen(AppScreen.HOME);
        }
    }
  };

  const updateLeagueTables = (playerResult: MatchResult) => {
      setLeagues(prevLeagues => {
          const newLeagues = [...prevLeagues];
          // Find player's league
          const leagueIdx = player.leagueId;
          const league = newLeagues[leagueIdx];
          
          if (!league) return prevLeagues;

          // 1. Update Player Team
          const playerTeamIdx = league.teams.findIndex(t => t.name === player.team);
          if (playerTeamIdx > -1) {
              const p = league.teams[playerTeamIdx];
              p.played += 1;
              p.gd += (playerResult.homeScore - playerResult.awayScore);
              if (playerResult.homeScore > playerResult.awayScore) {
                  p.won += 1; p.points += 3;
              } else if (playerResult.homeScore === playerResult.awayScore) {
                  p.drawn += 1; p.points += 1;
              } else {
                  p.lost += 1;
              }
          }

          // 2. Update Opponent (if in same league)
          const oppTeamIdx = league.teams.findIndex(t => t.name === playerResult.opponent);
          if (oppTeamIdx > -1) {
              const o = league.teams[oppTeamIdx];
              o.played += 1;
              o.gd += (playerResult.awayScore - playerResult.homeScore);
              if (playerResult.awayScore > playerResult.homeScore) {
                  o.won += 1; o.points += 3;
              } else if (playerResult.awayScore === playerResult.homeScore) {
                  o.drawn += 1; o.points += 1;
              } else {
                  o.lost += 1;
              }
          }

          // 3. Sim rest of the league
          const otherTeams = league.teams.filter(t => t.name !== player.team && t.name !== playerResult.opponent);
          // Simple pairwise sim
          for (let i = 0; i < otherTeams.length; i += 2) {
              if (i + 1 < otherTeams.length) {
                  const t1 = otherTeams[i];
                  const t2 = otherTeams[i+1];
                  const s1 = Math.floor(Math.random() * 4);
                  const s2 = Math.floor(Math.random() * 4);

                  t1.played++; t2.played++;
                  t1.gd += (s1 - s2); t2.gd += (s2 - s1);
                  if (s1 > s2) { t1.won++; t1.points += 3; t2.lost++; }
                  else if (s1 === s2) { t1.drawn++; t1.points += 1; t2.drawn++; t2.points += 1; }
                  else { t1.lost++; t2.won++; t2.points += 3; }
              }
          }

          return newLeagues;
      });
  };

  const handleTrain = (attribute: 'attacking' | 'technique' | 'fitness') => {
      if (player.energy < ENERGY_COST_TRAIN) return;
      
      // Variable Gain: 1 to 3
      // Tired players (energy < 40) gain less
      const baseGain = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
      const tiredPenalty = player.energy < 40 ? -1 : 0;
      const totalGain = Math.max(1, baseGain + tiredPenalty);

      setPlayer(prev => ({
          ...prev,
          [attribute]: Math.min(100, ensureNumber(prev[attribute], 40) + totalGain),
          energy: ensureNumber(prev.energy, 100) - ENERGY_COST_TRAIN,
          morale: Math.max(0, ensureNumber(prev.morale, 80) - 2),
          form: Math.min(100, prev.form + 3) // Training boosts form
      }));
  };

  const handleBuy = (item: any) => {
      if (player.cash < item.cost) return;
      if (item.type !== 'CONSUMABLE' && player.inventory.includes(item.id)) return;
      setPlayer(prev => ({
          ...prev,
          cash: prev.cash - item.cost,
          energy: Math.min(100, Math.max(0, ensureNumber(prev.energy, 100) + item.effects.energy)),
          morale: Math.min(100, Math.max(0, ensureNumber(prev.morale, 80) + item.effects.morale)),
          attacking: Math.min(100, ensureNumber(prev.attacking, 40) + item.effects.attacking),
          technique: Math.min(100, ensureNumber(prev.technique, 40) + item.effects.technique),
          fitness: Math.min(100, ensureNumber(prev.fitness, 40) + item.effects.fitness),
          clout: prev.clout + item.effects.clout,
          form: Math.max(0, Math.min(100, prev.form + (item.effects.form || 0))),
          passiveIncome: prev.passiveIncome + (item.effects.income || 0),
          inventory: item.type !== 'CONSUMABLE' ? [...prev.inventory, item.id] : prev.inventory
      }));
  };

  const handleTransfer = (newTeam: string, newWage: number) => {
      // Find which league this team is in
      let newLeagueId = 2; // Default
      leagues.forEach(l => {
          if (l.teams.find(t => t.name === newTeam)) newLeagueId = l.id;
      });

      setPlayer(prev => ({
          ...prev,
          team: newTeam,
          wage: newWage,
          leagueId: newLeagueId,
          morale: 100,
          clout: prev.clout + 5000,
          seasonMatchCount: 0 // Resets season progress on transfer
      }));
      
      // Reset tables for new "season" start feel
      initAllLeagues(newTeam, newLeagueId);
      setScreen(AppScreen.HOME);
  };

  const handleUnlockTalent = (talentId: string) => {
      if (player.talentPoints > 0 && !player.talents.includes(talentId)) {
          setPlayer(prev => ({
              ...prev,
              talentPoints: prev.talentPoints - 1,
              talents: [...prev.talents, talentId]
          }));
      }
  };

  const handleEventChoice = (choice: any) => {
      if (currentEvent.isCallUp) {
          setIsInternationalMatch(true);
          setScreen(AppScreen.MATCH);
      } else {
          setPlayer(prev => ({
              ...prev,
              morale: Math.min(100, Math.max(0, ensureNumber(prev.morale, 80) + choice.effect.morale)),
              energy: Math.min(100, Math.max(0, ensureNumber(prev.energy, 100) + choice.effect.energy)),
              fitness: Math.min(100, Math.max(0, ensureNumber(prev.fitness, 40) + choice.effect.fitness)),
              cash: prev.cash + choice.effect.cash,
              clout: prev.clout + choice.effect.clout,
              form: Math.max(0, Math.min(100, prev.form + (choice.effect.form || 0))),
          }));
          setScreen(AppScreen.HOME);
      }
      setCurrentEvent(null);
  };

  const handleQuit = () => {
      if (confirm("Save and return to main menu?")) {
          saveGame();
          setScreen(AppScreen.CREATE_PLAYER);
      }
  };

  const renderScreen = () => {
    switch(screen) {
        case AppScreen.CREATE_PLAYER:
            return <PlayerCreator onCreate={handleCreatePlayer} onLoad={loadGame} hasSaveFile={hasSaveFile} onDeleteSave={deleteSave} />;
        case AppScreen.MATCH:
            if (player.energy < 10) {
                return (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900">
                        <h2 className="text-2xl font-bold text-white mb-2">Too Tired!</h2>
                        <p className="text-slate-400 mb-6">You need at least 10% energy to play a match.</p>
                        <button onClick={() => setScreen(AppScreen.HOME)} className="px-6 py-3 bg-slate-700 text-white rounded-lg">Go Back</button>
                    </div>
                )
            }
            return <MatchEngine 
                player={player} 
                leagueData={leagues} 
                isInternational={isInternationalMatch}
                onMatchEnd={(r) => {
                    handleMatchEnd(r);
                    setIsInternationalMatch(false);
                }} 
            />;
        case AppScreen.SOCIAL:
            return <SocialFeed player={player} onBack={() => setScreen(AppScreen.HOME)} recentEvents={[]} />;
        case AppScreen.TRAINING:
            return <Training player={player} onTrain={handleTrain} onBack={() => setScreen(AppScreen.HOME)} />;
        case AppScreen.LIFESTYLE:
            return <Lifestyle player={player} onBuy={handleBuy} onBack={() => setScreen(AppScreen.HOME)} />;
        case AppScreen.BANK:
            return <Bank player={player} onTransaction={handleTransaction} onBack={() => setScreen(AppScreen.HOME)} />;
        case AppScreen.CLUB:
            return <Club player={player} leagues={leagues} onBack={() => setScreen(AppScreen.HOME)} />;
        case AppScreen.AGENT:
            return <Agent player={player} onTransfer={handleTransfer} onBack={() => setScreen(AppScreen.HOME)} />;
        case AppScreen.PROFILE:
            return <Profile player={player} onBack={() => setScreen(AppScreen.HOME)} />;
        case AppScreen.TALENTS:
            return <TalentTree player={player} onUnlock={handleUnlockTalent} onBack={() => setScreen(AppScreen.HOME)} />;
        default:
            return <Dashboard player={player} week={week} onNavigate={setScreen} onCheat={handleCheat} onSave={saveGame} onQuit={handleQuit} />;
    }
  };

  return (
    <div className="w-full h-full max-w-md mx-auto bg-slate-950 shadow-2xl overflow-hidden relative font-sans text-slate-100">
      
      {currentEvent && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl w-full max-w-sm">
                  <h2 className="text-xl font-bold text-white mb-2">{currentEvent.title}</h2>
                  <p className="text-slate-300 mb-6">{currentEvent.text}</p>
                  <div className="space-y-3">
                      {currentEvent.choices.map((choice: any, idx: number) => (
                          <button 
                            key={idx}
                            onClick={() => handleEventChoice(choice)}
                            className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-left transition-colors"
                          >
                              <p className="font-bold text-white text-sm">{choice.text}</p>
                              {choice.resultText && <p className="text-xs text-slate-400 mt-1">{choice.resultText}</p>}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {renderScreen()}
    </div>
  );
}
