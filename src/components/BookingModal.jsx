'use client';
import { useForm } from 'react-hook-form';
import { X, Calendar, Clock, Video, MapPin, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { DOMAIN_COLORS } from '@/data/mockData';

export default function BookingModal({ doctor, onClose }) {
    const { bookAppointment } = useApp();
    const [submitted, setSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const domainColor = DOMAIN_COLORS[doctor.domain];

    const onSubmit = (data) => {
        bookAppointment({
            doctorId: doctor.id,
            patientName: 'Aryan Mehta',
            date: data.date,
            time: data.time,
            type: data.consultationType,
            domain: doctor.domain,
            notes: data.notes,
        });
        setSubmitted(true);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-up">
                {submitted ? (
                    <div className="p-10 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Appointment Booked!</h2>
                        <p className="text-slate-500 mb-6">Your appointment with {doctor.name} has been scheduled. You'll receive a confirmation shortly.</p>
                        <button onClick={onClose} className="px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors">
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100" style={{ background: `linear-gradient(135deg, ${domainColor.light}, white)` }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Book Appointment</h2>
                                    <p className="text-sm text-slate-500 mt-0.5">{doctor.name} · {doctor.specialization}</p>
                                </div>
                                <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/60 text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
                                        <Calendar className="w-4 h-4" /> Date
                                    </label>
                                    <input
                                        type="date"
                                        {...register('date', { required: 'Date is required' })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                    {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
                                </div>
                                <div>
                                    <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
                                        <Clock className="w-4 h-4" /> Time
                                    </label>
                                    <select
                                        {...register('time', { required: 'Time is required' })}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    >
                                        <option value="">Select time</option>
                                        <option value="09:00 AM">09:00 AM</option>
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="10:30 AM">10:30 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                        <option value="02:00 PM">02:00 PM</option>
                                        <option value="03:00 PM">03:00 PM</option>
                                        <option value="04:00 PM">04:00 PM</option>
                                    </select>
                                    {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-2 block">Consultation Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                                        <input type="radio" value="online" {...register('consultationType', { required: true })} className="accent-blue-600" />
                                        <Video className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium">Online</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-all has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-400">
                                        <input type="radio" value="offline" {...register('consultationType', { required: true })} className="accent-emerald-600" />
                                        <MapPin className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm font-medium">In-person</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Notes (optional)</label>
                                <textarea
                                    {...register('notes')}
                                    rows={3}
                                    placeholder="Describe your symptoms or reason for visit..."
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="text-sm text-slate-500">
                                    Fee: <span className="text-lg font-bold text-slate-800">₹{doctor.cost}</span>
                                </div>
                                <button
                                    type="submit"
                                    className="px-8 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg"
                                    style={{ background: domainColor.bg }}
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
