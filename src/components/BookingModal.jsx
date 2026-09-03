'use client';
import { useForm } from 'react-hook-form';
import { X, Calendar, Clock, Video, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { DOMAIN_COLORS } from '@/data/mockData';

export default function BookingModal({ doctor, onClose }) {
    const { user } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();

    const domainColor = DOMAIN_COLORS[doctor.domain] || { bg: '#3B82F6', light: 'rgba(59, 130, 246, 0.12)' };

    const onSubmit = async (data) => {
        setSubmitting(true);
        setApiError('');
        try {
            const slotDateTime = new Date(`${data.date} ${data.time}`).toISOString();

            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId: doctor.userId || doctor.id,
                    slot: slotDateTime,
                    type: data.consultationType,
                    domain: doctor.domain,
                    reason: data.notes || '',
                    fee: doctor.cost,
                }),
            });

            const responseData = await res.json();

            if (res.ok && responseData.success) {
                setSubmitted(true);
            } else {
                setApiError(responseData.error || 'Booking failed. Please try again.');
            }
        } catch {
            setApiError('Network error. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-[var(--surface)] text-[var(--text-primary)] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[var(--border)] animate-fade-up">
                {submitted ? (
                    <div className="p-10 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-extrabold mb-2">Appointment Booked!</h2>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 max-w-sm mx-auto leading-relaxed">
                            Your consultation with <strong>{doctor.name}</strong> is scheduled. You will receive an appointment reminder and telemedicine access link.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-700 transition shadow-md"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">Schedule Consultation</h2>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">{doctor.name} · {doctor.specialization}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Login required message */}
                        {!user && (
                            <div className="mx-6 mt-4 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-700 dark:text-amber-300">
                                Please <a href="/login" className="font-bold underline ml-1">sign in</a> to book your clinical appointment.
                            </div>
                        )}

                        {/* API Error */}
                        {apiError && (
                            <div className="mx-6 mt-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-600 dark:text-red-400">
                                {apiError}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> Date
                                    </label>
                                    <input
                                        type="date"
                                        {...register('date', { required: 'Date is required' })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-xl text-xs sm:text-sm bg-[var(--surface-2)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.date && <p className="text-[11px] text-red-500 mt-1">{errors.date.message}</p>}
                                </div>
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                        <Clock className="w-3.5 h-3.5" /> Time
                                    </label>
                                    <select
                                        {...register('time', { required: 'Time is required' })}
                                        className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-xl text-xs sm:text-sm bg-[var(--surface-2)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select time</option>
                                        <option value="09:00 AM">09:00 AM</option>
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="10:30 AM">10:30 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                        <option value="02:00 PM">02:00 PM</option>
                                        <option value="03:00 PM">03:00 PM</option>
                                        <option value="04:00 PM">04:00 PM</option>
                                        <option value="05:00 PM">05:00 PM</option>
                                    </select>
                                    {errors.time && <p className="text-[11px] text-red-500 mt-1">{errors.time.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">Consultation Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="flex items-center gap-2.5 p-3 border border-[var(--border)] bg-[var(--surface-2)] rounded-xl cursor-pointer hover:border-blue-500 transition has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10">
                                        <input type="radio" value="online" {...register('consultationType', { required: true })} className="accent-blue-600" defaultChecked />
                                        <Video className="w-4 h-4 text-blue-500" />
                                        <span className="text-xs font-bold text-[var(--text-primary)]">Telehealth Video</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 p-3 border border-[var(--border)] bg-[var(--surface-2)] rounded-xl cursor-pointer hover:border-emerald-500 transition has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/10">
                                        <input type="radio" value="offline" {...register('consultationType', { required: true })} className="accent-emerald-600" />
                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                        <span className="text-xs font-bold text-[var(--text-primary)]">Clinic In-Person</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Reason / Patient Notes (optional)</label>
                                <textarea
                                    {...register('notes')}
                                    rows={3}
                                    placeholder="Describe your health symptoms or specific concerns..."
                                    className="w-full px-3.5 py-2.5 border border-[var(--border)] rounded-xl text-xs sm:text-sm bg-[var(--surface-2)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="text-xs text-[var(--text-muted)]">
                                    Consult Fee: <span className="text-base font-extrabold text-[var(--text-primary)]">₹{doctor.cost || doctor.consultFee || '500'}</span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting || !user}
                                    className="flex items-center gap-2 px-7 py-3 rounded-xl text-white font-bold text-xs sm:text-sm transition-all hover:shadow-lg disabled:opacity-50"
                                    style={{ background: domainColor.bg || '#3B82F6' }}
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    <span>{submitting ? 'Confirming...' : 'Confirm Appointment'}</span>
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
