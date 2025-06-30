// --- VALIDATION ---
export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) =>
  password.length >= 8 &&
  /[a-z]/.test(password) &&
  /[A-Z]/.test(password) &&
  /\d/.test(password);

export const validateUsername = (username) =>
  /^[a-zA-Z0-9_]{3,20}$/.test(username);

export const validateOTP = (otp) =>
  /^[0-9]{6}$/.test(otp);

// --- SANITIZATION ---
export const sanitizeInput = (value) =>
  value.replace(/[<>/"']/g, "").trim();

export const sanitizeEmail = (email) =>
  email.trim().toLowerCase();

export const sanitizeUsername = (username) =>
  username.replace(/[^a-zA-Z0-9_]/g, "").trim();

export const sanitizePassword = (password) =>
  password.trim(); // Don't remove chars; just trim
