import React, { useMemo } from 'react';
import { PlayerStats, SocialPost } from '../types';
import { Heart, MessageCircle, Share2, ArrowLeft } from 'lucide-react';

interface SocialFeedProps {
  player: PlayerStats;
  onBack: () => void;
  recentEvents: string[]; // Pass recent match events to generate context
}

export const SocialFeed: React.FC<SocialFeedProps> = ({ player, onBack, recentEvents }) => {
  
  // Generate Fake Posts based on stats
  const posts: SocialPost[] = useMemo(() => {
    const data: SocialPost[] = [];
    
    // 1. Static Fan Post
    data.push({
        id: '1',
        handle: '@superfan_99',
        content: `Can't believe ${player.name} is playing for ${player.team}. We need better signings! #transferwindow`,
        likes: 12,
        isPlayerMention: true,
        timestamp: '2h ago'
    });

    // 2. Dynamic Post based on Clout
    if (player.clout > 2000) {
        data.push({
            id: '2',
            handle: '@sportsdaily',
            content: `RUMOR: ${player.name} linked with a move to Division 3? Keep an eye on this talent.`,
            likes: 450,
            isPlayerMention: true,
            timestamp: '5h ago'
        });
    }

    // 3. Dynamic Post based on recent performance (mocked logic)
    if (player.skill > 50) {
         data.push({
            id: '3',
            handle: '@scout_network',
            content: `Watching the development of ${player.name} closely. Technical stats are improving rapidly.`,
            likes: 89,
            isPlayerMention: true,
            timestamp: '1d ago'
        });
    } else {
        data.push({
            id: '4',
            handle: '@local_pundit',
            content: `${player.name} needs to hit the gym. Looking weak on the ball.`,
            likes: 4,
            isPlayerMention: true,
            timestamp: '1d ago'
        });
    }

    return data;
  }, [player]);

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full text-slate-300">
            <ArrowLeft size={20} />
        </button>
        <div>
            <h2 className="font-bold text-white">Social</h2>
            <p className="text-xs text-slate-400">@{player.name.replace(' ', '').toLowerCase()} • {player.clout} Followers</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {posts.map(post => (
            <div key={post.id} className="p-4 border-b border-slate-800 hover:bg-slate-900/50 transition-colors">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0"></div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-sm">{post.handle}</span>
                            <span className="text-slate-500 text-xs">{post.timestamp}</span>
                        </div>
                        <p className="text-slate-300 text-sm mb-3">{post.content}</p>
                        <div className="flex items-center gap-6 text-slate-500">
                            <button className="flex items-center gap-1 text-xs hover:text-pink-500 transition-colors">
                                <Heart size={14} /> {post.likes}
                            </button>
                            <button className="flex items-center gap-1 text-xs hover:text-blue-400 transition-colors">
                                <MessageCircle size={14} />
                            </button>
                            <button className="flex items-center gap-1 text-xs hover:text-green-400 transition-colors">
                                <Share2 size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
        
        {/* End of feed */}
        <div className="p-8 text-center">
            <p className="text-slate-600 text-sm">You're all caught up!</p>
        </div>
      </div>
    </div>
  );
};