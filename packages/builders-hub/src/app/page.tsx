'use client';

import { useState, useEffect } from 'react';
import { OnboardingModal } from '@/components/OnboardingModal';
import { Header } from '@/components/Header';
import { PostFeed } from '@/components/PostFeed';
import { TeamOffersFeed } from '@/components/TeamOffersFeed';
import { CreatePostModal } from '@/components/CreatePostModal';
import { CreateTeamOfferModal } from '@/components/CreateTeamOfferModal';

export type UserRole = 'designer' | 'developer' | 'writer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  tags: string[];
  timestamp: number;
}

export interface TeamMember {
  userId: string;
  userName: string;
  role: UserRole;
  status: 'pending' | 'approved';
}

export interface TeamOffer {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  tags: string[];
  neededRoles: {
    designer: number;
    developer: number;
    writer: number;
  };
  appliedMembers: TeamMember[];
  timestamp: number;
}

export default function TeamHub() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'teams'>('posts');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateTeamOffer, setShowCreateTeamOffer] = useState(false);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [teamOffers, setTeamOffers] = useState<TeamOffer[]>([]);

  useEffect(() => {
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem('teamhub_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setShowOnboarding(false);
    }

    // Load posts and team offers
    const savedPosts = localStorage.getItem('teamhub_posts');
    const savedTeamOffers = localStorage.getItem('teamhub_team_offers');
    
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedTeamOffers) setTeamOffers(JSON.parse(savedTeamOffers));
  }, []);

  const handleUserSignup = (name: string, role: UserRole) => {
    const user: User = {
      id: Date.now().toString(),
      name,
      role,
    };
    setCurrentUser(user);
    localStorage.setItem('teamhub_user', JSON.stringify(user));
    setShowOnboarding(false);
  };

  const handleCreatePost = (post: Omit<Post, 'id' | 'userId' | 'userName' | 'userRole' | 'timestamp'>) => {
    if (!currentUser) return;
    
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      timestamp: Date.now(),
    };
    
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('teamhub_posts', JSON.stringify(updatedPosts));
    setShowCreatePost(false);
  };

  const handleCreateTeamOffer = (offer: Omit<TeamOffer, 'id' | 'userId' | 'userName' | 'userRole' | 'appliedMembers' | 'timestamp'>) => {
    if (!currentUser) return;
    
    const newOffer: TeamOffer = {
      ...offer,
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      appliedMembers: [],
      timestamp: Date.now(),
    };
    
    const updatedOffers = [newOffer, ...teamOffers];
    setTeamOffers(updatedOffers);
    localStorage.setItem('teamhub_team_offers', JSON.stringify(updatedOffers));
    setShowCreateTeamOffer(false);
  };

  const handleApplyToTeam = (offerId: string, role: UserRole) => {
    if (!currentUser) return;

    const updatedOffers = teamOffers.map(offer => {
      if (offer.id === offerId) {
        // Check if user already applied
        const alreadyApplied = offer.appliedMembers.some(m => m.userId === currentUser.id);
        if (alreadyApplied) return offer;

        return {
          ...offer,
          appliedMembers: [
            ...offer.appliedMembers,
            {
              userId: currentUser.id,
              userName: currentUser.name,
              role,
              status: 'pending' as const,
            },
          ],
        };
      }
      return offer;
    });

    setTeamOffers(updatedOffers);
    localStorage.setItem('teamhub_team_offers', JSON.stringify(updatedOffers));
  };

  const handleApproveApplication = (offerId: string, userId: string) => {
    const updatedOffers = teamOffers.map(offer => {
      if (offer.id === offerId) {
        return {
          ...offer,
          appliedMembers: offer.appliedMembers.map(member =>
            member.userId === userId ? { ...member, status: 'approved' as const } : member
          ),
        };
      }
      return offer;
    });

    setTeamOffers(updatedOffers);
    localStorage.setItem('teamhub_team_offers', JSON.stringify(updatedOffers));
  };

  const handleRejectApplication = (offerId: string, userId: string) => {
    const updatedOffers = teamOffers.map(offer => {
      if (offer.id === offerId) {
        return {
          ...offer,
          appliedMembers: offer.appliedMembers.filter(member => member.userId !== userId),
        };
      }
      return offer;
    });

    setTeamOffers(updatedOffers);
    localStorage.setItem('teamhub_team_offers', JSON.stringify(updatedOffers));
  };

  const handleLeaveTeam = (offerId: string) => {
    if (!currentUser) return;

    const updatedOffers = teamOffers.map(offer => {
      if (offer.id === offerId) {
        return {
          ...offer,
          appliedMembers: offer.appliedMembers.filter(member => member.userId !== currentUser.id),
        };
      }
      return offer;
    });

    setTeamOffers(updatedOffers);
    localStorage.setItem('teamhub_team_offers', JSON.stringify(updatedOffers));
  };

  if (showOnboarding) {
    return <OnboardingModal onSignup={handleUserSignup} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Aurora background */}
      <div className="fixed inset-0 bg-aurora-layer-1" />
      <div className="fixed inset-0 bg-aurora-layer-2" />
      <div className="fixed inset-0 bg-aurora-layer-3" />
      <div className="fixed inset-0 bg-particles" />

      {/* Content */}
      <div className="relative z-10">
        <Header 
          user={currentUser!} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCreatePost={() => setShowCreatePost(true)}
          onCreateTeamOffer={() => setShowCreateTeamOffer(true)}
        />

        <main className="max-w-4xl mx-auto px-4 py-6">
          {activeTab === 'posts' ? (
            <PostFeed posts={posts} />
          ) : (
            <TeamOffersFeed 
              offers={teamOffers}
              currentUser={currentUser!}
              onApply={handleApplyToTeam}
              onApprove={handleApproveApplication}
              onReject={handleRejectApplication}
              onLeave={handleLeaveTeam}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onCreate={handleCreatePost}
        />
      )}

      {showCreateTeamOffer && (
        <CreateTeamOfferModal
          onClose={() => setShowCreateTeamOffer(false)}
          onCreate={handleCreateTeamOffer}
        />
      )}
    </div>
  );
}

