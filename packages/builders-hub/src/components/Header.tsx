'use client';

import { User } from '@/app/page';

interface HeaderProps {
  user: User;
  activeTab: 'posts' | 'teams';
  onTabChange: (tab: 'posts' | 'teams') => void;
  onCreatePost: () => void;
  onCreateTeamOffer: () => void;
}

export function Header({ user, activeTab, onTabChange, onCreatePost, onCreateTeamOffer }: HeaderProps) {
  const roleEmoji = {
    designer: '🎨',
    developer: '💻',
    writer: '✍️',
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              TeamHub
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-sm">
              {roleEmoji[user.role]} {user.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange('posts')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'posts'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => onTabChange('teams')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'teams'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Team Offers
          </button>
          <button
            onClick={activeTab === 'posts' ? onCreatePost : onCreateTeamOffer}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            + Create
          </button>
        </div>
      </div>
    </header>
  );
}

