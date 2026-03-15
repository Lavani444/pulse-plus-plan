import React, { useState, useEffect } from 'react';
import { 
  Brain, Heart, Dumbbell, Calendar, Target, 
  BookOpen, TrendingUp, User, LogOut, Plus,
  CheckCircle, Clock, Sparkles,
  Home, Trophy, Zap, Settings, AlertCircle,
  Moon, Sun, Cloud, Award, RefreshCw,
  ChevronRight, MessageCircle, BarChart3
} from 'lucide-react';
import './App.css';
import TasksView from './TasksView';
import GoalsView from './GoalsView';
import Logbook from './Logook';
import AICompanion from './components/AICompanion';
import LampLogin from './components/LampLogin';
import Onboarding from './components/Onboarding';
import MoodTracker from './components/MoodTracker';
import QuickActions from './components/QuickActions';
import GrowthDashboard from './components/GrowthDashboard';
import EmotionalCheckIn from './components/EmotionalCheckIn';
import FallingBehindModal from './components/FallingBehindModal';
import { getRandomQuote } from './services/quoteService';

const PulsePlusPlan = () => {
  const [view, setView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [dailyBalance, setDailyBalance] = useState({
    mind: false,
    body: false,
    soul: false
  });
  const [isFaithMode, setIsFaithMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // New state for premium features
  const [aiPersonality, setAiPersonality] = useState('motivator');
  const [moodHistory, setMoodHistory] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState({ completed: 0, total: 0 });
  const [showAICoach, setShowAICoach] = useState(false);
  const [adaptiveSuggestions, setAdaptiveSuggestions] = useState([]);
  
  // New state for emotional check-in and falling behind
  const [showEmotionalCheckIn, setShowEmotionalCheckIn] = useState(false);
  const [completedTaskForCheckIn, setCompletedTaskForCheckIn] = useState(null);
  const [showFallingBehind, setShowFallingBehind] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(null);

  // AI Coach personalities
  const coachPersonalities = {
    sage: {
      name: 'Wise Sage',
      description: 'Thoughtful guidance and deep wisdom',
      icon: Brain,
      color: '#10b981',
      greeting: 'Let wisdom guide your steps today.'
    },
    motivator: {
      name: 'Motivator',
      description: 'High-energy, action-focused support',
      icon: Zap,
      color: '#10b981',
      greeting: 'Ready to crush your goals? Let\'s go!'
    },
    cheerleader: {
      name: 'Cheerleader',
      description: 'Enthusiastic, encouraging energy',
      icon: Trophy,
      color: '#10b981',
      greeting: 'You\'ve got this! I believe in you!'
    },
    peaceful: {
      name: 'Peaceful Guide',
      description: 'Calm, centered, mindful approach',
      icon: Moon,
      color: '#10b981',
      greeting: 'Find your center. Progress at your pace.'
    },
    gentle: {
      name: 'Gentle Friend',
      description: 'Warm, nurturing, supportive presence',
      icon: Heart,
      color: '#10b981',
      greeting: 'I\'m here with you, every step of the way.'
    }
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Load data
  useEffect(() => {
    try {
      const savedTasks = JSON.parse(localStorage.getItem('pppTasks') || '[]');
      const savedGoals = JSON.parse(localStorage.getItem('pppGoals') || '[]');
      const savedUser = JSON.parse(localStorage.getItem('pppUser') || 'null');
      const savedStreak = JSON.parse(localStorage.getItem('pppStreak') || '0');
      const savedFaithMode = JSON.parse(localStorage.getItem('pppFaithMode') || 'false');
      const savedMoodHistory = JSON.parse(localStorage.getItem('pppMoodHistory') || '[]');
      const savedOnboarding = JSON.parse(localStorage.getItem('pppOnboarding') || 'false');
      const savedAiPersonality = localStorage.getItem('pppAiPersonality') || 'motivator';
      
      if (savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
        setHasCompletedOnboarding(savedOnboarding);
      }
      
      setTasks(savedTasks);
      setGoals(savedGoals);
      setStreakCount(savedStreak);
      setIsFaithMode(savedFaithMode);
      setMoodHistory(savedMoodHistory);
      setAiPersonality(savedAiPersonality);
      
      // Check if mood logged today
      const today = new Date().toDateString();
      const todaysMood = savedMoodHistory.find(m => new Date(m.date).toDateString() === today);
      if (todaysMood) {
        setTodayMood(todaysMood.mood);
      }

      // Calculate weekly progress
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekTasks = savedTasks.filter(t => new Date(t.date) >= weekAgo);
      const completedWeek = weekTasks.filter(t => t.completed).length;
      setWeeklyProgress({
        completed: completedWeek,
        total: weekTasks.length
      });

      // Generate adaptive suggestions
      generateAdaptiveSuggestions(savedTasks, savedGoals, savedMoodHistory);
      
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Save data
  useEffect(() => {
    try {
      localStorage.setItem('pppTasks', JSON.stringify(tasks));
      localStorage.setItem('pppGoals', JSON.stringify(goals));
      localStorage.setItem('pppStreak', JSON.stringify(streakCount));
      localStorage.setItem('pppFaithMode', JSON.stringify(isFaithMode));
      localStorage.setItem('pppMoodHistory', JSON.stringify(moodHistory));
      localStorage.setItem('pppAiPersonality', aiPersonality);
      
      // Update weekly progress
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekTasks = tasks.filter(t => new Date(t.date) >= weekAgo);
      const completedWeek = weekTasks.filter(t => t.completed).length;
      setWeeklyProgress({
        completed: completedWeek,
        total: weekTasks.length
      });

      // Regenerate suggestions on data change
      generateAdaptiveSuggestions(tasks, goals, moodHistory);
      
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [tasks, goals, streakCount, isFaithMode, moodHistory, aiPersonality]);

  // Generate adaptive suggestions based on user behavior
  const generateAdaptiveSuggestions = (tasks, goals, moodHistory) => {
    const suggestions = [];
    
    // Check recent completion rate
    const recentTasks = tasks.slice(-10);
    const completedRecent = recentTasks.filter(t => t.completed).length;
    const completionRate = recentTasks.length > 0 ? completedRecent / recentTasks.length : 1;
    
    // Check mood trend
    const recentMoods = moodHistory.slice(-5);
    const lowEnergyDays = recentMoods.filter(m => m.mood === 'low').length;
    const highEnergyDays = recentMoods.filter(m => m.mood === 'high').length;
    
    // Adaptive logic
    if (completionRate < 0.3 && recentTasks.length > 5) {
      suggestions.push({
        type: 'support',
        message: 'Goals feeling heavy? Try breaking them into smaller steps.',
        action: 'Break it down',
        icon: '🌱'
      });
    }
    
    if (streakCount > 5) {
      suggestions.push({
        type: 'celebration',
        message: `${streakCount}-day streak! Ready to level up?`,
        action: 'Level up',
        icon: '🔥'
      });
    }
    
    if (lowEnergyDays > 3) {
      suggestions.push({
        type: 'rest',
        message: 'You seem tired. Today might be good for gentle tasks.',
        action: 'See gentle options',
        icon: '🌙'
      });
    }
    
    if (highEnergyDays > 3) {
      suggestions.push({
        type: 'challenge',
        message: 'Your energy is high! Great time for challenging goals.',
        action: 'Take challenge',
        icon: '⚡'
      });
    }
    
    // Check incomplete goals
    const incompleteGoals = goals.filter(g => g.progress < 100);
    if (incompleteGoals.length > 0 && incompleteGoals[0]?.progress < 30) {
      suggestions.push({
        type: 'goal',
        message: `"${incompleteGoals[0].title}" needs attention. Start small.`,
        action: 'View goal',
        icon: '🎯'
      });
    }
    
    setAdaptiveSuggestions(suggestions.slice(0, 3)); // Keep top 3
  };

  // Mood tracking
  const logMood = (mood) => {
    const newMoodEntry = {
      date: new Date().toISOString(),
      mood: mood
    };
    setMoodHistory([...moodHistory, newMoodEntry]);
    setTodayMood(mood);
    
    // Adaptive response based on mood
    let message = '';
    if (mood === 'low') {
      message = "I hear you. Let's keep things gentle today. What's one small thing that might help?";
    } else if (mood === 'high') {
      message = "Great energy! Perfect time to tackle something meaningful.";
    } else {
      message = "Balanced and ready. What would you like to focus on?";
    }
    
    showNotification(message, 'info');
  };

  // Handle onboarding completion
  const handleOnboardingComplete = (firstGoal) => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('pppOnboarding', 'true');
    
    if (firstGoal) {
      addGoal(firstGoal);
    }
    
    showNotification('Welcome to Pulse Plus Plan!', 'success');
  };

  // Calculate mood trend
  const getMoodTrend = () => {
    if (moodHistory.length < 3) return 'stable';
    
    const recent = moodHistory.slice(-3).map(m => {
      if (m.mood === 'low') return 0;
      if (m.mood === 'neutral') return 1;
      return 2;
    });
    
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    if (avg < 0.7) return 'declining';
    if (avg > 1.3) return 'improving';
    return 'stable';
  };

  // Get AI greeting based on time and mood
  const getAIGreeting = () => {
    const hour = new Date().getHours();
    const coach = coachPersonalities[aiPersonality];
    const trend = getMoodTrend();
    
    let timeGreeting = '';
    if (hour < 12) timeGreeting = 'morning';
    else if (hour < 17) timeGreeting = 'afternoon';
    else timeGreeting = 'evening';
    
    let moodAdjustment = '';
    if (trend === 'declining') moodAdjustment = 'taking it gently today?';
    else if (trend === 'improving') moodAdjustment = 'on a roll!';
    else moodAdjustment = 'ready for the day?';
    
    return `Good ${timeGreeting}. ${coach.greeting} How are you ${moodAdjustment}`;
  };

  // Add task with validation
  const addTask = (newTask) => {
    if (!newTask.title) {
      showNotification('Task title is required', 'error');
      return;
    }
    
    const task = {
      id: Date.now(),
      ...newTask,
      completed: false,
      date: newTask.date || selectedDate,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, task]);
    setShowAddTask(false);
    
    // Adaptive response
    if (todayMood === 'low') {
      showNotification('Small step taken. That counts!', 'success');
    } else {
      showNotification('Task added! You\'re making progress.', 'success');
    }
  };

  // Toggle task completion with streak update and emotional check-in
  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    const now = new Date();
    
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? now.toISOString() : undefined
          } 
        : task
    ));
    
    // If task was just completed, show emotional check-in
    if (!task.completed) {
      setCompletedTaskForCheckIn(task);
      setShowEmotionalCheckIn(true);
      
      // Update streak if this is today's first completion
      const today = now.toDateString();
      const completedToday = tasks.some(t => 
        t.completed && new Date(t.completedAt).toDateString() === today
      );
      
      if (!completedToday) {
        setStreakCount(prev => prev + 1);
      }
    }
  };

  // Add goal
  const addGoal = (newGoal) => {
    if (!newGoal.title) {
      showNotification('Goal title is required', 'error');
      return;
    }
    
    const goal = {
      id: Date.now(),
      ...newGoal,
      progress: 0,
      createdAt: new Date().toISOString(),
      category: newGoal.category || 'personal'
    };
    setGoals([...goals, goal]);
    setShowAddGoal(false);
    showNotification('Goal created! Let\'s make it happen.', 'success');
  };

  // Update goal progress
  const updateGoalProgress = (id, progress) => {
    setGoals(goals.map(g => 
      g.id === id 
        ? { ...g, progress, lastUpdated: new Date().toISOString() }
        : g
    ));
    
    const goal = goals.find(g => g.id === id);
    if (goal && progress === 100 && goal.progress < 100) {
      showNotification(`🎉 Amazing! You completed: ${goal.title}`, 'success');
      setStreakCount(prev => prev + 2); // Bonus for goal completion
    }
  };

  // Quick actions with enhanced support
  const handleQuickAction = (action, data) => {
    switch(action) {
      case 'planDay':
        setShowAddTask(true);
        break;
      case 'weeklyReset':
        showNotification('Week reset. Fresh start!', 'success');
        break;
      case 'reviewGoals':
        setView('goals');
        break;
      case 'fallingBehind':
        setShowFallingBehind(true);
        break;
      case 'showQuote':
        setCurrentQuote(data);
        setTimeout(() => setCurrentQuote(null), 5000);
        break;
      case 'reschedule':
        showNotification('Let\'s find a better time for your tasks.', 'info');
        break;
      case 'breakDown':
        showNotification('Break it down into 5-minute chunks. Start with just one.', 'info');
        break;
      default:
        break;
    }
  };

  // Handle login
  const handleLogin = (email, password) => {
    const users = JSON.parse(localStorage.getItem('pppUsers') || '[]');
    const user = users.find(u => u.email === email);
    
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
      showNotification(`Welcome back, ${user.name}!`, 'success');
      return true;
    } else {
      showNotification('Invalid email or password', 'error');
      return false;
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    showNotification('Logged out successfully', 'info');
  };

  // Handle register
  const handleRegister = (userData) => {
    const newUser = {
      id: Date.now(),
      name: userData.username || userData.name,
      email: userData.email,
      ...userData
    };
    
    const users = JSON.parse(localStorage.getItem('pppUsers') || '[]');
    users.push(newUser);
    localStorage.setItem('pppUsers', JSON.stringify(users));
    
    setUser(newUser);
    setIsAuthenticated(true);
    showNotification('Account created successfully!', 'success');
  };

  // Main render
  if (!isAuthenticated) {
    return (
      <>
        {notification.show && (
          <div className="notification-toast" style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: notification.type === 'success' ? '#10b981' : 
                       notification.type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.3s ease'
          }}>
            <AlertCircle size={20} />
            {notification.message}
          </div>
        )}
        <LampLogin 
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </>
    );
  }

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="app-container" style={{
      background: 'linear-gradient(135deg, #0B1120 0%, #0F172A 100%)',
      minHeight: '100vh',
      color: '#E2E8F0'
    }}>
      {/* Notification Toast */}
      {notification.show && (
        <div className="notification-toast" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: notification.type === 'success' ? '#10b981' : 
                     notification.type === 'error' ? '#ef4444' : '#3b82f6',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideIn 0.3s ease'
        }}>
          <AlertCircle size={20} />
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px' }}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={24} color="#000" />
            </div>
            <div>
              <h1 style={{ 
                fontSize: '1.5rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                Pulse Plus
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                Plan smarter. Track progress. Grow daily.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAICoach(!showAICoach)}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <MessageCircle size={24} />
          </button>
        </div>

        {/* AI Coach Quick Bar */}
        {!showAICoach && (
          <div 
            onClick={() => setShowAICoach(true)}
            style={{
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.1)',
              borderRadius: '20px',
              padding: '16px',
              marginBottom: '24px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {coachPersonalities[aiPersonality]?.icon ? 
                  React.createElement(coachPersonalities[aiPersonality].icon, { size: 24, color: '#10b981' }) :
                  <Brain size={24} color="#10b981" />
                }
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.9rem', color: '#94A3B8', margin: 0 }}>
                  {coachPersonalities[aiPersonality]?.name || 'AI Coach'}
                </p>
                <p style={{ fontSize: '1rem', fontWeight: '500', color: '#E2E8F0', margin: 0 }}>
                  {getAIGreeting()}
                </p>
              </div>
              <ChevronRight size={20} color="#10b981" />
            </div>
          </div>
        )}

        {/* AI Coach Expanded View */}
        {showAICoach && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.1)',
            borderRadius: '24px',
            padding: '20px',
            marginBottom: '24px',
            animation: 'slideDown 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {coachPersonalities[aiPersonality]?.icon ? 
                  React.createElement(coachPersonalities[aiPersonality].icon, { size: 28, color: '#10b981' }) :
                  <Brain size={28} color="#10b981" />
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#E2E8F0', margin: 0 }}>
                    {coachPersonalities[aiPersonality]?.name}
                  </p>
                  <select
                    value={aiPersonality}
                    onChange={(e) => setAiPersonality(e.target.value)}
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '8px',
                      color: '#10b981',
                      padding: '4px 8px',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {Object.entries(coachPersonalities).map(([key, value]) => (
                      <option key={key} value={key}>{value.name}</option>
                    ))}
                  </select>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
                  {coachPersonalities[aiPersonality]?.description}
                </p>
              </div>
              <button
                onClick={() => setShowAICoach(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#E2E8F0', margin: 0 }}>
                {getAIGreeting()}
              </p>
            </div>

            {/* Adaptive Suggestions */}
            {adaptiveSuggestions.length > 0 && (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '12px' }}>
                  Based on your patterns:
                </p>
                {adaptiveSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (suggestion.action === 'View goal') setView('goals');
                      else if (suggestion.action === 'Break it down') showNotification('Break it into 5-minute chunks', 'info');
                    }}
                    style={{
                      width: '100%',
                      background: 'rgba(16, 185, 129, 0.05)',
                      border: '1px solid rgba(16, 185, 129, 0.1)',
                      borderRadius: '12px',
                      padding: '12px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{suggestion.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.9rem', color: '#E2E8F0', margin: 0 }}>
                        {suggestion.message}
                      </p>
                    </div>
                    <ChevronRight size={16} color="#10b981" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mood Tracker */}
        <MoodTracker 
          todayMood={todayMood}
          onLogMood={logMood}
          moodHistory={moodHistory}
        />

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '20px',
            padding: '16px',
            border: '1px solid rgba(71, 85, 105, 0.3)'
          }}>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0 0 4px 0' }}>
              Current Streak
            </p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', margin: 0 }}>
              {streakCount}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '4px 0 0 0' }}>
              {streakCount > 0 ? 'days 🔥' : 'start today'}
            </p>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '20px',
            padding: '16px',
            border: '1px solid rgba(71, 85, 105, 0.3)'
          }}>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0 0 4px 0' }}>
              Weekly Progress
            </p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', margin: 0 }}>
              {weeklyProgress.completed}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '4px 0 0 0' }}>
              of {weeklyProgress.total} tasks
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions onAction={handleQuickAction} />

        {/* Main Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {[
            { id: 'dashboard', label: 'Home', icon: Home },
            { id: 'tasks', label: 'Tasks', icon: Calendar },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'growth', label: 'Growth', icon: TrendingUp },
            { id: 'logbook', label: 'Log', icon: BookOpen },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              style={{
                flex: 1,
                padding: '12px',
                background: view === item.id ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                border: view === item.id ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(71, 85, 105, 0.3)',
                borderRadius: '12px',
                color: view === item.id ? '#10b981' : '#94A3B8',
                fontWeight: view === item.id ? '600' : '400',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.7rem'
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{ minHeight: '400px' }}>
          {view === 'dashboard' && (
            <>
              {/* Daily Balance */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '24px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(71, 85, 105, 0.3)'
              }}>
                <h3 style={{ fontSize: '1rem', color: '#E2E8F0', margin: '0 0 16px 0' }}>
                  Today's Balance
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { category: 'mind', icon: Brain, color: '#10b981', label: 'Mind' },
                    { category: 'body', icon: Dumbbell, color: '#10b981', label: 'Body' },
                    { category: 'soul', icon: Heart, color: '#10b981', label: 'Soul' }
                  ].map(item => (
                    <div key={item.category} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '16px',
                        background: dailyBalance[item.category] 
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'rgba(30, 41, 59, 0.6)',
                        border: dailyBalance[item.category] 
                          ? '2px solid #10b981'
                          : '1px solid rgba(71, 85, 105, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px'
                      }}>
                        <item.icon size={24} color={dailyBalance[item.category] ? '#10b981' : '#64748B'} />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: dailyBalance[item.category] ? '#10b981' : '#94A3B8', margin: 0 }}>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Tasks Preview */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '24px',
                padding: '20px',
                border: '1px solid rgba(71, 85, 105, 0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1rem', color: '#E2E8F0', margin: 0 }}>
                    Today's Tasks
                  </h3>
                  <button
                    onClick={() => setShowAddTask(true)}
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '8px',
                      color: '#10b981',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                {tasks.filter(t => t.date === selectedDate).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                    <Calendar size={40} color="#64748B" />
                    <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '12px' }}>
                      No tasks for today
                    </p>
                  </div>
                ) : (
                  tasks
                    .filter(t => t.date === selectedDate)
                    .slice(0, 3)
                    .map(task => (
                      <div
                        key={task.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          background: 'rgba(30, 41, 59, 0.4)',
                          borderRadius: '12px',
                          marginBottom: '8px'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          style={{
                            width: '22px',
                            height: '22px',
                            accentColor: '#10b981',
                            cursor: 'pointer'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontSize: '0.95rem',
                            color: task.completed ? '#64748B' : '#E2E8F0',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            margin: 0
                          }}>
                            {task.title}
                          </p>
                          {task.timeframe && (
                            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '4px 0 0 0' }}>
                              {task.timeframe}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </>
          )}

          {view === 'tasks' && (
            <TasksView
              tasks={tasks}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              addTask={addTask}
              toggleTask={toggleTask}
              deleteTask={(id) => {
                if (window.confirm('Delete this task?')) {
                  setTasks(tasks.filter(t => t.id !== id));
                  showNotification('Task deleted', 'info');
                }
              }}
              showAddTask={showAddTask}
              setShowAddTask={setShowAddTask}
            />
          )}

          {view === 'goals' && (
            <GoalsView
              goals={goals}
              addGoal={addGoal}
              updateGoalProgress={updateGoalProgress}
              showAddGoal={showAddGoal}
              setShowAddGoal={setShowAddGoal}
            />
          )}

          {view === 'growth' && (
            <GrowthDashboard
              tasks={tasks}
              goals={goals}
              streakCount={streakCount}
            />
          )}

          {view === 'logbook' && (
            <Logbook
              tasks={tasks}
              goals={goals}
              streakCount={streakCount}
              moodHistory={moodHistory}
            />
          )}

          {view === 'settings' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#E2E8F0', marginBottom: '20px' }}>
                Settings
              </h2>
              
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '16px',
                border: '1px solid rgba(71, 85, 105, 0.3)'
              }}>
                <h3 style={{ fontSize: '1rem', color: '#E2E8F0', margin: '0 0 16px 0' }}>
                  AI Companion
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: '#94A3B8', marginBottom: '8px' }}>
                    Default Personality
                  </label>
                  <select
                    value={aiPersonality}
                    onChange={(e) => setAiPersonality(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(71, 85, 105, 0.5)',
                      borderRadius: '12px',
                      color: '#E2E8F0',
                      fontSize: '0.95rem'
                    }}
                  >
                    {Object.entries(coachPersonalities).map(([key, value]) => (
                      <option key={key} value={key}>{value.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <input
                    type="checkbox"
                    id="faith-mode"
                    checked={isFaithMode}
                    onChange={(e) => setIsFaithMode(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: '#10b981' }}
                  />
                  <label htmlFor="faith-mode" style={{ color: '#E2E8F0', fontSize: '0.95rem' }}>
                    Include spiritual guidance
                  </label>
                </div>
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid rgba(71, 85, 105, 0.3)'
              }}>
                <h3 style={{ fontSize: '1rem', color: '#E2E8F0', margin: '0 0 16px 0' }}>
                  Account
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: '#94A3B8', marginBottom: '8px' }}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(71, 85, 105, 0.5)',
                      borderRadius: '12px',
                      color: '#E2E8F0',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                    color: '#ef4444',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Falling Behind Modal */}
      {showFallingBehind && (
        <FallingBehindModal
          onClose={() => setShowFallingBehind(false)}
          onGetQuote={() => {
            const quote = getRandomQuote('deep');
            handleQuickAction('showQuote', quote);
          }}
          onReschedule={() => handleQuickAction('reschedule')}
          onBreakDown={() => handleQuickAction('breakDown')}
          onReset={() => handleQuickAction('weeklyReset')}
        />
      )}

      {/* Emotional Check-in */}
      {showEmotionalCheckIn && completedTaskForCheckIn && (
        <EmotionalCheckIn
          task={completedTaskForCheckIn}
          onComplete={(data) => {
            console.log('Check-in saved:', data);
            setShowEmotionalCheckIn(false);
            setCompletedTaskForCheckIn(null);
            showNotification('Thanks for sharing! This helps me understand you better.', 'success');
          }}
          onClose={() => {
            setShowEmotionalCheckIn(false);
            setCompletedTaskForCheckIn(null);
          }}
        />
      )}

      {/* Quote Display */}
      {currentQuote && (
        <div className="quote-card" style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          maxWidth: '400px',
          margin: '0 auto',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          zIndex: 10001,
          animation: 'slideUp 0.3s ease'
        }}>
          <p className="quote-text">
            "{currentQuote.text}"
          </p>
          <p className="quote-author">
            — {currentQuote.author}
          </p>
          <button
            onClick={() => setCurrentQuote(null)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(71, 85, 105, 0.3)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              color: '#94A3B8'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.6);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default PulsePlusPlan;