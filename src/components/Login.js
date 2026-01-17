"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Login({ onLogin }) { // onLogin is just a fallback callback if needed, but we rely on session
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'error' | 'success', text: '' }

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                // SIGN UP
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Account created! Please check your email to confirm.' });
            } else {
                // SIGN IN
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Successful login is handled by the parent listener, but we can set a success message temporarily
                setMessage({ type: 'success', text: 'Secure login successful...' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            {/* Official Header Strip */}
            <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-orange-500 via-white to-green-600 shadow-md z-10"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200"
            >
                {/* Left Side: Branding */}
                <div className="md:w-2/5 bg-blue-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                    <div className="relative z-10 text-center">
                        <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center border-2 border-yellow-400 mb-6 backdrop-blur-sm">
                            <span className="text-4xl">🏛️</span>
                        </div>
                        <h2 className="text-xs font-bold tracking-[0.2em] text-yellow-400 uppercase mb-1">Government of India</h2>
                        <h1 className="text-2xl font-serif font-bold mb-2">Civic Issue Reporting Portal</h1>
                        <p className="text-xs text-blue-200">Ministry of Urban Affairs</p>
                    </div>
                    <div className="relative z-10 mt-8 space-y-4">
                        <div className="flex items-center gap-3 bg-blue-800/50 p-3 rounded-lg border border-blue-700">
                            <Shield className="w-5 h-5 text-yellow-400" />
                            <div className="text-left">
                                <p className="text-xs font-bold text-white">Secure Authentication</p>
                                <p className="text-[10px] text-blue-200">Protected by GovCloud Security</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="md:w-3/5 p-8 bg-white flex flex-col justify-center">
                    <div className="flex justify-center mb-6 border-b border-gray-100">
                        <button onClick={() => setIsSignUp(false)} className={`pb-3 px-6 text-sm font-bold transition-colors border-b-2 ${!isSignUp ? 'border-orange-500 text-blue-900' : 'border-transparent text-gray-400'}`}>
                            Log In
                        </button>
                        <button onClick={() => setIsSignUp(true)} className={`pb-3 px-6 text-sm font-bold transition-colors border-b-2 ${isSignUp ? 'border-orange-500 text-blue-900' : 'border-transparent text-gray-400'}`}>
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {message && (
                            <div className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                <AlertCircle className="w-4 h-4" /> {message.text}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900 outline-none text-sm bg-gray-50 focus:bg-white"
                                    placeholder="citizen@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900 outline-none text-sm bg-gray-50 focus:bg-white"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-900 text-white p-3 rounded-lg font-bold text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                        >
                            {loading ? 'Processing...' : (isSignUp ? 'Create Secure Account' : 'Secure Login')}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
