
import React from 'react';
import { X, Sparkles } from 'lucide-react';

const AiModal = ({ isOpen, onClose, title, content, isLoading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center"><Sparkles className="text-indigo-500 mr-2" /> {title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={24} /></button>
                </header>
                <div className="p-6 overflow-y-auto">
                    {isLoading ? (<div className="flex justify-center items-center h-48"><div className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin"></div></div>) 
                    : (<div className="prose max-w-none text-gray-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}></div>)}
                </div>
            </div>
        </div>
    );
};

export default AiModal;
