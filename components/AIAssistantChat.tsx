import React, { useState, useCallback, useRef, useEffect } from 'react';
import { callGemini } from '../services/geminiService';
import { LogEntry } from '../types';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface AIAssistantChatProps {
    addLog: (level: LogEntry['level'], message: string) => void;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ addLog }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hello! I'm your AI assistant. Ask me about Rust, this toolkit, or anything else." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const conversationHistory = [...messages, userMessage]
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
      .join('\n');
    
    const prompt = `${conversationHistory}\nAssistant:`;

    try {
      const response = await callGemini({
        prompt,
        systemInstruction: `You are a helpful AI assistant for a developer working with a Rust-based cross-platform toolkit. Be concise and helpful. Format your answers with markdown.`
      });
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (error) {
      addLog('ERROR', `AI Chat Error: ${(error as Error).message}`);
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, addLog]);

  return (
    <div className="flex flex-col h-full">
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-2 bg-primary-dark border border-border-dark rounded-md mb-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`rounded-lg px-3 py-2 max-w-xs lg:max-w-md ${msg.role === 'user' ? 'bg-accent-blue text-white' : 'bg-secondary-dark text-gray-300'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start mb-2">
                <div className="rounded-lg px-3 py-2 bg-secondary-dark text-gray-300">
                    <p className="text-sm animate-pulse">Thinking...</p>
                </div>
            </div>
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask your assistant..."
          className="flex-grow p-2 bg-primary-dark border border-border-dark rounded-l-md focus:ring-2 focus:ring-accent-blue focus:outline-none text-sm"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-accent-blue hover:bg-blue-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-r-md transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};