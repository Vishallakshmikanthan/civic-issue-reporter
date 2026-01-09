"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Moon, Mail, Smartphone, Bell, Key, CheckCircle, AlertCircle, QrCode, X } from 'lucide-react';
import Toast from './Toast';

export default function Settings({ userType, onToggleSetting }) {
    const [settings, setSettings] = useState({
        twoFactor: false,
        emailVerified: false,
        darkMode: false,
        notifications: true,
    });

    const [showQRModal, setShowQRModal] = useState(false);
    const [toast, setToast] = useState(null);

    const handleToggle = (key) => {
        // Intercept 2FA to show modal first if turning ON
        if (key === 'twoFactor' && !settings.twoFactor) {
            setShowQRModal(true);
            return;
        }

        // Intercept Dark Mode for visual effect
        if (key === 'darkMode') {
            onToggleSetting(key, !settings[key]); // Pass up to layout
            setToast({ message: !settings.darkMode ? 'Dark Mode Enabled (Simulated)' : 'Light Mode Restored', type: 'info' });
            setSettings(prev => ({ ...prev, [key]: !prev[key] }));
            return;
        }

        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        onToggleSetting(key, !settings[key]);
    };

    const confirm2FA = () => {
        setSettings(prev => ({ ...prev, twoFactor: true }));
        setShowQRModal(false);
        setToast({ message: '2FA Setup Complete!', type: 'success' });
        onToggleSetting('twoFactor', true);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 relative">
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

                {/* 2FA QR Code Modal */}
                {showQRModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative"
                        >
                            <button onClick={() => setShowQRModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>

                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                <QrCode className="w-8 h-8" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-2">Setup 2-Step Verification</h3>
                            <p className="text-sm text-gray-500 mb-6">Scan this QR code with your authenticator app to secure your account.</p>

                            <div className="bg-gray-900 w-48 h-48 mx-auto rounded-xl flex items-center justify-center mb-6">
                                <QrCode className="w-32 h-32 text-white opacity-90" />
                            </div>

                            <button
                                onClick={confirm2FA}
                                className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors"
                            >
                                I've Scanned It
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Key className="w-6 h-6 text-blue-900" />
                    Account Security
                </h2>

                <div className="space-y-6">
                    {/* 2FA */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.twoFactor} onChange={() => handleToggle('twoFactor')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {/* Email Verification */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${settings.emailVerified ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 flex items-center gap-2">
                                    Email Verification
                                    {settings.emailVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                                </p>
                                <p className="text-sm text-gray-500">{settings.emailVerified ? 'Your email is verified.' : 'Verify your email to secure account.'}</p>
                            </div>
                        </div>
                        {!settings.emailVerified && (
                            <button onClick={() => { handleToggle('emailVerified'); setToast({ message: 'Verification Email Sent!', type: 'success' }) }} className="px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded-lg hover:bg-blue-800">
                                Verify Now
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-blue-900" />
                    Preferences
                </h2>

                <div className="space-y-6">
                    {/* Dark Mode */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Moon className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-700">Dark Mode</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.darkMode} onChange={() => handleToggle('darkMode')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
