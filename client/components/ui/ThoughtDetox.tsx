import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Sparkles, Moon, Sun, Settings, TrendingUp, Smile, Meh, Frown, BookOpen, Clock, Plus, X, CheckCircle, Brain, Zap, LucideIcon } from 'lucide-react';

// --- TYPE DEFINITIONS (Interfaces) ---

/** Represents a single quote entry. */
interface Quote {
    text: string;
    author: string;
}

/** Defines the structure for the AI's response to a detox session. */
interface AIResponse {
    quote: Quote;
    affirmation: string;
    copingTips: string[];
    animation: 'celebrate' | 'breathe' | 'pulse' | 'sparkle';
}

/** Defines the structure for a single detox session history entry. */
interface DetoxEntry {
    id: number;
    emotion: EmotionCategory | '';
    intensity: number;
    thought: string;
    category: EmotionCategory;
    triggers: string[];
    timestamp: string;
    response: AIResponse;
}

/** Defines the structure for a mood data point. */
interface MoodData {
    date: string; // ISO date string (YYYY-MM-DD)
    mood: number; // Mood score (1-10)
}

/** Defines the structure for a calendar event. */
interface CalendarEvent {
    id: number;
    title: string;
    date: string; // ISO date string (YYYY-MM-DD)
    time: string; // Time string (e.g., "14:30")
    type: string; // Event type
    promptSettings: {
        before: boolean;
        after: boolean;
    };
    promptShown?: boolean;
    postPromptShown?: boolean;
}

/** Defines the six emotional categories used in the app. */
type EmotionCategory = 'happy' | 'academic-stress' | 'anxiety' | 'overwhelmed' | 'tired' | 'general';

/** Defines the structure for an emotion button in the Detox Modal. */
interface EmotionOption {
    name: EmotionCategory | 'general';
    icon: LucideIcon;
    label: string;
    color: string;
}

// --- DATA STRUCTURES (Databases) ---

// Quotes Database
const quotesDatabase: Record<EmotionCategory | 'general', Quote[]> = {
    'happy': [
        { text: "Your joy is contagious! Keep spreading that positive energy.", author: "Thought Detox" },
        { text: "Happiness is not a destination, it's a way of life. Enjoy this moment!", author: "Unknown" },
        { text: "Your smile can change the world. Keep shining bright!", author: "Thought Detox" },
        { text: "Celebrate this feeling! You deserve all the happiness in the world.", author: "Unknown" }
    ],
    'academic-stress': [
        { text: "Your worth is not measured by your grades. You are enough, always.", author: "Unknown" },
        { text: "One test doesn't define your future. Breathe, reset, and try again.", author: "Thought Detox" },
        { text: "Learning is a journey, not a race. Take it one step at a time.", author: "Unknown" },
        { text: "You've overcome challenges before, and you'll overcome this one too.", author: "Thought Detox" }
    ],
    'anxiety': [
        { text: "This feeling is temporary. You are safe, you are strong.", author: "Unknown" },
        { text: "Breathe in courage, breathe out fear. You've got this.", author: "Thought Detox" },
        { text: "Anxiety is not your enemy—it's your body trying to protect you. Thank it and let it go.", author: "Unknown" }
    ],
    'overwhelmed': [
        { text: "You don't have to do everything today. Just focus on the next small step.", author: "Thought Detox" },
        { text: "It's okay to rest. Productivity isn't your only value.", author: "Unknown" },
        { text: "Break it down into smaller pieces. You can handle one piece at a time.", author: "Thought Detox" }
    ],
    'tired': [
        { text: "Rest is not a reward—it's a necessity. Honor what your body needs.", author: "Unknown" },
        { text: "You're not falling behind. You're recharging for what's ahead.", author: "Thought Detox" },
        { text: "Even the strongest warriors need to rest. You've earned it.", author: "Unknown" }
    ],
    'general': [
        { text: "You are worthy of kindness, especially from yourself.", author: "Unknown" },
        { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
        { text: "Be gentle with yourself. You're doing the best you can.", author: "Thought Detox" }
    ]
};

// Coping strategies
const copingStrategies: Record<EmotionCategory | 'general', string[]> = {
    'happy': [
        "Share your joy with someone you care about",
        "Write down what made you happy today",
        "Take a moment to appreciate this feeling",
        "Do something kind for someone else"
    ],
    'academic-stress': [
        "Take a 5-minute break and stretch your body",
        "Write down 3 things you've already accomplished",
        "Study in 25-minute intervals with breaks",
        "Talk to a classmate or friend about the material"
    ],
    'anxiety': [
        "Practice box breathing: 4 seconds in, 4 hold, 4 out, 4 hold",
        "Name 5 things you can see around you",
        "Journal your thoughts for 5 minutes",
        "Go for a short walk outside"
    ],
    'overwhelmed': [
        "Make a list and prioritize just 3 tasks",
        "Delegate or ask for help with one task",
        "Set a timer for 10 minutes and tackle one thing",
        "Say 'no' to something that isn't essential"
    ],
    'tired': [
        "Take a 20-minute power nap",
        "Drink water and have a healthy snack",
        "Listen to calming music",
        "Do a gentle 5-minute yoga stretch"
    ],
    'general': [
        "Practice gratitude: list 3 things you're thankful for",
        "Do something creative for 10 minutes",
        "Connect with someone you care about",
        "Spend 5 minutes in nature or by a window"
    ]
};

/** Defines the shape of data submitted from the Detox Modal. */
interface ThoughtInput {
    emotion: EmotionCategory | '';
    intensity: number;
    thought: string;
}

/** Defines the analysis output from the NLP function. */
interface AnalysisResult {
    category: EmotionCategory;
    intensity: number;
    triggers: string[];
    timestamp: string;
}

// Simple NLP analyzer
const analyzeThought = (text: string, intensity: number, selectedEmotion: EmotionCategory | ''): AnalysisResult => {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);

    const happyKeywords = ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'good', 'blessed'];
    const stressKeywords = ['exam', 'test', 'assignment', 'deadline', 'grade', 'study', 'homework', 'project'];
    const anxietyKeywords = ['worried', 'nervous', 'scared', 'afraid', 'panic', 'anxious'];
    const overwhelmKeywords = ['too much', 'overwhelmed', 'cant handle', 'everything', 'all at once'];
    const tiredKeywords = ['tired', 'exhausted', 'drained', 'burnout', 'fatigue'];

    let detectedCategory: EmotionCategory = (selectedEmotion as EmotionCategory) || 'general';
    let triggers: string[] = [];

    if (words.some(w => happyKeywords.includes(w))) {
        detectedCategory = 'happy';
        triggers = happyKeywords.filter(k => lowerText.includes(k));
    } else if (words.some(w => stressKeywords.includes(w))) {
        detectedCategory = 'academic-stress';
        triggers = stressKeywords.filter(k => lowerText.includes(k));
    } else if (words.some(w => anxietyKeywords.includes(w))) {
        detectedCategory = 'anxiety';
    } else if (overwhelmKeywords.some(k => lowerText.includes(k))) {
        detectedCategory = 'overwhelmed';
    } else if (words.some(w => tiredKeywords.includes(w))) {
        detectedCategory = 'tired';
    }

    return {
        category: detectedCategory,
        intensity: intensity,
        triggers: triggers,
        timestamp: new Date().toISOString()
    };
};

// Main App Component
const ThoughtDetox: React.FC = () => {
    const [currentView, setCurrentView] = useState<'dashboard' | 'calendar'>('dashboard');
    const [showDetoxModal, setShowDetoxModal] = useState<boolean>(false);
    const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
    const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
    const [showEventModal, setShowEventModal] = useState<boolean>(false);

    // Initialize state from localStorage
    const [detoxHistory, setDetoxHistory] = useState<DetoxEntry[]>(() => {
        try {
            const saved = localStorage.getItem('thoughtDetoxHistory');
            // Ensure data integrity when casting
            return saved ? JSON.parse(saved) as DetoxEntry[] : [];
        } catch (error) {
            console.error('Error loading detoxHistory:', error);
            return [];
        }
    });

    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
        try {
            const saved = localStorage.getItem('thoughtDetoxEvents');
            return saved ? JSON.parse(saved) as CalendarEvent[] : [];
        } catch (error) {
            console.error('Error loading calendarEvents:', error);
            return [];
        }
    });

    const [moodData, setMoodData] = useState<MoodData[]>(() => {
        try {
            const saved = localStorage.getItem('thoughtDetoxMoods');
            return saved ? JSON.parse(saved) as MoodData[] : [];
        } catch (error) {
            console.error('Error loading moodData:', error);
            return [];
        }
    });

    // Save to localStorage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem('thoughtDetoxHistory', JSON.stringify(detoxHistory));
            console.log('Saved detoxHistory:', detoxHistory.length, 'items');
        } catch (error) {
            console.error('Error saving detoxHistory:', error);
        }
    }, [detoxHistory]);

    useEffect(() => {
        try {
            localStorage.setItem('thoughtDetoxEvents', JSON.stringify(calendarEvents));
            console.log('Saved calendarEvents:', calendarEvents.length, 'items');
        } catch (error) {
            console.error('Error saving calendarEvents:', error);
        }
    }, [calendarEvents]);

    useEffect(() => {
        try {
            localStorage.setItem('thoughtDetoxMoods', JSON.stringify(moodData));
            console.log('Saved moodData:', moodData.length, 'items');
        } catch (error) {
            console.error('Error saving moodData:', error);
        }
    }, [moodData]);

    // Check for calendar prompts
    useEffect(() => {
        const checkPrompts = () => {
            const today = new Date().toISOString().split('T')[0];
            const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

            calendarEvents.forEach(event => {
                if (event.date === tomorrow && event.promptSettings.before && !event.promptShown) {
                    // Show pre-event prompt
                    setTimeout(() => {
                        alert(`Reminder: You have "${event.title}" tomorrow. Remember to take care of yourself! 💙`);
                        const updatedEvents = calendarEvents.map(e =>
                            e.id === event.id ? { ...e, promptShown: true } : e
                        );
                        setCalendarEvents(updatedEvents);
                    }, 1000);
                }

                if (event.date < today && event.promptSettings.after && !event.postPromptShown) {
                    // Show post-event prompt
                    setTimeout(() => {
                        alert(`How did "${event.title}" go? Take a moment to detox your thoughts. 🌟`);
                        const updatedEvents = calendarEvents.map(e =>
                            e.id === event.id ? { ...e, postPromptShown: true } : e
                        );
                        setCalendarEvents(updatedEvents);
                    }, 2000);
                }
            });
        };

        if (calendarEvents.length > 0) {
            checkPrompts();
        }
    }, [calendarEvents]);

    const handleDetoxSubmit = (thoughtData: ThoughtInput) => {
        const analysis = analyzeThought(thoughtData.thought, thoughtData.intensity, thoughtData.emotion);
        const quotes = quotesDatabase[analysis.category] || quotesDatabase.general;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const strategies = copingStrategies[analysis.category] || copingStrategies.general;

        const response: AIResponse = {
            quote: randomQuote,
            affirmation: generateAffirmation(analysis.category),
            copingTips: strategies.slice(0, 3),
            animation: getAnimationType(analysis.intensity, analysis.category)
        };

        setAiResponse(response);
        setShowDetoxModal(false);
        setShowResponseModal(true);

        // Save to history
        const newEntry: DetoxEntry = {
            id: Date.now(),
            ...thoughtData,
            ...analysis,
            response: response,
            timestamp: new Date().toISOString()
        };
        setDetoxHistory([newEntry, ...detoxHistory]);

        // Update mood data
        const today = new Date().toISOString().split('T')[0];
        // For happy emotions, higher intensity = better mood
        // For other emotions, lower intensity = better mood
        const moodScore = analysis.category === 'happy'
            ? thoughtData.intensity
            : 10 - thoughtData.intensity;

        const existingMoodIndex = moodData.findIndex(m => m.date === today);
        if (existingMoodIndex >= 0) {
            const updated = [...moodData];
            updated[existingMoodIndex] = { date: today, mood: moodScore };
            setMoodData(updated);
        } else {
            setMoodData([...moodData, { date: today, mood: moodScore }]);
        }
    };

    const generateAffirmation = (category: EmotionCategory | '') => {
        const affirmations: Record<EmotionCategory | 'general', string> = {
            'happy': "Keep this beautiful energy alive! You're making the world brighter! 🌟",
            'academic-stress': "You are capable and resilient. This challenge is temporary.",
            'anxiety': "You are safe. You are in control. This moment will pass.",
            'overwhelmed': "You can handle this one step at a time. You are stronger than you think.",
            'tired': "Rest is productive. You deserve to recharge.",
            'general': "You are worthy of love and kindness, especially from yourself."
        };
        return affirmations[category as EmotionCategory] || affirmations.general;
    };

    const getAnimationType = (intensity: number, category: EmotionCategory): 'celebrate' | 'breathe' | 'pulse' | 'sparkle' => {
        if (category === 'happy') return 'celebrate';
        if (intensity > 7) return 'breathe';
        if (intensity > 4) return 'pulse';
        return 'sparkle';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Thought Detox
                        </h1>
                    </div>
                    <nav className="flex gap-2">
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'dashboard'
                                ? 'bg-purple-100 text-purple-700'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setCurrentView('calendar')}
                            className={`px-4 py-2 rounded-lg transition-all ${currentView === 'calendar'
                                ? 'bg-purple-100 text-purple-700'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Calendar
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {currentView === 'dashboard' && (
                    <Dashboard
                        detoxHistory={detoxHistory}
                        moodData={moodData}
                        calendarEvents={calendarEvents}
                        onDetoxClick={() => setShowDetoxModal(true)}
                    />
                )}

                {currentView === 'calendar' && (
                    <CalendarView
                        events={calendarEvents}
                        onAddEvent={() => setShowEventModal(true)}
                        onDeleteEvent={(id: number) => setCalendarEvents(calendarEvents.filter(e => e.id !== id))}
                    />
                )}
            </main>

            {/* Quick Detox Button */}
            <button
                onClick={() => setShowDetoxModal(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group z-50"
            >
                <Heart className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Detox Modal */}
            {showDetoxModal && (
                <DetoxModal
                    onClose={() => setShowDetoxModal(false)}
                    onSubmit={handleDetoxSubmit}
                />
            )}

            {/* Response Modal */}
            {showResponseModal && aiResponse && (
                <ResponseModal
                    response={aiResponse}
                    onClose={() => setShowResponseModal(false)}
                />
            )}

            {/* Event Modal */}
            {showEventModal && (
                <EventModal
                    onClose={() => setShowEventModal(false)}
                    onSubmit={(event) => {
                        setCalendarEvents([...calendarEvents, { ...event, id: Date.now() }]);
                        setShowEventModal(false);
                    }}
                />
            )}
        </div>
    );
};

// --- Dashboard Component ---

interface DashboardProps {
    detoxHistory: DetoxEntry[];
    moodData: MoodData[];
    calendarEvents: CalendarEvent[];
    onDetoxClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ detoxHistory, moodData, calendarEvents, onDetoxClick }) => {
    const getGreeting = (): string => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const upcomingEvents = calendarEvents
        .filter(e => new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                    {new Date().getHours() < 12 ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
                    <h2 className="text-3xl font-bold">{getGreeting()}!</h2>
                </div>
                <p className="text-lg opacity-90">How are you feeling today? Let's detox those thoughts together.</p>
                <button
                    onClick={onDetoxClick}
                    className="mt-4 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                >
                    Start a Detox Session
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Detox Sessions</p>
                            <p className="text-2xl font-bold text-gray-800">{detoxHistory.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">7-Day Streak</p>
                            {/* Simple streak calculation for display */}
                            <p className="text-2xl font-bold text-gray-800">{Math.min(moodData.length, 7)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Upcoming Events</p>
                            <p className="text-2xl font-bold text-gray-800">{upcomingEvents.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mood Tracker */}
            <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Smile className="w-6 h-6 text-purple-600" />
                    Your Mood Journey (Last 7 Days)
                </h3>
                <div className="flex items-end gap-2 h-40">
                    {moodData.slice(-7).map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all hover:opacity-80"
                                // Mood data is 1-10, so multiply by 10 for percentage height
                                style={{ height: `${day.mood * 10}%` }}
                            ></div>
                            <p className="text-xs text-gray-600 mt-2">
                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                        </div>
                    ))}
                    {/* Placeholder bars for less than 7 days */}
                    {Array(7 - moodData.slice(-7).length).fill(0).map((_, index) => (
                        <div key={`placeholder-${index}`} className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-gray-100 rounded-t-lg"
                                style={{ height: `5%` }}
                            ></div>
                            <p className="text-xs text-gray-400 mt-2">N/A</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Sessions and Upcoming Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Detox Sessions */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                        Recent Detox Sessions
                    </h3>
                    <div className="space-y-3">
                        {detoxHistory.slice(0, 3).map((entry) => (
                            <div key={entry.id} className="border-l-4 border-purple-500 pl-4 py-2">
                                <p className="font-semibold text-gray-800 capitalize">{entry.emotion || entry.category}</p>
                                <p className="text-sm text-gray-600 truncate">{entry.thought}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        ))}
                        {detoxHistory.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No detox sessions yet. Start your first one!</p>
                        )}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-purple-600" />
                        Upcoming Events
                    </h3>
                    <div className="space-y-3">
                        {upcomingEvents.map((event) => (
                            <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                                <p className="font-semibold text-gray-800">{event.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <p className="text-sm text-gray-600">
                                        {new Date(event.date).toLocaleDateString()} at {event.time}
                                    </p>
                                </div>
                                <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                    {event.type}
                                </span>
                            </div>
                        ))}
                        {upcomingEvents.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No upcoming events. Add one to get started!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Detox Modal Component ---

interface DetoxModalProps {
    onClose: () => void;
    onSubmit: (data: ThoughtInput) => void;
}

const DetoxModal: React.FC<DetoxModalProps> = ({ onClose, onSubmit }) => {
    const [step, setStep] = useState<number>(1);
    const [emotion, setEmotion] = useState<EmotionCategory | ''>('');
    const [intensity, setIntensity] = useState<number>(5);
    const [thought, setThought] = useState<string>('');

    const emotions: EmotionOption[] = [
        { name: 'happy', icon: Smile, label: 'Happy', color: 'bg-green-100 text-green-600' },
        { name: 'academic-stress', icon: BookOpen, label: 'Academic Stress', color: 'bg-red-100 text-red-600' },
        { name: 'anxiety', icon: Zap, label: 'Anxiety', color: 'bg-yellow-100 text-yellow-600' },
        { name: 'overwhelmed', icon: TrendingUp, label: 'Overwhelmed', color: 'bg-orange-100 text-orange-600' },
        { name: 'tired', icon: Moon, label: 'Tired', color: 'bg-blue-100 text-blue-600' },
        { name: 'general', icon: Heart, label: 'General', color: 'bg-purple-100 text-purple-600' }
    ];

    const handleSubmit = () => {
        onSubmit({ emotion, intensity, thought });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Let's Detox Your Thoughts</h2>
                        <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-all">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="mt-2 opacity-90">Take a moment for yourself. You deserve it.</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">How are you feeling?</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {emotions.map((emo) => {
                                        const Icon = emo.icon;
                                        return (
                                            <button
                                                key={emo.name}
                                                onClick={() => setEmotion(emo.name)}
                                                className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${emotion === emo.name
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200 hover:border-purple-300'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 ${emo.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-700 text-center">{emo.label}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!emotion}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    How intense is this feeling? ({intensity}/10)
                                </h3>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={intensity}
                                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #a855f7 0%, #ec4899 ${intensity * 10}%, #e5e7eb ${intensity * 10}%, #e5e7eb 100%)`
                                    }}
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-sm text-gray-600">Mild</span>
                                    <span className="text-sm text-gray-600">Intense</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    What's on your mind? (Optional)
                                </h3>
                                <textarea
                                    value={thought}
                                    onChange={(e) => setThought(e.target.value)}
                                    placeholder="Share your thoughts... This is a safe space."
                                    className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Your thoughts are private and stored only on your device.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                                >
                                    Analyze & Detox
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Response Modal Component ---

interface ResponseModalProps {
    response: AIResponse;
    onClose: () => void;
}

const ResponseModal: React.FC<ResponseModalProps> = ({ response, onClose }) => {
    const { quote, affirmation, copingTips, animation } = response;

    const animationClasses = {
        'celebrate': 'animate-pulse text-yellow-500',
        'breathe': 'animate-bounce text-blue-500',
        'pulse': 'animate-ping text-pink-500',
        'sparkle': 'animate-spin text-purple-500',
    };

    const AnimationIcon = (type: string) => {
        switch (type) {
            case 'celebrate': return <Zap className="w-16 h-16" />;
            case 'breathe': return <Brain className="w-16 h-16" />;
            case 'pulse': return <Heart className="w-16 h-16" />;
            case 'sparkle': default: return <Sparkles className="w-16 h-16" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden transform transition-all scale-100 animate-fadeIn">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-white flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full bg-white/20 ${animationClasses[animation]}`}>
                        {AnimationIcon(animation)}
                    </div>
                    <h2 className="text-3xl font-bold mt-4">Detox Complete!</h2>
                    <p className="mt-1 text-lg opacity-90">Here is your tailored thought-boost.</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Quote */}
                    <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-lg">
                        <p className="italic text-gray-700 text-lg">"{quote.text}"</p>
                        <p className="mt-2 text-sm text-gray-500 font-medium">— {quote.author}</p>
                    </div>

                    {/* Affirmation */}
                    <div className="text-center p-3 bg-pink-50 rounded-lg shadow-inner">
                        <p className="font-bold text-pink-700 flex items-center justify-center gap-2">
                            <Heart className="w-5 h-5" />
                            <span>Your Affirmation:</span>
                        </p>
                        <p className="text-md text-gray-800 mt-1">{affirmation}</p>
                    </div>

                    {/* Coping Tips */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-purple-600" />
                            Actionable Steps
                        </h3>
                        <ul className="space-y-2">
                            {copingTips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-md">
                                    <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Calendar View Component ---

interface CalendarViewProps {
    events: CalendarEvent[];
    onAddEvent: () => void;
    onDeleteEvent: (id: number) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent, onDeleteEvent }) => {
    // Group events by date for better display
    const groupedEvents = events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
        const dateKey = new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedEvents).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return (
        <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <Calendar className="w-7 h-7 text-purple-600" />
                    My Wellness Calendar
                </h2>
                <button
                    onClick={onAddEvent}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add New Event
                </button>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl mt-6">
                    <p className="text-gray-500 text-lg">No events scheduled yet.</p>
                    <p className="text-gray-400 mt-2">Plan your week and set reminders for self-care!</p>
                </div>
            ) : (
                <div className="space-y-8 mt-6">
                    {sortedDates.map((dateKey) => (
                        <div key={dateKey}>
                            <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4 sticky top-16 bg-white/90 backdrop-blur-sm z-30">
                                {dateKey}
                            </h3>
                            <div className="space-y-4">
                                {groupedEvents[dateKey]
                                    .sort((a, b) => a.time.localeCompare(b.time))
                                    .map((event) => (
                                        <div
                                            key={event.id}
                                            className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex items-start gap-4">
                                                <Clock className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                                                <div>
                                                    <p className="font-bold text-gray-800">{event.title}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {event.time}
                                                        <span className={`ml-3 px-2 py-0.5 text-xs rounded-full font-medium ${event.type === 'High-Stress' ? 'bg-red-100 text-red-700' : event.type === 'Self-Care' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                                            {event.type}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                        {event.promptSettings.before && <span className="text-blue-500">Pre-Prompt ON</span>}
                                                        {event.promptSettings.after && <span className="text-pink-500">Post-Prompt ON</span>}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => onDeleteEvent(event.id)}
                                                className="text-red-400 hover:text-red-600 p-2 rounded-full transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Event Modal Component ---

// Define the type for the data submitted from Event Modal (excluding the generated ID)
interface EventInput {
    title: string;
    date: string;
    time: string;
    type: string;
    promptSettings: {
        before: boolean;
        after: boolean;
    };
}

interface EventModalProps {
    onClose: () => void;
    onSubmit: (event: EventInput) => void;
}

const EventModal: React.FC<EventModalProps> = ({ onClose, onSubmit }) => {
    const [title, setTitle] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [type, setType] = useState<string>('General');
    const [promptSettings, setPromptSettings] = useState<{ before: boolean; after: boolean }>({
        before: true,
        after: true,
    });

    const isFormValid = title && date && time;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit({ title, date, time, type, promptSettings });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-slideUp">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Schedule a Wellness Event</h2>
                        <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-all">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="mt-2 opacity-90">Set reminders for important or stressful days.</p>
                </div>

                <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                            placeholder="e.g., Final Exam, Job Interview, Weekend Trip, Meditation Time"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input
                                type="time"
                                id="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 bg-white"
                        >
                            <option value="General">General</option>
                            <option value="High-Stress">High-Stress</option>
                            <option value="Self-Care">Self-Care</option>
                            <option value="Social">Social</option>
                        </select>
                    </div>

                    <div className="pt-2">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Detox Prompts</h3>
                        <div className="space-y-2">
                            <label className="flex items-center text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={promptSettings.before}
                                    onChange={(e) => setPromptSettings({ ...promptSettings, before: e.target.checked })}
                                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="ml-2">Remind me to detox the day *before* the event.</span>
                            </label>
                            <label className="flex items-center text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={promptSettings.after}
                                    onChange={(e) => setPromptSettings({ ...promptSettings, after: e.target.checked })}
                                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="ml-2">Remind me to detox the day *after* the event.</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-5 h-5 inline-block mr-1" />
                            Add Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ThoughtDetox;