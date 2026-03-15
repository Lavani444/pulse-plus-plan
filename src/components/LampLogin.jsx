import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Heart, Dumbbell, Sparkles, 
  Music, Palette, Book, TreePine, 
  Camera, Gamepad, Utensils, Leaf,
  Bike, Trophy, Sunrise, Moon,
  ArrowRight, Check, AlertCircle
} from 'lucide-react';

const LampLogin = ({ onLogin, onRegister }) => {
  const [isOn, setIsOn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1); // 1: credentials, 2: interests
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [interests, setInterests] = useState({
    mind: [],
    body: [],
    soul: []
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const audioRef = useRef(null);
  const lampRef = useRef(null);

  // Interest options with icons
  const interestOptions = {
    mind: [
      { id: 'reading', label: 'Reading Books', icon: Book, color: '#3b82f6' },
      { id: 'coding', label: 'Coding', icon: Brain, color: '#3b82f6' },
      { id: 'meditation', label: 'Meditation', icon: Sunrise, color: '#3b82f6' },
      { id: 'learning', label: 'Learning Languages', icon: Book, color: '#3b82f6' },
      { id: 'puzzles', label: 'Puzzles & Games', icon: Gamepad, color: '#3b82f6' },
      { id: 'writing', label: 'Journaling', icon: Book, color: '#3b82f6' },
      { id: 'strategy', label: 'Strategy Games', icon: Brain, color: '#3b82f6' },
      { id: 'photography', label: 'Photography', icon: Camera, color: '#3b82f6' }
    ],
    body: [
      { id: 'running', label: 'Running', icon: Dumbbell, color: '#10b981' },
      { id: 'cycling', label: 'Cycling', icon: Bike, color: '#10b981' },
      { id: 'hiking', label: 'Hiking', icon: TreePine, color: '#10b981' },
      { id: 'yoga', label: 'Yoga', icon: Sunrise, color: '#10b981' },
      { id: 'swimming', label: 'Swimming', icon: Dumbbell, color: '#10b981' },
      { id: 'weightlifting', label: 'Weightlifting', icon: Dumbbell, color: '#10b981' },
      { id: 'climbing', label: 'Mountain Climbing', icon: TreePine, color: '#10b981' },
      { id: 'dancing', label: 'Dancing', icon: Music, color: '#10b981' }
    ],
    soul: [
      { id: 'guitar', label: 'Play Guitar', icon: Music, color: '#a855f7' },
      { id: 'piano', label: 'Play Piano', icon: Music, color: '#a855f7' },
      { id: 'gardening', label: 'Gardening', icon: Leaf, color: '#a855f7' },
      { id: 'painting', label: 'Painting', icon: Palette, color: '#a855f7' },
      { id: 'cooking', label: 'Cooking', icon: Utensils, color: '#a855f7' },
      { id: 'singing', label: 'Singing', icon: Music, color: '#a855f7' },
      { id: 'poetry', label: 'Poetry', icon: Book, color: '#a855f7' },
      { id: 'volunteering', label: 'Volunteering', icon: Heart, color: '#a855f7' }
    ]
  };

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/click.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Lamp toggle animation
  const toggleLamp = () => {
    const newState = !isOn;
    setIsOn(newState);
    
    // Play click sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }

    // Animate lamp
    if (lampRef.current) {
      lampRef.current.style.transform = newState ? 'scale(1.05)' : 'scale(1)';
    }

    // Show login form after lamp turns on
    setTimeout(() => {
      setShowLogin(newState);
    }, 300);
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    setPasswordStrength(strength);
    return strength;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password is too weak';
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate interests
  const validateInterests = () => {
    const totalSelected = interests.mind.length + interests.body.length + interests.soul.length;
    if (totalSelected < 3) {
      setErrors({ interests: 'Please select at least 3 interests' });
      return false;
    }
    return true;
  };

  // Handle interest selection
  const toggleInterest = (category, interestId) => {
    setInterests(prev => ({
      ...prev,
      [category]: prev[category].includes(interestId)
        ? prev[category].filter(id => id !== interestId)
        : [...prev[category], interestId]
    }));
    // Clear interest error if any
    if (errors.interests) {
      setErrors(prev => ({ ...prev, interests: null }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (validateForm()) {
        if (isSignUp) {
          setStep(2);
        } else {
          // Handle login
          setIsLoading(true);
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            onLogin(formData);
          } catch (error) {
            setErrors({ general: 'Login failed. Please try again.' });
          } finally {
            setIsLoading(false);
          }
        }
      }
    } else if (step === 2) {
      if (validateInterests()) {
        // Handle registration with interests
        setIsLoading(true);
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          setSuccessMessage('Account created successfully! Redirecting...');
          setTimeout(() => {
            onRegister({ ...formData, interests });
          }, 2000);
        } catch (error) {
          setErrors({ general: 'Registration failed. Please try again.' });
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  // Get password strength color
  const getStrengthColor = () => {
    if (passwordStrength <= 2) return '#ef4444';
    if (passwordStrength <= 3) return '#f59e0b';
    if (passwordStrength <= 4) return '#3b82f6';
    return '#10b981';
  };

  // Get strength label
  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isOn ? 'linear-gradient(135deg, #1a1f2e 0%, #0f1422 100%)' : '#0a0c14',
      transition: 'background 0.6s ease'
    }}>
      {/* Lamp Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        padding: '40px 20px'
      }}>
        {/* Lamp Base */}
        <div style={{
          position: 'relative',
          marginBottom: '40px',
          cursor: 'pointer',
          transition: 'transform 0.3s ease'
        }} ref={lampRef}>
          {/* Lamp Cord */}
          <div style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '60px',
            background: 'linear-gradient(180deg, #4a5568 0%, #2d3748 100%)',
            borderRadius: '2px'
          }} />

          {/* Lamp Shade */}
          <div
            onClick={toggleLamp}
            style={{
              position: 'relative',
              width: '200px',
              height: '120px',
              margin: '0 auto',
              background: isOn 
                ? 'radial-gradient(circle at 30% 30%, #fbbf24, #d97706)'
                : 'linear-gradient(135deg, #2d3748, #1a202c)',
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
              boxShadow: isOn 
                ? '0 0 60px rgba(251, 191, 36, 0.6), inset 0 -10px 20px rgba(0,0,0,0.3)'
                : '0 10px 20px rgba(0,0,0,0.3), inset 0 -5px 10px rgba(0,0,0,0.5)',
              transition: 'all 0.4s ease',
              cursor: 'pointer',
              animation: isOn ? 'flicker 3s infinite' : 'none'
            }}
          >
            {/* Lamp Light Effect */}
            {isOn && (
              <div style={{
                position: 'absolute',
                bottom: '-100px',
                left: '-50%',
                right: '-50%',
                height: '200px',
                background: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
                filter: 'blur(20px)',
                pointerEvents: 'none',
                zIndex: -1
              }} />
            )}
          </div>

          {/* Lamp Base Stand */}
          <div style={{
            width: '80px',
            height: '20px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #4a5568, #2d3748)',
            borderRadius: '10px 10px 0 0',
            boxShadow: '0 5px 10px rgba(0,0,0,0.3)'
          }} />
        </div>

        {/* Login Form Container */}
        {showLogin && (
          <div style={{
            background: 'rgba(20, 25, 36, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 2px rgba(251, 191, 36, 0.1)',
            animation: 'slideUp 0.5s ease'
          }}>
            {/* Success Message */}
            {successMessage && (
              <div style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#10b981',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                zIndex: 1000
              }}>
                <Check size={20} />
                {successMessage}
              </div>
            )}

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px'
              }}>
                {step === 1 
                  ? (isSignUp ? 'Create Account' : 'Welcome Back')
                  : 'Select Your Interests'
                }
              </h2>
              <p style={{ color: '#94a3b8' }}>
                {step === 1 
                  ? (isSignUp ? 'Join the community' : 'Sign in to continue')
                  : 'Choose what matters to you'
                }
              </p>
            </div>

            {/* Step Indicator */}
            {isSignUp && step === 2 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>✓</div>
                <div style={{
                  width: '60px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #10b981, #fbbf24)'
                }} />
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  fontWeight: 'bold'
                }}>2</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                // Step 1: Credentials
                <>
                  {isSignUp && (
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Username
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => {
                          setFormData({ ...formData, username: e.target.value });
                          if (errors.username) setErrors({ ...errors, username: null });
                        }}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: `2px solid ${errors.username ? '#ef4444' : 'rgba(71, 85, 105, 0.5)'}`,
                          borderRadius: '12px',
                          color: '#e2e8f0',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        placeholder="the_coding_wizard"
                      />
                      {errors.username && (
                        <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
                          {errors.username}
                        </p>
                      )}
                    </div>
                  )}

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: `2px solid ${errors.email ? '#ef4444' : 'rgba(71, 85, 105, 0.5)'}`,
                        borderRadius: '12px',
                        color: '#e2e8f0',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                      placeholder="wizard@example.com"
                    />
                    {errors.email && (
                      <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        checkPasswordStrength(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: null });
                      }}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: `2px solid ${errors.password ? '#ef4444' : 'rgba(71, 85, 105, 0.5)'}`,
                        borderRadius: '12px',
                        color: '#e2e8f0',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                      placeholder="••••••••"
                    />
                    
                    {/* Password strength meter */}
                    {formData.password && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{
                          display: 'flex',
                          gap: '4px',
                          marginBottom: '4px'
                        }}>
                          {[1, 2, 3, 4, 5].map(i => (
                            <div
                              key={i}
                              style={{
                                flex: 1,
                                height: '4px',
                                borderRadius: '2px',
                                background: i <= passwordStrength ? getStrengthColor() : '#334155',
                                transition: 'background 0.3s ease'
                              }}
                            />
                          ))}
                        </div>
                        <p style={{
                          color: getStrengthColor(),
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          {getStrengthLabel()} password
                        </p>
                      </div>
                    )}
                    
                    {errors.password && (
                      <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {isSignUp && (
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData({ ...formData, confirmPassword: e.target.value });
                          if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                        }}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: `2px solid ${errors.confirmPassword ? '#ef4444' : 'rgba(71, 85, 105, 0.5)'}`,
                          borderRadius: '12px',
                          color: '#e2e8f0',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && (
                        <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}

                  {/* General error */}
                  {errors.general && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid #ef4444',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <AlertCircle size={16} color="#ef4444" />
                      <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{errors.general}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: isLoading 
                        ? 'rgba(251, 191, 36, 0.5)' 
                        : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '1rem',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid rgba(0,0,0,0.3)',
                          borderTopColor: '#000',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Processing...
                      </>
                    ) : (
                      <>
                        {isSignUp ? 'Continue' : 'Sign In'} <ArrowRight size={20} />
                      </>
                    )}
                  </button>

                  <p style={{ textAlign: 'center', marginTop: '20px', color: '#94a3b8' }}>
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setErrors({});
                        setStep(1);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fbbf24',
                        cursor: 'pointer',
                        fontWeight: '600',
                        textDecoration: 'underline'
                      }}
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </>
              ) : (
                // Step 2: Interests Selection
                <>
                  {/* Interests Grid */}
                  {['mind', 'body', 'soul'].map(category => (
                    <div key={category} style={{ marginBottom: '24px' }}>
                      <h3 style={{
                        color: '#e2e8f0',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textTransform: 'capitalize'
                      }}>
                        {category === 'mind' && <Brain size={20} color="#3b82f6" />}
                        {category === 'body' && <Dumbbell size={20} color="#10b981" />}
                        {category === 'soul' && <Heart size={20} color="#a855f7" />}
                        {category} Interests
                      </h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                        gap: '8px'
                      }}>
                        {interestOptions[category].map(interest => {
                          const Icon = interest.icon;
                          const isSelected = interests[category].includes(interest.id);
                          return (
                            <button
                              key={interest.id}
                              type="button"
                              onClick={() => toggleInterest(category, interest.id)}
                              style={{
                                padding: '12px',
                                background: isSelected 
                                  ? `rgba(${parseInt(interest.color.slice(1,3), 16)}, ${parseInt(interest.color.slice(3,5), 16)}, ${parseInt(interest.color.slice(5,7), 16)}, 0.2)`
                                  : 'rgba(30, 41, 59, 0.6)',
                                border: isSelected 
                                  ? `2px solid ${interest.color}`
                                  : '1px solid rgba(71, 85, 105, 0.3)',
                                borderRadius: '10px',
                                color: isSelected ? interest.color : '#94a3b8',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Icon size={20} />
                              <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>
                                {interest.label}
                              </span>
                              {isSelected && <Check size={12} style={{ marginTop: '2px' }} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Interest error */}
                  {errors.interests && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid #ef4444',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <AlertCircle size={16} color="#ef4444" />
                      <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{errors.interests}</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        flex: 1,
                        padding: '14px',
                        background: 'rgba(30, 41, 59, 0.8)',
                        color: '#94a3b8',
                        border: '1px solid rgba(71, 85, 105, 0.5)',
                        borderRadius: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        flex: 2,
                        padding: '14px',
                        background: isLoading 
                          ? 'rgba(16, 185, 129, 0.5)'
                          : 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '700',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {isLoading ? (
                        <>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: '#fff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }} />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes flicker {
          0% { opacity: 1; }
          5% { opacity: 0.8; }
          10% { opacity: 1; }
          15% { opacity: 0.9; }
          20% { opacity: 1; }
          50% { opacity: 1; }
          55% { opacity: 0.95; }
          60% { opacity: 1; }
          100% { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LampLogin;