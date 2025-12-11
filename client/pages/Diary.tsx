// Diary.tsx
import React, { useState, useEffect } from 'react';
import { Smile, Frown, Meh, Globe, Save, Trash2, Zap, BookOpen, Mic, Lock } from 'lucide-react';

interface AnalysisResult {
    moodScore: number;
    language: string;
}

interface DiaryEntry {
    id: number;
    title: string;
    text: string;
    timestamp: string;
    analysis: AnalysisResult;
}

// --- Simple analyzer (unchanged) ---
const analyzeEntry = (text: string, selectedLang: string): AnalysisResult => {
    let moodScore = 5;
    const lowerText = text.toLowerCase();

    const positiveWords = ['happy', 'joy', 'feliz', 'joie', 'glücklich', 'gut', 'good', 'amore', 'love', 'खुश', 'अच्छा', 'आनंद', 'मस्त', 'मजा'];
    const negativeWords = ['sad', 'angry', 'triste', 'fâché', 'traurig', 'bad', 'terrible', 'odio', 'hate', 'दुखी', 'गुस्सा', 'बुरा', 'खराब', 'तनाव'];

    let positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    let negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) moodScore = 7 + Math.min(3, positiveCount);
    else if (negativeCount > positiveCount) moodScore = 4 - Math.min(3, negativeCount);

    moodScore = Math.max(1, Math.min(10, moodScore));

    return { moodScore, language: selectedLang || 'en' };
};

const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'mr', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' }
];

// Keys for localStorage fallback (only used when accountPassword prop not provided)
const PASSWORD_KEY = "diary_password"; // fallback local password key
const AUTH_KEY = "diary_authenticated";

type Props = {
    /**
     * If provided, the diary lock will require this accountPassword to unlock.
     * If not provided, component uses a localStorage-stored diary password and allows creation.
     */
    accountPassword?: string;
};

const Diary: React.FC<Props> = ({ accountPassword }) => {
    // --- diary state (unchanged) ---
    const [entries, setEntries] = useState<DiaryEntry[]>(() => {
        try {
            const saved = localStorage.getItem('multilingualMoodDiaryEntries');
            return saved ? JSON.parse(saved) as DiaryEntry[] : [];
        } catch (error) {
            console.error('Error loading diary entries from localStorage:', error);
            return [];
        }
    });

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0].code);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        localStorage.setItem('multilingualMoodDiaryEntries', JSON.stringify(entries));
    }, [entries]);

    // --- lock states ---
    const [passwordInput, setPasswordInput] = useState('');
    const [newPassword, setNewPassword] = useState(''); // only used if no accountPassword and no saved password
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem(AUTH_KEY) === "true");

    // Determine saved password: prefer accountPassword prop, otherwise localStorage
    const savedPasswordFromStorage = typeof window !== "undefined" ? localStorage.getItem(PASSWORD_KEY) : null;
    const savedPassword = accountPassword ?? savedPasswordFromStorage;

    // --- Lock handlers ---
    // If accountPassword prop is present, user must enter that to unlock.
    // If accountPassword absent and no saved password in localStorage, we allow creation (set newPassword).
    const handleSetPassword = () => {
        if (!newPassword.trim()) return;
        localStorage.setItem(PASSWORD_KEY, newPassword);
        localStorage.setItem(AUTH_KEY, "true");
        setIsAuthenticated(true);
    };

    const handleLogin = () => {
        // compare against provided accountPassword (if present) or saved local password
        if (passwordInput === savedPassword) {
            localStorage.setItem(AUTH_KEY, "true");
            setIsAuthenticated(true);
        } else {
            // simple feedback — in a real app show a toast / message
            alert('Incorrect password. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(AUTH_KEY);
        setIsAuthenticated(false);
        setPasswordInput('');
    };

    // --- voice input (unchanged) ---
    const handleVoiceInput = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error("Speech Recognition not supported in this browser. Try Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.interimResults = false;
        recognition.continuous = false;
        recognition.lang = selectedLanguage;

        recognition.onstart = () => {
            setIsListening(true);
            console.log(`Listening started in language: ${selectedLanguage}`);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setText(prevText => (prevText.trim() === '' ? transcript : prevText + ' ' + transcript));
        };

        recognition.onend = () => {
            setIsListening(false);
            console.log('Listening ended.');
        };

        recognition.onerror = (event: any) => {
            setIsListening(false);
            console.error('Speech recognition error:', event.error);
        };

        if (isListening) {
            recognition.stop();
        } else {
            try {
                recognition.start();
            } catch (e) {
                console.warn("Recognition already started or permission denied.", e);
            }
        }
    };

    // --- diary actions (unchanged) ---
    const handleSaveEntry = () => {
        if (!text.trim()) return;

        const analysis = analyzeEntry(text, selectedLanguage);

        const newEntry: DiaryEntry = {
            id: Date.now(),
            title: title || `Entry ${entries.length + 1}`,
            text: text,
            timestamp: new Date().toISOString(),
            analysis: analysis,
        };

        setEntries([newEntry, ...entries]);
        setTitle('');
        setText('');
    };

    const handleDeleteEntry = (id: number) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    const getMoodIcon = (score: number) => {
        if (score >= 7) return <Smile className="w-5 h-5 text-green-500" />;
        if (score <= 4) return <Frown className="w-5 h-5 text-red-500" />;
        return <Meh className="w-5 h-5 text-yellow-500" />;
    };

    const getMoodColor = (score: number) => {
        if (score >= 8) return 'bg-green-100 text-green-700';
        if (score >= 5) return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-white p-6">
                <div className=" p-6 rounded-xl shadow-md w-full max-w-md text-center">
                    <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    {(!savedPassword) ? (
                        // No saved password in storage AND no accountPassword prop => allow creating a diary password
                        <>
                            <h2 className="text-xl font-bold mb-2">Set Diary Password</h2>
                            <input
                                type="password"
                                className="w-full border p-2 rounded mb-3"
                                placeholder="Create password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                            <button
                                onClick={handleSetPassword}
                                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                            >
                                Save Password
                            </button>
                            <p className="text-sm text-gray-500 mt-3">This password is stored locally in your browser.</p>
                        </>
                    ) : (
                        // savedPassword exists (either accountPassword or saved local password) => prompt for it
                        <>
                            <h2 className="text-xl font-bold mb-2">Enter Password</h2>
                            <input
                                type="password"
                                className="w-full border p-2 rounded mb-3"
                                placeholder="Password"
                                value={passwordInput}
                                onChange={e => setPasswordInput(e.target.value)}
                            />
                            <button
                                onClick={handleLogin}
                                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                            >
                                Unlock Diary
                            </button>
                            <p className="text-sm text-gray-500 mt-3">Enter the password you created for your account (or the diary password if you set one here).</p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // --- MAIN DIARY UI (unchanged layout) ---
    return (
        <div className="min-h-screen bg-white font-sans p-4 md:p-8">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                body { font-family: 'Inter', sans-serif; }
                .shadow-purple { box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.1), 0 4px 6px -2px rgba(168, 85, 247, 0.05); }
                `}
            </style>
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-purple-700 flex items-center justify-center gap-3">
                        <BookOpen className="w-8 h-8 text-pink-500" />
                        Multilingual Mood Journal
                    </h1>
                    <p className="text-gray-500 mt-2">Write, analyze your mood, and save in any language.</p>
                </header>

                <div className="flex justify-between items-center mb-6">
                    <div />
                    <button onClick={handleLogout} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-black text-sm">Lock Diary</button>
                </div>

                {/* --- 📝 New Entry Form --- */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-purple border border-purple-200 mb-10">
                    <h2 className="text-2xl font-semibold mb-5 text-gray-700 border-b pb-3 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-pink-500" /> New Reflection
                    </h2>

                    <input
                        type="text"
                        placeholder="Entry Title (Optional)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
                    />

                    <div className="flex gap-4 mb-4">
                        <textarea
                            placeholder="Write your thoughts here... (e.g., 'आज मैं बहुत खुश हूँ।')"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={7}
                            className="flex-grow p-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 resize-none transition-shadow"
                        />
                        <button
                            onClick={handleVoiceInput}
                            className={`flex-shrink-0 w-16 h-auto rounded-xl shadow-lg transition-all flex items-center justify-center ${
                                isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-pink-500 hover:bg-pink-600 text-white'
                            }`}
                            title={`Click to ${isListening ? 'STOP' : 'START'} Voice Typing in ${languageOptions.find(l => l.code === selectedLanguage)?.name || 'selected language'}`}
                        >
                            <Mic className="w-8 h-8" />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <label htmlFor="language-select" className="text-gray-600 font-medium whitespace-nowrap">
                                <Globe className="w-5 h-5 inline mr-1 text-blue-500" /> Language:
                            </label>
                            <select
                                id="language-select"
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="p-2 border border-purple-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-shadow"
                            >
                                {languageOptions.map(lang => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleSaveEntry}
                            disabled={!text.trim()}
                            className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:shadow-none w-full sm:w-auto"
                        >
                            <Save className="w-5 h-5" />
                            Save Entry
                        </button>
                    </div>
                </div>

                {/* --- 📖 Entry History --- */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-700 border-b pb-3 mb-6">
                        Past Reflections ({entries.length})
                    </h2>

                    {entries.length === 0 ? (
                        <div className="text-center text-gray-500 p-10 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50">
                            <BookOpen className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                            <p className="text-lg font-medium">Your journal is empty. Start writing your thoughts!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {entries.map((entry) => (
                                <div key={entry.id} className="bg-white p-5 rounded-xl shadow border border-gray-100 transition-all hover:shadow-lg hover:border-pink-300">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{entry.title}</h3>
                                        <button
                                            onClick={() => handleDeleteEntry(entry.id)}
                                            className="text-red-400 hover:text-red-600 p-1 rounded-full transition-colors"
                                            title="Delete Entry"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <p className="text-gray-600 mb-3 text-sm italic line-clamp-3 whitespace-pre-wrap">{entry.text}</p>

                                    <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 border-t pt-3 mt-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold ${getMoodColor(entry.analysis.moodScore)}`}>
                                                {getMoodIcon(entry.analysis.moodScore)}
                                                Mood: {entry.analysis.moodScore}/10
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                                                <Globe className="w-3 h-3" />
                                                {entry.analysis.language.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 mt-2 sm:mt-0">
                                            {new Date(entry.timestamp).toLocaleDateString()}
                                            {' at '}
                                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Diary;
