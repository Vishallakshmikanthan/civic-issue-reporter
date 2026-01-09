"use client";
import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Upload, AlertCircle, CheckCircle, Clock, TrendingUp, Filter, Search, Map, BarChart3, Bell, Menu, X, ChevronDown, Info } from 'lucide-react';

// Simulated AI Classification
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
    return {
        category: maxCategory,
        confidence: Math.min(0.95, 0.6 + (scores[maxCategory] * 0.1))
    };
};

// Calculate severity score based on the formula
const calculateSeverity = (category, description, hoursElapsed = 0) => {
    const categoryRisk = {
        public_safety: 80,
        road_infrastructure: 60,
        utilities_streetlights: 50,
        water_drainage: 40,
        waste_sanitation: 30
    };

    const hazardKeywords = ['broken', 'exposed', 'leaking', 'dangerous', 'sharp', 'fall'];
    const urgencyBoost = hazardKeywords.filter(k => description.toLowerCase().includes(k)).length * 5;

    const riskLevel = Math.min(100, (categoryRisk[category] || 50) + urgencyBoost);
    const damageExtent = Math.min(100, 40 + Math.random() * 30);
    const crowdExposure = Math.min(100, 50 + Math.random() * 40);

    let timeScore = 0;
    if (hoursElapsed < 6) timeScore = hoursElapsed * 5;
    else if (hoursElapsed < 24) timeScore = 30 + (hoursElapsed - 6) * 1.67;
    else if (hoursElapsed < 72) timeScore = 60 + (hoursElapsed - 24) * 0.42;
    else timeScore = Math.min(100, 80 + (hoursElapsed - 72) * 0.1);

    const totalScore = (0.4 * riskLevel) + (0.3 * damageExtent) + (0.2 * crowdExposure) + (0.1 * timeScore);

    return {
        total: Math.round(totalScore),
        breakdown: {
            risk_level: Math.round(riskLevel),
            damage_extent: Math.round(damageExtent),
            crowd_exposure: Math.round(crowdExposure),
            time_unresolved: Math.round(timeScore)
        }
    };
};

const getSeverityLevel = (score) => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
};

const getSeverityColor = (level) => {
    const colors = {
        critical: 'bg-red-600',
        high: 'bg-amber-500',
        medium: 'bg-blue-500',
        low: 'bg-green-500'
    };
    return colors[level] || 'bg-gray-500';
};

const categoryLabels = {
    road_infrastructure: 'Road & Infrastructure',
    waste_sanitation: 'Waste & Sanitation',
    water_drainage: 'Water & Drainage',
    public_safety: 'Public Safety',
    utilities_streetlights: 'Utilities & Streetlights'
};

const CivicReporter = () => {
    const [view, setView] = useState('citizen'); // 'citizen' or 'authority'
    const [screen, setScreen] = useState('home'); // 'home', 'submit', 'details', 'map'
    const [complaints, setComplaints] = useState([]);
    const [currentComplaint, setCurrentComplaint] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: 'Main St & 5th Ave, Springfield'
    });
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterSeverity, setFilterSeverity] = useState('all');

    // Initialize with sample data
    useEffect(() => {
        const sampleComplaints = [
            {
                id: 'CR-00148',
                title: 'Exposed electrical wire',
                description: 'Dangerous exposed electrical wire hanging low, risk of electrocution',
                category: 'public_safety',
                location: 'Main St & 5th Ave',
                status: 'submitted',
                severity: 92,
                severityLevel: 'critical',
                breakdown: { risk_level: 85, damage_extent: 40, crowd_exposure: 70, time_unresolved: 15 },
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
                assignedTo: null,
                timeline: [
                    { event: 'Complaint submitted', time: new Date(Date.now() - 6 * 60 * 60 * 1000) },
                    { event: 'AI analysis complete', time: new Date(Date.now() - 6 * 60 * 60 * 1000 + 300000) }
                ]
            },
            {
                id: 'CR-00152',
                title: 'Large pothole on Elm Street',
                description: 'Deep pothole causing traffic congestion and damage to vehicles',
                category: 'road_infrastructure',
                location: '123 Elm St',
                status: 'in_progress',
                severity: 78,
                severityLevel: 'high',
                breakdown: { risk_level: 65, damage_extent: 55, crowd_exposure: 80, time_unresolved: 15 },
                createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
                assignedTo: 'Road Maintenance Dept.',
                timeline: [
                    { event: 'Complaint submitted', time: new Date(Date.now() - 12 * 60 * 60 * 1000) },
                    { event: 'AI analysis complete', time: new Date(Date.now() - 12 * 60 * 60 * 1000 + 300000) },
                    { event: 'Assigned to Road Maintenance', time: new Date(Date.now() - 10 * 60 * 60 * 1000) },
                    { event: 'Status: In Progress', time: new Date(Date.now() - 8 * 60 * 60 * 1000) }
                ]
            },
            {
                id: 'CR-00145',
                title: 'Overflowing garbage bin',
                description: 'Public bin overflowing for several days, attracting pests',
                category: 'waste_sanitation',
                location: 'Central Plaza',
                status: 'submitted',
                severity: 45,
                severityLevel: 'medium',
                breakdown: { risk_level: 30, damage_extent: 25, crowd_exposure: 55, time_unresolved: 35 },
                createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
                assignedTo: null,
                timeline: [
                    { event: 'Complaint submitted', time: new Date(Date.now() - 48 * 60 * 60 * 1000) },
                    { event: 'AI analysis complete', time: new Date(Date.now() - 48 * 60 * 60 * 1000 + 300000) }
                ]
            }
        ];
        setComplaints(sampleComplaints);
    }, []);

    const handleSubmit = async () => {
        if (!formData.title || !formData.description) {
            alert('Please fill in all required fields');
            return;
        }

        setIsAnalyzing(true);

        // Simulate AI analysis
        setTimeout(() => {
            const classification = classifyIssue(formData.description);
            const severity = calculateSeverity(classification.category, formData.description);
            const severityLevel = getSeverityLevel(severity.total);

            const newComplaint = {
                id: `CR-${String(complaints.length + 1).padStart(5, '0')}`,
                title: formData.title,
                description: formData.description,
                category: classification.category,
                location: formData.location,
                status: 'submitted',
                severity: severity.total,
                severityLevel: severityLevel,
                breakdown: severity.breakdown,
                createdAt: new Date(),
                assignedTo: null,
                timeline: [
                    { event: 'Complaint submitted', time: new Date() },
                    { event: 'AI analysis complete', time: new Date(Date.now() + 5000) }
                ]
            };

            setAiAnalysis({
                category: classification.category,
                confidence: classification.confidence,
                severity: severity.total,
                severityLevel: severityLevel,
                breakdown: severity.breakdown,
                explanation: `This ${categoryLabels[classification.category].toLowerCase()} issue received a ${severityLevel.toUpperCase()} severity score (${severity.total}/100) based on risk level (${severity.breakdown.risk_level}/100), damage extent (${severity.breakdown.damage_extent}/100), and crowd exposure (${severity.breakdown.crowd_exposure}/100).`
            });

            setComplaints([newComplaint, ...complaints]);
            setCurrentComplaint(newComplaint);
            setIsAnalyzing(false);
            setScreen('confirmation');
        }, 2000);
    };

    const filteredComplaints = complaints.filter(c => {
        if (filterStatus !== 'all' && c.status !== filterStatus) return false;
        if (filterSeverity !== 'all' && c.severityLevel !== filterSeverity) return false;
        return true;
    }).sort((a, b) => b.severity - a.severity);

    const stats = {
        total: complaints.length,
        active: complaints.filter(c => c.status !== 'resolved').length,
        overdue: complaints.filter(c => c.severityLevel === 'critical' && c.status === 'submitted').length,
        resolved: complaints.filter(c => c.status === 'resolved').length
    };

    // Citizen Dashboard - Home
    if (view === 'citizen' && screen === 'home') {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-blue-600 text-white p-4 shadow-md">
                    <div className="flex justify-between items-center max-w-4xl mx-auto">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-6 h-6" />
                            <h1 className="text-xl font-bold">Civic Reporter</h1>
                        </div>
                        <button
                            onClick={() => setView('authority')}
                            className="text-sm bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
                        >
                            Authority View
                        </button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-4 space-y-4">
                    <button
                        onClick={() => {
                            setFormData({ title: '', description: '', category: '', location: 'Main St & 5th Ave, Springfield' });
                            setScreen('submit');
                        }}
                        className="w-full bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-3"
                    >
                        <Camera className="w-6 h-6" />
                        <span className="text-lg font-semibold">Report New Issue</span>
                    </button>

                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="font-bold text-lg mb-4">My Complaints ({complaints.length})</h2>

                        {complaints.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No complaints yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {complaints.slice(0, 3).map(complaint => (
                                    <button
                                        key={complaint.id}
                                        onClick={() => {
                                            setCurrentComplaint(complaint);
                                            setScreen('details');
                                        }}
                                        className="w-full text-left border rounded-lg p-4 hover:border-blue-500 transition"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getSeverityColor(complaint.severityLevel)}`}>
                                                        {complaint.severityLevel.toUpperCase()}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{complaint.id}</span>
                                                </div>
                                                <h3 className="font-semibold">{complaint.title}</h3>
                                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {complaint.location}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className={`text-xs px-2 py-1 rounded ${complaint.status === 'submitted' ? 'bg-gray-100 text-gray-700' :
                                                    complaint.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {complaint.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                            <div className="w-full max-w-[120px] bg-gray-200 rounded-full h-2 ml-3">
                                                <div
                                                    className={`h-2 rounded-full ${getSeverityColor(complaint.severityLevel)}`}
                                                    style={{ width: `${complaint.severity}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold ml-2">{complaint.severity}/100</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setScreen('map')}
                        className="w-full bg-white text-blue-600 p-4 rounded-lg shadow-md hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                        <Map className="w-5 h-5" />
                        <span className="font-semibold">View Nearby Issues</span>
                    </button>
                </div>
            </div>
        );
    }

    // Citizen - Submit Complaint
    if (view === 'citizen' && screen === 'submit') {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-blue-600 text-white p-4 shadow-md">
                    <div className="flex items-center gap-3 max-w-4xl mx-auto">
                        <button onClick={() => setScreen('home')} className="hover:bg-blue-700 p-1 rounded">
                            <X className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold">Report Issue</h1>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-4 space-y-4">
                    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                            <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload image or take photo</p>
                            <p className="text-xs text-gray-400 mt-1">Maximum file size: 5MB</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Brief description of the issue"
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Detailed description (e.g., 'Large pothole on Elm Street causing traffic issues')"
                                className="w-full border rounded-lg p-3 h-32"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Location</label>
                            <div className="flex items-center gap-2 border rounded-lg p-3 bg-gray-50">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="flex-1 bg-transparent outline-none"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Using current location</p>
                        </div>

                        {isAnalyzing && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                <p className="text-sm text-blue-700">🤖 AI is analyzing your issue...</p>
                                <p className="text-xs text-blue-600 mt-1">Detecting issue type and severity...</p>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={isAnalyzing}
                            className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Submit Complaint'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Citizen - Confirmation
    if (view === 'citizen' && screen === 'confirmation') {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-green-600 text-white p-4 shadow-md">
                    <div className="flex items-center gap-3 max-w-4xl mx-auto">
                        <CheckCircle className="w-6 h-6" />
                        <h1 className="text-xl font-bold">Complaint Submitted</h1>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-4 space-y-4">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Your complaint has been received!</h2>
                        <p className="text-gray-600 mb-4">Complaint ID: {currentComplaint?.id}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="font-bold mb-4">AI Severity Assessment</h3>

                        <div className={`p-4 rounded-lg ${aiAnalysis?.severityLevel === 'critical' ? 'bg-red-50 border border-red-200' :
                                aiAnalysis?.severityLevel === 'high' ? 'bg-amber-50 border border-amber-200' :
                                    aiAnalysis?.severityLevel === 'medium' ? 'bg-blue-50 border border-blue-200' :
                                        'bg-green-50 border border-green-200'
                            }`}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-bold text-lg">Priority: {aiAnalysis?.severityLevel.toUpperCase()}</span>
                                <span className="text-2xl font-bold">{aiAnalysis?.severity}/100</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                                <div
                                    className={`h-3 rounded-full ${getSeverityColor(aiAnalysis?.severityLevel)}`}
                                    style={{ width: `${aiAnalysis?.severity}%` }}
                                />
                            </div>

                            <div className="space-y-2 text-sm">
                                <p className="font-semibold">Detected Category:</p>
                                <p className="text-gray-700">{categoryLabels[aiAnalysis?.category]} ({Math.round(aiAnalysis?.confidence * 100)}% confidence)</p>

                                <p className="font-semibold mt-3">Severity Breakdown:</p>
                                {Object.entries(aiAnalysis?.breakdown || {}).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                                        <span className="font-mono">{value}/100</span>
                                    </div>
                                ))}

                                <div className="mt-4 p-3 bg-white rounded border">
                                    <p className="text-xs font-semibold mb-1">Why this score?</p>
                                    <p className="text-xs text-gray-700">{aiAnalysis?.explanation}</p>
                                </div>
                            </div>

                            <div className="mt-4 text-sm">
                                <p className="font-semibold">Expected Resolution:</p>
                                <p className="text-gray-700">
                                    {aiAnalysis?.severityLevel === 'critical' ? '4 hours' :
                                        aiAnalysis?.severityLevel === 'high' ? '24-48 hours' :
                                            aiAnalysis?.severityLevel === 'medium' ? '2-3 days' : '1 week'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setCurrentComplaint(currentComplaint);
                                setScreen('details');
                            }}
                            className="flex-1 bg-white border-2 border-blue-600 text-blue-600 p-3 rounded-lg font-semibold hover:bg-blue-50"
                        >
                            View Details
                        </button>
                        <button
                            onClick={() => setScreen('home')}
                            className="flex-1 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Citizen - Complaint Details
    if (view === 'citizen' && screen === 'details' && currentComplaint) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-blue-600 text-white p-4 shadow-md">
                    <div className="flex items-center gap-3 max-w-4xl mx-auto">
                        <button onClick={() => setScreen('home')} className="hover:bg-blue-700 p-1 rounded">
                            <X className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold">Complaint {currentComplaint.id}</h1>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-4 space-y-4">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-2">{currentComplaint.title}</h2>
                        <p className="text-gray-600 flex items-center gap-1 mb-4">
                            <MapPin className="w-4 h-4" />
                            {currentComplaint.location}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-xs text-gray-500">Status</p>
                                <p className="font-semibold capitalize">{currentComplaint.status.replace('_', ' ')}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-xs text-gray-500">Category</p>
                                <p className="font-semibold">{categoryLabels[currentComplaint.category]}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-xs text-gray-500">Severity</p>
                                <p className="font-semibold">{currentComplaint.severity}/100 ({currentComplaint.severityLevel.toUpperCase()})</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-xs text-gray-500">Submitted</p>
                                <p className="font-semibold">{currentComplaint.createdAt.toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-gray-700">{currentComplaint.description}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="font-bold mb-4">Timeline</h3>
                        <div className="space-y-3">
                            {currentComplaint.timeline.map((event, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full" />
                                        {idx < currentComplaint.timeline.length - 1 && (
                                            <div className="w-0.5 h-full bg-blue-200 mt-1" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-3">
                                        <p className="font-medium">{event.event}</p>
                                        <p className="text-xs text-gray-500">{event.time.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="font-bold mb-4">AI Severity Breakdown</h3>
                        <div className="space-y-3">
                            {Object.entries(currentComplaint.breakdown).map(([key, value]) => (
                                <div key={key}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                                        <span className="font-mono">{value}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${value >= 70 ? 'bg-red-500' : value >= 40 ? 'bg-amber-500' : 'bg-blue-500'}`}
                                            style={{ width: `${value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setScreen('home')}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Authority Dashboard
    if (view === 'authority') {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gray-900 text-white p-4 shadow-md">
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-6 h-6" />
                            <h1 className="text-xl font-bold">Authority Dashboard</h1>
                        </div>
                        <button
                            onClick={() => setView('citizen')}
                            className="text-sm bg-gray-800 px-3 py-1 rounded hover:bg-gray-700"
                        >
                            Citizen View
                        </button>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto p-4 space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <p className="text-sm text-gray-600 mb-1">Total Complaints</p>
                            <p className="text-3xl font-bold">{stats.total}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <p className="text-sm text-gray-600 mb-1">Active Issues</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <p className="text-sm text-gray-600 mb-1">Overdue (SLA)</p>
                            <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <p className="text-sm text-gray-600 mb-1">Resolved Today</p>
                            <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="font-bold text-lg mb-4">All Complaints</h2>

                        <div className="flex gap-2 mb-4 flex-wrap">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border rounded px-3 py-2 text-sm"
                            >
                                <option value="all">All Status</option>
                                <option value="submitted">Submitted</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>

                            <select
                                value={filterSeverity}
                                onChange={(e) => setFilterSeverity(e.target.value)}
                                className="border rounded px-3 py-2 text-sm"
                            >
                                <option value="all">All Severity</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            {filteredComplaints.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No complaints match the filters</p>
                            ) : (
                                filteredComplaints.map(complaint => (
                                    <button
                                        key={complaint.id}
                                        onClick={() => {
                                            setCurrentComplaint(complaint);
                                            setScreen('details');
                                        }}
                                        className="w-full text-left border rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getSeverityColor(complaint.severityLevel)}`}>
                                                        {complaint.severityLevel.toUpperCase()}
                                                    </span>
                                                    <span className="text-xs font-mono text-gray-500">{complaint.id}</span>
                                                    <span className={`text-xs px-2 py-1 rounded ${complaint.status === 'submitted' ? 'bg-gray-100 text-gray-700' :
                                                            complaint.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-green-100 text-green-700'
                                                        }`}>
                                                        {complaint.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold mb-1">{complaint.title}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {complaint.location}
                                                    </span>
                                                    <span>{categoryLabels[complaint.category]}</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {Math.round((Date.now() - complaint.createdAt.getTime()) / (1000 * 60 * 60))}h ago
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <div className="text-2xl font-bold mb-1">{complaint.severity}</div>
                                                <div className="text-xs text-gray-500">Severity</div>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Authority - Complaint Details
    if (view === 'authority' && screen === 'details' && currentComplaint) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gray-900 text-white p-4 shadow-md">
                    <div className="max-w-6xl mx-auto flex items-center gap-3">
                        <button onClick={() => setScreen('home')} className="hover:bg-gray-800 p-1 rounded">
                            <X className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold">Complaint {currentComplaint.id}</h1>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto p-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-4">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-3">{currentComplaint.title}</h2>
                                <p className="text-gray-600 flex items-center gap-1 mb-4">
                                    <MapPin className="w-4 h-4" />
                                    {currentComplaint.location}
                                </p>

                                <div className="mb-6">
                                    <h3 className="font-semibold mb-2 text-gray-700">Description</h3>
                                    <p className="text-gray-800 leading-relaxed">{currentComplaint.description}</p>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="font-bold mb-3">AI Severity Analysis</h3>

                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-lg font-bold">Overall Score: {currentComplaint.severity}/100</span>
                                            <span className={`px-3 py-1 rounded text-sm font-bold text-white ${getSeverityColor(currentComplaint.severityLevel)}`}>
                                                {currentComplaint.severityLevel.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            {Object.entries(currentComplaint.breakdown).map(([key, value]) => (
                                                <div key={key}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="capitalize font-medium">{key.replace(/_/g, ' ')}</span>
                                                        <span className="font-mono">{value}/100</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all ${value >= 70 ? 'bg-red-500' :
                                                                    value >= 40 ? 'bg-amber-500' :
                                                                        'bg-blue-500'
                                                                }`}
                                                            style={{ width: `${value}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                            <div className="flex items-start gap-2">
                                                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <div className="text-sm">
                                                    <p className="font-semibold text-blue-900 mb-1">AI Explanation</p>
                                                    <p className="text-blue-800">
                                                        This {categoryLabels[currentComplaint.category].toLowerCase()} issue scored {currentComplaint.severity}/100
                                                        based on {currentComplaint.breakdown.risk_level}/100 risk level, {currentComplaint.breakdown.damage_extent}/100 damage extent,
                                                        and {currentComplaint.breakdown.crowd_exposure}/100 crowd exposure.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="font-bold mb-3">Actions</h3>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Update Status</label>
                                            <select className="w-full border rounded-lg p-3">
                                                <option value="submitted">Submitted</option>
                                                <option value="in_progress" selected={currentComplaint.status === 'in_progress'}>In Progress</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Comment (visible to reporter)</label>
                                            <textarea
                                                className="w-full border rounded-lg p-3 h-24"
                                                placeholder="Add a status update or comment..."
                                            />
                                        </div>

                                        <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                                            Update Status
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <h3 className="font-bold mb-3">Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">Status</p>
                                        <p className="font-semibold capitalize">{currentComplaint.status.replace('_', ' ')}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Category</p>
                                        <p className="font-semibold">{categoryLabels[currentComplaint.category]}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Submitted</p>
                                        <p className="font-semibold">{currentComplaint.createdAt.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">SLA Deadline</p>
                                        <p className="font-semibold">
                                            {currentComplaint.severityLevel === 'critical' ? '4 hours' :
                                                currentComplaint.severityLevel === 'high' ? '24 hours' :
                                                    currentComplaint.severityLevel === 'medium' ? '72 hours' : '7 days'}
                                        </p>
                                    </div>
                                    {currentComplaint.assignedTo && (
                                        <div>
                                            <p className="text-gray-500">Assigned to</p>
                                            <p className="font-semibold">{currentComplaint.assignedTo}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-4">
                                <h3 className="font-bold mb-3">Timeline</h3>
                                <div className="space-y-3">
                                    {currentComplaint.timeline.map((event, idx) => (
                                        <div key={idx} className="flex gap-2 text-sm">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />
                                                {idx < currentComplaint.timeline.length - 1 && (
                                                    <div className="w-0.5 flex-1 bg-blue-200 my-1" />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-2">
                                                <p className="font-medium text-gray-900">{event.event}</p>
                                                <p className="text-xs text-gray-500">{event.time.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default CivicReporter;
