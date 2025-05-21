
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { users } from '../data/mockData';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a user in local storage
    const storedUser = localStorage.getItem('wanderlust_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, we're using a simplified login
    // In a real app, this would make an API call to validate credentials
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const foundUser = users.find((u) => u.email === email);
      
      if (foundUser && password === 'password') {  // Demo password is 'password'
        setUser(foundUser);
        localStorage.setItem('wanderlust_user', JSON.stringify(foundUser));
        toast({
          title: 'Login successful',
          description: `Welcome back, ${foundUser.name}!`,
        });
      } else {
        throw new Error('Invalid login credentials');
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wanderlust_user');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
