import React, { useState, useEffect } from 'react';
import { 
  Calendar, TrendingUp, Brain, Heart, Dumbbell,
  Sparkles, Award, ChevronRight, Zap, Moon, Sun
} from 'lucide-react';

const GrowthDashboard = ({ tasks, goals, streakCount }) => {
  const [checkIns, setCheckIns] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    // Load emotional check-ins
    const savedCheckIns = JSON.parse(localStorage.getItem('emotionalCheckIns') || '[]');
    setCheckIns(savedCheckIns);
  }, []);

  useEffect(() => {
    generateInsights();
  }, [checkIns, tasks]);

  // Generate insights based on patterns
  const generateInsights = () => {
    const newInsights = [];

    // Correlation between body tasks and emotional state
    const bodyTasks = tasks.filter(t => t.category === 'body');
    if (bodyTasks.length > 0) {
      const bodyCheckIns = checkIns.filter(c => c.category === 'body');
      const happyAfterBody = bodyCheckIns.filter(c => c.emotional === 'happy').length;
      if (happyAfterBody > bodyCheckIns.length * 0.6) {
        newInsights.push({
          icon: '💪',
          title: 'Physical Activity Boosts Mood',
          message: 'You tend to feel happier after body-related tasks. Keep moving!',
          color: '#10b981'
        });
      }
    }

    // Correlation between mind tasks and mental clarity
    const mindTasks = tasks.filter(t => t.category === 'mind');
    if (mindTasks.length > 0) {
      const mindCheckIns = checkIns.filter(c => c.category === 'mind');
      const clearAfterMind = mindCheckIns.filter(c => c.mental === 'clear').length;
      if (clearAfterMind > mindCheckIns.length * 0.5) {
        newInsights.push({
          icon: '🧠',
          title: 'Mental Work Creates Clarity',
          message: 'Your mind feels clearest after cognitive tasks. Prioritize these in the morning.',
          color: '#3b82f6'
        });
      }
    }

    // Correlation between soul tasks and emotional state
    const soulTasks = tasks.filter(t => t.category === 'soul');
    if (soulTasks.length > 0) {
      const soulCheckIns = checkIns.filter(c => c.category === 'soul');
      const gratefulAfterSoul = soulCheckIns.filter(c => c.emotional === 'grateful').length;
      if (gratefulAfterSoul > soulCheckIns.length * 0.5) {
        newInsights.push({
          icon: '❤️',
          title: 'Soul Nourishment Brings Gratitude',
          message: 'Activities for your soul consistently leave you feeling grateful.',
          color: '#a855f7'
        });
      }
    }

    // Streak insight
    if (streakCount > 7) {
      newInsights.push({
        icon: '🔥',
        title: `${streakCount}-Day Streak!`,
        message: 'Your consistency is building momentum. You\'re 2x more likely to achieve your goals.',
        color: '#f59e0b'
      });
    }

    // Energy patterns
    const energeticDays = checkIns.filter(c => c.physical === 'energetic').length;
    const tiredDays = checkIns.filter(c => c.physical === 'tired').length;
    if (energeticDays > tiredDays * 2) {
      newInsights.push({
        icon: '⚡',
        title: 'High Energy Pattern',
        message: 'You\'re mostly energetic! Your best time for challenging tasks is likely mid-day.',
        color: '#fbbf24'
      });
    }

    setInsights(newInsights.slice(0, 4)); // Keep top 4
  };

  // Generate heatmap data (last 90 days)
  const generateHeatmap = () => {
    const heatmap = [];
    const today = new Date();
    
    for (let i = 90; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const tasksOnDay = tasks.filter(t => t.date === dateStr);
      const completedOnDay = tasksOnDay.filter(t => t.completed).length;
      const totalOnDay = tasksOnDay.length;
      
      let intensity = 0;
      if (totalOnDay > 0) {
        intensity = (completedOnDay / totalOnDay) * 4;
      }
      
      heatmap.push({
        date: dateStr,
        intensity: Math.floor(intensity),
        completed: completedOnDay,
        total: totalOnDay
      });
    }
    
    return heatmap;
  };

  const heatmapData = generateHeatmap();

  // Group heatmap by weeks
  const weeks = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  // Get mood trend data
  const getMoodTrends = () => {
    const last30Days = checkIns.slice(-30);
    
    const mentalTrend = {
      clear: last30Days.filter(c => c.mental === 'clear').length,
      foggy: last30Days.filter(c => c.mental === 'foggy').length,
      stressed: last30Days.filter(c => c.mental === 'stressed').length
    };
    
    const physicalTrend = {
      energetic: last30Days.filter(c => c.physical === 'energetic').length,
      tired: last30Days.filter(c => c.physical === 'tired').length,
      sore: last30Days.filter(c => c.physical === 'sore').length
    };
    
    const emotionalTrend = {
      happy: last30Days.filter(c => c.emotional === 'happy').length,
      anxious: last30Days.filter(c => c.emotional === 'anxious').length,
      grateful: last30Days.filter(c => c.emotional === 'grateful').length
    };
    
    return { mentalTrend, physicalTrend, emotionalTrend };
  };

  const trends = getMoodTrends();

  // Get intensity color for heatmap
  const getIntensityColor = (intensity) => {
    switch(intensity) {
      case 0: return '#1e293b';
      case 1: return '#0d3b2c';
      case 2: return '#0f5132';
      case 3: return '#0a7140';
      case 4: return '#059669';
      default: return '#1e293b';
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <TrendingUp size={28} color="#10b981" />
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          Growth Dashboard
        </h2>
      </div>

      {/* Insights Section */}
      {insights.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1rem', color: '#E2E8F0', marginBottom: '16px' }}>
            ✨ Personal Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {insights.map((insight, index) => (
              <div
                key={index}
                style={{
                  background: `rgba(${insight.color === '#10b981' ? '16, 185, 129' :
                                      insight.color === '#3b82f6' ? '59, 130, 246' :
                                      insight.color === '#a855f7' ? '168, 85, 247' :
                                      insight.color === '#f59e0b' ? '245, 158, 11' : '251, 191, 36'}, 0.1)`,
                  border: `1px solid ${insight.color}20`,
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <span style={{ fontSize: '2rem' }}>{insight.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: '#E2E8F0', margin: 0 }}>
                    {insight.title}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
                    {insight.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consistency Heatmap */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid rgba(71, 85, 105, 0.3)'
      }}>
        <h3 style={{ fontSize: '1rem', color: '#E2E8F0', marginBottom: '16px' }}>
          Consistency Heatmap
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '4px', minWidth: '800px' }}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      background: getIntensityColor(day.intensity),
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    title={`${day.date}: ${day.completed}/${day.total} tasks`}
                  >
                    {day.completed > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#1e293b',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        color: '#E2E8F0',
                        whiteSpace: 'nowrap',
                        display: 'none',
                        zIndex: 10
                      }}>
                        {day.completed}/{day.total}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#1e293b' }} />
            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>None</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#0d3b2c' }} />
            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Low</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#0a7140' }} />
            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Medium</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#059669' }} />
            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>High</span>
          </div>
        </div>
      </div>

      {/* Mood Mosaic */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid rgba(71, 85, 105, 0.3)'
      }}>
        <h3 style={{ fontSize: '1rem', color: '#E2E8F0', marginBottom: '16px' }}>
          Emotional Patterns (Last 30 Days)
        </h3>

        {/* Mental Trend */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Brain size={16} color="#3b82f6" />
            <p style={{ fontSize: '0.9rem', color: '#E2E8F0', margin: 0 }}>Mental</p>
          </div>
          <div style={{ height: '30px', display: 'flex', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{
              width: `${(trends.mentalTrend.clear / 30) * 100}%`,
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              color: 'white'
            }}>
              {trends.mentalTrend.clear > 0 && `Clear ${Math.round((trends.mentalTrend.clear / 30) * 100)}%`}
            </div>
            <div style={{
              width: `${(trends.mentalTrend.foggy / 30) * 100}%`,
              background: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              color: 'white'
            }}>
              {trends.mentalTrend.foggy > 0 && `Foggy ${Math.round((trends.mentalTrend.foggy / 30) * 100)}%`}
            </div>
            <div style={{
              width: `${(trends.mentalTrend.stressed / 30) * 100}%`,
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              color: 'white'
            }}>
              {trends.mentalTrend.stressed > 0 && `Stressed ${Math.round((trends.mentalTrend.stressed / 30) * 100)}%`}
            </div>
          </div>
        </div>

        {/* Physical Trend */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Dumbbell size={16} color="#10b981" />
            <p style={{ fontSize: '0.9rem', color: '#E2E8F0', margin: 0 }}>Physical</p>
          </div>
          <div style={{ height: '30px', display: 'flex', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{
              width: `${(trends.physicalTrend.energetic / 30) * 100}%`,
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              color: 'white'
            }}>
              {trends.physicalTrend.energetic > 0 && `Energetic ${Math.round((trends.physicalTrend.energetic / 30) * 100)}%`}
            </div>
            <div style={{
              width: `${(trends.physicalTrend.tired / 30) * 100}%`,
              background: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              color: 'white'
            }}>
              {trends.physicalTrend.tired > 0 && `Tired ${Math.round((trends.physicalTrend.tired / 30) * 100)}%`}
            </div>
            <div style={{
              width: `${(trends.physicalTrend.sore / 30) * 100}%`,
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              color: 'white'
            }}>
              {trends.physicalTrend.sore > 0 && `Sore ${Math.round((trends.physicalTrend.sore / 30) * 100)}%`}
            </div>
          </div>
        </div>

        {/* Emotional Trend */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Heart size={16} color="#a855f7" />
            <p style={{ fontSize: '0.9rem', color: '#E2E8F0', margin: 0 }}>Emotional</p>
          </div>
          <div style={{ height: '30px', display: 'flex', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{
              width: `${(trends.emotionalTrend.happy / 30) * 100}%`,
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              color: 'white'
            }}>
              {trends.emotionalTrend.happy > 0 && `Happy ${Math.round((trends.emotionalTrend.happy / 30) * 100)}%`}
            </div>
            <div style={{
              width: `${(trends.emotionalTrend.anxious / 30) * 100}%`,
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              color: 'white'
            }}>
              {trends.emotionalTrend.anxious > 0 && `Anxious ${Math.round((trends.emotionalTrend.anxious / 30) * 100)}%`}
            </div>
            <div style={{
              width: `${(trends.emotionalTrend.grateful / 30) * 100}%`,
              background: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              color: '#000'
            }}>
              {trends.emotionalTrend.grateful > 0 && `Grateful ${Math.round((trends.emotionalTrend.grateful / 30) * 100)}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Growth Tree (The "Addictive" Element) */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1rem', color: '#E2E8F0', marginBottom: '16px' }}>
          Your Growth Tree
        </h3>
        
        <div style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '16px' }}>
          {streakCount === 0 ? '🌱' :
           streakCount < 3 ? '🌿' :
           streakCount < 7 ? '🌳' :
           streakCount < 14 ? '🌲' :
           streakCount < 30 ? '🏝️' :
           '🌟'}
        </div>
        
        <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#10b981', marginBottom: '8px' }}>
          {streakCount === 0 ? 'New Seed' :
           streakCount < 3 ? 'Sprouting' :
           streakCount < 7 ? 'Growing Strong' :
           streakCount < 14 ? 'Mighty Tree' :
           streakCount < 30 ? 'Thriving' :
           'Legendary'}
        </p>
        
        <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '16px' }}>
          {streakCount} day{streakCount !== 1 ? 's' : ''} of growth
        </p>
        
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '12px',
          padding: '12px',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <p style={{ fontSize: '0.85rem', color: '#E2E8F0', margin: 0, lineHeight: '1.5' }}>
            {streakCount === 0 ? 'Plant your first seed by completing a task today.' :
             streakCount < 3 ? 'Your tree is sprouting! Keep showing up.' :
             streakCount < 7 ? 'Roots are growing deep. Consistency is building.' :
             streakCount < 14 ? 'Your tree is strong! You\'re building momentum.' :
             streakCount < 30 ? 'A thriving forest! Your habits are becoming who you are.' :
             'A legendary grove! You\'ve transformed your life.'}
          </p>
        </div>

        {/* Streak with conscience note */}
        <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '16px' }}>
          Your tree grows with every honest check-in, even on tough days. 🌱
        </p>
      </div>
    </div>
  );
};

export default GrowthDashboard;