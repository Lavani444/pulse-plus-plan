import React, { useState } from 'react';
import { checkPasswordStrength, generateStrongPassword } from '../services/authService';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [name, setName] = useState('');

  // Demo user (in production, this would be on your backend)
  const validUsers = [
    { email: 'chaukelavani@gmail.com', password: 'Test@123', name: 'John Doe' }
  ];

  const handleSignIn = (e) => {
    e.preventDefault();
    
    const user = validUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify({ 
        email: user.email, 
        name: user.name 
      }));
      onLogin({ email: user.email, name: user.name });
    } else {
      setError('Invalid email or password');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    
    const strength = checkPasswordStrength(password);
    if (!strength.isValid) {
      setError('Please use a stronger password');
      return;
    }
    
    // In production, send to backend
    alert('Account created! Please sign in.');
    setShowSignUp(false);
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">
          {showSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-center text-gray-600">
          {showSignUp ? 'Sign up to start your journey' : 'Sign in to continue your journey'}
        </p>
        
        <form className="mt-8 space-y-6" onSubmit={showSignUp ? handleSignUp : handleSignIn}>
          {showSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            
            {passwordStrength && (
              <div className="mt-2">
                <div className="h-2 flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div
                      key={i}
                      className={`flex-1 h-full rounded ${
                        i <= passwordStrength.strength 
                          ? passwordStrength.strength <= 2 ? 'bg-red-500'
                            : passwordStrength.strength <= 4 ? 'bg-yellow-500'
                            : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-sm mt-1 ${
                  passwordStrength.strength <= 2 ? 'text-red-600'
                    : passwordStrength.strength <= 4 ? 'text-yellow-600'
                    : 'text-green-600'
                }`}>
                  {passwordStrength.message}
                </p>
              </div>
            )}
            
            {showSignUp && passwordStrength && passwordStrength.strength <= 2 && (
              <button
                type="button"
                onClick={() => setPassword(generateStrongPassword())}
                className="text-sm text-blue-600 hover:text-blue-800 mt-2"
              >
                Suggest strong password
              </button>
            )}
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            {showSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center text-sm">
          {showSignUp ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setShowSignUp(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setShowSignUp(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;