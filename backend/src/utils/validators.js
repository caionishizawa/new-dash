export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

export function validateTransactionType(type) {
  const validTypes = ['buy', 'sell', 'yield', 'fee', 'deposit', 'withdrawal'];
  return validTypes.includes(type);
}

export function validateAsset(asset) {
  return asset && typeof asset === 'string' && asset.length > 0;
}

export function validateNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

export default {
  validateEmail,
  validatePassword,
  validateDate,
  validateTransactionType,
  validateAsset,
  validateNumber,
  sanitizeString
};
