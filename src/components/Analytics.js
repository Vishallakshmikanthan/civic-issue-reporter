"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, ArrowUpRight, Activity } from 'lucide-react';

export default function Analytics({ complaints }) {
    // 1. Calculate By Category
    const categories = {};
    complaints.forEach(c => {
        categories[c.category] = (categories[c.category] || 0) + 1;
    });
    const maxVal = Math.max(...Object.values(categories), 1);

    // 2. Calculate By Status (Donut)
    const statusCounts = { submitted: 0, in_progress: 0, resolved: 0, rejected: 0 };
    complaints.forEach(c => {
        if (statusCounts[c.status] !== undefined) statusCounts[c.status]++;
    });
    const total = complaints.length || 1;

    // 3. Simple Mock Trend Data
    const trendData = [4, 7, 5, 10, 15, 8, 12];
    const maxTrend = Math.max(...trendData);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><TrendingUp className="w-5 h-5" /></div>
                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">+12% <ArrowUpRight className="w-3 h-3" /></span>
                    </div>
                    <p className="text-gray-500 text-xs uppercase font-bold">Report Volume</p>
                    <h3 className="text-3xl font-bold text-gray-800">{complaints.length}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600"><Activity className="w-5 h-5" /></div>
                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">+5% <ArrowUpRight className="w-3 h-3" /></span>
                    </div>
                    <p className="text-gray-500 text-xs uppercase font-bold">Resolution Rate</p>
                    <h3 className="text-3xl font-bold text-gray-800">{Math.round((statusCounts.resolved / total) * 100)}%</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><BarChart3 className="w-5 h-5" /></div>
                    </div>
                    <p className="text-gray-500 text-xs uppercase font-bold">Pending Action</p>
                    <h3 className="text-3xl font-bold text-gray-800">{statusCounts.submitted + statusCounts.in_progress}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Bar Chart: Issues by Department */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Issues by Department
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(categories).map(([cat, count], i) => (
                            <div key={cat} className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold text-gray-600">
                                    <span className="uppercase">{cat.replace('_', ' ')}</span>
                                    <span>{count}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(count / maxVal) * 100}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="h-full rounded-full bg-blue-600 shadow-lg shadow-blue-600/20"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Donut Chart: Status Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 w-full">
                        <PieChart className="w-5 h-5 text-blue-600" />
                        Status Breakdown
                    </h3>

                    <div className="relative w-64 h-64">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            {/* Complex circle math for donut chart segments */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eee" strokeWidth="3" />

                            {/* Resolved (Green) */}
                            <motion.circle
                                initial={{ strokeDasharray: "0 100" }}
                                animate={{ strokeDasharray: `${(statusCounts.resolved / total) * 100} 100` }}
                                cx="18" cy="18" r="15.915" fill="none" stroke="#16a34a" strokeWidth="3" strokeDashoffset="0"
                            />

                            {/* In Progress (Orange) */}
                            <motion.circle
                                initial={{ strokeDasharray: "0 100" }}
                                animate={{ strokeDasharray: `${(statusCounts.in_progress / total) * 100} 100` }}
                                cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="3" strokeDashoffset={`-${(statusCounts.resolved / total) * 100}`}
                            />

                            {/* Submitted (Blue) */}
                            <motion.circle
                                initial={{ strokeDasharray: "0 100" }}
                                animate={{ strokeDasharray: `${(statusCounts.submitted / total) * 100} 100` }}
                                cx="18" cy="18" r="15.915" fill="none" stroke="#2563eb" strokeWidth="3" strokeDashoffset={`-${((statusCounts.resolved + statusCounts.in_progress) / total) * 100}`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-bold text-gray-800">{total}</span>
                            <span className="text-xs text-gray-400 uppercase">Total Reports</span>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8 text-xs font-bold text-gray-600">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-600 rounded-full"></div> Resolved</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> Progress</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded-full"></div> Open</div>
                    </div>
                </div>
            </div>

            {/* Trend Graph */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Weekly Trend</h3>
                <div className="h-40 flex items-end justify-between gap-2 px-4">
                    {trendData.map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="relative w-full">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(val / maxTrend) * 100}px` }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="w-full bg-blue-100 rounded-t-sm group-hover:bg-blue-600 transition-colors"
                                />
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {val} Reports
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400">Day {i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
