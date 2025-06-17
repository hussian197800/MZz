// Format date to a human-readable string
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

// Format time to a human-readable string
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Format relative time (e.g., "in 2 hours", "3 days ago")
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);
  
  // If the appointment is in the past
  if (diffInSeconds < 0) {
    const absDiff = Math.abs(diffInSeconds);
    
    if (absDiff < 60) return 'just now';
    if (absDiff < 3600) return `${Math.floor(absDiff / 60)} minutes ago`;
    if (absDiff < 86400) return `${Math.floor(absDiff / 3600)} hours ago`;
    if (absDiff < 604800) return `${Math.floor(absDiff / 86400)} days ago`;
    return formatDate(dateObj);
  }
  
  // If the appointment is in the future
  if (diffInSeconds < 60) return 'in less than a minute';
  if (diffInSeconds < 3600) return `in ${Math.floor(diffInSeconds / 60)} minutes`;
  if (diffInSeconds < 86400) return `in ${Math.floor(diffInSeconds / 3600)} hours`;
  if (diffInSeconds < 604800) return `in ${Math.floor(diffInSeconds / 86400)} days`;
  return formatDate(dateObj);
};

// Get a readable string representation of a date and time
export const getReadableDateTime = (date: Date | string): string => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};