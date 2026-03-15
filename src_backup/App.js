import React, { useState, useEffect } from 'react';
import { 
  Brain, Heart, Dumbbell, Calendar, Target, 
  BookOpen, TrendingUp, User, LogOut, Plus,
  CheckCircle, Clock, Filter, BarChart, Sparkles,
  Home, Trophy, Zap, Users, Settings
} from 'lucide-react';
import './App.css';
import TasksView from './TasksView';
import GoalsView from './GoalsView';
import Logbook from './Logook';
import AICompanion from './components/AICompanion';

const PulsePlusPlan = () => {
  const [view, setView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [streakCount, setStreakCount] = useState(7);
  const [dailyBalance, setDailyBalance] = useState({
    mind: false,
    body: false,
    soul: false
  });
  const [showRegister, setShowRegister] = useState(false);
  const [isFaithMode, setIsFaithMode] = useState(false); // Added for AI Companion

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('pppTasks') || '[]');
    const savedGoals = JSON.parse(localStorage.getItem('pppGoals') || '[]');
    const savedUser = JSON.parse(localStorage.getItem('pppUser') || 'null');
    const savedStreak = JSON.parse(localStorage.getItem('pppStreak') || '7');
    const savedFaithMode = JSON.parse(localStorage.getItem('pppFaithMode') || 'false');
    
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
    
    setTasks(savedTasks);
    setGoals(savedGoals);
    setStreakCount(savedStreak);
    setIsFaithMode(savedFaithMode);
    
    // Initialize with sample data if empty
    if (savedTasks.length === 0) {
      setTasks([
        { 
          id: 1, 
          title: 'Morning meditation', 
          category: 'mind', 
          date: '2024-01-01', 
          completed: true,
          timeframe: '15 minutes',
          completedAt: '2024-01-01T08:00:00'
        },
        { 
          id: 2, 
          title: 'Gym workout', 
          category: 'body', 
          date: '2024-01-01', 
          completed: true,
          timeframe: '1 hour',
          completedAt: '2024-01-01T18:00:00'
        },
        { 
          id: 3, 
          title: 'Read a book', 
          category: 'soul', 
          date: '2024-01-01', 
          completed: true,
          timeframe: '30 minutes',
          completedAt: '2024-01-01T20:00:00'
        }
      ]);
    }
    
    if (savedGoals.length === 0) {
      setGoals([
        { 
          id: 1, 
          title: 'Save $5000', 
          type: 'financial',
          category: 'mind',
          target: 'Emergency fund',
          progress: 60,
          timeline: '6 months',
          createdAt: '2024-01-01'
        },
        { 
          id: 2, 
          title: 'Run Marathon', 
          type: 'physical',
          category: 'body',
          target: 'Complete 42km',
          progress: 30,
          timeline: '1 year',
          createdAt: '2024-01-01'
        }
      ]);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('pppTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pppGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('pppStreak', JSON.stringify(streakCount));
  }, [streakCount]);

  useEffect(() => {
    localStorage.setItem('pppFaithMode', JSON.stringify(isFaithMode));
  }, [isFaithMode]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pppUser', JSON.stringify(user));
    }
  }, [user]);

  // Calculate daily balance
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.date === today && t.completed);
    
    setDailyBalance({
      mind: todayTasks.some(t => t.category === 'mind'),
      body: todayTasks.some(t => t.category === 'body'),
      soul: todayTasks.some(t => t.category === 'soul')
    });
  }, [tasks, selectedDate]);

  // Add task function
  const addTask = (newTask) => {
    const task = {
      id: Date.now(),
      ...newTask,
      completed: false,
      date: newTask.date || selectedDate,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, task]);
    setShowAddTask(false);
  };

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined
          } 
        : task
    ));
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Add goal function
  const addGoal = (newGoal) => {
    const goal = {
      id: Date.now(),
      ...newGoal,
      progress: 0,
      createdAt: new Date().toISOString()
    };
    setGoals([...goals, goal]);
    setShowAddGoal(false);
  };

  // Update goal progress
  const updateGoalProgress = (id, progress) => {
    setGoals(goals.map(g => 
      g.id === id 
        ? { ...g, progress, lastUpdated: new Date().toISOString() }
        : g
    ));
  };

  // Calculate statistics
  const getTaskStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.date === today);
    const completed = todayTasks.filter(t => t.completed).length;
    const total = todayTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  // Calculate daily balance progress
  const getDailyBalanceProgress = () => {
    const completed = Object.values(dailyBalance).filter(Boolean).length;
    return {
      completed,
      total: 3,
      percentage: Math.round((completed / 3) * 100)
    };
  };

  // Handle authentication
  const handleLogin = (email, password) => {
    // Simple mock authentication
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: email
    };
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const handleRegister = (name, email, password) => {
    const newUser = {
      id: Date.now(),
      name,
      email
    };
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('pppUser');
  };

  // Auth Components
  const Login = ({ onLogin, onSwitchToRegister }) => (
    <div className="auth-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center'
      }}>
        <div className="floating" style={{ marginBottom: '32px' }}>
          <Sparkles size={48} style={{ color: '#fbbf24' }} />
        </div>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#e2e8f0',
          marginBottom: '8px'
        }}>
          Welcome Back
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '32px' }}>
          Sign in to continue your journey
        </p>
        
        <input
          type="email"
          placeholder="Email"
          id="login-email"
          style={{
            width: '100%',
            padding: '14px 16px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            borderRadius: '12px',
            color: '#cbd5e1',
            marginBottom: '16px',
            fontSize: '1rem'
          }}
        />
        
        <input
          type="password"
          placeholder="Password"
          id="login-password"
          style={{
            width: '100%',
            padding: '14px 16px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            borderRadius: '12px',
            color: '#cbd5e1',
            marginBottom: '24px',
            fontSize: '1rem'
          }}
        />
        
        <button
          onClick={() => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            if (email && password) handleLogin(email, password);
          }}
          className="luxury-button ripple"
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(to right, #fbbf24, #facc15)',
            color: '#000',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          Sign In
        </button>
        
        <button
          onClick={onSwitchToRegister}
          style={{
            width: '100%',
            padding: '16px',
            background: 'transparent',
            color: '#cbd5e1',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  );

  const Register = ({ onRegister, onSwitchToLogin }) => (
    <div className="auth-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center'
      }}>
        <div className="floating" style={{ marginBottom: '32px' }}>
          <Users size={48} style={{ color: '#fbbf24' }} />
        </div>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#e2e8f0',
          marginBottom: '8px'
        }}>
          Create Account
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '32px' }}>
          Start your balanced life journey
        </p>
        
        <input
          type="text"
          placeholder="Full Name"
          id="register-name"
          style={{
            width: '100%',
            padding: '14px 16px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            borderRadius: '12px',
            color: '#cbd5e1',
            marginBottom: '16px',
            fontSize: '1rem'
          }}
        />
        
        <input
          type="email"
          placeholder="Email"
          id="register-email"
          style={{
            width: '100%',
            padding: '14px 16px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            borderRadius: '12px',
            color: '#cbd5e1',
            marginBottom: '16px',
            fontSize: '1rem'
          }}
        />
        
        <input
          type="password"
          placeholder="Password"
          id="register-password"
          style={{
            width: '100%',
            padding: '14px 16px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            borderRadius: '12px',
            color: '#cbd5e1',
            marginBottom: '24px',
            fontSize: '1rem'
          }}
        />
        
        <button
          onClick={() => {
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            if (name && email && password) handleRegister(name, email, password);
          }}
          className="luxury-button ripple"
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(to right, #fbbf24, #facc15)',
            color: '#000',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          Create Account
        </button>
        
        <button
          onClick={onSwitchToLogin}
          style={{
            width: '100%',
            padding: '16px',
            background: 'transparent',
            color: '#cbd5e1',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );

  // Welcome Screen Component
  const WelcomeScreen = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 200px)',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div className="glass-card gradient-border" style={{
        maxWidth: '600px',
        padding: '48px 32px',
        borderRadius: '24px'
      }}>
        <div className="floating" style={{ marginBottom: '24px' }}>
          <Sparkles size={64} style={{ color: '#fbbf24' }} />
        </div>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px'
        }}>
          Welcome to Pulse Plus Plan
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#94a3b8',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          Balance your mind, body, and soul in one unified platform. 
          Track your daily activities, set meaningful goals, and build 
          sustainable habits that lead to a more fulfilling life.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <Brain size={32} style={{ color: '#3b82f6', marginBottom: '12px' }} />
            <p style={{ fontWeight: '600', color: '#e2e8f0', marginBottom: '4px' }}>Mind</p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Boost your cognitive abilities</p>
          </div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <Dumbbell size={32} style={{ color: '#10b981', marginBottom: '12px' }} />
            <p style={{ fontWeight: '600', color: '#e2e8f0', marginBottom: '4px' }}>Body</p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Enhance physical wellness</p>
          </div>
          <div style={{
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <Heart size={32} style={{ color: '#a855f7', marginBottom: '12px' }} />
            <p style={{ fontWeight: '600', color: '#e2e8f0', marginBottom: '4px' }}>Soul</p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Nourish your inner self</p>
          </div>
        </div>
        <button
          onClick={() => setView('dashboard')}
          className="luxury-button ripple"
          style={{
            padding: '16px 32px',
            background: 'linear-gradient(to right, #fbbf24, #facc15)',
            color: '#000',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );

  // Dashboard Component
  const Dashboard = () => {
    const stats = getTaskStats();
    const balanceProgress = getDailyBalanceProgress();
    const todayTasks = tasks.filter(t => t.date === selectedDate);

    return (
      <div className="fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <Home size={32} style={{ color: '#fbbf24' }} />
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #fbbf24, #facc15)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Dashboard Overview
          </h2>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          <div className="glass-card stat-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(251, 191, 36, 0.8)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                  Today's Progress
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '4px' }}>
                  {stats.percentage}%
                </p>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                  {stats.completed} of {stats.total} tasks
                </p>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '12px' }}>
                <TrendingUp size={32} style={{ color: '#fbbf24' }} />
              </div>
            </div>
          </div>

          <div className="glass-card stat-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(16, 185, 129, 0.8)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                  Daily Balance
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
                  {balanceProgress.completed}/3
                </p>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                  How Can We Balance Your Day?
                </p>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px' }}>
                <Target size={32} style={{ color: '#10b981' }} />
              </div>
            </div>
          </div>

          <div className="glass-card stat-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(168, 85, 247, 0.8)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                  Current Streak
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#a855f7', marginBottom: '4px' }}>
                  {streakCount} days
                </p>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                  Keep going! 🔥
                </p>
              </div>
              <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '12px', borderRadius: '12px' }}>
                <Trophy size={32} style={{ color: '#a855f7' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Balance Section */}
        <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '24px' }}>
            How Can We Balance Your Day?
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { category: 'mind', icon: Brain, color: '#3b82f6', title: 'Mind', description: 'Complete a cognitive task' },
              { category: 'body', icon: Dumbbell, color: '#10b981', title: 'Body', description: 'Finish a physical activity' },
              { category: 'soul', icon: Heart, color: '#a855f7', title: 'Soul', description: 'Do something for your soul' }
            ].map(item => (
              <div 
                key={item.category}
                style={{
                  background: dailyBalance[item.category] 
                    ? `rgba(${parseInt(item.color.slice(1,3), 16)}, ${parseInt(item.color.slice(3,5), 16)}, ${parseInt(item.color.slice(5,7), 16)}, 0.2)`
                    : 'rgba(30, 41, 59, 0.6)',
                  border: `2px solid ${dailyBalance[item.category] ? item.color : 'rgba(71, 85, 105, 0.3)'}`,
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <item.icon size={40} style={{ 
                  color: dailyBalance[item.category] ? item.color : '#64748b',
                  marginBottom: '12px' 
                }} />
                <p style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 'bold', 
                  color: dailyBalance[item.category] ? item.color : '#e2e8f0',
                  marginBottom: '4px'
                }}>
                  {item.title}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '12px' }}>
                  {item.description}
                </p>
                {dailyBalance[item.category] ? (
                  <CheckCircle size={20} style={{ color: item.color }} />
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Pending</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Zap size={24} style={{ color: '#fbbf24' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e2e8f0' }}>
              Smart Suggestions
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <p style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '4px' }}>
                💡 Creative tasks work better in the morning (8-11 AM)
              </p>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                Based on your productivity patterns
              </p>
            </div>
            
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <p style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '4px' }}>
                💪 Fitness activities are best scheduled in the late afternoon (4-7 PM)
              </p>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                Energy levels are typically highest at this time
              </p>
            </div>
            
            <div style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <p style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '4px' }}>
                ✨ Soul-nourishing activities work best on weekends
              </p>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                Give yourself time to relax and recharge
              </p>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e2e8f0' }}>
              Today's Tasks
            </h3>
            <button
              onClick={() => setView('tasks')}
              style={{
                padding: '10px 20px',
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              View All
            </button>
          </div>
          
          {todayTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Calendar size={48} style={{ color: '#64748b', marginBottom: '16px' }} />
              <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
                No tasks for today. Add some to get started!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {todayTasks.slice(0, 3).map(task => {
                const colors = {
                  mind: { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' },
                  body: { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
                  soul: { bg: 'rgba(168, 85, 247, 0.2)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.3)' }
                };
                const color = colors[task.category] || colors.mind;
                
                return (
                  <div key={task.id} className="task-item" style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    border: '1px solid rgba(71, 85, 105, 0.3)'
                  }}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{
                        color: task.completed ? '#64748b' : '#e2e8f0',
                        fontWeight: '600',
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}>
                        {task.title}
                      </p>
                      {task.timeframe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                          <Clock size={14} style={{ color: '#64748b' }} />
                          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            {task.timeframe}
                          </span>
                        </div>
                      )}
                    </div>
                    <span style={{
                      padding: '6px 12px',
                      background: color.bg,
                      color: color.text,
                      border: `1px solid ${color.border}`,
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {task.category}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main App Render
  if (!isAuthenticated) {
    return showRegister ? (
      <Register 
        onRegister={handleRegister} 
        onSwitchToLogin={() => setShowRegister(false)} 
      />
    ) : (
      <Login 
        onLogin={handleLogin} 
        onSwitchToRegister={() => setShowRegister(true)} 
      />
    );
  }

  return (
    <div className="app-container">
      {/* Background Effects */}
      <div className="app-background"></div>
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`
          }}></div>
        ))}
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div className="glass-card gradient-border" style={{ 
          padding: '32px', 
          marginBottom: '32px',
          borderRadius: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', 
                padding: '12px', 
                borderRadius: '12px' 
              }}>
                <Sparkles size={28} style={{ color: '#000' }} />
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Pulse Plus Plan
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
                  Balance your day, week, month, and year with elegance
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#e2e8f0', fontWeight: '600' }}>{user?.name}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{user?.email}</p>
              </div>
              <div style={{ 
                background: 'rgba(251, 191, 36, 0.1)', 
                padding: '10px', 
                borderRadius: '12px' 
              }}>
                <User size={24} style={{ color: '#fbbf24' }} />
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="glass-card" style={{ 
          padding: '24px', 
          marginBottom: '32px',
          borderRadius: '20px'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home, color: '#fbbf24' },
              { id: 'tasks', label: 'Tasks', icon: Calendar, color: '#10b981' },
              { id: 'goals', label: 'Goals', icon: Target, color: '#a855f7' },
              { id: 'logbook', label: 'Logbook', icon: BookOpen, color: '#3b82f6' },
              { id: 'welcome', label: 'Welcome', icon: Sparkles, color: '#06b6d4' },
              { id: 'settings', label: 'Settings', icon: Settings, color: '#64748b' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className="ripple"
                style={{
                  padding: '14px 24px',
                  background: view === item.id 
                    ? `linear-gradient(to right, ${item.color}, ${item.color}dd)` 
                    : 'rgba(30, 41, 59, 0.6)',
                  color: view === item.id ? (item.id === 'dashboard' ? '#000' : '#fff') : '#94a3b8',
                  border: view === item.id ? 'none' : '1px solid rgba(71, 85, 105, 0.5)',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="glass-card" style={{ 
          padding: '32px', 
          borderRadius: '20px',
          minHeight: '500px'
        }}>
          {view === 'welcome' && <WelcomeScreen />}
          {view === 'dashboard' && <Dashboard />}
          {view === 'tasks' && (
            <TasksView
              tasks={tasks}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              addTask={addTask}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
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
          {view === 'logbook' && (
            <Logbook
              tasks={tasks}
              goals={goals}
              streakCount={streakCount}
            />
          )}
          {view === 'settings' && (
            <div className="fade-in">
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #64748b, #94a3b8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '32px'
              }}>
                Settings
              </h2>
              <div className="glass-card" style={{ padding: '32px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '20px' }}>
                  Account Settings
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    placeholder="Full Name"
                    style={{
                      padding: '14px 16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(71, 85, 105, 0.5)',
                      borderRadius: '12px',
                      color: '#cbd5e1',
                      fontSize: '1rem'
                    }}
                  />
                  <input
                    type="email"
                    defaultValue={user?.email}
                    placeholder="Email"
                    style={{
                      padding: '14px 16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(71, 85, 105, 0.5)',
                      borderRadius: '12px',
                      color: '#cbd5e1',
                      fontSize: '1rem'
                    }}
                  />
                  <button style={{
                    padding: '14px',
                    background: 'linear-gradient(to right, #fbbf24, #facc15)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}>
                    Update Profile
                  </button>
                </div>
              </div>
              
              <div className="glass-card" style={{ padding: '32px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '20px' }}>
                  AI Companion Settings
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      id="faith-mode"
                      checked={isFaithMode}
                      onChange={(e) => setIsFaithMode(e.target.checked)}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <label htmlFor="faith-mode" style={{ color: '#e2e8f0', cursor: 'pointer' }}>
                      Enable faith-based support (includes Bible verses)
                    </label>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    When enabled, the AI Companion will include inspirational Bible verses in daily messages.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Companion - Always available when authenticated */}
      {isAuthenticated && (
        <AICompanion
          userProfile={user}
          tasks={tasks}
          goals={goals}
          habits={[]} // You can add habits functionality later
          streakCount={streakCount}
          isFaithMode={isFaithMode}
        />
      )}
    </div>
  );
};

export default PulsePlusPlan;