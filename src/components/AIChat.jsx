import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageCircle } from 'lucide-react';

const AIChat = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: "Hello! I'm your AI shopping assistant. I can help you with:\n\n• Product recommendations\n• Buying guides and tips\n• Price comparisons\n• Feature explanations\n• Shopping advice\n\nWhat would you like to know about today?",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/ai/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    prompt: `You are a helpful shopping assistant. The user asked: "${inputMessage}". Please provide a helpful, friendly response with shopping advice, product recommendations, or buying tips. Keep it conversational and informative.` 
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const result = await response.json();
            
            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: result.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('AI Chat error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or you can search for products directly on our website!",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">AI Shopping Assistant</h3>
                            <p className="text-blue-100 text-sm">Powered by Gemini AI</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl p-4 ${
                                    message.type === 'user'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'bg-white border border-gray-200 shadow-sm'
                                }`}
                            >
                                <div className="flex items-start space-x-2">
                                    {message.type === 'ai' && (
                                        <div className="bg-blue-100 p-1 rounded-full mt-1">
                                            <Bot className="w-4 h-4 text-blue-600" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="whitespace-pre-wrap text-sm">
                                            {message.content}
                                        </div>
                                        <div className={`text-xs mt-2 ${
                                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                        }`}>
                                            {message.timestamp.toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </div>
                                    </div>
                                    {message.type === 'user' && (
                                        <div className="bg-white/20 p-1 rounded-full mt-1">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-blue-100 p-1 rounded-full">
                                        <Bot className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                        <span className="text-sm text-gray-600">AI is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex space-x-3">
                        <div className="flex-1 relative">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me about products, shopping tips, or anything else..."
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows="1"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Press Enter to send • Shift+Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AIChat;

