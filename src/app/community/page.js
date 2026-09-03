'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    MessageSquare, ThumbsUp, MessageCircle, Shield, AlertTriangle,
    CheckCircle, Send, Users, Loader2, Pill, Leaf, Droplets, XCircle, Sparkles
} from 'lucide-react';

const DOMAIN_STYLES = {
    ALLOPATHY: { label: 'Allopathy', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20', icon: Pill },
    AYURVEDA: { label: 'Ayurveda', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20', icon: Leaf },
    HOMEOPATHY: { label: 'Homeopathy', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20', icon: Droplets },
};

function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export default function CommunityPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [form, setForm] = useState({ content: '', title: '', domain: 'ALLOPATHY' });
    const [liked, setLiked] = useState({});

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchPosts = useCallback(async () => {
        try {
            const res = await fetch('/api/community');
            const data = await res.json();
            if (data.success) setPosts(data.data || []);
        } catch {
            // fallback
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!form.content.trim()) return showToast('Please write something first.', 'error');
        if (!user) return showToast('Please sign in to post.', 'error');
        setSubmitting(true);
        try {
            const res = await fetch('/api/community', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: form.title || form.content.substring(0, 60),
                    content: form.content,
                    domain: form.domain,
                }),
            });
            const data = await res.json();
            if (data.success) {
                showToast('Post submitted for review! It will appear once approved.');
                setForm({ content: '', title: '', domain: 'ALLOPATHY' });
                setTimeout(fetchPosts, 500);
            } else {
                showToast(data.error || 'Failed to submit post.', 'error');
            }
        } catch {
            showToast('Network error. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = (id) => {
        setLiked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] py-12 transition-colors duration-300">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all ${toast.type === 'error'
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    }`}>
                    {toast.type === 'error' ? <XCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                    <span>{toast.msg}</span>
                </div>
            )}

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4 animate-fade-in">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Clinically Monitored Health Exchange</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                        Community Forum
                    </h1>
                    <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-sm leading-relaxed">
                        Share your treatment journey and recovery experiences across Allopathy, Ayurveda, and Homeopathy. All posts are clinically reviewed.
                    </p>
                </div>

                {/* Post Composer */}
                <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-6 mb-8 shadow-sm">
                    {!user && (
                        <p className="text-xs text-[var(--text-muted)] mb-4 p-3.5 bg-[var(--surface-2)] rounded-2xl border border-[var(--border)]">
                            <a href="/login" className="text-blue-600 dark:text-blue-400 font-bold underline mr-1">Sign in</a> to share your health experience with the community.
                        </p>
                    )}
                    <form onSubmit={handlePost}>
                        <div className="flex items-start gap-3.5 mb-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                                {user ? getInitials(user.name) : '?'}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Discussion topic / headline"
                                    className="w-full px-3 py-2 border-0 border-b border-[var(--border)] text-sm font-bold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none mb-2 bg-transparent"
                                />
                                <textarea
                                    value={form.content}
                                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                    placeholder="Share your symptoms, treatments, or questions with verified patients & practitioners..."
                                    rows={3}
                                    className="w-full px-3 py-1 border-0 text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-[var(--text-muted)] font-semibold">Domain:</label>
                                <select
                                    value={form.domain}
                                    onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
                                    className="text-xs border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] rounded-xl px-2.5 py-1.5 outline-none font-medium"
                                >
                                    <option value="ALLOPATHY">Allopathy</option>
                                    <option value="AYURVEDA">Ayurveda</option>
                                    <option value="HOMEOPATHY">Homeopathy</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] text-[var(--text-muted)] hidden sm:flex items-center gap-1 font-mono">
                                    <Shield className="w-3 h-3 text-blue-500" /> Auto-moderated
                                </span>
                                <button
                                    type="submit"
                                    disabled={submitting || !user}
                                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
                                >
                                    {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                    <span>Publish Post</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Posts Feed */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-xs text-[var(--text-muted)] font-mono">Fetching community discussions...</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {posts.length === 0 ? (
                            <div className="text-center py-16 bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-8">
                                <MessageSquare className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-30" />
                                <p className="font-bold text-sm text-[var(--text-primary)]">No discussions yet</p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">Be the first to share your experience!</p>
                            </div>
                        ) : (
                            posts.map(post => {
                                const domainStyle = DOMAIN_STYLES[post.domain] || DOMAIN_STYLES.ALLOPATHY;
                                const isSafe = post.status === 'APPROVED' || post.moderation?.status === 'safe';
                                const isFlagged = post.status === 'FLAGGED' || post.moderation?.status === 'flagged';
                                const isLiked = liked[post.id];

                                return (
                                    <div
                                        key={post.id}
                                        className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-sm card-hover"
                                    >
                                        {/* Moderation Banner */}
                                        {(isSafe || isFlagged) && (
                                            <div className={`px-5 py-2 flex items-center gap-2 text-[11px] font-bold ${isSafe
                                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-b border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-700 dark:text-red-400 border-b border-red-500/20'
                                                }`}>
                                                {isSafe ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                                <span>{isSafe ? 'Clinically Reviewed — Verified Safe' : 'Under Clinical Verification'}</span>
                                            </div>
                                        )}

                                        <div className="p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-9 h-9 rounded-2xl bg-[var(--surface-2)] text-[var(--text-primary)] flex items-center justify-center text-xs font-extrabold border border-[var(--border)]">
                                                    {post.avatar || getInitials(post.author?.name || post.author)}
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">{post.author?.name || post.author}</p>
                                                    <p className="text-[10px] text-[var(--text-muted)] font-mono">
                                                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                                                    </p>
                                                </div>
                                                <span className={`ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${domainStyle.bg}`}>
                                                    {post.domain}
                                                </span>
                                            </div>

                                            {post.title && <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] mb-1.5">{post.title}</h3>}
                                            <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] mb-4">
                                                {post.content}
                                            </p>

                                            <div className="flex items-center gap-6 text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                                                <button
                                                    onClick={() => handleLike(post.id)}
                                                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${isLiked ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600'
                                                        }`}
                                                >
                                                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                                                    <span>{(post.likes || post.upvotes || 0) + (isLiked ? 1 : 0)}</span>
                                                </button>
                                                <div className="flex items-center gap-1.5">
                                                    <MessageCircle className="w-3.5 h-3.5" />
                                                    <span>{post.comments || 0} responses</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
