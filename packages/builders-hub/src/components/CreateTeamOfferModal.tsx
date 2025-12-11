'use client';

import { useState } from 'react';
import { TeamOffer, UserRole } from '@/app/page';

interface CreateTeamOfferModalProps {
  onClose: () => void;
  onCreate: (offer: Omit<TeamOffer, 'id' | 'userId' | 'userName' | 'userRole' | 'appliedMembers' | 'timestamp'>) => void;
}

export function CreateTeamOfferModal({ onClose, onCreate }: CreateTeamOfferModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [neededRoles, setNeededRoles] = useState({
    designer: 0,
    developer: 0,
    writer: 0,
  });

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleRoleChange = (role: UserRole, value: number) => {
    setNeededRoles({
      ...neededRoles,
      [role]: Math.max(0, value),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalRoles = neededRoles.designer + neededRoles.developer + neededRoles.writer;
    
    if (title.trim() && description.trim() && totalRoles > 0) {
      onCreate({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
        linkUrl: linkUrl.trim() || undefined,
        tags,
        neededRoles,
      });
    }
  };

  const roleEmoji = {
    designer: '🎨',
    developer: '💻',
    writer: '✍️',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create Team Offer</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., AI-Powered Task Manager"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project and what you're building..."
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">Image URL (optional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">Link URL (optional)</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/40"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium transition-all"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-purple-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-white/80">Team Members Needed</label>
            <div className="space-y-3">
              {(Object.keys(neededRoles) as UserRole[]).map((role) => (
                <div key={role} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{roleEmoji[role]}</span>
                    <span className="capitalize font-medium">{role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRoleChange(role, neededRoles[role] - 1)}
                      className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{neededRoles[role]}</span>
                    <button
                      type="button"
                      onClick={() => handleRoleChange(role, neededRoles[role] + 1)}
                      className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/50 mt-2">
              Total: {neededRoles.designer + neededRoles.developer + neededRoles.writer} team members
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !description.trim() || (neededRoles.designer + neededRoles.developer + neededRoles.writer) === 0}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

