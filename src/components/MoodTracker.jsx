import React from 'react';
import { Moon, Sun, Cloud, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MoodTracker = ({ todayMood, onLogMood, moodHistory }) => {
  const moods = [
    { value: 'low', icon: Moon, label: 'Low', color: '#64748B' },
    { value: 'neutral', icon: Cloud, label: 'Neutral', color: '#94A3B8' },
    { value: 'high', icon: Sun, label: 'High', color: '#10b981' }
  ];

  // Calculate trend
  const getTrend = () => {
    if (moodHistory.length < 3) return null;
    
    const recent = moodHistory.slice(-3);
    const values = recent.map(m => {
      if (m.mood === 'low') return 0;
      if (m.mood === 'neutral') return 1;
      return 2;
    });
    
    const trend = values[2] - values[0];
    if (trend > 0.5) return { icon: TrendingUp, color: '#10b981', text: 'Improving' };
    if (trend < -0.5) return { icon: TrendingDown, color: '#ef4444', text: 'Declining' };
    return { icon: Minus, color: '#94A3B8', text: 'Stable' };
  };

  const trend = getTrend();
  const TrendIcon = trend?.icon;

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      borderRadius: '24px',
      padding: '20px',
      marginBottom: '24px',
      border: '1px solid rgba(71, 85, 105, 0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', color: '#E2E8F0', margin: 0 }}>
          How are you feeling?
        </h3>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendIcon size={14} color={trend.color} />
            <span style={{ fontSize: '0.8rem', color: trend.color }}>{trend.text}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {moods.map(mood => {
          const Icon = mood.icon;
          const isSelected = todayMood === mood.value;
          
          return (
            <button
              key={mood.value}
              onClick={() => onLogMood(mood.value)}
              style={{
                flex: 1,
                padding: '12px',
                background: isSelected 
                  ? `rgba(${mood.value === 'high' ? '16, 185, 129' : '71, 85, 105'}, 0.2)`
                  : 'rgba(30, 41, 59, 0.4)',
                border: isSelected 
                  ? `2px solid ${mood.value === 'high' ? '#10b981' : '#64748B'}`
                  : '1px solid rgba(71, 85, 105, 0.3)',
                borderRadius: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Icon size={24} color={isSelected ? mood.color : '#64748B'} />
              <span style={{
                fontSize: '0.8rem',
                color: isSelected ? mood.color : '#94A3B8'
              }}>
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mood history visualization */}
      {moodHistory.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '4px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(71, 85, 105, 0.3)'
        }}>
          {moodHistory.slice(-7).map((entry, index) => {
            const getHeight = () => {
              if (entry.mood === 'low') return '4px';
              if (entry.mood === 'neutral') return '8px';
              return '12px';
            };
            
            return (
              <div key={index} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: '100%',
                  height: getHeight(),
                  background: entry.mood === 'high' ? '#10b981' : 
                             entry.mood === 'neutral' ? '#64748B' : '#475569',
                  borderRadius: '2px'
                }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MoodTracker;