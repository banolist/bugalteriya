import { createContext, use, useState } from "react";

// interface UserToken {
//   access: string;
//   refresh: string;
// }
export interface AuthProviderData {
  sessionId: string | null;
  user: any | null;
  isAuthenticated: boolean;
  loginWithSessionID(input: string): Promise<void>;
  logout(): Promise<void>;
}

export const AuthContext = createContext<AuthProviderData>(
  {} as AuthProviderData
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sessionID, setSessionID] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!sessionID);

  return (
    <AuthContext.Provider
      value={{
        sessionId: sessionID,
        user,
        isAuthenticated,
        async loginWithSessionID(input: string) {
          setSessionID(input);
          setIsAuthenticated(true);
        },
        async logout() {
          setSessionID(null);
          setUser(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => use(AuthContext);
