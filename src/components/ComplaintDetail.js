"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, MessageSquare, ThumbsUp, Shield, Send, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function ComplaintDetail({ issue, userType, onClose, onUpdateStatus, onAddComment, onUpvote }) {
    const [newComment, setNewComment] = useState("");
    const [localStatus, setLocalStatus] = useState(issue.status);

    // Mock status options
    const statusOptions = [
        { value: 'submitted', label: 'Received', color: 'bg-gray-100 text-gray-700' },
        { value: 'in_progress', label: 'In Progress', color: 'bg-amber-100 text-amber-700' },
        { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-700' },
        { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' }
    ];

    const handleStatusChange = (status) => {
        setLocalStatus(status);
        onUpdateStatus(issue.id, status);
    };

    const handlePostComment = () => {
        if (!newComment.trim()) return;
        onAddComment(issue.id, newComment);
        setNewComment("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
                {/* Left Side: Image & Info */}
                <div className="md:w-2/5 bg-gray-50 p-6 flex flex-col border-r border-gray-100 overflow-y-auto">
                    <div className="relative mb-6 rounded-xl overflow-hidden shadow-md group">
                        {/* Mock Image */}
                        <img
                            src={`https://source.unsplash.com/random/400x300?${issue.category}`}
                            alt="Issue"
                            className="w-full h-48 object-cover"
                            onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=No+Image"}
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                            {issue.category.replace('_', ' ').toUpperCase()}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{issue.title}</h2>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                            <MapPin className="w-4 h-4" />
                            <span>{issue.location}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            {issue.description}
                        </p>
                    </div>

                    {/* AI Analysis Box */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">AI Assessment</span>
                        </div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm text-gray-600">Severity Score</span>
                            <span className={`text-2xl font-bold ${issue.severity >= 80 ? 'text-red-600' : 'text-blue-600'}`}>{issue.severity}<span className="text-sm text-gray-400 font-normal">/100</span></span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${issue.severity >= 80 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${issue.severity}%` }}></div>
                        </div>
                    </div>

                    {/* Citizen Actions */}
                    {userType === 'citizen' && (
                        <button
                            onClick={() => onUpvote(issue.id)}
                            className="mt-auto w-full bg-white border-2 border-blue-50 text-blue-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        >
                            <ThumbsUp className="w-5 h-5" />
                            I see this too ({issue.upvotes || 0})
                        </button>
                    )}
                </div>

                {/* Right Side: Activity & Actions */}
                <div className="md:w-3/5 flex flex-col bg-white">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Current Status</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-3 py-1 rounded-full text-sm font-bold capitalize ${statusOptions.find(s => s.value === localStatus)?.color || 'bg-gray-100'}`}>
                                    {localStatus.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-gray-400">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    Updated 2h ago
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    {/* Timeline Feed */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                        {/* Mock Timeline Items */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 border border-white shadow-sm">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Issue Submitted</p>
                                <p className="text-xs text-gray-400 mb-1">{new Date(issue.createdAt).toLocaleString()}</p>
                                <p className="text-sm text-gray-600">Report received and queued for analysis.</p>
                            </div>
                        </div>

                        {/* Dynamic Comments/Activity */}
                        {(issue.comments || []).map((comment, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-white shadow-sm ${comment.user === 'Officer' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    {comment.user === 'Officer' ? <Shield className="w-4 h-4 text-blue-600" /> : <MessageSquare className="w-4 h-4 text-gray-600" />}
                                </div>
                                <div className="bg-white p-3 rounded-r-xl rounded-bl-xl shadow-sm border border-gray-100 max-w-[80%]">
                                    <p className="text-xs font-bold text-gray-700 flex justify-between gap-4">
                                        {comment.user}
                                        <span className="text-gray-400 font-normal text-[10px]">{new Date(comment.date).toLocaleTimeString()}</span>
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Action Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        {userType === 'authority' ? (
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    {statusOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleStatusChange(opt.value)}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${localStatus === opt.value
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                                                    : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add official resolution note..."
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                    <button
                                        onClick={handlePostComment}
                                        className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Ask a question or provide update..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <button
                                    onClick={handlePostComment}
                                    className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-gray-800 transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
