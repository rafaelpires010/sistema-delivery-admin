import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { api } from '../lib/useApi';
import { User } from '@/types/restaurant';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signOut: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('@deliveryapp-manager:token');
        const storagedUser = Cookies.get('@deliveryapp-manager:user');

        if (token && storagedUser) {
            try {
                setUser(JSON.parse(storagedUser));
            } catch (e) {
                console.error("Failed to parse user from cookie", e);
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const signIn = async (email: string, pass: string) => {
        try {
            const response = await api.login(email, pass);
            const { token, user } = response;

            Cookies.set('@deliveryapp-manager:token', token, { expires: 1 });
            Cookies.set('@deliveryapp-manager:user', JSON.stringify(user), { expires: 1 });

            setUser(user);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const signOut = () => {
        Cookies.remove('@deliveryapp-manager:user');
        Cookies.remove('@deliveryapp-manager:token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 