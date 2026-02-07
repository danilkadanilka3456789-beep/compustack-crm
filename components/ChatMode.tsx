
import React, { useState, useRef, useEffect } from 'react';
import { chatService } from '../services/gemini';
import { Message } from '../types';

const ChatMode: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: "Hello! I'm Aether. How can I assist you today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const modelMsgId = (Date.now() + 1).toString();
    const modelMsg: Message = { id: modelMsgId, role: 'model', content: '', timestamp: new Date() };
    setMessages(prev => [...prev, modelMsg]);

    try {
      let fullResponse = '';
      for await (const chunk of chatService.sendMessageStream(input, [])) {
        fullResponse += chunk;
        setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, content: fullResponse } : m));
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, content: "Error: Failed to fetch response." } : m));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-gray-950/50">
        <div>
          <h2 className="text-lg font-semibold">Spark Chat</h2>
          <p className="text-xs text-gray-500">Gemini 3 Flash Preview</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Operational</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'glass border-white/10 text-gray-200 rounded-tl-none'
            }`}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.content || (isTyping && msg.role === 'model' ? '...' : '')}
              </div>
              <div className="text-[10px] opacity-40 mt-2 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={isTyping}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-600 mt-3">
          Powered by Gemini 3 Flash. AI models may provide inaccurate information.
        </p>
      </div>
    </div>
  );
};

export default ChatMode;
