// Currency configuration based on user location
export const currencies = {
  US: { symbol: '$', code: 'USD', name: 'US Dollar' },
  ZA: { symbol: 'R', code: 'ZAR', name: 'South African Rand' }
};

// Default to US if location can't be determined
export const getCurrencyForLocation = (countryCode = 'US') => {
  return currencies[countryCode] || currencies.US;
};

// Format amount with currency
export const formatCurrency = (amount, currency = currencies.US) => {
  return `${currency.symbol}${amount.toLocaleString()}`;
};

// You can detect user's location via browser or IP
export const detectUserCountry = async () => {
  try {
    // Option 1: Use browser language
    const language = navigator.language;
    if (language.includes('en-ZA')) return 'ZA';
    
    // Option 2: Use timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Africa/Johannesburg')) return 'ZA';
    
    // Option 3: Use IP geolocation API
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code === 'ZA' ? 'ZA' : 'US';
  } catch (error) {
    console.error('Error detecting country:', error);
    return 'US'; // Default to US
  }
};