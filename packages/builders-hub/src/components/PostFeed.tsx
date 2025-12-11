'use client';

import { Post } from '@/app/page';
import Image from 'next/image';

interface PostFeedProps {
  posts: Post[];
}

export function PostFeed({ posts }: PostFeedProps) {
  const roleEmoji = {
    designer: '🎨',
    developer: '💻',
    writer: '✍️',
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-medium text-white/80 mb-2">No posts yet</h3>
        <p className="text-white/50">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl">
              {roleEmoji[post.userRole]}
            </div>
            <div>
              <div className="font-medium">{post.userName}</div>
              <div className="text-sm text-white/50 capitalize">{post.userRole}</div>
            </div>
          </div>

          <p className="text-white/90 mb-4 whitespace-pre-wrap">{post.content}</p>

          {post.imageUrl && (
            <div className="relative w-full h-96 mb-4">
              <Image
                src={post.imageUrl}
                alt="Post image"
                fill
                className="rounded-lg object-cover"
                unoptimized
              />
            </div>
          )}

          {post.linkUrl && (
            <a
              href={post.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
            >
              🔗 {post.linkUrl}
            </a>
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


