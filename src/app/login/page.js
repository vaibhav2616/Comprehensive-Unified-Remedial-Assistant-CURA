'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { HeartPulse, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Stethoscope, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useApp();
    const [selectedRole, setSelectedRole] = useState('patient');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: 'aryan.mehta@cura.health',
            password: 'password123',
        }
    });

    const handleQuickRoleSelect = (role) => {
        setSelectedRole(role);
        if (role === 'patient') {
            setValue('email', 'aryan.mehta@cura.health');
            setValue('password', 'patient123');
        } else {
            setValue('email', 'dr.rajesh@cura.health');
            setValue('password', 'doctor123');
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        // Simulate brief auth delay for realistic UX
        await new Promise((resolve) => setTimeout(resolve, 600));

        const displayName = selectedRole === 'doctor' ? 'Dr. Rajesh Sharma' : 'Aryan Mehta';

        login({
            email: data.email,
            name: displayName,
            role: selectedRole,
        });

        setIsSubmitting(false);
        if (selectedRole === 'doctor') {
            router.push('/dashboard/doctor');
        } else {
            router.push('/dashboard/patient');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-fade-up">

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
                        <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Sign in to access your unified remedial portal
                        </p>

                        {/* Quick Demo Toggle */}
                        <div className="mt-6 p-1 bg-slate-100 rounded-xl flex gap-1 border border-slate-200">
                            <button
                                type="button"
                                onClick={() => handleQuickRoleSelect('patient')}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                    selectedRole === 'patient'
                                        ? 'bg-white text-[var(--med-blue)] shadow-sm border border-slate-200'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <User className="w-3.5 h-3.5" />
                                Patient Demo
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickRoleSelect('doctor')}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                    selectedRole === 'doctor'
                                        ? 'bg-white text-[var(--med-blue)] shadow-sm border border-slate-200'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Stethoscope className="w-3.5 h-3.5" />
                                Doctor Demo
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-2 space-y-5">
                        {/* Email field */}
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

                        {/* Password field */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Password
                                </label>
                                <span className="text-xs text-[var(--med-blue)] hover:underline cursor-pointer">
                                    Forgot password?
                                </span>
                            </div>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                                        errors.password
                                            ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                                            : 'border-slate-200 focus:border-[var(--med-blue)] focus:ring-2 focus:ring-[var(--med-blue)]/15'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Role Status Tag */}
                        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                            <span className="text-slate-600">Signing in as:</span>
                            <span className="font-semibold text-[var(--med-blue)] capitalize flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                {selectedRole} Account
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-[var(--med-blue)] hover:bg-[var(--med-blue-2)] text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting ? (
                                <span>Signing in...</span>
                            ) : (
                                <>
                                    <span>Sign In to CURA</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="p-6 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-semibold text-[var(--med-blue)] hover:underline">
                            Create an account
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
