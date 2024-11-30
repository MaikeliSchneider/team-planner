import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";
import { decode } from "jsonwebtoken";

type User = {
  name: string;
  email: string;
};

type AuthContextProps = {
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  user: User | null;
};

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Attempt to load the token from storage on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      const user = decode(token) as User;

      console.log("🚀 ~ useEffect ~ user => ", user);

      setAccessToken(token);
      setUser(user);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await axios.post("/api/auth/login", { email, password });
    const { accessToken, refreshToken } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setAccessToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
  }, []);

  const refresh = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) return logout();

    const response = await axios.patch("/api/auth", { refreshToken });
    const { accessToken: newAccessToken } = response.data;

    localStorage.setItem("accessToken", newAccessToken);
    setAccessToken(newAccessToken);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        logout,
        refresh,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
