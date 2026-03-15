import React, { useState } from 'react';
import { Brain, Target, Sparkles, ChevronRight } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');

  const steps = [
    {
      title: 'Your AI-powered life planner',
      subtitle: 'Set goals, track progress, and stay consistent.',
      icon: Sparkles
    },
    {
      title: 'Adaptive intelligence',
      subtitle: 'The system learns your patterns and adjusts your plan.',
      icon: Brain
    },
    {
      title: 'Create your first goal',
      subtitle: 'What would you like to achieve?',
      icon: Target
    }
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(goal ? { title: goal, type: 'personal' } : null);
    }
  };

  const CurrentIcon = steps[step - 1].icon;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B1120 0%, #0F172A 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Progress dots */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '48px'
        }}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                width: i === step ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === step ? '#10b981' : 'rgba(71, 85, 105, 0.5)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '24px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px'
        }}>
          <CurrentIcon size={40} color="#10b981" />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#E2E8F0',
          margin: '0 0 16px 0',
          lineHeight: '1.2'
        }}>
          {steps[step - 1].title}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.1rem',
          color: '#94A3B8',
          margin: '0 0 32px 0',
          lineHeight: '1.5'
        }}>
          {steps[step - 1].subtitle}
        </p>

        {/* Goal input (step 3 only) */}
        {step === 3 && (
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Learn to meditate, Save $5000..."
            style={{
              width: '100%',
              padding: '16px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '16px',
              color: '#E2E8F0',
              fontSize: '1rem',
              marginBottom: '24px',
              outline: 'none'
            }}
            autoFocus
          />
        )}

        {/* CTA Button */}
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            borderRadius: '16px',
            color: '#fff',
            fontWeight: '600',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {step === 3 ? 'Start your journey' : 'Continue'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;