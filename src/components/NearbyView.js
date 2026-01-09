"use client";
import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NearbyView({ issues }) {
    // Simulated map view with a grid of locations
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Nearby Issues</h2>
                    <p className="text-gray-500 text-sm">Issues reported within 5km radius</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <span className="text-sm font-semibold text-blue-600">{issues.length} active reports</span>
                </div>
            </div>

            {/* Simulated Map Container */}
            <div className="w-full h-[500px] bg-blue-50 rounded-2xl border-4 border-white shadow-xl relative overflow-hidden group">
                {/* Map Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

                {/* Central user location */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-ping absolute opacity-75"></div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full relative border-2 border-white shadow-lg"></div>
                </div>

                {/* Scattered Issue Markers */}
                {issues.map((issue, i) => {
                    // Random positioning for demo effect
                    const top = `${20 + (i * 15) % 60}%`;
                    const left = `${10 + (i * 23) % 80}%`;

                    return (
                        <motion.div
                            key={issue.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="absolute group/marker cursor-pointer"
                            style={{ top, left }}
                        >
                            <MapPin className={`w-8 h-8 drop-shadow-lg ${issue.severity >= 80 ? 'text-red-500' :
                                    issue.severity >= 60 ? 'text-amber-500' : 'text-blue-500'
                                }`} />

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white p-2 rounded-lg shadow-xl opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none z-20 text-center">
                                <img
                                    src={`https://source.unsplash.com/random/200x100?${issue.category}`}
                                    alt=""
                                    className="w-full h-20 object-cover rounded-md mb-2 bg-gray-100"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <p className="font-bold text-xs text-gray-800 line-clamp-1">{issue.title}</p>
                                <p className="text-[10px] text-gray-500">{issue.category.replace('_', ' ')}</p>
                                <div className="mt-1 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${issue.severity}%` }}></div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
