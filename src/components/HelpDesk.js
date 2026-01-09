"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, MessageCircle, CheckCircle, Clock, Plus, Filter } from 'lucide-react';

export default function HelpDesk({ userType, tickets, onRaiseTicket, onResolveTicket }) {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ subject: '', type: 'Technical', description: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onRaiseTicket(formData);
        setShowForm(false);
        setFormData({ subject: '', type: 'Technical', description: '' });
    };

    const myTickets = userType === 'citizen' ? tickets : tickets; // Admin sees all (simplified)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
                    <p className="text-gray-500 text-sm">Raise tickets for system issues or inquiries.</p>
                </div>
                {userType === 'citizen' && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-900 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg hover:bg-blue-800 flex items-center gap-2 text-sm"
                    >
                        <Plus className="w-4 h-4" /> Raise Ticket
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-6 overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject</label>
                                    <input required value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full p-2 border rounded-lg bg-white" placeholder="Brief issue title" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Type</label>
                                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full p-2 border rounded-lg bg-white">
                                        <option>Technical Issue</option>
                                        <option>Account Support</option>
                                        <option>Feedback</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded-lg bg-white h-24" placeholder="Explain your issue..." />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Submit Ticket</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid gap-4">
                {myTickets.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No active support tickets.</p>
                    </div>
                ) : (
                    myTickets.map(ticket => (
                        <div key={ticket.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {ticket.status === 'Resolved' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{ticket.subject} <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-2">{ticket.type}</span></h3>
                                    <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                                    <p className="text-[10px] text-gray-400 mt-2">ID: {ticket.id} • {ticket.date.toLocaleDateString()}</p>
                                </div>
                            </div>

                            {userType === 'authority' && ticket.status !== 'Resolved' && (
                                <button
                                    onClick={() => onResolveTicket(ticket.id)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-green-700 transition-colors"
                                >
                                    Mark Resolved
                                </button>
                            )}
                            {userType === 'citizen' && (
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${ticket.status === 'Resolved' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                    {ticket.status}
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
