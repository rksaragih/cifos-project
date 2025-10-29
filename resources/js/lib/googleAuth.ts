// Google OAuth configuration and utilities
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}

// Google OAuth configuration
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id';

// Initialize Google Identity Services
export const initializeGoogleAuth = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: () => {}, // Will be set by individual components
        });
        resolve();
      } else {
        reject(new Error('Google Identity Services failed to load'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Identity Services'));
    };
    
    document.head.appendChild(script);
  });
};

// Decode JWT token to get user info
export const decodeGoogleToken = (credential: string): GoogleUser | null => {
  try {
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      given_name: payload.given_name,
      family_name: payload.family_name,
    };
  } catch (error) {
    console.error('Error decoding Google token:', error);
    return null;
  }
};

// Handle Google login
export const handleGoogleLogin = async (): Promise<GoogleUser | null> => {
  try {
    await initializeGoogleAuth();
    
    return new Promise((resolve, reject) => {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error('Google login was cancelled or not displayed'));
        }
      });
      
      // Set up the callback
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: GoogleAuthResponse) => {
          const user = decodeGoogleToken(response.credential);
          resolve(user);
        },
      });
    });
  } catch (error) {
    console.error('Google login error:', error);
    return null;
  }
};

// Handle Google register (same as login for OAuth)
export const handleGoogleRegister = async (): Promise<GoogleUser | null> => {
  return handleGoogleLogin();
};

// Sign out from Google
export const signOutGoogle = () => {
  if (window.google) {
    window.google.accounts.id.disableAutoSelect();
  }
};

// Declare global Google types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}


