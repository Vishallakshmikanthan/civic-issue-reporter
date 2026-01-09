"use client";
import React from 'react';
import { User, Medal, CheckCircle, TrendingUp } from 'lucide-react';

export default function Profile({ userType, stats }) {
    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/30 flex items-center justify-center text-4xl font-bold">
                        {userType === 'citizen' ? 'CS' : 'AD'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-1">
                            {userType === 'citizen' ? 'Citizen Smith' : 'Admin Officer'}
                        </h1>
                        <p className="text-blue-100 flex items-center gap-2">
                            <Medal className="w-4 h-4" />
                            {userType === 'citizen' ? 'Level 4 Civic Guardian' : 'Senior Administrator'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className="text-gray-500 text-sm font-medium">Resolved</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.resolved}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-gray-500 text-sm font-medium">Impact Score</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">842</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <User className="w-5 h-5" />
                        </div>
                        <span className="text-gray-500 text-sm font-medium">Join Date</span>
                    </div>
                    <p className="text-xl font-bold text-gray-800">Oct 2023</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4">Recent Achievements</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Medal className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">Community Watcher</p>
                            <p className="text-sm text-gray-500">Reported 5 verified issues in a week</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">Fast Responder</p>
                            <p className="text-sm text-gray-500">Replied to clarification request in 10 mins</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
