import React, { useState } from 'react';
import { Brain, Dumbbell, Heart, Sparkles, X } from 'lucide-react';

const EmotionalCheckIn = ({ task, onComplete, onClose }) => {
  const [mental, setMental] = useState(null);
  const [physical, setPhysical] = useState(null);
  const [emotional, setEmotional] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mentalOptions = [
    { value: 'clear', emoji: '🧠', label: 'Clear', color: '#10b981' },
    { value: 'foggy', emoji: '🌫️', label: 'Foggy', color: '#64748b' },
    { value: 'stressed', emoji: '😰', label: 'Stressed', color: '#ef4444' }
  ];

  const physicalOptions = [
    { value: 'energetic', emoji: '⚡', label: 'Energetic', color: '#10b981' },
    { value: 'tired', emoji: '😴', label: 'Tired', color: '#64748b' },
    { value: 'sore', emoji: '🤕', label: 'Sore', color: '#ef4444' }
  ];

  const emotionalOptions = [
    { value: 'happy', emoji: '😊', label: 'Happy', color: '#10b981' },
    { value: 'anxious', emoji: '😟', label: 'Anxious', color: '#ef4444' },
    { value: 'grateful', emoji: '🙏', label: 'Grateful', color: '#fbbf24' }
  ];

  const handleSubmit = () => {
    if (!mental || !physical || !emotional) return;
    
    setIsSubmitting(true);
    
    const checkInData = {
      taskId: task.id,
      taskTitle: task.title,
      timestamp: new Date().toISOString(),
      mental,
      physical,
      emotional,
      category: task.category
    };
    
    // Save to localStorage
    const existingCheckIns = JSON.parse(localStorage.getItem('emotionalCheckIns') || '[]');
    existingCheckIns.push(checkInData);
    localStorage.setItem('emotionalCheckIns', JSON.stringify(existingCheckIns));
    
    setTimeout(() => {
      onComplete(checkInData);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      left: '20px',
      maxWidth: '400px',
      margin: '0 auto',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      padding: '20px',
      zIndex: 10000,
      animation: 'slideUp 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#10b981" />
          <h3 style={{ fontSize: '1rem', color: '#E2E8F0', margin: 0 }}>
            How did that make you feel?
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(71, 85, 105, 0.3)',
            border: 'none',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#94A3B8'
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Task info */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.05)',
        borderRadius: '12px',
        padding: '12px',
        marginBottom: '20px',
        border: '1px solid rgba(16, 185, 129, 0.1)'
      }}>
        <p style={{ fontSize: '0.9rem', color: '#E2E8F0', margin: 0 }}>
          Completed: <span style={{ color: '#10b981', fontWeight: '600' }}>{task.title}</span>
        </p>
      </div>

      {/* Mental */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Brain size={16} color="#10b981" />
          <p style={{ fontSize: '0.9rem', color: '#E2E8F0', margin: 0 }}>Mental State</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {mentalOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setMental(option.value)}
              style={{
                flex: 1,
                padding: '12px 8px',
                background: mental === option.value 
                  ? `rgba(${option.value === 'clear' ? '16, 185, 129' : 
                              option.value === 'foggy' ? '100, 116, 139' : '239, 68, 68'}, 0.2)`
                  : 'rgba(30, 41, 59, 0.6)',
                border: mental === option.value 
                  ? `2px solid ${option.color}`
                  : '1px solid rgba(71, 85, 105, 0.3)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{option.emoji}</span>
              <span style={{ 
                fontSize: '0.75rem',
                color: mental === option.value ? option.color : '#94A3B8',
                fontWeight: mental === option.value ? '600' : '400'
              }}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Physical */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Dumbbell size={16} color="#10b981" />
          <p style={{ fontSize: '0.9rem', color: '#E2E8F0', margin: 0 }}>Physical State</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {physicalOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setPhysical(option.value)}
              style={{
                flex: 1,
                padding: '12px 8px',
                background: physical === option.value 
                  ? `rgba(${option.value === 'energetic' ? '16, 185, 129' : 
                              option.value === 'tired' ? '100, 116, 139' : '239, 68, 68'}, 0.2)`
                  : 'rgba(30, 41, 59, 0.6)',
                border: physical === option.value 
                  ? `2px solid ${option.color}`
                  : '1px solid rgba(71, 85, 105, 0.3)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{option.emoji}</span>
              <span style={{ 
                fontSize: '0.75rem',
                color: physical === option.value ? option.color : '#94A3B8',
                fontWeight: physical === option.value ? '600' : '400'
              }}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Emotional */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Heart size={16} color="#10b981" />
          <p style={{ fontSize: '0.9rem', color: '#E2E8F0', margin: 0 }}>Emotional State</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {emotionalOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setEmotional(option.value)}
              style={{
                flex: 1,
                padding: '12px 8px',
                background: emotional === option.value 
                  ? `rgba(${option.value === 'happy' ? '16, 185, 129' : 
                              option.value === 'anxious' ? '239, 68, 68' : '251, 191, 36'}, 0.2)`
                  : 'rgba(30, 41, 59, 0.6)',
                border: emotional === option.value 
                  ? `2px solid ${option.color}`
                  : '1px solid rgba(71, 85, 105, 0.3)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{option.emoji}</span>
              <span style={{ 
                fontSize: '0.75rem',
                color: emotional === option.value ? option.color : '#94A3B8',
                fontWeight: emotional === option.value ? '600' : '400'
              }}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!mental || !physical || !emotional || isSubmitting}
        style={{
          width: '100%',
          padding: '14px',
          background: (!mental || !physical || !emotional) 
            ? 'rgba(16, 185, 129, 0.3)'
            : 'linear-gradient(135deg, #10b981, #059669)',
          border: 'none',
          borderRadius: '16px',
          color: 'white',
          fontWeight: '600',
          fontSize: '1rem',
          cursor: (!mental || !physical || !emotional) ? 'not-allowed' : 'pointer',
          opacity: (!mental || !physical || !emotional) ? 0.5 : 1
        }}
      >
        {isSubmitting ? 'Saving...' : 'Save Reflection'}
      </button>
    </div>
  );
};

export default EmotionalCheckIn;