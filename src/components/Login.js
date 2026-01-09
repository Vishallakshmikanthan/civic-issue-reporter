"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, ArrowRight, Lock, RefreshCw } from 'lucide-react';

export default function Login({ onLogin }) {
    const [activeRole, setActiveRole] = useState('citizen'); // 'citizen' | 'authority'
    const [credentials, setCredentials] = useState({ id: '', password: '' });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (credentials.id && credentials.password) {
            onLogin(activeRole);
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
                                <p className="text-xs font-bold text-white">Secure Access</p>
                                <p className="text-[10px] text-blue-200">End-to-end encrypted reporting</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-blue-800/50 p-3 rounded-lg border border-blue-700">
                            <User className="w-5 h-5 text-yellow-400" />
                            <div className="text-left">
                                <p className="text-xs font-bold text-white">Citizen First</p>
                                <p className="text-[10px] text-blue-200">Transparency & Accountability</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-center mt-8">
                        <p className="text-[10px] text-blue-300">Satyameva Jayate</p>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="md:w-3/5 p-8 bg-white">
                    <div className="flex justify-center mb-8 border-b border-gray-100">
                        <button
                            onClick={() => setActiveRole('citizen')}
                            className={`pb-3 px-6 text-sm font-bold transition-colors relative ${activeRole === 'citizen' ? 'text-blue-900 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Citizen Login
                        </button>
                        <button
                            onClick={() => setActiveRole('authority')}
                            className={`pb-3 px-6 text-sm font-bold transition-colors relative ${activeRole === 'authority' ? 'text-blue-900 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Page Official
                        </button>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">
                                {activeRole === 'citizen' ? 'Mobile Number / Aadhaar' : 'Department ID'}
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    required
                                    value={credentials.id}
                                    onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all text-sm bg-gray-50 focus:bg-white"
                                    placeholder={activeRole === 'citizen' ? "Enter your ID" : "Ex: ADM-2024-X"}
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
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all text-sm bg-gray-50 focus:bg-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Mock Captcha */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                            <div className="font-mono text-lg font-bold text-gray-600 tracking-widest line-through decoration-gray-400 select-none">
                                8 X 2 Y 9 B
                            </div>
                            <button type="button" className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                                <RefreshCw className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                        <input
                            placeholder="Enter Captcha"
                            className="w-full p-2 text-sm border-b border-gray-300 focus:border-blue-900 outline-none bg-transparent"
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-900 text-white p-3 rounded-lg font-bold text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                        >
                            <span>Secure Login</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            By logging in, you agree to the <a href="#" className="text-blue-800 underline">Terms of Service</a>
                        </p>
                    </form>
                </div>
            </motion.div>

            <div className="mt-8 flex gap-8 text-xs text-gray-500 font-medium">
                <span>Copyright © 2024</span>
                <span>Privacy Policy</span>
                <span>Help Desk</span>
            </div>
        </div>
    );
}
