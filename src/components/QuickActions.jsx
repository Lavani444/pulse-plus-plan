import React, { useState } from 'react';
import { Calendar, RefreshCw, Target, Heart } from 'lucide-react';
import FallingBehindModal from './FallingBehindModal';
import { getRandomQuote } from '../services/quoteService';

const QuickActions = ({ onAction }) => {
  const [showFallingBehind, setShowFallingBehind] = useState(false);
  const [quote, setQuote] = useState(null);

  const actions = [
    {
      id: 'planDay',
      label: 'Plan my day',
      icon: Calendar,
      primary: true
    },
    {
      id: 'weeklyReset',
      label: 'Weekly reset',
      icon: RefreshCw,
      primary: false
    },
    {
      id: 'reviewGoals',
      label: 'Review goals',
      icon: Target,
      primary: false
    },
    {
      id: 'fallingBehind',
      label: "I'm falling behind",
      icon: Heart,
      primary: false,
      action: () => setShowFallingBehind(true)
    }
  ];

  const handleGetQuote = () => {
    const newQuote = getRandomQuote('deep');
    setQuote(newQuote);
    // Show quote in notification or modal
    onAction('showQuote', newQuote);
  };

  const handleReschedule = () => {
    onAction('reschedule');
  };

  const handleBreakDown = () => {
    onAction('breakDown');
  };

  const handleReset = () => {
    onAction('weeklyReset');
  };

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        {/* Primary action */}
        <button
          onClick={() => onAction('planDay')}
          className="quick-action primary"
          style={{
            width: '100%',
            padding: '16px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '16px',
            marginBottom: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Calendar size={20} color="#10b981" />
          <span style={{ color: '#10b981', fontWeight: '600', fontSize: '1rem' }}>
            Plan my day
          </span>
        </button>

        {/* Secondary actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px'
        }}>
          {actions.slice(1).map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action || (() => onAction(action.id))}
                className="quick-action"
                style={{
                  padding: '12px',
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid rgba(71, 85, 105, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Icon size={18} color="#94A3B8" />
                <span style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center' }}>
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Falling Behind Modal */}
      {showFallingBehind && (
        <FallingBehindModal
          onClose={() => setShowFallingBehind(false)}
          onGetQuote={handleGetQuote}
          onReschedule={handleReschedule}
          onBreakDown={handleBreakDown}
          onReset={handleReset}
        />
      )}

      {/* Quote Display */}
      {quote && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          zIndex: 10001,
          animation: 'slideUp 0.3s ease'
        }}>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#E2E8F0', fontStyle: 'italic', marginBottom: '8px' }}>
            "{quote.text}"
          </p>
          <p style={{ fontSize: '0.9rem', color: '#10b981', textAlign: 'right' }}>
            — {quote.author}
          </p>
          <button
            onClick={() => setQuote(null)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(71, 85, 105, 0.3)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              color: '#94A3B8'
            }}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default QuickActions;