"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

export default function Layout({ children, sidebarProps, showSidebar = true }) {
    if (!showSidebar) return <>{children}</>;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            <Sidebar {...sidebarProps} />

            <main className="flex-1 relative overflow-hidden flex flex-col">
                {/* Header/Top Bar */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-800 capitalize">
                        {sidebarProps.activeTab.replace('_', ' ')}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-500 font-medium">System Online</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
                            {sidebarProps.userType === 'citizen' ? 'CS' : 'AD'}
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={sidebarProps.activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-7xl mx-auto"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
