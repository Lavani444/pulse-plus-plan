// Valid timeline formats
export const validTimelineFormats = [
  { value: 'days', label: 'Days', regex: /^\d+\s*(day|days)$/i },
  { value: 'weeks', label: 'Weeks', regex: /^\d+\s*(week|weeks)$/i },
  { value: 'months', label: 'Months', regex: /^\d+\s*(month|months)$/i },
  { value: 'years', label: 'Years', regex: /^\d+\s*(year|years)$/i }
];

export const validateTimeline = (timeline) => {
  // Check if timeline matches any valid format
  const isValid = validTimelineFormats.some(format => format.regex.test(timeline));
  
  if (!isValid) {
    return {
      valid: false,
      message: 'Please use proper format: e.g., "6 months", "2 weeks", "1 year"'
    };
  }
  
  return { valid: true, message: '' };
};

// Parse timeline to get number and unit
export const parseTimeline = (timeline) => {
  const match = timeline.match(/^(\d+)\s*(day|days|week|weeks|month|months|year|years)$/i);
  if (match) {
    return {
      number: parseInt(match[1]),
      unit: match[2].toLowerCase()
    };
  }
  return null;
};