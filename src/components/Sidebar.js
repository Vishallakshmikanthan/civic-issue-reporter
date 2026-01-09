"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Map, Camera, User, LogOut, ChevronRight, FileText, BarChart3 } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, userType = 'citizen' }) {
    const menuItems = [
        { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'map', label: 'Geo-Tag View', icon: Map },
        ...(userType === 'citizen' ? [{ id: 'submit', label: 'Lodge Grievance', icon: Camera }] : []),
        { id: 'status', label: 'Track Status', icon: FileText },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'profile', label: 'My Profile', icon: User },
    ];

    return (
        <div className="w-72 h-screen bg-blue-950 text-white flex flex-col z-20 shadow-2xl font-sans">
            {/* Header */}
            <div className="p-6 flex items-center gap-3 border-b border-blue-900 bg-blue-950">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
                    {/* Mock Emblem */}
                    <span className="text-2xl">🏛️</span>
                </div>
                <div>
                    <h1 className="text-sm font-bold text-white uppercase tracking-wide">Civic Pulse</h1>
                    <p className="text-[10px] text-blue-300 uppercase tracking-wider">Govt of India</p>
                </div>
            </div>

            <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                <p className="px-4 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Main Navigation</p>

                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-blue-800 text-white shadow-lg border-l-4 border-orange-500'
                                    : 'text-blue-100 hover:bg-blue-900 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : 'text-blue-300 group-hover:text-white'}`} />
                                <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* User Session Info */}
            <div className="p-4 bg-blue-900/50 border-t border-blue-900 mt-auto">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white">
                        {userType === 'citizen' ? 'CS' : 'AD'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate text-white">{userType === 'citizen' ? 'Citizen User' : 'Admin Officer'}</p>
                        <p className="text-[10px] text-blue-300 truncate">ID: {userType === 'citizen' ? 'UID-9828' : 'ADM-X82'}</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Secure Logout</span>
                </button>
            </div>
        </div>
    );
}
