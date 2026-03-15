// Password strength checker
export const checkPasswordStrength = (password) => {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const strength = Object.values(criteria).filter(Boolean).length;
  
  let message = '';
  if (strength <= 2) message = 'Weak password';
  else if (strength <= 4) message = 'Medium password';
  else message = 'Strong password';
  
  return {
    strength,
    message,
    criteria,
    isValid: strength >= 3 // Require at least medium strength
  };
};

// Generate strong password suggestion
export const generateStrongPassword = () => {
  const length = 12;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  
  let password = '';
  
  // Ensure at least one of each
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest randomly
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

// Store user data securely
export const saveUserData = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const getUserData = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const updateUserProfile = (updates) => {
  const user = getUserData();
  if (user) {
    Object.assign(user, updates);
    saveUserData(user);
    return true;
  }
  return false;
};