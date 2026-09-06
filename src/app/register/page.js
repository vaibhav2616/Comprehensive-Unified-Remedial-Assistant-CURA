'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { HeartPulse, Lock, Mail, User, Stethoscope, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useApp();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'patient',
        }
    });

    const selectedRole = watch('role');
    const password = watch('password');

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        // Simulate brief auth delay for realistic UX
        await new Promise((resolve) => setTimeout(resolve, 600));

        login({
            name: data.name,
            email: data.email,
            role: data.role,
        });

        setIsSubmitting(false);
        if (data.role === 'doctor') {
            router.push('/dashboard/doctor');
        } else {
            router.push('/dashboard/patient');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg animate-fade-up">

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 pb-6 text-center bg-gradient-to-b from-blue-50/60 to-transparent">
                        <Link href="/" className="inline-flex items-center space-x-2 mb-4 group">
                            <div className="bg-[var(--med-blue)] p-2 rounded-xl group-hover:bg-[var(--med-blue-2)] transition-colors shadow-sm">
                                <HeartPulse className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-[var(--navy)] tracking-tight">CURA</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">Create Your Account</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Join the unified cross-domain medical platform
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-2 space-y-5">

                        {/* Role Selector */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                I am registering as a
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setValue('role', 'patient')}
                                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                        selectedRole === 'patient'
                                            ? 'border-[var(--med-blue)] bg-blue-50/50 ring-2 ring-[var(--med-blue)]/20'
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className={`p-2 rounded-lg ${selectedRole === 'patient' ? 'bg-[var(--med-blue)] text-white' : 'bg-slate-100 text-slate-600'}`}>
                                            <User className="w-4 h-4" />
                                        </div>
                                        {selectedRole === 'patient' && (
                                            <CheckCircle2 className="w-4 h-4 text-[var(--med-blue)]" />
                                        )}
                                    </div>
                                    <span className="font-semibold text-sm text-slate-800">Patient</span>
                                    <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                        Personal health & prescription safety
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setValue('role', 'doctor')}
                                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                        selectedRole === 'doctor'
                                            ? 'border-[var(--med-blue)] bg-blue-50/50 ring-2 ring-[var(--med-blue)]/20'
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className={`p-2 rounded-lg ${selectedRole === 'doctor' ? 'bg-[var(--med-blue)] text-white' : 'bg-slate-100 text-slate-600'}`}>
                                            <Stethoscope className="w-4 h-4" />
                                        </div>
                                        {selectedRole === 'doctor' && (
                                            <CheckCircle2 className="w-4 h-4 text-[var(--med-blue)]" />
                                        )}
                                    </div>
                                    <span className="font-semibold text-sm text-slate-800">Medical Doctor</span>
                                    <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                        Review prescriptions & consult
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    {...register('name', {
                                        required: 'Full name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters'
                                        }
                                    })}
                                    placeholder={selectedRole === 'doctor' ? 'Dr. Sarah Connor' : 'Aryan Mehta'}
                                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                                        errors.name
                                            ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                                            : 'border-slate-200 focus:border-[var(--med-blue)] focus:ring-2 focus:ring-[var(--med-blue)]/15'
                                    }`}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    placeholder="name@example.com"
                                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                                        errors.email
                                            ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                                            : 'border-slate-200 focus:border-[var(--med-blue)] focus:ring-2 focus:ring-[var(--med-blue)]/15'
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password & Confirm Password Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Password */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'At least 6 characters'
                                            }
                                        })}
                                        placeholder="••••••••"
                                        className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                                            errors.password
                                                ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                                                : 'border-slate-200 focus:border-[var(--med-blue)] focus:ring-2 focus:ring-[var(--med-blue)]/15'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...register('confirmPassword', {
                                            required: 'Please confirm password',
                                            validate: (val) => val === password || 'Passwords do not match'
                                        })}
                                        placeholder="••••••••"
                                        className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                                            errors.confirmPassword
                                                ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                                                : 'border-slate-200 focus:border-[var(--med-blue)] focus:ring-2 focus:ring-[var(--med-blue)]/15'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-[var(--med-blue)] hover:bg-[var(--med-blue-2)] text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting ? (
                                <span>Creating account...</span>
                            ) : (
                                <>
                                    <span>Register for CURA</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="p-6 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-[var(--med-blue)] hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Back to Home Link */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-xs text-slate-500 hover:text-[var(--med-blue)] transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
