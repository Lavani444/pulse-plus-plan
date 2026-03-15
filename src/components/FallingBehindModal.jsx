import React, { useState } from 'react';
import { 
  Heart, Clock, Coffee, RefreshCw, 
  Sparkles, BookOpen, Zap, Moon,
  X, ChevronRight, AlertCircle
} from 'lucide-react';

const FallingBehindModal = ({ onClose, onReschedule, onGetQuote, onBreakDown, onReset }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    {
      id: 'motivation',
      icon: Sparkles,
      label: 'Lack of Motivation',
      description: 'Get an inspiring quote to reignite your spark',
      color: '#fbbf24',
      action: onGetQuote
    },
    {
      id: 'time',
      icon: Clock,
      label: 'No Time',
      description: 'Reschedule tasks to a better time',
      color: '#3b82f6',
      action: onReschedule
    },
    {
      id: 'hard',
      icon: Zap,
      label: 'Task too Hard',
      description: 'Break it down into smaller steps',
      color: '#ef4444',
      action: onBreakDown
    },
    {
      id: 'reset',
      icon: RefreshCw,
      label: 'Need a Reset',
      description: 'Move unfinished tasks to tomorrow',
      color: '#10b981',
      action: onReset
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        borderRadius: '32px',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
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
              <Heart size={24} color="#10b981" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#E2E8F0', margin: 0 }}>
                It's Okay
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
                Every setback is a setup for a comeback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(71, 85, 105, 0.3)',
              border: 'none',
              borderRadius: '12px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#94A3B8'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <div style={{
          padding: '24px',
          background: 'rgba(16, 185, 129, 0.05)',
          margin: '16px 24px',
          borderRadius: '20px',
          border: '1px solid rgba(16, 185, 129, 0.1)'
        }}>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#E2E8F0',
            fontStyle: 'italic',
            margin: 0,
            textAlign: 'center'
          }}>
            "The key is to get back on track, not to be perfect. What's the biggest obstacle right now?"
          </p>
        </div>

        {/* Options */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '16px' }}>
            Choose how you'd like to proceed:
          </p>
          
          {options.map(option => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedOption(option.id);
                  setTimeout(() => {
                    option.action();
                    onClose();
                  }, 300);
                }}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: isSelected 
                    ? `rgba(${option.id === 'motivation' ? '251, 191, 36' : 
                                 option.id === 'time' ? '59, 130, 246' :
                                 option.id === 'hard' ? '239, 68, 68' : '16, 185, 129'}, 0.15)`
                    : 'rgba(30, 41, 59, 0.6)',
                  border: isSelected 
                    ? `2px solid ${option.color}`
                    : '1px solid rgba(71, 85, 105, 0.3)',
                  borderRadius: '16px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: `rgba(${option.id === 'motivation' ? '251, 191, 36' : 
                                      option.id === 'time' ? '59, 130, 246' :
                                      option.id === 'hard' ? '239, 68, 68' : '16, 185, 129'}, 0.1)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} color={option.color} />
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: '#E2E8F0', margin: 0 }}>
                    {option.label}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
                    {option.description}
                  </p>
                </div>
                <ChevronRight size={20} color="#64748B" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(71, 85, 105, 0.3)',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <p style={{ fontSize: '0.8rem', color: '#64748B', textAlign: 'center', margin: 0 }}>
            Your honesty is your strength. Every challenge is growth in disguise.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FallingBehindModal;