'use client';

import { useState } from 'react';
import { TeamOffer, User, UserRole } from '@/app/page';
import Image from 'next/image';

interface TeamOffersFeedProps {
  offers: TeamOffer[];
  currentUser: User;
  onApply: (offerId: string, role: UserRole) => void;
  onApprove: (offerId: string, userId: string) => void;
  onReject: (offerId: string, userId: string) => void;
  onLeave: (offerId: string) => void;
}

export function TeamOffersFeed({ offers, currentUser, onApply, onApprove, onReject, onLeave }: TeamOffersFeedProps) {
  const [showLeaveConfirm, setShowLeaveConfirm] = useState<string | null>(null);

  const roleEmoji = {
    designer: '🎨',
    developer: '💻',
    writer: '✍️',
  };

  const getAvailableRoles = (offer: TeamOffer) => {
    const approved = offer.appliedMembers.filter(m => m.status === 'approved');
    const counts = {
      designer: approved.filter(m => m.role === 'designer').length,
      developer: approved.filter(m => m.role === 'developer').length,
      writer: approved.filter(m => m.role === 'writer').length,
    };

    return {
      designer: offer.neededRoles.designer - counts.designer,
      developer: offer.neededRoles.developer - counts.developer,
      writer: offer.neededRoles.writer - counts.writer,
    };
  };

  const getUserStatus = (offer: TeamOffer) => {
    const member = offer.appliedMembers.find(m => m.userId === currentUser.id);
    return member ? member.status : null;
  };

  const canApply = (offer: TeamOffer) => {
    const status = getUserStatus(offer);
    if (status) return false;
    
    const available = getAvailableRoles(offer);
    return available[currentUser.role] > 0;
  };

  const isOwner = (offer: TeamOffer) => offer.userId === currentUser.id;

  const handleLeaveClick = (offerId: string) => {
    setShowLeaveConfirm(offerId);
  };

  const confirmLeave = (offerId: string) => {
    onLeave(offerId);
    setShowLeaveConfirm(null);
  };

  // Filter offers to show suggestions based on user's role
  const suggestedOffers = offers.filter(offer => {
    const available = getAvailableRoles(offer);
    return available[currentUser.role] > 0 && !getUserStatus(offer);
  });

  const otherOffers = offers.filter(offer => {
    const available = getAvailableRoles(offer);
    return available[currentUser.role] <= 0 || getUserStatus(offer);
  });

  if (offers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🚀</div>
        <h3 className="text-xl font-medium text-white/80 mb-2">No team offers yet</h3>
        <p className="text-white/50">Create the first project and find your team!</p>
      </div>
    );
  }

  const renderOffer = (offer: TeamOffer) => {
    const available = getAvailableRoles(offer);
    const status = getUserStatus(offer);
    const owner = isOwner(offer);
    const pendingApplications = offer.appliedMembers.filter(m => m.status === 'pending');
    const approvedMembers = offer.appliedMembers.filter(m => m.status === 'approved');

    return (
      <div
        key={offer.id}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl">
            {roleEmoji[offer.userRole]}
          </div>
          <div>
            <div className="font-medium">{offer.userName}</div>
            <div className="text-sm text-white/50 capitalize">{offer.userRole}</div>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
        <p className="text-white/80 mb-4 whitespace-pre-wrap">{offer.description}</p>

        {offer.imageUrl && (
          <div className="relative w-full h-96 mb-4">
            <Image
              src={offer.imageUrl}
              alt="Project image"
              fill
              className="rounded-lg object-cover"
              unoptimized
            />
          </div>
        )}

        {offer.linkUrl && (
          <a
            href={offer.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
          >
            🔗 {offer.linkUrl}
          </a>
        )}

        {offer.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {offer.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-white/10 pt-4 mt-4">
          <h4 className="text-sm font-medium text-white/60 mb-3">Looking for:</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {(Object.keys(available) as UserRole[]).map((role) => {
              const count = available[role];
              if (offer.neededRoles[role] === 0) return null;
              
              return (
                <div
                  key={role}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    count > 0
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}
                >
                  {roleEmoji[role]} {role} ({count}/{offer.neededRoles[role]} open)
                </div>
              );
            })}
          </div>

          {approvedMembers.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-white/60 mb-2">Team Members:</h4>
              <div className="space-y-2">
                {approvedMembers.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span>{roleEmoji[member.role]}</span>
                      <span className="text-sm">
                        {member.userName}
                        {member.userId === currentUser.id && ' (You)'}
                      </span>
                      <span className="text-xs text-white/40 capitalize">• {member.role}</span>
                    </div>
                    {member.userId === currentUser.id && (
                      <button
                        onClick={() => handleLeaveClick(offer.id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Leave
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {owner && pendingApplications.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-white/60 mb-2">Pending Applications:</h4>
              <div className="space-y-2">
                {pendingApplications.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span>{roleEmoji[member.role]}</span>
                      <span className="text-sm">{member.userName}</span>
                      <span className="text-xs text-white/40 capitalize">• {member.role}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApprove(offer.id, member.userId)}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-xs font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(offer.id, member.userId)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-xs font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!owner && status === 'pending' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2 text-sm text-yellow-300">
              ⏳ Application pending approval
            </div>
          )}

          {!owner && status === 'approved' && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 text-sm text-green-300">
              ✅ You&apos;re part of this team!
            </div>
          )}

          {!owner && !status && canApply(offer) && (
            <button
              onClick={() => onApply(offer.id, currentUser.role)}
              className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              Apply as {currentUser.role}
            </button>
          )}

          {!owner && !status && !canApply(offer) && (
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/40 text-center">
              No {currentUser.role} positions available
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {suggestedOffers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>✨</span>
            <span>Suggested for you</span>
          </h2>
          <div className="space-y-4">
            {suggestedOffers.map(renderOffer)}
          </div>
        </div>
      )}

      {otherOffers.length > 0 && (
        <div>
          {suggestedOffers.length > 0 && (
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📋</span>
              <span>All Projects</span>
            </h2>
          )}
          <div className="space-y-4">
            {otherOffers.map(renderOffer)}
          </div>
        </div>
      )}

      {/* Leave confirmation modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold mb-2">Leave Team?</h3>
            <p className="text-white/70 mb-6">
              Are you sure you want to leave this team? Your role will become available for others to apply.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveConfirm(null)}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmLeave(showLeaveConfirm)}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-all"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



