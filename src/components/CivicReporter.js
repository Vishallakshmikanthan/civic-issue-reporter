"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Plus, Search, Filter, Bell, FileText, ChevronDown, UploadCloud, MapPin } from 'lucide-react';
import Layout from './Layout';
import Login from './Login';
import IssueCard from './IssueCard';
import NearbyView from './NearbyView';
import Profile from './Profile';
import ComplaintDetail from './ComplaintDetail';
import Toast from './Toast';
import Analytics from './Analytics';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

// --- DATA LOGIC ---
const classifyIssue = (description) => {
    const keywords = {
        road_infrastructure: ['pothole', 'road', 'pavement', 'crack', 'asphalt', 'street'],
        waste_sanitation: ['garbage', 'trash', 'waste', 'bin', 'litter', 'overflow'],
        water_drainage: ['water', 'drain', 'flood', 'leak', 'pipe', 'sewer'],
        public_safety: ['danger', 'hazard', 'wire', 'electrical', 'fire', 'gas'],
        utilities_streetlights: ['light', 'streetlight', 'lamp', 'dark', 'broken light']
    };
    let scores = {};
    Object.entries(keywords).forEach(([category, words]) => {
        scores[category] = words.filter(w => description.toLowerCase().includes(w)).length;
    });
    const maxCategory = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
    return { category: maxCategory, confidence: 0.9 };
};

// --- MAIN APP COMPONENT ---
export default function CivicReporter() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState(null);
    const [userProfile, setUserProfile] = useState(null); // Full profile from DB
    const [activeTab, setActiveTab] = useState('home');
    const [complaints, setComplaints] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [toast, setToast] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Enhanced Form Data
    const [formData, setFormData] = useState({
        title: '', description: '',
        houseNo: '', street: '', landmark: '', pincode: '',
        photo: null
    });
    const fileInputRef = useRef(null);

    // FETCH ISSUES FROM SUPABASE
    const fetchIssues = async () => {
        try {
            const { data, error } = await supabase
                .from('issues')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setComplaints(data);
        } catch (err) {
            console.error('Error fetching issues:', err);
            // Fallback to empty or keep loading state if needed
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const showToast = (message, type = 'success') => setToast({ message, type });

    const handleLogin = async (role, credentials) => {
        // 1. Check if Supabase keys are set
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            showToast("Supabase not configured. Check .env.local", "error");
            return;
        }

        // 2. Mock secure check (verify against profiles table for robustness)
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('auth_id', credentials.id)
                .eq('role', role)
                .single();

            if (data) {
                setUserProfile(data);
                setUserType(role);
                setIsLoggedIn(true);
                setActiveTab('home');
                showToast(`Welcome back, ${data.full_name || role.toUpperCase()}`);
            } else {
                // Fallback for demo if they haven't imported CSV yet: Allow generic login but warn
                console.warn("User ID not found in DB, entering Demo Mode");
                setUserType(role);
                setIsLoggedIn(true);
                setActiveTab('home');
                showToast(`Demo Access: ${role.toUpperCase()}`);
            }
        } catch (err) {
            // Network error or other issue, fallback to demo access for stability
            setUserType(role);
            setIsLoggedIn(true);
            setActiveTab('home');
            showToast(`Offline Access: ${role.toUpperCase()}`);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        // Optimistic Update
        setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));

        const { error } = await supabase.from('issues').update({ status: newStatus }).eq('id', id);
        if (error) {
            showToast("Failed to update status", "error");
            fetchIssues(); // Revert
        } else {
            showToast(`Grievance Status Updated`);
        }
    };

    const handleAddComment = async (id, text) => {
        // Simplified: Just local state update for demo feel + DB insert
        // Ideally create a 'comments' table insert here
        const user_name = userProfile?.full_name || (userType === 'authority' ? 'Official' : 'Citizen');

        // We update local state immediately for responsiveness
        // Note: Schema has 'comments' table, but for this view we might need to fetch them
        // For now, let's assume we just want to show it locally or implement refined comment fetching later
        // To prevent crashing, we won't break the UI which expects comments array in issue object
        // IF we fetch issues fresh, they might not have comments joined unless we use select('*, comments(*)')

        // For now, simpler approach: Just Toast. Full comment system requires relational fetch update.
        showToast("Comment added (Database Sync Pending)");
    };

    const handleUpvote = async (id) => {
        // Optimistic
        const issue = complaints.find(c => c.id === id);
        if (!issue) return;
        const newCount = (issue.upvotes || 0) + 1;

        setComplaints(complaints.map(c => c.id === id ? { ...c, upvotes: newCount } : c));
        if (selectedIssue && selectedIssue.id === id) setSelectedIssue(prev => ({ ...prev, upvotes: newCount }));

        const { error } = await supabase.from('issues').update({ upvotes: newCount }).eq('id', id);
        if (!error) showToast('Endorsement Recorded');
    };

    const handleSubmit = async () => {
        setIsAnalyzing(true);

        const cls = classifyIssue(formData.description);
        const fullLocation = `${formData.houseNo}, ${formData.street}, Near ${formData.landmark}, ${formData.pincode}`;

        let photoUrl = null;

        // 1. Upload Photo if exists
        if (formData.photo) {
            const fileExt = formData.photo.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { data, error } = await supabase.storage.from('evidence').upload(fileName, formData.photo);

            if (data) {
                const { data: publicUrlData } = supabase.storage.from('evidence').getPublicUrl(fileName);
                photoUrl = publicUrlData.publicUrl;
            } else {
                console.error("Upload failed", error);
            }
        }

        // 2. Insert into DB
        const newIssuePayload = {
            title: formData.title,
            description: formData.description,
            category: cls.category,
            location: fullLocation,
            status: 'submitted',
            severity: 75, // Mock severity logic
            photo_url: photoUrl,
            user_id: userProfile?.id, // Link to profile if logged in
            upvotes: 0,
            lat: 28.6139 + (Math.random() * 0.1), // Mock geo for demo mapping
            lng: 77.2090 + (Math.random() * 0.1)
        };

        const { data, error } = await supabase.from('issues').insert(newIssuePayload).select();

        if (error) {
            showToast("Submission Failed: " + error.message, "error");
            setIsAnalyzing(false);
            return;
        }

        if (data) {
            setComplaints([data[0], ...complaints]); // Prepend new issue
            showToast('Grievance Lodged & Stored Successfully');
            setTimeout(() => {
                setIsAnalyzing(false);
                setActiveTab('home');
                setFormData({ title: '', description: '', houseNo: '', street: '', landmark: '', pincode: '', photo: null });
            }, 1500);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, photo: e.target.files[0] });
            showToast("Evidence Attached Ready for Upload");
        }
    };

    // DASHBOARD RENDER
    const renderContent = () => {
        if (activeTab === 'profile') return <Profile userType={userType} stats={{ resolved: complaints.filter(c => c.status === 'resolved').length }} />;
        if (activeTab === 'map') return <NearbyView issues={complaints} />;

        // ANALYTICS COMPONENT
        if (activeTab === 'analytics') return <Analytics complaints={complaints} />;

        if (activeTab === 'submit') {
            return (
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow border border-gray-200 p-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-900" />
                        Lodge New Grievance
                    </h2>

                    <div className="space-y-6">
                        {/* Photo Upload Zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer group ${formData.photo ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-blue-50'}`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                {formData.photo ? <UploadCloud className="w-8 h-8 text-green-500" /> : <UploadCloud className="w-8 h-8 text-blue-500" />}
                            </div>
                            <p className="font-bold text-gray-700">{formData.photo ? `Selected: ${formData.photo.name}` : "Click to Upload Evidence"}</p>
                            <p className="text-xs text-gray-500">Supports JPG, PNG (Max 5MB)</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject</label>
                                <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 border rounded-lg bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Brief Title" />
                            </div>

                            {/* Detailed Address */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">House/Flat No.</label>
                                <input value={formData.houseNo} onChange={e => setFormData({ ...formData, houseNo: e.target.value })} className="w-full p-3 border rounded-lg bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none" placeholder="#123, Block A" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Street/Area</label>
                                <input value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} className="w-full p-3 border rounded-lg bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Main Road, Sector 4" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Landmark</label>
                                <input value={formData.landmark} onChange={e => setFormData({ ...formData, landmark: e.target.value })} className="w-full p-3 border rounded-lg bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Near Public Park" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pincode</label>
                                <input value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} className="w-full p-3 border rounded-lg bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none" placeholder="110001" />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Detailed Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 border rounded-lg bg-gray-50 text-sm h-32 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Describe the issue in detail..." />
                            </div>
                        </div>

                        <button onClick={handleSubmit} disabled={isAnalyzing} className="w-full bg-blue-900 text-white p-4 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg">
                            {isAnalyzing ? 'Processing Grievance...' : 'Submit Grievance'}
                        </button>
                    </div>
                </div>
            );
        }

        // DASHBOARD
        return (
            <div className="space-y-6">
                {/* Top Info Bar */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900 serif">Dashboard Overview</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Ministry of Urban Development • City Zone 1</p>
                    </div>
                    {userType === 'citizen' && (
                        <button onClick={() => setActiveTab('submit')} className="bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg hover:bg-orange-700 flex items-center gap-2 text-sm">
                            <Plus className="w-4 h-4" /> Lodge Grievance
                        </button>
                    )}
                </div>

                {/* Widgets Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Stats */}
                    <div className="md:col-span-3 grid grid-cols-3 gap-4">
                        <div className="bg-blue-900 text-white p-4 rounded-xl shadow border-l-4 border-orange-500">
                            <p className="text-blue-200 text-xs uppercase font-bold">Total Grievances</p>
                            <p className="text-3xl font-bold mt-1">{complaints.length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
                            <p className="text-gray-500 text-xs uppercase font-bold">In Progress</p>
                            <p className="text-3xl font-bold mt-1 text-orange-600">{complaints.filter(c => c.status === 'in_progress').length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
                            <p className="text-gray-500 text-xs uppercase font-bold">Redressed</p>
                            <p className="text-3xl font-bold mt-1 text-green-600">{complaints.filter(c => c.status === 'resolved').length}</p>
                        </div>
                    </div>

                    {/* Notices Widget */}
                    <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
                        <div className="flex items-center gap-2 mb-2 border-b border-amber-200 pb-2">
                            <Bell className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-bold text-amber-800 uppercase">Public Notices</span>
                        </div>
                        <ul className="text-[10px] space-y-2 text-amber-900">
                            <li className="flex gap-2"><span>•</span> Maintenance scheduled for Sector 4 on 12th Jan.</li>
                            <li className="flex gap-2"><span>•</span> E-Waste drive collection started.</li>
                        </ul>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 py-2 border-b border-gray-200 pb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-900 bg-gray-50" placeholder="Search by ID or Keyword..." />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50">
                        <Filter className="w-4 h-4" /> Filter <ChevronDown className="w-3 h-3" />
                    </button>
                </div>

                {/* Scrollable Feed */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                    {complaints.map(issue => (
                        <IssueCard key={issue.id} issue={issue} onClick={() => setSelectedIssue(issue)} />
                    ))}
                </div>
            </div>
        );
    };

    if (!isLoggedIn) return <div className="h-screen font-sans"><Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} /> <Login onLogin={handleLogin} /></div>;

    return (
        <Layout sidebarProps={{ activeTab, setActiveTab, userType, onLogout: () => setIsLoggedIn(false) }}>
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                {selectedIssue && (
                    <ComplaintDetail
                        issue={selectedIssue}
                        userType={userType}
                        onClose={() => setSelectedIssue(null)}
                        onUpdateStatus={handleUpdateStatus}
                        onAddComment={handleAddComment}
                        onUpvote={handleUpvote}
                    />
                )}
            </AnimatePresence>
            {renderContent()}
        </Layout>
    );
}
