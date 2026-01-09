"use client";
import React from 'react';
import { MapPin, Calendar, ArrowRight, Truck, Zap, Activity, Droplets, HardHat } from 'lucide-react';

const statusColors = {
    submitted: 'bg-gray-100 text-gray-700 border-gray-200',
    in_progress: 'bg-orange-50 text-orange-700 border-orange-200',
    resolved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200'
};

const departmentData = {
    road_infrastructure: { label: 'PWD & Transport', icon: HardHat, color: 'text-gray-600' },
    waste_sanitation: { label: 'Sanitation Dept', icon: Truck, color: 'text-green-600' },
    water_drainage: { label: 'Water Works', icon: Droplets, color: 'text-blue-500' },
    public_safety: { label: 'Public Safety', icon: Activity, color: 'text-red-600' },
    utilities_streetlights: { label: 'Power Corp', icon: Zap, color: 'text-amber-500' }
};

export default function IssueCard({ issue, onClick }) {
    const dept = departmentData[issue.category] || departmentData.road_infrastructure;
    const DeptIcon = dept.icon;

    const getMockImage = (cat) => {
        const images = {
            road_infrastructure: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
            waste_sanitation: 'https://images.unsplash.com/photo-1530587191026-aa1cfa4746b5?auto=format&fit=crop&q=80&w=400',
            water_drainage: 'https://images.unsplash.com/photo-1585822818960-9177a45dd500?auto=format&fit=crop&q=80&w=400',
            public_safety: 'https://images.unsplash.com/photo-1595240263652-3d71249b679a?auto=format&fit=crop&q=80&w=400',
            utilities_streetlights: 'https://images.unsplash.com/photo-1563273943-fa6df73dedf3?auto=format&fit=crop&q=80&w=400'
        };
        return images[cat] || images.road_infrastructure;
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col h-full"
        >
            <div className="h-32 w-full overflow-hidden relative border-b border-gray-100">
                <img
                    src={getMockImage(issue.category)}
                    alt={issue.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold shadow-sm border border-gray-200">
                    ID: {issue.id}
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                {/* Department Header */}
                <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-full bg-gray-50 border border-gray-100 ${dept.color}`}>
                        <DeptIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{dept.label}</span>
                </div>

                <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                    {issue.title}
                </h3>

                <div className="flex items-center gap-1 text-xs text-gray-500 mb-4 mt-auto">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="line-clamp-1">{issue.location}</span>
                </div>

                {/* Status Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColors[issue.status]}`}>
                        {issue.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
