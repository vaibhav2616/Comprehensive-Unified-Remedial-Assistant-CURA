'use client';
import { useState } from 'react';
import {
    MessageSquare, ThumbsUp, MessageCircle, Shield, AlertTriangle,
    CheckCircle, Send, Users, Filter
} from 'lucide-react';
import { communityPosts } from '@/data/mockData';

export default function CommunityPage() {
    const [newPost, setNewPost] = useState('');

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--hc-green-lt)] border border-[#a3d8bf] rounded-full text-sm text-[var(--hc-green)] mb-4">
                        <Shield className="w-4 h-4" />
                        Clinically Monitored Health Community
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                        <Users className="w-8 h-8 inline-block mr-2 text-emerald-600" />
                        Community Forum
                    </h1>
                    <p className="text-[var(--gray-500)] max-w-xl mx-auto">
                        Share your health journey with fellow patients. All posts are reviewed by our clinical system to ensure medical safety.
                    </p>
                </div>

                {/* Post Composer */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--med-blue)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            AM
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="Share your experience, ask a question, or support others..."
                                rows={3}
                                className="w-full px-0 py-1 border-0 focus:ring-0 text-sm text-slate-700 placeholder-slate-400 resize-none outline-none"
                            />
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <p className="text-[10px] text-[var(--gray-400)] flex items-center gap-1">
                                    <Shield className="w-3 h-3 text-[var(--med-blue)]" /> Posts are monitored for medical safety
                                </p>
                                <button className="flex items-center gap-2 px-5 py-2 bg-[var(--med-blue)] text-white rounded-md text-sm font-medium hover:bg-[var(--med-blue-2)] transition-colors">
                                    <Send className="w-4 h-4" />
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-5">
                    {communityPosts.map(post => (
                        <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Moderation Banner */}
                            <div className={`px-5 py-2 flex items-center gap-2 text-xs font-semibold
                ${post.moderation.status === 'safe'
                                    ? 'bg-emerald-50 text-emerald-700 border-b border-emerald-100'
                                    : 'bg-red-50 text-red-700 border-b border-red-100'}`}
                            >
                                {post.moderation.status === 'safe' ? (
                                    <CheckCircle className="w-3.5 h-3.5" />
                                ) : (
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                )}
                                {post.moderation.label}
                            </div>

                            <div className="p-5">
                                {/* Author */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                                        {post.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{post.author}</p>
                                        <p className="text-[10px] text-slate-400">{new Date(post.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <p className={`text-sm leading-relaxed mb-4 ${post.moderation.status === 'flagged' ? 'text-slate-600' : 'text-slate-700'}`}>
                                    {post.moderation.status === 'flagged' && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-[10px] font-bold mr-2 mb-1">
                                            <AlertTriangle className="w-3 h-3" /> FLAGGED
                                        </span>
                                    )}
                                    {post.content}
                                </p>

                                {/* Moderation Reason */}
                                {post.moderation.status === 'flagged' && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                                        <p className="text-xs text-red-700 flex items-start gap-2">
                                            <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                            <span><strong>Clinical Safety Review:</strong> {post.moderation.reason}</span>
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-6 text-xs text-slate-400">
                                    <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                        <ThumbsUp className="w-3.5 h-3.5" /> {post.likes}
                                    </button>
                                    <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                        <MessageCircle className="w-3.5 h-3.5" /> {post.comments} comments
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// commit-touch: 2026-08-16 14:00:00

// commit-touch: 2026-08-30 10:00:00

// commit-touch: shubhamsoni1234 2026-08-16 14:00:00

// commit-touch: shubhamsoni1234 2026-08-30 10:00:00

// commit-touch: shubhamsoni1234 2026-08-16 14:00:00

// commit-touch: shubhamsoni1234 2026-08-30 10:00:00

// commit-touch: shubhamsoni1234 2026-08-16 14:00:00
