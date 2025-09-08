"use client";

import { ReactNode, useEffect, useState, createContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/config";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

// Default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}