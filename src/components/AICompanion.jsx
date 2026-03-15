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
  BookOpen,
  Settings,
  Edit3,
  Save,
  Star,
  Moon,
  Sun,
  Coffee,
  Smile,
  Frown,
  Meh,
  Zap,
  Award,
  Compass,
  Feather,
  Anchor,
  Leaf,
  Droplet,
  Flame
} from 'lucide-react';

const AICompanion = ({ 
  userProfile, 
  tasks = [], 
  goals = [], 
  habits = [], 
  streakCount = 0,
  isFaithMode = false,
  onUpdateSettings 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userMood, setUserMood] = useState('neutral');
  const [companionName, setCompanionName] = useState(() => {
    return localStorage.getItem('companionName') || 'Sage';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [companionPersonality, setCompanionPersonality] = useState(() => {
    return localStorage.getItem('companionPersonality') || 'wise';
  });
  const messagesEndRef = useRef(null);

  // Companion personalities
  const personalities = {
    wise: {
      name: 'Wise Sage',
      greeting: 'Wisdom is not gained in a day, but through consistent effort.',
      icon: <Brain size={20} />
    },
    encouraging: {
      name: 'Cheerleader',
      greeting: 'You\'ve got this! Every step forward is progress!',
      icon: <ThumbsUp size={20} />
    },
    calm: {
      name: 'Peaceful Guide',
      greeting: 'Take a deep breath. Peace begins with a single moment of calm.',
      icon: <Feather size={20} />
    },
    energetic: {
      name: 'Motivator',
      greeting: 'Let\'s crush those goals! Energy and focus await!',
      icon: <Zap size={20} />
    },
    nurturing: {
      name: 'Gentle Friend',
      greeting: 'I\'m here for you, always. How are you feeling today?',
      icon: <Heart size={20} />
    }
  };

  // Expanded motivational quotes database
  const motivationalQuotes = [
    // Wisdom quotes
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "wisdom" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "wisdom" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "action" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "perseverance" },
    { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown", category: "consistency" },
    { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki", category: "action" },
    { text: "Progress, not perfection.", author: "Unknown", category: "growth" },
    { text: "One day or day one. You decide.", author: "Unknown", category: "action" },
    
    // Growth mindset
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "passion" },
    { text: "Don't let yesterday take up too much of today.", author: "Will Rogers", category: "mindfulness" },
    { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis", category: "goals" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "confidence" },
    
    // Resilience
    { text: "Fall seven times, stand up eight.", author: "Japanese Proverb", category: "resilience" },
    { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius", category: "resilience" },
    { text: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.", author: "Rikki Rogers", category: "strength" },
    
    // Balance
    { text: "Balance is not something you find, it's something you create.", author: "Jana Kingsford", category: "balance" },
    { text: "Happiness is not a matter of intensity but of balance, order, rhythm and harmony.", author: "Thomas Merton", category: "balance" },
    
    // African proverbs
    { text: "If you want to go fast, go alone. If you want to go far, go together.", author: "African Proverb", category: "community" },
    { text: "Smooth seas do not make skillful sailors.", author: "African Proverb", category: "growth" },
    { text: "The child who is not embraced by the village will burn it down to feel its warmth.", author: "African Proverb", category: "community" },
    
    // Eastern wisdom
    { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", category: "wisdom" },
    { text: "When the student is ready, the teacher will appear.", author: "Buddhist Proverb", category: "learning" },
    { text: "Let go or be dragged.", author: "Zen Proverb", category: "mindfulness" }
  ];

  // Expanded Bible verses with categories
  const bibleVerses = [
    { verse: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13", category: "strength" },
    { verse: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.", reference: "Jeremiah 29:11", category: "hope" },
    { verse: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.", reference: "Isaiah 40:31", category: "strength" },
    { verse: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9", category: "courage" },
    { verse: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7", category: "peace" },
    { verse: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", reference: "Philippians 4:6", category: "peace" },
    { verse: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1", category: "trust" },
    { verse: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", reference: "Proverbs 3:5-6", category: "trust" },
    { verse: "Come to me, all you who are weary and burdened, and I will give you rest.", reference: "Matthew 11:28", category: "rest" },
    { verse: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.", reference: "Matthew 6:34", category: "peace" },
    { verse: "I have fought the good fight, I have finished the race, I have kept the faith.", reference: "2 Timothy 4:7", category: "perseverance" },
    { verse: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", reference: "Galatians 6:9", category: "perseverance" }
  ];

  // Save companion settings
  useEffect(() => {
    localStorage.setItem('companionName', companionName);
    localStorage.setItem('companionPersonality', companionPersonality);
    if (onUpdateSettings) {
      onUpdateSettings({ name: companionName, personality: companionPersonality });
    }
  }, [companionName, companionPersonality]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const personality = personalities[companionPersonality];
      const greeting = personality.greeting;
      
      const welcomeMessage = {
        id: 1,
        text: `Hello ${userProfile?.name || 'there'}! I'm ${companionName}, your ${personality.name}. ${greeting} How can I support you today?`,
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
      
      const initialMessages = [welcomeMessage, quoteMessage];
      
      // Add Bible verse if faith mode is enabled
      if (isFaithMode) {
        const randomVerse = bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
        const verseMessage = {
          id: 3,
          text: `📖 ${randomVerse.verse} (${randomVerse.reference})`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        initialMessages.push(verseMessage);
      }
      
      setMessages(initialMessages);
    }
  }, [isOpen, companionName, companionPersonality, isFaithMode]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const analyzeUserMessage = (text) => {
    const lowerText = text.toLowerCase();
    
    // Detect mood
    if (lowerText.includes('stress') || lowerText.includes('anxious') || lowerText.includes('worried') || 
        lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('overwhelmed') ||
        lowerText.includes('tired') || lowerText.includes('exhausted')) {
      setUserMood('stressed');
    } else if (lowerText.includes('happy') || lowerText.includes('excited') || lowerText.includes('great') || 
               lowerText.includes('awesome') || lowerText.includes('good') || lowerText.includes('better') ||
               lowerText.includes('proud') || lowerText.includes('accomplished')) {
      setUserMood('positive');
    } else if (lowerText.includes('relapse') || lowerText.includes('slipped') || lowerText.includes('failed') || 
               lowerText.includes('couldn\'t resist') || lowerText.includes('gave in') || lowerText.includes('mistake')) {
      setUserMood('relapse');
    } else if (lowerText.includes('confused') || lowerText.includes('unsure') || lowerText.includes('doubt')) {
      setUserMood('uncertain');
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
               lowerText.includes('smoking') || lowerText.includes('using') || lowerText.includes('cigarette')) {
      return 'habit_support';
    } else if (lowerText.includes('feel') || lowerText.includes('emotion') || lowerText.includes('anxious') || 
               lowerText.includes('depressed') || lowerText.includes('lonely') || lowerText.includes('struggling') ||
               lowerText.includes('heart') || lowerText.includes('hurt')) {
      return 'emotional_support';
    } else if (lowerText.includes('plan') || lowerText.includes('schedule') || lowerText.includes('organize') ||
               lowerText.includes('time') || lowerText.includes('routine')) {
      return 'planning';
    } else if (lowerText.includes('motivat') || lowerText.includes('encourage') || lowerText.includes('stuck') ||
               lowerText.includes('inspire')) {
      return 'motivation';
    } else if (lowerText.includes('bible') || lowerText.includes('verse') || lowerText.includes('scripture') ||
               lowerText.includes('god') || lowerText.includes('jesus') || lowerText.includes('pray')) {
      return 'spiritual';
    } else if (lowerText.includes('thank') || lowerText.includes('grateful') || lowerText.includes('appreciate')) {
      return 'gratitude';
    } else if (lowerText.includes('name') && lowerText.includes('change')) {
      return 'change_name';
    } else {
      return 'general';
    }
  };

  const generateAIResponse = (userMessage, intent) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let response = '';
      const personality = personalities[companionPersonality];
      
      // Add personality prefix
      const getPersonalityPrefix = () => {
        switch(companionPersonality) {
          case 'wise': return 'In my wisdom, ';
          case 'encouraging': return 'You\'re doing amazing! ';
          case 'calm': return 'Take a moment to breathe. ';
          case 'energetic': return 'Let\'s GO! ';
          case 'nurturing': return 'Sweet friend, ';
          default: return '';
        }
      };
      
      switch(intent) {
        case 'task_support':
          const incompleteTasks = tasks.filter(t => !t.completed);
          if (incompleteTasks.length > 0) {
            response = `${getPersonalityPrefix()}I see you have ${incompleteTasks.length} task${incompleteTasks.length > 1 ? 's' : ''} pending. Let's create a gentle action plan:\n\n`;
            incompleteTasks.slice(0, 3).forEach((task, index) => {
              const icons = ['🌱', '🌟', '💫', '✨', '🌸'];
              response += `${icons[index]} **${task.title}** (${task.category})\n`;
              response += `   → Start with just 5 minutes\n`;
              response += `   → Break into smaller steps\n`;
              if (task.timeframe) response += `   → Time needed: ${task.timeframe}\n\n`;
            });
            
            if (userMood === 'stressed') {
              response += "Remember: Even small steps count. Which task feels most manageable right now?";
            } else {
              response += "Which one would you like to tackle first? I believe in you!";
            }
          } else {
            response = `${getPersonalityPrefix()}🎉 All your tasks are complete! You've earned some well-deserved rest. Would you like to plan tomorrow's tasks or work on your goals?`;
          }
          break;
          
        case 'goal_support':
          const activeGoals = goals.filter(g => g.progress < 100);
          if (activeGoals.length > 0) {
            response = `${getPersonalityPrefix()}Your goals are the seeds of your future. Here's your garden:\n\n`;
            activeGoals.forEach(goal => {
              const progressBar = '█'.repeat(Math.floor(goal.progress/10)) + '░'.repeat(10-Math.floor(goal.progress/10));
              const emoji = goal.type === 'financial' ? '💰' : 
                           goal.type === 'physical' ? '💪' : 
                           goal.type === 'mental' ? '🧠' : 
                           goal.type === 'emotional' ? '❤️' : '🎯';
              response += `${emoji} **${goal.title}**: ${progressBar} ${goal.progress}%\n`;
              if (goal.timeline) response += `   ⏱️ Timeline: ${goal.timeline}\n`;
            });
            response += "\nWhat's one small step you can take today toward any of these goals?";
          } else {
            response = `${getPersonalityPrefix()}It looks like you haven't set any goals yet. Let's dream together! What would you love to achieve in the next 3-6 months?`;
          }
          break;
          
        case 'habit_support':
          const today = new Date().toISOString().split('T')[0];
          const todaysHabits = habits.filter(h => h.lastTracked === today);
          
          if (userMood === 'relapse') {
            response = `${getPersonalityPrefix()}I hear your struggle, and that's okay. Relapse is part of the journey, not the end of it.\n\n`;
            response += "🌱 **Gentle reflections:**\n";
            response += "1. What triggered this moment? (stress, boredom, environment?)\n";
            response += "2. What's one thing you can learn from this?\n";
            response += "3. Tomorrow is a fresh start - what support do you need?\n\n";
            
            if (isFaithMode) {
              const comfortVerse = bibleVerses.find(v => v.category === 'strength') || bibleVerses[0];
              response += `📖 "${comfortVerse.verse}" (${comfortVerse.reference})\n\n`;
            }
            
            response += "Your worth isn't measured by perfection. How can I support you right now?";
          } else {
            response = `${getPersonalityPrefix()}You're building strength with every choice. You've tracked ${todaysHabits.length} habit${todaysHabits.length !== 1 ? 's' : ''} today.\n\n`;
            response += "**Daily reminders:**\n";
            response += "• One moment at a time\n";
            response += "• Notice your triggers\n";
            response += "• Have go-to alternatives ready\n";
            response += "• Celebrate every win, no matter how small\n\n";
            
            if (streakCount > 0) {
              response += `Your ${streakCount}-day streak shows your commitment! What's one thing helping you stay consistent?`;
            } else {
              response += "Today is day one of your new chapter. What support do you need?";
            }
          }
          break;
          
        case 'emotional_support':
          if (userMood === 'stressed') {
            response = `${getPersonalityPrefix()}It's completely valid to feel overwhelmed. Let's ground ourselves together:\n\n`;
            response += "🌬️ **Take 3 deep breaths**\n";
            response += "👀 **Name 5 things you can see**\n";
            response += "✋ **Place a hand on your heart**\n\n";
            response += "You're safe in this moment. What's one small thing that usually brings you comfort?";
            
            if (isFaithMode) {
              response += "\n\n📖 'Cast all your anxiety on him because he cares for you.' - 1 Peter 5:7";
            }
          } else if (userMood === 'positive') {
            response = `${getPersonalityPrefix()}Your positive energy is beautiful! Let's capture this feeling:\n\n`;
            response += "📝 What's contributing to this good mood?\n";
            response += "🌟 How can you carry this feeling forward?\n";
            response += "🎉 What's one thing you're grateful for right now?";
          } else {
            response = `${getPersonalityPrefix()}Thank you for trusting me with your feelings. Emotions are like waves - they come and go. Would you like to explore what's beneath these feelings, or would some gentle distraction help?`;
          }
          break;
          
        case 'planning':
          response = `${getPersonalityPrefix()}Let's weave your day with intention:\n\n`;
          response += "🌅 **Morning anchor** (15 min)\n";
          response += "☀️ **Main focus** (2-3 hours)\n";
          response += "🌤️ **Energy tasks** (1-2 hours)\n";
          response += "🌙 **Evening wind-down** (30 min)\n\n";
          response += "What's your most important task today? Let's build your schedule around it.";
          break;
          
        case 'motivation':
          const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
          response = `${getPersonalityPrefix()}Your ${streakCount}-day streak is proof of your dedication! 🏆\n\n`;
          response += `✨ "${randomQuote.text}" - ${randomQuote.author}\n\n`;
          response += "What's one tiny action you can take in the next 5 minutes to keep your momentum?";
          break;
          
        case 'spiritual':
          if (isFaithMode) {
            const randomVerse = bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
            response = `${getPersonalityPrefix()}Here's a verse for your heart:\n\n`;
            response += `📖 "${randomVerse.verse}" (${randomVerse.reference})\n\n`;
            response += "Would you like to reflect on this together or receive another verse?";
          } else {
            response = `${getPersonalityPrefix()}You can enable faith-based support in Settings to receive Bible verses and spiritual encouragement. Would you like me to help you enable that?`;
          }
          break;
          
        case 'gratitude':
          response = `${getPersonalityPrefix()}Gratitude transforms what we have into enough. What are three things you're grateful for today? They can be as simple as a warm cup of tea or a kind word from a friend.`;
          break;
          
        case 'change_name':
          response = `${getPersonalityPrefix()}You can change my name in the Settings panel, or type a new name for me right now and I'll remember it! What would you like to call me?`;
          break;
          
        default:
          const thoughtfulResponses = [
            "I'm here, listening. Tell me more about what's on your mind.",
            "Thank you for sharing that with me. How does that make you feel?",
            "I appreciate you opening up. What support would be most helpful right now?",
            "Every conversation is a step forward. What's next on your heart?"
          ];
          response = `${getPersonalityPrefix()}${thoughtfulResponses[Math.floor(Math.random() * thoughtfulResponses.length)]}`;
      }
      
      const aiResponse = {
        id: messages.length + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    // Check if user is trying to rename companion
    if (inputMessage.toLowerCase().includes('call you') || 
        inputMessage.toLowerCase().includes('name you') ||
        inputMessage.toLowerCase().includes('rename you')) {
      const newName = inputMessage.split(' ').pop();
      if (newName && newName.length > 1) {
        setCompanionName(newName);
        const response = {
          id: messages.length + 2,
          text: `I'd love to be called ${newName}! Thank you for naming me. How can ${newName} help you today?`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, response]);
        setInputMessage('');
        return;
      }
    }
    
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
        text: "Plan my day", 
        icon: <Calendar size={16} />,
        onClick: () => {
          setInputMessage("Help me plan my day");
          setTimeout(() => handleSendMessage({ preventDefault: () => {} }), 100);
        }
      },
      { 
        text: "I'm stressed", 
        icon: <AlertCircle size={16} />,
        onClick: () => {
          setInputMessage("I'm feeling stressed and need support");
          setTimeout(() => handleSendMessage({ preventDefault: () => {} }), 100);
        }
      },
      { 
        text: "Review goals", 
        icon: <Target size={16} />,
        onClick: () => {
          setInputMessage("Can you review my goals with me?");
          setTimeout(() => handleSendMessage({ preventDefault: () => {} }), 100);
        }
      },
      { 
        text: "Habit help", 
        icon: <TrendingUp size={16} />,
        onClick: () => {
          setInputMessage("I need help with my habits");
          setTimeout(() => handleSendMessage({ preventDefault: () => {} }), 100);
        }
      },
      { 
        text: "Motivate me", 
        icon: <Zap size={16} />,
        onClick: () => {
          setInputMessage("I need motivation");
          setTimeout(() => handleSendMessage({ preventDefault: () => {} }), 100);
        }
      },
      { 
        text: "Bible verse", 
        icon: <BookOpen size={16} />,
        onClick: () => {
          setInputMessage("Share a Bible verse with me");
          setTimeout(() => handleSendMessage({ preventDefault: () => {} }), 100);
        }
      },
    ];
  };

  // Floating button
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

  // Chat interface
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {personalities[companionPersonality]?.icon || <Sparkles size={20} color="white" />}
          </div>
          <div style={{ flex: 1 }}>
            {isEditingName ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Name your companion"
                  style={{
                    padding: '4px 8px',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(71, 85, 105, 0.5)',
                    borderRadius: '6px',
                    color: '#e2e8f0',
                    fontSize: '0.875rem',
                    width: '120px'
                  }}
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (tempName.trim()) {
                      setCompanionName(tempName);
                      setIsEditingName(false);
                    }
                  }}
                  style={{
                    background: 'rgba(71, 85, 105, 0.3)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  <Save size={14} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>
                  {companionName}
                </h3>
                <button
                  onClick={() => {
                    setTempName(companionName);
                    setIsEditingName(true);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                >
                  <Edit3 size={12} />
                </button>
              </div>
            )}
            <p style={{ color: '#94a3b8', fontSize: '0.7rem', margin: 0 }}>
              {personalities[companionPersonality]?.name} • {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={companionPersonality}
            onChange={(e) => setCompanionPersonality(e.target.value)}
            style={{
              background: 'rgba(71, 85, 105, 0.3)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '6px',
              color: '#e2e8f0',
              padding: '4px 8px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            {Object.entries(personalities).map(([key, value]) => (
              <option key={key} value={key} style={{ background: '#1e293b' }}>
                {value.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(71, 85, 105, 0.3)',
              border: 'none',
              borderRadius: '6px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#94a3b8'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        padding: '10px 16px',
        background: 'rgba(30, 41, 59, 0.5)',
        borderBottom: '1px solid rgba(71, 85, 105, 0.2)',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto'
      }}>
        {getQuickActions().map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            style={{
              padding: '6px 10px',
              background: 'rgba(71, 85, 105, 0.3)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '6px',
              color: '#e2e8f0',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
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

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            <div style={{
              background: message.sender === 'user' 
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                : 'rgba(30, 41, 59, 0.8)',
              color: message.sender === 'user' ? 'white' : '#e2e8f0',
              padding: '10px 14px',
              borderRadius: message.sender === 'user' 
                ? '16px 4px 16px 16px' 
                : '4px 16px 16px 16px',
              border: message.sender === 'user' 
                ? 'none' 
                : '1px solid rgba(71, 85, 105, 0.3)',
              whiteSpace: 'pre-line',
              fontSize: '0.85rem',
              lineHeight: '1.5'
            }}>
              {message.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < message.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
              <div style={{
                fontSize: '0.65rem',
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
              padding: '10px 14px',
              borderRadius: '4px 16px 16px 16px',
              border: '1px solid rgba(71, 85, 105, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#94a3b8',
                animation: 'pulse 1.5s infinite'
              }} />
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#94a3b8',
                animation: 'pulse 1.5s infinite',
                animationDelay: '0.2s'
              }} />
              <div style={{
                width: '6px',
                height: '6px',
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

      {/* Input */}
      <form onSubmit={handleSendMessage} style={{
        padding: '16px',
        borderTop: '1px solid rgba(71, 85, 105, 0.3)',
        background: 'rgba(15, 23, 42, 0.9)'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${companionName}...`}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '10px',
              color: '#e2e8f0',
              fontSize: '0.85rem'
            }}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !inputMessage.trim()}
            style={{
              padding: '10px 14px',
              background: inputMessage.trim() && !isTyping
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'rgba(71, 85, 105, 0.5)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: inputMessage.trim() && !isTyping ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={18} />
          </button>
        </div>
        <p style={{
          fontSize: '0.65rem',
          color: '#64748b',
          textAlign: 'center',
          marginTop: '6px',
          marginBottom: 0
        }}>
          You can rename me anytime by typing "call me [name]" or in Settings
        </p>
      </form>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          ::-webkit-scrollbar {
            width: 4px;
          }
          ::-webkit-scrollbar-track {
            background: rgba(71, 85, 105, 0.1);
            border-radius: 2px;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(71, 85, 105, 0.3);
            border-radius: 2px;
          }
        `}
      </style>
    </div>
  );
};

export default AICompanion;