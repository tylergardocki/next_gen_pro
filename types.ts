
export enum AppScreen {
  CREATE_PLAYER = 'CREATE_PLAYER',
  HOME = 'HOME',
  MATCH = 'MATCH',
  SOCIAL = 'SOCIAL',
  TRAINING = 'TRAINING',
  LIFESTYLE = 'LIFESTYLE',
  PROFILE = 'PROFILE',
  BANK = 'BANK',
  CLUB = 'CLUB',
  AGENT = 'AGENT',
  TALENTS = 'TALENTS'
}

export enum Playstyle {
    BALANCED = 'BALANCED',
    AGGRESSIVE = 'AGGRESSIVE',
    DEFENSIVE = 'DEFENSIVE'
}

export interface PlayerStats {
  energy: number; // 0-100
  morale: number; // 0-100
  cash: number;
  
  // RPG Attributes
  attacking: number; // 1-100
  technique: number; // 1-100
  fitness: number; // 1-100
  form: number; // 0-100, dynamic performance multiplier
  
  clout: number; // Followers count
  name: string;
  position: string;
  team: string;
  leagueId: number; // 0 = Premier, 1 = Champ, 2 = League One
  
  // National Team
  nationality: string;
  caps: number;
  internationalGoals: number;

  // Economy/Inventory
  wage: number;
  passiveIncome: number; // Weekly earnings
  inventory: string[]; // IDs of owned items

  // Career Stats
  goalsScored: number;
  assists: number;
  matchesPlayed: number;
  seasonMatchCount: number; // Tracks progress to season end (18 games)

  // New Features
  talentPoints: number;
  talents: string[]; // IDs of unlocked talents
  relationships: {
      manager: number; // 0-100
      team: number; // 0-100
      fans: number; // 0-100
  };
}

export interface SocialPost {
  id: string;
  handle: string;
  content: string;
  likes: number;
  isPlayerMention: boolean;
  timestamp: string;
}

export enum MatchPhase {
  PRE_MATCH = 'PRE_MATCH',
  TACTICS = 'TACTICS',
  SIMULATING = 'SIMULATING',
  HALF_TIME = 'HALF_TIME',
  FULL_TIME = 'FULL_TIME',
  INTERVIEW = 'INTERVIEW'
}

export interface MatchEvent {
    minute: number;
    text: string;
    type: 'GOAL' | 'CHANCE' | 'FOUL' | 'NORMAL' | 'WHISTLE' | 'HERO';
    team: 'HOME' | 'AWAY' | 'NEUTRAL';
}

export interface MatchState {
  minute: number;
  homeScore: number;
  awayScore: number;
  possession: number; // 0-100
  momentum: number; // -50 to 50
  logs: MatchEvent[]; // Detailed event history
  rating: number; // Player rating
  goalsScored: number;
  assists: number;
  shots: number; // Home shots
  opponentShots: number; // Away shots
  expensesDeducted?: number; 
  isInternational?: boolean;
}

export interface FixtureResult {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

export interface MatchResult {
    homeScore: number;
    awayScore: number;
    opponent: string;
    goals: number;
    rating: number;
    expenses: number;
    isInternational: boolean;
    interviewEffect?: {
        manager: number;
        team: number;
        fans: number;
    };
}

export interface TeamStanding {
    name: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    points: number;
    gd: number; // Goal Difference
}

export interface LeagueData {
    id: number;
    name: string;
    tier: number; // 1, 2, 3
    teams: TeamStanding[];
}

export interface SaveData {
    player: PlayerStats; 
    week: number;
    leagues: LeagueData[];
    lastSaved: string;
}
