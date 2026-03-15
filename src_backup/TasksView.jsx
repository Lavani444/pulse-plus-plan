import React, { useState } from 'react';
import { Plus, X, Brain, Dumbbell, Heart, Clock, Calendar, Zap } from 'lucide-react';

const TasksView = ({ 
  tasks, 
  selectedDate, 
  setSelectedDate, 
  addTask, 
  toggleTask, 
  deleteTask,
  showAddTask,
  setShowAddTask 
}) => {
  const [newTask, setNewTask] = useState({ 
    title: '', 
    category: 'mind', 
    date: selectedDate,
    timeframe: '',
    notes: ''
  });

  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleAddTask = () => {
    if (newTask.title) {
      addTask(newTask);
      setNewTask({ 
        title: '', 
        category: 'mind', 
        date: selectedDate,
        timeframe: '',
        notes: ''
      });
    }
  };

  const getSmartSuggestion = (category) => {
    const suggestions = {
      mind: "💡 Creative tasks work better in the morning (8-11 AM)",
      body: "💪 Fitness activities are best scheduled in the late afternoon (4-7 PM)",
      soul: "✨ Creative hobbies are perfect for weekend mornings"
    };
    return suggestions[category];
  };

  const filteredTasks = selectedCategory === 'all' 
    ? tasks.filter(t => t.date === selectedDate)
    : tasks.filter(t => t.date === selectedDate && t.category === selectedCategory);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'mind': return <Brain size={20} />;
      case 'body': return <Dumbbell size={20} />;
      case 'soul': return <Heart size={20} />;
      default: return null;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'mind': return {
        bg: 'rgba(59, 130, 246, 0.2)',
        text: '#3b82f6',
        border: 'rgba(59, 130, 246, 0.3)'
      };
      case 'body': return {
        bg: 'rgba(16, 185, 129, 0.2)',
        text: '#10b981',
        border: 'rgba(16, 185, 129, 0.3)'
      };
      case 'soul': return {
        bg: 'rgba(168, 85, 247, 0.2)',
        text: '#a855f7',
        border: 'rgba(168, 85, 247, 0.3)'
      };
      default: return {
        bg: 'rgba(100, 116, 139, 0.2)',
        text: '#94a3b8',
        border: 'rgba(100, 116, 139, 0.3)'
      };
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-in-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #fbbf24, #facc15)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Tasks & Schedule
        </h2>
        <button
          onClick={() => setShowAddTask(true)}
          className="luxury-button"
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(to right, #fbbf24, #facc15)',
            color: '#000',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(251, 191, 36, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(251, 191, 36, 0.3)';
          }}
        >
          <Plus size={20} /> Add Task
        </button>
      </div>

      {/* Date & Filter */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Calendar size={20} style={{ 
            position: 'absolute', 
            left: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#64748b' 
          }} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '14px 14px 14px 48px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '12px',
              color: '#cbd5e1',
              fontSize: '1rem',
              backdropFilter: 'blur(20px)',
              cursor: 'pointer'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'mind', 'body', 'soul'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '12px 20px',
                background: selectedCategory === cat 
                  ? (cat === 'all' ? 'linear-gradient(to right, #fbbf24, #facc15)' : getCategoryColor(cat).bg)
                  : 'rgba(30, 41, 59, 0.6)',
                color: selectedCategory === cat 
                  ? (cat === 'all' ? '#000' : getCategoryColor(cat).text)
                  : '#94a3b8',
                border: selectedCategory === cat 
                  ? `1px solid ${cat === 'all' ? '#fbbf24' : getCategoryColor(cat).border}`
                  : '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              {cat !== 'all' && getCategoryIcon(cat)}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '32px',
          border: '2px solid rgba(251, 191, 36, 0.5)',
          boxShadow: '0 0 40px rgba(251, 191, 36, 0.2)',
          marginBottom: '24px',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#fbbf24', marginBottom: '24px' }}>
            New Task
          </h3>

          <input
            type="text"
            placeholder="Task title (e.g., Morning workout, Study React, Read a book)"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            {['mind', 'body', 'soul'].map(cat => {
              const colors = getCategoryColor(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setNewTask({ ...newTask, category: cat })}
                  style={{
                    padding: '16px',
                    background: newTask.category === cat ? colors.bg : 'rgba(30, 41, 59, 0.6)',
                    border: `2px solid ${newTask.category === cat ? colors.border : 'rgba(71, 85, 105, 0.3)'}`,
                    borderRadius: '12px',
                    color: newTask.category === cat ? colors.text : '#94a3b8',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {getCategoryIcon(cat)}
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input
              type="date"
              value={newTask.date}
              onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
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
              type="text"
              placeholder="Timeframe (e.g., 30 min, 2 hours)"
              value={newTask.timeframe}
              onChange={(e) => setNewTask({ ...newTask, timeframe: e.target.value })}
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

          <textarea
            placeholder="Notes (optional)"
            value={newTask.notes}
            onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
            style={{
              width: '100%',
              padding: '14px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '12px',
              color: '#cbd5e1',
              fontSize: '1rem',
              marginBottom: '16px',
              minHeight: '80px',
              resize: 'vertical'
            }}
          />

          {/* Smart Suggestion */}
          <div style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Zap size={20} style={{ color: '#fbbf24' }} />
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              {getSmartSuggestion(newTask.category)}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleAddTask}
              style={{
                flex: 1,
                padding: '16px',
                background: 'linear-gradient(to right, #fbbf24, #facc15)',
                color: '#000',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Add Task
            </button>
            <button
              onClick={() => setShowAddTask(false)}
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

      {/* Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredTasks.length === 0 ? (
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            border: '1px solid rgba(71, 85, 105, 0.3)'
          }}>
            <Calendar size={64} style={{ color: '#64748b', margin: '0 auto 16px' }} />
            <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
              No tasks for this date. Add one to get started!
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const colors = getCategoryColor(task.category);
            return (
              <div
                key={task.id}
                className="task-item"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  border: '1px solid rgba(71, 85, 105, 0.3)',
                  borderLeft: `4px solid ${colors.border}`
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    cursor: 'pointer',
                    accentColor: colors.text
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: task.completed ? '#64748b' : '#e2e8f0',
                      textDecoration: task.completed ? 'line-through' : 'none'
                    }}>
                      {task.title}
                    </span>
                  </div>
                  
                  {task.timeframe && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <Clock size={14} style={{ color: '#64748b' }} />
                      <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {task.timeframe}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{
                  padding: '8px 16px',
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {getCategoryIcon(task.category)}
                  {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <X size={20} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TasksView;