import Header from '@/components/Header';
import React, { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';

// --- API Configuration ---
const API_URL = 'http://127.0.0.1:5000/api/chat'; 
const API_RESET_URL = 'http://127.0.0.1:5000/api/reset'; 

// Constants
const INITIAL_SYSTEM_MESSAGE = "You are MIRA 💫, an empathetic emotional chatbot and close friend.";
const INITIAL_GREETING = "Hey there! I'm Mira. You can talk to me about anything. I'm here to listen and maybe share a meme or two! What's on your mind today? 😊";

// --- TypeScript Definitions ---

type MessageRole = 'user' | 'model' | 'system';
type Emotion = 'joy' | 'sadness' | 'anger' | 'fear' | 'disgust' | 'neutral' | 'default';

interface Message {
    role: MessageRole;
    content: string;
    memeUrl?: string | null;
    emotion?: Emotion;
    isHidden?: boolean;
    timestamp: number;
}

interface ImageBotProps {
    onSendMessage: (message: string) => void;
    onResetChat: () => void;
    isLoading: boolean;
    history: Message[];
    error: string | null;
}

interface ChatBubbleProps {
    message: Message;
}

// --- Chat Bubble Component ---

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    if (message.isHidden) return null;
    
    const isUser = message.role === 'user';
    
    const emotionColors: Record<Emotion, string> = {
        joy: 'bg-green-100 border-green-300 text-green-800',
        sadness: 'bg-blue-100 border-blue-300 text-blue-800',
        anger: 'bg-red-100 border-red-300 text-red-800',
        fear: 'bg-yellow-100 border-yellow-300 text-yellow-800',
        disgust: 'bg-purple-100 border-purple-300 text-purple-800',
        neutral: 'bg-gray-100 border-gray-300 text-gray-800',
        default: 'bg-gray-100 border-gray-300 text-gray-800',
    };
    const emotionColor = message.emotion ? emotionColors[message.emotion] : emotionColors.default;

    return (
        <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-lg transition-all duration-300 ${isUser ? 'bg-indigo-600 text-white rounded-br-none' : `${emotionColor} rounded-tl-none`}`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {/* Display Emotion for Model replies */}
                {!isUser && message.emotion && message.emotion !== 'default' && (
                    <span className="block mt-2 text-xs font-semibold opacity-70">
                        Emotion: {message.emotion.toUpperCase()}
                    </span>
                )}

                {/* Display Meme Image (only for Model replies) */}
                {message.memeUrl && (
                    <div className="mt-3 border-2 border-dashed border-gray-300 p-2 rounded-lg bg-white overflow-hidden">
                        <p className="text-sm font-medium text-gray-700 mb-2">Here's a meme for you:</p>
                        <img 
                            src={message.memeUrl} 
                            alt={`Meme related to ${message.emotion}`} 
                            className="w-full h-auto object-contain rounded-md max-h-80"
                            // Fallback for image loading failure
                            onError={(e) => { 
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; 
                                target.src="https://placehold.co/300x200/cccccc/333333?text=Meme+Failed+to+Load"; 
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};


// --- ImageBot (UI Component - User Provided Structure) ---

/**
 * This component handles the Chat UI structure, input, and send button.
 */
const ImageBot: React.FC<ImageBotProps> = ({ onSendMessage, onResetChat, isLoading, history, error }) => {
    const [input, setInput] = useState<string>('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the bottom when history changes
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSend = (e: FormEvent) => {
        e.preventDefault();
        const trimmedInput = input.trim();
        
        if (!trimmedInput) return;
        
        onSendMessage(trimmedInput);
        setInput('');
    };
    
    return (
        <div className="flex flex-col h-screen bg-yellow-100 font-sans antialiased">
            <Header/>
            <script src="https://cdn.tailwindcss.com"></script>
            <div className=" my-[120px] flex flex-col w-full max-w-5xl mx-auto shadow-2xl bg-white rounded-lg  h-[90vh]">
            
                {/* Header/Controls */}
                <div className="p-4 border-b border-beacon-teal bg-indigo-400  text-white rounded-t-lg shadow-md flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-2xl font-bold tracking-tight">Emotion-Aware Meme Chatbot 💫</h1>
                    <button
                        onClick={onResetChat}
                        disabled={isLoading}
                        className="bg-white text-indigo-600 hover:bg-indigo-50 px-3 py-1 text-sm font-semibold rounded-full shadow-lg transition-colors duration-200 disabled:opacity-50"
                    >
                        Reset Chat
                    </button>
                </div>
                
                {/* Chat Box Area (Renders actual chat history) */}
                <div 
                    ref={chatContainerRef}
                    className="flex-grow p-4 overflow-y-auto space-y-4"
                >
                    {history.map((msg, index) => (
                        <ChatBubble key={index} message={msg} />
                    ))}
                    
                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="max-w-xs p-3 rounded-xl bg-black rounded-tl-none animate-pulse">
                                <div className="h-2 w-16 bg-gray-400 rounded mb-1"></div>
                                <div className="h-2 w-24 bg-gray-400 rounded"></div>
                            </div>
                        </div>
                    )}
                    
                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg">
                            <p className="font-semibold">Connection Error:</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                </div> 

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 border-t border-gray-200 rounded-b-lg">
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            id="user-input"
                            value={input}
                            onChange={handleInputChange}
                            placeholder={isLoading ? "Mira is thinking..." : "Type how you're feeling..."}
                            autoComplete="off"
                            className="flex-grow border border-gray-300 p-3 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow disabled:bg-gray-100"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            id="send-btn"
                            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors duration-200 shadow-md disabled:bg-indigo-300"
                            disabled={!input.trim() || isLoading}
                            title="Send Message"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Application Logic (App Component) ---

const App: React.FC = () => {
    const [history, setHistory] = useState<Message[]>(() => [
        { role: 'system', content: INITIAL_SYSTEM_MESSAGE, isHidden: true, timestamp: 0 },
        { role: 'model', content: INITIAL_GREETING, memeUrl: null, emotion: 'joy', timestamp: Date.now() }
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addMessage = (newMessage: Message) => {
        setHistory(prev => [...prev, newMessage]);
    };

    const resetHistory = () => {
        setHistory([
            { role: 'system', content: INITIAL_SYSTEM_MESSAGE, isHidden: true, timestamp: 0 },
            { role: 'model', content: "Chat reset! Ready when you are. What's new?", memeUrl: null, emotion: 'neutral', timestamp: Date.now() }
        ]);
        setError(null);
        // Call the backend to reset the Flask session
        fetch(API_RESET_URL, { method: 'POST' }).catch(e => console.error("Failed to reset backend session:", e));
    };

    const handleSendMessage = async (message: string) => {
        setError(null);
        setIsLoading(true);

        // 1. Add user message to history immediately
        addMessage({ role: 'user', content: message, timestamp: Date.now() });

        const payload = { message };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server responded with status ${response.status}`);
            }

            const data = await response.json();

            // 2. Add model reply and meme URL to history
            addMessage({
                role: 'model',
                content: data.reply,
                memeUrl: data.meme_url,
                emotion: data.emotion as Emotion,
                timestamp: Date.now()
            });

        } catch (err) {
            const errorMessage = `Oops! Couldn't reach Mira. Please make sure your Python server (on port 5000) is running and Ollama is available. Details: ${(err as Error).message}`;
            console.error("API Fetch Error:", err);
            setError(errorMessage);
            // Add a temporary error message to history
            addMessage({ role: 'model', content: "I'm having trouble connecting right now, but please know I'm listening. I'll try again soon! ❤️", memeUrl: null, emotion: 'sadness', timestamp: Date.now() });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Render the ImageBot component, passing all necessary data and handlers
        <ImageBot
            onSendMessage={handleSendMessage}
            onResetChat={resetHistory}
            isLoading={isLoading}
            history={history}
            error={error}
        />
    );
};
const IB=App;
export default IB;