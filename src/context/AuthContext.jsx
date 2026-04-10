import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  const handleLogin = async (email) => {
    const mockUser = { email, role: 'user', name: 'Client' };
    setUser(mockUser);
    return { success: true, data: mockUser };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login: handleLogin, 
      logout: handleLogout, 
      isAuthenticated: !!user, 
      loading: false 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
