// Date utility functions

/**
 * Format date to "dd/mm/yyyy hh:mm" format
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Format date to "dd/mm/yyyy" format
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDateOnly = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Check if a date is today
 * @param {string|Date} dateString - Date string or Date object
 * @returns {boolean} True if date is today
 */
export const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};
