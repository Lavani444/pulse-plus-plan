import React, { useState } from 'react';
import { BookOpen, Calendar, Filter, Brain, Dumbbell, Heart, Check, Flame, Award, TrendingUp } from 'lucide-react';

const Logbook = ({ tasks, goals, streakCount }) => {
  const [filterType, setFilterType] = useState('all'); // all, tasks, goals
  const [filterCategory, setFilterCategory] = useState('all'); // all, mind, body, soul
  const [dateRange, setDateRange] = useState('all'); // all, week, month, year

  const completedTasks = tasks.filter(t => t.completed);
  const completedGoals = goals.filter(g => g.progress === 100);

  const getFilteredTasks = () => {
    let filtered = completedTasks;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    if (dateRange !== 'all') {
      const now = new Date();
      const ranges = {
        week: 7,
        month: 30,
        year: 365
      };
      const daysAgo = ranges[dateRange];
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      
      filtered = filtered.filter(t => {
        const completedDate = new Date(t.completedAt);
        return completedDate >= cutoffDate;
      });
    }

    return filtered.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  };

  const getFilteredGoals = () => {
    let filtered = completedGoals;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(g => g.category === filterCategory);
    }

    return filtered.sort((a, b) => new Date(b.lastUpdated || b.createdAt) - new Date(a.lastUpdated || a.createdAt));
  };

  const getStats = () => {
    const mindTasks = completedTasks.filter(t => t.category === 'mind').length;
    const bodyTasks = completedTasks.filter(t => t.category === 'body').length;
    const soulTasks = completedTasks.filter(t => t.category === 'soul').length;
    
    return {
      totalTasks: completedTasks.length,
      totalGoals: completedGoals.length,
      mindTasks,
      bodyTasks,
      soulTasks,
      balancedDays: Math.floor(Math.min(mindTasks, bodyTasks, soulTasks))
    };
  };

  const stats = getStats();
  const filteredTasks = getFilteredTasks();
  const filteredGoals = getFilteredGoals();

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'mind': return <Brain size={18} />;
      case 'body': return <Dumbbell size={18} />;
      case 'soul': return <Heart size={18} />;
      default: return null;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'mind': return '#3b82f6';
      case 'body': return '#10b981';
      case 'soul': return '#a855f7';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-in-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <BookOpen size={36} style={{ color: '#fbbf24' }} />
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #fbbf24, #facc15)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Logbook
        </h2>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <Flame size={36} style={{ color: '#f59e0b', margin: '0 auto 12px' }} />
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '4px' }}>
            {streakCount}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Day Streak</p>
        </div>

        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <Check size={36} style={{ color: '#3b82f6', margin: '0 auto 12px' }} />
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
            {stats.totalTasks}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Completed Tasks</p>
        </div>

        <div style={{
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <Award size={36} style={{ color: '#a855f7', margin: '0 auto 12px' }} />
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a855f7', marginBottom: '4px' }}>
            {stats.totalGoals}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Achieved Goals</p>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <TrendingUp size={36} style={{ color: '#10b981', margin: '0 auto 12px' }} />
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
            {stats.balancedDays}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Balanced Days</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '32px',
        border: '1px solid rgba(71, 85, 105, 0.3)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '20px' }}>
          Category Breakdown
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <Brain size={32} style={{ color: '#3b82f6', margin: '0 auto 12px' }} />
            <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
              {stats.mindTasks}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Mind Tasks</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Dumbbell size={32} style={{ color: '#10b981', margin: '0 auto 12px' }} />
            <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
              {stats.bodyTasks}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Body Tasks</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Heart size={32} style={{ color: '#a855f7', margin: '0 auto 12px' }} />
            <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#a855f7', marginBottom: '4px' }}>
              {stats.soulTasks}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Soul Tasks</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Filter size={20} style={{ color: '#94a3b8', marginTop: '10px' }} />
          {['all', 'tasks', 'goals'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '10px 20px',
                background: filterType === type ? 'linear-gradient(to right, #fbbf24, #facc15)' : 'rgba(30, 41, 59, 0.6)',
                color: filterType === type ? '#000' : '#94a3b8',
                border: filterType === type ? 'none' : '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease'
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'mind', 'body', 'soul'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '10px 16px',
                background: filterCategory === cat ? 'rgba(71, 85, 105, 0.5)' : 'rgba(30, 41, 59, 0.6)',
                color: filterCategory === cat ? '#e2e8f0' : '#94a3b8',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s ease'
              }}
            >
              {cat !== 'all' && getCategoryIcon(cat)}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'week', 'month', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              style={{
                padding: '10px 16px',
                background: dateRange === range ? 'rgba(71, 85, 105, 0.5)' : 'rgba(30, 41, 59, 0.6)',
                color: dateRange === range ? '#e2e8f0' : '#94a3b8',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease'
              }}
            >
              {range === 'all' ? 'All Time' : `Last ${range.charAt(0).toUpperCase() + range.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {(filterType === 'all' || filterType === 'tasks') && filteredTasks.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '16px' }}>
            Completed Tasks
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTasks.map(task => {
              const color = getCategoryColor(task.category);
              return (
                <div
                  key={task.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    border: '1px solid rgba(71, 85, 105, 0.3)',
                    borderLeft: `4px solid ${color}`
                  }}
                >
                  <Check size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>
                      {task.title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {getCategoryIcon(task.category)}
                        {task.category}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {new Date(task.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(filterType === 'all' || filterType === 'goals') && filteredGoals.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '16px' }}>
            Achieved Goals
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {filteredGoals.map(goal => {
              const color = getCategoryColor(goal.category);
              return (
                <div
                  key={goal.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(71, 85, 105, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Award size={24} style={{ color }} />
                    <h4 style={{ color: '#e2e8f0', fontSize: '1.125rem', fontWeight: '700', flex: 1 }}>
                      {goal.title}
                    </h4>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '8px' }}>
                    {goal.target}
                  </p>
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    background: `rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.2)`,
                    border: `1px solid ${color}`,
                    borderRadius: '8px',
                    color,
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {goal.type}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredTasks.length === 0 && filteredGoals.length === 0 && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '48px',
          textAlign: 'center',
          border: '1px solid rgba(71, 85, 105, 0.3)'
        }}>
          <BookOpen size={64} style={{ color: '#64748b', margin: '0 auto 16px' }} />
          <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
            No completed items found. Start completing tasks and goals to build your history!
          </p>
        </div>
      )}
    </div>
  );
};

export default Logbook;
