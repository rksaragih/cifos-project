// Minimal mock auth utilities
export interface AuthResult {
  success: boolean;
  message?: string;
  token?: string;
}

const FAKE_DB_KEY = 'yummi:users';

const readUsers = (): Array<{ email: string; password: string; fullName?: string }> => {
  try {
    const raw = localStorage.getItem(FAKE_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const findUserByEmail = (email: string) => {
  const users = readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
};

export const findUserByIdentifier = (identifier: string) => {
  const users = readUsers();
  const norm = identifier.toLowerCase();
  return users.find((u) => {
    if (!u || !u.email) return false;
    // match case-insensitive email or exact phone (if stored as numeric string)
    return u.email.toLowerCase() === norm || u.email === identifier;
  }) || null;
};

const writeUsers = (users: Array<{ email: string; password: string; fullName?: string }>) => {
  localStorage.setItem(FAKE_DB_KEY, JSON.stringify(users));
};

export const register = async (fullName: string, email: string, password: string): Promise<AuthResult> => {
  // Simulate network
  await new Promise((r) => setTimeout(r, 500));
  const users = readUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return { success: false, message: 'User already exists' };
  users.push({ email, password, fullName });
  writeUsers(users);
  const token = `fake-jwt-${Date.now()}`;
  localStorage.setItem('yummi:token', token);
  // store a basic user profile for the demo
  const user = { name: fullName, email, provider: 'email' };
  localStorage.setItem('user', JSON.stringify(user));
  return { success: true, token };
};

export const login = async (identifier: string, password: string): Promise<AuthResult> => {
  await new Promise((r) => setTimeout(r, 400));
  const users = readUsers();
  const norm = identifier.toLowerCase();
  const user = users.find((u) => {
    if (!u) return false;
    const matchesIdentifier = (u.email && (u.email.toLowerCase() === norm || u.email === identifier));
    return matchesIdentifier && u.password === password;
  });
  if (!user) return { success: false, message: 'Invalid credentials' };
  const token = `fake-jwt-${Date.now()}`;
  localStorage.setItem('yummi:token', token);
  // set a basic user profile (if not exists, create minimal)
  const existingUser = localStorage.getItem('user');
  if (!existingUser) {
    const profile = { name: identifier.split('@')[0], email: identifier, provider: 'email' };
    localStorage.setItem('user', JSON.stringify(profile));
  }
  return { success: true, token };
};

export const logout = () => {
  localStorage.removeItem('yummi:token');
};

export const isAuthenticated = () => Boolean(localStorage.getItem('yummi:token'));

export const getUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
