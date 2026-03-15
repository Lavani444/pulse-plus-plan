import React, { useState } from 'react';
import { Plus, X, Target, TrendingUp, Calendar, DollarSign, Dumbbell, Brain, Heart, Trophy } from 'lucide-react';

const GoalsView = ({ 
  goals, 
  addGoal, 
  updateGoalProgress,
  showAddGoal,
  setShowAddGoal 
}) => {
  const [newGoal, setNewGoal] = useState({ 
    title: '', 
    type: 'physical',
    category: 'body',
    target: '',
    timeline: '',
    description: ''
  });

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.target) {
      addGoal(newGoal);
      setNewGoal({ 
        title: '', 
        type: 'physical',
        category: 'body',
        target: '',
        timeline: '',
        description: ''
      });
    }
  };

  const goalTypes = [
    { value: 'financial', label: 'Financial', icon: DollarSign, category: 'mind', color: '#f59e0b' },
    { value: 'physical', label: 'Physical', icon: Dumbbell, category: 'body', color: '#10b981' },
    { value: 'mental', label: 'Mental', icon: Brain, category: 'mind', color: '#3b82f6' },
    { value: 'emotional', label: 'Emotional', icon: Heart, category: 'soul', color: '#a855f7' },
    { value: 'skill', label: 'Skill', icon: Trophy, category: 'mind', color: '#06b6d4' },
    { value: 'hobby', label: 'Hobby', icon: Target, category: 'soul', color: '#ec4899' }
  ];

  const getGoalColor = (type) => {
    const goal = goalTypes.find(g => g.value === type);
    return goal ? goal.color : '#94a3b8';
  };

  const getGoalIcon = (type) => {
    const goal = goalTypes.find(g => g.value === type);
    if (!goal) return <Target size={24} />;
    const Icon = goal.icon;
    return <Icon size={24} />;
  };

  const getAIAdvice = (type) => {
    const advice = {
      financial: "Break down your savings goal into monthly targets. Automate your savings to stay consistent.",
      physical: "Start with small, achievable milestones. Consistency beats intensity every time.",
      mental: "Dedicate 20-30 minutes daily. The compound effect of daily learning is powerful.",
      emotional: "Track your mood daily. Small improvements in emotional awareness create big changes.",
      skill: "Practice deliberately for 1 hour daily. Master fundamentals before advanced techniques.",
      hobby: "Schedule dedicated time weekly. Hobbies need commitment just like any other goal."
    };
    return advice[type] || "Stay consistent and track your progress regularly.";
  };

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-in-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #a855f7, #ec4899)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Goals
        </h2>
        <button
          onClick={() => setShowAddGoal(true)}
          className="luxury-button"
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(to right, #a855f7, #ec4899)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(168, 85, 247, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(168, 85, 247, 0.3)';
          }}
        >
          <Plus size={20} /> Create Goal
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddGoal && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '32px',
          border: '2px solid rgba(168, 85, 247, 0.5)',
          boxShadow: '0 0 40px rgba(168, 85, 247, 0.2)',
          marginBottom: '32px',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#a855f7', marginBottom: '24px' }}>
            Create New Goal
          </h3>

          <input
            type="text"
            placeholder="Goal title (e.g., Lose 10kg, Save $5000, Learn Spanish)"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            style={{
              width: '100%',
              padding: '16px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '12px',
              color: '#cbd5e1',
              marginBottom: '16px',
              fontSize: '1rem'
            }}
          />

          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '12px', fontWeight: '600' }}>
              Goal Type
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {goalTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setNewGoal({ ...newGoal, type: type.value, category: type.category })}
                    style={{
                      padding: '16px',
                      background: newGoal.type === type.value 
                        ? `rgba(${parseInt(type.color.slice(1,3), 16)}, ${parseInt(type.color.slice(3,5), 16)}, ${parseInt(type.color.slice(5,7), 16)}, 0.2)`
                        : 'rgba(30, 41, 59, 0.6)',
                      border: newGoal.type === type.value 
                        ? `2px solid ${type.color}`
                        : '1px solid rgba(71, 85, 105, 0.3)',
                      borderRadius: '12px',
                      color: newGoal.type === type.value ? type.color : '#94a3b8',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Icon size={24} />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            placeholder="Target outcome (e.g., Reach 75kg by summer, Save for vacation)"
            value={newGoal.target}
            onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
            style={{
              width: '100%',
              padding: '16px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '12px',
              color: '#cbd5e1',
              marginBottom: '16px',
              fontSize: '1rem',
              minHeight: '80px',
              resize: 'vertical'
            }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Timeline (e.g., 3 months, 1 year)"
              value={newGoal.timeline}
              onChange={(e) => setNewGoal({ ...newGoal, timeline: e.target.value })}
              style={{
                padding: '14px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '12px',
                color: '#cbd5e1',
                fontSize: '1rem'
              }}
            />

            <input
              type="date"
              placeholder="Target Date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
              style={{
                padding: '14px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '12px',
                color: '#cbd5e1',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* AI Advice */}
          <div style={{
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
              <Brain size={20} style={{ color: '#a855f7', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ color: '#a855f7', fontSize: '0.875rem', fontWeight: '600', marginBottom: '4px' }}>
                  AI Advice
                </p>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {getAIAdvice(newGoal.type)}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleAddGoal}
              style={{
                flex: 1,
                padding: '16px',
                background: 'linear-gradient(to right, #a855f7, #ec4899)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Create Goal
            </button>
            <button
              onClick={() => setShowAddGoal(false)}
              style={{
                flex: 1,
                padding: '16px',
                background: 'rgba(30, 41, 59, 0.8)',
                color: '#cbd5e1',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '64px 32px',
          textAlign: 'center',
          border: '1px solid rgba(71, 85, 105, 0.3)'
        }}>
          <Target size={64} style={{ color: '#64748b', margin: '0 auto 24px' }} />
          <h3 style={{ color: '#e2e8f0', fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px' }}>
            No Goals Yet
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem', marginBottom: '24px' }}>
            Set your first goal and start your journey to success!
          </p>
          <button
            onClick={() => setShowAddGoal(true)}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(to right, #a855f7, #ec4899)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={20} /> Create Your First Goal
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
          {goals.map(goal => {
            const color = getGoalColor(goal.type);
            return (
              <div
                key={goal.id}
                className="goal-card"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(71, 85, 105, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.4s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 20px 40px rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontWeight: 'bold', 
                      fontSize: '1.5rem', 
                      color: '#e2e8f0', 
                      marginBottom: '8px',
                      lineHeight: '1.3'
                    }}>
                      {goal.title}
                    </h3>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.5' }}>
                      {goal.target}
                    </p>
                  </div>
                  <div style={{
                    padding: '12px',
                    background: `rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.2)`,
                    borderRadius: '12px',
                    border: `1px solid ${color}`,
                    marginLeft: '16px'
                  }}>
                    {getGoalIcon(goal.type)}
                  </div>
                </div>

                {goal.timeline && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <Calendar size={16} style={{ color: '#64748b' }} />
                    <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      Timeline: {goal.timeline}
                    </span>
                  </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>Progress</span>
                    <span style={{ 
                      color: color, 
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}>
                      {goal.progress}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    borderRadius: '9999px',
                    height: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(71, 85, 105, 0.3)',
                    position: 'relative'
                  }}>
                    <div 
                      className="progress-bar"
                      style={{
                        height: '100%',
                        borderRadius: '9999px',
                        width: `${goal.progress}%`,
                        background: `linear-gradient(to right, ${color}, ${color}dd)`,
                        transition: 'width 0.8s ease',
                        boxShadow: `0 0 10px ${color}`
                      }} 
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    cursor: 'pointer',
                    accentColor: color,
                    marginTop: '8px'
                  }}
                />

                {goal.progress === 100 && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Trophy size={20} style={{ color: '#10b981' }} />
                    <span style={{ color: '#10b981', fontWeight: '600' }}>Goal Completed! 🎉</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalsView;