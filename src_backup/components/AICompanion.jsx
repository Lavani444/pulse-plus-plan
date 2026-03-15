import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Brain, 
  Target, 
  TrendingUp, 
  Heart, 
  Sparkles,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  BookOpen
} from 'lucide-react';

const AICompanion = ({ 
  userProfile, 
  tasks = [], 
  goals = [], 
  habits = [], 
  streakCount = 0,
  isFaithMode = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userMood, setUserMood] = useState('neutral');
  const messagesEndRef = useRef(null);
  
  // Motivational quotes database
  const motivationalQuotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
    { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
    { text: "Progress, not perfection.", author: "Unknown" },
    { text: "One day or day one. You decide.", author: "Unknown" }
  ];

  // Bible verses (only shown in faith mode)
  const bibleVerses = [
    { verse: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
    { verse: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.", reference: "Jeremiah 29:11" },
    { verse: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.", reference: "Isaiah 40:31" },
    { verse: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9" }
  ];

  // Initialize with welcome message and daily quote
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        text: `Hello ${userProfile?.name || 'there'}! I'm your AI Companion. I'm here to help you with your tasks, goals, habits, and anything else on your mind. How can I support you today?`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Add daily motivational quote
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      const quoteMessage = {
        id: 2,
        text: `✨ Daily Inspiration: "${randomQuote.text}" - ${randomQuote.author}`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Add Bible verse if faith mode is enabled
      if (isFaithMode) {
        const randomVerse = bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
        const verseMessage = {
          id: 3,
          text: `📖 ${randomVerse.verse} (${randomVerse.reference})`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([welcomeMessage, quoteMessage, verseMessage]);
      } else {
        setMessages([welcomeMessage, quoteMessage]);
      }
    }
  }, [isOpen]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const analyzeUserMessage = (text) => {
    const lowerText = text.toLowerCase();
    
    // Detect mood from message
    if (lowerText.includes('stress') || lowerText.includes('anxious') || lowerText.includes('worried') || 
        lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('overwhelmed')) {
      setUserMood('stressed');
    } else if (lowerText.includes('happy') || lowerText.includes('excited') || lowerText.includes('great') || 
               lowerText.includes('awesome') || lowerText.includes('good') || lowerText.includes('better')) {
      setUserMood('positive');
    } else if (lowerText.includes('relapse') || lowerText.includes('slipped') || lowerText.includes('failed') || 
               lowerText.includes('couldn\'t resist') || lowerText.includes('gave in')) {
      setUserMood('relapse');
    } else {
      setUserMood('neutral');
    }
    
    // Categorize intent
    if (lowerText.includes('task') || lowerText.includes('to-do') || lowerText.includes('need to do') || 
        lowerText.includes('help me with') || lowerText.includes('how do i')) {
      return 'task_support';
    } else if (lowerText.includes('goal') || lowerText.includes('achieve') || lowerText.includes('long-term') || 
               lowerText.includes('dream') || lowerText.includes('aspiration')) {
      return 'goal_support';
    } else if (lowerText.includes('habit') || lowerText.includes('addiction') || lowerText.includes('stop') || 
               lowerText.includes('quit') || lowerText.includes('marijuana') || lowerText.includes('weed') || 
               lowerText.includes('smoking') || lowerText.includes('using')) {
      return 'habit_support';
    } else if (lowerText.includes('feel') || lowerText.includes('emotion') || lowerText.includes('anxious') || 
               lowerText.includes('depressed') || lowerText.includes('lonely') || lowerText.includes('struggling')) {
      return 'emotional_support';
    } else if (lowerText.includes('plan') || lowerText.includes('schedule') || lowerText.includes('organize')) {
      return 'planning';
    } else if (lowerText.includes('motivat') || lowerText.includes('encourage') || lowerText.includes('stuck')) {
      return 'motivation';
    } else {
      return 'general';
    }
  };

  const generateAIResponse = (userMessage, intent) => {
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      let response = '';
      
      switch(intent) {
        case 'task_support':
          const incompleteTasks = tasks.filter(t => !t.completed);
          if (incompleteTasks.length > 0) {
            response = `I see you have ${incompleteTasks.length} task${incompleteTasks.length > 1 ? 's' : ''} pending. Let's break them down:\n\n`;
            incompleteTasks.slice(0, 3).forEach((task, index) => {
              response += `${index + 1}. ${task.title} (${task.category})\n   → Start with just 5 minutes\n   → Break into smaller steps if needed\n\n`;
            });
            response += "Which one would you like to tackle first? I can help you create an action plan.";
          } else {
            response = "Great job! All your tasks are complete. Would you like to add new tasks or work on your goals?";
          }
          break;
          
        case 'goal_support':
          const activeGoals = goals.filter(g => g.progress < 100);
          if (activeGoals.length > 0) {
            response = `You're working on ${activeGoals.length} goal${activeGoals.length > 1 ? 's' : ''}. Progress update:\n\n`;
            activeGoals.forEach(goal => {
              const progressBar = '█'.repeat(Math.floor(goal.progress/20)) + '░'.repeat(5-Math.floor(goal.progress/20));
              response += `🎯 ${goal.title}: ${progressBar} ${goal.progress}%\n`;
            });
            response += "\nWould you like to set specific action steps for any of these goals this week?";
          } else {
            response = "You don't have any active goals set. Would you like to define a new goal together? Think about what you want to achieve in the next 3-6 months.";
          }
          break;
          
        case 'habit_support':
          const today = new Date().toISOString().split('T')[0];
          const todaysHabits = habits.filter(h => h.lastTracked === today);
          
          if (userMood === 'relapse') {
            response = "I hear that you're struggling. Relapses are a normal part of the recovery journey. Let's focus on:\n\n1. Be kind to yourself - no shame\n2. What triggered this? (stress, boredom, environment?)\n3. What's one small thing you can do differently next time?\n4. Tomorrow is a fresh start\n\nYour current streak may have reset, but your progress isn't lost. Would you like to talk about what happened?";
          } else {
            response = `I'm here to support your habit journey. You've tracked ${todaysHabits.length} habit${todaysHabits.length !== 1 ? 's' : ''} today.\n\n`;
            response += "Remember:\n• One day at a time\n• Track triggers and cravings\n• Have alternative activities ready\n• Celebrate small wins\n• Reach out for support when needed\n\nHow can I help you stay on track today?";
          }
          break;
          
        case 'emotional_support':
          if (userMood === 'stressed') {
            response = "It sounds like you're going through a tough time. That's completely valid. Here are some gentle suggestions:\n\n1. Take 3 deep breaths right now\n2. Name 3 things you can see around you\n3. What's one small thing you can control in this moment?\n4. Remember: this feeling will pass\n\nWould you like to talk more about what's bothering you, or would you prefer some distraction techniques?";
          } else {
            response = "Thank you for sharing how you're feeling. I'm here to listen without judgment. Sometimes just naming our emotions can make them feel more manageable. Would you like to explore what's behind these feelings, or would you prefer some coping strategies?";
          }
          break;
          
        case 'planning':
          response = "Let's create a plan together. For effective planning:\n\n1. Start with your most important task\n2. Time-block your day (e.g., 25 min work, 5 min break)\n3. Schedule breaks intentionally\n4. End your day with a quick review\n\nWould you like me to help you schedule your tasks for today or this week?";
          break;
          
        case 'motivation':
          response = `You've maintained a ${streakCount}-day streak! That's incredible consistency. Remember:\n\n• Progress is rarely linear\n• Small steps compound over time\n• Your future self will thank you\n• You've overcome challenges before\n\nWhat's one tiny action you can take right now to keep the momentum going?`;
          break;
          
        default:
          response = "Thanks for sharing that with me. I'm here to support you in whatever way you need today - whether it's tackling tasks, working on goals, managing habits, or just having someone to talk to. What's on your mind right now?";
      }
      
      const aiResponse = {
        id: messages.length + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Simulate realistic response time
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMsg = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    
    // Analyze and generate response
    const intent = analyzeUserMessage(inputMessage);
    generateAIResponse(inputMessage, intent);
    
    // Clear input
    setInputMessage('');
  };

  const getQuickActions = () => {
    return [
      { 
        text: "Help me plan my day", 
        icon: <Calendar size={16} />,
        onClick: () => {
          setInputMessage("Can you help me plan my day?");
          setTimeout(() => {
            const quickMsg = {
              id: messages.length + 1,
              text: "Can you help me plan my day?",
              sender: 'user',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, quickMsg]);
            generateAIResponse("Can you help me plan my day?", 'planning');
          }, 100);
        }
      },
      { 
        text: "I'm feeling stressed", 
        icon: <AlertCircle size={16} />,
        onClick: () => {
          setInputMessage("I'm feeling stressed and overwhelmed");
          setTimeout(() => {
            const quickMsg = {
              id: messages.length + 1,
              text: "I'm feeling stressed and overwhelmed",
              sender: 'user',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, quickMsg]);
            generateAIResponse("I'm feeling stressed and overwhelmed", 'emotional_support');
          }, 100);
        }
      },
      { 
        text: "Review my goals", 
        icon: <Target size={16} />,
        onClick: () => {
          setInputMessage("Let's review my goals");
          setTimeout(() => {
            const quickMsg = {
              id: messages.length + 1,
              text: "Let's review my goals",
              sender: 'user',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, quickMsg]);
            generateAIResponse("Let's review my goals", 'goal_support');
          }, 100);
        }
      },
      { 
        text: "Habit support", 
        icon: <TrendingUp size={16} />,
        onClick: () => {
          setInputMessage("I need support with my habits");
          setTimeout(() => {
            const quickMsg = {
              id: messages.length + 1,
              text: "I need support with my habits",
              sender: 'user',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, quickMsg]);
            generateAIResponse("I need support with my habits", 'habit_support');
          }, 100);
        }
      },
    ];
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.4)';
        }}
      >
        <MessageCircle size={28} color="white" />
      </button>
    );
  }

  // Full chat interface when open
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '400px',
      height: '600px',
      borderRadius: '20px',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(71, 85, 105, 0.3)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1001,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        background: 'rgba(15, 23, 42, 0.9)',
        borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <h3 style={{ color: '#e2e8f0', fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>
              AI Companion
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>
              {isTyping ? 'Typing...' : 'Always here to help'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'rgba(71, 85, 105, 0.3)',
            border: 'none',
            borderRadius: '8px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#94a3b8'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{
        padding: '12px 20px',
        background: 'rgba(30, 41, 59, 0.5)',
        borderBottom: '1px solid rgba(71, 85, 105, 0.2)',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto'
      }}>
        {getQuickActions().map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            style={{
              padding: '8px 12px',
              background: 'rgba(71, 85, 105, 0.3)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {action.icon}
            {action.text}
          </button>
        ))}
      </div>

      {/* Messages Container */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            <div style={{
              background: message.sender === 'user' 
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                : 'rgba(30, 41, 59, 0.8)',
              color: message.sender === 'user' ? 'white' : '#e2e8f0',
              padding: '12px 16px',
              borderRadius: message.sender === 'user' 
                ? '18px 4px 18px 18px' 
                : '4px 18px 18px 18px',
              border: message.sender === 'user' 
                ? 'none' 
                : '1px solid rgba(71, 85, 105, 0.3)',
              whiteSpace: 'pre-line',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              {message.text}
              <div style={{
                fontSize: '0.7rem',
                opacity: 0.7,
                marginTop: '4px',
                textAlign: message.sender === 'user' ? 'right' : 'left'
              }}>
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ alignSelf: 'flex-start' }}>
            <div style={{
              background: 'rgba(30, 41, 59, 0.8)',
              color: '#e2e8f0',
              padding: '12px 16px',
              borderRadius: '4px 18px 18px 18px',
              border: '1px solid rgba(71, 85, 105, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#94a3b8',
                animation: 'pulse 1.5s infinite'
              }} />
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#94a3b8',
                animation: 'pulse 1.5s infinite',
                animationDelay: '0.2s'
              }} />
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#94a3b8',
                animation: 'pulse 1.5s infinite',
                animationDelay: '0.4s'
              }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} style={{
        padding: '20px',
        borderTop: '1px solid rgba(71, 85, 105, 0.3)',
        background: 'rgba(15, 23, 42, 0.9)'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '12px',
              color: '#e2e8f0',
              fontSize: '0.875rem'
            }}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !inputMessage.trim()}
            style={{
              padding: '12px 16px',
              background: inputMessage.trim() && !isTyping
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'rgba(71, 85, 105, 0.5)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: inputMessage.trim() && !isTyping ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={20} />
          </button>
        </div>
        <p style={{
          fontSize: '0.75rem',
          color: '#64748b',
          textAlign: 'center',
          marginTop: '8px',
          marginBottom: 0
        }}>
          Your conversations are private and secure
        </p>
      </form>

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: rgba(71, 85, 105, 0.1);
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(71, 85, 105, 0.3);
            border-radius: 3px;
          }
        `}
      </style>
    </div>
  );
};

export default AICompanion;