'use client';

import { useState } from 'react';
import { UserRole } from '@/app/page';

interface OnboardingModalProps {
  onSignup: (name: string, role: UserRole) => void;
}

export function OnboardingModal({ onSignup }: OnboardingModalProps) {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedRole) {
      onSignup(name.trim(), selectedRole);
    }
  };

  const roles: { value: UserRole; label: string; icon: string; description: string }[] = [
    { value: 'designer', label: 'Designer', icon: '🎨', description: 'UI/UX, Graphics, Branding' },
    { value: 'developer', label: 'Developer', icon: '💻', description: 'Frontend, Backend, Full-stack' },
    { value: 'writer', label: 'Writer', icon: '✍️', description: 'Content, Copy, Documentation' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Welcome to TeamHub
            </h1>
            <p className="text-white/60">Connect, collaborate, and build together</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-white/80">I am a...</label>
              <div className="space-y-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedRole === role.value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{role.icon}</span>
                      <div>
                        <div className="font-medium text-white">{role.label}</div>
                        <div className="text-sm text-white/50">{role.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim() || !selectedRole}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

