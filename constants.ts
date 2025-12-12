import { Coffee, ShoppingBag, Gamepad2, Zap, Shirt, Car, Home, Footprints, Medal, Briefcase, Crosshair, Users, Heart, Star, Anchor, Brain } from 'lucide-react';

export const INITIAL_STATS = {
  energy: 100,
  morale: 80,
  cash: 100,
  wage: 100, 
  attacking: 40,
  technique: 40,
  fitness: 40,
  form: 50, 
  clout: 1200,
  name: "Rookie One",
  team: "Sunday League FC",
  leagueId: 2, 
  nationality: "England",
  caps: 0,
  internationalGoals: 0,
  inventory: [] as string[],
  passiveIncome: 0,
  goalsScored: 0,
  assists: 0,
  matchesPlayed: 0,
  seasonMatchCount: 0,
  talentPoints: 0,
  talents: [] as string[],
  relationships: {
      manager: 50,
      team: 50,
      fans: 10
  }
};

export const COLORS = {
  energy: '#22c55e', 
  morale: '#3b82f6', 
  cash: '#eab308',   
  clout: '#a855f7',  
};

export const MATCH_DURATION = 90;
export const ENERGY_COST_MATCH = 30;
export const ENERGY_COST_TRAIN = 20;
export const GAMES_PER_SEASON = 18;

// --- TALENT TREE ---

export const TALENTS = [
    {
        id: 'poacher',
        name: 'The Poacher',
        description: 'Increases goal probability inside the box.',
        icon: Crosshair,
        color: 'text-red-400',
        bg: 'bg-red-500'
    },
    {
        id: 'engine',
        name: 'The Engine',
        description: 'Reduces fitness drain during matches.',
        icon: Anchor,
        color: 'text-orange-400',
        bg: 'bg-orange-500'
    },
    {
        id: 'maestro',
        name: 'Midfield Maestro',
        description: 'Boosts team possession stats slightly.',
        icon: Brain,
        color: 'text-blue-400',
        bg: 'bg-blue-500'
    },
    {
        id: 'leader',
        name: 'Locker Room Leader',
        description: 'Prevents morale drops after losses.',
        icon: Users,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500'
    },
    {
        id: 'darling',
        name: 'Media Darling',
        description: '+20% Clout gain from all sources.',
        icon: Star,
        color: 'text-purple-400',
        bg: 'bg-purple-500'
    },
    {
        id: 'clutch',
        name: 'Clutch Gene',
        description: 'Boosts stats in the final 10 minutes of a match.',
        icon: Zap,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500'
    }
];

// --- LEAGUE STRUCTURE ---

export const LEAGUE_NAMES = [
    "Premier Division", // Tier 1
    "The Championship", // Tier 2
    "League One"        // Tier 3
];

export const TIER_1_TEAMS = [
  "Manchester Blue", "Manchester Red", "London Cannons", "North London Whites",
  "Merseyside Red", "Merseyside Blue", "Chelsea Blues", "Newcastle Stripes",
  "Villa Midlands", "West Ham Irons"
];

export const TIER_2_TEAMS = [
  "Leeds United", "Sunderland Cats", "Leicester Foxes", "Southampton Saints",
  "Norwich Canaries", "Watford Hornets", "West Brom Baggies", "Stoke Potters",
  "Middlesbrough Boro", "Blackburn Rovers"
];

export const TIER_3_TEAMS = [
  "Wrexham Dragons", "Birmingham Blues", "Huddersfield Terriers", "Bolton Wanderers",
  "Charlton Athletic", "Reading Royals", "Wigan Latics", "Blackpool Tangerines",
  "Portsmouth Pompey", "Derby Rams"
];

export const INTERNATIONAL_TEAMS = [
    "France", "Germany", "Brazil", "Argentina", "Spain", "Italy", "Netherlands", "Portugal", "Belgium"
];

export const ALL_CLUBS = [...TIER_1_TEAMS, ...TIER_2_TEAMS, ...TIER_3_TEAMS];

export const STARTER_CLUBS = [
    {
        name: "Wrexham Dragons",
        description: "Hollywood owners, big dreams.",
        wage: 90,
        signingBonus: 100,
        colors: "text-red-500",
        bg: "bg-red-500"
    },
    {
        name: "Portsmouth Pompey",
        description: "Historic club with loud fans.",
        wage: 80,
        signingBonus: 0,
        colors: "text-blue-600",
        bg: "bg-blue-600"
    },
    {
        name: "Derby Rams",
        description: "Sleeping giant needing a hero.",
        wage: 120,
        signingBonus: 50,
        colors: "text-slate-200",
        bg: "bg-slate-700"
    }
];

export const SQUAD_NAMES = [
  "J. Smith (GK)",
  "M. Rossi (DEF)",
  "K. Tanaka (DEF)",
  "L. Silva (DEF)",
  "P. Jones (MID)",
  "A. Ivanov (MID)",
  "C. Gallagher (MID)",
  "B. Meyer (FW)",
  "T. O'Connor (FW)"
];

export const LIFESTYLE_ITEMS = [
    { 
        id: 'energy_drink', 
        name: "Energy Drink", 
        type: 'CONSUMABLE',
        cost: 25, 
        effects: { energy: 30, morale: 0, attacking: 0, technique: 0, fitness: 0, clout: 0, form: 0, income: 0 },
        description: "Quick boost to get back on the pitch.",
        icon: Coffee, 
        color: "text-yellow-400" 
    },
    { 
        id: 'video_game', 
        name: "New Video Game", 
        type: 'CONSUMABLE',
        cost: 60, 
        effects: { energy: -5, morale: 25, attacking: 0, technique: 0, fitness: 0, clout: 0, form: 0, income: 0 }, 
        description: "Relax and recover mental state.",
        icon: Gamepad2, 
        color: "text-purple-400" 
    },
    { 
        id: 'party', 
        name: "Host House Party", 
        type: 'CONSUMABLE',
        cost: 200, 
        effects: { energy: -20, morale: 50, attacking: 0, technique: 0, fitness: 0, clout: 100, form: -10, income: 0 }, 
        description: "Great for morale, bad for sleep.",
        icon: Zap, 
        color: "text-pink-400" 
    },
    { 
        id: 'boots_speed', 
        name: "Speedster Boots", 
        type: 'GEAR',
        cost: 500, 
        effects: { energy: 0, morale: 10, attacking: 0, technique: 0, fitness: 5, clout: 0, form: 0, income: 0 }, 
        description: "Lightweight. Permanently +5 Fitness.",
        icon: Footprints, 
        color: "text-orange-400" 
    },
    { 
        id: 'boots_precision', 
        name: "Sniper Boots", 
        type: 'GEAR',
        cost: 750, 
        effects: { energy: 0, morale: 10, attacking: 5, technique: 0, fitness: 0, clout: 0, form: 0, income: 0 }, 
        description: "Enhanced grip. Permanently +5 Attacking.",
        icon: Footprints, 
        color: "text-red-400" 
    },
    { 
        id: 'smart_watch', 
        name: "Pro Smart Watch", 
        type: 'GEAR',
        cost: 1000, 
        effects: { energy: 0, morale: 5, attacking: 0, technique: 5, fitness: 0, clout: 0, form: 0, income: 0 }, 
        description: "Track metrics. Permanently +5 Technique.",
        icon: Medal, 
        color: "text-blue-400" 
    },
    { 
        id: 'rental_property', 
        name: "Rental Property", 
        type: 'ASSET',
        cost: 10000, 
        effects: { energy: 0, morale: 0, attacking: 0, technique: 0, fitness: 0, clout: 0, form: 0, income: 100 }, 
        description: "Passive Income: $100/week.",
        icon: Home, 
        color: "text-emerald-500" 
    },
    { 
        id: 'sports_car', 
        name: "Sports Car", 
        type: 'ASSET',
        cost: 15000, 
        effects: { energy: 0, morale: 50, attacking: 0, technique: 0, fitness: 0, clout: 25000, form: 0, income: 0 }, 
        description: "Turn heads. +25,000 Followers.",
        icon: Car, 
        color: "text-red-600" 
    },
    { 
        id: 'brand_deal', 
        name: "Clothing Brand", 
        type: 'ASSET',
        cost: 50000, 
        effects: { energy: 0, morale: 10, attacking: 0, technique: 0, fitness: 0, clout: 50000, form: 0, income: 500 }, 
        description: "Own a label. $500/week + Clout.",
        icon: Shirt, 
        color: "text-indigo-400" 
    },
];

export const NARRATIVE_EVENTS = [
    {
        title: "Fan Interaction",
        text: "A group of young fans asks for your autograph after training.",
        choices: [
            {
                text: "Sign everything (+Morale)",
                effect: { morale: 10, energy: -5, fitness: 0, cash: 0, clout: 50, form: 0 },
                resultText: "The fans are delighted!"
            },
            {
                text: "Ignore them (-Clout)",
                effect: { morale: 0, energy: 0, fitness: 0, cash: 0, clout: -50, form: 0 },
                resultText: "Social media is not happy about this."
            }
        ]
    },
    {
        title: "Extra Training",
        text: "The coach offers a late-night tactical session.",
        choices: [
            {
                text: "Attend (+Form, -Energy)",
                effect: { morale: 0, energy: -15, fitness: 0, cash: 0, clout: 0, form: 5 },
                resultText: "You feel sharper for the next match."
            },
            {
                text: "Go home to rest (+Energy)",
                effect: { morale: 0, energy: 10, fitness: 0, cash: 0, clout: 0, form: -2 },
                resultText: "A good night's sleep does wonders."
            }
        ]
    },
    {
        title: "Sponsorship Opportunity",
        text: "A local car dealership wants you for a quick commercial.",
        choices: [
            {
                text: "Do the ad (+$500)",
                effect: { morale: -5, energy: -5, fitness: 0, cash: 500, clout: 20, form: 0 },
                resultText: "It was cheesy, but it pays the bills."
            },
            {
                text: "Focus on football",
                effect: { morale: 5, energy: 0, fitness: 0, cash: 0, clout: 0, form: 0 },
                resultText: "Dedication is key."
            }
        ]
    },
    {
        title: "Team Bonding",
        text: "The squad is going out for a team dinner.",
        choices: [
            {
                text: "Join them (-$50, +Morale)",
                effect: { morale: 15, energy: -5, fitness: 0, cash: -50, clout: 0, form: 0 },
                resultText: "Great vibes in the squad."
            },
            {
                text: "Stay in",
                effect: { morale: -5, energy: 5, fitness: 0, cash: 0, clout: 0, form: 0 },
                resultText: "You saved some money."
            }
        ]
    }
];
