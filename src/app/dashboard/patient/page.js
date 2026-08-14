'use client';
import { useState } from 'react';
import {
    Pill, Clock, CheckCircle, Circle, AlertCircle, TrendingUp,
    Calendar, MessageCircle, Send, Bot, User, Heart,
    Activity, FileText, Bell
} from 'lucide-react';
import { patientDashboardData, DOMAIN_COLORS, DOMAINS } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function PatientDashboard() {
    const { activePrescription, appointments } = useApp();
    const { patient, reminders, progressReports, wellnessChatHistory } = patientDashboardData;
    const [chatMessages, setChatMessages] = useState(wellnessChatHistory || []);
    const [chatInput, setChatInput] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    const handleSendChat = () => {
        if (!chatInput.trim()) return;
        const userMsg = { id: `chat-${Date.now()}`, role: 'user', content: chatInput, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setChatMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setTimeout(() => {
            const botMsg = {
                id: `chat-${Date.now() + 1}`, role: 'assistant',
                content: 'I hear you, and your feelings are completely valid. Remember, recovery is not a straight line — small steps count. How about we reflect on one positive thing from today? 💙',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setChatMessages(prev => [...prev, botMsg]);
        }, 1200);
    };

    const tabs = [
        { key: 'overview', label: 'Overview', icon: Activity },
        { key: 'prescriptions', label: 'Prescriptions', icon: FileText },
        { key: 'reminders', label: 'Reminders', icon: Bell },
        { key: 'companion', label: 'Wellness Guide', icon: Bot },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Welcome back, {patient.name}</h1>
                        <p className="text-slate-500 text-sm mt-1">Your health dashboard · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-200">🩸 {patient.bloodGroup}</span>
                        {patient.allergies.map(a => (
                            <span key={a} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">⚠ {a}</span>
                        ))}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                ${activeTab === key ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'bg-white text-slate-600 hover:bg-blue-50 border border-slate-200'}`}
                        >
                            <Icon className="w-4 h-4" /> {label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Quick Stats */}
                        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatCard icon={Pill} label="Active Meds" value={activePrescription?.medications.length || 4} color="blue" />
                            <StatCard icon={Calendar} label="Appointments" value={appointments.length} color="emerald" />
                            <StatCard icon={TrendingUp} label="Reports" value={progressReports.length} color="purple" />
                            <StatCard icon={Clock} label="Pending Meds" value={reminders.filter(r => !r.taken).length} color="amber" />
                        </div>

                        {/* Today's Reminders */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" /> Today's Medications
                            </h3>
                            <div className="space-y-3">
                                {reminders.map(rem => (
                                    <div key={rem.id} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${rem.taken ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                                        {rem.taken ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                                        )}
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${rem.taken ? 'text-emerald-700 line-through' : 'text-slate-800'}`}>{rem.medication}</p>
                                            <p className="text-xs text-slate-400">{rem.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Progress Reports */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-600" /> Doctor Progress Reports
                            </h3>
                            <div className="space-y-4">
                                {progressReports.map(report => (
                                    <div key={report.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-slate-800">{report.doctor}</span>
                                                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold badge-allopathy`}>{report.domain}</span>
                                            </div>
                                            <span className="text-xs text-slate-400">{report.date}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{report.summary}</p>
                                        <span className={`inline-flex items-center gap-1 mt-2 text-xs font-semibold
                      ${report.status === 'improving' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                            {report.status === 'improving' ? <TrendingUp className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Prescriptions Tab */}
                {activeTab === 'prescriptions' && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Pill className="w-5 h-5 text-blue-600" /> Active Prescriptions
                        </h3>
                        {activePrescription ? (
                            <div className="divide-y divide-slate-100">
                                {activePrescription.medications.map(med => (
                                    <div key={med.id} className="py-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: DOMAIN_COLORS[med.domain]?.light }}>
                                            <Pill className="w-5 h-5" style={{ color: DOMAIN_COLORS[med.domain]?.bg }} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-800">{med.name}</p>
                                            <p className="text-xs text-slate-400">{med.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-slate-700">{med.dosage}</p>
                                            <p className="text-xs text-slate-400">{med.frequency}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-400">
                                <Pill className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>No prescription uploaded yet. <a href="/prescription" className="text-blue-600 underline">Upload one now</a></p>
                            </div>
                        )}
                    </div>
                )}

                {/* Reminders Tab */}
                {activeTab === 'reminders' && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-amber-500" /> Medication Schedule
                        </h3>
                        <div className="space-y-3">
                            {reminders.map(rem => (
                                <div key={rem.id} className={`flex items-center gap-4 p-4 rounded-xl border ${rem.taken ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                                    {rem.taken ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6 text-slate-300" />}
                                    <div className="flex-1">
                                        <p className={`font-medium ${rem.taken ? 'text-emerald-700 line-through' : 'text-slate-800'}`}>{rem.medication}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${rem.taken ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {rem.time}
                                    </span>
                                    <span className={`text-xs font-semibold ${rem.taken ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        {rem.taken ? '✓ Taken' : 'Pending'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Wellness Guide Tab */}
                {activeTab === 'companion' && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden max-w-2xl mx-auto">
                        {/* Chat Header */}
                        <div className="px-6 py-4 bg-[var(--navy)] flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-[var(--sky-light)]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">CURA Wellness Guide</h3>
                                <p className="text-blue-100 text-xs">Mental health support & wellness guidance</p>
                            </div>
                            <Heart className="w-4 h-4 text-red-300 ml-auto" />
                        </div>

                        {/* Messages */}
                        <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${msg.role === 'assistant' ? 'bg-blue-100' : 'bg-slate-200'}`}>
                                        {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4 text-slate-600" />}
                                    </div>
                                    <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                    ${msg.role === 'assistant' ? 'bg-white border border-slate-200 text-slate-700' : 'bg-blue-600 text-white'}`}>
                                        {msg.content}
                                        <div className={`text-[10px] mt-1 ${msg.role === 'assistant' ? 'text-slate-400' : 'text-blue-200'}`}>{msg.timestamp}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 border-t border-slate-200 flex items-center gap-3">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                placeholder="Share how you're feeling..."
                                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                onClick={handleSendChat}
                                className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    const colors = {
        blue: 'from-blue-500 to-blue-600',
        emerald: 'from-emerald-500 to-emerald-600',
        purple: 'from-purple-500 to-purple-600',
        amber: 'from-amber-500 to-amber-600',
    };
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl bg-[var(--med-blue)] flex items-center justify-center mb-3 shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
        </div>
    );
}

// commit-touch: 2026-08-14 11:00:00

// commit-touch: 2026-08-14 15:30:00

// commit-touch: tusharsingh1206 2026-08-14 11:00:00

// commit-touch: shubhamsoni1234 2026-08-14 15:30:00

// commit-touch: tusharsingh1206 2026-08-14 11:00:00

// commit-touch: shubhamsoni1234 2026-08-14 15:30:00

// commit-touch: tusharsingh1206 2026-08-14 11:00:00

// commit-touch: shubhamsoni1234 2026-08-14 15:30:00
