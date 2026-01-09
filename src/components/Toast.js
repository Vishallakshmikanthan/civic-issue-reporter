"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, AlertCircle } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <Check className="w-5 h-5 text-white" />,
        info: <Info className="w-5 h-5 text-white" />,
        error: <AlertCircle className="w-5 h-5 text-white" />
    };

    const bgColors = {
        success: 'bg-gray-900',
        info: 'bg-blue-600',
        error: 'bg-red-600'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-6 right-6 ${bgColors[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[60] min-w-[300px]`}
        >
            <div className="p-1 bg-white/20 rounded-full">
                {icons[type]}
            </div>
            <p className="font-medium text-sm">{message}</p>
        </motion.div>
    );
}
